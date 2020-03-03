import Utils from '../Utils/Utils'

export default class Strateqy{
    constructor(){
        this.strateqy = {
            isArray(data){
                return Array.isArray(data)
            },
            isString(data){
                return typeof data === 'string'
            }
        }
    }

    // 验证接口
    check(type){
        let neadFn = this.strateqy[type];
        if(typeof neadFn === 'undefined') return false

        let arg = [].slice.call(arguments, 1);
        neadFn.apply(this, arg)
    }

    // 添加策略
    addCheck(type, fn){
        if(Utils.isFunction(fn)){
            this.strateqy[type] = fn
        }else{
            throw new Error('添加策略的fn参数类型为函数')
        }
    }
}