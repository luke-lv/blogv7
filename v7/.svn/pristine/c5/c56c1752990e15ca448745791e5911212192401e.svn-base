
$import("sina/utils/insertTemplate.js");
$import("sina/utils/io/loadExternalCSS.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/dom/setStyle2.js");
$import("sina/core/dom/setStyle.js");
$import("sina/utils/io/ajax.js");
$import("sina/core/string/j2o.js");
$import("sina/core/dom/removeNode.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/utils/cookie/getCookie.js");
$import("sina/utils/cookie/setCookie.js");
$import("lib/jobs.js");
$import("lib/checkAuthor.js");
$import("lib/listener.js");
$import("lib/sendLog.js");

/**
 * @fileoverview 此文件是应用于博客首页，文章页 下线模版的公告
 * @author   Liu Xiaoyue || xiaoyue3@staff.sina.com.cn
 * @created     2012-12-26
 * @vertion 0.01
 * @引用该job的conf: indexM index article articleM articleList articleListM
 * @author Qiangyee | wangqiang1@staff  新托盘公告
 */
$registJob('blogNotice', function() {
    
    var $logo = $E('login_bar_logo_link_350');
    var __addEvent = Core.Events.addEvent,
        __removeEvent = Core.Events.removeEvent,
        __setCookie = Utils.Cookie.setCookie,
        __getCookie = Utils.Cookie.getCookie,
        _setStyle = Core.Dom.setStyle,
        listener = Lib.Listener,
        logFlag,
        showFlag;
        
    var flagUid = __getCookie('closeNotice_fzp');
    Lib.checkAuthor();
    if(flagUid && flagUid === $UID){
        return;
    }
    var pageid = scope.$pageid, 
        uid = scope.$uid,
        isTj = window.location.href.indexOf("tj=1") > -1;
    // tj=1页面也显示推荐浮层
    // if(isTj){
        // return;
    // }
    // 新托盘
    if ($logo && 'ntopbar_main' === $logo.parentNode.className){
        // 监听公告里的数据
        listener.on({
            name     : "notice_ad_layer",
            callBack : function(json){
                listener.notify('tray-announce-loaed', json);
            }
        });
        
        return;
    } else {
        //TODO 新托盘全部上线后删除
    	var _guide;
    	
    	var dd = document.documentElement;
    	
    	var template = {
    		guideLayer:'<div class="l_hornbg" id="#{guideLayer}" style="display:none;">'+
    						'<div class="l_horn">'+
    							'<span class="close" title="关闭" id="#{close}">&times;</span>'+
    							'<div class="horn1" id="#{noticeLayer}" style="display:none;">'+
    								'<div class="horn_left">'+
    									'<span class="horn_icon" id="#{noticeIcon}"></span>'+ 
    								'</div>'+
    								'<div class="horn_right" id="#{noticeAdLayer}">推荐：'+
    									'<a href="" target="blank" id="#{noticeAdCon1}" onclick="v7sendLog(\'48_01_12\');"></a>'+
    									'<a href="" target="blank" id="#{noticeAdCon2}" onclick="v7sendLog(\'48_01_13\');"></a>'+
    								'</div>'+
    							'</div>'+
    							'<div class="horn2" id="#{adLayer}">推荐：'+
    								'<a href="" target="blank" id="#{adContent1}" onclick="v7sendLog(\'48_01_12\');"></a>'+
    								'<a href="" target="blank" id="#{adContent2}" onclick="v7sendLog(\'48_01_13\');"></a>'+
    							'</div>'+	
    						'</div>'+
    					'</div>'
    	}
    	
    	var option = {
    		mid: {
    			'z-index': '500',
    			'position':$IE6?'absolute':'fixed'
    		}
    	};

    	var noticeCSSUrl = $_GLOBAL.cssBasicURL + 'module/layer/layer24.css';
    	Utils.Io.loadExternalCSS(noticeCSSUrl);
    	//加载公告里的数据
    	var loadNoticeLayer = function(json){
    		_guide = Utils.insertTemplate($E("sinabloga"),template.guideLayer,'BeforeBegin');
    		setMiddle(_guide.guideLayer);
    		if($IE6){
    			_guide.guideLayer.style.position = "absolute";
    			dd.style.backgroundImage = "url(ablout:blank)";
    			dd.style.backgroundAttachment="fixed";
    			__addEvent(window,ie6Fixed, "scroll");	
    		}
    		__addEvent(window,funcShowNotice, "scroll");
    		showNoticeTpl(json);
    	}
    	// 监听公告里的数据
        listener.on({
            name     : "notice_ad_layer",
            callBack : loadNoticeLayer
        });

    	//指定登陆用户显示下线模版公告
    	function showNoticeTpl(result){
    		if($isLogin && result.announce.result && (pageid === "indexM"|| pageid === "articleM" || pageid === "articlelistM")){
    			_guide.noticeLayer.style.display=""
    			_guide.adLayer.style.display = "none";
    			var info = result.announce;
    			Core.Dom.insertHTML(_guide.noticeIcon,info.announce_con,"AfterEnd");
    		}else{
    			_guide.adLayer.style.display = "";
    		}
    		if(result.advertise){
    			var adInfo = result.advertise;
    			var adCon1 = decodeURIComponent(adInfo.advertise_con1.content),
    				adCon2 = decodeURIComponent(adInfo.advertise_con2.content),
    				adHref1 = decodeURIComponent(adInfo.advertise_con1.link),
    				adHref2 = decodeURIComponent(adInfo.advertise_con2.link);
    			_guide.noticeAdCon1.innerHTML = adCon1;
    			_guide.noticeAdCon1.href = adHref1;
    			_guide.noticeAdCon2.innerHTML = adCon2;
    			_guide.noticeAdCon2.href = adHref2;
    			_guide.adContent1.innerHTML = adCon1;
    			_guide.adContent1.href = adHref1;
    			_guide.adContent2.innerHTML = adCon2;
    			_guide.adContent2.href = adHref2;
    			if(_guide.close){
    				__addEvent(_guide.close,function(){
    					__setCookie("closeNotice_fzp", $UID, 24, "/", ".blog.sina.com.cn");
    					delNoticeLayer();
    				});
    			}
    		}
    	}

    	//公告浮层显示隐藏函数
    	function funcShowNotice(){
    		var scrolltop = document.body.scrollTop + document.documentElement.scrollTop;
    		if(scrolltop > height){
    			//此处浮层显示采用渐显渐隐的方式
    			showNoticeLayer(_guide.guideLayer);
    			//ie6下的bug
    			if(!$IE6){
    				_guide.guideLayer.style.top = "0";
    			}
    			if(!logFlag){
    				logFlag = 1;
    				v7sendLog('48_01_11_' + scope.$pageid);
    			}
    		}else{
    			hideNoticeLayer(_guide.guideLayer);
    		}
    	}

    	//删除公告浮层函数
    	function delNoticeLayer(){
    		Core.Dom.removeNode(_guide.guideLayer);
    		__removeEvent(window,funcShowNotice,"scroll");
    		__removeEvent(window,ie6Fixed,"scroll");
    		scope.$channel = null;
    	}
    	//设定居中
    	function setMiddle(obj){
    		// var w = 950;
    		// obj.style.marginLeft = w / 2 * (-1) + 'px';
    		Core.Dom.setStyle2(obj, option.mid);
    	}
    	//ie6下浮层固定在上部
    	function ie6Fixed(){
    		_guide.guideLayer.style.top = document.documentElement.scrollTop + "px";
    		_guide.guideLayer.style.left= 0 + 'px';
    	}
    	//显示公告浮层
    	function showNoticeLayer(el){
    		if(!showFlag){
    			showFlag=1;
    	        var tween = new Ui.TweenStrategy(0, 1, 0.6, function(t, b, c, d){
    				return -c*(t/=d)*(t-2)+b;
    			});
    			tween.onTween = function(val){
    				_setStyle(el,"opacity",val);
    			};
    			tween.onEnd = function(){
    	            if (!$IE){
    	                _setStyle(el,"opacity","none");
    	            } else{
    	                el.style.filter = "none";
    	            }
    			};
    	        _setStyle(el,"opacity",0);
    			el.style.display = "block";
    			tween.start();
    		} 
    	}
    	//隐藏公告浮层
    	function hideNoticeLayer(el){
    		if(showFlag){
    			showFlag = 0;
    			var tween = new Ui.TweenStrategy(1, 0, 0.6, function(t, b, c, d){
    				return -c*(t/=d)*(t-2)+b;
    			});
    			tween.onTween = function(val){
    				_setStyle(el,"opacity",val);
    			};
    			tween.onEnd = function(){
    	            if (!$IE){
    	                _setStyle(el,"opacity","none");
    	            } else{
    	                el.style.filter = "none";
    	            }
    	            el.style.display = "none";
    			};
    			tween.start();
    		}
    	}
    }
 });