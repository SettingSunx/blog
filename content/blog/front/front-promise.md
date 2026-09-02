```yaml
---
title: 学习笔记之es6中的promise
date: 2026-09-03
tags:
  - 技术
description: 文章摘要
---
```
初学异步对象的时候非常模糊，学了几个小时只能说懵懵懂懂。这篇笔记用来记录自己初学过程中的疑惑，帮助更好消化。
首先要先知道什么是异步？
**异步**指的是程序在执行一个耗时任务（如网络请求、定时器、读取文件）时，**不必等待该任务完成**，而是先继续执行后续代码；等耗时任务在后台处理完毕（成功或失败）后，再通过回调Promise 或事件来通知主程序处理结果。**JavaScript 中“异步函数”通常专指用 async 声明的函数。**
第二如何使用 Promise 处理异步任务？
这里用两个写法来概括
第一种就是标准写法：
```javascript
const p1 = new Promise ((resolve,reject) =>{
	//promise对象Promise 有三种状态。状态由里面的处理函数决定，状态确定后不可修改
	//- pending：等待中
	//- fulfilled：成功，调用了 resolve
	//- rejected：失败，调用了 reject
	 if (条件成立) {
      resolve("事件一成功");
    } else {
      reject("失败")
    }
});

//.then方法一般用于处理p1成功后的情况（err用在.catch中更加直观），其中：
//-data：接收 p1 成功时传给 resolve(...) 的值。
//-err：接收 p1 失败时传给 reject(...) 的值。
p1.then(
    data => { console.log("事件二成功") },
    //err => { ... }
  )
.then(data =>{console.log(data) }
//data undefined
//第二个then()方法接收的值是前一个then的返回值。
//第一个then()返回的promise调用成功，值undefined

.catch(error =>{ ...})
```
上面代码中，p1 是一个 Promise 对象，用来表示异步任务未来的完成状态和结果,
.then() 和 .catch()里的回调函数是“事件1结束后要做的事件2”


```javascript
 const p1 = new Promise ((resolve,reject) =>{
 	 if (条件成立) {
      resolve("事件一成功");
    } else {
      reject("失败");
    }
})

 async function run() {
    try {
      const data = await p1
      console.log(data)
    } catch (err) {
      console.log(err)
    }
  }
  //- data 是 await 得到的成功结果，不是函数形参。
  //- err 是 catch 捕获到的失败原因，也不是函数形参。
  

```
上面两段对比，`async/await` + `try/catch` 的写法，在逻辑上与 `.then/.catch` 完全等价，好处就是看起来更像同步事件，无需链式调用（.then方法会返回新的promise对象，后一个then接收的是前一个then的值），后续更多环环相扣的串行异步事件只需要续在try代码块中。

在学习过程中，我疑惑点在于：
# 1什么是链式调用
之所以叫“链式调用”，是因为每次调用 .then() 或 .catch() 都会返回一个新的 Promise，于是可以继续调用下一个方法，连接成一条链：
 p1
    .then(...)
    .then(...)
    .catch(...)
前一个 Promise 的结果，会决定链条后面如何执行。
##  链条如何传递结果
```javascript
 Promise.resolve(10)
    .then(data => {
      return data + 5
    })
    .then(data => {
      console.log(data) // 15
    })
```
第一个回调返回 15，.then() 会把它包装成一个成功的 Promise，因此第二个 .then() 接收到 15。

  如果回调返回另一个 Promise：

  ```javascript
  Promise.resolve(10)
    .then(data => {
      return new Promise(resolve => {
        setTimeout(() => resolve(data + 5), 1000)
      })
    })
    .then(data => {
      console.log(data) // 一秒后输出15
    })
  ```
  后面的 .then() 会等待这个 Promise 完成。

  # 2.和同步函数的区别
  
  同步函数调用时，程序会停在这一行，等待函数执行完成：
```javascript
function task1() {
    return 10
  }
const data = task1()
console.log(data)
```

  执行顺序一定是：

  task1执行完成 → 获得data → console.log

  普通同步函数的结果可以直接通过 return 获得：

```javascript
 const data = task1()//data = 10
```

  Promise 通常用于异步任务。调用后会先得到一个 Promise，而不是立即得到最终数据：
```javascript
  function task1() {
    return new Promise(resolve => {
      setTimeout(() => resolve(10), 1000)
    })
  }

  const p1 = task1()
  console.log(p1) // 立即得到Promise，不是10

  p1.then(data => {
    console.log(data) // 一秒后得到10
  })
```

  执行过程是：

  启动异步任务
     ↓
  立即返回Promise，继续执行后面的同步代码
     ↓
  异步任务完成
     ↓
  执行then中的回调

真正的区别不是“同步函数不能链式调用”，而是：

- 同步调用：下一步立即处理上一步的返回值。
- Promise 链：下一步等待上一个 Promise 确定结果，然后异步执行对应的回调。
- Promise 链还会自动传递成功值和失败原因。

可以将同步调用理解为：
```javascript
  const a = task1()
  const b = task2(a)
  const c = task3(b)

```

  Promise 链则类似于：
```javascript
  task1()
    .then(task2)
    .then(task3)
    .catch(handleError)
```
它们都是“前一步结果交给下一步”，但 Promise 链能够表达“现在没有结果，未来得到结果后再继续”。

  # 扩展:基于上面两个疑问，我想知道如何得到p1异步处理之后的值呢？
  
  • 如果你只想等待 p1 得到结果，取出其中某个值，然后结束当前 async 函数，可以使用 await 和 return：
```javascript
const p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        name: "小明",
        age: 18
      })
    }, 1000)
  })

  async function getName() {
    const data = await p1
    return data.name
  }
```

调用 getName()：
```javascript
getName().then(name => {
    console.log(name) // 一秒后输出：小明
  })
```
按照按执行顺序，可以划分这些事件：

   1. 同步事件1：创建 p1，启动定时器。
   2. 同步事件2：定义并调用 getName()，执行到 await p1 后暂停，返回一个等待中的 Promise。
   3. 同步事件3：调用该 Promise 的 .then()，注册回调函数。
  4. 异步事件1：定时器结束，调用 resolve()；await 得到数据，getName() 返回 "小明"。
  5. 异步事件2：执行 .then() 的回调，输出 "小明"。
   严格来说，异步事件1包含两个不同队列中的任务：
   - setTimeout 回调：宏任务
  -  await 后续代码：微任务
  但在初步理解时，可以先将它们合并成一个异步过程。