/**
 * 假发表 博文，用于个人中心页
 */ 
$import('sina/core/date/getTimestamp.js');
$import('sina/ui/tween/transition.js');
$import('sina/ui/tween/tweenStrategy.js');
$registJob("fackSend", function(){
    scope.fackSend = function(data){
        var blogId = data.data;
        var blogTitle = $E('qu_article_title').value;
        var blogText = editor.getContentText();
        
        var uid = scope.$uid;
        var uname = scope.nickname || "";
        var fg = document.createDocumentFragment();
        
        var myDate = new Date();
        var mtime = myDate.getTimestamp("hh:mm");
        
        
        //用户头像的地址
        var selficosrc = Core.Dom.getElementsByClass(document, 'div', 'centerInfo_pt')[0].getElementsByTagName('img')[0].src;
        
        var imgsrc = '';//editor.iframeDocument.getElementsByTagName("img").length > 0 ? editor.iframeDocument.getElementsByTagName("img")[0].src : "";
        var imgs = editor.iframeDocument.getElementsByTagName("img");
        for (var i = 0; i < imgs.length; i++) {
            if (imgs[i].getAttribute('type') != 'face') {
                if (!imgsrc) {
                    imgsrc = imgs[i].src;
                    break;
                }
            }
        }
        var blogBody = editor.getContentHtml();
        blogText = blogText.replace(/\n/g, "");
        blogText = blogText.replace(/\s\s/g, " ");
        //	blogText = blogText.replace(/　/g,"");
        blogText = cSubstring(blogText, 160, 0) + (Core.String.byteLength(blogText) > 160 ? "..." : "");
        var tpl = '<div class="feedList">\
				    <div class="feedList_cell">\
				        <div class="feedList_pt">\
				            <a target="_blank" onclick="v7sendLog(\'97_01_01_' + uid + '\',\'profile_index\',\'\');" href="http://blog.sina.com.cn/u/' + uid + '"><img src="' + selficosrc + '"></a>\
				        </div>\
				        <div class="feedList_main">\
				            <div class="feedTitle">\
				                <a target="_blank" onclick="v7sendLog(\'97_02_01_' +
        uid +
        '\',\'profile_index\',\'\');" href="http://blog.sina.com.cn/u/' +
        uid +
        '"><strong>' +
        uname +
        '</strong></a>\
				                发表了博文：<a target="_blank" onclick="v7sendLog(\'97_04_01_' +
        uid +
        '\',\'profile_index\',\'\');" href="http://blog.sina.com.cn/s/blog_' +
        blogId +
        '.html">' +
        blogTitle +
        '</a>\
				                <span class="time SG_txtc">(今天 ' +
        mtime +
        ')</span>\
				            </div>\
				            <p>' +
        (imgsrc ? ('<span class="blog_pic"><span class="blog_des">' +
        blogText +
        '</span><span style="width: 92px;" id="view_' +
        blogId +
        '" class="blogPic_view"><span class="blogPic_view_area"><a target="_blank" onclick="v7sendLog(\'97_05_02_' +
        uid +
        '\',\'profile_index\',\'\');" href="http://blog.sina.com.cn/s/blog_' +
        blogId +
        '.html"><img width="80" height="80" alt="" src="' +
        imgsrc +
        '"></a></span></span></span>') : blogText) +
        '</p>\
				            <!--p class="SG_more"><a href="http://blog.sina.com.cn/u/' +
        uid +
        '" target="_blank">查看全文</a>&gt;&gt;</p-->\
				            <div class="feed_bottom" id="ctrl_'+ blogId+'">\
								<a href="#" id="share_'+ blogId +'" ti_title="'+blogTitle+'" ruid="'+uid +'" num="0" type=1 onclick="return false;">喜欢(0)</a>\
								<em class="SG_txtb">|</em>\
								<a href="#" id="cms_'+ blogId +'" onclick="return false;">评论(0)</a>\
							</div>\
				            <div>\
				                <input type="hidden" value="5519f72b1621b5976b7f89f8cf211671" id="' +
        blogId +
        '_v1"><input type="hidden" value="" id="' +
        blogId +
        '_v2">\
				            </div>\
				        </div>\
				        <div class="clearit">\
				        </div>\
				    </div>\
				</div>';
        var d = document.createElement("div");
        d.innerHTML = tpl;
        var x = Core.Dom.getElementsByClass(document, 'div', 'feedList'); //center_head
		if(x.length){
			x=x[0];
		}else{
			x = $E('popFeedRecomm_feedsBox');
			if(!x){
				x = $E('popFeedRecomm_feedsBox_parent');
			}
		}
		//while(x.className !='feedList' && x.nextSibling){
		//	x = x.nextSibling;
		//}alert(x);alert(x.nodeType);
		//if(!x || x.className !='feedList'){
		//	x = $E('popFeedRecomm_feedsBox');//_parent
		//	alert(222);
		//}
        //centerInfo_pt
        p = d.childNodes[0];
        //	x.parentNode.insertBefore(p, x);
        /**
         while (p = d.childNodes[0]) {
         //fg.appendChild(p);
         x.parentNode.insertBefore(p, x);
         }
         ***/
        var top_s = Core.Dom.getTop($E('as_editor_id'));
        var top_e = Core.Dom.getTop(x);
        var left_s = Core.Dom.getLeft(x);
        
        p.style.position = "absolute";
        p.style.left = left_s + "px";
        document.body.appendChild(p);
        
        var ts = new Ui.TweenStrategy(top_s, top_e, 0.5, Ui.Transition.backEaseOut);
        ts.onEnd = function(){
            p.style.position = "";
            x.parentNode.insertBefore(p, x);
            var cdiv = $C('div');
            cdiv.className = 'SG_j_linedot';
            x.parentNode.insertBefore(cdiv, x);
            
			x.style.marginTop=0;
			
            if (typeof window.sendOkPanel == 'undefined') {
                window.sendOkPanel = new Lib.Panel();
                var uid = 'd' + Core.Math.getUniqueId();
                window.sendOkPanel.setTemplate(['<div id="#{panel}" style="z-index:512; width:120px" style="" class="tb_layer_Y tb_layer_w5">', '<div class="tb_layer_Y_main tip_layer_main" style="background:url(http://simg.sinajs.cn/blog7style/images/common/sg_icon.gif) no-repeat scroll -655px -25px #FBF7E1;">', '<div class="tip_ps" style="width:auto;float:right;padding-right:0;">', '<a id="' + uid + '" title="关闭提示" class="tb_friend_inputDel" href="javascript:window.sendOkPanel.hidden();void(0);" ></a>', '</div>', '<div style="padding:6px 0;margin-left:25px;background:#FBF7E1;font-weight: bold;">博文发布成功</div>', '</div>', '<div class="tb_layer_arrow tip_arrow"></div>', '</div>'].join(''));
                Core.Events.addEvent($E('uid'), function(){
                    window.sendOkPanel.hidden();
                });
            }
            if (Core.Dom.getTop(p) > windowHeight() / 2) {
                scrollTo(0, Core.Dom.getTop(p) - windowHeight() / 2);
            }
            //显示发表成功的tip            
            window.sendOkPanel.setPosition(Core.Dom.getLeft(p), Core.Dom.getTop(p) - 20);
            window.sendOkPanel.show();
            setTimeout(function(){
                window.sendOkPanel.hidden();
            }, 5000);
			try{
				App.articleFeedFunction();	
			}catch(e){}			 
        };
        ts.onTween = function(value){
            p.style.top = value + "px";
        };
        ts.start();		
		
		//try{
			//scope.initShow();
		//}catch(e){}
		
		x.style.marginTop=p.offsetHeight+'px';		
       // addEv(blogId);
	  
        initQEdit();
    };
    
    function addEv(blogId){
        articleFeed = [$E('ctrl_' + blogId)];
        // 遍历所有带评论、转载、分享的节点，分别绑上单击事件
        for (var i = 0, len = articleFeed.length; i < len; i++) {
            var child = articleFeed[i].childNodes;
            var lens = child.length;
            var articleid;
            
            for (var j = 0; j < lens; j++) {
                if (child[j].id == null) {
                    continue;
                }
                articleid = child[j].id.split("_")[1];
                if (child[j].tagName.toUpperCase() == "A") {
                    var mark = child[j].innerHTML.substr(0, 2);
                    switch (mark) {
                        case "评论":
                            articleFeed[i].id = "ctrl_" + articleid;
                            var cms_count = child[j].innerHTML.replace(/\D/gi, "");
                            Core.Events.addEvent(child[j], Core.Function.bind3(function(articleid, cms_count){
                                Core.Events.stopEvent();
                                new App.CommentInFeed(articleid, cms_count);
                            }, null, [articleid, cms_count]));
                            break;
                        case "转载":
                        case "原文":
                            Core.Events.addEvent(child[j], Core.Function.bind3(function(articleid){
                                Core.Events.stopEvent();
                                var quote = new Quote();
                                quote.check(articleid);
                            }, null, [articleid]));
                            break;
                        case "收藏":
                            Core.Events.addEvent(child[j], Core.Function.bind3(function(articleid){
                                Core.Events.stopEvent();
                                new App.addFavoriteArticle(articleid, {
                                    callback: function(){
                                        winDialog.alert($SYSMSG.B03020, {
                                            icon: "03"
                                        });
                                    }
                                });
                            }, null, [articleid]));
                            break;
                    }
                }
            }
        }
    }
    
    //得到指定字节的字符串
    /**
     *
     * @param {Object} str				元字符串
     * @param {Object} blen				要被截取的字节长度
     * @param {Object} star				开始截取的位置
     */
    function cSubstring(str, blen, star){
        star = star | 0;
        str = str.substr(star, blen);
        var h = 0, t = blen - 1, n;
        var _str;
        var aMatch;
        
        do {
            n = Math.ceil((t + h) / 2);
            _str = str.substring(0, n + 1);
            if (gl(_str) > blen) {
                t = n;
            }
            else 
                if (gl(_str) < blen) {
                    h = n;
                }
                else {
                    return _str;
                }
            
        }
        while (gl(_str) != blen && t - h > 1)
        return _str;
        function gl(s){
            var m = s.match(/[^\x00-\x80]/g);
            return (s.length + (!m ? 0 : m.length))
        }
    }
    function windowHeight(){
        //一个快捷方式,用在IE6/7的严格模式中
        var de = document.documentElement;
        //如果浏览器存在innerHeight属性,则使用它
        return self.innerHeight ||
        //否则,尝试获取根节点高度
        (de && de.clientHeight) ||
        //最后,尝试获取body元素的高度
        document.body.clientHeight;
    }
    function initQEdit(){
        if(sendArticle.is_mobile){
			$E("editor_mb_ta").value = "";
		}
		editor.iframeDocument.body.innerHTML = "";
		editor.iframe.height = "53px";
		$E('as_editor_id').style.height="53px";
        var myDate = new Date();
        var s = myDate.getTimestamp("yyyy年MM月dd日");
        $E('qu_article_title').value = s + "的日记";
        sendArticle.swapMiniMode();
		if(!sendArticle.ccmini)
		{				
			sendArticle.ccmini=function(){
																		editor.iframe.height = "53px";
																		$E('as_editor_id').style.height="53px";
																		Core.Events.removeEvent($E(sendArticle.mini_editor),sendArticle.ccmini,"click");
																		sendArticle.ccmini = false;
																};
			Core.Events.addEvent($E(sendArticle.mini_editor),sendArticle.ccmini,"click");
		}	
    }
});
