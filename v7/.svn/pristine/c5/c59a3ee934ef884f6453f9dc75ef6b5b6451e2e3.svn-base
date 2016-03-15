/**
 * @fileInfo 替换相关博文第二条内容，包括博文夹页和推荐页
 * @author	 Liu Xiaoyue | liuxiaoyue@sina.com
 * @vertion   1
 * @update   Qiangyee | wangqiang1@staff
 */
$import("sina/core/dom/getChildrenByClass.js");

$registJob("relateBlogArticle", function(){
	var isTj = window.location.href.indexOf("tj=1") > -1;
    if (!isTj){
        isTj = 'articletj' === scope.$pageid;
    }

	//本次修改第二项，原因是原有列表是直接输出的，所以新家了一个job
	function findNode(el, direction, start) {
        if (!el){
            return null;
        }
		for (var node = el[start]; node; node = node[direction]) {
			if (node.nodeType == 1) {
				return node;
			}
		}
		return null;
	};

	var wrapper = $E("module_903"),
        $getCbyClz = Core.Dom.getChildrenByClass,
        dataUrl = "http://blog.sina.com.cn/lm/iframe/ad/284/",
        ulClassName,
        bodyWrapper,
        innerWrapper,
        ulWrapper,
        secondLi,
        contentA,
        linkA,
        blogLinks
        ;

	bodyWrapper = $getCbyClz(wrapper,"SG_connBody");
    // 夹页相关博文结构有变化
    if ('articletj' === scope.$pageid){
        ulWrapper = $getCbyClz(bodyWrapper[0], "reco_bloglist have_user");
        secondLi = $getCbyClz(ulWrapper[0], "reco_bloglist_con")[1];
        blogLinks = $T(secondLi, 'a');
        
    } else {
        innerWrapper = $getCbyClz(bodyWrapper[0],"atcTitList relaList");
	    ulWrapper = findNode(innerWrapper[0],"nextSibling", 'firstChild');
        secondLi = $getCbyClz(ulWrapper,"SG_j_linedot1")[1];
        blogLinks = $T(secondLi, 'a');
    }

    contentA = blogLinks[0];
    linkA    = blogLinks[1];

    // 替换第二条相关博文
    var relplaceSecondLink = function (){

        if ((typeof $BLOGARTICLEAD) != "undefined"){
            contentA.innerHTML = $BLOGARTICLEAD['ArticleTitle'];
            contentA.href = $BLOGARTICLEAD['ArticleLink'];
            contentA.setAttribute("title",$BLOGARTICLEAD['ArticleTitle']);

            linkA.innerHTML = $BLOGARTICLEAD['UserName'];
            linkA.href = $BLOGARTICLEAD['UserLink']; 
        }			
    };

	if(!isTj){
		dataUrl += "1.js";
	}else{
		dataUrl += "2.js";
	}

    Utils.Io.JsLoad.request(dataUrl, {
        onComplete:relplaceSecondLink,
        noreturn: true
    });

});

