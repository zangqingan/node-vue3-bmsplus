import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   *
   * @param payload 加密的数据
   * @returns token
   */
  async createToken(payload: { uuid: string; userId: number }): Promise<string> {
    return this.jwtService.sign(payload);
  }

  /**
   * 从令牌中获取数据声明
   *
   * @param token 令牌
   * @return 数据声明
   */
  async parseToken(token: string) {
    try {
      if (!token) return null;
      return this.jwtService.verify(token.replace('Bearer ', ''));
    } catch (error) {
      throw new UnauthorizedException(`登录 token 失效，请重新登录${error}`);
    }
  }
}
