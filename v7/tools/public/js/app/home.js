/**
 * home页处理
 *
 */
var jspack = angular.module('jspack', ['ngRoute'], ['$httpProvider', httpProviderConfig]);

jspack.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
	$routeProvider.when('/', {
		templateUrl: '/tmpl/home'
	}).when('/compress', {
		templateUrl: '/tmpl/compress'
	}).when('/userlist', {
		templateUrl: '/template/userList',
		controller: 'UserListCtrl'
	}).when('/logs', {
		templateUrl: '/template/logs',
		controller: 'LogsCtrl'
	}).otherwise({redirectTo: '/'});

	// configure html5 to get links working on jsfiddle
	$locationProvider.html5Mode(true);
}]);

jspack.factory('PackInfo', function () {
	return {
		productId: '',
		svnUrl: '',
		svnAccount: '',
		svnPwd: '',
		mode: '',
		machineIp: '',
		user: ''
	};
}).factory('localeStorage', function () {
	var ls = window.localStorage;
	return {
		getItem: function (key) {
			return ls.getItem(key);
		},
		setItem: function (key, val) {
			try {
				ls.setItem(key, val);
				return true;
			} catch (e) {
				return false;
			}
		}
	};
}).factory('channel', function () {
	return {
		id: ''
	};
}).factory('API', function(){
	return {
		loadUsers: '/api/loadUsers',
		loadLogs: '/api/loadLogs',
		saveUser: '/api/saveUser'
	};
});

