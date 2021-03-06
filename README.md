# egret-utils
基于白鹭引擎 egret v5.0.9 的工具类库

<p>
  <span>
    <img src="https://img.shields.io/badge/version-1.0.8-green.svg" alt="version">
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
  if (/127.0.0.1/.test(document.domain)) {
    return 'localhost:9001';
  }
  // 当返回 null 的时候，请求时是不会添加 domain 的，例如 '/api/test.php'
  return null;
});
```

> 注意事项：必须使用 new 来创建一个请求。默认超时时间为30s，可直接修改默认值，或者新建方法参数来修改默认值。
> 在源码的 getUrl 方法里，会有一个添加域名的过程，不过不需要的话，可以先注释掉。





## 3. MCFactory.ts 用来管理生成 MovieClip 的类
使用方法：

```typescript
let mc = MCFactory.createMovieClip(key);
```

> 注意事项：在资源中必须有对应的 json 数据和 png 图片。详细的细节可以结合源码查看。





## 4. ResManager.ts 用来管理资源加载的类
使用方法：

```typescript
//// 方法1.
// loadingView 的类定义
class loadingUI {
  public setProgress(loaded, total) {}
}
try {
    await new ResManager('loadingView', {
        view: loadingUI,  // 加载层的构造函数
        obj: this         // 添加到的指定舞台
    }).loadGroup('group_name');  // 加载资源组
} catch (e) {}

//// 方法2
try {
    await new ResManager('callback', {
        updated: (loaded, total) => void,  // 更新进度回调
        completed: () => void              // 完成回调
    }).loadGroup('group_name')
} catch (e) {}
```

在 构造函数当中 函数中，有两个参数，

第1个参数是 加载模式。'loadingView'=>加载层模式，'callback'=>回调模式。

第2个参数是用来对加载模式进行设置的参数。（详情见构造函数的注释）

> 注意事项：
> 1. 在进行 loadGroup 的时候一定要用 try catch，或者使用 .then().catch() 语法。
> 2. loadingUI 加载层类的定义中，一定要有 setProgress 方法，用来进行进度条的显示。





## 5. Message.ts 用来消息提醒的 UI组件
使用方法：

```typescript
new Message({
  text: '提醒的消息',
  // type: 'success',  // 默认 成功类型
  // duration: 2000,   // 默认 2s
}, this);
Message.success({text: '登录成功'}, this);
Message.error({text: '发生错误'}, this);
```

> 注意事项：
> 1. Message 的第二个参数为显示的舞台，
> 创建的 Message实体 会添加到指定的舞台。










