/**
 * @fileoverview 博客用户赞助功能测试邀请页
 * @author jiangwei5@staff.sina.com.cn
 * @date 
 */
$import("sina/core/events/addEvent.js");
$import("sina/utils/io/jsload.js");

$registJob("testInvite", function (){
	var el = $E("btn_box");
	var htmlStr = '<a href="javascript:void(0)" class="btn_gray">[message]</a>';
	var reqUrl = "http://control.blog.sina.com.cn/admin/rewards/set_user_rewards.php";

	var messages = ["已同意", "已拒绝"];
	if(el){
		getRewards(function (rewards){
			if(rewards == 1 || rewards == 2){
				el.innerHTML = htmlStr.replace("[message]", messages[rewards-1]);
			}else{
				var aEls = el.getElementsByTagName("a");
				for (var i = 0; i < 2; i++) {
					var aEl = aEls[i];
					aEl.href = "javascript:void(0)";
					Core.Events.addEvent(aEl, (function(i){
						return function (){
							el.innerHTML = htmlStr.replace("[message]", messages[i-1]);
							var url = reqUrl + "?isRewards=" + i;
							Utils.Io.JsLoad.request(url);
						};
					})(2-i));
				};
			}
			el.style.display = "";
		});
		
	}
	//获取rewards值, 决定是否添加入口按钮
    function getRewards(cb){
        // var url = "http://blogtj.sinajs.cn/riaapi/afterLoadChannel/after_load_channel.php"; 
        var url = 'http://comet.blog.sina.com.cn/api?maintype=load_channel';
        var refer = document.referrer;
        if(refer){
            var host = refer.match(/(\:\/\/)(.*?)(\/)/g);
            refer = host && host[0].replace(/(\:\/\/){0,}(\/){0,}/g,"");
        }else{
            refer="";
        }
        Utils.Io.JsLoad.request(url, {
          	GET: {
          		uid: '',
            	bloguid: scope.$uid,
            	refer: refer
          	},
          	onComplete: function (result){
            	if(result && result.code === 'A00006'){
              		cb(result.data && result.data.rewards && result.data.rewards.result);
            	}else{
            		cb(null);
            	}
          	}
        });
    }
});