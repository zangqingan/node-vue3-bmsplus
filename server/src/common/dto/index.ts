import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsOptional } from 'class-validator';

export enum StatusEnum {
  STATIC = '0',
  DYNAMIC = '1',
}

export class LoginDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  uuid?: string;

  @ApiProperty({ required: true })
  @IsString()
  @Length(2, 10)
  userName: string;

  @ApiProperty({ required: true })
  @IsString()
  @Length(5, 20)
  password: string;
}

export class RegisterDto extends LoginDto {}

export class ClientInfoDto {
  ipaddr: string;
  userAgent: string;
  browser: string;
  os: string;
  loginLocation: string;
}
