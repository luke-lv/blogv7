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
$import("baby/editor/plugins/template/BabyTemplate.js");
$import("lib/interface.js");
$import("baby/InputBabyData.js");
$import("sina/core/system/getParam.js");

Editor.Plugins.BabyTopic = Core.Class.create();
Editor.Plugins.BabyTopic.prototype = {
    initialize: function(){
		window.babyTopic = this;
		this.isSending = false;
		var id = Core.System.getParam('topicid');
		var channel = Core.System.getParam('topicchannel');
		if(id && channel) {
			this.select(id,channel);
		}
		if($E('topic_id') && $E('topic_id').value != '0') {
			$E('topic_show_'+$E('topic_id').value).style.display = 'none';
			$E('topic_hidden_'+$E('topic_id').value).style.display = '';
		}
    },
	select : function(id,channel) {
		if(this.isSending) {
			return;
		}
		this.isSending = true;
		if(editor.modeType != 'edit') {
			winDialog.alert('请到编辑模式下插入话题'
			,{
				icon: "01"
			});
			this.isSending = false;
			return;
		}
		if(!id) {
			winDialog.alert('非法调用'
			,{
				icon: "01"
			});
			this.isSending = false;
			return;
		}
		if($E('topic_id') && $E('topic_id').value != '0') {
			winDialog.alert('您已经选择了话题'
			,{
				icon: "01"
			});
			this.isSending = false;
			return;
		}
		
		var me = this;
		scope.$topic_channel = channel;
		new Interface("http://control.blog.sina.com.cn/admin/article/get_topic_module.php", "jsload").request({
			GET : {
				'topic_channel':scope.$topic_channel,
				'topic_id':id
			}
			,onSuccess: function(_data){
				_data.topic_id = id;
				me._appendBabyBaraAndTemplate(_data);
				me.isSending = false;
			}
			,onError: function(_data){
				if(_data.code == 'A00003' || _data.code == 'A00004' || _data.code == 'A00005') {
					winDialog.alert("非法操作!", {
						"icon": "02"
						,funcOk : function() {
							window.location.reload();
						}
					});
					return;
				}
                showError(_data.code);
				me.isSending = false;
            }
			,onFail: function(){
                winDialog.alert("请求发送失败！请重试。", {
                    "icon": "02"
                });
				me.isSending = false;
            }
		});
	}
	,_appendBabyBaraAndTemplate : function(_data) {
		var babyBar = _data.babybar;
		if(_data.topic && _data.topic.more) {
			$E('topic_more').value = _data.topic.more;
		}
		var me = this;
		if(babyBar) {
			if(babyBar.join) {
				//是一个数组,表示直接添加宝宝进度条
				this._whenaddedBar(_data);
				scope.babyNewsMsg = babyBar;
				//插入成长进度条
				insertYuerProgressbar.insertNow(3);
			} else {
				switch(babyBar) {
					/*
					case 'nobaby': {
						scope.babyDataOnOk({okCall:function(data){
							me._whenaddedBar(_data);
							scope.babyNewsMsg = data;
							//插入成长进度条
							insertYuerProgressbar.insertNow(3);
							
							me._focusToEle();
							return true;
						}});
						break;
					}
					*/
					default : this._whenaddedBar(_data);
				}
			}
		} else {
			this._whenaddedBar(_data);
		}
		editor.baseTools.operate[editor.saveType]();
		this._focusToEle();
	}
	,_focusToEle : function() {
		var doc = editor.iframeDocument;
		ele = doc.getElementById(scope.babyContentId);
		if(ele) {
			if($IE) {
				var range= editor.iframeDocument.body.createTextRange();
				range.moveToElementText(ele)   
				range.moveEnd('character',0); 
				range.moveStart('character',0);     
				range.select();
				if ($IE) {
					editor.rangeCache.setRange(range);
				}
			} else {
				var selection = editor.iframeWindow.getSelection();
				var range = editor.iframeDocument.createRange();
				range.selectNodeContents(ele);
				selection.removeAllRanges();
				selection.addRange(range);
			}
		}
	}
	,_whenaddedBar : function(_data) {
		var tmp = new Editor.Plugins.BabyTemplate();
		var doc = editor.iframeDocument;
		var imgs = doc.getElementsByTagName('img');
		for(var i=0; imgs[i]; i++) {
			var att = imgs[i].getAttribute('imgType');
			if( att && att == 'yuer') {
				imgs[i].parentNode.removeChild(imgs[i]);
				i--;
			}
		}
		_data.topic.beforeContent = doc.body.innerHTML;
		tmp = tmp.get(0,_data.topic);
		editor.iframeDocument.body.innerHTML = '';
		editor.insertHTML(tmp.content);
		scope.babyContentId = tmp.id;
		scope.hasSelectBabyTopic = _data.topic_id;
		$E('topic_channel').value = '2';
		$E('topic_id').value = _data.topic_id;
		//editor.baseTools.operate[editor.saveType]();
		$E('topic_show_'+_data.topic_id).style.display = 'none';
		$E('topic_hidden_'+_data.topic_id).style.display = '';
	}
	//取消话题
	//babyTopic.cancel()
	,cancel : function(which) {
		if(!which) {
			return;
		}
		if(editor.modeType != 'edit') {
			winDialog.alert('请到编辑模式下取消话题'
			,{
				icon: "01"
			});
			this.isSending = false;
			return;
		}
		var doc = editor.iframeDocument;
		var ele;
		if(scope.babyContentId) {
			ele = doc.getElementById(scope.babyContentId);
		} else {
			var eles = doc.getElementsByTagName('div');
			for(var i=0; eles[i]; i++) {
				if(eles[i].id && eles[i].id.indexOf('babyTopicContent_') != -1) {
					ele = eles[i];
					break;
				}
			}
		}
		
		var me = this;
		if(ele) {
			ele.removeAttribute('id');
			var parent = ele.parentNode;
			//去掉我的想法节点
			var wdxf = parent.getElementsByTagName('h4')[0];
			wdxf.parentNode.removeChild(wdxf);
			
			editor.iframeDocument.body.innerHTML = parent.innerHTML
			me._afterDelete(which);
		} else {
			winDialog.confirm('无法准确定位到您的内容，是否清空编辑器?'
			,{
				icon: "04"
				,funcOk: function(){
					editor.iframeDocument.body.innerHTML = '&nbsp;';
					me._afterDelete(which);
				}
				,textOk:"是"
				,textCancel:"否"
			});
		}
	}
	,_afterDelete : function(which) {
		$E('topic_channel').value = '0';
		$E('topic_id').value = '0';
		$E('topic_more').value = '';
		delete scope.hasSelectBabyTopic;
		delete scope.babyContentId;
		editor.baseTools.operate[editor.saveType]();
		$E('topic_hidden_'+which).style.display = 'none';
		$E('topic_show_'+which).style.display = '';
	}
};
