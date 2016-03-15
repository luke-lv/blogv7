/**
 * @fileoverview
 *    博客首页访客组件
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/core/array/foreach.js");
$import("sina/core/function/bind2.js");
$import("sina/ui/template.js");

$import("lib/component/class/registComp.js");
$import("lib/component/final/comp_12.js");
$import("lib/checkAuthor.js");
$import("lib/component/deleteVisitByUid.js");

$import("msg/componentMSG.js");
$import("other/getPromoteURL.js");
$registComp(12, {
        "requestParam": {
            "uid": scope.$uid, "pagesize": "18", "pid": 1
//			,"varname"	: "requestId_blog_index_visit_list"
        }
        /*
         *原暂访客组件的html构建
         *时间：2014-05-06
         *liudong3
         *
         ,"html" : ['<div class="ptCell">'
         , '<p class="pt_img"><a suda-uatrack="key=blog_article&value=h_article51" id="linkVisited_#{uid}" href="#{uhref}" target="_blank" '
         , 'onmouseover="if(this.parentNode.lastChild.className==\'del\'){this.parentNode.lastChild.style.display=\'\';}" '
         , 'onmouseout="if(this.parentNode.lastChild.className==\'del\'){this.parentNode.lastChild.style.display=\'none\';}" ><img'
         , ' src="#{icon}" width="50" height="50" alt="#{name}" title="#{name}" /></a>'
         , '#{update}#{manage}</p>'
         , '<p class="pt_nm"><a suda-uatrack="key=blog_article&value=h_article51" href="#{uhref}"" target="_blank" title="#{name}">#{shortName}</a>#{userV}</p>'
         , '<p class="pt_tm SG_txtc">#{vString}</p>'
         , '</div>'].join("")
         */

        /**
         *临时访客组件html
         *时间：2014-05-06
         *liudong3
         */, "html": ['<li '
            , 'onmouseover="if(this.childNodes[2].className==\'del\'){this.childNodes[2].style.display=\'\';}" '
            , 'onmouseout="if(this.childNodes[2].className==\'del\'){this.childNodes[2].style.display=\'none\';}">'
            ,
            '<span class="pt_imgs"><img class="SG_icon SG_icon35" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="15" title="#{name}" align="absmiddle" /></span>'
            ,
            '<span class="pt_nms"><a suda-uatrack="key=blog_article&value=h_article51" href="#{uhref}" target="_blank" title="#{name}">#{shortName}</a>#{userV}</span>'
            , '#{manage}'
            , '<span class="pt_tms">#{vString}</span>'
            , '</li>'].join("")
        /*
         * 按 210 像素宽度渲染访客组件，取 12 个访客
         */, "render_210": function (oData) {
            oData = oData || this.cacheData;
            oData = oData.slice(0, 12);
            this.parseToHTML(oData);
        }
        /*
         * 按 510 像素宽度渲染访客组件，取 12 个访客
         */, "render_510": function (oData) {
            oData = oData || this.cacheData;
            oData = oData.slice(0, 12);
            this.parseToHTML(oData);
        }
        /*
         * 按 730 像素宽度渲染访客组件，取 18 个访客
         */, "render_730": function (oData) {
            oData = oData || this.cacheData;
            this.parseToHTML(oData);
        },
        /*
         * 访客组件由 Json 转为 HTML
         */
        "parseToHTML": function (oData) {
            // 如果访客数为 0，直接显示空文案
            if (oData.length == 0) {
                this.showEmpty();
            } else {
                Lib.checkAuthor();
                Core.Array.foreach(oData, Core.Function.bind2(function (oItem) {

                    // 访客删除按钮
                    /*
                     *暂时下架删除按钮和访客小花功能
                     *时间： 2014-05-06
                     *liudong3
                     oItem.manage = ($isAdmin || ($isLogin && oItem.uid == $UID))
                     ? '<span class="del" style="display: none;" onmouseover="this.style.display = \'\';"'
                     + ' onmouseout="this.style.display = \'none\';"'
                     + '><img class="SG_icon SG_icon6" src="http://simg.sinajs.cn/blog7style'
                     + '/images/common/sg_trans.gif" width="15" height="15" title="删除访问记录" '
                     + 'onclick="Lib.deleteVisitByUid(\'' + oItem.uid + '\', 1, Core.Function.bind2(Lib.Component.instances['
                     + this.compId + '].reload, Lib.Component.instances[' + this.compId + '])'
                     + (scope.$articleid == null ? '' : ',\'' + scope.$articleid +'\'') + ');return false;" align="absmiddle" /></span>'
                     : '';
                     // 访客小花
                     oItem.update = (oItem.utime == 1)
                     ? '<span class="new"><img class="SG_icon SG_icon7" src="http://simg.sinajs.cn/blog7style'
                     + '/images/common/sg_trans.gif" width="15" height="15" title="有内容更新，赶快去看一下" align="absmiddle" /></span>'
                     : '';
                     */

                    /*
                     * BEGIN:  modifed by W.Qiang | wangqiang1@staff.sina.com.cn, 2011-03-14
                     * 新增营销推广地址
                     */
                    oItem.manage = (oItem.uid == $UID) ? '<span class="del" style="display: none;" onmouseover="this.style.display = \'\';"' + ' onmouseout="this.style.display = \'none\';"' + '><img class="SG_icon SG_icon6" src="http://simg.sinajs.cn/blog7style' + '/images/common/sg_trans.gif" width="15" height="15" title="删除访问记录" ' + 'onclick="Lib.deleteVisitByUid(\'' + oItem.uid + '\', 1, Core.Function.bind2(Lib.Component.instances[' + this.compId + '].reload, Lib.Component.instances[' + this.compId + '])' + (scope.$articleid == null ? '' : ',\'' + scope.$articleid + '\'') + ');return false;" align="absmiddle" /></span>' : '';

                    oItem.uhref = scope.getPromoteURL(oItem);

                    /*END: modifed by W.Qiang | wangqiang1@staff.sina.com.cn, 2011-03-14*/

                    /* 百合踩脚印 start -- Modifed by W.Qiang | wangqiang1, 2011-03-24
                     (function(){
                     var _uid = oItem.uid;
                     var baihehash = {
                     '1805486903':'db=sina&bid=204720,290420,295667&cid=0,0,0&sid=288940',
                     '1803727753':'db=sina&bid=204720,290418,295665&cid=0,0,0&sid=288937',
                     '1803717743':'db=sina&bid=204720,290420,295667&cid=0,0,0&sid=288940'
                     };
                     if(baihehash[_uid]){
                     oItem.uhref = ['http://sina.allyes.com/main/adfclick?',baihehash[_uid],'&advid=358&camid=37389&show=ignore',($UID ? '&kv='+$UID+'|99999' : '' ),'&url=http://control.blog.sina.com.cn/baihe/index.php'].join('');
                     }
                     })();
                     百合踩脚印 end */

                }, this));
                var template = new Ui.Template(this.html);

                /*
                 *原暂访客组件的html构建
                 *时间： 2014-05-06
                 *liudong3
                 var result = '<div class="ptList visitorList">' + template.evaluateMulti(oData) + '</div>';
                 */

                //临时访客组件 2014-05-06 liudong3
                var result = '<ul class="ad_ptlist">' + template.evaluateMulti(oData) + '</ul>';

                // 更多链接，只有在博主登录才可以看到，且满足
                //		210、510 模式显示时候总访客大于 12 个
                //		730 模式显示时候总访客大于 18 个
                if ((scope.$pageid == "indexM" || scope.$pageid == "pageSetM") && $isAdmin == true && ((this.size < 730 && this.total > 12) || (this.size == 730 && this.total > 18))) {
                    result += '<div class="moreLink SG_j_linedot1"><span class="SG_more"><a href="http://control.blog.sina.com.cn/blogprofile/visitor.php?showtype=1" target="_blank">更多</a>&gt;&gt;</span></div>';
                } else {
                    result += '<div class="moreLink" style="padding-top:0;"></div>';
                }
                this.show(result);

                var vUID = "1062753310";
                var linkVisited = $E("linkVisited_" + vUID);
                linkVisited && (linkVisited.href = "http://sina.allyes.com/main/adfclick?db=sina&bid=204720,256856,261931&cid=0,0,0&sid=253209&advid=358&camid=37389&show=ignore&url=http://blog.sina.com.cn/u/" + vUID);
            }
            if (scope.$pageid == "pageSetM" && this.setManage) {
                this.setManage();
            }
        }
        /*
         * 访客为 0 的文案
         */, "showEmpty": function () {
            this.setContent('<div class="SG_nodata">' + $SYSMSG.B80001 + '</div>');
        }, "showDisabled": function () {
            var msg = '尊敬的用户您好，为了给大家提供更好的服务，近期访客组件进行升级维护，维护过程中将影响部分用户无法正常浏览，给您带来不便敬请谅解！感谢您对新浪博客一直以来的支持！';
            this.setContent('<div class="SG_nodata" style="padding-left:1.5em; padding-right:1.5em; text-indent:2em; text-align:left">' + msg + '</div>');
        }
        /*
         * 设置访客组件的管理链接，仅在页面设置新增组件的时候会用到
         */, "setManage": function () {
            if ($isAdmin && this.getManage()) {
                this.getManage().innerHTML = '<span class="move"><a href="#" ' + 'onclick="funcMoveUpDown.up(' + this.compId + ');return false;">↑</a><a href="#" ' + 'onclick="funcMoveUpDown.down(' + this.compId + ');return false;">↓</a></span>' + '<a href="#" onclick="hiddenComponents(\'' + this.compId + '\');return false;" class="CP_a_fuc">[<cite>隐藏</cite>]</a>';
            }
        }
    }, 12);