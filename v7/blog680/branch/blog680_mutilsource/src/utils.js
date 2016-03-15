/**
 * @fileoverview 通用方法
 * @authors yifei2 <yifei2@staff.sina.com.cn>
 */

SinaBlog680.utils = {};
SinaBlog680.cookie = {};


//html转dom
SinaBlog680.utils.htmlToDom = function(html) {
	var div = document.createElement('div');
    div.innerHTML = html;
    return div.childNodes;
};
//判断是否为空对象
SinaBlog680.utils.isEmptyObject = function(O){
  for (var x in O){
    return false;
  }
  return true;
};
//获取一定范围内随机整数
SinaBlog680.utils.getRandomInt = function(min, max) {
	return Math.floor((max-min+1)*Math.random()) + min;
};

/**
 * 读取cookie
 * @param {Object} cookie的名字
 * @return {String} cookie的值
 * @example
 * var value = Utils.Cookie.getCookie(name);
 */
SinaBlog680.cookie.getCookie = function (name) {
	name = name.replace(/([\.\[\]\$])/g,'\\\$1');
	var rep = new RegExp(name + '=([^;]*)?;','i'); 
	var co = document.cookie + ';';
	var res = co.match(rep);
	if (res) {
		return res[1] || "";
	}
	else {
		return "";
	}
};
/**
 * 设置cookie
 * @param {String} name cookie名
 * @param {String} value cookie值
 * @param {Number} expire Cookie有效期，单位：小时
 * @param {String} path 路径
 * @param {String} domain 域
 * @param {Boolean} secure 安全cookie
 * @example
 * Utils.Cookie.setCookie('name','sina',null,"")
 */
SinaBlog680.cookie.setCookie = function (name, value, expire, path, domain, secure) {
	var cstr = [];
	cstr.push(name + '=' + escape(value));
	if(expire){
		var dd = new Date();
		var expires = dd.getTime() + expire * 3600000;
		dd.setTime(expires);
		cstr.push('expires=' + dd.toGMTString());
	}
	if (path) {
		cstr.push('path=' + path);
	}
	if (domain) {
		cstr.push('domain=' + domain);
	}
	if (secure) {
		cstr.push(secure);
	}
	document.cookie = cstr.join(';');
};
/**
 * 删除cookie
 * @param {String} name cookie名
 */
SinaBlog680.cookie.deleteCookie = function(name) {
	document.cookie = name + '=;' + 'expires=Fri, 31 Dec 1999 23:59:59 GMT;'; 
};