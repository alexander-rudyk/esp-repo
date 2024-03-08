import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FileModel } from './file.entity';
import { ProjectModel } from './project.entity';

@Entity({ name: 'version' })
export class VersionModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  version: string;

  @Column({
    nullable: true,
  })
  changelog?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => FileModel, (file) => file.version)
  files: FileModel[];

  @ManyToOne(() => ProjectModel, (project) => project.versions)
  project: ProjectModel;
}
