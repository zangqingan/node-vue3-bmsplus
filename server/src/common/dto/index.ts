import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsOptional, IsNumberString, IsObject, IsDateString } from 'class-validator';

/**
 * 登录DTO
 */
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

/**
 * 注册DTO
 */
export class RegisterDto extends LoginDto {}

/**
 * 客户端信息DTO
 */
export class ClientInfoDto {
  userAgent: string;
  ipAddr: string;
  os: string;
  browser: string;
  loginLocation: string;
}

/**
 * 时间区间对象
 */
export class DateParamsDTO {
  @IsDateString()
  beginTime: string;

  @IsDateString()
  endTime: string;
}

/**
 * 分页查询基础DTO
 */
export class PagingDto {
  @ApiProperty({ required: false })
  @IsNumberString()
  pageNum: number;

  @ApiProperty({ required: false })
  @IsNumberString()
  pageSize: number;

  /**
   * 时间区间对象
   */
  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  params?: DateParamsDTO;

  /**
   * 排序字段
   */
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  orderByColumn?: string;

  /**
   * 排序规则
   */
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  isAsc?: 'ascending' | 'descending';
}
