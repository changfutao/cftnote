# 1. Redux学习
## 1.1. React纯函数
为什么纯函数在函数式编程中非常重要呢?
1.因为你可以安心的写和安心的用;
2.你在写的时候保证了函数的纯度, 只是实现自己的业务逻辑即可,不需要关心传入的内容或者依赖其他的外部变量;
3.你在用的时候,你确定你的输入内容不会被任意篡改,并且自己确定的输入,一定会有确定的输出;

React中就要求我们无论是函数还是class声明一个组件,这个组件都必须像纯函数一样,保护它们的props不被修改:
::: danger
React非常灵活,但它也有一个严格的规则:
所有React组件都必须像纯函数一样保护它们的props不被更改
:::
## 1.2. Redux的核心理念 - Store
Redux就是一个帮助我们管理State的容器: Redux是JavaScript的状态容器,提供了可预测的状态管理;
> Redux的核心理念 - Store

## 1.3. Redux的核心理念 - action
Redux要求我们通过action来更新数据:
+ 所有数据的变化,必须通过派发(dispatch)action来更新
+ action是一个普通的JavaScript对象,用来描述这次更新的type和content;

```js
const action = { type: "ADD_NUMBER", num: 5 }
```

## 1.4. Redux的核心理念 - reducer
> reducer将state和action联系在一起
1. reduer是一个纯函数
2. reducer做的事情就是将传入的state和action结合起来生成一个新的state

## 1.5. Redux的三大原则
+ 单一数据源
  + 整个应用程序的state被存储在一颗object tree中,并且这个object tree只存储在一个store中;
  + Redux并没有强制让我们不能创建多个Store,但是那样做并不利于数据的维护;
  + 单一的数据源可以让整个应用程序的state变得方便维护、追踪、修改。
+ State是只读的
  + 唯一修改State的方法一定是触发action,不要试图在其他地方通过任何的方式来修改State;
  + 这样就确保了View或网络请求都不能直接修改state,它们只能通过action来描述自己想要如何修改state;
  + 这样可以保证所有的修改都被集中化处理,并且按照严格的顺序来执行,所以不需要担心race condition(竞态)的问题;
+ 使用纯函数来执行修改
  + 通过reducer将旧state和actions联系在一起,并且返回一个新的state;
  + 随着应用程序的复杂度增加,我们可以将reducer拆分成多个小的reducers,分别操作不同state tree的一部分;
  + 但是所有的reducer都应该是纯函数,不能产生任何的副作用;

## 1.6. Redux的使用
### 1.6.1. 安装Redux
1. 创建项目文件夹 yarn init -y 
2. 安装redux yarn add redux 或 npm install redux --save
3. 创建index.js
4. 在pageage.json中添加
```js
"scripts": {
    "start":"node index.js"
}
```
### 1.6.2. Redux结构划分
+ store/index.js (输出store对象)
+ store/reducer.js (将state与action联系起来)
+ store/actionCreators.js (定义action)
+ store/contants.js (定义action的type的常量)

### 1.6.3. node中对ES6模块化的支持
从node v13.2.0开始,node才对ES6模块化提供了支持:
+ node v13.2.0之前,需要进行如下操作:
  + 在package.json中添加属性: "type": "module"
  + 在执行命令中添加如下选项: "node --experimental-modules src/index.js"
+ node v13.2.0之后,只需进行如下操作:
  + 在package.json中添加属性: "type": "module"

::: danger
注意: 导入文件时,需要跟上.js后缀名
:::

### 1.6.4. Redux使用流程
<img :src="$withBase('/images/Redux使用流程.jpg')" />

## 1.7. Redux融入react代码
### 1.7.1. 最初始代码
::: details 最初始代码 点击查看代码
```js
// connect函数
import React, { PureComponent } from  'react';
import store from './store';

export function connect(mapStateToProps, mapDispatchToProps) {
  return enhanceHOC(WrapperComponent) {
      class EnHanceComponent extends PureComponent{
          constructor(props) {
              super(props);
              this.state = {
                  storeState = mapStateToProps(store.getState())
              }
          }
          componentDidMount() {
              // store.subscribe函数监听到新的state,会回调
              this.unsubscribe = store.subscribe(() => {
                  this.setState({
                      storeState: mapStateToProps(store.getState())
                  })
              });
          }
          componentWillUnmount() {
              // 销毁
              this.unsubscribe();
          }
          render() {
              return (
                  <WrapperComponent 
                        { ...this.props } 
                        { ...mapStateToProps(store.getState()) }
                        { ...mapDispatchToProps(store.dispatch) }
                  />
              )
          }
      }

      return EnHanceComponent;
  }
}

// Home组件
import { addAction } from '../store/actionCreators'
import React,{ PureComponent } from 'react';
import { connect } from '../utils/connect'
class Home extends PureComponent {
    render() {
        return (
            <div>
                <h1>当前计数: { this.props.counter }</h1>
                <button onClick={ e => this.props.addNumber(5) }>+5</button>
            </div>
        )
    }
}
const mapStateToProps = state => ({
    counter: state.counter
});
const mapDispatchToProps = dispatch => ({
    addNumber(num) {
        dispatch(addAction(num));
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(Home);
```
:::
::: tip
上面的connect函数有一个很大缺陷: 依赖导入的store
1.如果我们将其封装成一个独立的库,需要依赖用于创建的store,我们应该如何获取呢?
2.难道让用户来修改我们的源码吗? 
:::

