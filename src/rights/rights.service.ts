import { Inject, Injectable } from '@nestjs/common';
import { RightsModel } from 'src/rights/entities/rights.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { RightsCreateDto } from './dto/rights.create.dto';

@Injectable()
export class RightsService {
  constructor(
    @Inject('RIGHTS_REPO') private rightsRepository: Repository<RightsModel>,
  ) {}

  createRights(dto: RightsCreateDto) {
    return this.rightsRepository.save(dto);
  }

  getRightsById(id: number) {
    return this.rightsRepository.findOne({ where: { id } });
  }

  getAllProjectRights(projectId: number) {
    return this.rightsRepository.find({
      where: { project: { id: projectId } },
      select: {
        user: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      relations: { user: true },
    });
  }

  getProjectRightsForUser(projectId: number, user: User) {
    return this.rightsRepository.findOne({
      where: {
        project: { id: projectId },
        user: { id: user.id },
      },
    });
  }

  getAllProjectsForUser(user: Partial<User>) {
    return this.rightsRepository.find({
      where: { user: { id: user.id } },
      select: { project: { id: true } },
      relations: {
        project: true,
      },
    });
  }

  removeRights(id: number) {
    return this.rightsRepository.delete({ id });
  }
}
