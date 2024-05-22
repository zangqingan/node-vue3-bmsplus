import { Injectable, Inject } from '@nestjs/common';
import { LoginDto } from 'src/common/dto/index';
import { UserService } from './modules/system/user/user.service';

@Injectable()
export class AppService {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}
  /**
   * 登录
   * @param user
   * @returns
   */
  async login(user: LoginDto): Promise<any> {
    return await this.userService.login(user);
  }
}
