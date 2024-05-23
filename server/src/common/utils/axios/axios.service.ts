import * as iconv from 'iconv-lite';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class AxiosService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 获取ip地址
   * @param ip
   * @returns
   */
  async getIpAddress(ip?: string) {
    const origin = this.configService.get('axios.IP_TO_ADDRESS');
    try {
      // 使用iconv.decode对数据流进行解密
      return await firstValueFrom(
        this.httpService
          .get(origin, {
            params: {
              ip,
              json: true,
            },
            responseType: 'arraybuffer',
          })
          .pipe(
            map((res) => {
              const parseData = JSON.parse(iconv.decode(res.data, 'gbk'));
              return parseData.addr;
            }),
          ),
      );
    } catch (error) {
      return '未知';
    }
  }
}
