(function (window) {

    function Player($audio) {
        return new Player.prototype.init($audio);
    };

    Player.prototype = {
        constructor: Player,
        musicList: [],
        init:function ($audio) {
            this.$audio = $audio;
            this.audio = $audio.get(0);
        },
        currentIndex: -1,
        playMusic:function (index, music) {
            // 判断是否是同一首音乐
            if (this.currentIndex == index){
                // 同一首音乐
                if (this.audio.paused){
                    this.audio.play();
                }else {
                    this.audio.pause();
                }
            }else {
                // 不是同一首
                this.$audio.attr("src", music.link_url);
                this.audio.play();
                this.currentIndex = index;
            }
        },
        // 处理索引
        preIndex: function () {
            var index = this.currentIndex - 1;
            if(index < 0){
                index = this.musicList.length - 1;
            }
            return index;
        },
        nextIndex: function () {
            var index = this.currentIndex + 1;
            if (index > this.musicList.length - 1){
                index = 0;
            }
            return index;
        },
        // 删除方法
        changeMusic: function (index) {
            // 删除对应的数据
            this.musicList.splice(index,1);
            // 判断当前删除的是否是正在播放音乐的前面的音乐
            if (index < this.currentIndex) {
                this.currentIndex = this.currentIndex - 1;
            };
        },
        //监听播放进度
        musicTimeUpdate: function (callBack) {
            var $this = this;
            this.$audio.on("timeupdate",function () {
                var duration = $this.audio.duration;
                var currentTime = $this.audio.currentTime;
                var timeStr = $this.formatDate(duration,currentTime);
                $(".music_progress_time").text(timeStr);
                callBack (duration,currentTime,timeStr)
            });
        },
        // 定义一个格式化时间的方法
        formatDate: function (duration,currentTime) {
            var endMin = parseInt(duration/60);
            var endSec = parseInt(duration%60);

            if (endMin < 10){
                endMin = "0"+endMin;
            }
            if (endSec < 10){
                endSec = "0"+endSec;
            }

            var starMin = parseInt(currentTime/60);
            var starSec = parseInt(currentTime%60);
            if (starMin < 10){
                starMin = "0"+starMin;
            }
            if (starSec < 10){
                starSec = "0"+starSec;
            }

            return starMin + ":" + starSec + " / " + endMin +":"+ endSec;
        },
        musicSeekTo: function (value) {
            if (isNaN(value)) return;
            if (value < 0){
                value = 0;
            }
            this.audio.currentTime = this.audio.duration*value;
        },
        musicVolceTo: function (value) {
            this.audio.volume = value;
        },
        musicVoiceSeekTo: function (value) {
            if (isNaN(value)) return;
            if (value < 0 || value > 1)return;
            this.audio.volume = value;
        }

    };

    Player.prototype.init.prototype = Player.prototype;
    window.Player = Player;

})(window);