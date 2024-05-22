import { Injectable } from '@nestjs/common';
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
      const payload = this.jwtService.verify(token.replace('Bearer ', ''));
      return payload;
    } catch (error) {
      throw new Error(`token失效${error}`);
    }
  }
}
