/**
 * Copyright (c) 2010, Sina Inc. All rights reserved.
 * @fileoverview 育儿博客模板
 */
$import("editor/plugins/plugins.js");
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/function/bind3.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/events/getEventTarget.js");
$import("editor/plugins/config/template.js");
$import("lib/interface.js");
$import("baby/InputBabyData.js");
$import("baby/editor/plugins/babyBarConfig.js");

Editor.Plugins.InsertYuerProgressbar = Core.Class.create();
Editor.Plugins.InsertYuerProgressbar.prototype = {
	countEle:"is_tpl",
    initialize: function(){
    },
	validateHasOne : function() {
		var imgs = editor.iframeDocument.body.getElementsByTagName('img');
		for(var i=0; imgs[i]; i++) {
			var type = imgs[i].getAttribute('imgType');
			if(type && type == 'yuer') {
				return true;
			}
		}
		return false;
	},
	show:function(){
		if(this.validateHasOne()) {
			winDialog.alert('每篇博文只能添加一个宝宝生日'
			,{
				icon: "01"
			});
			return;
		}
		var me = this;
		new Interface("http://control.blog.sina.com.cn/admin/article/babybar.php", "jsload").request({
			onSuccess: function(_data){
				scope.babyNewsMsg = _data;
				me.callShow();
			}
			,onError: function(_data){
                //showError(_data.code);
				//需要填写宝宝信息
				if(_data.code =="B88040" || _data.code =="A00005" || _data.code == 'A00004') {
					winDialog.alert("非法操作!", {
						"icon": "02"
						,funcOk : function() {
							window.location.reload();
						}
					});
					return;
				} else if(_data.code =="B88041") {
					winDialog.alert("等您的小宝宝降生后才能使用此功能。加油！", {
	                    "icon": "02"
	                });
				} else {
					showError(_data.code);
				}
				
            }
			,onFail: function(){
                winDialog.alert("请求发送失败！请重试。", {
                    "icon": "02"
                });
            }
		});
		//setTimeout(function(){
			//不能插入
			//情况1：信息不全
			//复用美纯的代码
			/*
			winDialog.alert('当前阶段不允许插入进度条'
			,{
				icon: "01",
				funcOk : function() {
					me.callShow();
				}
			});
			*/
			//-----------------
			//情况2：的确不能插入
			/*
			winDialog.alert('当前阶段不允许插入进度条'
			,{
				icon: "01"
			});
			return;
			*/
		//},300);
		//return;
	},
	callShow : function() {
		editor.blur();
		if(!this.dialog){
			this.initDialog();
			this.initEvent();
		}
		//在这里发请求
		this.getData();
		editor.blur();
		this.dialog.show();
	},
	getData : function() {
		$E('yuerTopicContainer').innerHTML = '<li style="text-align:center;"><img src="http://simg.sinajs.cn/blog7style/images/common/loading.gif" />加载中…</li>';
		//这里回调
		setTimeout(function(){
			$E('yuerTopicContainer').innerHTML = '';
			var strs = [];
			for(var i=0; i<4; i++) {
				strs.push('<li style="border:1px solid #FFFFFF;" ondblclick="insertYuerProgressbar.insert(');
				strs.push(i+1);
				strs.push(')" onclick="insertYuerProgressbar.select(this)" onmouseover="this.style.cssText=\'border:1px solid #65B954;\'" onmouseout="this.style.cssText=\'border:1px solid #FFFFFF;\'"><input type="radio" name="inputYuerProcess" id="inputYuerProcess_');
				strs.push(i);
				strs.push('" /> <label for="inputYuerProcess_');
				strs.push(i);
				strs.push('"><img class="baby_bn baby_bn');
				strs.push(i+1);
				strs.push('" type="');
				strs.push(i+1);
				strs.push('" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif"/></label></li>');
			}
			$E('yuerTopicContainer').innerHTML = strs.join('');
		},1000);
	},
	hidden:function(){
		//有可能从话题进入，所以没有生成dialog
		if(this.dialog) {
			this.dialog.hidden();
		}
	},
	initEvent:function(){
		Core.Events.addEvent($E("inertYuer"),Core.Function.bind3(this.insert,this,[]));
	},
	initDialog: function(){
        var tpl = ['<table id="#{entity}" class="CP_w">',
						'<thead id="#{titleBar}">', 
							'<tr>', 
								'<th class="tLeft"><span></span></th>', 
								'<th class="tMid">', 
									'<div class="bLyTop">', 
										'<strong id="#{titleName}"></strong>', 
										'<cite><a title="关闭" class="CP_w_shut" id="#{btnClose}" href="javascript:;" onclick="return false">关闭</a></cite>', 
									'</div>', 
								'</th>', 
								'<th class="tRight"><span></span></th>', 
							'</tr>', 
						'</thead>', 
						'<tfoot>', 
							'<tr>', 
								'<td class="tLeft"><span/></td>', 
								'<td class="tMid"><span></span></td>', 
								'<td class="tRight"><span></span></td>', 
							'</tr>', 
						'</tfoot>', 
						'<tbody>', 
							'<tr>', 
								'<td class="tLeft"><span></span></td>', 
								'<td class="tMid">', 
									'<div id="#{content}">', '</div>', 
								'</td>', 
								'<td class="tRight"><span></span></td>', 
							'</tr>', 
						'</tbody>', 
					'</table>'].join("");
        this.dialog = winDialog.createCustomsDialog({
            tpl: tpl,
            title: "插入成长进度条",
            content: this.initHtml(),
            width: 500
        }, "tips_yuer");
        
		this.dialog
			.setAreaLocked(true)
			.show()
			.addEventListener("beforeShow",function(){
				 this.setMiddle();
			});
    },
	initData:function(){
		this.template_data=new Editor.Plugins.TemplateConfig().get();
	},
	insertNow : function(id) {
		if(this.validateHasOne()) {
			winDialog.alert('每篇博文只能添加一个宝宝生日'
			,{
				icon: "01"
			});
			return;
		}
		if(!id) {
			winDialog.alert('参数传递错误!'
			,{
				icon: "01"
			});
			return;
		}
		if(!scope.babyNewsMsg) {
			winDialog.alert('非法调用'
			,{
				icon: "01"
			});
			return;
		}
		this.insert(id);
	},
	insert:function(id){
		if(!id) {
			//通过点击插入进来的
			var lis = $E('yuerTopicContainer').getElementsByTagName('li');
			for(var i=0; lis[i]; i++) {
				var li = lis[i];
				if(li.className && li.className == 'ABC') {
					id = li.getElementsByTagName('img')[0].getAttribute('type');
				}
			}
			if(!id) {
				id = -1;
			}
		}
		if(id < 0) {
			winDialog.alert('您还没有选择成长进度条'
			,{
				icon: "01"
			});
			return;
		}
		
		//现在保证是正常的
		var img = editor.iframeDocument.createElement('img');
		img.setAttribute('imgType','yuer');
		img.src = 'http://simg.sinajs.cn/blog7style/images/common/baby/banner'+id+'.png';
		var msg = scope.babyNewsMsg;
		var total = [];
		for(var i=0; msg[i]; i++) {
			var babyData = [];
			babyData.push('"textType":"type'+id+'"');
			babyData.push('"name":"'+msg[i].name+'"');
			babyData.push('"y":"'+msg[i].y+'"');
			babyData.push('"m":"'+msg[i].m+'"');
			babyData.push('"d":"'+msg[i].d+'"');
			total.push('{' + babyData.join(',') + '}');
		}
		//img.setAttribute('yuermsg','['+total.join(',')+']');
		img.setAttribute('yuermsg','listCfg='+scope.flashComponent.getFinalData(eval('(['+total.join(',')+'])')));
		img.setAttribute('type','face');
		

		if($IE) {
			var body = editor.iframeDocument.body;
			if(body.firstChild) {
				var first = body.firstChild;
				body.insertBefore(img,first);
			} else {
				body.appendChild(img);
			}
		} else {
			var range = editor.iframeDocument.createRange();
			var body = editor.iframeDocument.body;
			range.selectNode(body.firstChild);
			range.insertNode(img);
			range.collapse(false);
		}
		
		
		//var body = editor.iframeDocument.body;
		//if(body.firstChild) {
		//	var first = body.firstChild;
		//	body.insertBefore(img,first);
		//} else {
		//	body.appendChild(img);
		//}
		
		this.hidden();
		
		//editor.iframeDocument.body.focus();
	},
	select:function(li){
		var inputs = li.parentNode.getElementsByTagName('input');
		for(var i=0; inputs[i]; i++) {
			inputs[i].checked = false;
			inputs[i].parentNode.className = '';
		}
		li.getElementsByTagName('input')[0].checked = true;
		li.className = 'ABC';
	},
	initHtml:function(){
		var html = ['<div class="CP_layercon2 baby_bannerLayer">',
						'<ul id="yuerTopicContainer">',
						'</ul>',
						'<div class="btn"><a href="###" onclick="return false;" class="SG_aBtn SG_aBtnB"><cite id="inertYuer">插入成长进度条</cite></a></div> ',
					'</div>'].join('');
		return html;
	}
};
