export default class Utils{
    // 检测是否是字符串类型
    static isString(data){ return typeof data === 'string' }

    // 检测是否是数字类型
    static isNumber(data){ return data && !isNaN(data) ? true : false }

    // 检测是否是数组类型
    static isArray(data){ return data ? Array.isArray(data) : false; }

    // 检测是否是对象
    static isObject(data){ return data ? data.constructor === Object : false; }

    // 检测是否是函数
    static isFunction(data){ return data ? typeof data === 'function' : false }

    // 检测数据是否为空 ('', undefined, false)
    static isEmpty(data){ return data === '' || data === undefined || data === false }

    // 检测对象是否为空
    static Object_empty(data){ return this.isObject(data) ? Object.keys(data).length === 0 : true; }

    // 检测是否是空数组
    static Array_empty(data){ return this.isArray(data) ? data.length === 0 : true; }
}