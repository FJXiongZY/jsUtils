export default class Socket{
    constructor({
        host, 
        name='socket', 
        autoLink=true, 
        autoLinkTime=1000, 
        heardStart=false,
        heardTime=3000, 
        heardResponseTime=2000, 
        extraData 
    } = {}){
        this.socket = null;                                 // 保存socket实例，让全局都能调用
        this.mode = ['onopen', 'onclose'];                  // 存储指令
        this.tempMessage = [];                              // 存储临时消息队列
        this.dealMessage = {};                              // 存储开发者的消息处理对象，用于监听onmessage的回掉处理

        this.host = host;                       // 储存服务端的链接地址
        this.name = `__reg__:${name}`;          // 客户端的名称
        this.extraData = extraData;             // 提交给服务端的额外数据
        
        this.heardStart = heardStart;                       // 是否开启心跳检测
        this.heardTime = heardTime;                         // 定时心跳的时间间隔
        this.heardResponseTime = heardResponseTime;         // 容许服务端多久内返回心跳包数据
        this.heardStatus = true;                            // 存储心跳包是否正常

        this.autoLink = autoLink;               // 是否自动重连
        this.autoLinkNum = 0;                   // 记录断线重连的次数，大于10次就判定为断线了。
        this.autoLinkTime = autoLinkTime;       // 自定重连事件间隔
    }

    // 检测心跳包的开启时间是否大于结束时间
    checkHeadTime(){
        let { heardTime, heardResponseTime } = this;
        if(heardResponseTime >= heardTime){
            console.error('心跳包间隔时间(heardTime)应该 大于 心跳包的响应时间(heardResponseTime)')
            this.stop();
        }
    }

    // 手动开始会话
    start(){
        let _this = this;
        try{
            let ws = _this.socket = new WebSocket(_this.host);
            // ws.readyState;     // 0=正在链接中，1=已经链接并且可以通讯，2=连接正在关闭，3=连接已关闭或者没有链接成功

            // 用于指定连接成功后的回调函数
            ws.onopen = function(event){
                console.log("WebSocket is open now.", event);
                _this.autoLinkNum = 0;
                _this.send(_this.name);          // 执行消息发送
                _this.heartbeat();                           // 定时心跳
                _this.distribute('onopen', event)            // 发布用户订阅的 onopen 方法
                _this.checkHeadTime();

                _this.message(_this.name, (e)=>{ _this.heardStatus = true; })
            };

            // 用于指定当从服务器接受到信息时的回调函数
            ws.onmessage = function(event){
                console.log("WebSocket message received:", event);

                let resultKey = event.data && event.data.type;
                let devKeys = Object.keys(_this.dealMessage);

                if(devKeys.indexOf(resultKey) !== -1){
                    let neadArray = _this.dealMessage[resultKey];
                    delete event.data.type;
                    for(let item of neadArray){
                        typeof item === 'function' && item.call(null, event.data, event)
                    }
                }
            };

            // 用于指定连接关闭后的回调函数
            ws.onclose = function(event){
                console.log("WebSocket is closed now.", event);
                _this.doAutoLink(event);  // 监听关闭后执行断线重连，真正的关闭是调用stop方法
            };

            // 用于指定连接失败后的回调函数
            ws.onerror = function(event){
                console.error("WebSocket error observed:", event);
                _this.doAutoLink();  // 监听连接失败后执行断线重连，真正的关闭是调用stop方法
            };
        }catch(err){
            console.warn(err)
            this.doAutoLink();    // 调用自动重连
        }
    }

    /**
     * 发送数据到服务端 引入队列机制规避粘包问题
     * @param   {String}   type     要发送的信息关键词
     * @param   {Any}       data     需要发送的消息数据
     * @returns {boolean}
     */
    send(type, data){
        if(type === undefined || typeof type !== 'string') throw new Error('send方法缺少要发送的信息关键词参数type');

        // 如果readyState=2 | readyState=3，说明socket正在关闭或关闭了，所以不需要执行心跳
        if (this.socket.readyState == 2 || this.socket.readyState == 3) return false;

        if (!this.heardStart && type === this.name) return false;

        try{
            if(typeof data === 'function') data = data();
            else if(typeof data === 'string') data = data
            else data = JSON.stringify(data)
        }catch(err){
            data = data.toString()
        }

        // 拼接发送的数据
        let { extraData, name } = this;
        let currentTime = (new Date()).getTime();    // 获取当前的时间戳
        let sendData = { type, data, time: currentTime, }
        if(extraData && extraData.constructor === Object){
            sendData = Object.assign({}, sendData, extraData)
        }
        console.log(sendData)

        this.tempMessage.push(sendData);    // 推到队列中

        if(this.sendTimer === undefined){
            this.sendTimer = setInterval(() =>{
                if (this.socket.bufferedAmount === 0){  // 如果缓冲区在忙碌及等定时器下一轮
                    if (this.tempMessage.length !== 0) {
                        this.socket.send(JSON.stringify(this.tempMessage[0]));
                        let _splice = this.tempMessage.splice(0, 1);  // 发送后将队列的第一项删除

                        _splice[0].type === name && this.onHeardResponse(); // 如果是心跳包
                    } else {
                        clearInterval(this.sendTimer);
                        this.sendTimer = undefined;
                    }
                }
            }, 26);
        }
    }

    // 监听心跳包是否返回
    onHeardResponse(){
        let { heardResponseTime } = this;
        this.heardStatus = false;

        setTimeout(()=>{
            if(this.heardStatus === false){
                this.autoLink = false;  // 禁止断线重连
                this.socket.close()     // 关闭webSocket
            }
        }, heardResponseTime)
    }

    /**
     * 开发者的自定义消息监听
     * @param { String }    type        监听消息的关键词
     * @param { Function }  callback    监听到消息后的回掉
    */
    message(type, callback){
        if(typeof type !== 'string' || typeof callback !== 'function') return false;

        if(!this.dealMessage[type]){
            this.dealMessage[type] = []
        }

        this.dealMessage[type].push(callback);
    }

    // 手动停止会话
    stop(){
        this.autoLink = false;                  // 停止自动重连
        this.tempMessage.length = 0;            // 清空消息队列
        this.socket && this.socket.close();     // 真正执行socket的关闭
        this.distribute('onclose', false)       // 发布用户订阅的 onclose 方法
    }

    /**
     * 开发者订阅的socket指令
     */
    command(type, fn){
        if(this.mode.indexOf(type) !== -1 && typeof fn === 'function'){
            this[type] = fn
        }
    }

    // 发布订阅的socket指令
    distribute(type){
        let arg = [].slice.call(arguments, 1);
        if(this.mode.indexOf(type) !== -1 && typeof this[type] === 'function') this[type].apply(null, arg)
    }

    // 定时心跳
    heartbeat(hard){
        // 如果readyState=2 | readyState=3，说明socket正在关闭或关闭了，所以不需要执行心跳
        if (this.socket.readyState == 2 || this.socket.readyState == 3) return false;

        if (hard) this.send(this.name); // 心跳数据发送

        setTimeout(()=>{
            this.heartbeat(true);       // log('心跳')
        }, this.heardTime);
    }

    // 执行自动重连
    doAutoLink(){
        let { autoLink, autoLinkTime, autoLinkNum } = this;
        if(autoLink){   // 如果自动重连为true
            let autoLinkTimer = setInterval(()=>{
                this.autoLinkNum = ++autoLinkNum;
                if(this.socket){ // 如果 this.socket 不为空的话，说明已经重连成功了，就清除重连定时器
                    clearInterval(autoLinkTimer)
                }else if(this.autoLinkNum > 10){    // 放弃断线重连
                    console.warn('放弃断线重连...');
                    this.stop();
                    clearInterval(autoLinkTimer)
                    return false;
                }else{
                    console.warn('正在重新连接~');
                    this.start()
                }
            }, autoLinkTime)
        }else{  // 如果自动重连为false，那么就手动停止会话
            this.stop()
        }
    }
}
