import { PartialType } from '@nestjs/swagger';
import { CreateLoginlogDto } from './create-loginlog.dto';

export class UpdateLoginlogDto extends PartialType(CreateLoginlogDto) {}
