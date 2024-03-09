import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { FileModel } from './entities/file.entity';
import { ProjectModel } from './entities/project.entity';
import * as fs from 'fs';
import { ProjectCreateDto } from './dto/project.create.dto';
import { extname } from 'path';
import { FileCreateDto } from './dto/file.create.dto';
import { VersionModel } from './entities/version.entity';
import { FindOptionsSelect, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { RightsModel } from './entities/rights.entity';

@Injectable()
export class ProjectService {
  private selectAuthorOptions: FindOptionsSelect<User> = {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
  };

  constructor(
    @Inject('PROJECT_REPO') private projectRepository: Repository<ProjectModel>,
    @Inject('VERSION_REPO') private versionRepository: Repository<VersionModel>,
    @Inject('FILE_REPO') private fileRepository: Repository<FileModel>,
    @Inject('RIGHTS_REPO') private rightsRepository: Repository<RightsModel>,
  ) {}

  async createProject(dto: ProjectCreateDto, author: User) {
    const project = await this.projectRepository.save({
      ...dto,
      createdBy: author,
    });

    await this.rightsRepository.save({
      project,
      user: author,
      isCanDownload: true,
      isCanUpload: true,
    });

    return project;
  }

  async getProjectInfo(id: string) {
    const project = await this.projectRepository.findOne({
      where: { id: parseInt(id) },
      select: {
        createdBy: this.selectAuthorOptions,
      },
      relations: {
        createdBy: true,
      },
    });

    if (!project)
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);

    const version = await this.versionRepository.findOne({
      where: { project: { id: project.id } },
      order: {
        createdAt: 'DESC',
      },
      select: {
        createdBy: this.selectAuthorOptions,
      },
      relations: {
        files: true,
        createdBy: true,
      },
    });

    return {
      ...project,
      version,
    };
  }

  async createNewVersion(
    projectId: string,
    version: string,
    files: {
      firmware: Express.Multer.File[];
      bootloader: Express.Multer.File[];
      partition_table: Express.Multer.File[];
    },
    author: User,
  ) {
    const project = await this.projectRepository.findOne({
      where: { id: parseInt(projectId) },
      relations: { versions: true },
    });

    if (!project)
      throw new HttpException(
        'Project not found. Please create the project before upload files',
        HttpStatus.BAD_REQUEST,
      );

    const rights = await this.rightsRepository.findOne({
      where: { project: { id: project.id }, user: { id: author.id } },
    });

    if (!rights || !rights.isCanUpload)
      throw new HttpException(
        'You have acces to upload new version for this project',
        HttpStatus.FORBIDDEN,
      );

    if (project.versions.filter((v) => v.version === version).length > 0)
      throw new HttpException(
        'This version already exist',
        HttpStatus.BAD_REQUEST,
      );

    const path = `./files/projects/${projectId}/${version}`;
    fs.mkdirSync(path, { recursive: true });

    const flatFiles = Object.values(files).flat();
    const dbFiles = await this.saveFilesToDisk(flatFiles, path);

    const ver = await this.versionRepository.save({
      version,
      project: project,
      createdBy: author,
    });

    await this.fileRepository.save(
      dbFiles.map((file) => ({ ...file, version: ver })),
    );

    return {
      version: ver.version,
      id: ver.id,
      files: dbFiles,
    };
  }

  async getHistory(projectId: string) {
    return this.versionRepository.find({
      where: { project: { id: parseInt(projectId) } },
      select: {
        createdBy: this.selectAuthorOptions,
      },
      order: {
        createdAt: 'DESC',
      },
      relations: {
        files: true,
        createdBy: true,
      },
    });
  }

  async getFileStream(fileId: string, user: User) {
    const dbFile = await this.fileRepository.findOne({
      where: { id: parseInt(fileId) },
      relations: {
        version: { project: true },
      },
    });

    const rights = await this.rightsRepository.findOne({
      where: {
        project: { id: dbFile.version.project.id },
        user: { id: user.id },
      },
    });

    if (!rights || !rights.isCanDownload)
      throw new HttpException(
        'You have acces to download files from this project',
        HttpStatus.FORBIDDEN,
      );

    if (!dbFile)
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);

    return { stream: fs.createReadStream(dbFile.path), file: dbFile };
  }

  private async saveFilesToDisk(files: Array<FileCreateDto>, path: string) {
    const promises = files.map((file) => {
      const ext = extname(file.originalname);
      const filePath = `${path}/${file.fieldname}${ext}`;
      file.path = filePath;
      file.filename = `${file.fieldname}${ext}`;
      return fs.promises.writeFile(filePath, file.buffer);
    });

    await Promise.all(promises);

    return files.map((file) => {
      delete file.buffer;
      return file;
    });
  }
}