> 正确的方法: 通过Context共享store

::: details 通过Context优化代码
```js
// StoreContext
import React from 'react';
const StoreContext = React.createContext();
export {
    StoreContext
}

// index.js
import { StoreContext } from './utils/context';
import store from './store';

ReactDOM.render(
    <StoreContext.Provider value={ store }>
        <App>
    </StoreContext>
    ,
    document.QuerySelector('#root')
)

// connect.js
import React, { PureComponent } from  'react';
import { StoreContext } from './context'

export function connect(mapStateToProps, mapDispatchToProps) {
  return enhanceHOC(WrapperComponent) {
      class EnHanceComponent extends PureComponent{
          constructor(props, context) {
              super(props, context);
              // this.context还没有值
              this.state = {
                  storeState = mapStateToProps(context.getState())
              }
          }
          componentDidMount() {
              this.unsubscribe = this.context.subscribe(() => {
                  this.setState({
                      storeState: mapStateToProps(this.context.getState())
                  })
              });
          }
          componentWillUnmount() {
              this.unsubscribe();
          }
          render() {
              return (
                  <WrapperComponent 
                        { ...this.props } 
                        { ...mapStateToProps(this.context.getState()) }
                        { ...mapDispatchToProps(this.context.dispatch) }
                  />
              )
          }
      }
      EnHanceComponent.contextType = StoreContext;
      return EnHanceComponent;
  }
}

// Home组件
import { addAction } from '../store/actionCreators'
import React,{ PureComponent } from 'react';
import { connect } from '../utils/connect'
class Home extends PureComponent {
    render() {
        return (
            <div>
                <h1>当前计数: { this.props.counter }</h1>
                <button onClick={ e => this.props.addNumber(5) }>+5</button>
            </div>
        )
    }
}
const mapStateToProps = state => ({
    counter: state.counter
});
const mapDispatchToProps = dispatch => ({
    addNumber(num) {
        dispatch(addAction(num));
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(Home);

```
:::

## 1.8. react-redux使用
### 1.8.1. 安装react-redux
> yarn add react-redux

```js
// Home组件
import { addAction } from '../store/actionCreators'
import React,{ PureComponent } from 'react';
// 引入react-redux的connect函数
import { connect } from 'react-redux'
class Home extends PureComponent {
    render() {
        return (
            <div>
                <h1>当前计数: { this.props.counter }</h1>
                <button onClick={ e => this.props.addNumber(5) }>+5</button>
            </div>
        )
    }
}
const mapStateToProps = state => ({
    counter: state.counter
});
const mapDispatchToProps = dispatch => ({
    addNumber(num) {
        dispatch(addAction(num));
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(Home);

// index.js
// react-redux 有一个Provider的Context共享数据
import { Provider } from 'react-redux';
import store from './store';

ReactDOM.render(
    <Provider store={ store }>
        <App>
    </Provider>
    ,
    document.QuerySelector('#root')
)
```
## 组件中异步操作
<img :src="$withBase('/images/Redux异步操作.jpg')" />

这样做的缺陷:
1.我们必须将网络请求的异步代码放到组件的生命周期中来完成
2.事实上,网络请求到的数据也属于我们状态管理的一部分,更好的一种方式应该是将其也交给redux来管理

<img :src="$withBase('/images/Redux管理异步请求.jpg')" />

### 中间件
> Middleware可以帮助我们在请求和响应之间嵌入一些操作的代码,比如cookie解析、日志记录、文件压缩等操作。

1.redux-thunk
::: tip
+ 默认情况下的dispatch(action),action需要是一个JavaScript对象
+ redux-thunk可以让dispatch(action函数),action可以是一个函数
+ 该函数会被调用,并且会传给这个函数一个dispatch函数和getState函数;
  + dispatch函数用于我们之后再次派发action
  + getState函数考虑到我们之后的一些操作需要依赖原来的状态,用于让我们可以获取之前的一些状态
