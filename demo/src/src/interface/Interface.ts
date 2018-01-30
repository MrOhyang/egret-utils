/**
 * 资源加载管理器配置接口
 */
interface IResManagerOption {
  /**
   * ['loadingView' 模式下的] - loadingView 加载层（构造方法）
   */
  view?: any
  /**
   * ['loadingView' 模式下的] - 要添加加载层的舞台容器
   */
  obj?: egret.DisplayObjectContainer
  /**
   * ['cb' 模式下的] - 更新回调函数
   */
  updated?: (
    /**
     * 当前加载数
     */
    loaded: number,
    /**
     * 当前加载总数
     */
    total: number
  ) => void
  /**
   * ['cb' 模式下的] - 资源组加载完成时回调函数
   */
  completed?: () => void
}
