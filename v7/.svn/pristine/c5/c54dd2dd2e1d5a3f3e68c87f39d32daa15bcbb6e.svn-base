//$import("sina/core/dom/addHTML.js");
$import("sina/utils/io/jsload.js");
$import("sina/core/dom/setStyle.js");
$import("sina/ui/tween.js");
$import("sina/ui/tween/tweenStrategy.js");
$import("sina/ui/tween/transition.js");
$import("lib/listener.js");
// $import("comment/post.js");
$import("sina/utils/json.js");
$import("lib/commentv2/add.js");
//$import("jobs/articleComment.js");
/**
 * @fileoverview 博客页面提醒job
 * @author qc qiuchen@staff.sina.com.cn
 * @date 2013-04-02
 
 */
 
 $registJob("blogTip", function(){
    var listener = Lib.Listener;
    listener.on({
            name     : "article-msg-loaded",
            callBack : function(data){
                onDataComplete(data);
            },
            scope    : this
        });
    
    
    var closeBtn = null;
    var uid = "";
    var cid = "";
    var NickName = "";
    var UserPicUrl = "";
    
    //重新设置评论用户ID和头像地址
    var reSetUID = function(_uid){
        uid = _uid;
    	var size = size || 50;
		var n = parseInt(_uid) % 8 + 1;
		UserPicUrl = "http://portrait" + n + ".sinaimg.cn/" + _uid + "/blog/" + size;
    };
    
    var onDataComplete = function(json){
    	if(json)
    	{
    	    //提示过的评论不再提示
    	    if(json.cms_id == cid)
    	    {
    	        return;
    	    }
    	    
    	    
    		reSetUID(json.uid);
    		cid = json.cms_id + "";
    		NickName = json.nick_name;
    		creatTip();
    		showTip();
    	}
    };
    
    //创建提示
	var creatTip = function(){
	    //console.log(1);
	    if(!$E("blogTip"))
        {
            //filter:Alpha(opacity=100); -moz-opacity: 0.4;
            var _shtml = '<div id="blogTip" class="mDynaState" style="position:fixed;z-index:300; left:580px; top:92px; opacity:0.0;"><div class="con"><a onclick="v7sendLog(\'40_01_47\')" href="###"><img id="UIMG" width="30" height="30" alt=""></a><a href="###" onclick="v7sendLog(\'40_01_47\')" id="NName" class="nickname"></a>刚刚对此博文进行了评论<span id="blogTipShowBtn">,<a href="###" onclick="v7sendLog(\'40_01_46\')">查看</a></span></div><a href="###" onclick="v7sendLog(\'40_01_48\');" class="close" title="关闭" id="blogTip_closeBtn">×</a></div>';
            Core.Dom.addHTML(document.body,_shtml);
            var xy = Core.Dom.getXY($E('sinabloga'));
            $E("blogTip").style.top = xy[1] + 'px';
            
            Core.Events.addEvent(blogTip,function(){
                hideTip();
                if($E("article_comment_list").childNodes[0].childNodes.length < 1 )
                {
                    var myComment = new Comment.List();
                    myComment.load(1);
                    scope.$comment_is_load_page_1 = 1;
                    setTimeout(checkCMS, 1000);
                }
                else
                {
                    checkCMS();
                }
                Core.Events.stopEvent();
            },"click");
                
            Core.Events.addEvent(blogTip_closeBtn,function(){
                hideTip();
                Core.Events.stopEvent();
            },"click");
            
            Core.Events.addEvent(UIMG,function(){
                window.open("http://blog.sina.com.cn/u/" + uid);
                hideTip();
                Core.Events.stopEvent();
            },"click");
            
            Core.Events.addEvent(NName,function(){
                window.open("http://blog.sina.com.cn/u/" + uid);
                hideTip();
                Core.Events.stopEvent();
            },"click");
        }
        $E(UIMG).src = UserPicUrl;
        
        var nickNameLength = 0; 
        var a = NickName.split("");
        var flag = 0;
        for (var i=0;i<a.length;i++) { 
            if (a[i].charCodeAt(0)<299) { 
                nickNameLength += 0.75; 
            } else { 
                nickNameLength += 1; 
            }
            if(nickNameLength >= 8 && flag == 0)
            {
                flag = i;
            }
        }
        if(flag > 0)
        {
            $E(NName).innerHTML = NickName.substr(0, flag) + "...";
        }else
        {
            $E(NName).innerHTML = NickName;
        }
	//无cid隐藏查看功能
        if(cid){
            $E("blogTipShowBtn").style.display = "";
        }else{
            $E("blogTipShowBtn").style.display = "none";
        }
	};
	
	//检查评论列表中是否有对应的评论
	var checkCMS = function (){

	    if($E("cmt_" + cid))
        {
            changeHASH();
        }else
        {
            var url = "http://control.blog.sina.com.cn/blog_rebuild/riaapi/profile/note/getCms.php?uid=" + scope.$uid + "&cms_id=" + cid;
            Utils.Io.JsLoad.request(url, {
            onComplete: (function(result){
                if (result && 'A00006' === result.code) {
                    result.data["cid"] = cid;
                    addCMS(result.data);
                }
                
            }),
            onException: (function(){
                location.hash = "commonComment";
            }),
            timeout : 3000
            });
        }
	}
	
	//创建评论
	var addCMS = function (data){
	    //console.log(data);
        var $container = $E('article_comment_list');
        
        //{"uid":"2014483223","nick_name":"\u9a91\u9e45\u7684\u5f3a","cms_body":"\u5927\u53d1\u5149\u706b\u526a\u77ed\u53d1\u641e\u6d3b\u52a8 ","cms_pubdate":"2013-05-03 18:35:42"

     //    cid - 评论id
     // uid - uid
     // nick - 昵称
     // photo_server - 头像服务器地址
     // show_head - 头像模板
     // show_name - 名字模板
     // show_reply - 是否显示回复
     // show_delete - 是否显示删除
     // *comment - 评论内容
     // time - 时间
     //"id":"355","stair_cms_id":null,"is_first":true,"comm_uid":"1286841033","cms_uid_vinfo":false,"src_uid":"1286841033","cms_reply_num":"5","cms_type":"1","cms_n":1,"fromProduct":"blog","is_reply":true,"upic":"<img src='http://blogimg.sinajs.cn/v5images/default.gif' />","uname":"footya","ria_index_url":"http://blog.sina.com.cn/u/1286841033","vimg":null,"user_image":"http://p2.sinaimg.cn/1286841033/30/47311376982755","uhost":"footyahys","ulink":"http://blog.sina.com.cn/u/1286841033","cms_body":"eeee","cms_circle_info":"","cms_pubdate":"2013-10-11 14:26:34","iscan_reply":1,"iscan_dele":1,"iscan_report":1
        var comment = new CommentV2.Add();
        var item = data;
        item.action_data = Utils.Json.flatten({
                    articleid: scope.$articleid,
                    commentid: item.id,
                    // cms_body: item.cms_body,
                    fromProduct: item.fromProduct,
                    comm_uid: item.uid,
                    uname: item.nick_name,
                    ulink: item.ulink,
					src_uid: item.src_uid,
					cms_reply_num: item.cms_reply_num
                });
		item.uname = item.nick_name;
        item.action_data = encodeURIComponent(item.action_data);
        var $li = comment.render(item);
        $container.insertBefore($li, $container.firstChild)
        changeHASH();
	}
	
	
	var changeHASH = function (){
	    location.hash = "cmt_" + cid;
	}
	
	//显示提示
	var showTip = function (){
        v7sendLog('40_01_45');
		$E("blogTip").style.display="";
		var tween = new Ui.TweenStrategy(0,1,0.5);
		tween.onTween = function(value){
			Core.Dom.setStyle($E("blogTip"), "opacity", value);
		};
		tween.onEnd = function(){
			tween = null;
            setTimeout(hideTip,5000);
		};
		tween.start();
	}
	
	//隐藏提示
	var hideTip = function (){
		var tween = new Ui.TweenStrategy(1,0,0.5);
		tween.onTween = function(value){
			Core.Dom.setStyle($E("blogTip"), "opacity", value);
		};
		tween.onEnd = function(){
			tween = null;
			$E("blogTip").style.display="none";
		};
		tween.start();
	}
});
 