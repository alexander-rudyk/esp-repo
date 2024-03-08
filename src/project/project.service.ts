import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { FileModel } from './entities/file.entity';
import { ProjectModel } from './entities/project.entity';
import * as fs from 'fs';
import { ProjectCreateDto } from './dto/project.create.dto';
import { extname } from 'path';
import { FileCreateDto } from './dto/file.create.dto';
import { VersionModel } from './entities/version.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectService {
  constructor(
    @Inject('PROJECT_REPO') private projectRepository: Repository<ProjectModel>,
    @Inject('VERSION_REPO') private versionRepository: Repository<VersionModel>,
    @Inject('FILE_REPO') private fileRepository: Repository<FileModel>,
  ) {}

  async createProject(dto: ProjectCreateDto) {
    return this.projectRepository.save({ ...dto });
  }

  async getProjectInfo(id: string) {
    const project = await this.projectRepository.findOne({
      where: { id: parseInt(id) },
    });

    if (!project)
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);

    const version = await this.versionRepository.findOne({
      where: { project: { id: project.id } },
      order: {
        createdAt: 'DESC',
      },
      relations: {
        files: true,
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
      order: {
        createdAt: 'DESC',
      },
      relations: {
        files: true,
      },
    });
  }

  async getFileStream(fileId: string) {
    const dbFile = await this.fileRepository.findOne({
      where: { id: parseInt(fileId) },
    });

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
