/**
 * @author {FlashSoft}
 */
$import("sina/sina.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/string/trim.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/dom/setStyle.js");
$import("sina/core/dom/getStyle.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/function/bind2.js");

$import("sina/core/dom/insertHTML.js");
$import("sina/core/dom/contains.js");
$import("mojie/TagsAddNew.js");

$registJob("editor_mjtag", function () {
    var __addEvent = Core.Events.addEvent;
	/** 常用标签 */
	var html = '', i, len;
	var userTags = articleEditorCFG.articleAllTagList.user;
	for (i=0, len=Math.min(userTags.length,5); i<len; i++) {
		html += '<a href="javascript:;" class="ts_tag">' + userTags[i] + '</a>';
	}
	$E("hotTagList").innerHTML = html; //hotTagList与userTagList这两个id的意义颠倒了⊙﹏⊙b汗
	
	/** 热门标签 */
    html = '';

    var hotTags = articleEditorCFG.articleAllTagList.hotTagNick;

    for (var i=0; i<hotTags.length; i++){
        html += '<a href="javascript:;" class="ts_tag">' + hotTags[i] + '</a>';
    }
    //html += '<a href="javascript:;" class="ts_tag">奥运会</a>';
    // html += '<a href="http://blog.sina.com.cn/lm/top/all/day.html" class="ts_txt" target="_blank">(话题排行榜)</a>';

    $E("userTagList").innerHTML = html;

    var hiddenTag = $E('articleTagInput'), tInput = $E('tInput');

    var tagval = hiddenTag.value; //防刷新
    var tagsMng = TagsAddNew($E('tInputContainer'), tInput, hiddenTag);
    scope._tagsMng = tagsMng;
    if(tagval){ //初始化用户已经输入的标签
        tagval = tagval.split(' ').slice(0,5); //超过5个，只保留5个
        hiddenTag.value = tagval.join(',');
        html = '';
        for(i=0, len=tagval.length; i<len; i++){
			if (location.href.indexOf("tag365") > 0){//如果是新添加365博文，365标签不可删除。
				html += '<div deleteable="false" class="tag_tx">'+tagval[i]+'</div>';
			}else{
				html += '<div deleteable="true" class="tag_tx">'+tagval[i]+'<a title="删除" href="javascript:;">×</a></div>';
			}
        }
        var em = tInput.parentNode.children[0];
        if(em&&em.nodeName.toUpperCase()==='EM'){
            em.parentNode.removeChild(em);
        }
        Core.Dom.insertHTML(tInput, html, 'BeforeBegin');
    }

    __addEvent($E('articleTagList'), function(event){
        event = event || window.event;
        var t = event.srcElement || event.target,
            tclz = t.className || '';
        if(tclz.indexOf('ts_tag')>-1){
            tagsMng.addTag(t.innerHTML);
        }else if(tclz==='ts_txt'){
            var data = t.getAttribute('e-data');
            if(!data)return;
            var tags = data.split(' '), i=0, len=tags.length, tlen=0,
            //    tagsNow = ','+$E('articleTagInput').value+',';
                tagsNow = $E('articleTagInput').value;
            if(tagsNow){
                tlen = tagsNow.split(',').length;
            }
            for(; i<len; i++){
                //if( tagsNow.indexOf(','+tags[i]+',')===-1 ){
                    tagsNow = tagsMng.addTag(tags[i]);
                    tagsNow && tlen++;
                    if(tlen>4)break;
                //}
            }
        }
    });

    var _first = true;
    __addEvent(tInput, function(){
        var el = $E("articleTagList");
        if(el.style.display==='none'||_first){
            el.style.display = '';
            __addEvent(document.body,checkHide);
            _first = false;
        }
        var em = $E('tInput').parentNode.children[0];
        if(em&&em.nodeName.toUpperCase()==='EM'){
            //em.parentNode.removeChild(em);
            setTimeout(function(){
                em.parentNode.removeChild(em); //延迟删除，让删除发生在点击事件的代理checkHide之后
            }, 10);
        }
        // updown(1);
    }, 'focus');
    __addEvent($E('tagListClose'), function(){
        if($E('articleTagInput').value){
            $E('tInput').style.display = 'none';
        }
        $E("articleTagList").style.display = 'none';   
    });

    function checkHide(event){
        event = event || window.event;
        var t = event.srcElement || event.target,
            el = $E("articleTagList");
        if( Core.Dom.contains(el,t) || Core.Dom.contains($E('tInputContainer'),t) ){
            return;
        }
        if($E('articleTagInput').value){
            $E('tInput').style.display = 'none'; //没有标签还隐藏就可能导致tInputContainer没有高度
        }
        el.style.display = 'none';
        //updown(false);
        Core.Events.removeEvent(document.body,checkHide);
    }
    
});
