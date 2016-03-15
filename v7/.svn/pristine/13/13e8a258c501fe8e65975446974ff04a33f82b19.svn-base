/**
 * @fileoverview 读取需要推广的群博客的数据
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-18
 */

$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/utils/io/jsload.js");

$import("sina/core/array/each.js");
$import("sina/core/dom/removeNode.js");
$import("sina/core/string/trim.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/dom/getElementsByAttr.js");
$import("sina/ui/template.js");


$import("lib/dialogConfig.js");
$import("lib/checkAuthor.js");

$import("product/attention/attentionCrowd.js");

/**
 * 关注群博客组件
 */
scope.UpdatePromoteCrowdsEl = Core.Class.create();
scope.UpdatePromoteCrowdsEl.prototype={
	/**
	 * @param {HTMLElement} parentNode 群博客推广组件群li节点的父节点
	 */
	parentNode : null,
	/**
	 * @param {HTMLElement} changeLink 换一组链接
	 */
	changeLink : null,
	/**
	 * 推广群博客的数据，一般是10个群
	 */
	_promoteData : null,
	
	_addAttentionAction : null,
	
	/*
	 * 显示第几个推广群的标志
	 */
	_showIndex : 0,
	
	_innerCrowdHTML : '<div class="concern_pic">'+
						'<a title="#{crowdName}" href="http://qun.blog.sina.com.cn/#{crowdDomain}" target="_blank"><img src="#{crowdImgUrl}"></a>'+
					'</div>'+
					'<div class="concern_txt">'+
						'<p class="fb"><a title="#{crowdName}" href="http:\/\/qun.blog.sina.com.cn\/#{crowdDomain}" target="_blank">#{crowdTitle}</a></p>'+
						'<p>#{attentionNum}&nbsp;人关注</p>'+
						'<p><a id="crowd_attention_#{crowdId}" href="javascript:void(0);" class="addFollow"><span class="addnew">+</span>加关注</a></p>'+
					'</div>',
	/*
	 * 单个群博客推广图标显示模板
	 */
	_crowdTpl : '<li id="crowd_li_#{crowdId}"></li>',

	/**
	 * 初始化推广组件
	 * @param {HTMLElement} parentNode
	 * @param {HTMLElement} changeLink
	 */
	initialize : function(p, l){
		this.parentNode = p;
		this.changeLink = l;
		var _this = this;
		var onClickChangeLink = function(e){
			_this.updateEl();
		}
		Core.Events.addEvent(this.changeLink,onClickChangeLink,'click');
		this._addAttentionAction = new scope.AttentionCrowd();
	},
	initFollwLinkEvents : function(links){
		var _this = this;
		var attentionLinks = links ? links : Core.Dom.getElementsByClass(this.parentNode,'a', 'addFollow');
		Core.Array.each(attentionLinks,function(link){
			//为个元素添加click事件，加关注；
			Core.Events.addEvent(link,function(e){
				if(link.disabled)return;
				//Core.Dom.getElementByClassAttr(link,'addnew');
				link.disabled = true;
				var uid = scope.$uid;
				var aid = this.id.replace(/crowd_attention_/i,'');
				//发送请求添加关注
				function fn(){
					try{
						if('已关注' != link.parentNode.innerHTML){
							link.parentNode.innerHTML = '已关注';
							Core.Dom.removeNode(link);
						}
					}catch(e){}
				}
				_this._addAttentionAction.add(uid, aid, {
					success: function(data){
						fn();
						_this.removePromoteData(aid);
						_this.fadeOut($E("crowd_li_" + aid));
					},
					failure: function(data){
						fn();
						_this.removePromoteData(aid);
						_this.fadeOut($E("crowd_li_" + aid));
					}
				});
				setTimeout(fn, 500);
			},'click');
			return link;
		});
		
	},
	
	
	/**
	 * 设置推广数据，一般为10个群的基本信息
	 * @param {Array} promoteData  群的基本信息
	 */
	setPromoteData : function(d){
		this._promoteData = d;
	},
	_showBlogClubIndex : function(){
		var id = this.parentNode.id;
		this.parentNode.innerHTML = '<li style="text-align:center;"><a href="http://blog.sina.com.cn/lm/group/index.html">去主题博客逛逛...</></li>';
	},
	/**
	 * 渲染群博客的推广图标，加关注
	 * @param {Array} promoteData 群的基本信息，如果不传入，则默认为_promoteData里的数据
	 */
	updateEl : function(){
		var len = this._promoteData?this._promoteData.length:0;
		if(3 >= len){
			this.changeLink.style.display = 'none';
		}
		if(!this._promoteData || (0 === len)){
			this._showBlogClubIndex();
			return;
		}
		var _this = this;
		var d = this._getCrowds(this._promoteData, 3);
		this._removeCrowd();
		_this.parentNode.innerHTML = '';
		Core.Array.each(d,function(crowd){
			var el = _this.createCrowdEl(crowd);
			_this.parentNode.appendChild(el);
			return el;
		});
		this.initFollwLinkEvents();
	},
	
	
	/**
	 * 删除推广群博客数组中指定的群博客---前提此群博客已被用户关注
	 * 
	 * @param {String} crowdId 群博客的ID
	 */
	removePromoteData : function(aid){
		if(!this._promoteData)return;
		var d = this._promoteData;
		for(var i=0, len=d.length; i<len; i++){
			if(d[i].crowdId == aid){
				d.splice(i,1);
				break;
			}
		}
		if(3 >= this._promoteData.length){
			this.changeLink.style.display = 'none';
		}
	},
	
	/**
	 * 群博客渐出效果
	 * @param {Object} crowdEl
	 */
	fadeIn:function(crowdEl){
		var _this = this, i = 0;
		Core.Dom.opacity(crowdEl, 5);
		(function fn() {
				Core.Dom.opacity(crowdEl, i += 4);
				if (Core.Dom.getStyle(crowdEl, 'opacity') < 0.95) {
						setTimeout(fn, 20);
				}else{
					Core.Dom.opacity(crowdEl, 100);
				}
		})();
	},
	
	/**
	 * 群博客淡出效果
	 * @param {Object} crowdEl
	 */
	fadeOut:function(crowdEl){
		var _this = this, i = 100;
		Core.Dom.opacity(crowdEl, 100);
		(function fn() {
				Core.Dom.opacity(crowdEl, i -= 2);
				if (Core.Dom.getStyle(crowdEl, 'opacity') > 0.05) {
					setTimeout(fn, 20);
				} else {
					var next = crowdEl.nextSibling;
					Core.Dom.removeNode(crowdEl);
					_this.addCrowd(next);
				}
		})();
	},
	
	/**
	 * 添加一个推广的群博客
	 */
	addCrowd : function(afterNode){
		var len = this._promoteData.length
		if (3 > len || !len) {
			if (!len) {
				this._showBlogClubIndex();
			}
			return;
		}
		var d =  this._promoteData, pNode = this.parentNode,crowd;
		if(this._showIndex >= len){
			this._showIndex = 0;
		}
		for(var i=0; i<len; i++){
			crowd = d[this._showIndex];
			if(!$E('crowd_attention_'+crowd.crowdId)){
				break;
			}
			if(this._showIndex >= len){
				this._showIndex = 0;
			}else{
				this._showIndex++;
			}
		}
		
		this._showIndex++;
		var cLiEl = this.createCrowdEl(crowd);
		afterNode ? pNode.insertBefore(cLiEl,afterNode) : pNode.appendChild(cLiEl);
		var link = $E('crowd_attention_'+crowd.crowdId);
		this.fadeIn(cLiEl);
		this.initFollwLinkEvents([link]);
	},
	
	createCrowdEl : function(crowd){
		var html = new Ui.Template(this._innerCrowdHTML).evaluateMulti([crowd],false);
		var cLiEl = $C('li');
		cLiEl.innerHTML = html;
		cLiEl.id = "crowd_li_"+crowd.crowdId;
		return cLiEl;
	},
	
	
	/**
	 * 有错误时，关闭提示框时触发
	 */
	errorHandle : function(){
		
	},
	
	_removeCrowd : function(){
		var nodes = this.parentNode.childNodes;//Core.Dom.getElementsByAttr(this.parentNode,'li');
		for(var i=0, len = nodes.length; i < len; i++){
			Core.Dom.removeNode(nodes[i]);
		}
	},
	
	/**
	 * 从推广的群博客数组中取出number个群博客的JSON信息，如果number大于pCrowds的长度，则返回pCrowds
	 * 
	 * @param {Array} promoteCrowds 推广的群博客数组
	 * @param {Array} number 要取的群博客的个数
	 * @return {Array} crowds 从推广的群博客数组
	 */
	_getCrowds : function(/*Array*/ pCrowds, /*Number*/num){
		var len = pCrowds.length;
		if(num >= len){
			return pCrowds;
		}
		var returnCrowds = [], start = this._showIndex, c;
		for(var i=0; i < num; i++){
			if(this._showIndex >= len){
				this._showIndex = 0;
			}
			c = pCrowds[this._showIndex]
			returnCrowds.push(c);
			this._showIndex++;
		}
		return returnCrowds;
	}
};