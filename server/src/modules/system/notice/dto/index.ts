import { IsString, IsEnum, Length, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { PagingDto } from 'src/common/dto/index';
import { StatusEnum, TypeEnum } from 'src/common/enum';

export class CreateNoticeDto {
  @IsString()
  @Length(0, 50)
  noticeTitle: string;

  @IsString()
  @IsEnum(TypeEnum)
  noticeType: string;

  @ApiProperty({
    required: true,
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  remark?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsEnum(StatusEnum)
  status?: string;
}

export class UpdateNoticeDto extends CreateNoticeDto {
  @IsNumber()
  noticeId: number;
}

export class ListNoticeDto extends PagingDto {
  @IsOptional()
  @IsString()
  @Length(0, 50)
  noticeTitle?: string;

  @IsOptional()
  @IsString()
  @IsEnum(TypeEnum)
  noticeType?: string;

  @IsOptional()
  @IsString()
  createBy?: string;
}
