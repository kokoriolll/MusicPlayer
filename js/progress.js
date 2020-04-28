(function (window) {

    function Progress($progressBar,$progressLine,$progressDot) {
        return new Progress.prototype.init($progressBar,$progressLine,$progressDot);
    }

    Progress.prototype = {
        constructor: Progress,
        init: function ($progressBar,$progressLine,$progressDot) {
            this.$progressBar = $progressBar;
            this.$progressLine = $progressLine;
            this.$progressDot = $progressDot;
        },
        isMove: false,
        progressClick: function (callBack) {
            // 此时此刻的this是progress
            var $this = this;
            //监听背景的点击
            this.$progressBar.click(function (event) {
                // 获取背景距离窗口默认的位置
                var normalLeft = $(this).offset().left;
                // 获取点击的位置距离窗口的位置
                var eventLeft = event.pageX;
                // 设置前景的宽度
                $this.$progressLine.css("width", eventLeft - normalLeft);
                $this.$progressDot.css("left", eventLeft - normalLeft);
                // 计算进度条的比例
                var value = (eventLeft - normalLeft) / $(this).width();
                callBack (value);
            });
        },

        progressMove: function (callBack) {
            var $this = this;
            //鼠标按下事件
            this.$progressBar.mousedown(function () {
                // 获取背景距离窗口默认的位置
                $this.isMove = true;
                var normalLeft = $(this).offset().left;
                var barWidth = $(".music_progress_bar").width();
                //鼠标移动事件
                this.$progressBar.mousemove(function (event) {

                    // 获取点击的位置距离窗口的位置
                    var eventLeft = event.pageX;
                    var offset = eventLeft - normalLeft;

                    if (offset >= 0 && offset <= barWidth){
                        // 设置前景的宽度
                        $this.$progressLine.css("width", eventLeft - normalLeft);
                        $this.$progressDot.css("left", eventLeft - normalLeft);
                    };


                });
            });
            //鼠标抬起事件
            this.$progressBar.mouseup(function (event) {
                this.$progressBar.off("mousemove");
                $this.isMove = false;
                var eventLeft = event.pageX;
                var normalLeft = $(".music_progress_bar").offset().left;
                // 计算进度条的比例
                var value = (eventLeft - normalLeft) / $this.$progressBar.width();
                callBack (value);
            })

        },
        setProgress: function (value) {
            if (this.isMove) return;
            var $this = this;
            $this.$progressLine.css("width", value + "%");
            $this.$progressDot.css("left", value + "%");
        }


    };

    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress = Progress;

})(window);