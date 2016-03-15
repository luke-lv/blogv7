/**
 * @fileoverview
 *    博客首页视频播放器组件 id=10005
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/core/array/foreach.js");
$import("sina/core/function/bind2.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/string/decodeHTML.js");
$import("sina/core/string/encodeHTML.js");
$import("sina/utils/io/jsload.js");
$import("sina/ui/template.js");

$import("lib/component/class/registComp.js");
$import("lib/component/extend/comp_dynamic.js");
$import("lib/interface.js");
$import("lib/showError.js");

$import("component/include/playlist.js");
$import("component/include/playVideo.js");

/**
 * 格式化字符串
 * 播放列表视频标题保持一行显示，超出20个字（40个字节）时，从中间开始缩略。
 * 缩略规则为：
 *        若标题长度为N，N-20个汉字为超出长度P，则从第10个汉字开始缩略P个字符，以省略号显示，再显示剩余字符。
 *        保证除开省略号外，最多不超出20个汉字。
 */
App.format = function (sInput, sLength) {
    sLength = sLength || 40;
    var half = Math.floor(sLength / 2);
    sInput = sInput.replace(/<wbr>/gi, "");
    if (Core.String.byteLength(sInput) <= sLength) {
        return sInput;
    } else {
        var str = sInput.replace(/([\u00ff-\ufffe])/gi, "\uffff$1");
        str = str.replace(new RegExp("^(.{" + half + "})(.+)(.{" + half + "})$"), "$1...$3");
        str = str.replace(/\uffff/g, "");
        return str;
    }
};

