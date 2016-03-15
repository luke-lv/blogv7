/**
 * @fileoverview
 *    博客首页相册播放器组件 id=10004
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/core/dom/insertHTML.js");
$import("sina/core/dom/removeNode.js");
$import("sina/core/function/bind2.js");
$import("sina/core/string/leftB.js");
$import("sina/core/string/decodeHTML.js");
$import("sina/core/string/encodeHTML.js");
$import("sina/core/string/byteLength.js");
$import("sina/utils/io/jsload.js");
$import("sina/ui/template.js");
$import("sina/utils/isInViewPage.js");

$import("lib/component/class/registComp.js");
$import("lib/component/extend/comp_dynamic.js");
$import("lib/interface.js");
$import("lib/showError.js");
$import("lib/sendLog.js");
$import("lib/checkAuthor.js");

$import("sina/core/dom/getElementsByClass.js");
$import("sina/ui/tween/tweenStrategy.js");
$import("sina/ui/tween/transition.js");

scope.bofangqiisin = true;//播放器是否在可见区域内，默认是在，这样不会在滚瓶中卡住第一张图片

$registComp(10004, {
    /*
     * 保存当前相册专辑ID
     */
    "currentCtgid": null
    /*
     * 图片播放器 SWF 地址
     */
    //,"swfurl"	: $_GLOBAL.flashBasicURL + "GalleryV2.swf"
    /*
     *	读取用户当前的 Flash 组件配置信息接口
     */, "Interface": new Interface("http://control.blog.sina.com.cn/riaapi/component_config/read_component.php", "ijax")
    /*
     * 按尺寸加载 Flash 播放器
     */, "load": function () {
        // 先获取组件设置的专辑 ID 号
        if (this.currentCtgid == null && scope.$playids[this.compId] != null) {
            this.currentCtgid = scope.$playids[this.compId];
            this["render_" + this.size]();
        } else {
            this.Interface.request({
                POST: {
                    title_code: this.compId
                }, onSuccess: Core.Function.bind2(function (oData) {
                    this.currentCtgid = oData[this.compId]._default == 1 ? 0 : oData[this.compId].my_body.cat;
                    this["render_" + this.size]();
                }, this)
            });
        }
        if (scope.$pageid == "pageSetM" && this.setManage) {
            this.setManage();
        }

        //加入获得该组件是否在页面内的代码---------
        var scrollfun = function () {
            var scrollfuninterval = setTimeout(function () {
                scope.bofangqiisin = Utils.isInViewPage($E('module_10004'), true);
                //trace("is in view="+scope.bofangqiisin);
                Core.Events.addEvent(window, scrollfun, 'scroll');
            }, 500);

            Core.Events.removeEvent(window, scrollfun, 'scroll');
        };
        Core.Events.addEvent(window, scrollfun, 'scroll');

        var resizefun = function () {
            var scrollfuninterval = setTimeout(function () {
                scope.bofangqiisin = Utils.isInViewPage($E('module_10004'), true);
                //trace("is in view="+scope.bofangqiisin);
                Core.Events.addEvent(window, resizefun, 'resize');
            }, 500);

            Core.Events.removeEvent(window, resizefun, 'resize');
        };
        Core.Events.addEvent(window, resizefun, 'resize');
        //---------------------------------------

    }, "render_210": function () {

        this.flash_width = 208;
        this.flash_height = 208;
        this.pad = "0 0 0 1";
        this.insertFlash();
    }, "render_510": function () {
        this.flash_width = 508;
        this.flash_height = 340;
        this.pad = "0 0 0 1";
        this.insertFlash();
    }, "render_730": function () {
        this.flash_width = 728;
        this.flash_height = 485;
        this.pad = "0 0 0 1";
        this.insertFlash();
    }, "insertFlash": function () {
        var data = {
            url: this.swfurl,
            width: this.flash_width,
            height: this.flash_height, vars: {
                "uid": scope.$uid
            }
        };
        if (this.currentCtgid && this.currentCtgid != 0) {
            data.vars.ctgid = this.currentCtgid;
        }
        var _cnt = "comp_" + this.compId + "_content";

        /*************************************************在组件标题栏 增加 收起展开 按钮******************************/

        var _this = this;

        var headNode = Core.Dom.byClz($E("module_" + this.compId), "div", "SG_connHead")[0];

        /****点击管理 同页面设置************/
        var editBtns = Core.Dom.byClz(headNode, 'a', 'CP_a_fuc');
        if (editBtns[0] && $isAdmin) {
            editBtns[0].onclick = function () {
                Lib.Component.set(_this.compId);
                return false;
            };
        }

        /****添加收起 功能************/
        if (scope.$pageid != "pageSetM" && this.size != 210 && !(/resizeAlbum/i).test(headNode.innerHTML)) {
            var span = $C('span');
            span.className = "edit";
            span.innerHTML = '<a class="CP_a_fuc resizeAlbum" href="#">[<cite>收起</cite>]</a>';

            headNode.insertBefore(span, headNode.lastElementChild || headNode.lastChild);

        }
        /*****************************************************************************************************************/

        this.getContent().innerHTML = (!$isAdmin ? '<div class="cloneWidget" style="padding:0 0 10px;">' : '') + '<div id="' + _cnt + '" class="PrWrap" style="padding: ' + this.pad + 'px; width: auto;"></div>' + ($isAdmin ? '' : '<div class="cloneLink"><a title="添加到我的博客" href="#" onclick="' + 'Lib.Component.clone(' + this.compId + ', ' + this.size + ');return false;"><img alt="" src="http://' + 'simg.sinajs.cn/blog7style/images/widget/add1.gif" /> 添加到我的博客</a></div></div>');

        // allowScriptAccess always
        var addFlash = Core.Function.bind2(function () {
            var sinaFlash2 = new sinaFlash($_GLOBAL.flashBasicURL + "AlbumV1.swf", "compflash_" + this.compId, this.flash_width, this.flash_height, "9", "#FFFFFF", false, "High", "http://www.sina.com.cn/", "http://www.sina.com.cn/", false);
            sinaFlash2.addVariable("uid", scope.$uid);
            if (this.currentCtgid && this.currentCtgid != 0) {
                sinaFlash2.addVariable("ctgid", this.currentCtgid);
            }
            sinaFlash2.addVariable("admin", $isAdmin);
            sinaFlash2.addParam("allowScriptAccess", "always");
            sinaFlash2.addParam("wmode", "transparent");
            sinaFlash2.addParam("allowfullscreen", "true");
            sinaFlash2.write("comp_" + this.compId + "_content");

            if (scope.$pageid != "pageSetM" && this.size != 210) {
                setTimeout(addResizeBtn, 0);
            }

        }, this);
        if (typeof sinaFlash == "undefined") {
            Utils.Io.JsLoad.request("http://i3.sinaimg.cn/home/sinaflash.js", {
                onComplete: addFlash, noreturn: true, isRemove: false
            });
        } else {
            addFlash();
        }

        /*
         * 收起-展开 相册
         *meichun1@staff.sina.com.cn
         *15:11 2010/9/3 {
         */

        function addResizeBtn() {

            var resizeAlbum = Core.Dom.byClz($E("module_" + _this.compId), "a", "resizeAlbum")[0];

            if (resizeAlbum) {

                var swfStr = "compflash_" + _this.compId;
                var swfObjWrap = $E(swfStr);

                /*消除地底部多余边界*/
                if (!swfObjWrap) {
                    return;
                }
                //swfObjWrap.style.display="block";
                swfObjWrap.style.verticalAlign = "middle";

                /*取得flash文件的标签，以控制flash文件的高度*/
                swfObj = $T(swfObjWrap, "embed")[0] || swfObjWrap;

                /*flash文件的原始高度*/
                orgHeight = parseInt(swfObj.getAttribute('height'), 10);
                Lib.checkAuthor();
                /*点击链接 产生 收起-展开 动画效果*/
                resizeAlbum.onclick = function (down) {

                    var cite = $T(this, 'cite')[0];
                    var up = cite.innerHTML == "收起";

                    /*在点小图标而展开时down===true*/
                    if (down === true && up) {
                        return false;
                    }

                    /*确定 收起-展开 动画效果 的最终值*/
                    var height = up ? 93 : orgHeight;

                    cite.innerHTML = up ? "展开" : "收起";

                    try {
                        var uid = $UID || '0';
                        if (up) {
                            //展开
                            v7sendLog('93_01_01_' + uid, scope.$pageid, '');
                        } else {
                            //收起
                            v7sendLog('93_01_02_' + uid, scope.$pageid, '');
                        }
                    } catch (e) {
                    }

                    var from = parseInt(swfObj.getAttribute('height'), 10);

                    var tween = new Ui.TweenStrategy(from, height, 0.5, Ui.Transition.backEaseOut);

                    /*tween.onEnd=function(){

                     };*/
                    tween.onTween = function (value) {
                        swfObj.setAttribute('height', value);
                        if (swfObj !== swfObjWrap) {
                            swfObjWrap.setAttribute('height', value);
                        }

                    };
                    tween.start();
                    return false;

                    //swfObj.height = height;
                    //swfObj.setAttribute('height', height);
                };

                window.resizeAlbumFn = function () {
                    resizeAlbum.onclick(true);
                };
            }
        }

        /*}*/

    }
    /*
     * 增加管理链接
     */, "setManage": function () {
        if ($isAdmin && this.getManage()) {
            this.getManage().innerHTML = '<span class="move"><a href="#" ' + 'onclick="funcMoveUpDown.up(10004);return false;">↑</a><a href="#" ' + 'onclick="funcMoveUpDown.down(10004);return false;">↓</a></span>' + '<a href="#" onclick="Lib.Component.set(\'' + this.compId + '\');return false;" class="CP_a_fuc">[<cite>设置</cite>]</a>' + '<a href="#" onclick="hiddenComponents(\'' + this.compId + '\');return false;" class="CP_a_fuc">[<cite>隐藏</cite>]</a>';
        }
    }
    /*
     *	读取图片播放器的默认配置
     */, "getUserSet": function () {
        if (this.isSetOn == null) {
            this.isSetOn = true;
            Core.Dom.insertHTML(this.getContent(), '<div id="comp_' + this.compId + '_set"></div>', "AfterBegin");
            var html = ['<div class="vp_login w' + (this.size == 210 ? 4 : (this.size == 510 ? 2 : 1)) + ' borderc">'
                , '<div>'
                , '用分类筛选：'
                , '<select id="comp_' + this.compId + '_ctgid">'
                , '<option value="0"' + (this.currentCtgid == 0 ? ' selected="true"' : '') + '>最新图片</option>#{option}'
                , '</select>'
                , '</div>'
                ,
                    '<a href="#" onclick="Core.Function.bind2(Lib.Component.instances[' + this.compId + '].saveUserSet, Lib.Component.instances[' + this.compId + '])();return false;" class="SG_aBtn SG_aBtnB "><cite>确定</cite></a>&nbsp;'
                ,
                    '<a href="#" onclick="Core.Dom.removeNode($E(\'comp_' + this.compId + '_set\'));Lib.Component.instances[' + this.compId + '].isSetOn=null;return false;" class="SG_aBtn SG_aBtnB "><cite>取消</cite></a>'
                , '</div>'].join("");

            var i_getLastestVideo = new Interface("http://photo.blog.sina.com.cn/services/ctg_list_ctg.php", "jsload");
            i_getLastestVideo.request({
                GET: {
                    "uid": scope.$uid, "visible": "public"
                }, onSuccess: Core.Function.bind2(function (oData) {
                    var option = [];
                    if (oData.record.length > 0) {
                        for (var i = 0, len = oData.record.length; i < len; i++) {
                            var ctgName = Core.String.decodeHTML(oData.record[i].category);
                            if (this.size == 210 && Core.String.byteLength(ctgName) > 16) {
                                ctgName = Core.String.leftB(ctgName, 14) + "…";
                            }
                            ctgName = Core.String.encodeHTML(ctgName);
                            option.push('<option value="' + oData.record[i].ctg_id + '" ' + (this.currentCtgid == oData.record[i].ctg_id ? ' selected="true"' : '') + '>' + ctgName + '</option>');
                        }
                    }
                    var result = html.replace(/#{option}/gi, option.join(""));
                    $E('comp_' + this.compId + '_set').innerHTML = result;
                }, this), onError: function () {
                }, onFail: function () {
                }
            });
        }
    }
    /*
     * 保存图片播放器的配置，并根据情况刷新
     */, "saveUserSet": function () {
//		Debug.info("save..." + this.compId);
        var userCtgid = $E('comp_' + this.compId + '_ctgid').value;
        // 如果显示模式和分类都未变化，就直接删除设置 DIV，不做接口提交
        if (userCtgid == this.currentCtgid) {
//			Debug.log("组件 " + this.compId + " 没有任何修改，直接关掉设置浮层");
            Core.Dom.removeNode($E('comp_' + this.compId + '_set'));
            this.isSetOn = null;
        } else {
            var i_setUserSet = new Interface("http://control.blog.sina.com.cn/riaapi/component_config/write_component.php", "ijax");
            i_setUserSet.request({
                POST: {
                    "title_code": this.compId, "cat": userCtgid
                },
                onSuccess: Core.Function.bind2(function () {
                    this.isSetOn = null;
                    Core.Dom.removeNode($E('comp_' + this.compId + '_set'));
                    if (userCtgid != this.currentCtgid) {
//						Debug.info("如果改变了，就刷新组件");
                        this.currentCtgid = userCtgid;
                        this.load();
                    }
                }, this), onError: function (oData) {
                    showError(oData.code);
                }, onFail: function () {
                    showError("A00001");
                }
            });
        }
    }
}, "dynamic");

