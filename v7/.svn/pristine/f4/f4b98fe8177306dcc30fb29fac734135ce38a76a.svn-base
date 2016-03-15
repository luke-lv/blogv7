/**
 * @fileoverview 修改博客地址页(登录状态)
 * @author chengwei1@staff.sina.com.cn
 * @created 2010-01-12
 */
$import("sina/sina.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/string/trim.js");
$import("sina/core/system/getParam.js");
$import("sina/core/string/format.js");

$import("lib/jobs.js");
$import("lib/interface.js");
$import("lib/dialogConfig.js");
$import("lib/showError.js");
$import("msg/regmsg.js");

$registJob("modifyHost", function(){
	var saveBtn = $E("saveBtn");
	var cancelBtn = $E("cancelBtn");
	var userHostInput = $E("userHostInput");
	var userHostErr = $E("userHostErr");
	
	var callPhp = "http://control.blog.sina.com.cn/riaapi/reg/register_uhost_post.php";
	var validPhp = "http://control.blog.sina.com.cn/riaapi/reg/check_domain_exist.php";
	//var correctIcon = "<span style='color:red'></span>{0}";
	var wrongIcon = "<span style='padding-left:20px;'></span>{0}";
	var ttm, activePass2 = false;
	var isChecking = false;
	
	var checkCfg = {};
	
	//个性域名
	if(userHostInput){
		userHostInput.value = "";
		userHostInput.onmouseup = function(){ return false; }
		userHostInput.onfocus = function(){
			this.select();
		}
		userHostInput.onkeyup = beforeCheck;
		cancelBtn.onclick = function(){
			userHostInput.value = "";
			userHostInput.focus();
			hostWrong("");
			return false;
		};
		saveBtn.onclick = function(){
			if(isChecking){			//在验证中的话			//验证接口死掉怎么办？一直请稍候。
				hostWrong("请稍候…");
				(function(){
					if(!isChecking){
						submitHost();
					}else{
						setTimeout(arguments.callee, 100);		//真 interval;
					}
				})();
			}else{
				submitHost();
			}
			return false;
		};
	}
	function beforeCheck(){
		clearTimeout(ttm);
		activePass2 = false;
		var val = userHostInput.value;
		val = trim(val);					//除空要单独。
		if(val){
			immCheck(val);
		}else{
			hostWrong("博客个性地址不能为空。");
			activePass2 = false;			//空了就不让过。状态配对，不怕多赋值。安全稳定先。
		}
	}
	function submitHost(){
		if(activePass2){
			(new Interface(callPhp, "jsload")).request({
				GET : {
					//varname : "testReq",		//fakeUrl
					productid : "0x00000001",
					uid : scope.$uid,
					uhost : userHostInput.value,
					version : 7
				},
				onSuccess : function(res){
					winDialog.alert("博客地址已更新成功",{
						icon : "03",
						funcOk : function(){
							window.location.reload();
						}
					});
				},
				onError : function(res){
					hostWrong($SYSMSG[res.code]);
				}
			});
		}else{
			if(!userHostInput.value){
				hostWrong("博客个性地址不能为空。");
			}else{
				winDialog.alert("您填写的信息有误，请根据页面红字更改。");
			}
		}
	}
	function trim(val){
		if(/^(?:\s|[　])+|(?:\s|[　])+$/.test(val)){
			var tempVal = Core.String.trim(val);
			userHostInput.value = tempVal;
			hostWrong("地址中不支持空格");		//如果没有其他错误共存，才会提示这个错误。
			return tempVal;
		}else{
			return val;
		}
	}
	//1			立即提示的输入。
	function immCheck(val){
		//空格、中文全角、大写、超长。
		if(/\s|[　]/.test(val)){
			hostWrong("地址中不支持空格");		//一个全角一个半角。这个是中间加两旁，trim 是两旁。
		}else if(/[^\x00-\xff]/.test(val)){
			hostWrong("不支持中文或全角字符");
		}else if(val.length > 24){
			hostWrong("地址超长");
		}else if(/[A-Z]/.test(val)){
			hostWrong("地址不支持大写英文");
		}else{
			delayCheck(val);					//继续测试。必须原值。才有继续测试的必要。
		}
	}
	//2			稍候验证的输入。
	function delayCheck(val){
		//过短、全数。
		//clearTimeout(ttm);				//不会直接进来的函数，不 clearTimeout。
		isChecking = true;					//延时开始的标记。
		ttm = setTimeout(function(){		
			if(val.length < 3){				//if(!(/^[^\r\n]{3,24}$/.test(val)))
				hostWrong("地址太短");
			}else if(val.match(/[0-9]+/) && (val.match(/[0-9]+/)[0].length == val.length)){
				hostWrong("地址不支持纯数字");
			}else{
				phpCheck(val);
			}
		}, 700);
	}
	//3			本地无法验证的输入，尽量最后。减少提交次数。
	function phpCheck(val){
		//已占用、非法词汇。
		(new Interface(validPhp, "jsload")).request({
			GET : {
				udomain : val,
				version : 7
			},
			onSuccess : function(res){
				activePass2 = true;					//逻辑上允许save了。
				hostWrong("");
				isChecking = false;					//本地+php检测完毕。时间上允许 save 了。
			},
			onError : function(res){
				hostWrong($SYSMSG[res.code]);
				isChecking = false;					//这儿必须置否，因为时间判定在逻辑判定之前。
			}										//接口不反应不考虑。
		});
	}
	function hostWrong(tipText){
		var tipTemp = wrongIcon.format(tipText);
		userHostErr.innerHTML = tipTemp;
	}

});
