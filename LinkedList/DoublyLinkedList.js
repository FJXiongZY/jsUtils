function Node(element){
    this.element = element
    this.next = null
    this.prev = null
}

// 双向链表
export default function DoublyLinkedList() {
    this.length = 0
    this.headNode = null
    this.tailNode = null

    /**
     * 向链表添加一个节点
     * @param { any } element 添加的节点
    */
    this.push = function(element) {
        const node = new Node(element) // 创建新的节点

        if (this.headNode === null) { // 如果第一项是null，说链表为空。头部和尾部节点同时指向想创建的节点
            this.headNode = node
            this.tailNode = node
        } else {
            let curNode = this.tailNode // 保存一份尾部节点
            curNode.next = node // 尾部节点下指针指向新节点
            node.prev = curNode // 新节点的上指针指向旧尾部节点
            this.tailNode = node // 更新尾部节点
        }
        this.length++
    }
    /**
     * 向表头添加一个节点
     * @param { any } element 添加的节点
    */
    this.unshift = function(element) {
        const node = new Node(element) // 创建新的节点
        let curNode = this.headNode
        node.next = curNode
        curNode.prev = node
        this.headNode = node
        this.length++
    }
    /**
     * 向链表插入一个节点
     * @param { number } position 插入节点的位置
     * @param { any } element 添加的节点
    */
    this.insert = function(position, element) {
        // 越界检测
        if (position < 0 || position > this.length) return false

        if (position === 0) { // 在表头插入
            this.unshift(element)
        } else if (position === this.length) { // 在尾部插入
            this.push(element)
        } else {
            const node = new Node(element) // 创建新的节点
            let curNode = this.headNode
            let prevNode = null
            let index = 0
            while (index < position) {
                prevNode = curNode
                curNode = curNode.next
                index++
            }
            prevNode.next = node
            node.prev = prevNode
            node.next = curNode
            curNode.prev = node
            this.length++
        }
        return true
    }

    /**
     * 删除链表最后一项
     * @returns { Node } 返回删除的节点
    */
    this.pop = function() {
        const lastNode = this.tailNode
        const prevNode = lastNode.prev
        prevNode.next = null
        this.tailNode = prevNode
        this.length--

        return lastNode
    }
    /**
     * 删除链表的第一项
     * @returns { Node } 返回删除的节点
    */
    this.shift = function() {
        const curNode = this.headNode
        const nextNode = curNode.next
        nextNode.prev = null
        this.headNode = nextNode
        this.length--

        return curNode
    }
    /**
     * 根据位置删除节点
     * @param { number } position 删除节点的位置
    */
    this.removeAt = function(position) {
        const lastIndex = this.length - 1
        // 检测越界
        if (position < 0 || position > lastIndex) return false

        if (position === 0) { // 删除链表头部
            this.shift()
        } else if(position === lastIndex) { // 删除链表尾部
            this.pop()
        } else {
            let curNode = this.headNode
            let prevNode = null
            let index = 0
            while (index < position) {
                prevNode = curNode
                curNode = curNode.next
                index++
            }
            const nextNode = curNode.next 
            prevNode.next = curNode.next
            nextNode.prev = prevNode
            this.length--
        }
        return true
    }
    /**
     * 根据节点值删除
     * @param { any } element 删除的节点值，可能存在多个相同值
    */
    this.remove = function(element) {
        try {
            const maxSize = this.size()
            for (let i = maxSize - 1; i >= 0; i--) {
                const position = this.indexOf(element)
                if (position !== -1) {
                    this.removeAt(position)
                }
            }
            return true
        } catch(err) {
            console.log(err)
            return false
        }
    }

    /**
     * 根据内容值查找节点
     * @param { any } element 查找的节点值
    */
    this.find = function(element) {
        let curNode = this.headNode
        while (curNode !== null && curNode.element !== element) {
            curNode = curNode.next
        }
        return curNode
    }
    /**
     * 根据内容值查找下标
     * @param { any } element 查找的节点值
    */
    this.indexOf = function(element) {
        let curNode = this.headNode
        let index = 0
        while (curNode !== null && curNode.element !== element) {
            curNode = curNode.next
            index++
        }
        return curNode === null ? -1 : index
    }
    // 查看链表大小
    this.size = function() {
        return this.length
    }
    // 查看链表详情
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
