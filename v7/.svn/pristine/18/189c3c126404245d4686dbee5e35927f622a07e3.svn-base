/**
 * 用户相关操作
 * @author wangqiang
 * @date 14-10-13
 */
var fs = require('fs');
var errorLogger = require('log4js').getLogger('error')
var userConfDif = require('../config').userConfDir;

function strToObj(str) {
	return (new Function('return ' + str))();
}

function loadUsers(){
	var data = fs.readFileSync(userConfDif, 'utf-8');
	var users = [];
	try {
		users = strToObj(data);
	} catch (e) {
		errorLogger.error('User data cannot parse to object!', e.stack);
	}
	return users;
}

function checkUser(userName, psw, users, validPsw) {
//	console.log(__dirname);
	var user, isValidate = false;

	users = users || loadUsers();

	for (var i = 0, len = users.length; i < len; i++) {
		user = users[i];
		if (userName === user.name && (!validPsw || psw === user.psw)) {
			isValidate = true;
			break;
		}
	}
	return isValidate;
};

/**
 * 添加用户
 * @param username
 * @param psw
 */
function addUser(username, psw, ip, users) {

	users = users || loadUsers();

	if (checkUser(username, psw, users, false)) {
		return modifyUser(username, psw, ip);
	} else {
		users.push({
			name: username,
			psw: psw,
			ip: ip
		});
		var str = JSON.stringify(users);
		try{
			fs.writeFileSync(userConfDif, str, {encoding:"utf-8"});
			return true;
		} catch (e) {
			return false;
		}
	}

};

/**
 * 修改用户密码
 * @param username
 * @param psw
 */
function modifyUser(username, psw, ip, users) {
	var isExists = false, user;
	users = users || loadUsers();
	for (var i = 0, len = users.length; i < len; i++) {
		user = users[i];
		if (username === user.name) {
			user.psw = psw;
			user.ip = ip;
			isExists = true;
			break;
		}
	}
	if (!isExists) {
		return addUser(username, psw, ip);
	} else {
		var str = JSON.stringify(users);
		try{
			fs.writeFileSync(userConfDif, str, {encoding:"utf-8"});
			return true;
		} catch (e) {
			return false;
		}
	}

};

/**
 * 加载用户
 * @returns {*}
 */
exports.loadUsers = function(){
	return loadUsers();
};

/**
 * 检查用户是否存在
 * @param userName
 * @param psw
 */
exports.checkUser = function(userName, psw){
	return checkUser(userName, psw);
};
/**
 * 添加用户
 * @param userName
 * @param psw
 * @param ip
 */
exports.addUser = function(userName, psw, ip){
	return addUser(userName, psw, ip);
}
/**
 * 修改用户密码
 * @param userName
 * @param psw
 * @param ip
 */
exports.modifyUser = function(userName, psw, ip){
	return modifyUser(userName, psw, ip);
}
