/**
 * @fileoverview 21010广州亚运会投票
 * @author meichun1@staff.sina.com.cn
 * @created 2010-10-26
 */

$import("sina/core/events/stopEvent.js");

$registJob('gz2010', function() {
		if (!$E('ag_vote_mod')) {
				return;
		}

		$SYSMSG.A55001 = "您今天已经投过票了";

		var $S = Core.Dom.byClz,
		foreach = Core.Array.foreach,
		uid = scope.$uid,
		today = ($S($E('module_973'), 'p', 'day')[0] || {}).innerHTML;

		//更换内容的容器
		dateBody = $E('ag_vote_mod').parentNode,
		dataU = new Interface("http://i.blog.sina.com.cn/riaapi/profile/ag_vote_interface.php", "jsload");

		//投票数据呈现
		function initVote() {
				try {
						var vDiv = $E('ag_vote_mod'),

						//每一组li
						vLi = $T($E('ag_vote_list') || $E('ag_vote_mod'), 'li'),

						//每一条的百分比值
						vNumArr = [],

						//每一组em
						vEm = [];

						foreach(vLi, function(li) {
								var node = $S(li, 'div', 'num')[0];
								var num = +node.innerHTML;
								vNumArr.push(num);

								vEm.push($T(li, 'em')[0]);

								//显示百分比
								//setTimeout(function(){node.innerHTML=num+"("+Math.round(100*num/allNum)+"%)";},100);
						});

						//总投票数        测试数据 有可能单项投票人数 比总人数还多 防止超过100%
						var allNum = Math.max.apply(null, vNumArr.concat( + $E('ag_vote_btn').getAttribute('num'))) || 1;

						//每一类型的比值
						foreach(vNumArr, function(n, i) {
								vNumArr[i] /= allNum / 100;
						});

						//百分比条 动态显示
						foreach(vEm, function(em, i) {
								setTimeout(function fn() {
										if (parseInt(em.style.width) < vNumArr[i]) {
												em.style.width = parseInt(em.style.width, 10) + 2 + "%";
												setTimeout(fn, 8);
										} else {
												em.style.width = vNumArr[i] + "%";
										}
								},
								8);
						});

				} catch(e) {}

				/*提交数据*/
				$E('ag_vote_btn').onclick = function() {

						//防止IE6下请求被中断
						Core.Events.stopEvent();

						Lib.checkAuthor();
						if (!$isAdmin) {
								new Lib.Login.Ui().login(function() {
										location.reload();
								});
								return;
						}

						if (this.className.indexOf('bg_icon05') == -1) {
								return false;
						}

						var dateDiv = $S(document, 'div', 'asian_data')[0],
						dateM = $S(dateDiv, 'p', 'months')[0].getAttribute('mon'),
						dateD = $S(dateDiv, 'p', 'day')[0].innerHTML,
						date = "2010" + dateM + dateD;

						var data = [];
						foreach($T($E("ag_vote_list") || $E("ag_vote_mod"), 'input'), function(input) {
								if (input.checked) {
										data.push(input.value);
								}
						});

						if (data == "") {
								winDialog.alert("您还没有选择任何项目");
								return false;
						}

						dataU.request({
								GET: {
										uid: uid,
										date: date,
										type: "add",
										vote: data + ""
								},
								onSuccess: function(res) {

										dateBody.innerHTML = res;
										setTimeout(initVote, 50);
										setTimeout(getVote, 100);

								},
								onError: function(res) {
										winDialog.alert($SYSMSG[res.code]);
								}
						});

				};

		}

		//点击左右箭头刷新dateBody.innerHTML。
		function getVote() {
				foreach([$E('ag_vote_left'), $E('ag_vote_right')], function(btn, i) {
						btn.onclick = function() {
								Core.Events.stopEvent();
								var dateDiv = $S(document, 'div', 'asian_data')[0],
								dateM = $S(dateDiv, 'p', 'months')[0].getAttribute('mon'),
								dateD = $S(dateDiv, 'p', 'day')[0].innerHTML;				

								//2010年广州亚运会第16届亚运会:2010年11月12日至27日
								if (dateD == (i ? today: '09')) {
										return false;
								}

								dateD = +dateD + (i ? 1 : -1);
								dateD = ("0" + dateD).slice( - 2);

								dataU.request({
										GET: {
												uid: uid,
												date: "2010" + dateM + dateD,
												type: "see"
										},
										onSuccess: function(res) {
												dateBody.innerHTML = res;
												setTimeout(initVote, 50);
												setTimeout(getVote, 100);

										},
										onError: function(res) {
												winDialog.alert($SYSMSG[res.code]);
										}
								});
						};
				});
		}

		initVote();
		getVote();

});