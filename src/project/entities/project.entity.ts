import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VersionModel } from './version.entity';
import { User } from 'src/users/entities/user.entity';

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
}
