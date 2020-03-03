export default class UtilsTime{
    /**
     * 时间戳转过去式时间
     */
    static formerlyTime(timestamp){
        let currentUnixTime = Math.round((new Date()).getTime() / 1000);
        let deltaSecond = currentUnixTime - parseInt(timestamp, 10);
        let result;
        if (deltaSecond < 60) {
            result = deltaSecond + '秒前';
        } else if (deltaSecond < 3600) {
            result = Math.floor(deltaSecond / 60) + '分钟前';
        } else if (deltaSecond < 86400) {
            result = Math.floor(deltaSecond / 3600) + '小时前';
        } else {
            result = Math.floor(deltaSecond / 86400) + '天前';
        }
        return result;
    }

    // 格式化时间
    static formatDate(d, fmt, isString = false){
        if (d == null) return '';
        let datetime = d;
        if (isString) datetime = new Date(Date.parse(String(datetime).replace(/-/g, "/")));
        let o = {
            "M+": datetime.getMonth() + 1, //月份 
            "d+": datetime.getDate(), //日 
            "h+": datetime.getHours(), //小时 
            "m+": datetime.getMinutes(), //分 
            "s+": datetime.getSeconds(), //秒 
            "q+": Math.floor((datetime.getMonth() + 3) / 3), //季度 
            "S": datetime.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (datetime.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o){
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
        return fmt;
    }
}
