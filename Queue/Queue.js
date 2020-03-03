// 队列（先进先出）
export default class Queue {
    constructor() {
        this.list = []
    }
    // 进
    push(item) {
        this.list.push(item)
    }
    // 出
    shift() {
        this.list.shift()
    }
    // 清空
    clear() {
        this.list.length = 0
    }
    // 返回队列大小
    size() {
        return this.list.length
    }
    // 输出队列字符串
    toString() {
        return this.list.toString()
    }
    // 输出队列数据
    print() {
        return this.list
    }
    // 获取队列第一项
    getFirst() {
        return this.list[0]
    }
    // 获取队列最后一项
    getLast() {
        const list = this.list
        return list[list.length - 1]
    }
    // 获取队列指定项数据
    getIndex(index) {
        return this.list[index]
    }
}
