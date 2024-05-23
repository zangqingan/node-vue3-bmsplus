import { IsString, IsEnum, Length, IsOptional } from 'class-validator';
import { StatusEnum } from 'src/common/enum/index';

export class CreateLoginLogDto {
  @IsOptional()
  @IsString()
  @Length(0, 128)
  ipAddr?: string;

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
