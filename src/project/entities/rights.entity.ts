import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectModel } from './project.entity';

@Entity({ name: 'project_right' })
export class RightsModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isCanDownload: boolean;

  @Column()
  isCanUpload: boolean;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => ProjectModel)
  project: ProjectModel;
}
