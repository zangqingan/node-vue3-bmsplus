import { Injectable, HttpException } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    throw new HttpException('文章已存在', 401);
    // return 'Hello World!';
  }
}
