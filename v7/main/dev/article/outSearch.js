/**
 * @author ANTZ
 */
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/ui/template.js");
$import("sina/utils/io/jsload.js");
$import("sina/core/string/shorten.js");
$import("lib/sendLog.js");
$import("article/getSearchReferrer.js");
$import("lib/openBlog.js");
//

Article.outSearch = function(){
    var dataURL = 'http://keyword.sina.com.cn/blogrelated/combinedqueryBPV_utf8.php';
    //关键词
    var key = "";
    //搜索页面编码
    var type = "GBK";
    var container = null;
    //显示容器的高
    var ch = 86;
    //主模板
    var mainTemplate = '<div class="blog_sfout">' +
    '<div class="blog_srhflt" >' +
    '<div class="blog_sfL">' +
    '<div class="blog_sfTit" id="out_topTitle"></div>' +
    '<div class="blog_sflist" id="out_content"></div>' +
    '</div>' +
    '<div class="blog_sfR" id="out_right"></div>' +
    '<div class="clear"></div>' +
    '</div>' +
    '<div class="blog_sfClo"><a id="searchXID" onclick="return false;" href="#"></a></div>' +
    '</div>';
    //内容模板				   
    var contentTemplate = '<ul>#{titleTxt}</ul>';
    //新增广告位
    // Modified by L.Ming 下线车展推荐链接，并增加搜索来源统计
    var adHTML = '<div style="float:right;margin-right:12px;"></div><img src="http://ba.sass.sina.com.cn/front/blog/deliver?psId=adps000004" style="display:none;"/>';
    
    //新增的最右边的广告位
    var adTeil = '<div class="blog_sfR_ad" id="blogSfRad"></div>';
	var adTeil2 = '<div class="blog_sfR_ad" id="blogSfRad2"></div>';
    var adType = 'img';

    var addTemplate = {};
    addTemplate['swf'] = '';
    addTemplate['img'] = '<a href="#{adHref}" title="" target="_blank"><img src="#{imgSrc}" /></a>';
    
    var loadingTemplate = '<div class="loatReading">读取中...</div>';
    var errorTemplate = '<div class="interErro"><a href="http://search.sina.com.cn/?c=blog" target="_blank">网络问题，请点击此处重新获取内容</a></div>';
    var hotTitleTemplate = '<h3>近期热点内容推荐：</h3>';
	var tmpadStr = '';
    var titleTemplate = '关于“<span class="blog_sfNm"><a href="#" onclick="return false;" title="#{title}">#{content}</a></span>”的更多内容：'+tmpadStr;
    //loadingTemplate = titleTemplate;
	var inArticlePage = (scope.$pageid == 'article' || scope.$pageid == 'articleM') ? true : false;
    var nologintp = '<div><div class="open"><span>新浪博客在乎你的声音！</span><a onclick="v7sendLog(\'09_29_a01_0\',scope.$pageid,\'searchTips\');window.location.href=\'http://login.sina.com.cn/signup/signup.php?entry=blog&srcuid=' + scope.$uid + '&src=blogicp\'" href="###"><img src="http://simg.sinajs.cn/blog7style/images/blog/srh_flt/btn.gif"></a><div class="clear"></div></div>' +
    '<p class="login"><a href="#" '+(inArticlePage ? '' : 'style="display:none"')+' id="serzz" onclick="return false;">我要转载这篇博文</a>&nbsp;&nbsp;<a href="#" onclick="return false;" id="sergg">我要关注此博主</a>&nbsp;&nbsp;[<a href="#" onclick="return false;" id="outshlogin">请登录</a>]</p></div>' +
    adTeil;
	var opendBlog = scope.hasOpenBlog || 'open';
	opendBlog = opendBlog == 'open' ? true : false;
    var logintmpl = '<div id="opendBlogSearchTip" style="display:'
		+(opendBlog ? 'block' : 'none')+
	'">' +
    ' <div class="photo"><a onclick="v7sendLog(\'09_29_a05_#{id}\',scope.$pageid,\'searchTips\');window.location.href=\'http://blog.sina.com.cn/u/#{id}\'" href="###"><img src="#{portait}"></a></div>' +
    '<div class="person">' +
    '<p class="hello">#{wenhou}，<span>#{nick}</span><a onclick="v7sendLog(\'09_29_a06_#{id}\',scope.$pageid,\'searchTips\');window.location.href=\'http://login.sina.com.cn/cgi/login/logout.php\'" href="###">[退出]</a></p>' +
    '<div class="perlink">' +
    ' <ul>' +
    '<li><img class="perctr" src="http://simg.sinajs.cn/blog7style/images/blog/srh_flt/icon1.gif"><a onclick="v7sendLog(\'09_29_a07_#{id}\',scope.$pageid,\'searchTips\');window.location.href=\'http://control.blog.sina.com.cn/blogprofile/index.php\'" href="###">个人中心</a></li>' +
    '<li><img src="http://simg.sinajs.cn/blog7style/images/blog/srh_flt/icon2.gif"><a onclick="v7sendLog(\'09_29_a08_#{id}\',scope.$pageid,\'searchTips\'); window.location.href=\'http://blog.sina.com.cn/u/#{id}\'" href="###">我的博客</a></li>' +
    '<li><img src="http://simg.sinajs.cn/blog7style/images/blog/srh_flt/icon3.gif"><a onclick="v7sendLog(\'09_29_a09_#{id}\',scope.$pageid,\'searchTips\');window.location.href=\'http://control.blog.sina.com.cn/admin/article/article_add.php\'" href="###">发博文</a></li>' +
    '<div class="clear"></div>' +
    '</ul>' +
    '</div>' +
    '<div class="peroth"><a onclick="v7sendLog(\'09_29_a10_#{id}\',scope.$pageid,\'searchTips\');window.location.href=\'http://control.blog.sina.com.cn/blogprofile/profilenoticelist.php\'" href="###">通知#{notice}</a><span>|</span><a onclick="v7sendLog(\'09_29_a11_#{id}\',scope.$pageid,\'searchTips\');window.location.href=\'http://control.blog.sina.com.cn/blogprofile/profilepaperlist.php?type=1\'" href="###">纸条#{message}</a><span>|</span><a onclick="v7sendLog(\'09_29_a13_#{id}\',scope.$pageid,\'searchTips\');window.location.href=\'http://control.blog.sina.com.cn/blogprofile/profilecommlist.php?type=1\'" href="###">评论#{blogcomment}</a></div>' +
    '</div>' +
    '<div class="clear"></div>' +
    adTeil +
    '</div>'+
	'<div id="noOpendBlogSearchTip" style="display:'
		+(opendBlog ? 'none' : 'block')+
	'">\
		<div class="photo"><a href="#" title=""><img src="#{portait}" alt="" /></a></div>\
		<div class="person">\
			<p class="hello">#{wenhou}，<span>#{nick}</span><a onclick="v7sendLog(\'09_29_a06_#{id}\',scope.$pageid,\'searchTips\');window.location.href=\'http://login.sina.com.cn/cgi/login/logout.php\'" href="###">[退出]</a></p>\
			<p class="noopen">你尚未开通博客 <a href="javascript:void(0)" id="wantToOpenIt" onclick="return false;" class="nowopen" title="立即开通博客"></a></p>\
		</div>\
		<div class="clear"></div>'
		+
		adTeil2
	+ '</div>';
    //广告图片的一些对象,回调时调用
    var adObj = {};
    var logintp = '';
    var refreshlogin = function(){
        var us = {};
        us.portait = "http://portrait" + ((1 * $UID) % 8 + 1) + ".sinaimg.cn/" + $UID + "/blog/50";
        us.id = $UID;
        us.wenhou = "早上好";
        var dt = new Date();
        if (dt.getHours() < 6 || dt.getHours() > 16) {
            us.wenhou = "晚上好";
        }
        else 
            if (dt.getHours() < 12) {
                us.wenhou = "早上好";
            }
            else 
                if (dt.getHours() < 15) {
                    us.wenhou = "中午好";
                }
                else {
                    us.wenhou = "下午好";
                }
        
        if (scope.unreadMsg) {
            us.nick = (typeof scope.unreadMsg.nickname == "undefeind") ? $UID : scope.unreadMsg.nickname;
            us.notice = (typeof scope.unreadMsg.notice == "undefeind" || scope.unreadMsg.notice == 0) ? "" : ("(" + scope.unreadMsg.notice + ")");
            us.blogcomment = (typeof scope.unreadMsg.blogcomment == "undefeind" || scope.unreadMsg.blogcomment == 0) ? "" : ("(" + scope.unreadMsg.blogcomment + ")");
            us.message = (typeof scope.unreadMsg.message == "undefeind" || scope.unreadMsg.message == 0) ? "" : ("(" + scope.unreadMsg.message + ")");
            
        }
        else {
            us.nick = $UID;
            us.notice = "";
            us.blogcomment = "";
            us.message = "";
        }
        logintp = new Ui.Template(logintmpl).evaluate(us);
    };
    if ($isLogin) {
        refreshlogin();
    }
    var animate = function(target, prop, from, to, step){
        step = step ? step : 2;
        target.style[prop] = from + "px";
        
        var loop = function(){
            var tt = parseInt(target.style[prop]);
            
            if (tt <= to + Math.abs(step) && tt >= to - Math.abs(step)) {
                target.style[prop] = to + "px";
            }
            else {
                target.style[prop] = (tt + step) + "px";
                setTimeout(loop, 30);
            }
        };
        loop();
    };
    //取得指定的字符串长度,并在最后带上"..."
    var getStrLen = function(str, n){
        var tmpStr = str.substr(0, n);
        var tmpCode = tmpStr.replace(/[^\x00-\xff]/g, '\r\n').split('');
        n = (tmpCode[n - 1] == '\r') ? n - 2 : n - 1;
        var l = tmpCode.slice(0, n).join('').replace(/\r\n/g, '*').length + 1;
        return tmpStr.substr(0, l);
    };
    //---------------------------------------------------------------------------
    //初始化，程序入口
    var init = function(){
        var ref = Article.getSearchReferrer();
        if (!ref) {
            return;
        }
        else {
            key = ref.key;
            type = ref.type;
        }
        //-----------------------------------------------------------------------------------
        //这里发出图片广告请求
        setTimeout(function(){
						
            adObj.imgSrc = '';
            adObj.adHref = '#';
            adObj.swfSrc = 'http://simg.sinajs.cn/blog7common/swf/240x60.swf';
        }, 1);
        //-----------------------------------------------------------------------------------
        Core.Events.addEvent(window, initContainer, "scroll", false);
    };
    
    
    //todo
    
    //当返回错误时调用
    var onGetContentError = function(){
        //alert("onGetContentErro");
        $E("out_content").innerHTML = errorTemplate;
        $E('out_right').innerHTML = $isLogin ? logintp : nologintp;
		addOpenEvent();
		addOtherEvt();
        //Core.Dom.insertHTML($E("out_contentpar"),($isLogin?logintp:nologintp),'AfterEnd');
    };
    
    //当返回数据成功并且合法时调用
    var onGetContentSucess = function(res){
        var info = {};
        var titleTxt_s = "";
        var len = res.data.b.length > 4 ? 4 : res.data.b.length;
        for (var i = 0; i < len; i++) {
            var temp_s = '<li><a  href="' + res.data.b[i].l + "?k=" + encodeURIComponent(res.data.k) + "&t=" + "utf-8" + '" title="' + res.data.b[i].f + '" target="_blank" onclick="v7sendLog(\'85_01_0'+(2+i)+'\');">' + Core.String.shorten(res.data.b[i].f, 20) + '</a></li>';
            titleTxt_s += temp_s;
        }
        info.titleTxt = titleTxt_s;
        
        contentTemplate = new Ui.Template(contentTemplate).evaluate(info);
        $E("out_content").innerHTML = contentTemplate;
        $E('out_right').innerHTML = $isLogin ? logintp : nologintp;
		addOpenEvent();
        //Core.Dom.insertHTML($E("out_contentpar"),($isLogin?logintp:nologintp),'AfterEnd');
        
        //outshlogin
        Core.Events.addEvent($E("outshlogin"), function(){
			v7sendLog("09_29_a04_0",scope.$pageid,"searchTips");
            var trayLogin = new Lib.Login.Ui();
            trayLogin.login(function(){
                refreshlogin();
                chooseStatus();
                //--------------登录广告-----------------
                appendImgCall('blogSfRad');
				appendImgCall('blogSfRad2');
                //-------------------------------
            }, false, "referer:" + location.hostname + location.pathname + ",func:0007"); //添加统计点，托盘，0007
        }, "click");
        //如果关键字是敏感词的话就更换标题文案
        if (res.code == "A09000") {
            $E("out_topTitle").innerHTML = adHTML + hotTitleTemplate;
        }
        else {
            var titleLink = "http://search.sina.com.cn/?c=blog&q=" + encodeURIComponent(res.data.k) + "&range=article&by=all&ie=utf-8";
			//自动加官博关注
			$E("out_topTitle").innerHTML = adHTML + '关于“<span class="blog_sfNm"><a onclick="v7sendLog(\'85_01_01\');" href="' + titleLink + '" target="_blank" title="' + res.data.k + '">' + res.data.ks + '</a></span>”的更多内容：'
			  + tmpadStr;
        }
        
        
        //------------------------------广告图片显示--------------------------------------------
		appendImgCall('blogSfRad');
		if($isLogin) {
			appendImgCall('blogSfRad2');
		}
        //------------------------------end--------------------------------------------
		addOtherEvt();
    };
    
    //------------------------------广告图片显示--------------------------------------------
    var appendImg = function(){
        setTimeout(function(){
            //appendImgCall('blogSfRad');
			//appendImgCall('blogSfRad2');
        }, 300);
    }
    
    var appendImgCall = function(adId){
        if (adType == 'img') {
            if (adObj.imgSrc) {
                addTemplate['img'] = new Ui.Template(addTemplate['img']).evaluate(adObj);
                if ($E(adId)) {
                    $E(adId).innerHTML = addTemplate['img'];
                }
                else {
                    appendImg();
                }
            }
            else {
                appendImg();
            }
        }
        else 
            if (adType == 'swf') {
                if (adObj.swfSrc) {
                    if ($E(adId)) {
                        var _addFlash = function(){
                            var _wmode = $FF ? "window" : "transparent";
                            var sinaFlash2 = new sinaFlash( //flash 的地址
adObj.swfSrc, adId+"fucengAD", //写入到页面后的 object id。
 "240", //宽
 "60", //高
 "9", //flash 版本
 "#FFFFFF", //flash 背景色
 false, //是否使用 flash 快速升级
 "High", //清晰度
 "http://www.sina.com.cn/", //快速升级 url
 "http://www.sina.com.cn/", //快速升级重定向 url
 false //是否检测flash
);
                            sinaFlash2.addParam("allowScriptAccess", "always"); //是否允许脚本互访
                            sinaFlash2.addParam("wmode", _wmode); //透明度，FF 下使用 window 模式。解决输入法问题。
                            sinaFlash2.write(adId); //写入容器的 id。
                        }
                        if (typeof sinaFlash == "undefined") {
                            Lib.include(["http://i3.sinaimg.cn/home/sinaflash.js"], _addFlash);
                        }
                        else {
                            var _wmode = $FF ? "window" : "transparent";
                            _addFlash();
                        }
                    }
                    else {
                        appendImg();
                    }
                }
                else {
                    appendImg();
                }
            }
    }
    
    //------------------------------end--------------------------------------------

    //绑定一些转载、关注事件--------------------------------------------------------
    var addOtherEvt = function(){
        if ($isLogin) {
        
        }
        else {
			Core.Events.addEvent($E("serzz"), function(){
			v7sendLog("09_29_a02_0",scope.$pageid,"searchTips");
            var trayLogin = new Lib.Login.Ui();
            trayLogin.login(function(){
                	refreshlogin();
					$E("serzz") && (scope.serarticle_quote = new Quote("serzz"));
					
					scope.serarticle_quote.check(null,null,null,function(){
						$E('opendBlogSearchTip').style.display = 'block';
						$E('noOpendBlogSearchTip').style.display = 'none';
					});
					
					chooseStatus();
					//$E('out_right').innerHTML = $isLogin ? logintp : nologintp;
					//--------------登录广告-----------------
               	 	appendImgCall('blogSfRad');
					appendImgCall('blogSfRad2');
                	//-------------------------------

            }, false, "referer:" + location.hostname + location.pathname + ",func:0007"); //添加统计点，托盘，0007
        	}, "click");
			
			Core.Events.addEvent($E("sergg"), function(){
			v7sendLog("09_29_a03_0",scope.$pageid,"searchTips");
            var trayLogin = new Lib.Login.Ui();
            trayLogin.login(function(){
                	refreshlogin();
					Lib.Component.Attention(null,null,function(code){
						$E('opendBlogSearchTip').style.display = 'block';
						$E('noOpendBlogSearchTip').style.display = 'none';
					});
					
					chooseStatus();
					//$E('out_right').innerHTML = $isLogin ? logintp : nologintp;
					
					//--------------登录广告-----------------
               	 	appendImgCall('blogSfRad');
					appendImgCall('blogSfRad2');
                	//-------------------------------

            }, false, "referer:" + location.hostname + location.pathname + ",func:0007"); //添加统计点，托盘，0007
        	}, "click");
			
			Core.Events.addEvent($E("serblog"), function(){
				v7sendLog("09_29_a01_0",scope.$pageid,"searchTips");
				window.location.href='http://login.sina.com.cn/signup/signup.php?entry=blog&srcuid=' + scope.$uid + '&src=blogicp';
			});
			
        }
    }
    //-----------------------------------------------------------------------------
    var getContent = function(){
        //如果key未编码的情况下就默认为utf-8编码
        //	if (!/^(%[abcdef0-9]{2}([+]*))*$/gi.test(key)) {
        if (!/^(%[abcdef0-9]{2})/gi.test(key)) {
            type = "utf-8";
        }
        var _io = Utils.Io.JsLoad.request(dataURL, {
            GET: {
                "type": type,
                "varname": "outSearch_data",
                "keyword": key
            },
            
            charset: "utf-8",
            
            //接口传输正常
            onComplete: (function(result){
                if (result && result.data && (result.code == "A00006" || result.code == "A09000")) {
                    onGetContentSucess(result);
                }
                else {
                    onGetContentError();
					//------------------------------广告图片显示--------------------------------------------
				        appendImgCall('blogSfRad');
						if($isLogin) {
							appendImgCall('blogSfRad2');
						}
			        //------------------------------end--------------------------------------------
                }
                
            }).bind2(this),
            
            //接口传输异常,(可选)
            onException: (function(){
                onGetContentError();
            }).bind2(this)
        });
    };
    
    //关闭容器
    var quit = function(){
        document.body.removeChild(container);
        //移除事件监听
        Core.Events.removeEvent(window, initContainer, "scroll");
        return false;
    };
    
    //初始化容器
    var initContainer = function(){
    
        //显示
        var show = function(){
            if (!$IE6) {
                container.style.position = "fixed";
                animate(container, "top", document.documentElement.clientHeight, document.documentElement.clientHeight - 85, -10);
            }
            else {
                container.style.position = "absolute";
                container.style.top = document.documentElement.clientHeight + document.documentElement.scrollTop - 86 + "px";
            }
        };
        
        //初始化内容
        var initContent = function(){
            /*不知原来如何出现这个东西的
             var right = scope.blog_outSearchTitle;
             if (right) {
             var temps = "";
             for(var i = 0,  len = right.length; i <len; i++){
             var s = '<span><a onclick="v6SendLog(\'blog\', \'search\', \'advertisement\')" href="' + right[i].link + '" target="_blank">' + right[i].title + '</a></span>';
             temps += s;
             }
             $E("out_rightTitle").innerHTML = temps;
             }
             */
            $E("out_content").innerHTML = loadingTemplate;
        };
        
        if (!container) {
            if (Math.max(document.documentElement.scrollTop, document.body.scrollTop) > 250) {
                container = $C("div");
				container.id="statBottomforniangs";
                container.style.left = "0px";
                container.style.zIndex = 101;
                container.style.width = "100%";
                //container.style.height="87px";
                container.innerHTML = mainTemplate;
                document.body.appendChild(container);
                //注册关掉按钮事件
                Core.Events.addEvent($E("searchXID"), quit, "click", false);
                show();
                initContent();
                //请求数据接口
                getContent();
                
            }
        }
        else {
            if ($IE6) {
                container.style.top = document.documentElement.clientHeight + document.documentElement.scrollTop - 85 + "px";
            }
        }
        
    };
	
	function chooseStatus() {
		if(!scope.hasOpenBlog) {
			trace('这是一位后登陆的用户');
			var timmer = setInterval(function(){
				trace('呀，怎么还没有出结果啊');
				if(scope.hasOpenBlog) {
					clearInterval(timmer);
					$E('out_right').innerHTML = $isLogin ? logintp : nologintp;
					if(scope.hasOpenBlog != 'open') {
						$E('opendBlogSearchTip').style.display = 'none';
						$E('noOpendBlogSearchTip').style.display = 'block';
					}
					addOpenEvent();
				}
			},10);
		} else {
			trace('这是已登陆的用户');
			$E('out_right').innerHTML = $isLogin ? logintp : nologintp;
			if(scope.hasOpenBlog != 'open') {
				$E('opendBlogSearchTip').style.display = 'none';
				$E('noOpendBlogSearchTip').style.display = 'block';
			}
			addOpenEvent();
		}
	}
	
	function addOpenEvent() {
		var openEle = $E('wantToOpenIt');
		if(openEle) {
			openEle.onclick = function() {
				scope.blogOpener.showDialog(function(){
					$E('opendBlogSearchTip').style.display = 'block';
					$E('noOpendBlogSearchTip').style.display = 'none';
				},true);
				return false;
			}
		}
	}
	
    init();
};
