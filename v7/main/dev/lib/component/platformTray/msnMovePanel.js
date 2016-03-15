/**
 * @fileoverview 活动提示面板
 * @author Rui Luo | luorui1@staff.sina.com.cn
 * @created 2010-08-16
 */
$import("sina/sina.js");
$import("sina/core/class/define.js");
$import("sina/core/events/addEvent.js");
$import("sina/utils/io/jsload.js");
$import("sina/core/dom/setStyle.js");
$import("sina/utils/cookie/setCookie.js");
$import("sina/utils/cookie/getCookie.js");

$import("lib/panel.js");
$import("lib/interface.js");
$import("lib/checkAuthor.js");

/**
 * MSN搬家模板
 */
scope.MSNMovePanel = Core.Class.define(function() {
	Lib.Panel.prototype.initialize.apply(this, arguments);
	Lib.checkAuthor();
	this.setTemplate([
		'<div id="#{panel}" style="z-index:511;zoom:1;width:280px;"><div style="width:272px" class="tb_layer_Y tb_layer_w3" id="#{content}"></div>',
		'</div>'
	].join(""));
	this.irequest = new Interface('http://control.blog.sina.com.cn/riaapi/conf/update_user_private.php', 'jsload');
}, Lib.Panel, {

	/**
	 * 显示搬家信息
	 */
	showMsnMove:function() {
		
		//黑名单
		if($_GLOBAL.msnMoveBlackList && $_GLOBAL.msnMoveBlackList[scope.$pageid]) {
			trace('【MSN搬家】当前页面在黑名单');
			return;
		}
		
		if(Utils.Cookie.getCookie('MSNMOVESHOWED_'+$UID)) {
			trace('【MSN搬家】关闭，不显示');
			return;
		}
		

		//这是访问别人的页面
		if(!$isAdmin) {
			trace('【MSN搬家】在别人页面，不弹出');
			return;
		}

		var nodes = this.getNodes();
		var _this = this;
		
		nodes['content'].innerHTML = [
			'<div class="tb_layer_arrow"></div>'
			,'<div id="msncontainer" style="padding: 5px;width:262px" class="tb_layer_Y_main tip_ps">'
			,	'<div style="margin-bottom:5px;">亲爱的'+$nick+'：</div>'
			,	'<div>您可以选择博客的隐私设置：</div>'
			,	'<p style="font-size:14px;padding:6px 0;">'
			,		'<input type="radio" style="vertical-align:-2px" name="private_key_t" checked="" value="0" id="private_key_1_t"><label for="private_key_1_t">对所有人开放</label>'
			,		'<br>'
			,		'<input type="radio" style="vertical-align:-2px" name="private_key_t" value="1" id="private_key_2_t"><label for="private_key_2_t">只对自己开放，私密博客</label>'
			,	'</p>'
			,	'<div>您也可以在个人中心-><a href="http://control.blog.sina.com.cn/blogprofile/profilepower.php" id="msnopen" target="_blank">权限管理</a>中进行设置隐私</div>'
			,	'<div style="margin-top:5px;text-align:center;" id="msnBtnOuter">'
			,		'<a class="SG_aBtn SG_aBtnB SG_aBtn14" href="#" onclick="return false;"><cite id="msnBtn">&nbsp;保存&nbsp;</cite></a>'
			,	'</div>'
			,	'<div style="margin-top:5px;text-align:center;display:none;" id="msnLoadingOuter">'
			,		'<img src="http://simg.sinajs.cn/blog7style/images/common/loading.gif">'
			,	'</div>'
			,	'<a style="top:12px;right:4px;" title="关闭" class="tb_friend_inputDel" href="#" onclick="return false" id="msnclose"></a>'
			,'</div>'
			,'<div id="msn_ok_func" style="display:none;padding: 5px;width:262px" class="tb_layer_Y_main tip_ps">'
			,	'<div style="text-align: center;"><img width="50" height="50" align="absmiddle" alt="成功" id="_30341286594883531_icon" style="VERTICAL-ALIGN: middle" class="SG_icon SG_icon203" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif"><span style="font-size: 14px; font-weight: bold;">设置成功</span></div>'
			,'</div>'
		].join('');
		
		var closed = false;
		
		//一天内不再显示
		//_setCookie(cookieType, 24);

		//绑定resize事件
		Core.Events.addEvent(window,function(){
			if (!closed){
				_this.showWithDom($E('loginBarActivity'), -246, 0);
			}
		},'resize');

		//关闭浮层事件
		Core.Events.addEvent($E('msnclose'),function(){
			_setCookie("1");
			_this.hidden();
			closed = true;
		},'click');
		
		//关闭浮层事件
		Core.Events.addEvent($E('msnopen'),function(){
			_this.hidden();
			closed = true;
		},'click');
		
		Core.Events.addEvent($E('msnBtn'),function(){
			$E('msnBtnOuter').style.display = 'none';
			$E('msnLoadingOuter').style.display = '';
			var val = $E('private_key_1_t').checked ? '0' : '1';
			_this.irequest.request({
			GET: {
					'uid' : $UID
					,'privatekey' : 'isprivate'
					,'privatevalue' : val
				},
				onSuccess: function(data){
					$E('msncontainer').style.display = 'none';
					$E('msn_ok_func').style.display = '';
					setTimeout(function(){
						var i = 100;
						var inte = setInterval(function(){
							Core.Dom.opacity(_this.entity, i);
							if(i == 0) {
								clearInterval(inte);
								_this.hidden();
								closed = true;
								_setCookie("1");
							}
							i -= 10;
						},30);
					},800);
				},
				onError: function(result){
					showError(result.code);
					$E('msnLoadingOuter').style.display = 'none';
					$E('msnBtnOuter').style.display = '';
				}
			});
		},'click');
		
		var tip = _this.entity;
		_this.showWithDom($E('loginBarActivity'), -246, 0);
		tip.style.height = ($E('msncontainer').offsetHeight + 10 ) + 'px';
		Core.Dom.opacity(tip, 0);
		for(var i=1; i<=50; i++) {
			(function(val){
				setTimeout(function() {
					Core.Dom.opacity(tip, val*2);
				},val*20);
			})(i);
		}
		
		/**
		 * 设置cookies
		 * 1 为显示， 0 为不显示
		 */
		function _setCookie(val){
			//name, value, expire, path, domain, secure
			Utils.Cookie.setCookie('MSNMOVESHOWED_'+$UID, val, 2400, '/', '.sina.com.cn');
		}
	}
});
