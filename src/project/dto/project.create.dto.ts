import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsSemVer,
  IsUrl,
  MinLength,
} from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { ProjectSettingsCreateDto } from './project_settings.create.dto';

export class ProjectCreateDto {
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({ example: 'My first project', required: true })
  name: string;

  @IsOptional()
  @ApiProperty({
    example: 'Description to my awesome project',
    required: false,
  })
  description?: string;

  @IsOptional()
  @IsUrl()
  @ApiProperty({
    example: 'https://github.com/my_org/my_project',
    required: false,
  })
  git_ref?: string;

  @IsOptional()
  @IsSemVer()
  @ApiProperty({
    example: 'v0.0.1',
    required: false,
  })
  @ApiProperty()
  version?: string;
}

export class ProjectCreateResponse extends ProjectCreateDto {
  createdBy: User;
  settings: ProjectSettingsCreateDto;
}
