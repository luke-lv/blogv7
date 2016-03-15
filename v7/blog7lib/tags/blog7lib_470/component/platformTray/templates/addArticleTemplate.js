/**
 * @fileoverview 发博文模板HTML
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-28
 */

scope.addArticleTemplate=[
	'<div id="#{panel}" class="wrtBlog_sub" style="z-index:512;">',
		'<div class="wrtBlog_sub2">',
			'<p><img width="15" height="16" align="absmiddle" title="写365" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon138"><a onclick="v7sendLog(\'48_01_18\');v7sendLog(\'40_01_14\');" href="http://control.blog.sina.com.cn/admin/article/article_add.php?tag365" target="_blank">写365</a></p>',
			'<div class="SG_j_linedot"></div>',
			'<p><img class="SG_icon SG_icon88" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="15" title="长微博" align="absmiddle" /><a target="_blank" onclick="v7sendLog(\'40_01_14\')" href="http://control.blog.sina.com.cn/admin/article/changWeiBo.php">长微博</a></p>',
			'<div class="SG_j_linedot"></div>',
			// '<p><img class="SG_icon SG_icon87" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="15" title="微语录" align="absmiddle" /><a target="_blank" onclick="v7sendLog(\'40_01_14\')" href="http://control.blog.sina.com.cn/weiyulu/weiyulu.php">微语录</a></p>',
			// '<div class="SG_j_linedot"></div>',
			//'<p><img class="SG_icon SG_icon85" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="15" title="九宫格" align="absmiddle" /><a target="_blank" onclick="v7sendLog(\'40_01_14\')" href="http://control.blog.sina.com.cn/admin/article/daily.php">九宫格</a></p>',
			//'<div class="SG_j_linedot"></div>',
			'<p><img class="SG_icon SG_icon18" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="15" title="发照片" align="absmiddle" /><a target="_blank" onclick="v7sendLog(\'40_01_14\')" href="http://photo.blog.sina.com.cn/upload/upload.php">发照片</a></p>',
			'<div class="SG_j_linedot"></div>',
			'<p><img class="SG_icon SG_icon16" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="15" title="发视频" align="absmiddle" /><a target="_blank" onclick="v7sendLog(\'40_01_14\')" href="http://vupload.you.video.sina.com.cn/u.php?m=1">发视频</a></p>',
            '<div id="tray_tbh_ware_linedot" style="display:none;" class="SG_j_linedot"></div>',
            '<p id="tray_tbh_ware_link" style="display:none;"><img class="SG_icon SG_icon150" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="15" title="发商品" align="absmiddle" /><a target="_blank" onclick="v7sendLog(\'40_01_14\')" href="http://control.blog.sina.com.cn/admin/article/article_add.php?tbh=1">发商品</a></p>',
		'</div>',
	'</div>'
].join("");
