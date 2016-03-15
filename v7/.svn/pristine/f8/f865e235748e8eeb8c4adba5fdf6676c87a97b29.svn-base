/**
 * @name 按百分比值动态显示每项的投票结果
 * @author shaomin | shaomin@staff.sina.com.cn
 */
 $import("sina/sina.js");
 $import("lib/jobs.js");
 $import("lib/interface.js");
 $import("sina/core/system/br.js");
 $import("sina/core/dom/getElementsByClass.js");
 $import("sina/core/string/stringBuffer.js");
 $import("sina/utils/io/jsload.js");
 $import("vote/domEvent.js");
 $import("msg/voteMsg.js");


 $registJob("dynamicVoteView",function(){
     var optList = $E("voter");
	 
	 window.vote_progress_css = [
	 	'1px solid #8d458e',
		'1px solid #578425',
		'1px solid #89ba00',
		'1px solid #008d8e',
		'1px solid #7da4cf',
		'1px solid #d54545',
		'1px solid #ff8d46',
		'1px solid #f6bd0e',
		'1px solid #008dd5',
		'1px solid #b2aa01'
	 ];

	 if($E('voterlist')) {
			Lib.checkAuthor();
			var isEscape = "";
			try {
				isEscape = Core.Dom.getElementsByClass($E('voter'), 'span', 'voteState')[0].innerHTML;
			}catch(error) {}
	 
			Utils.Io.JsLoad.request("http://control.blog.sina.com.cn/blog_rebuild/riaapi/blog/get_user_vote.php",{
				GET : {
				 blog_id:scope.$articleid
				},
				onComplete : function(res){
					try{
						if(res.code == 'A00006'){
							// debugger;
							window.vote_cache_content_html = $E('voteViewContent')?$E('voteViewContent').innerHTML:"";
							window.vote_interface_result = res.data && res.data.newten;
							window.vote_count = res.data && res.data.count;
							renderVoteNum();
						}else{
							winDialog.alert(res.code,{icon:'02'});
							if($E('voterlist') && $isLogin && isEscape != '投票已截止') {
									$E('voterlist').innerHTML = "还没有博主投票呢，赶紧抢个沙发吧。";
							}else if (isEscape == '投票已截止') {
								try {
									var flashBar = Core.Dom.getElementsByClass($E('voter'), 'div', 'vShape')[0];
									if (flashBar) {
										flashBar.style.display = "none";
									}	
									Core.Dom.getElementsByClass($E('module_920'), 'div', 'newVoteList SG_j_linedot1')[0].style.display = "none";
								}catch(error) {}
							}else {
								if(!$isLogin)
									$E('voterlist').innerHTML = "还没有博主投票呢，赶紧抢个沙发吧。";
								else
									$E('voterlist').innerHTML = "加载中…";
								//$E('vote_login_txt').style.display = "";
							}
						}
					}catch(e){trace('vote error')}
				 },
				noencode : true,
				onError:function(res) {
					//trace("调用最新接口失败"+res);
					if($E('voterlist')) {
						$E('voterlist').innerHTML = "加载中…";
					}
					if(isEscape == '投票已截止') {
						try {
							Core.Dom.getElementsByClass($E('module_920'), 'div', 'newVoteList SG_j_linedot1')[0].style.display = "none";
						}catch(error) {}
					}
				}
			 });
	 }
     
 
 });

