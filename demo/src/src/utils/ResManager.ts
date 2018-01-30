/**
 * Created by ouyangyibin 2018-01-08 09:43:44
 *
 * 资源加载管理器，跟消消乐的有点区别，多模式
 *    type = 'loadingView' 加载层模式
 *         = 'callback' 回调模式
 *
 * 依赖项：
 * /src/interface/Interface.ts
 */
class ResManager {
  /**
   * 加载资源时候，处理事情的模式
   *     'loadingView'=>出现整屏loading效果,
   *     'callback'=>回调模式
   */
  private type: string;
  /**
   * 资源管理器配置
   */
  private option: IResManagerOption;
  /**
   * 正在加载的当前资源组的 key 名
   */
  private group_name: string;
  /**
   * promise 的 resolve
   */
  private resolve: any;
  /**
   * promise 的 reject
   */
  private reject: any;
  /**
   * loading 加载层
   */
  private loading_view: egret.DisplayObject;

  /**
   * 构造函数
   * @param type 加载资源时，处理事情的模式
   * @param type   'loadingView'=>出现整屏loading效果
   * @param type   'callback'=>回调模式
   * @param option 回调模式中，设置更新回调与完成回调
   * @param option option.view 加载层 (构造方法)     -- 'loadingView' 模式需要
   * @param option option.obj 要添加加载层的舞台容器  -- 'loadingView' 模式需要
   * @param option option.updated 更新回调函数               -- 'callback' 模式需要
   * @param option option.completed 资源组加载完成时回调函数  -- 'callback' 模式需要
   */
  public constructor(type: string = 'loadingView', option?: IResManagerOption) {
    // 判断处理类型
    switch (type) {
      case 'loadingView':
        if (!option) {
          console.warn('ResManager 设置为加载层模式，但是没有设置参数 option，请查看相关注释');
        } else {
          if (!option.view) {
            console.warn(`ResManager 设置为加载层模式，但是没有设置 loadingView 加载层的构造方法，请查看相关注释`);
          }
          if (!option.obj) {
            console.warn(`ResManager 设置为加载层模式，但是没有设置 obj 要添加加载层的舞台容器，请查看相关注释`);
          }
        }
        break;
      case 'callback':
        if (!option) {
          console.warn('ResManager 设置为回调模式，但是没有设置参数 option，请查看相关注释');
        } else {
          if (!option.updated && !option.completed) {
            console.warn(`ResManager 设置为回调模式，但是没有设置回调，请查看相关注释`);
          }
        }
        break;
      default:
        console.warn(`ResManager 没有该类型的处理模式, type=${type}`);
        return;
    }
    this.type = type;
    this.option = option;
  }

  // ------------------------------------------------ api ↓

  /**
   * 加载某组的资源
   * @param group_name 资源组的 key 名
   */
  public loadGroup(group_name: string) {
    // 检测是否已经加载了资源
    if (RES.isGroupLoaded(group_name)) {
      this.option.completed();
      return Promise.resolve();
    }

    switch (this.type) {
      case 'loadingView':
        // 初始化加载层
        this.loading_view = new this.option.view();
        this.option.obj.addChild(this.loading_view);
        break;
      case 'callback':
        break;
    }

    // 生成 promise
    const temp = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });

    // 加载资源
    this.group_name = group_name;
    this.registerEvent();
    RES.loadGroup(group_name);

    return temp;
  }

  // ------------------------------------------------ api ↑

  /**
   * 注册资源加载的相关事件
   */
  private registerEvent() {
    RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResLoadComplete, this);
    RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResLoadError, this);
    RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResProgress, this);
    RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
  }

  /**
   * 移除事件
   */
  private removeEvent() {
    RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResLoadComplete, this);
    RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResLoadError, this);
    RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResProgress, this);
    RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
  }

  /**
   * 资源组加载完成后的回调函数
   */
  private onResLoadComplete(e: RES.ResourceEvent) {
    if (e.groupName === this.group_name) {
      this.removeEvent();
      switch (this.type) {
        case 'loadingView':
          // 移除 loadingView 视图
          if (this.loading_view.parent) {
            this.loading_view.parent.removeChild(this.loading_view);
            this.loading_view = undefined;
          }
          break;
        case 'callback':
          if (this.option && typeof this.option.completed === 'function' ) {
            this.option.completed();
          }
          break;
      }
      if (typeof this.resolve === 'function') {
        this.resolve();
        this.resolve = null;
        this.reject = null;
      } else {
        console.warn('资源配置有误 ResManager');
      }
    }
  }

  /**
   * 资源组加载错误的回掉函数
   */
  private onResLoadError(e: RES.ResourceEvent) {
    console.warn('Group:' + e.groupName + ' has failed to load');
    if (typeof this.reject === 'function') {
      this.removeEvent();
      // 移除 loadingView 视图
      // if (this.loadingView && this.loadingView.parent) {
      //   this.container.removeChild(this.loadingView)
      //   delete this.loadingView
      // }
      this.reject('资源组加载错误 ResManager');
      this.resolve = null;
      this.reject = null;
    } else {
      console.warn('资源配置有误 ResManager');
    }
  }

  /**
   * 资源组加载中的进度回调
   */
  private onResProgress(e: RES.ResourceEvent) {
    if (e.groupName === this.group_name) {
      const loaded_num = e.itemsLoaded;  // 当前加载数
      const total_num = e.itemsTotal;    // 总的加载数

      switch (this.type) {
        case 'loadingView':  // 设置加载层的进度
          if (this.loading_view && typeof (<any> this.loading_view).setProgress === 'function') {
            (<any> this.loading_view).setProgress(e.itemsLoaded, e.itemsTotal);
          } else {
            console.warn('this.loading_view 没有 setProgress 这个方法, 或未进行设置 loading_view');
          }
          break;
        case 'callback':  // 执行更新回调
          if (this.option && typeof this.option.updated === 'function' ) {
            this.option.updated(e.itemsLoaded, e.itemsTotal);
          }
          break;
      }
    }
  }

  /**
   * 资源组中某个资源加载错误的回调
   */
  private onItemLoadError(e: RES.ResourceEvent) {
    console.warn('Url:' + e.resItem.url + ' has failed to load');
  }
}
