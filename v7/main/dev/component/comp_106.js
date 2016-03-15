/**
 * @fileoverview
 *    博客首页祈福组件
 * @author Luo Rui | luorui1@staff.sina.com.cn
 *
 */

$import("lib/component/class/registComp.js");
$import("lib/component/extend/comp_dynamic.js");
$import("lib/checkAuthor.js");
$import("sina/ui/dialog/windowDialog.js");
$import("sina/utils/io/jsload.js");

$registComp(106, {
    load: function () {
//        var node = $T(this.getContent(), 'div')[1] || $T(this.getContent(), 'div')[0];
//        var innerHTML = ['<div class="widget_yushu">',
//                        '<p class="yushu_count" id="comp106_num"></p>',
//                        '<div class="yushu_btn">',
//                            '<a href="#" onclick="_$comp106_qifu();return false" class="yushu_btn1" title="我要祈福"></a>',
//                            '<a href="http://gongyi.sina.com.cn/" target="_blank" class="yushu_btn2" title="我要捐款"></a>',
//                        '</div>',
//                    '</div>'].join('');
//        Core.Dom.domInsert(node, innerHTML, 'beforeBegin');
        Lib.checkAuthor();
        var cloneLink = ($isAdmin) ? '' : '<div class="cloneLink"><a href="#" onclick="Lib.Component.clone(' + this.compId + ', ' + this.size + ');return false;" class="SG_comClone"><img alt="添加到我的博客" src="http://simg.sinajs.cn/blog7style/images/widget/add1.gif">添加到我的博客</a></div>';
        var innerHTML = '<div class="cloneWidget">' + '<div class="widget_yushu">' + '<p class="yushu_count" id="comp106_num"></p>' + '<div class="yushu_btn">' + '<a href="#" onclick="_$comp106_qifu();return false" class="yushu_btn1" title="我要祈福"></a>' + '<a href="http://gongyi.sina.com.cn/z/yushu/index.shtml" target="_blank" class="yushu_btn2" title="我要捐款"></a>' + '</div></div> ' + cloneLink + '</div>';
        this.getContent().innerHTML = innerHTML;

        window._$comp106_qifu = function () {
            (new Image()).src = "http://mark.sina.com.cn/v2/DoData.php?p_mark=counter&i_mark=qhearthquake2010&name=祈福&type=get&question[0]=41&option_41=168";
            var num = document.getElementById("comp106_num").innerHTML;
            num = parseInt(num) + 1;
            document.getElementById("comp106_num").innerHTML = num;
            winDialog.alert('已祈福', {icon: '03', width: '200'});
        }

        window.ini_num = function () {
            document.getElementById("comp106_num").innerHTML = user_num['qhearthquake2010'];
        }

        Utils.Io.JsLoad.request("http://mark.sina.com.cn/v2/GetDataList.php?p_mark=counter&i_mark=qhearthquake2010&need=user_num&call_back=ini_num", {
            onComplete: function () {

            }
        });

    }
}, 'dynamic');