:::

#### 使用redux-thunk
1.安装redux-thunk
yarn add redux-thunk
2.在创建store时传入应用了middleware的enhance函数
+ 通过applyMiddleware来结合多个Middleware,返回一个enhancer
+ 将enhancer作为第二个参数传入到createStore中
```js
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import reducer from './reducer';

const enhancer = applyMiddleware(thunkMiddleware);
const store = createStore(reducer, enhancer);
export default store;
```
3.定义返回一个函数的action:
+ 注意: 这里不是返回一个对象了,而是一个函数
+ 该函数在dispatch之后会被执行
::: details
```js
// constants.js
export const GETBANNERS = "GETBANNERS";

// actionCreators.js
const getBannerAction = banners => ({
    type: GETBANNERS,
    banners
})

const getHomeMultiDataAction = () => {
    return dispatch => {
        axios.get("http://xxx").then(res => {
            const banners = res.data.data.banner.list;
            dispatch(getBannerAction(banners));
        })
    }
}

// home.js
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { getHomeMultiDataAction } from '../store/actionCreators';

class Home extends PureComponent {
    componentDidMount() {
        this.props.getBanners();
    }
    render() {
        return (
            <div>
              <ul>
                {
                    this.props.banners.map(x => {
                        return <li>{ x.title }</li>
                    })
                }
              </ul>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    banners: state.banners
})

const mapDispatchToProps = dispatch => ({
    getBanners() {
        // redux-thunk 可以直接dispatch一个函数
        dispatch(getHomeMultiDataAction());
    }
})

```
:::
> dispatch的作用: 将dispatch内部的action对象发送给调用的reducer函数


#### redux-devtools
使用redux-devtools可以监听每次状态是如何修改的,修改前后的状态变化

使用reudx-devtools
+ 第一步: 在浏览器(Chrome或Edge)中安装Redux DevTools
+ 第二步: 在redux中继承devtools的中间件
::: details 详细代码
```js
// store/index.js
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import reducer from './reducer';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({trace: true}) || compose;

const storeEnhancer = applyMiddleware(thunkMiddleware);

const store = createStore(reducer, composeEnhancers(storeEnhancers));

export default store;
```
:::

#### redux-saga
redux-saga是另一个比较常用在redux发送异步请求的中间件
redux-saga的使用步骤:
1.安装redux-saga
yarn add redux-saga
2.集成redux-saga中间件
+ 导入创建中间件的函数
+ 通过创建中间件的函数,创建中间件,并且放到applyMiddleware函数洪
+ 启动中间件的监听过程,并且传入要监听的saga
::: details 详细代码
```js
// store/saga.js
import { takeEvery, put, all, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { FETCH_HOME_MULTIDATA } from './contants';
import { getBannersAction } from './actionCreators';

function* fecthHomeMultidata(action) {
    // yield 会返回Promisethen以后的值
    const res = yield axios.get("http://123.207.32.32:8000/home/multidata");
    const banners = res.data.data.banner.list;
    yield put(getBannersAction(banners));
}

function* mySaga() {
    // takeLatest 一次只能监听一个对应的action,如果第一个action没有执行完,第二个action又到了,那么就会取消第一个action执行第二个action(只会执行最后一个)
    // takeEvery 每一个都会被执行
    // takeEvery或takeLatest函数会去匹配action的type,如果匹配成功则执行对应的generator
    yield takeEvery(FETCH_HOME_MULTIDATA, fecthHomeMultidata)
}

export default saga;

// store/index.js
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga'
import reducer from './reducer';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({trace: true}) || compose;
// 创建sagaMiddleware中间件
const sagaMiddleware = createSagaMiddleware();
const storeEnhancer = applyMiddleware(sagaMiddleware);

const store = createStore(reducer, composeEnhancers(storeEnhancers));
//启动中间件监听
sagaMiddleware.run(saga);
export default store;
```
:::
::: danger
saga.js文件的编写
+ takeEvery: 可以传入多个监听的actionType,每一个都可以被执行(对应有一个takeLatest,会取消前面的)
+ put: 在saga中派发action不再是通过dispatch,而是通过put
+ all: 可以在yield的时候put多个action
:::

### Reducer的拆分
+ store文件夹
  + counter文件夹
    + actionCreators.js
    + contants.js
    + index.js
    + reducer.js
  + home文件夹
    + actionCreators.js
    + contants.js
    + index.js
    + reducer.js
+ index.js
+ reducer.js
+ saga.js