module.exports = {
    // param： date 毫秒时间戳
    toRecentStr(msTime) {
        console.log(msTime)
        console.log('---------------------')
        let date = parseInt(msTime)
        let time = new Date().getTime();
        time = parseInt((time - date) / 1000);
        let s;
        if (time < 60 * 10) {//十分钟内
            return '刚刚';
        } else if ((time < 60 * 60) && (time >= 60 * 10)) {
            //超过十分钟少于1小时
            s = Math.floor(time / 60);
            return s + "分钟前";
        } else if ((time < 60 * 60 * 24) && (time >= 60 * 60)) {
            //超过1小时少于24小时
            s = Math.floor(time / 60 / 60);
            return s + "小时前";
        } else if ((time < 60 * 60 * 24 * 3) && (time >= 60 * 60 * 24)) {
            //超过1天少于3天内
            s = Math.floor(time / 60 / 60 / 24);
            return s + "天前";
        } else {
            //超过3天
            console.log(date)
            let newDate = new Date(date);
            return newDate.getFullYear() + "/" + (newDate.getMonth() + 1) + "/" + newDate.getDate();
        }
    }
};

