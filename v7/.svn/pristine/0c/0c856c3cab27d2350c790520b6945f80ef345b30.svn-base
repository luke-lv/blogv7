/**
 * @fileoverview 不同feed分类，模块渲染
 * @author   Liu Xiaoyue || xiaoyue3@staff.sina.com.cn
 * @created  2012-11-13
 * @vertion 0.01
 */
$import("mojie/_mojie.js");
$import("lib/interface.js");
$import("lib/showError.js");
$import("sina/utils/io/jsload.js");
$import("sina/Evter.js");
$import("sina/core/dom/removeNode.js");
$import("sina/utils/insertTemplate.js");

Mojie.renderFeedTypeModule = function(_type, _page){
    var feedwrap = $E('feedWrap'), select = $E("select"), allfeed = $E("allfeed");
    feedwrap.innerHTML = ['<div id="loading" style="text-align:center;padding-top:100px; height:200px">',
                                    '<img src="http://simg.sinajs.cn/blog7style/images/common/loading.gif">加载中…',
                                '</div>'].join('');
    var pageTpl = '<div class="SG_page">'+
                    '<ul id="pagerWrap" class="SG_pages">'+ 
                        '<li class="SG_pgnext"><a href="javascript:scope.feedView(0,\''+_type+'\',2,1);" title="跳转至第2页">下一页&nbsp;&gt;</a></li>'+   
                    '</ul>'+
                  '</div>';
    var icon = select.children[0], iconText = select.children[1];
    switch(_type){
        case "all":
            icon.className = "ct_icon ct_icon17";
            iconText.innerHTML = "全部";
            allfeed.innerHTML = "全部";
            break;
        case 'article':
            icon.className = "ct_icon ct_icon21";
            iconText.innerHTML = "博文";
            allfeed.innerHTML = "博文";
            break;
        case 'photo':
            icon.className = "ct_icon ct_icon19";
            iconText.innerHTML = "图片";
            allfeed.innerHTML = "图片";
            break;
        case 'tag':
            icon.className = "ct_icon ct_icon22";
            iconText.innerHTML = "标签";
            allfeed.innerHTML = "标签";
            break;
        case "like":
            icon.className = "ct_icon ct_icon20";
            iconText.innerHTML = "喜欢";
            allfeed.innerHTML = "喜欢";
            break;
        case "other":
            icon.className = "ct_icon ct_icon18";
            iconText.innerHTML = "其它";
            allfeed.innerHTML = "其它";
            break;
    }
    new Interface('http://control.blog.sina.com.cn/blog_rebuild/riaapi/profile/feed/getFeedByPage.php', 'jsload').request({
        GET: {
            tj: $E('tj').value, 
            'type': _type ||'0',//jsload传不了数字0...
            page: _page
        },
        onSuccess:function(data){
            if(!data.pager && $E("pagerWrap")){
                $E("pagerWrap").innerHTML = "";
            }else if(data.pager && !$E("pagerWrap")){
                Utils.insertTemplate(feedwrap, pageTpl, "AfterEnd");
            }else{
                if ($E("pagerWrap")) {
                    $E("pagerWrap").innerHTML = '<li class="SG_pgnext"><a href="javascript:scope.feedView(0,\''+_type+'\',2,1);" title="跳转至第2页">下一页&nbsp;&gt;</a></li>';
                }; 
            }
            feedwrap.innerHTML = data.html;
            if($E("loading")){
                var load = $E("loading");
                Core.Dom.removeNode(load);
            }
            //修正IE6下，渲染出现错位的情况。IE6比日和漫画更有创造力！
            feedwrap.style.zoom = 1;
        },
        onError:function(res) {
            showError(res.code);
        }
    });
};
