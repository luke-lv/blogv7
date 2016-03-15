/**
 * @fileoverview
 *    博客首页专业组件——
 微操盘    (id=123)
 * @author Liu Xiaoyue | xiaoyue3@staff.sina.com.cn
 * @version 1.0
 * @Date 2012-10-15
 * @history
 *
 */
$import("lib/component/class/registComp.js");
$import("lib/component/extend/comp_dynamic.js");

$registComp(123, {
    "load": function () {
        var template;
        if (this.size === 210) {
            template = '<iframe src="http://weibo.gxq.com.cn/ad/blog1.html" frameborder="0" scrolling="no" width="190px" height="360px"></iframe>';
        } else if (this.size === 510) {
            template = '<iframe src="http://weibo.gxq.com.cn/ad/blog2.html" frameborder="0" scrolling="no" width="490px" height="410px"></iframe>';
        } else {
            template = '<iframe src="http://weibo.gxq.com.cn/ad/blog3.html" frameborder="0" scrolling="no" width="690px" height="410px"></iframe>';
        }
        ;
        this.setContent('<div class="cloneWidget" ' + (this.size != 730 ? 'style="padding:0px 10px;"' : 'style="padding:0px 20px;"') + '><div id="comp_' + this.compId + '_content" style="padding-top:10px;padding-bottom:10px;"> ' + template + '</div></div>' + ($isAdmin ? '' : '<p class="fincAddToBlog" style="padding-bottom:5px;"><a title="添加到我的博客" href="#" onclick="' + 'Lib.Component.clone(' + this.compId + ', ' + this.size + ');return false;"><img alt="" src="http://' + 'simg.sinajs.cn/blog7style/images/widget/add1.gif" /> 添加到我的博客</a></p>')) + '</div>';
    }
}, "dynamic");
