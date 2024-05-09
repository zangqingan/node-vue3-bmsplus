import { Injectable } from '@nestjs/common';
import { CreateOperationLogDto } from './dto/create-operation-log.dto';
import { UpdateOperationLogDto } from './dto/update-operation-log.dto';

@Injectable()
export class OperationLogService {
  create(createOperationLogDto: CreateOperationLogDto) {
    return 'This action adds a new operationLog';
  }

  findAll() {
    return `This action returns all operationLog`;
  }

  findOne(id: number) {
    return `This action returns a #${id} operationLog`;
  }

  update(id: number, updateOperationLogDto: UpdateOperationLogDto) {
    return `This action updates a #${id} operationLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} operationLog`;
  }
}
