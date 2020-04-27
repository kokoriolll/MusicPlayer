$(function () {


    // 自定义滚动条 初始化
    $(".content_list").mCustomScrollbar();

    var $audio = $("audio");
    var player = new Player($audio);
    var progress;
    var voiceprogress;


    getPalyList();
    // 加载歌曲列表
    function getPalyList() {

        $.ajax({
            url: "source/musiclist.json",
            dataType: "json",
            success: function (data) {
                player.musicList = data;
                // 放在遍历之外，提高浏览器性能
                var $musicList = $(".content_list ul");
                // 遍历获取到的数据，创建音乐
                $.each(data,function (index , ele) {
                    var $item = createMusicItem(index , ele)
                    $musicList.append($item);
                });
                // 初始化歌曲信息
                initMusicInfo(data[0]);
            },
            error: function (e) {
                console.log(e);
            }
        });

    };

    // 初始化歌曲信息
    function initMusicInfo(music) {
        // 获取对应的元素
        var $musicImage = $(".song_info_pic img");
        var $musicName = $(".song_info_name a");
        var $musicSinger = $(".song_info_singer a");
        var $musicAlbum = $(".song_info_ablum a");
        var $musicProgressName = $(".music_progress_name");
        var $musicProgressTime = $(".music_progress_time");
        var $musicBg = $(".mask_bg");
        // 给获取到的元素赋值

        $musicImage.attr("src",music.cover);
        $musicName.text(music.name);
        $musicSinger.text(music.singer);
        $musicAlbum.text(music.album);
        $musicProgressName.text(music.name + "/" + music.singer);
        $musicProgressTime.text("00:00 /" + music.time);
        $musicBg.css("background","url('"+ music.cover +"')");
        //  修改标题
        $(document).attr("title" , "正在播放 " + music.name + "-" + music.singer)
    }


    initProgress();
    // 初始化进度条
    function initProgress() {
        //进度条点击部分
        var $progressBar = $(".music_progress_bar");
        var $progressLine = $(".music_progress_line");
        var $progressDot = $(".music_progress_dot");
        progress = Progress($progressBar,$progressLine,$progressDot);
        progress.progressClick(function (value) {
            player.musicSeekTo(value);
        });
        progress.progressMove(function (value) {
            player.musicSeekTo(value);
        });

        //声音点击部分
        var $voiceBar = $(".music_voice_bar");
        var $voiceLine = $(".music_voice_line");
        var $voiceDot = $(".music_voice_dot");
        voiceprogress = Progress($voiceBar,$voiceLine,$voiceDot);
        voiceprogress.progressClick(function (value) {
            player.musicVoiceSeekTo(value);
        });
        voiceprogress.progressMove(function (value) {
            player.musicVoiceSeekTo(value);
        });
    }

    // 初始化事件监听
    initEvents();

    function initEvents () {
    // 监听歌曲名移入移出事件

        $(".content_list").delegate(".list_music","mouseenter",function () {
            // 显示子菜单
            $(this).find(".list_menu").stop().fadeIn(100);
            $(this).find(".list_time a").stop().fadeIn(100);
            // 隐藏时长
            $(this).find(".list_time span").stop().fadeOut();
        });

        $(".content_list").delegate(".list_music","mouseleave",function () {
            // 隐藏子菜单
            $(this).find(".list_menu").stop().fadeOut(100);
            $(this).find(".list_time a").stop().fadeOut(100);
            // 显示时长
            $(this).find(".list_time span").stop().fadeIn();
        });

        // 监听复选框点击事件
        $(".content_list").delegate(".list_check","click",function () {
            $(this).toggleClass("list_checked");
        });

        // 添加子菜单播放按钮的监听
        var $musicPlay = $(".music_play");
        $(".content_list").delegate(".list_menu_play","click",function () {
            var $item = $(this).parents(".list_music");
            // 切换播放按钮的图标
            $(this).toggleClass("list_menu_play2");
            // 复原其他的播放图标
            $item.siblings().find(".list_menu_play").removeClass("list_menu_play2");
            // 复原其他的文字的颜色
            $item.siblings().find("div").css("color","rgba(255,255,255,0.5)");
            // 复原其他的序号的状态
            $item.siblings().find(".list_number").removeClass("list_number2");
            // 同步下方播放按钮的状态

            // 判断按钮同步状态
            if ($(this).attr("class").indexOf("list_menu_play2") != -1){
                $musicPlay.addClass("music_play2");
                // 让播放中的文字高亮
                $item.find("div").css("color","#FFF");
                // 让列表歌曲序号部分改为动画图标
                $item.find(".list_number").addClass("list_number2");
            }else{
                $musicPlay.removeClass("music_play2");
                // 让播放中的文字删去高亮
                $item.find("div").css("color","rgba(255,255,255,0.5)");
                // 让列表歌曲序号部分恢复数字
                $item.find(".list_number").removeClass("list_number2");
            };
            // 播放音乐
            player.playMusic($item.get(0).index,$item.get(0).music);

            //切换歌曲信息
            initMusicInfo($item.get(0).music);



        });

        // 监听底部按钮的播放点击
        $musicPlay.click(function () {
            // 判断有没有播放过音乐
            if (player.currentIndex == -1){
                // 没有播放过音乐
                $(".list_music").eq(0).find(".list_menu_play").trigger("click");
            }else {
                // 播放过音乐
                $(".list_music").eq(player.currentIndex).find(".list_menu_play").trigger("click");
            }
        });
        // 监听底部按钮的上一首点击
        $(".music_pre").click(function () {
            $(".list_music").eq(player.preIndex()).find(".list_menu_play").trigger("click");
        });
        // 监听底部按钮的下一首点击
        $(".music_next").click(function () {
            $(".list_music").eq(player.nextIndex()).find(".list_menu_play").trigger("click");
        });

        // 监听删除按钮的点击
        $(".content_list").delegate(".list_menu_del","click",function () {

            // 找到被点击的音乐
            var $item = $(this).parents(".list_music");

            // 判断当前删除的是否是正在播放的
            if ($item.get(0).index == player.currentIndex){
                $(".music_next").trigger("click");
            }

            $item.remove();
            player.changeMusic($item.get(0).index);

            // 重新排序
            $(".list_music").each(function (index,ele) {
                ele.index = index;
                $(ele).find(".list_number").text(index + 1);
            });

        });

        //监听播放进度
        player.musicTimeUpdate(function (duration,currentTime,timeStr) {
            $(".music_progress_time").text(timeStr);

            // 计算播放比例
            var value = currentTime / duration * 100;
            progress.setProgress(value);
            /*console.log(value);*/
        });

        // 监听声音按钮的点击

        $(".music_voice_icon").click(function () {
            // 静音图标切换
            $(this).toggleClass("music_voice_icon2");
            // 声音切换
            if ($(this).attr("class").indexOf("music_voice_icon2") != -1 ){
                //静音
                player.musicVolceTo(0);
            }else {
                //恢复声音
                player.musicVolceTo(1);
            }
        });



    };

    // 定义一个方法创建音乐
    function createMusicItem(index , music) {

        var $item = $("<li class=\"list_music\">\n" +
            "                        <div class=\"list_check\"><i></i></div>\n" +
            "                        <div class=\"list_number\">" + (index + 1) + "</div>\n" +
            "                        <div class=\"list_name\">"+ music.name +"" +
            "                            <div class=\"list_menu\">\n" +
            "                                <a href=\"javascript:;\" title=\"播放\" class='list_menu_play'></a>\n" +
            "                                <a href=\"javascript:;\" title=\"添加\"></a>\n" +
            "                                <a href=\"javascript:;\" title=\"下载\"></a>\n" +
            "                                <a href=\"javascript:;\" title=\"分享\"></a>\n" +
            "                            </div>\n" +
            "                        </div>\n" +
            "                        <div class=\"list_singer\">" + music.singer + "</div>\n" +
            "                        <div class=\"list_time\">\n" +
            "                            <span>" + music.time + "</span>\n" +
            "                            <a href=\"javascript:;\" title=\"删除\" class='list_menu_del'></a>\n" +
            "                        </div>\n" +
            "                    </li>");
        $item.get(0).index = index;
        $item.get(0).music = music;
        return $item;

    };

});