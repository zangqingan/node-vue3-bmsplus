/**
 * 配置文件枚举类型
 */
export enum ConfigEnum {
  // 测试配置
  test = 'test',
  // 生产配置
  production = 'prod',
  // 开发配置
  development = 'dev',
}
/**
 * 软删除标志:0代表存在 1代表删除
 */
export enum DeleteFlagEnum {
  /**
   * 存在
   */
  NORMAL = '0',
  /**
   * 删除
   */
  DELETE = '1',
}
