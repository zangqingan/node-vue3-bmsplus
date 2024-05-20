import * as svgCaptcha from 'svg-captcha';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { RedisService } from 'src/common/utils/redis/redis.service';
import { LoginDto } from 'src/common/dto/index';
import { DeleteFlagEnum } from 'src/common/enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { SysUserWithRoleEntity } from './entities/user-roles.entity';
import { SysUserWithPostEntity } from './entities/user-posts.entity';
import { SysDeptEntity } from '../dept/entities/dept.entity'; // 引入部门表用于联查

@Injectable()
export class UserService {
  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(SysUserWithRoleEntity)
    private userWithRoleRepository: Repository<SysUserWithRoleEntity>,
    @InjectRepository(SysUserWithPostEntity)
    private userWithPostRepository: Repository<SysUserWithPostEntity>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll() {
    const result = await this.userRepository.find();
    return result;
  }

  async findOne(id: number) {
    const result = await this.userRepository.findOne({ where: { userId: id } });
    return result;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  /**
   * 生成验证码
   */
  async generateCaptcha() {
    const captcha = svgCaptcha.create({
      size: 6, // 验证码长度
      ignoreChars: '0o1i', // 排除 0o1i
      noise: 2, // 噪声线条数量
      color: true, // 验证码的字符有颜色，而不是黑白
      background: '#cc9966', // 背景颜色
    });

    // 生成唯一id,并对验证码进行存储同时设置60s有效期
    const uniqueId = uuidv4();
    await this.redisService.set(uniqueId, captcha.text, 60);

    // 对数据部分加密并返回
    const svgData = Buffer.from(captcha.data).toString('base64');
    return {
      uniqueId,
      svgData,
    };
  }

  /**
   *
   * @param user 登录信息
   * @returns 完整的用户信息
   */
  async login(user: LoginDto) {
    console.log('2', user);
    // 根据传入的数据查询数据库
    const isExist = await this.userRepository.findOne({
      where: {
        userName: user.userName,
        password: user.password,
      },
      select: ['userId'],
    });
    console.log('isExist', isExist);
    if (!isExist) {
      throw new HttpException('帐号或密码错误', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const userData = await this.getUserInfo(isExist.userId);
    return userData;
  }

  /**
   * 根据用户id获取用户详细信息
   * @param userId
   */
  async getUserInfo(userId: number) {
    //  创建查询器连表查询
    const userQueryBuilder = await this.userRepository
      .createQueryBuilder('user') // user表别名
      .where({ userId: userId, delFlag: DeleteFlagEnum.NORMAL })
      // 联表查询获取匹配到的第一条数据：在user中dept字段存储、SysDeptEntity获取仓库信息、仓库别名'dept'、查询条件'dept.deptId = user.deptId'。
      .leftJoinAndMapOne('user.dept', SysDeptEntity, 'dept', 'dept.deptId = user.deptId')
      .getOne();

    return userQueryBuilder;
  }

  /**
   * 根据用户id获取用户角色id列表
   * @param userId
   */
  async getRoleIdList(userId: number) {
    // 根据用户id获取用户角色id列表
    const roleList = await this.userWithRoleRepository.find({ where: { userId }, select: ['roleId'] });
    // 只要roleId
    const roleIds = roleList.map((item) => item.roleId);
    return roleIds;
  }
}
