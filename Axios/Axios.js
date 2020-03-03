let intance = null

export default (function() {
    class Axios {
        constructor () {
            this.version = '1.0.0'
            // 默认的配置
            this.ajaxSettings = {
                url: location.href,    // 默认的url为本地地址
                type: "GET",           // 默认请求的方法为GET
                async: true,           // 默认为异步请求
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",   // POST发送数据时设置头信息时候要使用
                timeout: null,         // 默认不看延迟事件
                dataType: 'JSON',      // 默认认为请求的数据是JSON
                success: function(){},
                error: function(){},
                complete: function(){}
            }
        }

        // 判断是不是对象
        isObject(obj) {
            // 防止typeof对null的误判
            if (obj === null) {return false }
            // 如果是object或function，那就是对象
            if (typeof obj === 'object' || typeof obj === 'function') { return true }
            return false;
        }

        // 对象的合并操作
        ObjectAssign(){
            var i = 1, 
                key,
                arg = arguments,
                target = arg[ 0 ],
                argLen = arg.length;

            // 参数个数为1时，目标改为this，起始i改为0
            if( argLen === 1 ) {
                target = this;
                i = 0;
            }
            // 遍历得到arguments中的对象
            for( ; i < argLen; i++ ) {
                // 遍历每一个对象所有的属性
                for( key in arg[ i ] ) {
                    target[ key ] = arg[ i ][ key ];
                }
            }
            // 给谁混入返回谁
            return target;
        }

        // 把对象转换为url参数形式的字符串
        urlStringify( data ) {
            var result = '', key;
            // 传入的不是对象，就直接返回空字符串
            if( !this.isObject( data ) ) {
                return result;
            }
            for( key in data ) {
                // 为了防止IE发送的汉字路乱码，所以需要统一编码一下
                result += window.encodeURIComponent( key ) + '=' + window.encodeURIComponent( data[ key ] ) + '&';
            }
            // 从0截取到倒数第一个字符串返回
            return result.slice( 0, -1 );
        }

        // 加工options
        processOptions( options ) {
            var optionsNew = {};

            // 合并用户和默认的配置项，得到一份新的
            optionsNew = {};
            this.ObjectAssign( optionsNew, this.ajaxSettings, options );

            // 对data进行加工处理
            optionsNew.data = this.urlStringify( optionsNew.data );

            // 把type统一转换为大写，防止意外
            optionsNew.type = optionsNew.type.toUpperCase();

            // 如果是GET请求，把数据加到URL中
            if( optionsNew.type === 'GET' ) {
                optionsNew.url += optionsNew.data && ('?' + optionsNew.data);
                optionsNew.data = null;
            }

            // 返回加工后的配置
            return optionsNew;
        }

        // ajax封装
        request( options ) {

            var optionsNew, xhr, result;

            // 加工得到一份处理好的配置项
            optionsNew = this.processOptions( options );

            // 创建xhr对象，发送请求
            xhr = new XMLHttpRequest();
            xhr.open( optionsNew.type, optionsNew.url, optionsNew.async );

            // 如果为post请求，添加一个请求头
            if( optionsNew.type === 'POST' ) {
                xhr.setRequestHeader( 'Content-Type', optionsNew.contentType );
            }

            // 如果有传入headers对象参数，那么就添加请求头信息
            if(this.isObject(optionsNew.headers)){
                for(var key in optionsNew.headers){
                    xhr.setRequestHeader( key, optionsNew.headers[key] );
                }
            }

            xhr.send( optionsNew.data );

            xhr.onreadystatechange = function() {

                // 先判断请求是否完成，完成就执行complate方法
                if( xhr.readyState === 4 ) {
                    optionsNew.complete();

                    // 判断请求是否成功，成功过就执行successs方法，失败执行error方法
                    if( ( xhr.status >= 200 && xhr.status < 300 ) || xhr.status === 304 ) {
                        // 根据预期的dataType对数据进行处理
                        switch ( optionsNew.dataType ) {
                            case 'JSON':
                                result = JSON.parse( xhr.responseText );
                                break;
                            case 'script':
                                eval( xhr.responseText );
                                result = xhr.responseText;
                                break;
                            default:
                                result = xhr.responseText;
                                break;
                        }
                        optionsNew.success( result );
                    }else {
                        optionsNew.error( xhr.status );
                    }
                }
            };
        }

        get( url, data = {} ) {
            return new Promise((resolve, reject) => {
                this.ajax({ url: url, data: data, success: resolve, error: reject });
            })
        }

        post( url, data = {} ) {
            return new Promise((resolve, reject) => {
                this.ajax({ type: 'POST', url: url, data: data, success: resolve, error: reject })
            })
        }
    }

    if (intance === null) {
        intance = new Axios()
    }
    return intance
})()
