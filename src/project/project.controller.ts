import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Request,
  Res,
  StreamableFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProjectService } from './services/project.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express/multer';
import {
  ProjectCreateDto,
  ProjectCreateResponse,
} from './dto/project.create.dto';
import type { Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { RightsCreateDto } from 'src/rights/dto/rights.create.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProjectSettingsService } from './services/settings.service';
import { ProjectSettingsUpdateDto } from './dto/project_settings.update.dto';

@ApiBearerAuth()
@ApiTags('projects')
@Controller('projects')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly settingsService: ProjectSettingsService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiResponse({ status: HttpStatus.CREATED })
  createProject(
    @Request() req,
    @Body() dto: ProjectCreateDto,
  ): Promise<ProjectCreateResponse> {
    return this.projectService.createProject(dto, req.user);
  }

  @UseGuards(AuthGuard)
  @Put(':id/settings')
  async updateProjectSettings(
    @Param('id') id: number,
    @Body() dto: ProjectSettingsUpdateDto,
  ) {
    await this.settingsService.updateProjectSettings(id, dto);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getUserProjects(@Request() req) {
    return this.projectService.getAllProjects(req.user);
  }

  @Get('/public')
  async getPublicProjects(@Query() query) {
    const { userId } = query;
    return this.projectService.getAllPublicProject(
      userId ? { id: userId } : null,
    );
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
    @Param('id') id: number,
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
  @Get(':id/info')
  getInfo(@Param('id') id: number) {
    return this.projectService.getProjectInfo(id);
  }

  @UseGuards(AuthGuard)
  @Get(':id/history')
  getHistory(@Param('id') id: number) {
    return this.projectService.getHistory(id);
  }

  @UseGuards(AuthGuard)
  @Get(':id/rights')
  getRights(@Request() req, @Param('id') id: number) {
    return this.projectService.getProjectRights(id, req.user);
  }

  @UseGuards(AuthGuard)
  @Post(':id/rights')
  addRights(
    @Request() req,
    @Param('id') id: number,
    @Body() dto: RightsCreateDto,
  ) {
    return this.projectService.grantAccesToProject(id, req.user, dto);
  }

  @UseGuards(AuthGuard)
  @Delete(':projectId/rights/:id')
  removeRights(
    @Request() req,
    @Param('projectId') projectId: number,
    @Param('id') id: number,
  ) {
    return this.projectService.removeAcces(projectId, id, req.user);
  }

  @UseGuards(AuthGuard)
  @Get(':id/participants')
  getParticipants(@Param('id') id: number) {
    return this.projectService.getParticipants(id);
  }

  @UseGuards(AuthGuard)
  @Get('file/:id/download')
  async downloadProjectFile(
    @Request() req,
    @Param('id') id: number,
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
