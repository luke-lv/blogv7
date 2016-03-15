/**
 * @fileoverview
 *    博客首页音乐播放器组件
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/core/dom/getXY.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/utils/io/jsload.js");
$import("lib/component/class/registComp.js");
$import("lib/component/extend/comp_flash.js");
$registComp(8, {
        /*
         * 载入音乐播放器组件
         */
        "load": function () {
            var musicPlayer = ['<div class="widgetcen" style="height:395px;">'
                ,
                '<div class="widgetconn"><div id="musicPlayerContainer" style="position:absolute;height:395px;z-index:99;">'
                , '<div id="musicDiv" style="display:block;left:0px;top:0px; position:relative; z-index:100;'
                , ' height:395px; margin:0; padding:0px;">'
                , '<div id="musicPlayer" style="display:block;position:absolute; left:0px; z-index:99;  padding:0px;'
                , ' margin:0px; width:190px; height:395px;">'
                ,
                    '</div></div></div>' + (!$isAdmin ? '<div class="cloneLink">' + '<a title="添加到我的博客" href="#" onclick="Lib.Component.clone(8, ' + this.size + ');return false;"><img alt="" src="http://simg.sinajs.cn/blog7style/images/widget/add1.gif" /> ' + '添加到我的博客</a></div>' : '') + '</div></div>'].join("");

            var node = Core.Dom.getElementsByClass(this.getContent(), "div", "wdtLoading")[0];
            node.className = (node.parentNode.className != "cloneWidget") ? "cloneWidget" : '';
            node.innerHTML = musicPlayer;

            Utils.Io.JsLoad.request("http://music.sina.com.cn/shequ/js/bmp/common1.3.js?1", {
                noreturn: true, isRemove: false
            });

            //Utils.Io.JsLoad.request("http://music.sina.com.cn/mycd/js/r.js", {
            //	noreturn : true
            //});

            var addFlash = function () {
                var sinaFlash2 = new sinaFlash("http://music.sina.com.cn/shequ/player/sina_music1_2_1.swf?1", "bmp_Music", "100%", "395", "9", "#FFFFFF", false, "High", "http://www.sina.com.cn/", "http://www.sina.com.cn/", false);
                sinaFlash2.addVariable("uid", scope.$uid);
                sinaFlash2.addVariable("nick", document.title.replace('_新浪博客', ''));
                sinaFlash2.addParam("allowScriptAccess", "always");
                sinaFlash2.addParam("allowNetworking", "all");
                sinaFlash2.addParam("wmode", "transparent"); //modified xiaoyue3原来值为window，改成透明 广告浮层显示出来
                sinaFlash2.write("musicPlayer");
            };
            if (typeof sinaFlash == "undefined") {
                Utils.Io.JsLoad.request("http://i3.sinaimg.cn/home/sinaflash.js", {
                    onComplete: addFlash, isRemove: false
                });
            } else {
                addFlash();
            }
            if (scope.$pageid == "pageSetM" && this.setManage) {
                this.setManage();
            }

            this.hideTip();

        }, hideTip: function () {
            Lib.checkAuthor();
            var rets = location.search.match(new RegExp("(\\?|&)oplayer=([^&]*)(&|$)"));
            if ($isAdmin && rets && rets[2] == "1") {

                winDialog.confirm('是否要隐藏旧版播放器？隐藏后旧版播放器的数据不会丢失，您可以在页面设置中找到并进行添加。', {
                    funcOk: function () {
                        moduleHidden('8')
                    },
                    textOk: '确定',
                    textCancel: '取消'
                });
            }
        }
        /*
         * 设置留言组件的管理链接，仅在页面设置留言组件的时候会用到
         */, "setManage": function () {

            if ($isAdmin && this.getManage()) {

                this.getManage().innerHTML = '<span class="move"><a href="#" ' + 'onclick="funcMoveUpDown.up(' + this.compId + ');return false;">↑</a><a href="#" ' + 'onclick="funcMoveUpDown.down(' + this.compId + ');return false;">↓</a></span>' + '<a href="#" onclick="hiddenComponents(\'' + this.compId + '\');return false;" class="CP_a_fuc">[<cite>隐藏</cite>]</a>';
            }
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
            if (bForceRequest == true) {
//			Debug.log("强制刷新：" + this.compId);
                this.load();
            } else {
//			Debug.log("缓存刷新：" + this.compId);
                this.load();
            }
            if (bAddManage) {
                this.setManage();
            }
        }
    }, 'flash');