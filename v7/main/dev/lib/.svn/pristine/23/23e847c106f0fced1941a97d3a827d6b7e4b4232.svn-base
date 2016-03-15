/**
 * @fileoverview 举报的功能模板配置
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2010-01-15
 */

/**
 * 举报对话框容器
 */
scope.reportMainTpl=[
	'<div id="#{panel}" class="blog_report">',
		'<div id="#{titleBar}" class="BRpt_topTit">',
		 	'<a href="#" onclick="return false;" id="#{btnClose}" title=""><img src="http://simg.sinajs.cn/blog7style/images/common/report/icon_clo.gif" /></a>',
		'</div>',
		'<div id="#{content}" class="BRpt_mid">',
		'</div>',
	'</div>'
].join("");

/**
 * 开始举报
 */
scope.reportStartTpl=[
	'<div class="BRpt_Mtop">',
		'<p>新浪博客愿和您一起共同打造健康和谐的网络信息交流平台。并有7×24小时的值班服务，及时有效的处理您的举报。</p>',
	'</div>',
	'<div class="Brpt_RtConn">',
		'<p id="#{resumeInfo}" class="Brpt_RtInf"></p>',
		'<textarea id="#{resumeContent}" readonly="readonly" class="Brpt_RtTxt"></textarea>',
		'<p class="Brpt_Rhost"><input type="checkbox" id="#{cbBlogHost}" /><label for="#{cbBlogHost}">同时举报博主</label></p>',
		'<div class="clear"></div>',
		'<div class="Brpt_choCla">',
			'<p class="claTit">请选择您举报类别（<span class="cho">必选</span>）：</p>',
			'<p class="cla_conn">',
				'<input id="ero" value="1" type="radio" name="chocla" /><label for="ero">色情</label>',
				'<input id="pol" value="2" type="radio" name="chocla" /><label for="pol">政治</label>',
				//'<input id="tor" value="3" type="radio" name="chocla" /><label for="tor">侵权</label>',
				'<input id="adv" value="5" type="radio" name="chocla" /><label for="adv">广告</label>',
				'<input id="oth" value="4" type="radio" name="chocla" /><label for="oth">其他</label>',
			'</p>',
            '<p>对部分内容(个人侵权、企业侵权等)的举报投诉，请拨打新浪网客服电话4006900000，转人工服务、索取《新浪网删帖申请文档》并提供相关证明材料。<br/><span style="color:red;">新浪网删帖不收取任何费用</span></p>',
		'</div>',
		'<p class="Brpt_othInt">您可以填写更多举例说明：</p>',
		'<textarea id="#{reportReason}" class="Brpt_RtTxt"></textarea>',
	'</div>',
	'<div class="Brpt_RCBtn">',
		'<a class="BRpt_btnGy" href="#" onclick="return false;" id="#{btnOk}" title=""><span>确认</span></a>',
		'<a class="BRpt_btn" href="#" onclick="return false;" id="#{btnCancel}" title=""><span>取消</span></a>',
		'<div class="clearit"></div>',
	'</div>'
].join("");


/**
 * 恶意举报
 */
scope.reportBadTpl=[
	'<div class="BRpt_Mtop">',
		'<p>新浪博客愿和您一起共同打造健康和谐的网络信息交流平台。并有7×24小时的值班服务，及时有效的处理您的举报。</p>',
	'</div>',
	'<div class="Brpt_exclt">',
		'<p class="Brpt_extP1">您已经成功举报了该信息，工作人员会尽快处理。</p>',
		'<p class="Brpt_extP2">再次感谢您对新浪博客的支持！</p>',
		'<div class="Brpt_extBtn"><a class="BRpt_btn" href="#" onclick="return false;" id="#{btnOk}" title=""><span>确认</span></a><div class="clear"></div></div>',
	'</div>'
].join("");

/**
 * 举报成功
 */
scope.reportSuccessTpl=[
	'<div class="BRpt_Mtop">',
		'<p>新浪博客愿和您一起共同打造健康和谐的网络信息交流平台。并有7×24小时的值班服务，及时有效的处理您的举报。</p>',
	'</div>',
	'<div class="Brpt_extRst">',
		'<p class="Brpt_eRTit">举报完成！感谢您对我们工作的支持，我们将在24小时内处理。</p>',
		'<div class="Brpt_eRmtd">',
			'<p class="tit">您还可以：</p>',
			'<div class="conn">',
				'<p class="mtd">',
					'<input type="checkbox" id="#{cbCustom}"/>',
					'<label for="#{cbCustom}">我是新浪博客用户，我要接收处理结果</label><span id="#{guestText}">(您还没有登录)</span>',
				'</p>',
			'</div>',
			'<div class="conn2">',
				'<p class="mtd"><input type="checkbox" id="#{cbOtherMethod}" /><label for="#{cbOtherMethod}">我要通过其他方式接收处理结果</label></p>',
				'<div id="#{userForm}" style="display:none;">',
					'<p class="perInf"><span>您的姓名：</span><input id="#{userName}" type="text" /></p>',
					'<p class="perInf"><span>您的邮箱：</span><input id="#{userEmail}" type="text" /></p>',
					'<p class="perInf"><span>您的电话：</span><input id="#{userTel}" type="text" /></p>',
				'</div>',
			'</div>',
		'</div>',
		'<div class="Brpt_eRBtn"><a class="BRpt_btnGy" href="#" onclick="return false;" id="#{btnOk}" title=""><span>确认</span></a><div class="clear"></div></div>'
].join("");

/**
 * 举报完成
 */
scope.reportFinishedTpl=[
	'<div class="BRpt_Mtop">',
		'<p>新浪博客愿和您一起共同打造健康和谐的网络信息交流平台。并有7×24小时的值班服务，及时有效的处理您的举报。</p>',
	'</div>',
	'<div class="Brpt_thx">',
		'<p>再次感谢您对新浪博客举报的大力支持！</p>',
		'<div class="Brpt_thxBtn"><a class="BRpt_btnGy" href="#" onclick="return false;" id="#{btnCancel}" title=""><span>关闭</span></a></div>',
	'</div>'
].join("");