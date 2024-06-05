import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsPhoneNumber, Min, Length, IsOptional, IsNumber } from 'class-validator';
import { StatusEnum } from 'src/common/enum';

export class CreateDeptDto {
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  parentId: number;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @Length(0, 30)
  deptName: string;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @Min(0)
  orderNum: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  leader?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 11)
  @IsPhoneNumber('CN')
  phone?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsEnum(StatusEnum)
  status?: string;
}

export class UpdateDeptDto extends CreateDeptDto {
  @ApiProperty({
    required: false,
  })
  @IsNumber()
  deptId: number;
}
