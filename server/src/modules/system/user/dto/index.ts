import { IsString, IsJSON, IsEnum, IsPhoneNumber, IsArray, Min, Length, IsOptional, IsBoolean, IsNumber, IsNumberString, IsEmail } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PagingDto } from 'src/common/dto/index';
import { StatusEnum } from 'src/common/enum/index';
/**
 * 用户列表查询参数
 */
export class ListUserDto extends PagingDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  deptId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(0, 30)
  nickName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(0, 30)
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(0, 30)
  userName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsEnum(StatusEnum)
  status?: string;
}
