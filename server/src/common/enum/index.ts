/**
 * redis缓存的 key
 * @description LOGIN_TOKEN_KEY = 'login_tokens:' 登录用户 redis key
 * @description CAPTCHA_CODE_KEY = 'captcha_codes:' 验证码 redis key
 * @description SYS_CONFIG_KEY = 'sys_config:' 系统参数管理 cache key
 * @description SYS_DICT_KEY = 'sys_dict:' 系统字典管理 cache key
 * @description REPEAT_SUBMIT_KEY = 'repeat_submit:' 防重提交 redis key
 * @description RATE_LIMIT_KEY = 'repeat_submit:' 限流 redis key
 * @description PWD_ERR_CNT_KEY = 'pwd_err_cnt:' 登录账户密码错误次数 redis key
 * @description GZ_TYPE = 'gz_type:' gz压缩类型 redis key
 * @description MA_CODE = 'ma_code:' 微信code存储 redis key
 */
export enum CacheEnum {
  LOGIN_TOKEN_KEY = 'login_tokens:',
  CAPTCHA_CODE_KEY = 'captcha_codes:',
  SYS_CONFIG_KEY = 'sys_config:',
  SYS_DICT_KEY = 'sys_dict:',
  REPEAT_SUBMIT_KEY = 'repeat_submit:',
  RATE_LIMIT_KEY = 'rate_limit:',
  PWD_ERR_CNT_KEY = 'pwd_err_cnt:',
  GZ_TYPE = 'gz_type:',
  MA_CODE = 'ma_code:',
}

/**
 * 配置文件枚举类型
 * @description test = 'test' 测试配置
 * @description production = 'prod' 生产配置
 * @description development = 'dev' 开发配置
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
 * 数据使用状态
 * @description NORMAL = '0' 正常
 * @description STOP = '1' 停用
 */
export enum StatusEnum {
  NORMAL = '0',
  STOP = '1',
}

/**
 * 数据过滤规则枚举
 * @description DATA_SCOPE_ALL = '1' 全部数据权限
 * @description DATA_SCOPE_CUSTOM = '2' 自定数据权限
 * @description DATA_SCOPE_DEPT = '3' 部门数据权限
 * @description DATA_SCOPE_DEPT_AND_CHILD = '4' 部门及以下数据权限
 * @description DATA_SCOPE_SELF = '5' 仅本人数据权限
 */
export enum DataScopeEnum {
  DATA_SCOPE_ALL = '1',
  DATA_SCOPE_CUSTOM = '2',
  DATA_SCOPE_DEPT = '3',
  DATA_SCOPE_DEPT_AND_CHILD = '4',
  DATA_SCOPE_SELF = '5',
}

//菜单类型
export enum RoleTypeEnum {
  M = 'M',
  C = 'C',
  F = 'F',
}
