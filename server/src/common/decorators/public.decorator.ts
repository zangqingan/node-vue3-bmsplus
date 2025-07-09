/**
 * @Public() 装饰器，用来声明哪些路由是公开的
 * 我们可以将其用于装饰任何方法。
 */

import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '@/common/constants/decorator.contant';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);