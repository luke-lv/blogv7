/**
 * @fileoverview 首页提示名人用户使用百度百科组件
 * @author meichun1@staff.sina.com.cn
 * @created 2010-09-17
 */
$import("lib/dialogConfig.js");
$import("sina/core/string/encodeHTML.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/dom/insertAfter.js");
$import("sina/core/array/findit.js");
$import("sina/utils/cookie/getCookie.js");
$import("sina/utils/cookie/setCookie.js");


$registJob("baike",
function() {
	
		//重新设置新的cookies为baike1，清除之前的cookie baike.  2010/10/14
		Utils.Cookie.setCookie("baike", "", -24, "/", ".blog.sina.com.cn");
		
		var comId = 119,
		after901, tit, n, tpl, div = $C('div'),
		fm = scope.Personality;

		if (!fm || $E('module_' + comId) || Utils.Cookie.getCookie('baike1') == 1) {
				return;
		}
		
		
		tpl='<table class="CP_w"id="#{entity}"><thead id="#{titleBar}"><tr><th class="tLeft"><span></span></th><th class="tMid"><div class="bLyTop"><strong>通知</strong><cite><a class="CP_w_shut"title="关闭"id="#{btnClose}"href="#"onclick="return false;">关闭</a></cite></div></th><th class="tRight"><span></span></th></tr></thead><tfoot><tr><td class="tLeft"><span></span></td><td class="tMid"><span></span></td><td class="tRight"><span></span></td></tr></tfoot><tbody><tr><td class="tLeft"><span></span></td><td class="tMid"><div class="faceItemContent"id="#{content}"><div class="baidu_wd"><div class="bd_c"><h4>尊敬的<span>'+fm+'</span>您好：</h4><p class="txt">新浪博客与百度百科合作，为您定制了百科名片组件。您的百科名片会在新浪博客和百度百科保持一致，方便更多的网友了解您。</p><p class="txt">该组件只对部分名博开放，非常欢迎您能试用。</p><dl><dt>说明：</dt><dd><ul><li>·使用后，百度百科中会增加博客链接，进一步提高您博客的访问量</li><li>·可以通过此组件，快捷编辑个人的百科资料</li><li>·如您觉得不适应，可以选择隐藏此组件</li></ul><p class="logobox"><img alt="新浪博客" src="http://simg.sinajs.cn/blog7style/images/widget/baidu/logo_sina.gif"width="83"height="21"/> <img height="18"width="55"alt="百度百科"src="http://simg.sinajs.cn/blog7style/images/widget/baidu/logo-baike.gif"></p></dd></dl></div><p class="trial"><span class="btn_trial" id="#{tryBaike}"></span><a id="#{cancel}"href="javascript:;"class="cancel">取消</a></p></div></div></td><td class="tRight"><span></span></td></tr></tbody></table>';


		n = winDialog.createCustomsDialog({
				tpl: tpl,
				title: "通知",
				width: 557,
				height: 321
		});

		div.id = "module_" + comId;
		div.className = 'SG_conn';
		div.innerHTML = '<div class="SG_connHead"><span class="title">' + Core.String.encodeHTML(fm + "的百科") + '</span><span class="edit"></span></div><div class="SG_connBody"></div><div class="SG_connFoot"></div>';

		

		n.nodes.btnClose.onclick = n.nodes.cancel.onclick = n.close.bind2(n);

		n.show();
		n.setMiddle();
		n.setAreaLocked(true);
		
		//重新设置新的cookies为baike1，清除之前的cookie baike.  2010/10/14
		Utils.Cookie.setCookie("baike1", 1, 24 * 3650, "/", ".blog.sina.com.cn");
		
		
		n.nodes.tryBaike.onclick = function() {

				//防止IE6下请求被中断
				
				Core.Events.stopEvent();
				var lists = scope.component_lists,
				arr;
				
				function suc() {
						if ($E('module_901') != null) {
								Core.Dom.insertAfter(div, $E('module_901'));

						} else {

								$E('column_1').insertBefore(div, $E('column_1').firstChild);

						}
						Lib.Component.refresh(comId, {
								width: 210
						});
						
						tit = Core.Dom.byClz(div, 'span', 'title')[0];
						tit.innerHTML = tit.getAttribute('comp_title');
						
						n.close();
						
				}

				after901 = $E('module_901') ? +$E('module_901').parentNode.id.slice( - 1) : 0;

				if (!after901) {

						try {
								lists[1].list.unshift(comId);
						} catch(e) {
								//第一栏为空
								lists["1"] = {
										"size": 210,
										"list": [comId]
								}
						}
				} else {
						arr = lists[after901].list;
						arr.splice(Core.Array.findit(arr, 901) + 1, 0, comId);

				}

				var postdata = {
						uid: scope.$uid,
						version: 7,
						style: scope.formatInfo
				};

				lists[1] && (postdata.c1 = lists[1].list.join(','));
				lists[2] && (postdata.c2 = lists[2].list.join(','));
				lists[3] && (postdata.c3 = lists[3].list.join(','));

				/*提交数据*/
				
				new Interface("http://control.blog.sina.com.cn/riaapi/conf/module_manager.php", "jsload").request({
						GET: postdata,
						onSuccess: suc,
						onError: function(data) {
								winDialog.alert($SYSMSG[data.code], {
										funcOk: n.close.bind2(n)
								});

						}
				});

		};

});