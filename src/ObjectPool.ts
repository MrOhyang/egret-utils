/**
 * 对象池（单例模式管理）
 */
class ObjectPool {
    /**
     * 单例
     */
    private static instance: ObjectPool = null;

    /**
     * 对象池
     */
    private pool: Object;
    /**
     * 对象计数器
     */
    private obj_count: Object;
    // private obj_count: {
    //     string: {
    //         show_count: number,     // 目前显示的数量
    //         created_count: number,  // 创建总数
    //         recycle_count: number   // 回收备用总数
    //     }
    // };
    /**
     * 是否忽略警告
     */
    private not_warning: boolean = true;

    // 构造函数
    public constructor() {
        this.pool = {};
        this.obj_count = {};
    }

    /**
     * 获取单例
     */
    public static getInstance() {
        if (!this.instance) {
            this.instance = new ObjectPool();
        }
        return this.instance;
    }

    /**
     * 检查 this.pool[key], 不完整则初始化
     * @param key 对象池的 key 值
     */
    private checkPoolKey(key) {
        if (!this.pool[key]) {
            this.pool[key] = [];
            this.obj_count[key] = {
                created_count: 0,
                show_count: 0,
                recycle_count: 0
            };
        }
    }

    /**
     * 从对象池获取一个对象实例（如果没有就创建一个）
     * @param classFactory 需要获取的类
     */
    public createObject(classFactory: any) {
        let key = classFactory.key,
            obj = null;

        if (!key) {
            throw new Error(`该类没有静态变量 key: ${classFactory.toString()}`);
        }
        this.checkPoolKey(key);
        if (this.pool[key].length <= 0) {
            obj = new classFactory();
            obj.key = key;
            this.onCreate(obj);
            this.obj_count[key].created_count++;
            this.obj_count[key].show_count++;
        } else {
            obj = this.pool[key].shift();
            this.onCreate(obj);
            this.obj_count[key].show_count++;
            this.obj_count[key].recycle_count--;
        }
        return obj;
    }

    /**
     * 删除一个对象实例（push 到 对象池里面）
     * @param obj 指定的删除对象（必须含有 key 值，否则报错）
     */
    public deleteObject(obj: any) {
        let key = obj.key;

        if (!key) {
            throw new Error(`该类没有静态变量 key: ${JSON.stringify(obj)}`);
        }
        this.checkPoolKey(key);
        // 从场景中移除
        if (obj.parent) obj.parent.removeChild(obj);
        this.onDestory(obj);
        this.obj_count[key].show_count--;
        this.obj_count[key].recycle_count++;
        this.pool[key].push(obj);
    }

    /**
     * 执行创建的对象的回调函数
     * @param obj 指定的执行对象
     */
    private onCreate(obj: any) {
        if (obj.onCreate) {
            obj.onCreate();
        } else if (!this.not_warning) {
            console.log(`警告：该类没有创建之后的回调函数 onCreate`);
        }
    }

    /**
     * 执行回收的对象的回调函数
     * @param obj 指定的执行对象
     */
    private onDestory(obj: any) {
        if (obj.onDestory) {
            obj.onDestory();
        } else if (!this.not_warning) {
            console.log(`警告：该类没有回收之后的回调函数 onDestory`);
        }
    }

    /**
     * 根据 key 来输出 对象池的信息
     * @param key 对象池的 key 值
     */
    public printObjCount(key: string) {
        let created_count = this.obj_count[key].created_count,
            show_count = this.obj_count[key].show_count,
            recycle_count = this.obj_count[key].recycle_count,
            str = [
                `${key}对象池信息: `,
                `created_count: ${created_count}, `,
                `show_count: ${show_count}, `,
                `recycle_count: ${recycle_count}`
            ].join('');
        console.log(str);
    }
}