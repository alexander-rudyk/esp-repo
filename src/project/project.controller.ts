import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  Res,
  StreamableFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express/multer';
import { ProjectCreateDto } from './dto/project.create.dto';
import type { Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(AuthGuard)
  @Post()
  createProject(@Request() req, @Body() dto: ProjectCreateDto) {
    return this.projectService.createProject(dto, req.user);
  }

  @UseGuards(AuthGuard)
  @Post(':id/upload')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'firmware', maxCount: 1 },
      { name: 'bootloader', maxCount: 1 },
      { name: 'partition_table', maxCount: 1 },
    ]),
  )
  async createNewVersion(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { version: string | null },
    @UploadedFiles()
    files: {
      firmware: Express.Multer.File[];
      bootloader: Express.Multer.File[];
      partition_table: Express.Multer.File[];
    },
  ) {
    return this.projectService.createNewVersion(
      id,
      body.version,
      files,
      req.user,
    );
  }

  @UseGuards(AuthGuard)
  @Get('info/:id')
  getInfo(@Param('id') id: string) {
    return this.projectService.getProjectInfo(id);
  }

  @UseGuards(AuthGuard)
  @Get('history/:id')
  getHistory(@Param('id') id: string) {
    return this.projectService.getHistory(id);
  }

  @UseGuards(AuthGuard)
  @Get('file/:id/download')
  async downloadProjectFile(
    @Request() req,
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const { stream, file } = await this.projectService.getFileStream(
      id,
      req.user,
    );

    res.set({
      'Content-Type': file.mimetype,
      'Content-Disposition': `attachment; filename="${file.filename}"`,
    });

    return new StreamableFile(stream);
  }
}
