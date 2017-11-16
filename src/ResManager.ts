/**
 * 资源加载管理器
 */
class ResManager {
    private group_name: string;  // 正在加载的当前资源组的 key 名
    private resolve: any;  // promise 的 resolve
    private reject: any;  // promise 的 reject

    /**
     * 加载某组的资源
     * @param group_name 资源组的 key 名
     */
    public loadGroup(group_name: string) {
        this.group_name = group_name;
        this.registerEvent();
        RES.loadGroup(group_name);
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
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
            this.reject('资源配置有误 ResManager');
        } else {
            console.warn('资源配置有误 ResManager');
        }
    }

    /**
     * 资源组加载中的进度回调
     */
    private onResProgress(e: RES.ResourceEvent) {
        if (e.groupName === this.group_name) {
            // todo
        }
    }

    /**
     * 资源组中某个资源加载错误的回调
     */
    private onItemLoadError(e: RES.ResourceEvent) {
        console.warn("Url:" + e.resItem.url + " has failed to load");
    }
}