import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ProjectModel } from './entities/project.entity';
import * as fs from 'fs';
import { ProjectCreateDto } from './dto/project.create.dto';
import { VersionModel } from './entities/version.entity';
import { FindOptionsSelect, In, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { RightsService } from 'src/rights/rights.service';
import { FilesService } from 'src/files/files.service';
import { RightsCreateDto } from 'src/rights/dto/rights.create.dto';
import { UsersService } from 'src/users/users.service';

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
    private filesService: FilesService,
    private rightsService: RightsService,
    private usersService: UsersService,
  ) {}

  async createProject(dto: ProjectCreateDto, author: User) {
    const project = await this.projectRepository.save({
      ...dto,
      createdBy: author,
    });

    await this.rightsService.createRights({
      project,
      user: author,
      isCanDownload: true,
      isCanUpload: true,
    });

    return project;
  }

  async getProjectInfo(id: number) {
    const project = await this.projectRepository.findOne({
      where: { id: id },
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

  async getAllProjects(user: User) {
    const projectIds = await this.rightsService.getAllProjectsForUser(user);

    const projects = await this.projectRepository.find({
      where: {
        id: In(Array.from(new Set(projectIds)).map((r) => r.project.id)),
      },
      select: {
        createdBy: this.selectAuthorOptions,
      },
      relations: {
        createdBy: true,
      },
    });

    return projects;
  }

  async createNewVersion(
    projectId: number,
    version: string,
    files: {
      firmware: Express.Multer.File[];
      bootloader: Express.Multer.File[];
      partition_table: Express.Multer.File[];
    },
    author: User,
  ) {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: { versions: true },
    });

    if (!project)
      throw new HttpException(
        'Project not found. Please create the project before upload files',
        HttpStatus.BAD_REQUEST,
      );

    const rights = await this.rightsService.getProjectRightsForUser(
      projectId,
      author,
    );

    if (!rights || !rights.isCanUpload)
      throw new HttpException(
        "You haven't acces to upload new version for this project",
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
    const dbFiles = await this.filesService.saveFilesToDisk(flatFiles, path);

    const ver: VersionModel = await this.versionRepository.save({
      version,
      project: project,
      createdBy: author,
    });

    await this.filesService.createFiles(
      ...dbFiles.map((file) => ({ ...file, version: ver })),
    );

    return {
      version: ver.version,
      id: ver.id,
      files: dbFiles,
    };
  }

  async getHistory(projectId: number) {
    return this.versionRepository.find({
      where: { project: { id: projectId } },
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

  async getProjectRights(projectId: number, user: User) {
    return this.rightsService.getProjectRightsForUser(projectId, user);
  }

  async getParticipants(projectId: number) {
    return this.rightsService.getAllProjectRights(projectId);
  }

  async getFileStream(fileId: number, user: User) {
    const dbFile = await this.filesService.getFileWithProject(fileId);

    if (!dbFile)
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);

    const rights = await this.rightsService.getProjectRightsForUser(
      dbFile.version.project.id,
      user,
    );

    if (!rights || !rights.isCanDownload)
      throw new HttpException(
        "You haven't acces to download files from this project",
        HttpStatus.FORBIDDEN,
      );

    return { stream: fs.createReadStream(dbFile.path), file: dbFile };
  }

  async grantAccesToProject(
    projectId: number,
    user: User,
    dto: RightsCreateDto,
  ) {
    const rights = await this.rightsService.getProjectRightsForUser(
      projectId,
      user,
    );

    if (!rights)
      throw new HttpException(
        "You haven't acces to edit rights for this project",
        HttpStatus.UNAUTHORIZED,
      );

    const newParticipant = await this.usersService.findById(dto.user.id);

    if (!newParticipant)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const rights_for_new_p = await this.rightsService.getProjectRightsForUser(
      projectId,
      newParticipant,
    );

    if (rights_for_new_p)
      throw new HttpException('Acces already granted', HttpStatus.BAD_REQUEST);

    return this.rightsService.createRights({
      ...dto,
      project: { id: projectId },
    });
  }

  async removeAcces(projectId: number, rightsId: number, user: User) {
    const rights = await this.rightsService.getProjectRightsForUser(
      projectId,
      user,
    );

    if (!rights)
      throw new HttpException(
        "You haven't acces to edit rights for this project",
        HttpStatus.UNAUTHORIZED,
      );

    const rights_to_remove = await this.rightsService.getRightsById(rightsId);

    if (!rights_to_remove)
      throw new HttpException(
        'Rights not found or already removed',
        HttpStatus.NOT_FOUND,
      );

    return this.rightsService.removeRights(rightsId);
  }
}
