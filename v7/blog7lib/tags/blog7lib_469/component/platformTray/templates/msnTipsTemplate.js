/**
 * @fileoverview msn 提示消息
 * @author wujian  wujian@staff.sina.com.cn
 * @created 2010-12-9 10:28
 */
scope.msnTipsTemplate=['<div id="#{panel}" style="position: absolute; width: 369px; padding-top: 7px; font-size: 12px; z-index:511">',
    						'<div  style="top: 0pt; left: 65px; position: absolute; width: 16px; height: 8px; background: url(\'http://simg.sinajs.cn/blog7style/images/special/move/bg_boxtop_01.png\') no-repeat scroll 0pt 0pt transparent; z-index: 100;"></div>',
   							'<div style="padding: 5px 6px 9px 14px; border: 1px solid rgb(181, 202, 214); background: url(\'http://simg.sinajs.cn/blog7style/images/special/move/bg_asiangames.jpg\') no-repeat scroll left bottom rgb(255, 255, 255); z-index: 1;">',
       							 '<p id="#{close}" class="close" style="float: right; margin: 0pt; cursor: pointer; width: 8px; height: 8px; font-size: 0pt;background:url(\'http://simg.sinajs.cn/blog7style/images/special/move/btn_close.gif\') no-repeat 0 0;"></p>',
       							 '<div style="width: 342px; margin: 10px 0pt 0pt; padding: 0pt 0pt 3px;">',
            						'<a style="float: left; margin: 0pt 10px 0pt 0pt;" href="#"><img height="91" width="122" style="border: 0pt none;" alt="MSN" src="http://simg.sinajs.cn/blog7style/images/special/move/img_msnphoto.png"></a>',
            						'<h3 style="padding: 2px 0pt 5px; color: rgb(0, 0, 0); margin: 0pt; font-size: 12px;">各位拥有MSN帐号的同学注意啦!</h3>',
            						'<p style="width: 268px; display: inline; text-indent: 0pt; padding: 0pt; color: rgb(51, 51, 51); line-height: 19px;">新浪博客帐号与MSN帐号已经实现关联。您可以使用MSN帐号来登录博客，绑定后发博文、发图片可同步到Live，第一时间让您的MSN好友知晓。</p>',
        						'</div>',
      							'<p style="clear: both; height: 30px; margin: 12px 10px 4px 0pt; padding: 12px 0pt 0pt; border-top: 1px solid rgb(220, 213, 211); text-align: right;"><a style="float: right; color: rgb(176, 173, 172); margin-top: 10px; text-decoration: none;" href="javascript:void(0);" id="#{noMoreShow}">不再显示</a><a style="float: right; text-decoration: none; margin: 10px 14px 0pt 16px;color:#2d3186;" href="http://blog.sina.com.cn/s/blog_4b0f52990100lt3i.html">帮助</a><a id="#{setNow}"style="float: right;" href="http://control.blog.sina.com.cn/blogprofile/msnbind.php"><img height="32" width="105" style="border: medium none;" alt="立即设置" src="http://simg.sinajs.cn/blog7style/images/special/move/btn_receive01.jpg"></a></p>',
  							'</div>',
						'</div>'].join("");
