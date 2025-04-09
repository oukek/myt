
/**
 * API响应接口
 */
export interface ApiResponse<T> {
  /** 状态码：200-成功，其他-失败 */
  code: number;
  /** 响应数据 */
  msg: T;
  }