$registComp(10005, {
    /*
     *	读取用户当前的 Flash 组件配置信息接口
     */
    "Interface": new Interface("http://control.blog.sina.com.cn/riaapi/component_config/read_component.php", "ijax")
    /*
     * 按尺寸加载 Flash 播放器
     */, "load": function () {
        if (this.player) {
            this.player.isPlayerInit = null;
        }
        // 先获取组件设置的专辑 ID 号
        if (this.tid == null && scope.$playids[this.compId] != null) {
            this.tid = scope.$playids[this.compId];
            this["render_" + this.size]();
        } else {
            this.Interface.request({
                POST: {
                    title_code: this.compId
                }, onSuccess: Core.Function.bind2(function (oData) {
                    this.tid = oData[this.compId]._default == 1 ? 0 : oData[this.compId].my_body.cat;
                    this["render_" + this.size]();
                }, this)
            });
        }
    }, "loadFlash": function (opt) {
        var _this = this;

        this.playlist = new App.playlist(this.tid, scope.$uid);

//		if(this.isPlayerInit == null || $E("comp_10005_playlist") == null){
        this.setContent([ (!$isAdmin ? '<div class="cloneWidget">' : '') + '<div class="' + this.cntClass + '">'
            , '<div id="flashVideoPlayer" class="' + this.playerClass + '">&nbsp;</div>'
            , '<div class="' + this.listClass + '">'
            , '<ul id="comp_10005_playlist" ' + (this.size == 730 ? 'class="minvideo"' : '')
            , '><li>视频列表读取中……</li>'
            , '</ul>'
            , '<div class="videopage"><div id="comp_10005_page" class="SG_page"></div>'
            , '</div></div>'
            , '</div>'
            ,
            ($isAdmin ? '' : '<div class="cloneLink"><a title="添加到我的博客" href="#" onclick="' + 'Lib.Component.clone(' + this.compId + ', ' + this.size + ');return false;"><img alt="" src="http://' + 'simg.sinajs.cn/blog7style/images/widget/add1.gif" /> 添加到我的博客</a></div></div>')
        ].join(""));
        //播放器就绪调用的函数
        // window.playCompleted = Core.Function.bind2(function () {
        // 	//				Debug.info("播放器就绪");
        // 	scope.isPlayerReady = true;
        // 	this.loadCateList();
        // }, this);
        // 先获取组件设置的专辑 ID 号
        Utils.Io.JsLoad.request("http://video.sina.com.cn/js/sinaFlashLoad.js", {
            onComplete: function () {

                var _player = sinaVideoPlayer(opt);
                _player.on("flashInitCompleted", function () {
                    scope.isPlayerReady = true;
                    _this.loadCateList();
                    //_player.playVideo("99555836","0",0);
                });
                _player.on("playCompleted", function () {
                    //player.playVideo("99555836","0",0);
                    scope.isPlayerReady = true;
                    _this.loadCateList();
                });
                _player.init();
                //SinaBokePlayer_o.showFlashPlayer();
            }, isRemove: !1, noreturn: true
        });
        window.playMyVideo = Core.Function.bind2(function (sVid, sUid) {
            scope.isPlayerReady = true;
            this.playStart(sVid, sUid);
        }, this);
        this.isPlayerInit = true;
//		}else{
//			scope.isPlayerReady = true;
//			this.loadCateList();
//		}
    }
    // 正常顺序自动播放，程序从 playlist 获得下一个要播放的视频列表
    , "loadCateList": function (oVideo, oPageData) {
        if (oVideo == null) {
//			Debug.log("从 playlist 获得下一个要播放的视频列表");
            this.playlist.getNextVideo(Core.Function.bind2(this.loadCateList, this));
        } else {
            if (oPageData != null) {
//				Debug.log("渲染视频列表");
//				Debug.dir(oPageData);
                this.showList(oPageData);
                this.pageList = oPageData;
            } else if (this.playlist.total == 0) {
                $E("comp_10005_playlist").innerHTML = '<li>此专辑无视频。</li>';
                $E("comp_10005_page").innerHTML = '';
            }
            this.playStart(oVideo[0], oVideo[1], true);
        }
    }
    // 手动控制播放指定视频
    , "playStart": function (sVid, sUid, bAuto) {
        if (this.player == null) {
            this.player = new App.playVideo(sVid, sUid);
        } else {
            this.player.initialize(sVid, sUid);
        }
        // 记录正在播放的视频
        this.vid = sVid;
        this.uid = sUid;
        if (bAuto != true) {
            this.playlist.setAsCurrent(sVid, sUid, this.page);
        }
    }
    // 渲染当前页列表
    , "showList": function (oPageData) {

        // 渲染列表
        var html = '<li id="comp_10005_#{vid}_#{uid}" class="SG_j_linedot1">' + '<div class="SG_dot"></div><a href="#" ' + 'onclick="playMyVideo(#{vid}, #{uid});return false;" title="#{name}">#{shortName}</a></li>';
        var template = new Ui.Template(html);
        Core.Array.foreach(oPageData.data, function (oItem) {
            oItem.shortName = Core.String.encodeHTML(App.format(Core.String.decodeHTML(oItem.name), 26));
        });
        var result = template.evaluateMulti(oPageData.data);
        $E("comp_10005_playlist").innerHTML = result;

        // 检查当前播放的视频是否与被渲染的页码相同，是就渲染它的缩略图条目
        if (this.vid != null && this.uid != null) {
//			var check = "已经有视频在播放了";
            Core.Array.foreach(oPageData.data, Core.Function.bind2(function (oItem) {
                if (oItem.vid == this.vid && oItem.uid == this.uid) {
//					check += "，且该视频在当前页";
                    this.player.showVideoInfo();
                }
            }, this));
//			Debug.info(check);
        }

        // 设置分页
        this.page = oPageData.page || 1;
        if (oPageData.totalPage > 1) {
            Ui.Pagination.init({
                "pageNode": "comp_10005_page"						// 用于写入分页的节点,class="XX_page"的div
                , "nodeClassNamePrefix": "SG"						// CSS 样式前缀
                , "curPage": oPageData.page						// 当前页码
                , "maxPage": oPageData.totalPage					// 最大页码数
                , "pageTpl": Core.Function.bind2(this.goPage, this)// 跳转的页面规则
                , "type": 2
            }).show();
        } else {
            $E("comp_10005_page").parentNode.style.display = "none";
        }
    }
    // 手动跳转到某一页，并不播放视频
    , "goPage": function (nPage) {
        this.page = nPage;
        Core.Function.bind2(this.playlist.getPageInfo, this.playlist)(nPage, Core.Function.bind2(this.showList, this));
    }, "render_210": function () {
        window.sinaBokePlayerConfig_o = {
            "container": "flashVideoPlayer",  //Div容器的id
            "width": 190,			//宽
            "height": 166,			//高
            "autoLoad": 1,			//自动加载
            "autoPlay": 0,			//自动播放
            "pid": 478,
            "tid": 5,
            "as": 0,			//广告
            "tiAD": 0,
            "tj": 0,			//推荐
            "continuePlayer": 1,
            "casualPlay": 1,            //任意拖动视频
            "head": 0,            //播放片头动画
            "logo": 0
        };
        this.cntClass = "VP_small";
        this.playerClass = "videoplayer_s";
        this.listClass = "videolist v_ws";
        this.loadFlash(sinaBokePlayerConfig_o);
    }, "render_510": function () {
        window.sinaBokePlayerConfig_o = {
            "container": "flashVideoPlayer",  //Div容器的id
            "width": 468,			//宽
            "height": 377,			//高
            "autoLoad": 1,			//自动加载
            "autoPlay": 0,			//自动播放
            "pid": 478,
            "tid": 5,
            "as": 0,			//广告
            "tiAD": 0,                    //显示擎天柱广告
            "tj": 0,			//推荐
            "continuePlayer": 1,            //连续播放
            "casualPlay": 1,            //任意拖动视频
            "head": 0,            //播放片头动画
            "logo": 0
        };
        this.cntClass = "VP_midd";
        this.playerClass = "videoplayer";
        this.listClass = "videolist v_wm";
        this.loadFlash(sinaBokePlayerConfig_o);
    }, "render_730": function () {
        window.sinaBokePlayerConfig_o = {
            "container": "flashVideoPlayer",  //Div容器的id
            "width": 482,			//宽
            "height": 388,			//高
            "autoLoad": 1,			//自动加载
            "autoPlay": 0,			//自动播放
            "pid": 478,
            "tid": 5,
            "as": 0,			//广告
            "tiAD": 0,
            "tj": 0,			//推荐
            "continuePlayer": 1,            //连续播放
            "casualPlay": 1,            //任意拖动视频
            "head": 0,            //播放片头动画
            "logo": 0
        };
        this.cntClass = "VP_big";
        this.playerClass = "videoplayer";
        this.listClass = "videolist";
        this.loadFlash(sinaBokePlayerConfig_o);
    }
    /*
     * 重新加载组件
     * @param {Number}	sSize			按什么尺寸重载
     * @param {Boolean}	bAddManage		是否需要加管理链接
     * @param {Boolean}	bForceRequest	是否强制刷新
     */, reload: function (sSize, bAddManage, bForceRequest) {
        var sizeCorrect = sSize == null || (sSize && (sSize == 210 || sSize == 510 || sSize == 730));
        if (!sizeCorrect) {
//			Debug.error("请检查传入的组件尺寸是否正确。" + sSize);
            return;
        }
        this.size = sSize || this.size;
        this.getContent().innerHTML = '<div class="wdtLoading"><img src="http://simg.sinajs.cn/blog7style/' + 'images/common/loading.gif" />加载中…</div>';
        this.isSetOn = null;
        if (bForceRequest == true || this.cacheData == null) {
//			Debug.log("强制刷新：" + this.compId);
            this.load();
        } else {
//			Debug.log("缓存刷新：" + this.compId);
            this["render_" + this.size]();
        }
        if (bAddManage) {
            this.setManage();
        }
    }
}, "dynamic");