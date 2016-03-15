/**
 * @fileoverview | 世界杯32球队弹出层
 * @author dcw1123 | chengwei1@staff.sina.com.cn
 */
$import("sina/core/dom/setStyle.js");
$import("sina/core/dom/getLeft.js");
$import("sina/core/dom/getTop.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/array/foreach.js");
$import("sina/ui/tween.js");

var Team32Popup = function (fireDom) {
    var _this = this;
    var headarea = $E("headarea");
    var wcTplPopup = $C("div");
    var fimg = $C("div");
    var tplList;

    wcTplPopup.innerHTML = this.team32tpl;
    wcTplPopup = wcTplPopup.childNodes[0];
    fimg.style.cssText = "background-color:white; width:750px; height:157px; display:none; z-index:1;";

    headarea.appendChild(wcTplPopup);
    headarea.appendChild(fimg);
    tplList = wcTplPopup.getElementsByTagName("li");

    this.switchOn = false;
    this.entity = $E("wc_team32");
    this.fireDom = fireDom;				//must be DOM
    this.fakeImg = fimg;

    if (!this.entity) return;

    this.entity.style.cssText += "; position:absolute; z-index:512;";
    this.fakeImg.style.cssText += "; position:absolute; z-index:1;";

    //
    Core.Events.addEvent(document, function () {
        _this.resetTeam32();
    });

    //
    Core.Events.addEvent(window, function () {
        _this.justiPos(0, 0);
    }, "resize");

    //源按钮
    Core.Events.addEvent(this.fireDom, function () {
        Core.Events.stopEvent();
        _this.clearSelect(tplList);
        _this.selectTpl("t_" + scope.tpl);
        _this.setPos(_this.fireDom, 0, 0);
        _this.tweenPlay();
    });

    //添加 hover 事件。
    Core.Array.foreach(tplList, function (item, i) {
        Core.Events.addEvent(item, function () {
            item.className = "selected";
        }, "mouseover");
        Core.Events.addEvent(item, function () {
            if (item.id == "t_" + scope.tpl) {
                item.className = "selected";
            } else {
                item.className = "";
            }
        }, "mouseout");
    });
};

