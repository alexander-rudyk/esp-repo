import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectModel } from './project.entity';

export enum ProjectVisibility {
  'Private' = 'PRIVATE',
  'Public' = 'PUBLIC',
}

@Entity({ name: 'project_settings' })
export class ProjectSettingsModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    enum: ProjectVisibility,
    nullable: false,
    default: ProjectVisibility.Private,
  })
  visibility: ProjectVisibility;

  @OneToOne(() => ProjectModel)
  @JoinColumn()
  project: ProjectModel;
}
