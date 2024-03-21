import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProjectModel } from '../../project/entities/project.entity';

@Entity({ name: 'project_right' })
export class RightsModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isCanDownload: boolean;

  @Column()
  isCanUpload: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => ProjectModel)
  project: ProjectModel;
}
