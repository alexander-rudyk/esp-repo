import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  StreamableFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express/multer';
import { ProjectCreateDto } from './dto/project.create.dto';
import type { Response } from 'express';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  createProject(@Body() dto: ProjectCreateDto) {
    return this.projectService.createProject(dto);
  }

  @Post(':id/upload')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'firmware', maxCount: 1 },
      { name: 'bootloader', maxCount: 1 },
      { name: 'partition_table', maxCount: 1 },
    ]),
  )
  async createNewVersion(
    @Param('id') id: string,
    @Body() body: { version: string | null },
    @UploadedFiles()
    files: {
      firmware: Express.Multer.File[];
      bootloader: Express.Multer.File[];
      partition_table: Express.Multer.File[];
    },
  ) {
    console.log(files.firmware);
    return this.projectService.createNewVersion(id, body.version, files);
  }

  @Get('info/:id')
  getInfo(@Param('id') id: string) {
    return this.projectService.getProjectInfo(id);
  }

  @Get('history/:id')
  getHistory(@Param('id') id: string) {
    return this.projectService.getHistory(id);
  }

  @Get('file/:id/download')
  async downloadProjectFile(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const { stream, file } = await this.projectService.getFileStream(id);

    res.set({
      'Content-Type': file.mimetype,
      'Content-Disposition': `attachment; filename="${file.filename}"`,
    });

    return new StreamableFile(stream);
  }
}
