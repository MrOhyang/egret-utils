/**
 * 基于 egret.HttpRequest 封装的 Http 类，主要用来进行网络请求封装
 * post/get 方法返回的都是 promise 对象，可以支持新的 promise/await 新的语法。
 * 
 * 使用方法：
 * let res = await new Http().post('/api/test', {id: 1});
 */
class Http {
    /**
     * egert 的请求对象实例
     */
    private request: egret.HttpRequest;

    /**
     * 域名
     */
    private static domain: any = null;

    /**
     * 设置的 Http 请求超时时间, 默认30s
     */
    public static timeout: number = 30000;

    /**
     * 构造函数
     */
    public constructor() {
        this.request = new egret.HttpRequest();
        this.request.responseType = egret.HttpResponseType.TEXT;
        return this;
    }

    /**
     * post 方法
     * @param url 一个用来包含发送请求的 url 字符串
     * @param param 发送到服务器的数据
     */
    public post(url: string, param: Object = {}) {
        let timer = null,
            timeout = Http.timeout;

        return new Promise((resolve, reject) => {
            this.request.open(this.getUrl(url), egret.HttpMethod.POST);
            this.request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            this.request.send(this.formatPostData(param));
            this.request.addEventListener(egret.Event.COMPLETE, (e: egret.Event) => {
                let request = <egret.HttpRequest>e.currentTarget;
                egret.clearTimeout(timer);
                resolve(JSON.parse(request.response));
            }, this);
            this.request.addEventListener(egret.IOErrorEvent.IO_ERROR, (e: egret.IOErrorEvent) => {
                egret.clearTimeout(timer);
                reject(e);
            }, this);
            timer = egret.setTimeout(() => {
                reject({
                    msg: `该链接已超时: ${timeout}`,
                    url,
                    param
                });
            }, this, timeout);
        });
    }

    /**
     * get 方法
     * @param url 一个用来包含发送请求的 url 字符串
     * @param param 发送到服务器的数据
     */
    public get(url: string, param: Object = {}) {
        let timer = null,
            timeout = Http.timeout;

        return new Promise((resolve, reject) => {
            let getData = this.formatPostData(param),
                real_url = this.getUrl(url);
            
            if (getData != '') {
                real_url += `?${getData}`;
            }
            this.request.open(real_url, egret.HttpMethod.POST);
            this.request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            this.request.send();
            this.request.addEventListener(egret.Event.COMPLETE, (e: egret.Event) => {
                let request = <egret.HttpRequest>e.currentTarget;
                egret.clearTimeout(timer);
                resolve(JSON.parse(request.response));
            }, this);
            this.request.addEventListener(egret.IOErrorEvent.IO_ERROR, (e: egret.IOErrorEvent) => {
                egret.clearTimeout(timer);
                reject(e);
            }, this);
            timer = egret.setTimeout(() => {
                reject({
                    msg: `该链接已超时: ${timeout}`,
                    url,
                    param
                });
            }, this, timeout);
        });
    }

    /**
     * 获取完整 url 路径，（主要用来区别本地环境还是什么环境的）
     * @param url 一个用来包含发送请求的 url 字符串
     */
    private getUrl(url: string): string {
        if (typeof Http.domain === 'string' && Http.domain.length > 0) {
            return `http:\/\/${Http.domain}`;
        } else if (typeof Http.domain === 'function') {
            return 'http:\/\/' + Http.domain + url;
        } else {
            return url;
        }
    }

    /**
     * 设置请求的域名
     */
    public static setDomain(domain: any) {
        if (typeof domain === 'string' || typeof domain === 'function') {
            Http.domain = domain;
        } else {
            console.log('setDomain 的参数 domain 必须是一个字符串或者函数');
        }
    }
   
    /**
     * 格式化传参, eg: {p1: a, p2: b}  ==>  'p1=a&p2=b'
     * @param param 发送到服务器的数据
     */
    private formatPostData(param: Object): string {
        let arr = [],
            val = '';

        for (let key in param) {
            // 如果是数组，或者是对象，则进行 JSON.stringify
            if (typeof param[key] == 'object') {
                try {
                    val = JSON.stringify(param[key]);
                } catch(e) {
                    console.log(`Http.formatPostData 参数异常: `, param);
                    val = '';
                }
                arr.push(`${key}=${val}`);
            } else {
                arr.push(`${key}=${param[key]}`);
            }
        }
        if (arr.length <= 0) return undefined;
        return arr.join('&');
    }
}