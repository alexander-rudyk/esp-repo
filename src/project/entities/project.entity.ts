import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VersionModel } from './version.entity';
import { User } from 'src/users/entities/user.entity';
import { ProjectSettingsModel } from './settings.entity';

@Entity({ name: 'project' })
export class ProjectModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: true,
  })
  git_ref: string;

  @Column({
    nullable: true,
  })
  description?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  createdBy: User;

  @OneToMany(() => VersionModel, (version) => version.project)
  versions: VersionModel[];

  @OneToOne(() => ProjectSettingsModel, (settings) => settings.project)
  settings: ProjectSettingsModel;
}
