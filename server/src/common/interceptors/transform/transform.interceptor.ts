import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

/**
 * 对请求成功(状态码为 2xx)的数据在返回给前台前进行一个统一的格式化处理
 */
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        return {
          code: 200,
          data,
          message: '请求成功',
        };
      }),
    );
  }
}
