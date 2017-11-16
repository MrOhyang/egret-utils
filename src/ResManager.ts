/**
 * 资源加载管理器
 */
class ResManager {
    /**
     * 单例
     */
    private static instance: ResManager = null;

    /**
     * 需要加载 loadingView 的父容器
     */
    private container: egret.DisplayObjectContainer;
    /**
     * loadingView 的构造函数
     */
    private loadingViewFactory: any;
    /**
     * loadingView 加载界面
     */
    private loadingView: any;
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
     * 构造函数
     */
    public constructor() {
    }

    /**
     * 获取单例
     */
    public static getInstance() {
        if (!this.instance) {
            this.instance = new ResManager();
        }
        return this.instance;
    }

    /**
     * 设置 需要加载的 loadingView 的父容器和 loadingViewFactory
     */
    public init(loadingViewFactory: any, container: egret.DisplayObjectContainer) {
        this.loadingViewFactory = loadingViewFactory;
        this.container = container;
    }

    /**
     * 加载某组的资源
     * @param group_name 资源组的 key 名
     */
    public loadGroup(group_name: string) {
        // 检测是否进行了初始化
        if (!this.container || !this.loadingViewFactory) {
            console.warn('请先进行初始化在调用 loadGroup');
            return ;
        }

        // 初始化加载层
        this.loadingView = new this.loadingViewFactory();
        this.container.addChild(this.loadingView);

        // 生成 promise
        let temp = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });

        // 加载资源
        this.group_name = group_name;
        this.registerEvent();
        RES.loadGroup(group_name);
        
        return temp;
    }

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
            if (this.loadingView && this.loadingView.parent) {
                this.container.removeChild(this.loadingView);
                delete this.loadingView;
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
        console.warn("Group:" + e.groupName + " has failed to load");
        if (typeof this.reject === 'function') {
            this.removeEvent();
            if (this.loadingView && this.loadingView.parent) {
                this.container.removeChild(this.loadingView);
                delete this.loadingView;
            }
            this.reject('资源配置有误 ResManager');
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
            if (this.loadingView && this.loadingView.setProgress) {
                this.loadingView.setProgress(e.itemsLoaded, e.itemsTotal);
            } else {
                console.warn('loadingView 没有 setProgress 这个方法, 或未进行设置 loadingView');
            }
        }
    }

    /**
     * 资源组中某个资源加载错误的回调
     */
    private onItemLoadError(e: RES.ResourceEvent) {
        console.warn("Url:" + e.resItem.url + " has failed to load");
    }
}