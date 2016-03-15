/**
 * 新编辑器博文权限管理
 * @author gaolei2@
 */
$import("sina/sina.js");

$import("sina/core/events/addEvent.js");
// $import("sina/core/events/fixEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/events/stopEvent.js");
$import("lib/classUtils.js");
$import("lib/sendLog.js");
$import("lib/util/hoverJq.js");


$registJob("article_permission", function () {

    var __addEvent = Core.Events.addEvent,
        // __fixEvent = Core.Events.fixEvent,
        __removeEvent = Core.Events.removeEvent,
        __stopDefault = Core.Events.stopEvent,
        __classUtil = new Lib.classUtils();


    var isCommentAllow = $E('is_comment_allow'),
        isPrivateBlog = $E('is_private_blog'),
        canReprint = $E('can_reprint'),


        commentRadio1 = $E('commentRadio1'),    // 允许所有人评论
        commentRadio2 = $E('commentRadio2'),    // 不允许匿名评论
        commentRadio3 = $E('commentRadio3'),    // 不允许评论
        xRankRadio = $E('xRankRadio'),         // 文章是否仅自己可见
        QuoteRadio = $E('QuoteRadio');         // 文章是否可以转载

    __addEvent(isCommentAllow, commentAllow, 'click');
    __addEvent(isPrivateBlog, privateBlog, 'click');
    __addEvent(canReprint, print, 'click');

    // 博文权限状态初始化
    if (commentRadio1 && commentRadio1.checked){
        isCommentAllow && __classUtil.addClass(isCommentAllow, 'btn_cur');
    }

    if (commentRadio2 && commentRadio2.checked){ // 不允许匿名也算是允许匿名评论，同步修改值
        commentRadio1.checked = 'checked';
        commentRadio2.checked = '';
        isCommentAllow && __classUtil.addClass(isCommentAllow, 'btn_cur');
    }

    if (commentRadio3 && commentRadio3.checked){ // 不允许评论
        isCommentAllow && __classUtil.delClass(isCommentAllow, 'btn_cur');
    }

    if (xRankRadio && xRankRadio.checked){
        isPrivateBlog && __classUtil.addClass(isPrivateBlog, 'btn_cur'); 
    }

    if (QuoteRadio && QuoteRadio.checked){
        canReprint && __classUtil.addClass(canReprint, 'btn_cur');
    }

    // 全局权限状态初始化
    if (commentRadio3.disabled){// 全局禁止评论
        __classUtil.delClass(isCommentAllow, 'btn_cur');
        __classUtil.addClass(isCommentAllow, 'btn_noclick');
        __removeEvent(isCommentAllow, commentAllow, 'click');
        isCommentAllow.onclick = function(){
            // 您已设置了不允许评论，去个人中心修改权限设置
            winDialog.alert('您已设置了不允许评论', {
                textOk: "确定",
                title: "提示",
                subText: '<a href="http://control.blog.sina.com.cn/blogprofile/profilepower.php" target="_blank">可以去个人中心修改权限设置</a>',
                width: 430,
                icon: "01" // 可选值："01"、"02"、"03"、"04"、"05"
            });
            return false;
        }
    }

    if (QuoteRadio.disabled){// 全局禁止转载
        __classUtil.delClass(canReprint, 'btn_cur');
        __classUtil.addClass(canReprint, 'btn_noclick');
        var iNode = canReprint.getElementsByTagName('i')[0];
        __classUtil.addClass(iNode, 'i1_yes1');
        __removeEvent(canReprint, print, 'click');
        canReprint.onclick = function(){
            // 您已设置了禁止转载，去个人中心修改权限设置
            winDialog.alert('您已设置了禁止转载', {
                textOk: "确定",
                title: "提示",
                width: 430,
                subText: '<a href="http://control.blog.sina.com.cn/blogprofile/profilepower.php" target="_blank">可以去个人中心修改权限设置</a>',
                icon: "01" // 可选值："01"、"02"、"03"、"04"、"05"
            });
            return false;
        }
    }

    // 点击博文权限同步
    
    function commentAllow(e){
        v7sendLog('16_01_23');
        if (__classUtil.hasClass(isCommentAllow, 'btn_cur')){ //允许评论状态，点击禁止
            __classUtil.delClass(isCommentAllow, 'btn_cur');
            commentRadio1.checked = '';
            commentRadio3.checked = 'checked';
        }else{
            __classUtil.addClass(isCommentAllow, 'btn_cur');
            commentRadio1.checked = 'checked';
            commentRadio3.checked = '';
        }

        __stopDefault(e);
    }

    function privateBlog(e){
        v7sendLog('16_01_24');
        var cateList = $E('blog_cate_selected_list'),
            blogCateList = $E('blog_cate_list'),
            componentSelect = $E('componentSelect'),
            catePrivate = '<li cate_value="0"><span class="dot"></span><a class="sort_by" href="javascript:; return false;"><span class="dot_cont">私密博文<i class="dot_hover2" onclick="deleteArticleCate();"></i></span></a></li>';

        if (__classUtil.hasClass(isPrivateBlog, 'btn_cur')){ //文章仅自己可见
            __classUtil.delClass(isPrivateBlog, 'btn_cur');
            xRankRadio.checked = '';

            cateList.innerHTML = '';
            cateList.style.display = 'none';

            componentSelect.value = '00';

        }else{
            __classUtil.addClass(isPrivateBlog, 'btn_cur');
            xRankRadio.checked = 'checked';

            // 文章仅自己可见，博文分类为 私密
            cateList.innerHTML = catePrivate;
            cateList.style.display = '';

            if ($IE6){
                var hoverElem = cateList.getElementsByTagName('li')[0];
                Lib.util.hoverJq({
                    elm: hoverElem,
                    mouseenter: function(evt, el, index){
                        var a = el.getElementsByTagName('a')[0];
                        __classUtil.addClass(a, 'sort_close');
                    },
                    mouseleave: function(evt, el, index){
                        var a = el.getElementsByTagName('a')[0];
                        __classUtil.delClass(a, 'sort_close');
                    }
                });
            }

            blogCateList.style.display = 'none';    // 选择私密类型，关闭博文分类列表

            // 同步原有的select的值
            var cateValue = cateList.children[0].getAttribute('cate_value');
            componentSelect.value = cateValue;
        }

        __stopDefault(e);
    }

    function print(e){
        v7sendLog('16_01_25');
        if (__classUtil.hasClass(canReprint, 'btn_cur')){ //文章禁止转载
            __classUtil.delClass(canReprint, 'btn_cur');
            QuoteRadio.checked = '';
        }else{
            __classUtil.addClass(canReprint, 'btn_cur');
            QuoteRadio.checked = 'checked';
        }

        __stopDefault(e);
    }

});
