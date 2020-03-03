/**
 * 集合：以{val: val}形式存在。
 * @deprecated 集合的值都是唯一的，不存在重复的值
*/
export default class Collect {
    constructor() {
        this.items = {}
    }
    /**
     * 添加
     * @param { any } value 添加的值
     * @returns { Boolean } 返回是否添加成功
    */
    add(value) {
        if (this.has(value) === false) {
            this.items[value] = value
            return true
        }
        return false
    }
    /**
     * 删除
     * @param { any } value 删除的值
     * @returns { Boolean } 返回是否删除成功
    */
    remove(value) {
        if (this.has(value) === true) {
            delete this.items[value]
            return true
        }
        return false
    }
    // 判断是否存在
    has(value) {
        return Boolean(this.items[value])
    }
    // 清空
    clear() {
        this.items = {}
    }
    /**
     * 获取大小
     * @returns { number } 返回集合的大小
    */
    size() {
        return Object.keys(this.items).length
    }
    // 获取集合的所有值
    values() {
        const items = this.items
        const tempValues = []
        for (let key in items) {
            if (items.hasOwnProperty(key)) {
                tempValues.push(items[key])
            }
        }
        return tempValues
    }
    /**
     * 并集
     * @description 对于给定的两个集合，返回一个包含两个集合中 所有 元素的新集合
     * @param { Collect } ortherMap 比较的集合
     * @returns { Collect } 返回一个新的集合的values()
    */
    union(ortherMap) {
        // 如果另外一个集合不是Collect实例，那么不进行比较
        if (ortherMap instanceof Collect === false) return false
        const tempCollect = new Collect()
        const curValues = this.values()
        const ortherValues = ortherMap.values()
        for (var i = 0, len = curValues.length; i < len; i++) {
            tempCollect.add(curValues[i])
        }
        for (var i = 0, len = ortherValues.length; i < len; i++) {
            tempCollect.add(ortherValues[i])
        }
        return tempCollect
    }
    /**
     * 差集
     * @description 对于给定的两个集合，返回一个包含所有存在于第一个集合且不存在于第二个集合的元素的新集合
     * @param { Collect } ortherMap 比较的集合
     * @returns { Collect } 返回一个新的集合的values()
    */
    difference(ortherMap) {
        // 如果另外一个集合不是Collect实例，那么不进行比较
        if (ortherMap instanceof Collect === false) return false
        const tempCollect = new Collect()
        const curValues = this.values()

        for (var i = 0, len = curValues.length; i < len; i++) {
            if (ortherMap.has(curValues[i]) === false) {
                tempCollect.add(curValues[i])
            }
        }
        return tempCollect
    }
    /**
     * 交集
     * @description 对于给定的两个集合，返回一个包含两个集合中 共有 元素的新集合
     * @param { Collect } ortherMap 比较的集合
     * @returns { Collect } 返回一个新的集合的values()
    */
    intersection(ortherMap) {
        // 如果另外一个集合不是Collect实例，那么不进行比较
        if (ortherMap instanceof Collect === false) return false
        const tempCollect = new Collect()
        const curValues = this.values()

        for (var i = 0, len = curValues.length; i < len; i++) {
            if (ortherMap.has(curValues[i])) {
                tempCollect.add(curValues[i])
            }
        }
        return tempCollect
    }
    /**
     * 子集
     * @description 验证一个给定集合是否是另一集合的子集
     * @param { Collect } ortherMap 是否包含传入的集合
     * @returns { Boolean } 返回验证结果
    */
    subset(ortherMap) {
        if (ortherMap.size() > this.size()) return false

        const ortherValues = ortherMap.values()
        for (var i = 0, len = ortherValues.length; i < len; i++) {
            if (this.has(ortherValues[i]) === false) {
                return false
            }
        }
        return true
    }
}
