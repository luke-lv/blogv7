/*
* author : meichun1@staff.sina.com.cn 
* 开通育儿博客 填写相关表单信息 
* 17:38 2010/8/5
*/
$import("sina/sina.js");
$import("sina/core/array/foreach.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/system/br.js");
$import("sina/core/dom/getElementsByClass.js");

$import("sina/core/dom/getTop.js");

$import("product/personal/selectappender.js");
$import("sina/ui/tween.js");
$import("sina/core/string/byteLength.js");
$import("msg/baby_msg.js");
$import("msg/regmsg.js");
$import("lib/interface.js");
$import("lib/dialogConfig.js");
$import("sina/utils/cookie/setCookie.js");
$registJob("baby_info", function() {


		DialogTemplate.alert=$SYSMSG.alert;
		
		var selectAppender = new scope.personal.SelectAppender();

		/*预产期时间设置*/

	/*	var now = new Date(),
		nowYear = now.getFullYear(),
		nowMonth = now.getMonth();*/
		
		//事件读取服务器时间
		
		var nowdateStr=scope.$current_time.split('-'),
		
		nowYear = parseInt(nowdateStr[0],10),
		nowMonth = parseInt(nowdateStr[1],10),
		
		
		
		stateYear = $E('stateYear'),
		stateMonth = $E("stateMonth"),
		stateDay = $E("stateDay");
		
		

		selectAppender.initialize(stateYear, nowYear, nowMonth > 2 ? nowYear + 1 : nowYear);
		selectAppender.initialize(stateMonth, 1, 12);
		selectAppender.initialize(stateDay, 1, 31);
		scope.personal.selecter(stateYear, stateMonth, stateDay);

		/* 在设置宝宝生日选项之前保存单个宝宝的选项HTML 及初始节点 变量*/

		var addBaby = $E("addbaby"),
		firstDiv=$T(addBaby.parentNode, 'div')[0],
		divParent=firstDiv.parentNode,
		firstDel=$T(firstDiv, 'span','del')[0],
		addBabyHtml = firstDiv.innerHTML;

		/*存放多个宝宝相关信息的数组*/
		var babyArr = [];
		
		/*限制注册的宝宝数量*/
		var babyAmount=2;
		
		var submitBtn = Core.Dom.byClz(scope.baby.main, 'a', 'SG_aBtn');

		
		
		/*显示 隐藏提示信息函数*/
				
		function tip(err) {
			
				scope.baby.incomplete = true;
				err.style.display = "";
				Core.Array.foreach([].slice.call(arguments, 1),
				function(elem) {
						elem.onfocus = function() {
								err.style.display = "none";
								scope.baby.incomplete = null;
						};
						if(elem.type=="radio"&&($SAFARI||$CHROME)){
								elem.onclick = function() {
									err.style.display = "none";
									scope.baby.incomplete = null;
								};
						}
				});
		}
		
		/*身高体重限制输入 */

		//function number(evt) {
//				evt=evt||event;
//				var elem = evt.srcElement || evt.target,
//				value = elem.value;
//				/*if(/^0/.test(elem.value)){
//						elem.value = value.replace(/^0/, '');
//				}
//				*/
//				//小数点 前只能有3位数
//				//小数点 后只能有1位数
//				if (parseFloat(value) != value || /\.\d{2,}/.test(value) || parseFloat(value)>=1000) {
//						
//						if( /[^\d.]/.test(value.slice(-1)) || parseFloat(value)>=1000){
//								elem.value = value.slice(0, -1);	
//						}
//						
//						elem.value = elem.value.replace(/[^\d.]/g,'');
//				}
//		}
		
		/* *身高体重限制输入 限制 仅 非数字和点数 输入*/
		/*function digitLimit(evt){
			evt=evt||event;
			var code = evt.keyCode;
				if ((code < 96 || code > 105) && (code < 48 || code > 57) && (code != 8) && (code != 39) && (code != 37) && (code != 46) && (code != 190) && (code != 110)) {
						if (evt.preventDefault) {
								evt.preventDefault();
						}
						evt.returnValue = false;
				}
		}*/

		/*初始化表单*/
		
		function init(obj,div,del) {
			
			
				/*节点变量*/
				var babyBoy = obj.babyboy,
				babyGirl = obj.babygirl,
				babyGenderErr = Core.Dom.byClz(babyBoy.parentNode.parentNode, 'p', 'err')[0],
				
				babyHeight = obj.bodyheight,
				babyHeightErr =babyHeight.err = Core.Dom.byClz(babyHeight.parentNode, 'p', 'err')[0],
				
				
				babyWeight =obj.bodyweight,
				babyWeightErr = babyWeight.err =Core.Dom.byClz(babyWeight.parentNode, 'p', 'err')[0],
				
				babyNick=obj.babynick,
				babyNickErr = Core.Dom.byClz(babyNick.parentNode, 'p', 'err')[0],
				
				
				
				birthYear=obj.birthyear,
				birthMonth=obj.birthmonth,
				birthDay=obj.birthday;
				bybyBirthErr = Core.Dom.byClz(birthYear.parentNode, 'p', 'err')[0];
				

				
				/*初始化 宝宝生日select选项	*/	
				selectAppender.initialize(obj.birthyear, nowYear, nowYear - 16);
				selectAppender.initialize(obj.birthmonth, 1, 12);
				selectAppender.initialize(obj.birthday, 1, 31);
				scope.personal.selecter(obj.birthyear, obj.birthmonth, obj.birthday);

				/* 宝宝昵称验证*/
				
				babyNick.onblur = function() {
						this.value=this.value.replace( /^\s+|\s+$/g, "" );
						if (this.value == "") {
								scope.baby.incomplete = true;
								babyNickErr.style.display = "";
								babyNickErr.innerHTML = "请填写宝宝昵称";
						}else if (Core.String.byteLength(this.value) < 4||Core.String.byteLength(this.value) > 20) {
								babyNickErr.style.display = "";
								babyNickErr.innerHTML = "宝宝昵称长度为2-10个汉字（4-20个字符）";
								scope.baby.incomplete = true;
						}else if(this.value.match(/[^\w\u4E00-\u9FA5]/)){
								babyNickErr.style.display = "";
								babyNickErr.innerHTML = "宝宝昵称只允许使用中文、英文、数字、下划线。 ";
								scope.baby.incomplete = true;
						}
				};
				
				babyNick.onfocus = function() {
						babyNickErr.innerHTML = "";
						babyNickErr.style.display = "none";
						scope.baby.incomplete = null;
				};

				/*身高体重验证 验证  格式:数字 ###.#*/
			
				Core.Array.foreach([babyWeight, babyHeight],
				function(elem) {
						//if ($IE || $SAFARI) {
//								Core.Events.addEvent(elem, number, "keyup");
//								Core.Events.addEvent(elem, number, "keypress");
//						}
//						else{
//								Core.Events.addEvent(elem, number, 'input');
//						}
						
						
						/*限制 仅 非数字和点数 输入
						elem.onkeydown=digitLimit;*/
						
						/*针对通过ctrl+v 等操作数据验证*/
						
						elem.maxLength=5;
						elem.onblur = function() {
								var _this=this;
								
								if(/^\s+|\s+$/.test(this.value)){
										this.value=this.value.replace( /^\s+|\s+$/g, "" );
								}
								var elemv=this.value;
								if (elemv == "") {
										scope.baby.incomplete = true;
										this.err.style.display = "";
										this.err.innerHTML = this===babyWeight?"请填写宝宝体重":"请填写宝宝身高";
								}else if(elemv.match(/[^\d.]/) || elemv.match(/\..*\./) || elemv.match(/^\.|\.$/) || elemv.match(/^0\d/) ){
									
										this.err.style.display = "";
										this.err.innerHTML = elemv.match(/[^\d.]/)?"只能输入数字 ": "请填写正确的数字";
										
										scope.baby.incomplete = true;
										
										Core.Events.addEvent(this,function(){
												Core.Events.removeEvent(_this,arguments.callee,'focus');
												_this.value="";
												scope.baby.incomplete = null;
										},'focus');
										
										
								}else if( this===babyWeight && (elemv < 2||elemv >= 1000) || this===babyHeight && (elemv < 40|| elemv>= 1000 )){
										this.err.style.display = "";
										this.err.innerHTML = "请填写合理数字";
										
										scope.baby.incomplete = true;
										Core.Events.addEvent(this,function(){
												Core.Events.removeEvent(_this,arguments.callee,'focus');
												_this.value="";
												scope.baby.incomplete = null;
										},'focus');
								
							    }
						};
						
						elem.onfocus = function() {
								this.err.style.display = "none";
								scope.baby.incomplete = null;
						};
				});


			
				/*每组宝宝资料后面的删除资料*/
				del.onclick = function() {
						/*对应的资料移除*/
						div.parentNode.removeChild(div);
				
						/*点删除后 增加宝宝的按钮要显示出来*/
						addBaby.style.display = "block";
				
						//删除数组中存储的变量
						
						var n =Core.Array.findit(babyArr,obj);
						babyArr.splice(n, 1);
				
						//仅只有一组资料时 ， 不出现 删除按钮
						var dels=Core.Dom.byClz(divParent, "span", "del");
						if (!dels[1]) {
								dels[0].style.display = "none";
						}
				
				
						/*设置 表单不完整信息为null，假如删除 不完整表单*/
						scope.baby.incomplete = null;
						
						//第一组信息去掉br标签
						Core.Array.foreach($T($T(divParent,'div')[0], "br"),
						function(br) {
								br.style.display = "none";
						});
						
						this.onmouseout();
				};
				
				
				var _table=$T(div,'table')[0];
				
				del.style.marginLeft="170px";
				del.style.color="#1E50A2";
				
				del.style.fontFamily="宋体";
				del.innerHTML="[删除]";
				
				del.onmouseover=function(){
						if(!$E('borderTip')){
								
								var _div=$C('div');
								div.parentNode.appendChild(_div);
								
								_div.style.border="1px solid #DEDEDE";
								
							
								_div.style.display="none";
								_div.style.position="absolute";
								//_div.style.zIndex=0;
								_div.style.left="10px";
								_div.style.width="457px";
							    _div.id="borderTip";
						}
						$E('borderTip').style.height=_table.offsetHeight+8+"px";
						$E('borderTip').style.display="block";
						$E('borderTip').style.top=Core.Dom.getTop(_table)-232+"px";
						
						this.style.position="relative";
						this.style.textDecoration="underline";
						this.style.zIndex=100;
						
						
				};
				
				del.onmouseout=function(){
						$E('borderTip').style.display="none";
						this.style.position="";
						this.style.textDecoration="";
						this.style.zIndex="";
						
				};
		}

		/* 初始表单存入数组babyArr*/
		
		babyArr.push({
				birthyear:  $E("birthyear"),
				birthday: $E("birthday"),
				birthmonth: $E("birthmonth"),
				babyboy: $E("babyboy"),
				babygirl:$E("babygirl"),
				babynick: $E("babynick"),
				bodyweight: $E("bodyweight"),
				bodyheight: $E("bodyheight")
		});

		/*初始化该表单*/
		init(babyArr[0],firstDiv, firstDel);
		

		/*点击增加宝宝数量时*/
		var guid=0; //设置唯一号
		
		addBaby.onclick = function() {
				var obj = {},
				div =$C('div');
				babyArr.push(obj);

				/* 注：IE在返回元素的html时，id name属性值不带引号 */
				guid++;
				var html = addBabyHtml.replace(/((?:id|name|for)="?)(.+?)\b("?)/g,
				function(a, b, c, d) {
						obj[c] = c + guid;
						return b + c + guid + d;
				});
				
				div.innerHTML = "<br/><br/>" + html;
				div.style.height = 0;
				div.style.overflow = "hidden";

				divParent.insertBefore(div, this);
				
				var del= Core.Dom.byClz(div, "span", "del")[0];
				
				
				Ui.tween(div, 'height', 211, .3, 'simple', {
						end: function() {
								/*动画结束后 去掉overflow与height样式 使得 内容能自适应，避免 出现 错误提示信息时 内容被截掉*/
								div.style.overflow = "visible";
								div.style.height = "";
								
								/*删除资料 的链接 显示*/
								del.style.display = "";
								
								/*最开始 组的 删除按钮 要显示  而并非 firstDel（可能已被删），*/
								Core.Dom.byClz(divParent, "span", "del")[0].style.display = "";
								
								
						}
				});
				
				
				for(var o in obj){
						obj[o]=$E(obj[o]);
				}
				
			
				
				//保存表单节点以及guid;
				obj.elem=div;
				obj.guid=guid;
				
				init(obj,div,del);
				if(babyAmount==babyArr.length){
						this.style.display="none";
				}
				return false;
		};



		/*在提交信息时验证 数据*/
		
		submitBtn[2].onclick=function() {
				//alert(uneval(babyArr))
				Core.Array.foreach(babyArr,
				function(obj) {
						
						var babyBoy = obj.babyboy,
						babyGirl = obj.babygirl,
						babyGenderErr = Core.Dom.byClz(babyBoy.parentNode.parentNode, 'p', 'err')[0],
						
						babyHeight = obj.bodyheight,
						babyHeightErr = Core.Dom.byClz(babyHeight.parentNode, 'p', 'err')[0],
						
						babyWeight =obj.bodyweight,
						babyWeightErr = Core.Dom.byClz(babyWeight.parentNode, 'p', 'err')[0],
						
						babyNick=obj.babynick,
						babyNickErr = Core.Dom.byClz(babyNick.parentNode, 'p', 'err')[0],
						
						
						
						birthYear=obj.birthyear,
						birthMonth=obj.birthmonth,
						birthDay=obj.birthday;
						bybyBirthErr = Core.Dom.byClz(birthYear.parentNode, 'p', 'err')[0];
						

						babyNick.onblur();
						
						babyHeight.onblur();
						babyWeight.onblur();
						
						if (birthMonth.value == 0 || birthDay.value == 0) {
								tip(bybyBirthErr,birthYear,birthMonth,birthDay);
						}
						if (!babyBoy.checked && !babyGirl.checked) {
						
								tip(babyGenderErr,babyGirl,babyBoy);
						}
						if (babyHeight.value == "") {
								babyHeightErr.innerHTML = "请填写宝宝身高";
								tip(babyHeightErr,babyHeight);
						}
						if (babyWeight.value == "") {
								babyWeightErr.innerHTML = "请填写宝宝体重";
								tip(babyWeightErr,babyWeight);
						}
				});
				
				
				/*在最后一组宝宝信息检测完时， 是否提交数据 或 提示 表单信息不完整 */
				if (scope.baby.incomplete) {
							winDialog.alert("您填写的信息有误，请根据页面红字更改。");
							scope.baby.incomplete = null;
				} else {
							postValue();
				}
				
						
		
			
			return false;
		};



		/*提交数据 函数*/
		function postValue(getParam) {

				var info= {"babystates":2,"src":scope.$src};
				
				Core.Array.foreach(babyArr,
				function(obj, i) {
						i = i || "";
						
						info['babynick' + i] = obj.babynick.value;
						info['babysex' + i] = obj.babyboy.checked ? "male" : "female";
						info['birthyear' + i] = obj.birthyear.value;
						info['birthmonth' + i] = obj.birthmonth.value;
						info['birthday' + i] = obj.birthday.value;

						info['bodyheight' + i] = obj.bodyheight.value.replace(/(\.\d)\d+/,"$1");
						info['bodyweight' + i] = obj.bodyweight.value.replace(/(\.\d)\d+/,"$1");

				});
				
				
				
				getParam = getParam || info ;
			

				new Interface("http://control.blog.sina.com.cn/riaapi/reg/init_blog_userinfo.php", "ajax").request({
						POST: getParam,
						onSuccess: function(res) {
								//Utils.Cookie.setCookie("remberloginname", escape(scope.$loginname), 2400, "/", ".blog.sina.com.cn");
								//modified xiaoyue3@staff 开通成功后跳转至个人中心页 
								window.location.href = "http://i.blog.sina.com.cn/blogprofile/index.php?atten=1";
						},
						onError: function(res) {
								winDialog.alert($SYSMSG[res.code], {
										funcOk: function() {
												if (res.code == "A00113") {
														//Utils.Cookie.setCookie("remberloginname", escape(scope.$loginname), 2400, "/", ".blog.sina.com.cn");
														window.location.href = "http://blog.sina.com.cn/u/"+scope.$uid;
												}
										}
								});
								scope.baby.incomplete = null;
						}
				});

		}
		
		
		submitBtn[1].onclick = function() {
				//var now=new Date;
				if (stateMonth.value == 0 || stateDay.value == 0) {
						winDialog.alert("请选择您的预产期");
						return false;
				}
				
				/*if ( new Date(stateYear.value,stateMonth.value-1,+stateDay.value+1) -now <=0 ) {
						winDialog.alert("请选择正确的预产期");
						return false;
				}*/
				postValue({
						babystates:1,
						stateyear: stateYear.value,
						statemonth: stateMonth.value,
						stateday: stateDay.value,
						src:scope.$src

				});
				return false;

		};
		
		submitBtn[0].onclick = function() {
				var pregmonthValue=$E('pregmonth').value;
				if (pregmonthValue == 0 ) {
						winDialog.alert("请选择备孕时间");
						return false;
				}
				postValue({babystates:0,pregmonth: pregmonthValue,"src":scope.$src});
				return false;
		};
		
		scope.baby=scope.baby||{};
		scope.baby.babyArr=babyArr;

});