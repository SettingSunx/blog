```yaml
---
title: js面试题01自定义unshift
date: 2026-08-26
tags:
  - 技术
description: 文章摘要
---
```
#首先知道unshift是什么
```javascript
let arr = [2,3]
let newlength = arr.unshift(0，1);
console.log(arr);//[0，1,2,3]
console.log(newlength);//[4]
```
`unshift()` 是数组原型（`Array.prototype`）上的一个核心方法。它的作用非常明确：**将一个或多个元素添加到数组的开头（修改原数组），并返回数组新的长度**。从上面的样例可以看出是将元素按顺序插入，并且 **返回值**返回的是新数组的 `length` 属性值，而非返回新数组本身。
#额外：关于数组原型
`Array.prototype` 是一个**对象**。它是所有通过 `new Array()` 或字面量 `[]` 创建的数组实例的**原型**。

它本身也是一个数组（`Array.isArray(Array.prototype) === true`），但通常它的长度被设计为 0，主要用作基类。
    
它里面没有存储具体的数据（如 `[1,2,3]`），而是**存储了所有实例共享的方法和属性。**

#如何通过自定义函数实现数组unshift效果
```
//通过自定义函数实现原生数组unshift的效果；往数组头插入元素
let arr =[1,2,3]
  
//多定义一层prototype可以给其他数组都增加该自定义方法（原型链继承）

Array.prototype.myunshift = function(){

    console.log('当前的 this 指向：', this); // 控制台会打印出 [1, 2, 3]

    //谁调用了方法，this就指向谁；

    console.log('this === arr ?', this === arr); // 控制台打印 true

    const len = arguments.length;//arguments就是接收的数组

    //不是箭头函数就可以用argument当作接收的数组

    for(let i = len  - 1;i >= 0; i--){  //条件2是继续循环的条件

        const element = arguments[i]

        this.splice(0,0,element)  //splice用法：从第0个元素，替代0个元素，插入element

    }

    return this.length;

}

  

console.log(arr.myunshft(3,4,5))//6

console.log(arr); // 3, 4, 5, 1, 2, 3;这里逻辑是从后面先加进数组头；
```