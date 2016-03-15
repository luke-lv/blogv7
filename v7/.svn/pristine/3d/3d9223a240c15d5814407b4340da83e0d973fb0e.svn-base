/**
 * Copyright (c) 2010, Sina Inc. All rights reserved.
 * @fileoverview 票据获取
 */
$import("sina/utils/io/jsload.js");
$import("sina/utils/json.js");

var Ticket = {
	/**
	 * 获取票据接口地址
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
	 * @param {Function} callbackFunc 回调函数，此函数中调用flash函数将票据给flash
	 * @param {Number} count 一次取得的票据数
	 * @param {String} entry 项目标识，用于记录来源,(由统一注册颁发) 
	 * @param {String} service 需要访问的服务的标识 ，参数值需咨询票据验证方 
	 */
    get: function(callbackFunc,count, entry, service){
        var param = {};
		param.entry = entry || "photo";
        param.service = service || "tupian";
        param.cnt = count || 20;
        var url = this._setParam(param);
        Utils.Io.JsLoad.request(url, {
            onComplete: function(result){
//				var result={"retcode":0,"ticket":["ST-MTI2NTMwMzI2Nw==-1269069741-40209D4A2892407dd9E09E48B62CAE8E3D","ST-MTI2NTMwMzI2Nw==-1269069741-31B4D5A9645ECC7FBE3928D6C265DBC5","ST-MTI2NTMwMzI2Nw==-1269069741-F15B09F484D614FE213FE32479C8DF37","ST-MTI2NTMwMzI2Nw==-1269069741-6C5DEC3CDA6C7A57B90900A5D0F258AB","ST-MTI2NTMwMzI2Nw==-1269069741-DA565A1842956678D2FBD10ED720E95C","ST-MTI2NTMwMzI2Nw==-1269069741-25D49105A5D9B971AB874E1B0B5A5191","ST-MTI2NTMwMzI2Nw==-1269069741-CE6E267188A30A5143F562FED93ADD89","ST-MTI2NTMwMzI2Nw==-1269069741-A037A2B90C71EAE3D86301A2A3195AAE","ST-MTI2NTMwMzI2Nw==-1269069741-50CD19BF5A8BD0FFFF82AD3176B6FCB6","ST-MTI2NTMwMzI2Nw==-1269069741-6C78425BF225A7362C709247AD7AD7E1","ST-MTI2NTMwMzI2Nw==-1269069741-8D105F49BEB56639AB002F61B2E4B25F","ST-MTI2NTMwMzI2Nw==-1269069741-12C1D752E6FFCC9922428203CB60A858","ST-MTI2NTMwMzI2Nw==-1269069741-4B54A1D2FF42B8DF3565EF7411B6C078","ST-MTI2NTMwMzI2Nw==-1269069741-06FD9374C3141F268C341D18CF53D7B5","ST-MTI2NTMwMzI2Nw==-1269069741-BCA25C8BD6259408150DDE64197739E4","ST-MTI2NTMwMzI2Nw==-1269069741-3D6D164F0B85EC77975C88285376E542","ST-MTI2NTMwMzI2Nw==-1269069741-4B06D69EF0B59FA0D6872B8BC6634C05","ST-MTI2NTMwMzI2Nw==-1269069741-578418594C7D9A22C87C77EDD5EA506B","ST-MTI2NTMwMzI2Nw==-1269069741-D3379DBDBC64F6C93766DE4E4D3D58EB","ST-MTI2NTMwMzI2Nw==-1269069741-31FE4A0A4E77E2E67B51F9562CCAC09E"]}
				callbackFunc(Utils.Json.obj2json(result));
            },
            charset: "UTF-8"
        });
    }
}


