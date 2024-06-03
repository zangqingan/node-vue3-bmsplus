import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RedisService } from 'src/common/utils/redis/redis.service';
import { AuthService } from 'src/common/utils/auth/auth.service';
import { RoleService } from '../role/role.service';
import { PostService } from '../post/post.service';

import { DeleteFlagEnum, StatusEnum, CacheEnum } from 'src/common/enum';
import { LoginDto, RegisterDto } from 'src/common/dto';
import { generateUUID, getNowDate } from 'src/common/utils/tools';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { User } from './entities/user.entity';
import { SysUserWithRoleEntity } from './entities/user-roles.entity';
import { SysUserWithPostEntity } from './entities/user-posts.entity';
import { SysDeptEntity } from '../dept/entities/dept.entity'; // 引入部门表用于联查

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(SysUserWithRoleEntity)
    private userWithRoleRepository: Repository<SysUserWithRoleEntity>,
    @InjectRepository(SysUserWithPostEntity)
    private userWithPostRepository: Repository<SysUserWithPostEntity>,

    // 注入服务层
    private readonly redisService: RedisService,
    private readonly authService: AuthService,
    private readonly roleService: RoleService,
    private readonly postService: PostService,
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
   *
   * @param user 登录信息
   * @returns 完整的用户信息
   */
  async login(user: LoginDto) {
    // 根据传入的用户名和密码数据查询数据库
    const isExist = await this.userRepository.findOne({
      where: {
        userName: user.userName,
        password: user.password,
      },
      select: ['userId'],
    });
    if (!isExist) {
      throw new HttpException('帐号或密码错误', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    // 获取用户信息
    const userData = await this.getUserInfo(isExist.userId);

    // 判断账号是否正常状态
    if (userData.delFlag === DeleteFlagEnum.DELETE) {
      throw new HttpException('帐号已被禁用，如需正常使用请联系管理员', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (userData.status === StatusEnum.STOP) {
      throw new HttpException('帐号已被停用，如需正常使用请联系管理员', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // 生成token
    const uniqueId = generateUUID();
    const token = await this.authService.createToken({ uuid: uniqueId, userId: userData.userId });

    // 登录信息存redis
    const cacheData = {
      token: uniqueId,
      user: userData,
      userId: userData.userId,
      username: userData.userName,
      deptId: userData.deptId,
    };
    await this.redisService.set(`${CacheEnum.LOGIN_TOKEN_KEY}${uniqueId}`, JSON.stringify(cacheData), 60 * 60 * 24);

    // 返回token
    return { token, message: '登录成功' };
  }

  async register(user: RegisterDto) {
    // 生成创建时间
    const loginDate = getNowDate();
    const isExist = await this.userRepository.findOne({
      where: {
        userName: user.userName,
      },
      select: ['userId'],
    });
    if (isExist) {
      throw new HttpException('用户名已存在', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    // 创建用户
    const result = await this.userRepository.save({ ...user, loginDate });
    return result;
  }

  /**
   * 根据用户id获取用户详细信息
   * @param userId
   */
  async getUserInfo(userId: number) {
    //  创建查询器连表查询
    const userQueryResult = await this.userRepository
      .createQueryBuilder('user') // user表别名
      .where({ userId })
      // 联表查询获取匹配到的第一条数据：在user中dept字段存储、SysDeptEntity获取仓库信息、仓库别名'dept'、查询条件'dept.deptId = user.deptId'。
      .leftJoinAndMapOne('user.dept', SysDeptEntity, 'dept', 'dept.deptId = user.deptId')
      .getOne();

    // 获取用户角色列表
    const roleIds = await this.getRoleIdList(userId);
    // 调用roleService层获取角色信息
    const rolesList = await this.roleService.findRoleByIds(roleIds);

    // 获取用户岗位列表
    const postIds = await this.getPostIdList(userId);
    const postsList = await this.postService.findPostByIds(postIds);

    // 组装数据返回
    userQueryResult['roles'] = rolesList;
    userQueryResult['posts'] = postsList;
    return userQueryResult;
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

  /**
   * 根据用户id获取用户岗位id列表
   * @param userId
   */
  async getPostIdList(userId: number) {
    // 根据用户id获取用户角色id列表
    const postList = await this.userWithPostRepository.find({ where: { userId }, select: ['postId'] });
    // 只要roleId
    const postIds = postList.map((item) => item.postId);
    return postIds;
  }
}
