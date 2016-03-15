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
blogAd.trayAd = function(oParam, relativeNode){
    relativeNode.innerHTML = oParam["adLink"];
	var __this = this, weiboMsg = ("true" == oParam['isusewb']), bottomBtn = oParam["bottomBtn"] || "",
        __template = [
        '<div class="tips_layer" id="#{entity}" style="z-index:150;position:absolute;top:23px;left:0px;display:none;">',
            '<p class="tips_top"></p>',
            '<div class="tips_bd">',
                '<div class="tips_layer_main">',
                    '<div class="tips_layer_chat" id="#{body}">',
                        '<div class="layer_G_chat_txt">',
                            '<div class="tb_layer_G_tit_btn"><span class="close" id="#{closeBtn}" title="关闭">×</span></div>',
                            '<div class="layer_G_chat_tit" id="#{weiboNick}"></div>',
                            '<div class="btn" id="#{followBtn}"></div>',
                            '<p class="layer_G_chat_para" id="#{content}"></p>',
                            '<p class="layer_btn"><a id="#{btnShare}" style="display:none;" href="javascript:;"></a></p>',
                        '</div>',
                        '<div class="clearit"></div>',
                    '</div>',
                '</div>',
          '</div>',
        '</div>'].join("");
    this.relativeNodeId = relativeNode.id;
	this.MARK_ID = 1;
	this.LIMITED = 24;
    
	var nodes = this.nodes = this.getTemplateNodes(__template);
    var contentEl = nodes.content;
	contentEl.innerHTML = oParam.content;
    if (weiboMsg){
        nodes.weiboNick.innerHTML = oParam.weiboNick || "";
        nodes.followBtn.innerHTML = oParam.followBtn || "";
    } else{
        var txtBody = contentEl.parentNode;
        txtBody.style.width = 160+'px';
        //txtBody.style.marginTop = 20+'px';
        nodes.weiboNick.style.display = "none";
        nodes.followBtn.style.display = "none";
    }
    //.innerHTML = oParam.pic;
    Core.Dom.insertHTML(nodes.body.firstChild, oParam.pic,"beforebegin");
	Core.Dom.insertAfter(nodes.entity, document.body.lastChild);
    
	Core.Events.addEvent(nodes.closeBtn, function(){
		__this.hide();
		// 统计用户关闭
		if(oParam.status.adclose){
            new Image().src = oParam.status.adclose;
        }
	}, "click");
    var btnShareBtn = nodes.btnShare;
    if (btnShareBtn && weiboMsg){
        btnShareBtn.innerHTML = "分享到微博";
        Core.Events.addEvent(btnShareBtn, function(){
            blogAd.shareToWeibo(oParam["addata"]);
        }, "click");
        btnShareBtn.style.display = "";
        btnShareBtn = null;
    } else if(btnShareBtn && bottomBtn){
        nodes.body.className += " tips_layer_chat1";
        var id = btnShareBtn.id, pn = btnShareBtn.parentNode;
        pn.innerHTML = bottomBtn;
        pn.firstChild.id = id;
        this.btnShareBtn = null;
    }
	
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
        nodeStyle.left = parseInt(xy[0])+(linkWidth-73)+'px';
        nodeStyle.top = parseInt(xy[1])+23+'px';
    },
    
	show:function(){
        this.isHidden = false;
        var tipsEl = this.nodes.entity, _setStyle = Core.Dom.setStyle;
        var tween = new Ui.TweenStrategy(0, 1, 1.5, function(t, b, c, d){
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
        var tween = new Ui.TweenStrategy(1, 0, 1.5, function(t, b, c, d){
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


