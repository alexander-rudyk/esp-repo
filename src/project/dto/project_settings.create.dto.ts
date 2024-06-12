import { ProjectModel } from '../entities/project.entity';
import { ProjectVisibility } from '../entities/settings.entity';

export class ProjectSettingsCreateDto {
  visibility: ProjectVisibility;

  project: Pick<ProjectModel, 'id'>;
}
