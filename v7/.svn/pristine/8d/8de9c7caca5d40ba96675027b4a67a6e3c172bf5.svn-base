/** 
 * @ 自动隐藏的 提示信息 继承自Ui.Panel
 * @author meichun1@sina.staff.com.cn
 * 
 * new Ui.autoFadePanal().init(400, '操作成功！');
 * 
 */
$import("sina/sina.js");
$import("lib/lib.js");
$import("sina/ui/panel.js");
$import("sina/core/class/create.js");
$import("sina/core/dom/opacity.js");
$import("sina/core/dom/getStyle.js");
$import("sina/core/dom/removeNode.js");


Ui.autoFadePanal = function() {}.$extends(Ui.Panel).$define({
		init: function(time, html, type, xyCfg) {
				/*
				 * time：消失的事件
				 * 
				 * html：文案或html
				 * 
				 * type默认为0
				 * 0:成功 
				 * 1:提醒
				 * 2:失败
				 * */

				html = this.toHtml(html, type);
				var tmp = this.setTemplate(html || "");
				tmp.setMiddle(xyCfg).show();

				setTimeout(this.fadeOut.bind2(this), time);
				
				Ui.autoFadePanal.$super.setFixed.call(this,true);

				//关闭 提示框 
				if(this.nodes.closeBtn){
					Core.Events.addEvent(this.nodes.closeBtn, this.destroy.bind2(this));
				}
				
				this.entity.style.zIndex=2000;
				

		},
		
		toShow: function(html,opt,xyCfg) {
				/*
				 * time：消失的事件
				 * 
				 * html：文案或html
				 * 
				 * type默认为0
				 * 0:成功 
				 * 1:提醒
				 * 2:失败
				 * */
				opt = opt || {};
				html = this.toHtml(html, opt.type, opt.isMsg);
				var tmp = this.setTemplate(html || "");
				tmp.setMiddle(xyCfg).show();
				var me = this;
				setTimeout(function(){
					me.fadeOut();
					opt.callBack && opt.callBack();
				}, opt.time || 2000);
				if($IE) {
					Ui.autoFadePanal.$super.setAdamant.call(this,true);
				}
				Ui.autoFadePanal.$super.setFixed.call(this,true);

				//关闭 提示框 
				Core.Events.addEvent(this.nodes.closeBtn, this.destroy.bind2(this));

		},

		toHtml: function(html, type, isMsg) {

				//属于HTML
				if (!isMsg && /^(?:[^<]*(<[\w\W]+>)[^>]*$)/.test(html)) {
						return html;
				} else {
						//return '<div class="tb_layer_Y" id="#{entity}"><div class="tb_layer_Y_main"><div class="rcm01"><p class="favorite ' + ['success', 'reminded', 'failure'][type || 0] + '"><img src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" alt="">' + html + '</p></div></div></div>'
						return '<div class="tb_layer_Y" id="#{entity}"><div class="tb_layer_Y_main1"><div class="rcm02"><p class="favorite '+ ['success', 'reminded', 'failure'][type || 0] +'"><img src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" alt="">' + html + '</p></div></div></div>'

				}

		},

		setMiddle: function(xyCfg) {
				var areaHeight = this.__getDocumentSize().height - this.height,
				goldenSection = (Math.sqrt(5) - 1) / 2,
				totalSection = 1,
				goldenSectionY = areaHeight * goldenSection / (goldenSection + totalSection),
				middleX = this.__getDocumentSize().width / 2 - this.width / 2;

				if (!this.__isFixed) {
						goldenSectionY += Math.max(document.documentElement.scrollTop, document.body.scrollTop);
						middleX += Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
				}
				if(!xyCfg){
					xyCfg = {
							x: Math.max(middleX, 0),
							y: Math.max(goldenSectionY, 0)
						}
				}
				this.setPosition(xyCfg);
				return this;
		},

		__getDocumentSize: function() {
				var w = document.documentElement.clientWidth || document.body.clientWidth,
				h = document.documentElement.clientHeight || document.body.clientHeight;

				return {
						width: w,
						height: h
				};
		},

		fadeOut: function() {
				var _this = this,
				entity = this.entity,
				i = 100;
				Core.Dom.opacity(entity, 100);
				(function fn() {
						Core.Dom.opacity(entity, i -= 5);

						if (Core.Dom.getStyle(entity, 'opacity') > 0.05) {
								setTimeout(fn, 20);
						} else {
								_this.destroy();
						}
				})();

		}
});

/*
		//HTML  带  id closeBtn节点  关闭节点
		var html = ['<div class="ad_layer" id="#{entity}" style="position:fixed; border:15px solid red;">', '<p class="close_wd close" id="#{closeBtn}">保存成功</p>', '<p class="right_arr"></p>', '<div class="center" id="#{content}">保存成功', '</div>',  '</div>'].join("");

		new Ui.autoFadePanal().init(1000, {
				x: 500,
				y: 500,
				z: 102
		},
		html);*/