//供flash调用的方法，判断图片播放器的中心是否在可见区域内
window.returnIsInView = function () {
    return scope.bofangqiisin;
}

//分享博客首页 图片播放器（组件）到微博，分享的地址为个人博客首页

window.shareAlbumToTsina = function (option) {
    var f = 'http://v.t.sina.com.cn/share/share.php?', s = screen, d = document, e = encodeURIComponent, r = "新浪-博客", l = 'http://blog.sina.com.cn', t = '分享' + (option.owenerNickName || "") + '的图片幻灯：' + (option.title || ""), u = 'http://sjs.sinajs.cn/blog7swf/AlbumV1.swf?uid=' + scope.$uid + '&ctgid=' + Lib.Component.instances[10004].currentCtgid, m = "http://portrait" + (scope.$uid % 8 + 1) + ".sinaimg.cn/" + scope.$uid + "/blog/180", p = ['url=',
            e(u), '&title=', e(t), '&source=', e(r), '&sourceUrl=', e(l), '&content=', 'utf-8', '&pic=', e(m)].join('');

    function a() {
        window.open([f, p].join(''), 'mb', ['toolbar=0,status=0,resizable=1,width=440,height=430,left=',
                (s.width - 440) / 2, ',top=', (s.height - 430) / 2].join(''));
    }

    if (/Firefox/.test(navigator.userAgent)) setTimeout(a, 0); else a();
};
