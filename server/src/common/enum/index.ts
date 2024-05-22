/**
 * redis缓存的 key
 * @description LOGIN_TOKEN_KEY 登录用户
 * @description CAPTCHA_CODE_KEY 验证码
 * @description SYS_CONFIG_KEY 系统参数管理
 * @description SYS_DICT_KEY 系统字典管理
 * @description REPEAT_SUBMIT_KEY 防重提交
 * @description RATE_LIMIT_KEY 限流
 * @description PWD_ERR_CNT_KEY 登录账户密码错误次数
 * @description GZ_TYPE gz压缩类型
 * @description MA_CODE 微信code存储
 */
export enum CacheEnum {
  // 登录用户 redis key
  LOGIN_TOKEN_KEY = 'login_tokens:',
  // 验证码 redis key
  CAPTCHA_CODE_KEY = 'captcha_codes:',
  // 系统参数管理 cache key
  SYS_CONFIG_KEY = 'sys_config:',
  // 系统字典管理 cache key
  SYS_DICT_KEY = 'sys_dict:',
  // 防重提交 redis key
  REPEAT_SUBMIT_KEY = 'repeat_submit:',
  // 限流 redis key
  RATE_LIMIT_KEY = 'rate_limit:',
  // 登录账户密码错误次数 redis key
  PWD_ERR_CNT_KEY = 'pwd_err_cnt:',
  // gz压缩类型 redis key
  GZ_TYPE = 'gz_type:',
  // 微信code存储
  MA_CODE = 'ma_code:',
}

/**
 * 配置文件枚举类型
 * @description test 测试配置
 * @description production 生产配置
 * @description development 开发配置
 */
export enum ConfigEnum {
  test = 'test',
  production = 'prod',
  development = 'dev',
}

/**
 * 数据软删除标志
 * @description NORMAL = '0' 代表存在
 * @description DELETE = '1' 代表删除
 */
export enum DeleteFlagEnum {
  NORMAL = '0',
  DELETE = '1',
}

/**
 * 数据状态
 * @description NORMAL = '0' 正常
 * @description STOP = '1' 停用
 */
export enum StatusEnum {
  NORMAL = '0',
  STOP = '1',
}
