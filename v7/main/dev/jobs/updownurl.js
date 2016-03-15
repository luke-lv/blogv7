/**
 * 博客文章页上下页 读取显示功能
 * @author stan | chaoliang@staff.sina.com.cn
 */
$import("sina/core/dom/getChildrenByClass.js");

$import("lib/interface.js");
$import("lib/jobs.js");
$import("lib/checkAuthor.js");

$registJob("updownurl", function(){
	var new_cont = $E("new_nextprev_" + scope.$articleid);
	if(!new_cont){	// Modified by L.Ming @2009.10.22 如果是私密博文，且是访客访问的时候，就不读取数字
		Lib.checkAuthor();
		if(scope.$pn_x_rank == "1" && !$isAdmin){
			return false;
		}
		var cont = $E("nextprev_" + scope.$articleid);
	    var inter = new Interface("http://blogtj.sinajs.cn/api/get_prevnext_article.php", "jsload");
	    var node = $E("t_" + scope.$articleid).parentNode;
		var time = Core.Dom.getChildrenByClass(node,"time")[0].innerHTML;
		time = time.replace("(", "").replace(")", "");
	    inter.request({
	        GET: {
	            uid: scope.$uid,
	            blog_id: scope.$articleid,
	            varname: "prevnext",
	            //博文发表时间
	            blog_pubdate: time,
				pn_x_rank:scope.$pn_x_rank
			},
	        onSuccess: function(result){
				var html = "";
				/**
				 * 接口
				 * {"code":"A00006",data:{"next":null,"prev":{"blog_url":"http:\/\/blog.sina.com.cn\/s\/blog_5a1c4ece0100cv15.html~type=v5_one&label=rela_nextarticle","blog_title":""}}}
				 */
				if(result.prev != null){
					html += '<div><span class="SG_txtb">前一篇：</span><a href="'
								+ result.prev.blog_url + '">' + result.prev.blog_title + '</a></div>';
				}
				if(result.next != null){
					html += '<div><span class="SG_txtb">后一篇：</span><a href="'
								+ result.next.blog_url + '">' + result.next.blog_title + '</a></div>';
				}
	            cont.innerHTML = html;
			},
			onError: function(){
				//alert("xia bi le!");
			}
	    });
	}
});

