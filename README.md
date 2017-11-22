# egret-utils
基于白鹭引擎 egret v5.0.9 的工具类库

<p>
  <span>
    <img src="https://img.shields.io/badge/version-1.0.6-green.svg" alt="version">
  </span>
  <span>
    <img src="https://img.shields.io/badge/downloads-7k-blue.svg" alt="downloads">
  </span>
</p>





## 1. ObjectPool.ts 对象池管理类
使用方法：

```typescript
// 创建一个对象实例
let obj = ObjectPool.getInstance().createObject(classFactory: any);

// 回收一个对象实例
let obj = ObjectPool.getInstance().deleteObject(obj: Object);
```

> 注意事项：在使用该类的方法的时候，需要要求 classFactory 类中拥有静态成员属性 key 值来进行区分创建和回收存储不同种类的对象。
> 而且最好在该类中定义好创建对象完成的回调函数 **onCreate**、
> 回收对象完成的回调函数 **onDestory**，
> 一个用来初始化变量，一个用来释放资源。
> 如果需要查看详细的设计细节或具体的使用方法，
> [**请戳此处链接**](http://a8ccce0e.wiz03.com/share/s/2EPcUe16jknd21LCSr0jir5o1Uo2SA2TUQKH2PyOcZ0XXImI)。





## 2. Http.ts 网络请求封装
使用方法：

```typescript
// 1. async/await
let res = await new Http().post('/api/test', postData);

// 2. promise
new Http().post('/api/test', postData).then(r => {
  // do something...
}).catch(e => {});
```

如果在开发环境中，需要进行跨域请求资源，那么可以设置一下域名。

```typescript
// 直接设置域名
Http.setDomain('localhost:9001');

// 或者设置一个函数
Http.setDomain(() => {
  // 注意，如果是 native 下是没有 window 对象的，可以用 document.domain 来判断。
  if (window && /127.0.0.1/.test(window.location.host)) {
    return 'localhost:9001';
  }
  return null;
});
```

> 注意事项：必须使用 new 来创建一个请求。默认超时时间为30s，可直接修改默认值，或者新建方法参数来修改默认值。
> 在源码的 getUrl 方法里，会有一个添加域名的过程，不过不需要的话，可以先注释掉。**（为了跨域需要，之后修改成可配置）**





## 3. MCFactory.ts 用来管理生成 MovieClip 的类
使用方法：

```typescript
let mc = MCFactory.createMovieClip(key);
```

> 注意事项：在资源中必须有对应的 json 数据和 png 图片。详细的细节可以结合源码查看。





## 4. ResManager.ts 用来管理资源加载的类
使用方法：

```typescript
// loadingView 的类定义
class loadingUI {
  public setProgress() {}
}
ResManager.getInstance().init(loadingUI, this);  // 初始化资源管理器
try {
    await ResManager.getInstance().loadGroup('group_name');  // 加载资源
} catch (e) {}
```

在 init 函数中，有两个参数，

第1个参数是 loadingView （加载层）的类原型。当然，名字不一定是 loadingUI，可以随便定义。

第2个参数是在加载资源过程中，需要将 loadingView 添加到视图中的父容器对象。

> 注意事项：
> 1. 在使用 ResManager 之前一定要先初始化。
> 2. 在进行 loadGroup 的时候一定要用 try catch，或者使用 .then().catch() 语法。
> 3. loadingUI 加载层类的定义中，一定要有 setProgress 方法，用来进行进度条的显示。










