/**
 * chengwei1@staff.sina.com.cn
 */
$import("sina/sina.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/string/trim.js");
$import("sina/core/events/fireEvent.js");
$import("sina/core/string/format.js");
$import("sina/core/system/br.js");
$import("lib/dialogConfig.js");
$import("lib/interface.js");
$import("lib/audioCheck.js");
$import("product/personal/common.js");
$import("product/personal/selectappender.js");
$import("msg/regmsg.js");
$import("sina/utils/cookie/setCookie.js");
$import("lib/showError.js");
//验证码加入
$import("lib/checkManager.js");
$registJob("activation",function(){
//(function(){
	var blogName = $E("blogName");
	// var blogNick = $E("blogNick");
	var userHost = $E("userHost");
	var userHostTip = $E("userHostTip");				//需要初始 display none。
	var blogNameErr = $E("blogNameErr");
	// var blogNickErr = $E("blogNickErr");
	var userHostErr = $E("userHostErr");
	if(blogName) var blogNameInput = $T(blogName, "input")[0];
	// if(blogNick) var blogNickInput = $T(blogNick, "input")[0];
	if(userHost) var userHostInput = $T(userHost, "input")[0];
	
	var userSex = $T($E("userSex"), "input");		//radio 集
	var marriage = $E("marriage");
	var career = $E("career");
	
	//输出日期。
	var birthYear = $E("selBirthdayYear");
	var birthMon = $E("selBirthdayMonth");
	var birthDay = $E("selBirthdayDay");
	
	// 需要输出省啊，市啊。
	var curProv = $E("curProv");
	var curCity = $E("curCity")
	var homeProv = $E("homeProv");
	var homeCity = $E("homeCity");
	
	var detailBtn = $E("detailBtn");
	var detailDiv = detailBtn.parentNode;
	var detailField = $E("detailField");
	var isPrivate = $E("nosearch");
    
    //验证码
/*    var checkWord = $E("checkword");
    var checkWordErr = $E("checkwordErr");
    var codeImg = $E("code_img");
    var codeLink = $E("code_link");*/
	var checkCodeBox_activation={
		id:'#checkCodeBox'
	}
	var checkManager=new Lib.checkManager(checkCodeBox_activation);
	
    var isDetail = 0;		//详细填写是否点击。
	
	var sexErr = $E("sexErr");
	var dateErr = $E("dateErr");
	var activeBtn = $E("activeBtn");
	
	var nextPhp = "http://control.blog.sina.com.cn/riaapi/reg/open_blog.php";
	var jumpPhp = "http://control.blog.sina.com.cn/reg/reg_blog_complete.php?src=";
	var validPhp = "http://control.blog.sina.com.cn/riaapi/reg/check_domain_exist.php";
	var correctIcon = "&nbsp;<span class='yes'></span>{0}";
	var wrongIcon = "&nbsp;<span class='error'></span>{0}";
	var ttm, ttm1;
	var activePass = activePass2 = true;		//博名、地址
	var activePass3 = activePass4 = false;		//性别、生日（必填）
	var activePass5 = false; 				    //博客昵称（必填）
    var activePass6 = false                     //验证码
	
	DialogTemplate.alert = $SYSMSG["alert"];
	//输出省啊，市啊，日期啊。
	//birthDay.innerHTML = birthMon.innerHTML = birthYear.innerHTML = "<option value='0'>请选择</option>";
	var selectAppenderDesc = new scope.personal.SelectAppender(-1);
	var selectAppender = new scope.personal.SelectAppender();
	selectAppenderDesc.initialize(birthYear, 2011, 1908);
	selectAppender.initialize(birthMon, 1, 12);
	selectAppender.initialize(birthDay, 1, 31);
	scope.personal.selecter($E("selBirthdayYear"), $E("selBirthdayMonth"), $E("selBirthdayDay"));
	
	//博客名
	if(blogName){
		blogNameInput.onfocus = function(){
			addClass(blogName, "inputGreen");
			if(!hasClass(blogName, "inputRed")){
				blogNameErr.innerHTML = "";
			}
		};
		blogNameInput.onblur = function(){
			delClass(blogName, "inputGreen");
			checkBlogName();		//blur 就不用。因为没有输入。只是 IE 的刷新有点怪。
		};
		blogNameInput.onkeyup = function(){
			checkBlogName();
			activePass = false;		//按了就要置否，如果对，才清除。
		};
	}
	function checkBlogName(){
		clearTimeout(ttm);
		ttm = setTimeout(function(){
			var val = blogNameInput.value;
			if(/^(?:\s|[　])+|(?:\s|[　])+$/.test(val)){		//非字符键也响应赋值，光标会变。
				blogNameInput.value = Core.String.trim(val);	//trim
				val = blogNameInput.value;
			}
			if(val){
				var nameLen = Core.String.byteLength(val);
				if(nameLen > 24){
					addClass(blogName, "inputRed");
					addClass(blogNameErr, "red");
					blogNameErr.innerHTML = wrongIcon.format("博客名称超长");
				}else{
					delClass(blogName, "inputRed");
					delClass(blogNameErr, "red");
					blogNameErr.innerHTML = correctIcon.format("");
					activePass = true;
				}
			}else{
				//博客名称不能为空
				addClass(blogName, "inputRed");
				addClass(blogNameErr, "red");
				blogNameErr.innerHTML = wrongIcon.format("博客名称不能为空");
				// delClass(blogName, "inputRed");
				// blogNameErr.innerHTML = "";
				// activePass = true;
			}
		}, 500);
	}

	//博客昵称
	// if(blogNick) {
	// 	checkBlogNick();
	// 	blogNickInput.onfocus = function(){
	// 		addClass(blogNick, "inputGreen");
	// 		if(!hasClass(blogNick, "inputRed")){
	// 			blogNickErr.innerHTML = "";
	// 		}
	// 	};
	// 	blogNickInput.onblur = function(){
	// 		delClass(blogNick, "inputGreen");
	// 		checkBlogNick();
	// 	};
	// 	blogNickInput.onkeyup = function(){
	// 		checkBlogNick();
	// 	};
	// }
	// function checkBlogNick() {
		//4-20个字符  只能是中文,英文,数字
		// var nickname = blogNickInput.value,
		// 	temp = nickname.replace(/[\u4E00-\u9FA5]/g,""),
		// 	length;
		//是否有特殊字符
		// if(/[^A-Za-z0-9]/.test(temp)){
		// 	// showError(errEle,'昵称不能含有特殊字符',icon);
		// 	addClass(blogNick, "inputRed");
		// 	addClass(blogNickErr, "red");
		// 	blogNickErr.innerHTML = wrongIcon.format("昵称不能含有特殊字符");
		// 	activePass5 = false;
		// 	return;
		// }
		//长度是否符合规则
		// length = Core.String.byteLength(nickname);
		// if(length > 20){
		// 	// showError(errEle,'昵称不能多于10个汉字或20个字符',icon);
		// 	addClass(blogNick, "inputRed");
		// 	addClass(blogNickErr, "red");
		// 	blogNickErr.innerHTML = wrongIcon.format("昵称不能多于10个汉字或20个字符");
		// 	activePass5 = false;
		// 	return;
		// }
		// if(length < 4){
		// 	// showError(errEle,'昵称不能少于2个汉字或4个字符',icon);
		// 	addClass(blogNick, "inputRed");
		// 	addClass(blogNickErr, "red");
		// 	blogNickErr.innerHTML = wrongIcon.format("昵称不能少于2个汉字或4个字符");
		// 	activePass5 = false;
		// 	return;
		// }
		// // hiddenError(errEle,icon);
		// delClass(blogNick, "inputRed");
		// delClass(blogNickErr, "red");
		// blogNickErr.innerHTML = correctIcon.format("");
		// activePass5 = true;
	// }

	//个性域名
	if(userHost){
		userHostInput.onfocus = function(){
			addClass(userHost, "inputGreen");
			userHostTip.style.display = "";
		};
		userHostInput.onblur = function(){
			delClass(userHost, "inputGreen");
			checkUserHost();
		};
		userHostInput.onkeyup = function(){
			activePass2 = false;
			checkUserHost();
		};
	}
	function checkUserHost(){
		clearTimeout(ttm1);
		ttm1 = setTimeout(function(){
			var val = userHostInput.value;
			if(/^(?:\s|[　])+|(?:\s|[　])+$/.test(val)){
				userHostInput.value = Core.String.trim(val);
				val = userHostInput.value;
			}
			if(val){
				if(/\s|[　]/.test(val)){
					hostWrong("地址中不支持空格");		//一个全角一个半角。
				}else if(/[^\x00-\xff]/.test(val)){
					hostWrong("不支持中文或全角字符");
				}else if(val.length < 3){				//if(!(/^[^\r\n]{3,24}$/.test(val)))
					hostWrong("地址太短");
				}else if(val.length > 24){
					hostWrong("地址超长")
				}else if(val.match(/[0-9]+/) && (val.match(/[0-9]+/)[0].length == val.length)){
					hostWrong("地址不支持纯数字");
				}else if(/[A-Z]/.test(val)){
					hostWrong("地址不支持大写英文");
				}else{
					delClass(userHost, "inputRed");
					delClass(userHostErr, "red");
					userHostErr.innerHTML = "";
					
					(new Interface(validPhp, "jsload")).request({
						GET : {
							udomain : userHostInput.value,
							version : 7
						},
						onSuccess : function(res){
							userHostErr.innerHTML = correctIcon.format("可以使用");
							activePass2 = true;
						},
						onError : function(res){
							hostWrong($SYSMSG[res.code]);
						}
					});
				}
			}else{
				delClass(userHost, "inputRed");
				userHostErr.innerHTML = "";
				activePass2 = true;
			}
		}, 800);
	}
	function hostWrong(tipText){
		var tipTemp = wrongIcon.format(tipText);
		addClass(userHost, "inputRed");
		addClass(userHostErr, "red");
		userHostErr.innerHTML = tipTemp;
	}
	
	//详细填写
	detailBtn.onclick = function(){
		detailDiv.style.display = "none";
		detailField.style.display = "";
		isDetail = 1;
		new scope.personal.ProvinceAndCity(curProv, curCity, 0, 0);
		new scope.personal.ProvinceAndCity(homeProv, homeCity, 0, 0);
		return false;
	};
	
	birthYear.onchange = birthMon.onchange = birthDay.onchange = function(){
		dateErr.innerHTML = "";
		//alert(this[this.selectedIndex].value);
		if((birthYear.value > 0) && (birthMon.value > 0) && (birthDay.value > 0)){
			activePass3 = true;
		}else{
			activePass3 = false;
		}
	};
	
	Core.Array.foreach(userSex, function(elem, i){
		if($IE){
			elem.onclick = selectSex;
		}else{
			elem.onchange = selectSex;
		}
	});
	function selectSex(){
		activePass4 = true;
		sexErr.innerHTML = "";
		//console.log(activePass4);
	}
    //旧的验证码对错样式改变
    /*if(checkWord) {
        checkWord.onfocus = function(){
            addClass(checkWord, "inputGreen");
			if(!hasClass(checkWord, "inputRed")){
				checkWordErr.innerHTML = "";
			}   
        };
        
        checkWord.onblur = function(){
            delClass(blogName, "inputGreen");
            if(this.value.length > 0) {
                activePass6 = true;
            } else {
                activePass6 = false;
            }
        }*/

        /*codeImg.onclick = function(){
            this.src = 'http://interface.blog.sina.com.cn/riaapi/checkwd_image.php?t='+ +new Date();//重新加载验证码
        }*/

   // }

	//提交
	//1：pass1：nick
	//2：pass2：host
	//3：pass3：birth
	//4：pass4：sex
	activeBtn.onclick = function(){
		Core.Array.foreach(userSex, function(elem, i){		//点击提交才判断是否选中（刷新 radio 停留问题）
			if(elem.checked){
				activePass4 = true;
				return true;
			}
		});
					activePass6=checkManager.validate();
					if(!activePass6) {
						showError(checkManager.getErrorCode());
						return;
					}
		if(!activePass || !activePass2 || !activePass3 || !activePass4 ){
			winDialog.alert("您填写的信息有误，请根据页面红字更改。");
			if(!activePass4){
				sexErr.innerHTML = wrongIcon.format("请选择性别");
			}
			if(!activePass3){
				dateErr.innerHTML = wrongIcon.format("请填写完整生日（年、月、日）");
			}
		}else{


			//收集数据。
			var bName = scope.$blogName;
			var udomain = scope.$udomain;
			var sexParam = "", nosearch = 0;
			if(blogName){ bName = blogNameInput.value; }	//有 input 再 bName 取值。
			// if(blogNick){ bNick = blogNickInput.value; }	//博客昵称
			if(userHost){ udomain = userHostInput.value; }
			Core.Array.foreach(userSex, function(elem, i){
				if(elem.checked){ sexParam = elem.value; }
			});
			if(isPrivate.checked){ nosearch = isPrivate.value; }
			var getParam_m = {
				uid : scope.$uid,
				// uname : scope.$uname,
				// uname : bNick,
				loginname : scope.$loginname,
				blogname : bName,
				udomain : udomain,
				detail : isDetail,
				sex : sexParam,
				year : birthYear.value,
				month : birthMon.value,
				day : birthDay.value,
				marriage : marriage.value,
				job : career.value,
				place1 : curProv.value,
				place2 : curCity.value,
				hometown1 : homeProv.value,
				hometown2 : homeCity.value,
				nosearch : nosearch,

				src : scope.$src,
				srcuid : scope.$srcuid,
				check : scope.$check,
				version : 7,
			//验证码输入
                //checkword : checkWord.value
			};
			var  getParam=checkManager.getPostData(getParam_m);
			//请求。
			var activeReq = new Interface(nextPhp, "jsload");
			activeReq.request({
				GET : getParam,
				onSuccess : function(res){
                    debugger;
					//Utils.Cookie.setCookie("remberloginname", escape(scope.$loginname), 2400, "/", ".blog.sina.com.cn");
					window.location.href = jumpPhp + scope.$src + "&version=7";
				},
				onError : function(res){
					switch(res.code) {
						//博客名称有敏感词
						case 'A11008':
							addClass(blogName, "inputRed");
							addClass(blogNameErr, "red");
							blogNameErr.innerHTML = wrongIcon.format("输入内容有误，请修改");
							winDialog.alert("您填写的信息有误，请根据页面红字更改。");
							break;
						//博客昵称有敏感词
						// case 'A11009':
						// 	addClass(blogNick, "inputRed");
						// 	addClass(blogNickErr, "red");
						// 	blogNickErr.innerHTML = wrongIcon.format("输入内容有误，请修改");
						// 	winDialog.alert("您填写的信息有误，请根据页面红字更改。");
						// 	break;
						//博客名称和昵称都有敏感词
						case 'A11010':
							addClass(blogName, "inputRed");
							addClass(blogNameErr, "red");
							blogNameErr.innerHTML = wrongIcon.format("输入内容有误，请修改");
							// addClass(blogNick, "inputRed");
							// addClass(blogNickErr, "red");
							// blogNickErr.innerHTML = wrongIcon.format("输入内容有误，请修改");
							winDialog.alert("您填写的信息有误，请根据页面红字更改。");
							break;
                        case 'B36002': //验证码错误
                           /* addClass(checkWord,"inputRed");
                            addClass(checkWordErr,"red");*/
                            //checkWordErr.innerHTML = wrongIcon.format("验证码错误，请重新填");

                            winDialog.alert("验证码错误，请重新填");
                            break;
						default:
							winDialog.alert("系统繁忙，请稍后再试。");
							break;
						// default:
						// 	winDialog.alert("系统繁忙，请稍后再试。错误码：" + res.code);
						// 	break;
					}

					// winDialog.alert($SYSMSG[res.code], {
					// 	funcOk : function(){
					// 		if(res.code == "A00113"){
					// 			//Utils.Cookie.setCookie("remberloginname", escape(scope.$loginname), 2400, "/", ".blog.sina.com.cn");
					// 			window.location.href = "http://blog.sina.com.cn/u/"+scope.$uid;
					// 		}
					// 	}
					// });
				}
			});
		}
		return false;
	};
	
	if(blogName){
		blogNameInput.focus();
		if(scope.$uname === "") {
			blogNameInput.value = scope.$uname;
		}else {
			blogNameInput.value = scope.$uname+"的博客";
		}
		
	}
	// if(blogNick){
	// 	blogNickInput.value = scope.$uname;
	// }
	if(userHost){
		userHostInput.value = "";
	}
	//$T(userSex, "input")[0].checked = true;
	//studentStat.checked = workmanStat.checked = otherStat.checked = false;
	

	//className 相关操作。
	function addClass(dom, clz){		//有就不加了。class 唯一。
		if(!hasClass(dom, clz)){
			dom.className = Core.String.trim(dom.className.concat(" " + clz));
		}
	}
	function delClass(dom, clz){		//全删，再次保证 class 唯一。	//( +|^)clz(?=( |$))
		var reg = new RegExp("(?: +|^)" + clz + "(?=( |$))", "ig");
		dom.className = Core.String.trim(dom.className.replace(reg, ""));
	}
	function hasClass(dom, clz){
		if(!dom){ return false; }
		var reg = new RegExp("(?: +|^)" + clz + "(?=( |$))", "ig");
		return reg.test(dom.className);
	}

})();