jspack.directive('svnUrl', function () {
	return {
		require: 'ngModel',
		link: function (scope, elm, attrs, ctrl) {
			
		}
	};
}).directive('alert', function () {
	return {
		restrict: 'EA',
		controller: 'AlertController',
		templateUrl: '/tmpl/alert',
		transclude: true,
		replace: true,
		scope: {
			type: '@',
			close: '&'
		}
	};
}).directive('dismissOnTimeout', ['$timeout', function ($timeout) {
	return {
		require: 'alert',
		link: function (scope, element, attrs, alertCtrl) {
			$timeout(function () {
				alertCtrl.close();
			}, parseInt(attrs.dismissOnTimeout, 10));
		}
	};
}]).directive('latestPackList', ['localeStorage', function (localeStorage) {
	return {
		restrict: 'EA',
		template: [
			'<ul ng-show="packList.length">', '<li ng-repeat="path in packList track by $index">',
			'<input ng-mouseover="moveToEnd($event.target)" ng-click="setSvnUrl($event.target, packList[$index])" readonly="readonly" type="text" class="field text enlarge-history-width cursor-pointer" ng-model="packList[$index].shortUrl">',
			'<button class="btn" ng-click="deleteHistory($index)">删除</button>',
			'</li>', '</ul>'
		].join(''),
		controller: function ($scope) {
			var listStr = localeStorage.getItem('lastestPackList');
			var packList = JSON.parse(listStr || '[]');
			for (var i=0; i<packList.length; i++) {
				var item = packList[i];
				if (!item.shortUrl) {
					item.shortUrl = item.url;
				}
			}
			$scope.packList = packList;
			$scope.deleteHistory = function(i){
				packList.splice(i, 1);
			};

			$scope.moveToEnd = function(el){
				el.scrollLeft = el.scrollWidth;
			};
		},
		link: function (scope, element, attrs, ctrl) {
//            scope.packList = scope.packList || [];
		}
	};
}]).controller('AlertController', ['$scope', '$attrs', function ($scope, $attrs) {
	$scope.closeable = 'close' in $attrs;
	this.close = $scope.close;
}]).controller('AlertCtrl', ['$scope', function () {

}]).controller('PackInfoCtrl', ['$scope', '$http', 'PackInfo', '$timeout', '$location', 'localeStorage', 'channel',
	function ($scope, $http, PackInfo, $timeout, $location, localeStorage, channel) {
		var ctrl = this;

		ctrl.isSubmit = false;

		ctrl.packInfo = PackInfo;

		ctrl.send = function () {
			var products = PackInfo.productId.split(':');
			var productName = products[0], productType = products[1];
			if (-1 == PackInfo.svnUrl.indexOf('/'+productName+'/')) {
				alert('工程与svn路径不匹配');
				return;
			}
			// 是否提交svn选项
			var isPackOnline = PackInfo.isPackOnline ? '1' : '0';
			ctrl.isSubmit = !0;

			$http.post('/api/sendPackMsg', {
				productName: productName,
				productType: productType,
				svnUrl: PackInfo.svnUrl,
				svnAccount: PackInfo.svnAccount,
				svnPwd: PackInfo.svnPwd,
				isPackOnline: isPackOnline,
				mode: PackInfo.mode,
				machineIp: PackInfo.machineIp
			}).success(function (result) {
				ctrl.isSubmit = !1;
				if ('A00006' === result.code) {
					channel.id = result.data.channel;
					$timeout(function () {
						$location.path('/compress');
					}, 500);
					var list = $scope.packList, index = -1;
					list.forEach(function (item, i) {
						if (PackInfo.svnUrl == item.url) {
							index = i;
							return false;
						}
					});
					if (-1 < (index)) {
						list.splice(index, 1);
					} else if (list.length >= 8) {
						list.pop();
					}
					list.unshift({
						id: PackInfo.productId,
						url: PackInfo.svnUrl,
						shortUrl: PackInfo.svnUrl.replace('https://svn.intra.sina.com.cn/icplatform/tech/ria/','')
					});
					localeStorage.setItem('lastestPackList', JSON.stringify(list));

				} else {
					alert(result.message);
				}
			}).error(function (req) {
				ctrl.isSubmit = !1;
				alert('提交失败');
			}).catch(function () {
				console.log('最后');
			});
		};

		$scope.setSvnUrl = function (input, info) {
			ctrl.packInfo.svnUrl = info.url;
			ctrl.packInfo.productId = info.id;
			setTimeout(function(){
				// 将文本显示最后到
				var svnInput = angular.element('input[placeholder="SVN路径"]')[0];
				if (svnInput) {
					svnInput.scrollLeft = svnInput.scrollWidth;
				}
			}, 50);
		};

		// 切换工程，自动填写svn路径
		$scope.changeProduct = function() {
			var curProduct = angular.element('select[ng-model="packInfoCtrl.packInfo.productId"]')[0].value.split(':')[0];
			var svnBase = 'http://svn.intra.sina.com.cn/blog/trunk/ria/pc/v7/';
			var svnUrl = '';

			switch(curProduct) {
				case 'main':
					svnUrl = svnBase + 'main/dev';
					break;
				case 'icp':
					svnUrl = svnBase + 'icp/dev';
					break;
				case 'photo':
					svnUrl = svnBase + 'photo/dev';
					break;
				case 'activity':
					svnUrl = svnBase + 'activity/dev';
					break;
				case 'style':
					svnUrl = svnBase + 'style/dev';
					break;
				default:
					svnUrl = '';
					break;
			}
			ctrl.packInfo.svnUrl = svnUrl;
		};

}]).controller('UserListCtrl', ['$scope', '$http', 'API', '$window', function ($scope, $http, api, $window) {
	var users = [];

	var loadUser = function(){
		$http({
			method: 'GET',
			url: api.loadUsers,
			param: {}
		}).success(function(result){
			users= result.data;
			$scope.users = angular.copy(users);
		}).error(function(){

		});
	};

	var addUser = function(){
		var users = $scope.users;
		users.push({dirty:2});
	};

	var modifyUser = function(user){
		user.dirty = 1;
	};

	var saveUser = function(user){
		if (2 == user.dirty && !$window.confirm('确定要添加用户 '+user.name+' 吗？')) {
			return;
		} else if (1 == user.dirty && !$window.confirm('确定要修改用户 ' + user.name + ' 吗？')) {
			return;
		}
		$http.post(api.saveUser, user).success(function(result){
			user.dirty = 0;
		}).error(function(){

		});
	};

	var cancel = function(user){
		var users = $scope.users, tmpUser;
		if (2 == user.dirty) {
			for (var i = 0, len = users.length; i < len; i++) {
				tmpUser = users[i];
				if (user == tmpUser) {
					users.splice(i, 1);
				}
			}
		} else {
			user.dirty = 0;
		}
	};

	var deleteUser = function(user){

	};

	$scope.addUser = addUser;
	$scope.deleteUser = deleteUser;
	$scope.modifyUser = modifyUser;
	$scope.saveUser = saveUser;
	$scope.cancel = cancel;
	$scope.refresh = loadUser;
	$scope.users = [];
	loadUser();

}]).controller('LogsCtrl', ['$scope', '$http', 'API', function ($scope, $http, api) {
	$scope.logs = [];
	$http({
		method: 'GET',
		url: api.loadLogs,
		param: {}
	}).success(function(result){
		$scope.logs = result.data;
	}).error(function(){

	});
}]);