import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProjectSettingsModel } from '../entities/settings.entity';
import { ProjectSettingsCreateDto } from '../dto/project_settings.create.dto';
import { ProjectModel } from '../entities/project.entity';
import { ProjectSettingsUpdateDto } from '../dto/project_settings.update.dto';

@Injectable()
export class ProjectSettingsService {
  constructor(
    @Inject('SETTINGS_REPO')
    private settingsRepository: Repository<ProjectSettingsModel>,
  ) {}

  async createProjectSettings(dto: ProjectSettingsCreateDto) {
    return this.settingsRepository.save({
      ...dto,
    });
  }

  async getSettingsForProject(project: Pick<ProjectModel, 'id'>) {
    return this.settingsRepository.findOne({ where: { project } });
  }

  async updateProjectSettings(id: number, dto: ProjectSettingsUpdateDto) {
    return this.settingsRepository.update({ project: { id } }, dto);
  }
}
