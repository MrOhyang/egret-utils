/**
 * 用来管理生成 MovieClip 的类
 */
class MCFactory {
    /**
     * 工厂对象
     */
    public static factory: Object = {};
    // public static factory: {
    //     string: egret.MovieClipDataFactory
    // }

    /**
     * 根据 mc 名称来管理创建一个 MovieClip 实例
     */
    public static createMovieClip(key: string) {
        if (!this.factory[key]) {
            let data = RES.getRes(`${key}_mc_json`);
            if (!data) {
                console.log(`没有该 key 的资源帧动画, data 为空, key: ${key}`);
                return ;
            }
            let txtr = RES.getRes(`${key}_tex_png`);
            if (!txtr) {
                console.log(`没有该 key 的资源帧动画, txtr 为空, key: ${key}`);
                return ;
            }
            let mcFactory = new egret.MovieClipDataFactory(data, txtr);
            this.factory[key] = mcFactory;
        }
        return new egret.MovieClip(this.factory[key].generateMovieClipData(key));
    }
}