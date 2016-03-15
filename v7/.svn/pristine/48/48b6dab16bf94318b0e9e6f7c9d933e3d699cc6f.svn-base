/**
 * @fileoverview 此文件是应用于取消关注的标签
 * @author   Liu Xiaoyue || xiaoyue3@staff.sina.com.cn
 * @created     2012-07-27
 * @vertion 0.01
 */
 $import("lib/jobs.js");
 $import("sina/utils/io/ijax.js");
 $import("sina/core/string/j2o.js");
 $import("sina/core/dom/removeNode.js");
 $import("lib/dialogConfig.js");
 $import("lib/showError.js");

 $registJob('delAttentionTags', function() {
	window.delAttentionTags = function(el,tagid){
		var tagId = tagid;
		winDialog.confirm("确定要取消此关注标签吗?",{
			subText:"",
			funcOk:function(){
				var url = "http://control.blog.sina.com.cn/blog_rebuild/riaapi/profile/attentags/userDelTag.php"; 
				Utils.Io.Ijax.request(url, {
					onComplete: function(result) {
						var result = Core.String.j2o(result);
						if(result && result.code==="A00006") {
							if(scope.$pageid == "profile_tags"){
								 var tag = el.parentNode.tagName.toLowerCase();
								 if( tag === "p"){
									window.location=window.location.toString().replace(/#.*/,"");
								 }else{
									var li = el.parentNode.parentNode.parentNode.parentNode;
									Core.Dom.removeNode(li);	
								 }	
							}else{
								 var li = el.parentNode.parentNode.parentNode.parentNode;
								 Core.Dom.removeNode(li);
							}
						}else{
							showError(result.code);
						}
					},
					returnType:"json",
					POST: {
						tagid:tagId
					}
				});
			}
		});		
	};

 });