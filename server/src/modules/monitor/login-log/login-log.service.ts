import { Injectable } from '@nestjs/common';
import { CreateLoginlogDto } from './dto/create-loginlog.dto';
import { UpdateLoginlogDto } from './dto/update-loginlog.dto';

@Injectable()
export class LoginLogService {
  create(createLoginlogDto: CreateLoginlogDto) {
    return 'This action adds a new loginlog';
  }

  findAll() {
    return `This action returns all loginlog`;
  }

  findOne(id: number) {
    return `This action returns a #${id} loginlog`;
  }

  update(id: number, updateLoginlogDto: UpdateLoginlogDto) {
    return `This action updates a #${id} loginlog`;
  }

  remove(id: number) {
    return `This action removes a #${id} loginlog`;
  }
}
