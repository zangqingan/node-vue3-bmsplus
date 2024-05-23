import { IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { CreateLoginLogDto } from './create-loginlog.dto';

export class UpdateLoginLogDto extends PartialType(CreateLoginLogDto) {
  @IsNumber()
  infoId: number;
}
