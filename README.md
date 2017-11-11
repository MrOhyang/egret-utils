# egret-utils
基于白鹭引擎 egret v5.0.9 的工具类库

<p>
  <span>
    <img src="https://img.shields.io/badge/version-1.0.1-green.svg" alt="version">
  </span>
  <span>
    <img src="https://img.shields.io/badge/downloads-7k-blue.svg" alt="downloads">
  </span>
</p>





## 1. ObjectPool.ts 对象池管理类
使用方法：

```javascript
// 创建一个对象实例
let obj = ObjectPool.getInstance().createObject(classFactory: any);

// 回收一个对象实例
let obj = ObjectPool.getInstance().deleteObject(obj: Object);
```

> 注意事项：在使用该类的方法的时候，需要要求 classFactory 类中拥有静态成员属性 key 值来进行区分创建和回收存储不同种类的对象。
> 如果需要查看详细的设计细节或具体的使用方法，[**请戳此处链接**](http://a8ccce0e.wiz03.com/share/s/2EPcUe16jknd21LCSr0jir5o1Uo2SA2TUQKH2PyOcZ0XXImI)。





## 2. Http.ts 网络请求封装
使用方法：

```javascript
// 1. async/await
let res = await new Http().post('/api/test', postData);

// 2. promise
new Http().post('/api/test', postData).then(r => {
  // do something...
}).catch(e => {});
```

> 注意事项：必须使用 new 来创建一个请求。默认超时时间为30s，可直接修改默认值，或者新建方法参数来修改默认值。





## 3. MCFactory.ts 用来管理生成 MovieClip 的类
使用方法：

```javascript
let mc = MCFactory.createMovieClip(key);
```

> 注意事项：在资源中必须有对应的 json 数据和 png 图片。详细的细节可以结合源码查看。










