import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { FileModel } from './entities/file.entity';
import { FileCreateDto } from './dto/file.create.dto';
import { extname } from 'path';
import * as fs from 'fs';

@Injectable()
export class FilesService {
  constructor(
    @Inject('FILE_REPO') private fileRepository: Repository<FileModel>,
  ) {}

  createFiles(...files: FileCreateDto[]) {
    return this.fileRepository.save(files);
  }

  getFileWithProject(id: number) {
    return this.fileRepository.findOne({
      where: { id },
      relations: {
        version: { project: true },
      },
    });
  }

  async saveFilesToDisk(files: Array<FileCreateDto>, path: string) {
    const promises = files.map((file) => {
      const ext = extname(file.originalname);
      const filePath = `${path}/${file.fieldname}${ext}`;
      file.path = filePath;
      file.filename = `${file.fieldname}${ext}`;
      return fs.promises.writeFile(filePath, file.buffer);
    });

    await Promise.all(promises);

    return files.map((file) => {
      delete file.buffer;
      return file;
    });
  }
}
