/**
 * @fileoverview	托盘推广位豪华广告套餐，页面设置和发博文页没有此广告，其它页都有此套餐
 * @author			Qiangyee | wangqiang1@staff
 */

$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/system/br.js");

$import("sina/core/dom/insertHTML.js");
$import("sina/core/dom/insertAfter.js");
$import("sina/core/dom/setStyle.js");
$import("sina/utils/cookie/setCookie.js");
$import("sina/utils/cookie/getCookie.js");

$import("lib/templateUtils.js");
$import("lib/oop2.js");

$import("lib/680/_blogAd.js");
$import("lib/680/shareToWeibo.js");

/**
 * @param {Object} oParam 博客tips托盘广告的参数
 * @param {HTMLElement} relativeNode 显示tips广告托盘的推广链接
 */
blogAd.meilaTrayAd = function(oParam, relativeNode){
    relativeNode.innerHTML = oParam["adLink"];
    var __this = this,
        __template = ['<div id="#{entity}" style="display:none;z-index:523;left:400px;top:30px;position:absolute; margin:0px;padding:0px; width:358px;height: 55px;border-bottom:1px #c2337b solid;position:absolute;">',
            '<a id="#{closeBtn}" href="javascript:void(0);" style="text-decoration:none;float:right;padding:10px ;color:#c2337b;text-decoration:none;">x</a>',
	'<h1 id="#{userNick}" style="margin:0px;padding:15px 0 0 20px;font-size:12px;color:#70026a;font-weight:bold;"></h1>',
	'<p id="#{tipsTxtLink}" style="margin:5px 10px 0 20px;padding:0 20px;font-size:12px;line-height:15px;color:#70026a;"></p>',
  '</div>'].join("");
    this.relativeNodeId = relativeNode.id;
	this.MARK_ID = 1;
	this.LIMITED = 24;

	var nodes = this.nodes = this.getTemplateNodes(__template);

	Core.Dom.insertAfter(nodes.entity, document.body.lastChild);

    if (!$IE6 && oParam.backgroundPic){
        try{
            nodes.entity.style.backgroundImage = "url("+oParam.backgroundPic+")";
        }catch(e){}
    } else if ($IE6 && oParam.ie6BackgroundPic){
        nodes.entity.style.backgroundImage = "url("+oParam.ie6BackgroundPic+")";
    }
    
    if($nick){
        nodes.userNick.innerHTML = 'HI，'+$nick.replace(/</g, "&lt;");
    }
    
    nodes.tipsTxtLink.innerHTML = oParam.tipsTxtLink;
    
    if (!$IE6 && oParam.tipsTxtLinkBgPic){
        nodes.tipsTxtLink.children[0].style.backgroundImage = "url("+oParam.tipsTxtLinkBgPic+")";
    } else if ($IE6 && oParam.ie6TipsTxtLinkBgPic){
        nodes.tipsTxtLink.children[0].style.backgroundImage = "url("+oParam.ie6TipsTxtLinkBgPic+")";
    }
    
	Core.Events.addEvent(nodes.closeBtn, function(){
		__this.hide();
		// 统计用户关闭
		if(oParam.status.adclose){
            new Image().src = oParam.status.adclose;
        }
	}, "click");

    this.setPos();
    this.show();
    this.initResizeEvent();
    // 统计展现
    if(oParam.status && oParam.status.adstart)
    new Image().src = oParam.status.adstart;
	
}.$defineProto({
    //设置cookie表明套餐已经显示
	setMark:function(){
        Utils.Cookie.setCookie("blogTipsAd",1, 24, "/", ".blog.sina.com.cn");
	},

	setPos : function(){
        var relativeNode = $E(this.relativeNodeId);
        var xy = Core.Dom.getXY(relativeNode);
        var linkWidth = $E("loginBarActivity").offsetWidth,
            nodeStyle = this.nodes.entity.style;
            
        nodeStyle.left = parseInt(xy[0])+(linkWidth-220)+'px';
        nodeStyle.top = parseInt(xy[1])+23+'px';
    },
    
	show:function(){
        this.isHidden = false;
        var tipsEl = this.nodes.entity, _setStyle = Core.Dom.setStyle;
        var tween = new Ui.TweenStrategy(0, 1, 0.5, function(t, b, c, d){
			return -c*(t/=d)*(t-2)+b;
		});
		tween.onTween = function(val){
			_setStyle(tipsEl,"opacity",val);
		};
		tween.onEnd = function(){
            if (!$IE){
                _setStyle(tipsEl,"opacity","none");
            } else{
                tipsEl.style.filter = "none";
            }
		};
        _setStyle(tipsEl,"opacity",0);
		tipsEl.style.display = "block";
		tween.start();
	},
	
	hide:function(){
		
		this.setMark();
        this.isHidden = true;
         var tipsEl = this.nodes.entity, _setStyle = Core.Dom.setStyle;
        var tween = new Ui.TweenStrategy(1, 0, 0.5, function(t, b, c, d){
			return -c*(t/=d)*(t-2)+b;
		});
		tween.onTween = function(val){
			_setStyle(tipsEl,"opacity",val);
		};
		tween.onEnd = function(){
            if (!$IE){
                _setStyle(tipsEl,"opacity","none");
            } else{
                tipsEl.style.filter = "none";
            }
            tipsEl.style.display = "none";
		};
		tween.start();
	},
    
    initResizeEvent:function(){
        var me = this;
        Core.Events.addEvent(window, function(){
            if (!me.isHidden){
                me.setPos();
            }
        }, "resize");
    }
	
}).$mixProto(Lib.templateUtils);