import { IsString, IsEnum, Length, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PagingDto } from 'src/common/dto/index';
import { StatusEnum } from 'src/common/enum';

export class CreateLoginLogDto {
  @IsOptional()
  @IsString()
  @Length(0, 128)
  ipaddr?: string;

  @IsOptional()
  @IsString()
  @Length(0, 50)
  userName?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  loginLocation?: string;

  @IsOptional()
  @IsString()
  @Length(0, 50)
  browser?: string;

  @IsOptional()
  @IsString()
  @Length(0, 50)
  os?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  msg?: string;

  @IsOptional()
  @IsString()
  @IsEnum(StatusEnum)
  status?: string;
}

export class UpdateLoginLogDto extends CreateLoginLogDto {
  @IsNumber()
  infoId: number;
}

export class ListLoginLogDto extends PagingDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 128)
  ipaddr?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  userName?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsEnum(StatusEnum)
  status?: string;
}
