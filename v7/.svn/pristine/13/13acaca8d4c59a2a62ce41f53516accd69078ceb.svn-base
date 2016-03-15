/**
 * 新编辑器加标签功能
 * @author gaolei2@
 */
$import("sina/sina.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/string/trim.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/dom/setStyle.js");
$import("sina/core/dom/getStyle.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopDefaultEvent.js");
$import("sina/core/events/fixEvent.js");
$import("sina/core/function/bind2.js");

$import("sina/core/dom/insertHTML.js");
$import("sina/core/dom/contains.js");

$import("jobs/newEditor/TagsAddNew.js");

$registJob("editor_mjtag", function () {

    var __addEvent = Core.Events.addEvent,
        __fixEvent = Core.Events.fixEvent,
        __stopEvent = Core.Events.stopDefaultEvent,
        __classUtil = new Lib.classUtils();

    var addBlogTag = $E('add_blog_tag'),
        blogTagList = $E('blog_tag_list');

    if (!addBlogTag || !blogTagList){   // 节点不存在，返回
        return;
    }

	/** 常用标签 */
	var html = '', i, len;
	var userTags = articleEditorCFG.articleAllTagList.user;
	for (i=0, len=Math.min(userTags.length,5); i<len; i++) {
		html += '<a href="javascript:;" class="tag2">'+ userTags[i] +'</a>'
	}
	$E("blog_tag_hot").innerHTML = html; //hotTagList与userTagList这两个id的意义颠倒了⊙﹏⊙b汗
	
	/** 推荐标签 */
    html = '';
    var hotTags = articleEditorCFG.articleAllTagList.hotTagNick;

    for (var i=0; i<hotTags.length; i++){
        html += '<a href="javascript:;" class="tag2">'+ hotTags[i] +'</a>'
    }
    $E("blog_tag_recommended").innerHTML = html;

    /** 初始化加标签容器 */

    var hiddenTag = $E('article_tag_input'), tInput = $E('t_input'), tInputCon = $E('t_input_container');
    var tagval = hiddenTag.value; //防刷新
    var tagsMng = TagsAddNew(tInputCon, tInput, hiddenTag);
    scope._tagsMng = tagsMng;
    
    if(tagval){ //初始化用户已经输入的标签
        tagval = tagval.split(' ').slice(0,5); //超过5个，只保留5个
        hiddenTag.value = tagval.join(',');
        html = '';

        // 新编辑器的标签html结构
        // <div class="tag1"><span>杂谈</span><a class="close" href="javascript:void(0);" title="删除">×</a></div>

        for(i=0, len=tagval.length; i<len; i++){
			if (location.href.indexOf("tag365") > 0){//如果是新添加365博文，365标签不可删除。
				html += '<div deleteable="false" class="tag1"><span>'+Core.String.encodeHTML(tagval[i])+'</span></div>';
			}else{
				html += '<div deleteable="true" class="tag1"><span>'+Core.String.encodeHTML(tagval[i])+'</span><a class="close" title="删除" href="javascript:;">×</a></div>';
			}
        }
        var em = tInput.parentNode.children[0];
        if(em&&em.nodeName.toUpperCase()==='EM'){
            em.parentNode.removeChild(em);
        }

        Core.Dom.insertHTML(tInput, html, 'BeforeBegin');
    }

    /** 给所有按钮加事件 */

    // 点击 添加博文标签 
    __addEvent(addBlogTag, function(e){
        v7sendLog('16_01_22');
        var iNode = addBlogTag.getElementsByTagName('i')[0],
            blogTagList = $E('blog_tag_list');

        if (blogTagList.style.display == 'none'){
            // 显示
            blogTagList.style.display = '';
            // 箭头向上
            __classUtil.delClass(iNode, 'i2_darr');
            __classUtil.addClass(iNode, 'i3_uarr');
        }else{
            // 隐藏
            blogTagList.style.display = 'none';
            // 箭头向下
            __classUtil.delClass(iNode, 'i3_uarr');
            __classUtil.addClass(iNode, 'i2_darr');
        }
    });

    // 点击 标签列表
    __addEvent(blogTagList, function(event){
        event = event || window.event;
        var t = event.srcElement || event.target,
            tclz = t.className || '';
        if(tclz.indexOf('tag2')>-1){
            tagsMng.addTag(Core.String.decodeHTML(t.innerHTML));
        }
    });

    // 点击 标签输入框
    var _first = true;
    __addEvent(tInput, function(){
        v7sendLog('16_01_22');
        var el = $E('blog_tag_list');
        if(el.style.display==='none'||_first){
            el.style.display = '';
            __addEvent(document.body, checkHide);
            _first = false;
        }
        var em = $E('t_input').parentNode.children[0];
        if(em&&em.nodeName.toUpperCase()==='EM'){
            //em.parentNode.removeChild(em);
            setTimeout(function(){
                em.parentNode.removeChild(em); //延迟删除，让删除发生在点击事件的代理checkHide之后
            }, 10);
        }
    }, 'focus');

    __addEvent(tInput, function(e){// 不知道为啥在tInput上点击回车会提交表单，阻止默认事件
        var e = __fixEvent(e);
        if (e.keyCode == '13'){
            __stopEvent(e);
        }
    }, 'keydown');

    function checkHide(event){
        event = event || window.event;
        var t = event.srcElement || event.target,
            el = $E('blog_tag_list');
        if( Core.Dom.contains(el,t) || Core.Dom.contains($E('t_input_container'),t) ){
            return;
        }
        if($E('article_tag_input').value){
            $E('t_input').style.display = 'none'; //没有标签还隐藏就可能导致tInputContainer没有高度
        }
        el.style.display = 'none';
        //updown(false);
        Core.Events.removeEvent(document.body, checkHide);
    }
    
});
