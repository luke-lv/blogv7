/**
 * @fileoverview 渲染访问统计页面 右侧
 * @author 武建 zouwujian@sina.com 
 * @created 2010-5-5
 */
$import("sina/sina.js");
$import("sina/utils/io/jsload.js");
$import("sina/core/dom/setXY.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/dom/opacity.js");
$import("lib/checkAuthor.js");


$registJob("visitor_tip", function(){
	var Visitor = function() {
		//记录返回的缓存
		this.cashData = {};
	}
	
	var inTip = false;
	
	Visitor.prototype = {
		show : function(uid,li) {
			var me = this;
			var data = me.cashData[uid];
			var tip = me.initShow(li);
			if(data) {
				me.dataCallBack(data,uid,tip,li);
			} else {
				new Interface("http://blogtj.sinajs.cn/api/get_att_level.php", "jsload").request({
					GET : {
						'uid' : uid
						,'suid' : scope.$uid
					},
					onSuccess : function(iData) {
						me.cashData[uid] = iData;
						me.dataCallBack(iData,uid,tip,li);
					}
				});
			}
		},
		
		close : function(id) {
			tipManager.closeTip(id);
		},
		
		initShow : function(li) {
			var tip = tipManager.getTip();
			return tip.show(li);
		},
		
		dataCallBack : function(data,uid,tip,li) {
			tip.update(data,uid,li);
		}
	}
	
	//用来显示提示的类
	var VistiorTip = function() {
		//这个tip是否被占用
		var me = this;
		me.busy = false;
		me.showing = false;
		me.html = '';
		me.id = +new Date();
		me.ele = (function(){
			var div = document.createElement('div');
			div.className = 'calFriList_layer';
			div.id = 'visitor_tip_'+me.id;
			div.style.display = 'none';
			div.style.position = 'absolute';
			div.style.overflow = 'hidden';
			document.body.appendChild(div);
			return div;
		})();
		//x的偏移像素
		this.xPos = -10;
		//y的偏移像素
		this.yPos = -9;
		this.createTip();
	}
	
	VistiorTip.prototype = {
		createTip : function() {
			var me = this;
			var clickTemplet = [];
			clickTemplet.push('<a href="javascript:void(0);" class="close" onclick="Tip.close(');
			clickTemplet.push(me.id);
			clickTemplet.push(');return false;" title="关闭"></a>');
			clickTemplet.push('<div class="line1">');
			clickTemplet.push('<div class="uPic" id="tip_show_imgs_');
			clickTemplet.push(me.id);
			clickTemplet.push('"></div><div class="uInfo" style="display:none" id="tip_lazy_show_');
			clickTemplet.push(me.id);
			clickTemplet.push('">');
			clickTemplet.push('<p class="nm"><strong id="tip_show_name_');
			clickTemplet.push(me.id);
			clickTemplet.push('"></strong>');
			clickTemplet.push('</p><p>博客等级：<strong id="tip_per_lev_');
			clickTemplet.push(me.id);
			clickTemplet.push('">加载中...</strong></p><p>关注人气：<strong id="tip_per_rq_');
			clickTemplet.push(me.id);
			clickTemplet.push('">加载中...</strong></p><p class="btn"><a href="#" target="_blank" id="tip_blog_link_');
			clickTemplet.push(me.id);
			clickTemplet.push('" class="SG_aBtn SG_aBtnB "><cite>进入博客</cite></a></p></div><div class="clearit"></div>');
			clickTemplet.push('</div><div class="line2"><p>最近来访：<span id="tip_vi_time_');
			clickTemplet.push(me.id);
			clickTemplet.push('"></span> <a href="javascript:void(0);" id="tip_del_foot_');
			clickTemplet.push(me.id);
			clickTemplet.push('" class="CP_a_fuc">[<cite>删除脚印</cite>]</a></p></div>');
			me.ele.innerHTML = clickTemplet.join('');
			me.ele.onmouseover = function() {
				inTip = true;
			}
			me.ele.onmouseout = function() {
				inTip = false;
			}
		},
		
		show : function(par) {
			var me = this;
			var loc = Core.Dom.getXY(par);
			loc[0] += me.xPos;
			loc[1] += me.yPos;
			var imgs = par.getElementsByTagName('img');
			var hasFlow = false;
			var uid = par.getAttribute('uid');
			var time = par.getAttribute('visit_time');
			$E('tip_vi_time_'+me.id).innerHTML = time;
			$E('tip_blog_link_'+me.id).href = 'http://blog.sina.com.cn/u/'+uid;
			$E('tip_blog_link_'+me.id).onclick = function() {
				Tip.close(me.id);
			}
			$E('tip_del_foot_'+me.id).onclick = me._delFoot(par,uid);
			var inHTML = [];
			for(var i=0; imgs[i]; i++) {
				if(imgs[i].className && imgs[i].className == 'headpic') {
					var name = imgs[i].title || imgs[i].alt;
					$E('tip_show_name_'+me.id).innerHTML = escape2(name);
					inHTML.push('<a style="cursor:default" href="javascript:void(0)">');
					inHTML.push('<img class="headpic" title="'+escape2(name)+'" alt="'+escape2(name)+'" src="');
					inHTML.push(imgs[i].src);
					inHTML.push('">');
					inHTML.push('</a>');
				} else if(imgs[i].title && !imgs[i].alt && imgs[i].title == '有内容更新') {
					hasFlow = true;
				}
			}
			if(hasFlow) {
				inHTML.push('<p class="apic"><img height="15" align="absmiddle" width="15" title="有内容更新" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon7"></p>');
			}
			
			inHTML.push('<p class="set"><a href="javascript:void(0)" id="tip_add_att_');
			inHTML.push(me.id);
			inHTML.push('" class="CP_a_fuc"></a></p>');
			$E('tip_show_imgs_'+me.id).innerHTML = inHTML.join('');
			me.ele.style.width = '70px';
			me.ele.style.height = '65px';
			var eBegin = {x:70,y:65};
			me.showTimer = big(me.ele,eBegin,{x:245,y:134.5},{
				beginCallBack : function(ele) {
					me.ele.style.display = '';
					me.busy = true;
					me.showing = true;
				},
				endCallBack : function(ele) {
					$E('tip_lazy_show_'+me.id).style.display = '';
					me.busy = false;
				}
			});
			Core.Dom.setXY(me.ele,loc);
			return me;
		},
		
		_delFoot : function(ele,id) {
			var me = this;
			return function() {
				Tip.close(me.id);
				Lib.deleteVisitByUid(id, 1, function() {
					var ps = ele.getElementsByTagName('p');
					for(var i=0; ps[i]; i++) {
						var key = ps[i].getAttribute('key');
						if(key) {
							Lib.countDess(key);
							break;
						}
					}
					ele.parentNode.removeChild(ele);
				});
			}
		},
		
		_addAtt : function(ele,aid) {
			var me = this;
			return function() {
				//Utils.Io.JsLoad.request("http://control.blog.sina.com.cn/riaapi/profile/attention_add.php?uid="+scope.$uid+"&aid="+aid, {
				new Interface("http://control.blog.sina.com.cn/riaapi/profile/attention_add.php", "ijax").request({
					POST : {
                        uid: scope.$uid,
                        aid: aid
                    },
                    onComplete:function(data){
						Lib.checkAuthor();
						if(data.code=="A33004"){
							winDialog.alert("关注成功！",{
								width:300,
								icon:"03"
							});
						} else {
							var errorMSG = $ATTENTION_MSG[data.code];
							
							//关注已达上限300,需要在提示信息中加入链接
							if (data["code" == "A33003"]) {
								errorMSG = $ATTENTION_MSG[data.code].replace(/#\{url\}/g, "http://profile.blog.sina.com.cn/attention.php?type=0&uid="+$UID);
							}
							
							winDialog.alert(errorMSG,{
								funcOk:function(){}, 
								funcClose:function(){},
								icon : "02" 
							});
						}
						ele.setAttribute('added','true');
						$E('tip_add_att_'+me.id).innerHTML = '<span style="color:#999999">[<cite>已关注</cite>]</span>';
						$E('tip_add_att_'+me.id).onclick = function(){return false;};
					}
				});
				return false;
			}
		},
		
		update : function(data,uid,ele) {
			var me = this;
			var att = data.att;
			var level = data.level[uid];
			$E('tip_per_rq_'+this.id).innerHTML = att[uid];
			level += '';
			var strs = [];
			for(var i=0; level.charAt(i); i++) {
				strs.push('<img src="http://simg.sinajs.cn/blog7style/images/common/number/');
				strs.push(level.charAt(i));
				strs.push('.gif">');
			}
			$E('tip_per_lev_'+this.id).innerHTML = strs.join('');
			var added = ele.getAttribute('added');
			if(added && added == 'true') {
				$E('tip_add_att_'+me.id).innerHTML = '<span style="color:#999999">[<cite>已关注</cite>]</span>';
				$E('tip_add_att_'+me.id).onclick = function(){return false;};
			} else {
				added = data.is_attentioned[uid];
				if(added == 0) {
					$E('tip_add_att_'+me.id).innerHTML = '[<cite>加关注</cite>]';
					$E('tip_add_att_'+me.id).onclick = me._addAtt(ele,uid);
				} else if(added == 1) {
					$E('tip_add_att_'+me.id).innerHTML = '<span style="color:#999999">[<cite>已关注</cite>]</span>';
					$E('tip_add_att_'+me.id).onclick = function(){return false;};
				}
			}
		},
		
		close : function() {
			var me = this;
			me.closeTimer = small(me.ele,{x:245,y:134.5},{x:70,y:65},{
				beginCallBack : function(ele) {
					$E('tip_lazy_show_'+me.id).style.display = 'none';
					me.busy = true;
					me.showing = false;
				},
				endCallBack : function(ele) {
					me.busy = false;
					me.ele.style.display = 'none';
					$E('tip_vi_time_'+me.id).innerHTML = '';
					$E('tip_blog_link_'+me.id).href = '#';
					$E('tip_blog_link_'+me.id).onclick = function() {return false;}
					$E('tip_del_foot_'+me.id).onclick = function() {return false;}
					$E('tip_add_att_'+me.id).innerHTML = '';
					$E('tip_add_att_'+me.id).onclick = function(){return false;};
					$E('tip_show_name_'+me.id).innerHTML = '';
					$E('tip_per_lev_'+me.id).innerHTML = '加载中...';
					$E('tip_per_rq_'+me.id).innerHTML = '加载中...';
				}
			});
		},
		
		quickClose : function() {
			var me = this;
			if(me.showTimer) {
				try {
					clearInterval(me.showTimer);
					trace('提前结束:'+me.showTimer);
				} catch(e){}
			}
			if(me.closeTimer) {
				try {
					clearInterval(me.closeTimer);
					trace('提前结束:'+me.showTimer);
				} catch(e){}
			}
			me.ele.style.display = 'none';
			me.ele.style.width = '70px';
			me.ele.style.height = '65px';
			$E('tip_vi_time_'+me.id).innerHTML = '';
			$E('tip_blog_link_'+me.id).href = '#';
			$E('tip_blog_link_'+me.id).onclick = function() {return false;}
			$E('tip_del_foot_'+me.id).onclick = function() {return false;}
			$E('tip_add_att_'+me.id).innerHTML = '';
			$E('tip_add_att_'+me.id).onclick = function(){return false;};
			$E('tip_show_name_'+me.id).innerHTML = '';
			$E('tip_per_lev_'+me.id).innerHTML = '加载中...';
			$E('tip_per_rq_'+me.id).innerHTML = '加载中...';
			me.showing = false;
			me.busy = false;
		},
		
		isShowing : function() {
			return this.showing;
		},
		
		isBusy : function() {
			return this.busy;
		},
		
		getId : function() {
			return this.id;
		}
	}
	
	var VistiorTipManager = function() {
		this.tips = [];
	}
	
	VistiorTipManager.prototype = {
		getTip : function() {
			var tips = this.tips;
			this.closeAllTip();
			for(var i=0; tips[i]; i++) {
				if(!tips[i].isBusy()) {
					trace('返回tip id:'+i);
					return tips[i];
				}
			}
			trace('所有的tip都忙碌,重新创建,现在总共:'+this.tips.length);
			var tip = new VistiorTip();
			this.tips.push(tip);
			return tip;
		},
		
		closeTip : function(id) {
			var tips = this.tips;
			for(var i=0; tips[i]; i++) {
				if(tips[i].getId() == id) {
					tips[i].close();
					return;
				}
			}
		},
		
		closeAllTip : function() {
			var tips = this.tips;
			for(var i=0; tips[i]; i++) {
				var tip = tips[i];
				if(tip.isBusy()) {
					if(tip.isShowing()) {
						tip.quickClose();
					}
				} else {
					if(tip.isShowing()) {
						tip.close();
					}
				}
			}
		}
	};
	
	var tipManager = new VistiorTipManager();
	window.Tip = {};
	var vr = new Visitor();
	Tip.show = function(uid,li) {
		vr.show(uid,li);
	}
	Tip.close = function(id) {
		vr.close(id);
	}
	var lis = document.getElementsByTagName('li');
	for(var i=0; lis[i]; i++) {
		var uid = lis[i].getAttribute('uid');
		if(uid) {
			var imgs = lis[i].getElementsByTagName('img');
			for(var j=0; imgs[j]; j++) {
				if(imgs[j].className == 'headpic') {
					imgs[j].onclick = (function(id,li){
						return function() {
							Tip.show(id,li);
							return false;
						}
					})(uid,lis[i]);
				}
			}
			/*
			lis[i].onclick = (function(id,li){
				return function() {
					Tip.show(id,li);
					return false;
				}
			})(uid,lis[i]);
			*/
		}
	}
	
	window.document.body.onclick = function(e) {
		//debugger;
		if(inTip) {
			return;
		}
		var e = e || window.event;
		var src = e.target || e.srcElement;
		if(!(src.tagName && src.className && (src.tagName.toUpperCase() == 'IMG') 
				&& src.className.toUpperCase() == 'HEADPIC')) {
			tipManager.closeAllTip();
		}
	}
	
	function big(ele,begin,end,opt) {
		//var key = 10;
		var xStep = (end.x - begin.x)/5;
		var yStep = (end.y - begin.y)/5;
		var op = 20;
		opt.beginCallBack(ele);
		var timmer = setInterval(function(){
			begin.x += xStep;
			ele.style.width = begin.x + 'px';
			begin.y += yStep
			ele.style.height = begin.y + 'px';
			op += 20;
			Core.Dom.opacity(ele, op);
			if(begin.x == end.x) {
				clearInterval(timmer);
				opt.endCallBack(ele);
			}
		},20);
		return timmer;
	}
	
	function small(ele,begin,end,opt) {
		var xStep = (begin.x - end.x)/5;
		var yStep = (begin.y - end.y)/5;
		var op = 100;
		opt.beginCallBack(ele);
		var timmer = setInterval(function(){
			begin.x -= xStep;
			ele.style.width = begin.x + 'px';
			begin.y -= yStep
			ele.style.height = begin.y + 'px';
			op -= 20;
			//Core.Dom.opacity(ele, op);
			if(begin.x == end.x) {
				clearInterval(timmer);
				opt.endCallBack(ele);
			}
		},20);
		return timmer;
	}
	
	Lib.countDess = function(key) {
		var ele = $E(key+'_num');
		if(ele) {
			var num = parseInt(ele.getAttribute('num'));
			if(num) {
				num -= 1;
				ele.innerHTML = '('+num+'人)';
				if(num == 0) {
					var ul = $E(key+'_ul');
					var none = $E(key+'_none');
					if(ul && none) {
						ul.parentNode.removeChild(ul);
						none.style.display = '';
					}
				} else {
					ele.setAttribute('num',num);
				}
			}
		}
	}
	
	function escape2(val) {
		val = val.replace(/</ig,'\&lt;');
		val = val.replace(/>/ig,'\&gt;');
		val = val.replace(/"/ig,'\&quot;');
		return val;
	}
});