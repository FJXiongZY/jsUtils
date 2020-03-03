// 栈---先进后出

export default (()=>{
    const items = new WeakMap();
    return class Stack{
        constructor(){
            items.set(this, []); // WeakMap只接收对象作为键
        }
    
        // 添加一个或多个新的元素到栈顶
        push(){
            let stack = items.get(this)
            stack.push(...arguments)
        }
    
        // 移除栈顶元素，同时返回被移除的元素
        pop(){
            let stack = items.get(this)
            stack.pop()
        }
    
        // 返回栈顶元素，不对栈做任何的修改
        peek(){
            let stack = items.get(this)
            return stack[stack.length - 1]
        }

        // 返回栈中所有元素，不对栈做任何修改
        entire(){
            return items.get(this)
        }
    
        // 判断栈中是否有元素，没有元素返回true，否则返回false
        isEmpty(){
            let stack = items.get(this)
            return stack.length === 0
        }
    
        // 移除栈中所有的元素
        clear(){
            let stack = items.get(this)
            stack.length = 0
        }
    
        // 返回栈中的元素个数
        size(){
            let stack = items.get(this)
            return stack.length
        }
    }
})()