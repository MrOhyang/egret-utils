# egret-utils
基于白鹭引擎 egret v5.0.9 的工具类库

## 1. ObjectPool.ts 对象池管理类
使用方法：

1. ObjectPool.getInstance().createObject(classFactory: any) // 创建一个对象实例
2. ObjectPool.getInstance().deleteObject(obj: Object)  // 回收一个对象实例

>
注意事项：在使用该类的方法的时候，需要要求 classFactory 类中拥有静态成员属性 key 值来进行区分创建和回收存储不同种类的对象。
如果需要查看详细的设计细节或具体的使用方法，[**请戳此处链接**](http://a8ccce0e.wiz03.com/share/s/2EPcUe16jknd21LCSr0jir5o1Uo2SA2TUQKH2PyOcZ0XXImI)。









