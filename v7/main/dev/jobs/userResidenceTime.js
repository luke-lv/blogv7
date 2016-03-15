/**
 * @fileoverview userResidenceTime 统计用户在线时长 只在博文页统计
 * @author fuqiang3 | fuqiang3@staff.sina.com.cn
 * @created 2014-04-15
 */
$import("lib/sendLog.js");

$registJob("userResidenceTime", function() {
	function random3m(len, prefix) {
		var lists = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
		ret = [],
		total = lists.length;
		if (prefix) lists = lists.concat(prefix);
		for (var i = 0; i < len; i++) {
			ret.push(lists[Math.floor(Math.random() * total)]);
		}
		return ret.join('');
	}
	//生成一个以时间戳抽取机制为底数的随机唯一值
	function getClientUUid() {
		var t = new Date().valueOf();
		return random3m(15, t.toString().slice( - 5).split(''));
	}

	var uuid = getClientUUid();

	function startTest() {
		v7sendLog('24_01_01_'+scope.$pageid+'_'+uuid, null, null);
		setInterval(function() {
			v7sendLog('24_01_01_'+scope.$pageid+'_'+uuid, null, null);
		},
		3000);
	}
	//30% 随机抽取。。前端出一个百分比。。中了就发log。。。
	Math.floor(Math.random() * 100) < 1 && startTest();
});

