/**
 * 打包信息处理
 * @author wangqiang
 * @date 14-10-15
 */
jspack.controller('GetPackInfoCtrl', ['$http', '$scope', 'channel', function ($http, $scope, channel) {
	var ctrl = this;

	ctrl.isWaiting = true;

	ctrl.message = "";
	///api/getPackInfo
	var socket = new WebSocket('ws://' + location.host + '/echo');

	socket.onmessage = function (event) {
		$scope.$apply(function () {
			var evtData = JSON.parse(event.data);
			if ("A00006" !== evtData.code) {
				ctrl.message += evtData.message;

			} else {
				var msgArr = evtData.data, msg;
				msgArr.map(function (item) {
					msg = item.data;
					if (msg && '.' !== msg && (msg.length - 1) > msg.indexOf('\n')) {
						msg += '\n';
					}
					ctrl.message += msg;

				});
			}
			setTimeout(function(){
				resetScroll();
			}, 10);

		});


	};

	socket.onclose = function (event) {
		console.log('通讯结束');
		$('#compress-title').html('打包完成！');
	};

	socket.onopen = function () {
		$scope.$apply(function () {
			socket.send(channel.id);
			console.log('channel.id ', channel.id);
			ctrl.isWaiting = false;
		});

	};

	var isStop = false;
	var showArea = document.getElementById('packing-info');

	function resetScroll(){
		if (!isStop) {
			showArea.scrollTop = (showArea.scrollHeight - showArea.offsetHeight);
		}
	}
	;(function(){
		showArea.mouseover = function(){
			isStop = true;
		};
		showArea.mouseout = function(){
			isStop = false;
		};
	})();

//	socket.send('begin');

}]);