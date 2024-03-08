import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VersionModel } from './version.entity';

@Entity({ name: 'file' })
export class FileModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  size: number;

  @Column()
  path: string;

  @Column()
  mimetype: string;

  @ManyToOne(() => VersionModel, (version) => version.files)
  version: VersionModel;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
