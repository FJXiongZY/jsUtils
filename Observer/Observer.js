import Utils from '../Utils/utils'

// 观察者模式，又称发布-订阅者模式
export default class Observer{
    constructor(){
        this.message = {}; //存放消息队列
    }

    /**
     * 注册信息接口
     * @param { String }            type    注册信息的键
     * @param { Array | Function }  fn      注册信息的值，可以是数组 | 函数
    */
    register(type, fn){
        if(Utils.isArray(fn) && Utils.isFunction(fn)) return false; // 如果不等于 Array | Function 则直接终止

        if(typeof this.message[type] === 'undefined') this.message[type] = [];  // 如果不存在则创建为Array

        switch(fn.constructor){
            case Array:
                for(var i=0, len=fn.length; i<len; i++){
                    this.message[type].push(fn)
                }
            break;
            case Function:
                this.message[type].push(fn)
            break;
        }
    }

    /**
     * 移除消息接口
     * @param { String }            type    注册信息的键
     * @param { Function }          fn      注册信息的值
    */
    remove(type, fn){
        let neadMessage = this.message[type]
        if(Utils.isArray(neadMessage)){
            let i = neadMessage.length - 1;
            for(; i>=0; i--){
                // 如果存在该消息就从消息队列中删除
                neadMessage[i] === fn && neadMessage.splice(i, 1)
            }
        }
    }

    // 发布信息接口
    execute(type){
        let neadMessage = this.message[type]
        if(typeof neadMessage === 'undefined') return false;

        var i = 0,
            len = neadMessage.length
            arg = [].slice.call(arguments, 1);
        for(; i<len; i++){
            neadMessage[i].apply(this, arg)
        }
    }
}
