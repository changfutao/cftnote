generator
生成器对象是由一个generator function返回的,并且它符合可迭代协议和迭代器协议。

## 语法
```js
// 生成器对象
function* gen() {
    yield 1;
    yield 2;
    yield 3;
}
// 调用生成器函数返回一个迭代器
let g= gen();
```

## 方法
**Generator.prototype.next()**
返回一个由yield表达式生成的值
**Generator.prototype.return()**
返回给定的值并结束生成器
**Generator.prototype.throw()**
向生成器抛出一个错误

