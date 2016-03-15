/**
 * @fileoverview
 *    读取指定的视频并调用 Flash 播放器来播放它
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/core/function/bind2.js");
$import("sina/core/function/bind3.js");
$import("sina/core/string/decodeHTML.js");
$import("sina/core/string/encodeHTML.js");
$import("sina/ui/template.js");

$import("lib/app.js");
$import("lib/interface.js");

App.playVideo = Core.Class.create();

App.playVideo.prototype = {
    // 初始化
    "initialize": function (sVid, sUid) {
        this.vid = sVid;
        this.uid = sUid;
        // 如果不是推荐视频，就加载视频详细信息后再播放，否则直接播放
        if (this.vid != -1) {
            this.loadVideoInfo();
        } else {
            this.playVideo(this.vid, this.uid);
//			this.showVideoInfo({});
        }
    }
    // 加载当前视频的详细信息
    , "loadVideoInfo": function () {
        new Interface("http://you.video.sina.com.cn/api/videoInfo.php", "jsload").request({
            GET: {
                "video": this.vid + "-" + this.uid,
                "varname": "requestId_vi_" + this.uid
            }, onSuccess: Core.Function.bind2(function (oData) {
                this.showVideoInfo(oData.videoInfo);
                this.playVideo(this.vid, this.uid);
            }, this)
        });
    }
    // 展示当前视频的信息
    , "showVideoInfo": function (oData) {
        // 如果有上一个播放的视频存在，先恢复它的描述为正常状态
        var lastVideo = this.currentVideo;
        if (lastVideo != null && oData != null) {
            var last = $E("comp_10005_" + lastVideo.vid + "_" + lastVideo.uid);
            if (last != null) {
                var html_normal = '<div class="SG_dot"></div><a href="#" ' + 'onclick="playMyVideo(' + lastVideo.vid + ', ' + lastVideo.uid + ');return false;"' + ' title="' + lastVideo.name + '">' + Core.String.encodeHTML(App.format(Core.String.decodeHTML(lastVideo.name), 26)) + '</a>';
                last.innerHTML = html_normal;
                last.className = "SG_j_linedot1";
            }
        }
        this.currentVideo = oData || this.currentVideo;
        var current = $E("comp_10005_" + this.vid + "_" + this.uid);
        if (current != null) {
            // 显示当前视频信息
            var html = [ '<a href="#" onclick="playMyVideo(' + this.vid + ', ' + this.uid + ');return false;">'
                , '<img src="#{videoImage}" alt="#{name}" title="#{name}" /></a>'
                , '<div class="vltxt"><a href="#" onclick="playMyVideo(' + this.vid + ', ' + this.uid + ');'
                , 'return false;" title="#{name}">#{wbrName}</a>'
                , '<div class="vltime SG_txtb">#{time}</div></div><div class="clearit"></div>'].join("");
            this.currentVideo.time = this.formatTime(this.currentVideo.timeLength);
            this.currentVideo.vid = this.vid;
            this.currentVideo.wbrName = Core.String.decodeHTML(this.currentVideo.name).replace(/(.)/gi, "$1<wbr/>");
            var template = new Ui.Template(html);
            var result = template.evaluate(this.currentVideo);
            current.innerHTML = result;
            current.className = "cur SG_j_linedot1";
        }
    }
    // 格式化时间
    , "formatTime": function (sTime) {
        sTime = sTime * 1;
        var m = Math.floor(sTime / 60);
        var s = sTime % 60;
        var _res = m + ":0" + s;
        return _res.replace(/(\d+)/g, function (a, b) {
            return (b.length > 2) ? b.replace(/^0+/, "") : b;
        });
    }
    // 判断播放器是否就绪
    , "isPlayerReady": function () {
        return (typeof scope.isPlayerReady != "undefined" && scope.isPlayerReady == true);
    }
    // 播放指定 VID 的视频
    , "playVideo": function (sVid, sUid) {
        // 如果播放器可用
        if (this.isPlayerReady()) {
            try {
                trace("开始播放 " + sVid + "_" + sUid);
                //
                if (this.isPlayerInit == null) {
                    //增加了播放接口参数  1 代表有广告 0代表无
                    $E("myMovie").playVideo(sVid, sUid);
                    this.isPlayerInit = true;
                } else {
                    $E("myMovie").setAutoPlay(1);
                    $E("myMovie").playVideo(sVid, sUid);
                }
                scope.isPlayerReady = false;
            } catch (e) {
            }
        } else {
            setTimeout(Core.Function.bind3(this.playVideo, this, [sVid, sUid]), 500);
        }
    }
};