Team32Popup.prototype = {

    //清除当前选择的状态
    clearSelect: function (tplList) {
        for (i = 0; i < tplList.length; i++) {
            tplList[i].className = "";
        }
    },

    //设置当前选择的状态
    selectTpl: function (id) {
        $E(id) && ($E(id).className = "selected");
    },

    resetTeam32: function () {
        try {
            Ui.tween.stop(this.fakeImg);
        } catch (e) {
        }		//阻止回调。
        Core.Dom.setStyle(this.entity, "display", "none");
        Core.Dom.setStyle(this.entity, "visibility", "hidden");
        Core.Dom.setStyle(this.fakeImg, "display", "none");
    },

    justiPos: function (offsetLeft, offsetTop) {
        if (!this.switchOn) return;
        Core.Dom.setStyle(this.entity, "right", "0");
        Core.Dom.setStyle(this.entity, "left", "auto");
        Core.Dom.setStyle(this.entity, "top", (Core.Dom.getTop(this.posRelDom) + offsetTop) + "px");
    },

    setPos: function (withDom, offsetLeft, offsetTop) {
        this.posRelDom = withDom;			//位置依赖。
        var left = Core.Dom.getLeft(withDom) + (offsetLeft ? offsetLeft : 0);
        var top = Core.Dom.getTop(withDom) + (offsetTop ? offsetTop : 0);
        if ($IE6 && $IE7) {
            left += document.documentElement.scrollLeft;
            top += document.documentElement.scrollTop;
        }
        this.fakeImg.style.left = left + "px";
        this.fakeImg.style.top = top + "px";
    },

    tweenPlay: function () {
        this.resetTeam32();				//狂点事件源。

        var _this = this;
        Core.Dom.setStyle(this.entity, "display", "");
        Core.Dom.setStyle(this.entity, "right", "0");
        Core.Dom.setStyle(this.entity, "left", "auto");

        Core.Dom.setStyle(this.fakeImg, "left", "auto");
        Core.Dom.setStyle(this.fakeImg, "right", "0px");
        Core.Dom.setStyle(this.fakeImg, "display", "");
        Core.Dom.setStyle(this.fakeImg, "opacity", 0.1);
        Core.Dom.setStyle(this.fakeImg, "width", "450px");			// 750 / 157
        Core.Dom.setStyle(this.fakeImg, "height", "30px");

        new Ui.tween(this.fakeImg, ["opacity", "height", "width", "right"], [0.6, this.entity.offsetHeight,
                this.entity.offsetWidth, 0], 0.3, "strongEaseIn", {end: function () {		//播放完毕，显示节点，然后自己隐身。
                new Ui.tween(_this.fakeImg, ["opacity"], [0.8], 0.1, "simple", {
                    end: function () {
                        _this.entity.style.left = "auto";
                        _this.entity.style.right = 0;
                        _this.entity.style.top = (Core.Dom.getTop(_this.fakeImg) - 30) + "px";			//？
                        _this.fakeImg.style.display = "none";
                        _this.entity.style.visibility = "visible";
                        _this.switchOn = true;
                    }
                });
            }});
    },

    //世界杯 32 球队弹出层。
    team32tpl: [
        '<div class="worldcup_layPosit" style="width:750px; height:157px; display:none;" id="wc_team32">',
        '<div class="worldcup_layer01_bg"></div>', '<div class="worldcup_layer01">',
        '<div class="worldcup_layer01_tit">请选择你喜欢的国家队：</div>', '<div class="worldcup_layer01_list">',
        '<div class="worldcup_layer01_group">', '<div class="worldcup_layer01_gt">A组</div>', '<ul>',
        '<li id="t_11_11"><a href="http://control.blog.sina.com.cn/myblog/htmlsource/index.php?tpl=11_11" target="_self" style="cursor:pointer; display:block; width:100%; height:100%; text-decoration:none;"><img class="wdc_flag_s wdc_1_s" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" align="absmiddle" alt="" /><em>南非</em></a></li>',
        '<li id="t_11_12"><a href="http://control.blog.sina.com.cn/myblog/htmlsource/index.php?tpl=11_12" target="_self" style="cursor:pointer; display:block; width:100%; height:100%; text-decoration:none;"><img class="wdc_flag_s wdc_2_s" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" align="absmiddle" alt="" /><em>墨西哥</em></a></li>',
        '<li id="t_11_13"><a href="http://control.blog.sina.com.cn/myblog/htmlsource/index.php?tpl=11_13" target="_self" style="cursor:pointer; display:block; width:100%; height:100%; text-decoration:none;"><img class="wdc_flag_s wdc_3_s" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" align="absmiddle" alt="" /><em>乌拉圭</em></a></li>',
        '<li id="t_11_14"><a href="http://control.blog.sina.com.cn/myblog/htmlsource/index.php?tpl=11_14" target="_self" style="cursor:pointer; display:block; width:100%; height:100%; text-decoration:none;"><img class="wdc_flag_s wdc_4_s" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" align="absmiddle" alt="" /><em>法国</em></a></li>',
        '</ul>', '</div>', '<div class="worldcup_layer01_group">', '<div class="worldcup_layer01_gt">B组</div>', '<ul>',
        '<li id="t_11_15"><a href="http://control.blog.sina.com.cn/myblog/htmlsource/index.php?tpl=11_15" target="_self" style="cursor:pointer; display:block; width:100%; height:100%; text-decoration:none;"><img class="wdc_flag_s wdc_5_s" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" align="absmiddle" alt="" /><em>阿根廷</em></a></li>',
        '<li id="t_11_16"><a href="http://control.blog.sina.com.cn/myblog/htmlsource/index.php?tpl=11_16" target="_self" style="cursor:pointer; display:block; width:100%; height:100%; text-decoration:none;"><img class="wdc_flag_s wdc_6_s" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" align="absmiddle" alt="" /><em>尼日利亚</em></a></li>',
        '<li id="t_11_17"><a href="http://control.blog.sina.com.cn/myblog/htmlsource/index.php?tpl=11_17" target="_self" style="cursor:pointer; display:block; width:100%; height:100%; text-decoration:none;"><img class="wdc_flag_s wdc_7_s" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" align="absmiddle" alt="" /><em>韩国</em></a></li>',
        '<li id="t_11_18"><a href="http://control.blog.sina.com.cn/myblog/htmlsource/index.php?tpl=11_18" target="_self" style="cursor:pointer; display:block; width:100%; height:100%; text-decoration:none;"><img class="wdc_flag_s wdc_8_s" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" align="absmiddle" alt="" /><em>希腊</em></a></li>',
        '</ul>', '</div>', '<div class="worldcup_layer01_group">', '<div class="worldcup_layer01_gt">C组</div>', '<ul>',
        '<li id="t_11_19"><a href="http://control.blog.sina.com.cn/myblog/htmlsource/index.php?tpl=11_19" target="_self" style="cursor:pointer; display:block; width:100%; height:100%; text-decoration:none;"><img class="wdc_flag_s wdc_9_s" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" align="absmiddle" alt="" /><em>英格兰</em></a></li>',
        '<li id="t_11_20"><a href="http://control.blog.sina.com.cn/myblog/htmlsource/index.php?tpl=11_20" target="_self" style="cursor:pointer; display:block; width:100%; height:100%; text-decoration:none;"><img class="wdc_flag_s wdc_10_s" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" align="absmiddle" alt="" /><em>美国</em></a></li>',
        '<li id="t_11_21"><a href="http://control.blog.sina.com.cn/myblog/htmlsource/index.php?tpl=11_21" target="_self" style="cursor:pointer; display:block; width:100%; height:100%; text-decoration:none;"><img class="wdc_flag_s wdc_11_s" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" align="absmiddle" alt="" /><em>阿尔及利亚</em></a></li>',
        '<li id="t_11_22"><a href="http://control.blog.sina.com.cn/myblog/htmlsource/index.php?tpl=11_22" target="_self" style="cursor:pointer; display:block; width:100%; height:100%; text-decoration:none;"><img class="wdc_flag_s wdc_12_s" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" align="absmiddle" alt="" /><em>斯洛文尼亚</em></a></li>',
        '</ul>', '</div>', '<div class="worldcup_layer01_group">', '<div class="worldcup_layer01_gt">D组</div>', '<ul>',
        '<li id="t_11_23"><a href="http://control.blog.sina.com.cn/myblog/htmlsource/index.php?tpl=11_23" target="_self" style="cursor:pointer; display:block; width:100%; height:100%; text-decoration:none;"><img class="wdc_flag_s wdc_13_s" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" align="absmiddle" alt="" /><em>德国</em></a></li>',
        '<li id="t_11_24"><a href="http://control.blog.sina.com.cn/myblog/htmlsource/index.php?tpl=11_24" target="_self" style="cursor:pointer; display:block; width:100%; height:100%; text-decoration:none;"><img class="wdc_flag_s wdc_14_s" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" align="absmiddle" alt="" /><em>澳大利亚</em></a></li>',
        '<li id="t_11_25"><a href="http://control.blog.sina.com.cn/myblog/htmlsource/index.php?tpl=11_25" target="_self" style="cursor:pointer; display:block; width:100%; height:100%; text-decoration:none;"><img class="wdc_flag_s wdc_15_s" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" align="absmiddle" alt="" /><em>塞尔维亚</em></a></li>',
        '<li id="t_11_26"><a href="http://control.blog.sina.com.cn/myblog/htmlsource/index.php?tpl=11_26" target="_self" style="cursor:pointer; display:block; width:100%; height:100%; text-decoration:none;"><img class="wdc_flag_s wdc_16_s" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" align="absmiddle" alt="" /><em>加纳</em></a></li>',
        '</ul>', '</div>', '<div class="worldcup_layer01_group">', '<div class="worldcup_layer01_gt">E组</div>', '<ul>',
        '<li id="t_11_27"><a href="http://control.blog.sina.com.cn/myblog/htmlsource/index.php?tpl=11_27" target="_self" style="cursor:pointer; display:block; width:100%; height:100%; text-decoration:none;"><img class="wdc_flag_s wdc_17_s" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" align="absmiddle" alt="" /><em>荷兰</em></a></li>',
        '<li id="t_11_28"><a href="http://control.blog.sina.com.cn/myblog/htmlsource/index.php?tpl=11_28" target="_self" style="cursor:pointer; display:block; width:100%; height:100%; text-decoration:none;"><img class="wdc_flag_s wdc_18_s" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" align="absmiddle" alt="" /><em>丹麦</em></a></li>',
        '<li id="t_11_29"><a href="http://control.blog.sina.com.cn/myblog/htmlsource/index.php?tpl=11_29" target="_self" style="cursor:pointer; display:block; width:100%; height:100%; text-decoration:none;"><img class="wdc_flag_s wdc_19_s" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" align="absmiddle" alt="" /><em>日本</em></a></li>',
        '<li id="t_11_30"><a href="http://control.blog.sina.com.cn/myblog/htmlsource/index.php?tpl=11_30" target="_self" style="cursor:pointer; display:block; width:100%; height:100%; text-decoration:none;"><img class="wdc_flag_s wdc_20_s" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" align="absmiddle" alt="" /><em>喀麦隆</em></a></li>',
        '</ul>', '</div>', '<div class="worldcup_layer01_group">', '<div class="worldcup_layer01_gt">F组</div>', '<ul>',
        '<li id="t_11_31"><a href="http://control.blog.sina.com.cn/myblog/htmlsource/index.php?tpl=11_31" target="_self" style="cursor:pointer; display:block; width:100%; height:100%; text-decoration:none;"><img class="wdc_flag_s wdc_21_s" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" align="absmiddle" alt="" /><em>意大利</em></a></li>',
        '<li id="t_11_32"><a href="http://control.blog.sina.com.cn/myblog/htmlsource/index.php?tpl=11_32" target="_self" style="cursor:pointer; display:block; width:100%; height:100%; text-decoration:none;"><img class="wdc_flag_s wdc_22_s" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" align="absmiddle" alt="" /><em>巴拉圭</em></a></li>',
        '<li id="t_11_33"><a href="http://control.blog.sina.com.cn/myblog/htmlsource/index.php?tpl=11_33" target="_self" style="cursor:pointer; display:block; width:100%; height:100%; text-decoration:none;"><img class="wdc_flag_s wdc_23_s" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" align="absmiddle" alt="" /><em>新西兰</em></a></li>',
        '<li id="t_11_34"><a href="http://control.blog.sina.com.cn/myblog/htmlsource/index.php?tpl=11_34" target="_self" style="cursor:pointer; display:block; width:100%; height:100%; text-decoration:none;"><img class="wdc_flag_s wdc_24_s" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" align="absmiddle" alt="" /><em>斯洛伐克</em></a></li>',
        '</ul>', '</div>', '<div class="worldcup_layer01_group">', '<div class="worldcup_layer01_gt">G组</div>', '<ul>',
        '<li id="t_11_35"><a href="http://control.blog.sina.com.cn/myblog/htmlsource/index.php?tpl=11_35" target="_self" style="cursor:pointer; display:block; width:100%; height:100%; text-decoration:none;"><img class="wdc_flag_s wdc_25_s" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" align="absmiddle" alt="" /><em>巴西</em></a></li>',
        '<li id="t_11_36"><a href="http://control.blog.sina.com.cn/myblog/htmlsource/index.php?tpl=11_36" target="_self" style="cursor:pointer; display:block; width:100%; height:100%; text-decoration:none;"><img class="wdc_flag_s wdc_26_s" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" align="absmiddle" alt="" /><em>朝鲜</em></a></li>',
        '<li id="t_11_37"><a href="http://control.blog.sina.com.cn/myblog/htmlsource/index.php?tpl=11_37" target="_self" style="cursor:pointer; display:block; width:100%; height:100%; text-decoration:none;"><img class="wdc_flag_s wdc_27_s" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" align="absmiddle" alt="" /><em>科特迪瓦</em></a></li>',
        '<li id="t_11_38"><a href="http://control.blog.sina.com.cn/myblog/htmlsource/index.php?tpl=11_38" target="_self" style="cursor:pointer; display:block; width:100%; height:100%; text-decoration:none;"><img class="wdc_flag_s wdc_28_s" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" align="absmiddle" alt="" /><em>葡萄牙</em></a></li>',
        '</ul>', '</div>', '<div class="worldcup_layer01_group">', '<div class="worldcup_layer01_gt">H组</div>', '<ul>',
        '<li id="t_11_39"><a href="http://control.blog.sina.com.cn/myblog/htmlsource/index.php?tpl=11_39" target="_self" style="cursor:pointer; display:block; width:100%; height:100%; text-decoration:none;"><img class="wdc_flag_s wdc_29_s" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" align="absmiddle" alt="" /><em>西班牙</em></a></li>',
        '<li id="t_11_40"><a href="http://control.blog.sina.com.cn/myblog/htmlsource/index.php?tpl=11_40" target="_self" style="cursor:pointer; display:block; width:100%; height:100%; text-decoration:none;"><img class="wdc_flag_s wdc_30_s" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" align="absmiddle" alt="" /><em>瑞士</em></a></li>',
        '<li id="t_11_41"><a href="http://control.blog.sina.com.cn/myblog/htmlsource/index.php?tpl=11_41" target="_self" style="cursor:pointer; display:block; width:100%; height:100%; text-decoration:none;"><img class="wdc_flag_s wdc_31_s" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" align="absmiddle" alt="" /><em>洪都拉斯</em></a></li>',
        '<li id="t_11_42"><a href="http://control.blog.sina.com.cn/myblog/htmlsource/index.php?tpl=11_42" target="_self" style="cursor:pointer; display:block; width:100%; height:100%; text-decoration:none;"><img class="wdc_flag_s wdc_32_s" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" align="absmiddle" alt="" /><em>智利</em></a></li>',
        '</ul>', '</div>', '</div>', '</div>', '</div>'].join("")

};




