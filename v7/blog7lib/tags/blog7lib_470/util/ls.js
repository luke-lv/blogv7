$import("sina/core/array/ArrayWithout.js")
$import("lib/lib.js");
$import("lib/register.js");
/**
 * @fileoverview 本地存储方法
 * @author Qiangyee | wangqiang1@staff
 * @created 2013-04-12
 */
Lib.register("util.LS", function (lib) {
	var ls;
	/**
	 * ie不支持本地存储的兼容方案
	 * 参考：
	 * http://www.cnblogs.com/zjcn/archive/2012/07/03/2575026.html
	 * https://github.com/machao/localStorage/
	 * https://github.com/RubyLouvre/mass-Framework/blob/master/src/more/store.js
	 *
	 * @ NAME: Cross-browser TextStorage
	 * @ DESC: text storage solution for your pages
	 * @ COPY: sofish, http://sofish.de
	 * @param wnd
	 * @param undefined
	 * @returns {{key: key, getItem: getItem, setItem: setItem, removeItem: removeItem, clear: clear, length: number}}
	 * @constructor
	 */
	var Storage = function (wnd, undefined) {

		var localStorageName = 'data-sina-blog-storage'
			, localStorageKeys = 'data-sina-blog-storage-keys'
			, doc = wnd.document
			, storageContainer = doc.createElement('input')
			, length, keys, removeArray = Core.Array.ArrayWithout
			// save attributeNames to box's `data-storage-keys` attribute
			,mark = function (key, isRemove, temp, reg) {

				storageContainer.load(localStorageName);
				temp = storageContainer.getAttribute(localStorageKeys) || '';
				reg = RegExp('\\b' + key + '\\b,?', 'i');

				var hasKey = reg.test(temp) ? 1 : 0;

				temp = isRemove ? temp.replace(reg, '')
					: hasKey ? temp : temp === '' ? key : temp.split(',').concat(key).join(',');

				storageContainer.setAttribute(localStorageKeys, temp);
				storageContainer.save(localStorageName);
			};
		var box = document.body || document.getElementsByTagName("head")[0] || document.documentElement;
		storageContainer.id = "____storage_container_box";
		storageContainer.type = "hidden";
		box.appendChild(storageContainer);
		// add IE behavior support
		storageContainer.addBehavior('#default#userData');
		storageContainer.load(localStorageName);
		var keyStr = storageContainer.getAttribute(localStorageKeys);
		keys = keyStr ? keyStr.split(',') : [];
		length = keys.length;
		return {
			/**
			 * 遍历storage的key值
			 * @param {number} index
			 * @returns {string}
			 */
			key: function(index){
				if (isNaN(index)) {
					index = 0;
				}
				return keys[parseInt(index, 10)];
			},
			/**
			 * 根据key获取存储的值
			 * @param {string} key 符合js变量命名的字符串
			 * @returns {string}
			 */
			getItem: function(key){
				storageContainer.load(localStorageName);
				return storageContainer.getAttribute(key);
			},
			/**
			 * 将value存入storage的key中
			 * @param {string} key storage的关键字
			 * @param {string} value storage存储的值
			 */
			setItem: function(key, value){
				storageContainer.setAttribute(key, value);
				storageContainer.save(localStorageName);
				this.length ++;
				keys.push(key);
				mark(key);
			},
			/**
			 * 清除storage关键字key中存储的值
			 * @param {string} key
			 */
			removeItem: function(key){
				storageContainer.removeAttribute(key);
				storageContainer.save(localStorageName);
				this.length --;
				removeArray(keys, key);
				mark(key, 1);
			},
			/**
			 * 清空storage存储的数据
			 */
			clear: function(){
				storageContainer.load(localStorageName);

				var attrs = storageContainer.getAttribute(localStorageKeys).split(','), len = attrs.length;

				if (attrs[0] === '') return;

				for (var i = 0; i < len; i++) {
					storageContainer.removeAttribute(attrs[i]);
					storageContainer.save(localStorageName);
				}

				storageContainer.setAttribute(localStorageKeys, '');
				storageContainer.save(localStorageName);
				this.length = 0
			},
			length: length
		};

	};

	var getStorage = function (wnd) {
		//如果已经支持了，则不再处理
		if (wnd.localStorage) {
			return wnd.localStorage;
		} else if (wnd.sessionStorage) {
			return wnd.sessionStorage;
		} else if (wnd.globalStorage) {
			return wnd.globalStorage;
		} else {
			return Storage(wnd);
		}
	}
	/**
	 * 返回本地存储对象
	 * @returns {localStorage}
	 */
	var getLS = function () {
		if (!ls) {
			ls = getStorage(window);
		}
		return ls;
	}

	return {
		key : function(index) {
			return getLS().key(index);
		},
		getItem   : function (key) {
			return getLS().getItem(key);
		},
		setItem   : function (key, value) {
			try{
				getLS().setItem(key, value);
				return true;
			}catch(e){
				return false;
			}
		},
		removeItem: function (key) {
			return getLS().removeItem(key);
		},
		clear     : function () {
			return getLS().clear();
		}
	};
});