/**
 * @fileoverview 计时牌
 * @author Luo Rui | luorui1@staff.sina.com.cn
 * @created 2010-4-16
 */

$import('sina/sina.js');
$import('lib/checkAuthor.js');
$import('lib/getTplNum.js');

$registJob('timePad', function(){

	Lib.checkAuthor();
	if ($isAdmin){ //如果是博主直接渲染，scope.tpl是可靠的。
		renderTimePad();
	}else{ //否则先获得可靠的scope.tpl再渲染
		Lib.getTplNum(renderTimePad);
	}
	
	function renderTimePad(){
		var timeNode = $E('auto_time');
		var time2Node = $E('auto_time2');
		if (timeNode && time2Node){
			var dNode = $T(timeNode, 'span')[0];
			var hNode = $T(timeNode, 'span')[1];
			var d2Node = $T(time2Node, 'span')[0];
			var h2Node = $T(time2Node, 'span')[1];
			var timer;
			var timePoint = $_GLOBAL.timePad_conf[scope.tpl] ? $_GLOBAL.timePad_conf[scope.tpl].timePoint : '';
			var pageSet = scope.$pageid == 'pageSetM' ? true : false;
			
			//如果没有对应的配置，不作处理。
			if (!timePoint && !pageSet){
				return;
			}

			/**
			 * 刷新时间面板
			 */
			function refreshTime(){
				if (pageSet){ //如果是页面设置，显示？？
					dNode.innerHTML = hNode.innerHTML = d2Node.innerHTML = h2Node.innerHTML = '？';
					return;
				}
				var des = getDes();
				if (des >= 0) {
					var dayNum = getDay(des);
					var hourNum = getHour(des - getDay(des) * 3600000 * 24);
					dNode.innerHTML = dayNum > 9 ? dayNum : '0' + dayNum;
					hNode.innerHTML = hourNum > 9 ? hourNum : '0' + hourNum;
				}else{
					var dayNum = getDay(-des);
					var hourNum = getHour(-des - getDay(-des) * 3600000 * 24);
					d2Node.innerHTML = dayNum > 9 ? dayNum : '0' + dayNum;
					h2Node.innerHTML = hourNum > 9 ? hourNum : '0' + hourNum;
				}
			}
			
			/**
			 * 得到天数
			 */
			function getDay(des){
				return Math.floor(des / 3600 / 24 / 1000);
			}

			/**
			 * 得到小时数
			 */
			function getHour(des){
				return Math.floor(des / 3600 / 1000);
			}
			
			/**
			 * 得到时间差,单位毫秒
			 */
			function getDes(){
				return new Date(timePoint) - new Date();
			}

			/**
			 * 定时刷新计时牌
			 */
			function startAutoTime(){
				refreshTime();
				clearInterval(timer);
				timer = setInterval(function(){refreshTime()}, 60 * 1000);
			}

			//选择正确的计时牌
			if (getDes() < 0) {
				timeNode.style.display = 'none';
				time2Node.style.display = 'block';
			}else{
				timeNode.style.display = '';
				time2Node.style.display = 'none';
			}
			
			//提供的公共方法
			scope.$startAutoTime = startAutoTime;
			scope.$stopAutoTime = function(){clearInterval(timer)};

			//计时牌开始
			scope.$startAutoTime();
		}
	}

});