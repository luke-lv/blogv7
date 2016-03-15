/**
 * @fileoverview 博主分成项目活动
 * @author Edwin | zhihang1@staff.sina.com.cn
 * @created 2014-10-20
 */
$import("sina/sina.js");
$import("lib/interface.js");
$import("lib/login/ui.js");

$registJob('adapply', function () {
	var nodes = {
		applyBtn : $E('apply_now_btn'),
		part1 : $E('part1'),
		part2 : $E('part2'),
		text : $E('text_content'),
		confirmBtn : $E('confirm_btn')
	};
	var iApply = new Interface('http://control.blog.sina.com.cn/profit/add_profit.php', 'ijax');
	var trayLogin = new Lib.Login.Ui();

	var applyFn = function(){
		v7sendLog("15_01_01_" + $UID);
		if(!$isLogin){   // 未登录弹出登录浮层
			trayLogin.login(function(){
                //登录统计,01非博主页面登录,02博主页面登录
                Lib.checkAuthor();
                var str= $UID==scope.$uid ? "02" : "01";
                v7sendLog("87_01_"+str+"_"+$UID,scope.$pageid);
                // setTimeout(function(){
                //     window.location = window.location.toString().replace(/#.*/, "");
                // }, 100);
                iApply.request({
					onSuccess : function (result) {
						// nodes.text.innerHTML = '<p>您的申请已提交，请耐心等待审核结果！</p>';
						// nodes.confirmBtn.innerHTML = '返回首页';
						// nodes.part1.style.display = 'none';
						// nodes.part2.style.display = '';
						setTimeout(function(){
						    window.location = window.location.toString().replace(/#.*/, "");
						}, 100);
					},
					onError : function (result) {
						if(result.code == 'A00002'){
							nodes.text.innerHTML = '<p>抱歉！</p><p>您本月的<span>原创文章</span>数量不够无法成功申请加入</p>';
							nodes.confirmBtn.innerHTML = '发表文章';
							nodes.part1.style.display = 'none';
							nodes.part2.style.display = '';
						}else if(result.code == 'A00003'){
							nodes.text.innerHTML = '<p>抱歉！</p><p>您的<span>文章阅读数量</span>未达到条件，无法成功加入</p>';
							nodes.confirmBtn.innerHTML = '返回首页';
							nodes.part1.style.display = 'none';
							nodes.part2.style.display = '';
						}
					}
				});
                
            },false,"referer:"+location.hostname+location.pathname+",func:0007");   //添加统计点，托盘，0007
		} else {
			iApply.request({
				onSuccess : function (result) {
					setTimeout(function(){
					    window.location = window.location.toString().replace(/#.*/, "");
					}, 100);
				},
				onError : function (result) {
					if(result.code == 'A00002'){
						nodes.text.innerHTML = '<p>抱歉！</p><p>您本月的<span>原创文章</span>数量不够无法成功申请加入</p>';
						nodes.confirmBtn.innerHTML = '发表文章';
						nodes.part1.style.display = 'none';
						nodes.part2.style.display = '';
					}else if(result.code == 'A00003'){
						nodes.text.innerHTML = '<p>抱歉！</p><p>您的<span>文章阅读数量</span>未达到条件，无法成功加入</p>';
						nodes.confirmBtn.innerHTML = '返回首页';
						nodes.part1.style.display = 'none';
						nodes.part2.style.display = '';
					}
				}
			});
			
		}
	} 

	var confirmFn = function(){
		var str = nodes.confirmBtn.innerHTML;
		switch (str) {
			case '发表文章' : 
				v7sendLog("15_01_02_" + $UID);
				window.open('http://control.blog.sina.com.cn/admin/article/article_add.php');
				break;
			case '返回首页' : 
				v7sendLog("15_01_03_" + $UID);
				window.location.href = 'http://blog.sina.com.cn';
				break;
			case '查看收益' :
				v7sendLog("15_01_04_" + $UID);
				window.open('http://control.blog.sina.com.cn/blogprofile/profileprofit.php');
				break;
		}
	}

	Core.Events.addEvent(nodes.applyBtn, applyFn, 'click');
	Core.Events.addEvent(nodes.confirmBtn, confirmFn, 'click');
});