(function (window) {
    function Lyric(path) {
        return new Lyric.prototype.init(path);
    }
    Lyric.prototype = {
        constructor: Lyric,
        init: function (path) {
            this.path = path;
        },
        times: [],
        lyrics: [],
        index: -1,
        loadLyric: function (callBack) {
            var $this = this;
            $.ajax({
                url: $this.path,
                dataType: "text",
                success: function (data) {
                    $this.parseLyric(data);
                    callBack();
                },
                error: function (e) {
                    console.log(e);
                }
            });
        },
        parseLyric: function (data) {
            var $this = this;
            // 清空上一首歌词的歌词和时间
            $this.times = [];
            $this.lyrics = [];
            var array = data.split("\n");
            //  变量取出每一条歌词

            // 定义正则表达式
            var timeReg = /\[(\d*:\d*\.\d*)\]/
            $.each(array,function (index,ele) {

                var lrc = ele.split("]")[1];
                //排除空字符串
                /*console.log(lrc.length);
                console.log(lrc);*/
                if (lrc.length ==1)return true;
                $this.lyrics.push(lrc);

                var res = timeReg.exec(ele);


                if (res == null) return true;
                var timeStr = res[1];
                var res2 = timeStr.split(":");
                var min = parseInt(res2[0]*60);
                var sec = parseFloat(res2[1]);
                // 保留两位小数之后变为字符串形式，需要转换成Number类型 两种方法都可以
                /*var time = + Number(min + sec).toFixed(2);*/
                var time = parseFloat(Number(min + sec).toFixed(2));

                $this.times.push(time);
            });
            /*console.log($this.times);
            console.log($this.lyrics);*/
        },
        currentIndex: function (currentTime) {
            /*console.log(currentTime);*/
            if (currentTime >= this.times[0]) {
                this.index++;
                this.times.shift(); //删除数组中最前面的一个元素
            }
            return this.index;
        }
    };
    Lyric.prototype.init.prototype = Lyric.prototype;
    window.Lyric = Lyric;
})(window);