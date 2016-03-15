/**
 * 博客电台
 * author	常川
 */
$registJob('blogRadio', function(){
    var p = $E('blogradio');
    Core.Events.addEvent(p, function(){
        //显示浮层
        scope.blogRadioDialog.show();
        scope.blogRadioDialog.setMiddle();
    });
    
    var tpl = ['<table id="#{panel}" class="CP_w">', '<thead id="#{titleBar}">', '<tr>', '<th class="tLeft"><span></span></th>', '<th class="tMid">', '<div class="bLyTop">', '<strong id="#{titleName}"></strong>', '<cite><a title="关闭" class="CP_w_shut" id="#{btnClose}" href="javascript:;">关闭</a></cite>', '</div>', '</th>', '<th class="tRight"><span></span></th>', '</tr>', '</thead>', '<tfoot>', '<tr>', '<td class="tLeft"><span></span></td>', '<td class="tMid"><span></span></td>', '<td class="tRight"><span></span></td>', '</tr>', '</tfoot>', '<tbody>', '<tr>', '<td class="tLeft"><span></span></td>', '<td class="tMid">', '<div class="" style="width:auto;" id="#{content}">', '</div>', '</td>', '<td class="tRight"><span></span></td>', '</tr>', '</tbody>', '</table>'].join("");
    var content = '<div class="CP_layercon1">\
				<div class="CP_prompt">\
				<img class="SG_icon SG_icon204" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" align="absmiddle" height="50" width="50">\
				<table class="CP_w_ttl"><tbody><tr><td>是否推荐给好友？</td></tr></tbody></table>\
				<p><img src="http://simg.sinajs.cn/blog7style/images/center/img_station.gif" alt="" height="52" width="102"></p>\
				<p class="CP_w_btns"><a id="blogradiobtnyes" class="SG_aBtn SG_aBtnB" href="javascript:void(0);"><cite> 是 </cite></a>&nbsp;&nbsp;<a class="SG_aBtn SG_aBtnB" id="blogradiobtnno"  href="javascript:void(0);"><cite> 否 </cite></a></p>\
				</div>\
			</div>';

    scope.blogRadioDialog = scope.blogRadioDialog ? scope.blogRadioDialog : winDialog.create({
        tpl: tpl,
        content: content
    });

	Core.Events.addEvent($E('blogradiobtnno'), function(){
        scope.blogRadioDialog.hidden()
    });
    Core.Events.addEvent($E('blogradiobtnyes'), function(){
        scope.blogRadioDialog.hidden();
        //发一条feed
		if (!scope.logRadioInterface) {
            scope.logRadioInterface = new Interface("http://control.blog.sina.com.cn/riaapi/feed/feed_blogradio.php", "jsload");
        }
		scope.logRadioInterface.request({
			GET:{r:Math.random(),radio:p.getAttribute('blogradio'),uid:scope.$uid||""},
			onSuccess:function(){},
			onError:function(data){},
			onFail:function(){}
		});
    });
    
});
