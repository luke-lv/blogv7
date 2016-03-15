/**
 * 登录页面处理
 * @author wangqiang
 * @date 14-9-11
 */
var login = angular.module('login', [], ['$httpProvider', httpProviderConfig]);

login.controller('LoginCtrl', ['$http', function ($http) {

	var ctrl = this;

	ctrl.isError = false;
	ctrl.username = '';
	ctrl.password = '';
	ctrl.state = '';
	ctrl.isSubmit = !1;

	ctrl.login = function () {
		ctrl.isSubmit = !0;
		$http.post('/api/login', {
			username: ctrl.username,
			password: ctrl.password,
			state: ctrl.state
		}).success(function (result) {
			ctrl.isSubmit = !1;
			// console.log(result);
			if ('A00006' === result.code) {
				location.href = getURL(result.data.url);
			} else {
				ctrl.isError = true;
			}
		}).error(function (data) {
			ctrl.isSubmit = !1;
			ctrl.isError = true;
		});
	}

	function getURL(url) {
		if (0 !== url.indexOf('http://')) {
			if (0 !== url.indexOf('/')) {
				url = '/' + url;
			}
			url = location.protocol + '//' + location.host + url;

		}
		return url;
	}

}]);