/** 
 * @fileoverview 分享博文
 * @author xy xinyu@staff.sina.com.cn
 */
$import('lib/lib.js');
$import('sina/utils/copy.js');
$import("sina/ui/dialog/dialog.js");
$import("sina/utils/io/jsload.js");
$import("lib/sendLog.js");

Lib.subscribe = Core.Class.create();

Lib.subscribe.prototype = {
    initialize: function(){
    	this.createDlg();
    },
    createDlg: function(){
		var basicRssXML = 'http://blog.sina.com.cn/rss/'+scope.$uid+'.xml';
        //增加分享对话框----------------------------------------
		var content=['<div id="rssDy"></div>'];
		content.push('<div class="clearit"></div></div><table><tr><th scope="row">订阅地址：</th><td><input type="text" id="subscribeText" class="SG_input" value="" /><a class="SG_aBtn SG_aBtnB" href="javascript:;" onclick="return false;"><cite id="subscribeCopy">复制</cite></a></td></tr><tr><th scope="row"></th><td>如果还没有RSS阅读器，请<strong><a href="http://down.tech.sina.com.cn/content/3034.html" target="_blank">立即下载</a></strong>。 </td></tr></table>');
		content = content.join('');
		
        var tpl = ['<table id="#{entity}" class="CP_w">', 
						'<thead id="#{titleBar}">', 
							'<tr>', 
								'<th class="tLeft"><span></span></th>', 
								'<th class="tMid">', 
									'<div class="bLyTop">', 
										'<strong id="#{titleName}"></strong>', 
										'<cite style="width:100px;"><a href="http://www.sina.com.cn/ddt/rsshelp.html" target="_blank">什么是RSS?</a><a title="关闭" class="CP_w_shut" id="#{btnClose}" href="javascript:;">关闭</a></cite>', 
									'</div>', 
								'</th>', 
								'<th class="tRight"><span></span></th>', 
							'</tr>', 
						'</thead>', 
						'<tfoot>', 
							'<tr>', 
								'<td class="tLeft"><span></span></td>', 
								'<td class="tMid"><span></span></td>', 
								'<td class="tRight"><span></span></td>', 
							'</tr>', 
						'</tfoot>', 
						'<tbody>', 
							'<tr>', 
								'<td class="tLeft"><span></span></td>', 
									'<td class="tMid">', 
									'<div class="CP_layercon2 rssLayer" id="#{content}">', '</div>',
								'</td>', 
								'<td class="tRight"><span></span></td>', 
							'</tr>', 
						'</tbody>', 
					'</table>'].join("");
        
        this._dialog = winDialog.createCustomsDialog({
            tpl: tpl,
            title: "RSS订阅",
            content: content,
            width: 415,
            height: 104
        }, "tips");
        //---------------------------------------------------------
		$E('subscribeText').value = basicRssXML;
		this.bindEvent();
    },
	bindEvent:function(){
		var _this=this;
		Core.Events.addEvent($E('subscribeCopy'),function(){
			v7sendLog('11_01_02');
			var flag=Utils.text2Copy($E('subscribeText').value);
			if(flag==true)
				winDialog.alert("复制成功", {funcOk:function(){
					_this._dialog.hidden();
				},icon: "03"});
//			else 
//				winDialog.alert("复制失败", {icon: "01"});

		});
	},
	show:function(){
		var addIconFuc = function(){
			if($_GLOBAL.rssIcons) {
				var name = scope.$uid;
				if($_GLOBAL.rssMethod) {
					name = scope[$_GLOBAL.rssMethod];
				}
				var basicRssXML = 'http://blog.sina.com.cn/rss/'+name+'.xml';
				var content = ['<div class="rss_title"><strong>在线阅读器直接订阅：</strong></div><div class="rss_list" style="display:inline-block;">'];
				for(var i=0; $_GLOBAL.rssIcons[i]; i++) {
					var rs = $_GLOBAL.rssIcons[i];
					if (rs.cls === "rss_shiye"){
						basicRssXML = name+'&sub=1';
					}
					content.push('<span><a target="_blank" href="');
					content.push(rs.href);
					if(rs.encode) {
						content.push(encodeURIComponent(basicRssXML));
					} else {
						content.push(basicRssXML);
					}
					content.push('" class="');
					content.push(rs.cls);
					content.push('" title="');
					content.push(rs.title);
					content.push('"></a></span>');
				}
				// content.push('<span class="news"><img width="15" height="15" align="top" class="SG_icon SG_icon11" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" title="新"></span>');
				$E('rssDy').innerHTML = content.join('');

				var shiyeNode = Core.Dom.getElementsByClass($E('rssDy'), 'a', 'rss_shiye');
				if (shiyeNode[0]){
					Core.Events.addEvent(shiyeNode[0], function(){
						v7sendLog('11_01_01');
					});
				}
			}
		};
		this._dialog.show();
		this._dialog.setAreaLocked(true);
		this._dialog.setMiddle();
		if ($_GLOBAL.rssIcons) {
			addIconFuc();
		} else {
			Utils.Io.JsLoad.request("http://sjs.sinajs.cn/blog7common/conf/rss_conf.js", {
				onComplete : function () {
					addIconFuc();
				}
				,noreturn : true
                ,isRemove : false
			});
		}
	},
	hidden:function(){
		this._dialog.hidden();
	}
};
