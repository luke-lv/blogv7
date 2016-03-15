/**
 * @fileoverview 昵称下拉面板的模板HTML
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-03
 */
$import("lib/sendLog.js");
scope.nicknamePanelTemplate=[
	'<div id="#{panel}" class="tb_layer_Y tb_layer_w2" style="z-index:512;">',
		'<div class="tb_layer_arrow"></div>',
		'<div class="tb_layer_Y_main">',
			'<div class="tb_ps">',
				'<div class="tb_ps_list">',
					'<ul>',
						'<li>',
							'<span class="tb_ps_nm"><a id="#{linkBlog}" href="javascript:;"><img class="SG_icon SG_icon15" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="15" title="博客" align="absmiddle" /><strong>博客</strong></a></span>',
							'<span class="tb_ps_set">[<a target="_blank" id="#{linkPostBlog}" href="http://control.blog.sina.com.cn/admin/article/article_add.php">发博文</a>]</span>',
						'</li>',
						'<li>',
							'<span class="tb_ps_nm"><a id="#{linkPhoto}" href="javascript:;"><img class="SG_icon SG_icon18" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="15" title="相册" align="absmiddle" /><strong>相册</strong></a></span>',
							'<span class="tb_ps_set">[<a target="_blank" id="#{linkPostPhoto}" href="http://photo.blog.sina.com.cn/upload/upload.php">发图片</a>]</span>',
						'</li>',
						'<li>',
							'<span class="tb_ps_nm"><a target="_blank" id="#{linkVBlog}" href="javascript:;"><img class="SG_icon SG_icon16" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="15" title="播客" align="absmiddle" /><strong>播客</strong></a></span>',
							'<span class="tb_ps_set">[<a target="_blank" id="#{linkUpload}" href="http://vupload.you.video.sina.com.cn/u.php?m=1">发视频</a>][<a id="#{linkRecord}" href="http://vupload.you.video.sina.com.cn/r.php" target="_blank">录视频</a>]</span>',
						'</li>',
						'<li>',
							'<span class="tb_ps_nm"><a id="#{miniblog}" href="javascript:;" target="_blank"><img class="SG_icon SG_icon51" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="15" title="微博" align="absmiddle" /><strong>微博</strong></a></span>',		                    
						'</li>',
      //                   '<li>',
						// 	'<span class="tb_ps_nm"><a id="#{qingblog}" onclick="v7sendLog && v7sendLog(\'79_01_02\',scope.$pageid,\'qingLink\');" href="javascript:;" target="_blank"><img class="SG_icon SG_icon205" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="15" title="Qing" align="absmiddle" /><strong>Qing</strong></a></span>',
						// '</li>',
						'<li>',
							'<span class="tb_ps_nm"><a id="#{mySpace}" href="javascript:;"><img class="SG_icon SG_icon41" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="15" title="关于我" align="absmiddle" /><strong>关于我</strong></a></span>',		                    
						'</li>',
					'</ul>',
					'<div class="clearit"></div>',
				'</div>',
				'<div class="tb_ps_manage">',
					'<p><a target="_blank" id="#{linkChangeFace}" href="javascript:;">修改头像昵称</a></p>',
					'<p><a target="_blank" id="#{linkChangePassword}" href="javascript:;">修改登录密码</a></p>',
					'<p><a target="_blank" id="#{linkAccountSetup}" href="javascript:;">账号安全设置</a></p>',
					'<p><a target="_blank" id="#{bindEmail}" href="javascript:;">绑定邮箱</a></p>',
				'</div>',
			'</div>',
		'</div>',
	'</div>'
].join("");


			
