import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { RedisService } from 'src/common/utils/redis/redis.service';
import { AuthService } from 'src/common/utils/auth/auth.service';
import { RoleService } from '../role/role.service';
import { PostService } from '../post/post.service';
import { DeptService } from '../dept/dept.service';

import { DeleteFlagEnum, StatusEnum, CacheEnum, DataScopeEnum } from 'src/common/enum';
import { LoginDto, RegisterDto } from 'src/common/dto';
import { generateUUID, getNowDate } from 'src/common/utils/tools';

import { ListUserDto } from './dto/index';
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
    private readonly deptService: DeptService,
  ) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  /**
   * 查询用户列表
   * @param query
   * @param user
   * @returns
   */
  async findAll(query: ListUserDto, user: any) {
    // 创建查询器
    const userQueryResult = await this.userRepository.createQueryBuilder('user').where('user.delFlag = :delFlag', { delFlag: '0' });
    // 根据用户登录信息进行数据权限过滤
    if (user) {
      const roles = user.roles;
      const deptIds = [];
      let dataScopeAll = false;
      let dataScopeSelf = false;
      for (let index = 0; index < roles.length; index++) {
        const role = roles[index];
        if (role.dataScope === DataScopeEnum.DATA_SCOPE_ALL) {
          dataScopeAll = true;
          break;
        } else if (role.dataScope === DataScopeEnum.DATA_SCOPE_CUSTOM) {
          const roleWithDeptIds = await this.roleService.findRoleWithDeptIds(role.roleId);
          deptIds.push(...roleWithDeptIds);
        } else if (role.dataScope === DataScopeEnum.DATA_SCOPE_DEPT || role.dataScope === DataScopeEnum.DATA_SCOPE_DEPT_AND_CHILD) {
          const dataScopeWidthDeptIds = await this.deptService.findDeptIdsByDataScope(user.deptId, role.dataScope);
          deptIds.push(...dataScopeWidthDeptIds);
        } else if (role.dataScope === DataScopeEnum.DATA_SCOPE_SELF) {
          dataScopeSelf = true;
        }
      }

      if (!dataScopeAll) {
        if (deptIds.length > 0) {
          userQueryResult.where('user.deptId IN (:...deptIds)', { deptIds: deptIds });
        } else if (dataScopeSelf) {
          userQueryResult.where('user.userId = :userId', { userId: user.userId });
        }
      }
    }
    // 根据query以此判断增加查询条件
    if (query.deptId) {
      const deptIds = await this.deptService.findDeptIdsByDataScope(+query.deptId, DataScopeEnum.DATA_SCOPE_DEPT_AND_CHILD);
      userQueryResult.andWhere('user.deptId IN (:...deptIds)', { deptIds: deptIds });
    }

    if (query.userName) {
      userQueryResult.andWhere(`user.userName LIKE "%${query.userName}%"`);
    }

    if (query.phoneNumber) {
      userQueryResult.andWhere(`user.phoneNumber LIKE "%${query.phoneNumber}%"`);
    }

    if (query.status) {
      userQueryResult.andWhere('user.status = :status', { status: query.status });
    }

    if (query.params?.beginTime && query.params?.endTime) {
      userQueryResult.andWhere('user.createTime BETWEEN :start AND :end', { start: query.params.beginTime, end: query.params.endTime });
    }
    // 分页
    userQueryResult.skip(query.pageSize * (query.pageNum - 1)).take(query.pageSize);
    //联查部门详情
    userQueryResult.leftJoinAndMapOne('user.dept', SysDeptEntity, 'dept', 'dept.deptId = user.deptId');
    const [list, total] = await userQueryResult.getManyAndCount();
    return { list, total };
  }

  /**
   * 根据id查询用户信息
   * @param id
   * @returns
   */
  async findOne(id: number) {
    return await this.userRepository.findOne({ where: { userId: id } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  /**
   * 删除用户-本质是逻辑删除
   * @param ids
   * @returns
   */
  async remove(ids: string) {
    const menuIds = ids.split(',').map((id) => +id);
    const result = await this.userRepository.update({ userId: In(menuIds) }, { delFlag: DeleteFlagEnum.DELETE });
    return result;
  }

  /**
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

  /**
   * 注册
   * @param user
   * @returns
   */
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
