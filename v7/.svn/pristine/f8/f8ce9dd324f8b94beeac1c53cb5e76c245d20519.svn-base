/** 
 * @fileoverview 分享博文
 * @author xy xinyu@staff.sina.com.cn
 */
$import('article/_article.js');
$import('sina/utils/copy.js');
$import("sina/ui/dialog/dialog.js");

Article.share = Core.Class.create();

Article.share.prototype = {
    initialize: function(){
    	this.createDlg();
    },
    createDlg: function(){
        //增加分享对话框----------------------------------------
		var str='分享一篇我在新浪博客看到的博文“'+$E('t_'+scope.$articleid).innerHTML+'”';
		var mricoblog="javascript:void((function(s,d,e,r,l,p,t,z,c){var%20f='http://v.t.sina.com.cn/share/share.php?',u=z||d.location,p=['url=',e(u),'&title=',e(d.title),'&source=',e(r),'&sourceUrl=',e(l),'&content=',c||'gb2312','&pic=',e(p||'')].join('');function%20a(){if(!window.open([f,p].join(''),'mb',['toolbar=0,status=0,resizable=1,width=440,height=430,left=',(s.width-440)/2,',top=',(s.height-430)/2].join('')))u.href=[f,p].join('');};if(/Firefox/.test(navigator.userAgent))setTimeout(a,0);else%20a();})(screen,document,encodeURIComponent,'新浪-博客','"+window.location.href+"','','"+str+"+','"+window.location.href+"','utf-8'));";
        var content='<div class="shTit">分享给聊天好友：</div>'+
					'<div class="shForm clearfix"><textarea id="shareText">'+str+'：'+window.location.href+'</textarea></div>'+
               	 	'<div class="shBtn"><a class="SG_aBtn SG_aBtnB SG_aBtn_sub" href="javascript:;" onclick="return false;"><cite id="shareCopy">复制</cite></a></div>'+
					'<div class="shTit">分享到：</div>'+
					'<div class="logoList">'+
					'<ul class="clearfix">'+
					'<li><a href="'+mricoblog+'"><img src="http://simg.sinajs.cn/blog7style/images/blog/mircoblog.png"/></a></li>'+
					'</ul>'+
					'</div>';
        var tpl = ['<table id="#{entity}" class="CP_w">', '<thead id="#{titleBar}">', '<tr>', '<th class="tLeft"><span></span></th>', '<th class="tMid">', '<div class="bLyTop">', '<strong id="#{titleName}"></strong>', '<cite><a title="关闭" class="CP_w_shut" id="#{btnClose}" href="javascript:;">关闭</a></cite>', '</div>', '</th>', '<th class="tRight"><span></span></th>', '</tr>', '</thead>', '<tfoot>', '<tr>', '<td class="tLeft"><span></span></td>', '<td class="tMid"><span></span></td>', '<td class="tRight"><span></span></td>', '</tr>', '</tfoot>', '<tbody>', '<tr>', '<td class="tLeft"><span></span></td>', '<td class="tMid">', '<div class="shareItemLayer" id="#{content}">', '</div>', '</td>', '<td class="tRight"><span></span></td>', '</tr>', '</tbody>', '</table>'].join("");
        
        this._dialog = winDialog.createCustomsDialog({
            tpl: tpl,
            title: "分享博文",
            content: content,
            width: 365,
            height: 284
        }, "tips");
        //---------------------------------------------------------
		trace("制造了对话框");
		
		this.bindEvent();
    },
	bindEvent:function(){
		Core.Events.addEvent($E('shareCopy'),function(){
			Utils.text2Copy($E('shareText').value);
		});
	},
	show:function(){
		this._dialog.show();
		this._dialog.setMiddle();
		this._dialog.setAreaLocked(true);
	},
	hidden:function(){
		this._dialog.hidden();
	}
};
