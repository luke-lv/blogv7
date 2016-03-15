/**
 * Copyright (c) 2010, Sina Inc. All rights reserved.
 * @author dg (add by Random)
 * @fileoverview 票据获取
 */
$import("sina/utils/io/jsload.js");

$import("lib/lib.js");

Lib.Ticket = {
    requestTickets : [],
	/**
	 * 获取票据接口地址
	 * http://wiki.intra.sina.com.cn/pages/viewpage.action?pageId=7147925
	 */
    _interface: "http://login.sina.com.cn/sso/getst.php",
	/**
	 * 将对象中的键值对，添加到接口的url中
	 * @param {Object} param 
	 */
    _setParam: function(param){
        var urlArray = [];
        urlArray.push(this._interface);
        var i = 0;
        for (var name in param) {
            if (i == 0) {
                urlArray.push("?");
            }
            else {
                urlArray.push("&");
            }
            urlArray.push(name);
            urlArray.push("=");
            urlArray.push(param[name]);
            i++;
        }
        return urlArray.join("");
    },
	/**
	 * 获取票据
	 * @param {Function}（旧的方式）callbackFunc 回调函数，此函数中调用flash函数将票据给flash
	 *        {Object}（新的方式）callbackFunc Hash对象，结构为{success:function(),fail:function()}
	 * @param {Number} count 一次取得的票据数
	 * @param {String} entry 项目标识，用于记录来源,(由统一注册颁发) 
	 * @param {String} service 需要访问的服务的标识 ，参数值需咨询票据验证方 
	 */
	get: function(callbackFunc, count, entry, service) {
		if (!callbackFunc) {
			return;
		}
		var options = {
			success: function() {
			},
			fail: function() {
			}
		};

		if (typeof callbackFunc == 'function') {
			//兼容旧模式，只有成功回调的那种。
			options.success = callbackFunc;
		} else {
			//新模式，用Hash对象保存回调。
			if (typeof callbackFunc.success == 'function') {
				options.success = callbackFunc.success;
			}
			if (typeof callbackFunc.fail == 'function') {
				options.fail = callbackFunc.fail;
			}
		}
		var param = {};
		param.entry = entry || "blog";
		param.service = service || "tupian";
		param.cnt = count || 20;
		var url = this._setParam(param);
		Utils.Io.JsLoad.request(url, {
            
			onComplete: function(result) {
				//var result={"retcode":0,"ticket":["ST-MTg4OTgxODU1Mg==-1332930835-gz-1FB777152C579972D724F99F93A0B380","ST-MTg4OTgxODU1Mg==-1332930835-gz-1F2F10C0A146E2FAE197E026A96F1313","ST-MTg4OTgxODU1Mg==-1332930835-gz-74120D280E752F54DC4D467C7847FD0C","ST-MTg4OTgxODU1Mg==-1332930835-gz-9EBB920182E9A67170EB6C5BAC261C21","ST-MTg4OTgxODU1Mg==-1332930835-gz-C1BF4AA61104853A6EBD269FC7430263","ST-MTg4OTgxODU1Mg==-1332930835-gz-B1B6365F749FCC76C9F8072BE8000456","ST-MTg4OTgxODU1Mg==-1332930835-gz-1307386621D0A3DC36830441B933D925","ST-MTg4OTgxODU1Mg==-1332930835-gz-DDA4866C14B191805D5672CCEDE74251","ST-MTg4OTgxODU1Mg==-1332930835-gz-3EDE7179FCE43DA72E17C5ECFC73A0B0","ST-MTg4OTgxODU1Mg==-1332930835-gz-15B65BD365C6C9EE838C0E67261CD43E","ST-MTg4OTgxODU1Mg==-1332930835-gz-D84EC15A5D4D40B2C5116C592DFB42FA","ST-MTg4OTgxODU1Mg==-1332930835-gz-7D2976EB1567FF02EA4D5D4B1CA74554","ST-MTg4OTgxODU1Mg==-1332930835-gz-29C14B92366BEA0272EB8AF3D0482D52","ST-MTg4OTgxODU1Mg==-1332930835-gz-3664ED47AD7FA5F19680304D4ED1BB6A","ST-MTg4OTgxODU1Mg==-1332930835-gz-714734C859CA69CD84B1132E3E80AE2E","ST-MTg4OTgxODU1Mg==-1332930835-gz-FF32BB91150B843D2917F4CAC24AC830","ST-MTg4OTgxODU1Mg==-1332930835-gz-A39F72973C353AE70A8DD8363E1BB559","ST-MTg4OTgxODU1Mg==-1332930835-gz-679C52622E25B7414DA39CC2E3D7032E","ST-MTg4OTgxODU1Mg==-1332930835-gz-28CC51E1409D4019D4C1143F6F5F4E65","ST-MTg4OTgxODU1Mg==-1332930835-gz-665F1C4DAA41D3615C60DFE591C6D6C9"]}
                var oldTickets = Lib.Ticket.requestTickets;
                if (result){
                    Lib.Ticket.requestTickets = oldTickets.concat(result.ticket);
                }
                //Debug.log(Lib.Ticket.requestTickets.join(','));
				options.success(result);
			},
			onException : function () {
				options.fail();
			},
			timeout : 30000,
			charset: "UTF-8"
		});
	}
};


