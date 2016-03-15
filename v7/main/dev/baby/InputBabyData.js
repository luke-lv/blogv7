/**
 * Copyright (c) 2010, Sina Inc. All rights reserved.
 * 
 * @fileoverview 弹出育儿博客的宝宝数据资料填写
 */
$import("editor/plugins/plugins.js");
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/function/bind3.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/events/getEventTarget.js");
$import("editor/plugins/config/template.js");
$import("lib/interface.js");

$import("sina/sina.js");
$import("sina/core/array/foreach.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/system/br.js");
$import("sina/core/dom/getElementsByClass.js");

$import("sina/ui/tween.js");
$import("sina/core/string/byteLength.js");

$import("lib/interface.js");
$import("sina/utils/cookie/setCookie.js");

(function() {
	// 在此之前可以加一个判断决定是否加载

	//var link = document.createElement('link');
	//link.href = "http://simg.sinajs.cn/blog7style/css/common/common.css";
	//link.rel = "stylesheet";
	//link.type = "text/css";
	//document.body.appendChild(link);

	var cont = '<div class="CP_layercon2 baby_infoLayer"><div class="baby_stateTab">\
	<table cellspacing="0" cellpadding="0" border="0">\
		<tbody><tr>\
			<th scope="row">宝宝昵称：</th>\
			<td><input type="text" maxlength="16" class="SG_input nickname" name="babynick" id="babynick" gtbfieldid="21">\
				<p class="tip">最多8个汉字</p>\
				<p style="display: none;" class="err">错误提示</p></td>\
		</tr>\
		<tr>\
			<th scope="row">宝宝性别：</th>\
			<td><span>\
				<input type="radio" value="male" name="babysex" id="babyboy">\
				<label for="">男宝宝</label>\
				&nbsp;&nbsp;\
				<input type="radio" value="female" name="babysex" id="babygirl">\
				<label for="">女宝宝</label>\
				</span>\
				<p style="display: none;" class="err">请选择性别</p>\
				</td>\
		</tr>\
		<tr>\
			<th scope="row">宝宝生日：</th>\
			<td><select id="birthyear" name="birthyear" gtbfieldid="22">\
				</select>\
				&nbsp;年&nbsp;&nbsp;\
				<select id="birthmonth" name="birthmonth" gtbfieldid="23">\
				</select>\
				&nbsp;月&nbsp;&nbsp;\
				<select id="birthday">\
					<option value="0">请选择</option>\
				</select>\
				&nbsp;日&nbsp;&nbsp;\
				<p style="display: none;" class="err">请填写完整生日（年、月、日）</p></td>\
		</tr>\
		<tr>\
			<th scope="row">宝宝身高：</th>\
			<td><input type="text" maxlength="5" name="bodyheight" id="bodyheight" class="SG_input height" gtbfieldid="24">\
				cm\
				<p style="display: none;" class="err">请填写宝宝身高</p>\
				</td>\
		</tr>\
		<tr>\
			<th scope="row">宝宝体重：</th>\
			<td><input type="text" maxlength="5" name="bodyweight" id="bodyweight" class="SG_input weight" gtbfieldid="25">\
				kg<p style="display: none;" class="err">请填写宝宝体重</p></td>\
		</tr>\
	</tbody></table>\
	<p id="addbaby">\
		<a class="underline" href="#">填写第二个宝宝资料</a>\
	</p>\
</div><div class="btn"><a class="SG_aBtn SG_aBtnB" href="#" onclick="return false;"><cite id="baby_data_save">保存</cite></a>&nbsp;&nbsp;<a class="SG_aBtn SG_aBtnB" href="#" onclick="return false;"><cite id="baby_data_cancel">取消</cite></a></div></div>';
	scope.babyDataOnOk = function(opt) {
		var dialog = winDialog.createCustomsDialog({
					title : "请填写宝宝信息",
					content : cont,
					width : 350
				}, "tips_baby_data");
		dialog.setMiddle();
		dialog.addEventListener("hidden",function(){
			this.destroy();
		});
		dialog.setAreaLocked(true);
		dialog.show();

		$E('baby_data_cancel').onclick = function() {
			dialog.close();
		}

		var SelectAppender = function(step) {
			this.step = step || 1;
		};
		SelectAppender.prototype = {
			initialize : function(selObj, startValue, endValue) {
				var i, m;
				if (this.step >= 0) {
					i = Math.min(startValue, endValue);
					m = Math.max(startValue, endValue);
					for (i; i <= m; i += this.step) {
						var op = $C("option");
						op.innerHTML = i;
						op.value = i;
						selObj.appendChild(op);
					}
				} else {
					i = Math.max(startValue, endValue);
					m = Math.min(startValue, endValue);
					for (i; i >= m; i += this.step) {
						var op = $C("option");
						op.innerHTML = i;
						op.value = i;
						selObj.appendChild(op);
					}
				}
			}
		};

		var dateNum = function(y, m) {
			var isLeap = function(y) {
				return y % 400 ? (y % 100 ? (y % 4 ? 0 : 1) : 0) : 1;
			};
			if (!(y * m)) {
				return 0;
			}
			var d = 31;
			switch (m) {
				case 4 :
				case 6 :
				case 9 :
				case 11 :
					d = 30;
					break;
				case 2 :
					d = isLeap(y) ? 29 : 28;
					break;
			}
			return d;
		};

		var operItem = function(dom, n) {
			var ov = parseInt(dom.value) || 0;
			if (/msie/.test(navigator.userAgent.toLowerCase())) {
				setTimeout(operDom, 200);
			} else {
				operDom();
			}
			function operDom() {
				while (dom.options.length > 1) {
					dom.remove(1);
				}
				for (var i = 1; i <= n; i++) {
					dom.options[dom.options.length] = new Option(i, i);
				}
				dom.value = Math.min(ov, n);
			}
		};

		var selecter = function(oYear, oMonth, oDate, value) {
			var sel = function() {
				operItem(oDate, dateNum(parseInt(oYear.value),
								parseInt(oMonth.value)));
			};
			Core.Events.addEvent(oYear, sel, 'change');
			Core.Events.addEvent(oMonth, sel, 'change');
			sel();
			oDate.value = value || "0";
		};

		var selectAppender = new SelectAppender();

		/* 在设置宝宝生日选项之前保存单个宝宝的选项HTML */
		var addBaby = $E("addbaby"), temdiv = $C('div');
		temdiv.appendChild($T(addBaby.parentNode, 'TABLE')[0].cloneNode(true));
		var addBabyHtml = temdiv.innerHTML;

		/* 存放多个宝宝相关信息的数组 */
		var babyArr = [];

		/* 身高体重限制输入 */
		var number = function(evt) {
			evt=evt||event;
			var elem = evt.srcElement || evt.target,
			value = elem.value;
			elem.value = value.replace(/^0+/, '');
			
			//小数点 前只能有3位数
			//小数点 后只能有1位数
			if (parseFloat(value) != value || /\.\d{2,}/.test(value) || parseFloat(value)>=1000) {
				elem.value = value.slice(0, -1);
				elem.value = elem.value.replace(/[^\d.]/g,'');
			}
		};

		/* 初始化表单 */
		var submitBtn = $E('baby_data_save');
		// var winDialog = scope.baby.winDialog;

		function init(babyArr) {

			/* 设置宝宝生日选项 */
			var n = babyArr.length - 1 || '';

			var now = new Date();
			var nowYear = now.getFullYear();
			var nowMonth = now.getMonth();

			var birthYear = $E('birthyear' + n), birthMonth = $E('birthmonth'
					+ n), birthDay = $E('birthday' + n), babyNick = $E('babynick'
					+ n), babyBoy = $E('babyboy' + n), babyGirl = $E('babygirl'
					+ n), babyHeight = $E('bodyheight' + n), babyWeight = $E('bodyweight'
					+ n), babyNickErr = Core.Dom.byClz(babyNick.parentNode,
					'p', 'err')[0], babyGenderErr = Core.Dom.byClz(
					babyBoy.parentNode.parentNode, 'p', 'err')[0], bybyBirthErr = Core.Dom
					.byClz(birthYear.parentNode, 'p', 'err')[0], babyHeightErr = Core.Dom
					.byClz(babyHeight.parentNode, 'p', 'err')[0], babyWeightErr = Core.Dom
					.byClz(babyWeight.parentNode, 'p', 'err')[0];

			/* 初始化select选项 */
			selectAppender.initialize(birthYear, nowYear, nowYear - 6);
			selectAppender.initialize(birthMonth, 1, 12);
			selectAppender.initialize(birthDay, 1, 31);
			selecter(birthYear, birthMonth, birthDay);
			
			scope.baby = {};
			
			/* 宝宝昵称验证 */

			babyNick.onblur = function() {
				if (babyNick.value == "") {
					scope.baby.incomplete = true;
					babyNickErr.style.display = "";
					babyNickErr.innerHTML = "请填写宝宝昵称";
				} else if (Core.String.byteLength(babyNick.value) < 4
						&& babyNick.value != "") {
					babyNickErr.style.display = "";
					babyNickErr.innerHTML = "宝宝昵称长度为2-10个汉字（4-20个字符）";
					scope.baby.incomplete = true;
				} else if (babyNick.value.match(/[^\w\u4E00-\u9FA5]/)) {
					babyNickErr.style.display = "";
					babyNickErr.innerHTML = "宝宝昵称只允许使用中文、英文、数字、下划线。 ";
					scope.baby.incomplete = true;
				}
			};

			babyNick.onfocus = function() {
				babyNickErr.innerHTML = "";
			};

			/* 身高体重限制输入如1.8.3形式字符串 */

			Core.Events.addEvent('bodyweight' + n, number, 'input');
			Core.Events.addEvent('bodyheight' + n, number, 'input');
			if ($IE) {
				Core.Events.addEvent('bodyweight' + n, number, "keyup");
				Core.Events.addEvent('bodyweight' + n, number, "keypress");
				Core.Events.addEvent('bodyheight' + n, number, "keyup");
				Core.Events.addEvent('bodyheight' + n, number, "keypress");
			}

			/* 显示 隐藏提示信息函数 */

			function tip(err) {
				scope.baby.incomplete = true;
				err.style.display = "";
				Core.Array.foreach([].slice.call(arguments, 1), function(elem) {
							elem.onfocus = function() {
								err.style.display = "none";
							}
						})
			}

			/* 在提交信息时验证 数据 */
			Core.Events.addEvent($E('baby_data_save'),function() {
				if (babyNick.value == "") {
					scope.baby.incomplete = true;
					babyNickErr.style.display = "";
					babyNickErr.innerHTML = "请填写宝宝昵称";
				}
				if (birthMonth.value == 0 || birthDay.value == 0) {
					tip(bybyBirthErr, birthYear, birthMonth, birthDay);
				}
				if (!babyBoy.checked && !babyGirl.checked) {
					tip(babyGenderErr, babyGirl, babyBoy);
				}
				if (babyHeight.value == "") {
					tip(babyHeightErr, babyHeight);
				}
				if (babyWeight.value == "") {
					tip(babyWeightErr, babyWeight);
				}

				/* 在最后一组宝宝信息检测完时， 是否提交数据 或 提示 表单信息不完整 */
				if (n == babyArr.length - 1 && !scope.baby.response) {

					scope.baby.response = true;

					if (scope.baby.incomplete) {
						winDialog.alert("您填写的信息有误，请根据页面红字更改。", {
							funcOk : function() {
								scope.baby.response = scope.baby.incomplete = null;
							}
						})
					} else {
						postValue();
					}
				}
			},'click');
		}
		
		/*提交数据 函数*/
		function postValue(getParam) {
				var info= {babystates:2};

				Core.Array.foreach(babyArr,
				function(obj, i) {
						i = i || "";
						info['babynick' + i] = $E(obj.babynick).value;
						info['babysex' + i] = $E(obj.babyboy).checked ? "male" : "female";
						info['birthyear' + i] = $E(obj.birthyear).value;
						info['birthmonth' + i] = $E(obj.birthmonth).value;
						info['birthday' + i] = $E(obj.birthday).value;
						info['bodyheight' + i] = $E(obj.bodyheight).value;
						info['bodyweight' + i] = $E(obj.bodyweight).value;

				});
				getParam = getParam || info ;
				
				//这里提交宝宝的信息
				new Interface("http://control.blog.sina.com.cn/riaapi/reg/init_blog_userinfo.php", "ajax").request({
						POST: getParam,
						onSuccess: function(res) {
							if(opt.okCall(info)) {
								dialog.close();
							}
							delete scope.baby;
						},
						onError: function(res) {
							winDialog.alert($SYSMSG[res.code], {
								funcOk: function() {}
							});
						}
				});
		}

		babyArr.push({
			birthyear : "birthyear",
			birthday : "birthday",
			birthmonth : "birthmonth",
			babyboy : "babyboy",
			babynick : "babynick",
			bodyweight : "bodyweight",
			bodyheight : "bodyheight"
		});

		init(babyArr);

		/* 点击增加宝宝数量时 */
		addBaby.onclick = function() {
			var div = $C('div'), obj = {}, len = babyArr.length;
			babyArr.push(obj);

			/* 注：IE在返回元素的html时，id name属性值不带引号 */
			var html = addBabyHtml.replace(/((?:id|name)="?)(.+?)\b("?)/g,
					function(a, b, c, d) {
						obj[c] = c + len;
						return b + c + len + d;
					});
			div.innerHTML = "<br/><br/>" + html;
			div.style.height = 0;
			div.style.overflow = "hidden";

			this.parentNode.insertBefore(div, this);
			Ui.tween(div, 'height', 211, .4, 'simple', {
						end : function() {
							/*
							 * 动画结束后 去掉overflow与height样式 使得 内容能自适应，避免 出现 错误提示信息时
							 * 内容被截掉
							 */
							div.style.overflow = "visible";
							div.style.height = "";
						}
					});

			obj.elem = div;
			init(babyArr);
			this.style.display="none";
			return false;
		};

	}
	// this.dialog.show();

})();
