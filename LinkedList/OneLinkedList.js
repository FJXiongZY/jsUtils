function Node(element) {
    this.element = element // 获取当前节点
    this.next = null    // 获取下一节点链接
}

// 单向链表
export default function LinkedList(){
    this.length = 0 // 链表长度
    this.headNode = null // 头部节点

    /**
     * 向链表尾部添加节点
     * @param { any } element 添加的节点
    */
    this.push = function(element) {
        const node = new Node(element) // 添加的节点
        let currentNode = undefined
        if (this.headNode === null) { // 如果链表的头部节点是null
            this.headNode = node
        } else {
            currentNode = this.headNode
            while (currentNode.next) {
                currentNode = currentNode.next
            }
            currentNode.next = node
        }
        this.length++
    }
    /**
     * 向链表头部添加节点
     * @param { any } element 添加的节点
    */
    this.unshift = function(element) {
        const node = new Node(element) // 添加的节点
        const curNode = this.headNode
        node.next = curNode
        this.headNode = node
        this.length++
    }
    /**
     * 向链表特定位置插入元素
     * @param { number } position 插入到那个位置
     * @param { any } element 插入的节点
     * @returns { boolean } 返回是否插入成功
    */
    this.insert = function(position, element) {
        // 检测越界值
        if (position < 0 || position > this.length) return false

        if (position === 0) { // 在第一个位置添加
            this.unshift(element)
        } else {
            const node = new Node(element)
            let curNode = this.headNode
            let index = 0
            while (index < position) {
                curNode = curNode.next
                ++index
            }
            node.next = curNode.next
            curNode.next = node
            this.length++
        }
        return true
    }

    /**
     * 移除链表的第一项
     * @returns { any | null } 返回删除的节点对象 | null
    */
    this.shift = function() {
        const curNode = this.headNode
        if (curNode !== null) {
            this.headNode = curNode.next
            this.length--
        }
        return curNode
    }
    /**
     * 移除链表的最后一项
     * @returns { any | null } 返回删除的节点对象 | null
    */
    this.pop = function() {
        let curNode = this.headNode
        const size = this.size()
        if (size === 0) {
            return null
        } else {
            let index = 2
            while (index < size && curNode !== null) {
                curNode = curNode.next
                index++
            }
            curNode.next = null
            this.length--
        }
    }
    /**
     * 移除元素
     * @param { any } element 根据节点值来删除
     * @returns { any | null } 返回删除的节点对象 | null
    */
    this.remove = function(element) {
        const position = this.indexOf(element)
        return this.removeAt(position)
    }
    /**
     * 移除特定位置的元素
     * @param { number } position 根据下标来删除
     * @returns { any | null } 返回删除的节点对象 | null
    */
    this.removeAt = function(position) {
        // 检测越界值
        if (position < 0 || position > this.length || this.isEmpty()) return null

        if (position === 0) { // 删除链表第一项
            this.shift()
        } else {
            let prevNode = null
            let curNode = this.headNode
            let index = 0
            while (index < position) {
                prevNode = curNode 
                curNode = curNode.next
                index++
            }
            prevNode.next = curNode.next
            this.length--
            return curNode
        }
    }
    /**
     * 查找节点
     * @param { any } element 查找的节点
     * @description 如果当前循环节点不等于查找的节点时，那么就指针下移，直到查找到为止。否则返回null
     * @return { any | Null } 返回查找到的节点或者null
    */
    this.find = function(element) {
        let curNode = this.headNode // 获取当前节点
        while (curNode !== null && curNode.element !== element) { 
            curNode = curNode.next // 让指针下移
        }
        return curNode
    }
    /**
     * 返回元素在链表中的索引。没有该元素则返回-1
     * @param { any } element 查找的节点
    */
    this.indexOf = function(element) {
        let curNode = this.headNode // 获取当前节点
        let index = 0
        while (curNode !== null && curNode.element !== element) { 
            curNode = curNode.next // 让指针下移
            index++
        }
        return curNode === null ? -1 : index
    }
    // 判断链表是否为空
    this.isEmpty = function() {
        return this.length === 0
    }
    // 返回链表包含元素个数
    this.size = function() {
        return this.length
    }
    // 由于链表项使用了Node类，就需要重写继承自JavaScript对象默认的toString方法，让其只输出元素的值
    this.toString = function() {
        let curNode = this.headNode
        const tempArray = []
        while (curNode !== null) {
            tempArray.push(curNode.element)
            curNode = curNode.next
        }
        return JSON.parse(JSON.stringify(tempArray)).join(',')
    }
}
