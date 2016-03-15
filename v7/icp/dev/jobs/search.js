/**
 * @author Random | YangHao@staff.sina.com.cn
 * 社区搜索
 */

$import("sina/sina.js");
$import("sina/utils/io/jsload.js");
$import("product/personal/autoComplete.js");
$import("sina/core/events/addEvent.js");

$registJob("search",function(){

	
	/*检测在线用户*/
	
	//更新用户在线状态
	function updateOnlineState(){
	Utils.Io.JsLoad.request("http://online.sso.sina.com.cn/status/MutiqueryVProduct.php", {
			GET : {
				"UIDS" : '[' + scope.$uid + ']',
				"Check" : scope.$key,
				"ProductType" : "1000",
				"Verbose" : "0",
				"noencode" : true
			},
			//接口传输正常，且状态码为A00006,(可选)
			onComplete : (function(result){
				if (result && result.Status) {
					var i, len = result.Status.length;
					var userImgs = $N("img","serachUsers");
					for (i = 0; i < len; i++) {
						userImgs[i].className = result.Status[i] ? "CP_i CP_i_on" : "CP_i CP_i_off";
					}
				}
			}).bind2(this),
			//接口传输异常,(可选)
			onException : (function(){
			}).bind2(this)
		});
	}
	
	window.setTimeout(updateOnlineState,1);
	
		
		
	/*自动完成功能*/
	//给php调用的自动完成的初始化函数
	window.search_autoComplete = function(){
		
		//如果没有指定的input框则返回
		if(!$E("scho") || !$E("pro") || !$E("comp")){
			return;
		}
		
		var iptSchool=$E("scho");
		var iptCollege=$E("pro");
		//"学校名称"的自动完成
		var acSchoolName = new scope.autoComplate(iptSchool,'http://icp.cws.api.sina.com.cn/profile/relate_school.php',{
			'class' : 'assn',
			'style' : 'width:193px;',
			'searchFun' : null,
			'complateFun' : function(inp,value,text){ inp.value = text; schoolName = text; classAuto.defalutAjaxData = {'schoolname' : schoolName}; },
			'lightOnFun' : null,
			'lightOffFun' : null,
			'searchNullText' : '未找到该学校，请检查输入是否正确',//，或<a href="javascript:;">申请添加学校</a>。',
			'searchEmptyText' : '请输入学校名称'
			});
			
		//"学院/专业"的自动完成
		var classAuto = new scope.autoComplate(iptCollege,'http://icp.cws.api.sina.com.cn/profile/relate_college.php',{
			'class' : 'assn',
			'style' : 'width:193px;',
			'searchFun' : null,
			'complateFun' : null,
			'lightOnFun' : null,
			'lightOffFun' : null,
			'searchNullText' : '没有搜索到学院名称',
			'searchEmptyText' : '请输入学院或专业全称'
		});
		
	
		//"公司名称"的自动完成
		var iptCompany=$E("comp");
		var acCompanyName = new scope.autoComplate(iptCompany, 'http://icp.cws.api.sina.com.cn/profile/relate_company.php', {
			'class': 'assn',
			'style': 'width:193px;',
			'searchFun': null,
			'complateFun': null,
			'lightOnFun': null,
			'lightOffFun': null,
			'searchNullText': null,
			'searchEmptyText': '请输入公司全称'
		});
		
		noValueInputDisplay(iptSchool,"学校名称");
		noValueInputDisplay(iptCollege,"学院/专业");
		noValueInputDisplay(iptCompany,"公司名称");
		
		
		//当input输入框的值为空时显示默认值
		function noValueInputDisplay(oInput,text){
			Core.Events.addEvent(oInput, function(){
				if (oInput.value == text) {
					oInput.value = "";
				}
				oInput.style.color = "#333333";
			}, "focus");
			Core.Events.addEvent(oInput, function(){
				if (oInput.value == "") {
					oInput.value = text;
					oInput.style.color = "#999999";
				}
				else {
					oInput.style.color = "#333333";
				}
			}, "blur");
		}
		
	};
	
	
	/*用户等级与积分*/
	var i,len=scope.$uid.length;
	for(i=0;i<len;i++){
		setPvNum(scope.$uid[i],i);
	}
	function setPvNum(uid,idx){
		var refer = document.referrer == '0' ? '' : encodeURIComponent(document.referrer);
		// 请求博主的访问数，每请求一次该接口，自动加一
		var pvurl = "http://comet.blog.sina.com.cn/api?maintype=hits&act=3&uid=" + getUidHex(uid) + '&ref=' + refer;
		setTimeout(function(){
			Utils.Io.JsLoad.request(pvurl, {
				onComplete : function(data){
					$SetPV(data.pv,idx);
				},
				onException : function () {
					$SetPV(0);
				}
				});
		},1);

		setTimeout(function(){
			Utils.Io.JsLoad.request("http://blogcnfv5.sinajs.cn/blogscr?uid=" + uid + "&varname=blogScore"+idx+"&.js", {
				onComplete: function(){
					// 计算积分
					eval("var _a = blogScore"+idx+".coefficient.a");
					eval("var _b = blogScore"+idx+".coefficient.b");
					eval("var _c = blogScore"+idx+".coefficient.c");
					eval("var _d = blogScore"+idx+".coefficient.d");
					eval("var _x1 = blogScore"+idx+".x");
					eval("var _y1 = blogScore"+idx+".y");
					eval("var _z1 = blogScore"+idx+".z");
					eval("var _w1 = blogScore"+idx+".w");
					var _score = _x1 * _a + _y1 * _b + _z1 * _c + _w1 * _d;
					
					$N("span","blogInfoScore")[idx].innerHTML = _score;
				},
				noreturn: true
			});
		},1);
	}
	
	/**
	 * 从 http://comet.blog.sina.com.cn/api?maintype=hits 返回的 SetPV 方法的定义
	 * @author L.Ming | liming1@staff.sina.com.cn
	 * @since 2008.02.04
	 */
	$SetPV = function(o,idx){
		o = parseInt(o);
		var grade;
		var score = [0, 50, 100, 150, 200, 300, 500, 800, 1500, 3000, 5000, 10000, 15000, 25000, 40000, 70000, 100000, 150000, 200000, 500000, 1000000, 2000000, 5000000, 10000000, 20000000, 50000000, 100000000, 150000000, 200000000, 250000000, 300000000, 350000000, 400000000, 450000000, 500000000 ,550000000];
		for(var i = 0; i <= score.length; i ++){
			if(o >= score[i] && o < score[i + 1]){
				grade = i.toString().replace(/(\d)/g, function ($0, $1){return  $1});
				continue;
			}
		}
		$N("span","blogInfoGrade")[idx].innerHTML = grade;
	};
	
	//16进制的UID
	function getUidHex(uid) {
		var uidhex = (uid * 1).toString(16);
       	uidhex.length < 8 ? uidhex = (("00000000" + uidhex).substr(uidhex.length, 8)) : uidhex; 
		return uidhex;
	}
	
	//IE下的getElementsByName有问题，自定义实现一个
	function $N(tag,eltname){
	  var elts=document.getElementsByTagName(tag);
	  var count=0;
	  var elements=[];
	  for(var i=0;i<elts.length;i++){
	     if(elts[i].getAttribute("name")==eltname){
	        elements[count++]=elts[i];
	     }
	  }
	  return elements;
	} 
	
		
});
