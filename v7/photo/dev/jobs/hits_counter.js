/**
 * 
 *
 * @author yaojing@staff.sina.com.cn 
 * @date 2008-8-18
 * @author shaomin || shaomin@staff.sina.com.cn
 * @date 2008-11-05
 * @desc for 页面的浏览数
 * 
 */


$registJob("sinaHit",function(){
	window._SinaPhotoHits = {
	"_readURl"		: "http://hitsr.sinajs.cn/ph",
	// "_writeURl"		: "http://hitsw.sinajs.cn/hits?act=5",
	"_writeURl"		: "http://comet.blog.sina.com.cn/api?maintype=hits&act=5",
	"vistElements"	: [],
	"uids"			: [],
	"sids"			: [],
	"pids"			: [],
	
	_getElementsByTagname	: function(tag, name) {
		var elem = document.getElementsByTagName(tag);
		var count = elem.length;
		var arr = new Array();
		for (var i = 0,j = 0; i < count; ++i) {
			var att = elem[i].getAttribute("name");
			if (att == name) {
				arr[j] = elem[i];
				++j;
			}
		}
		return arr;
	},
	
	_getUidHex		: function(uid) {
		var uidhex = window.parseInt(uid).toString(16);
		return uidhex;
	},
	
	_scriptRequest	: function (url,callback) {
		var head = document.getElementsByTagName("head")[0];
		var ss = document.getElementsByTagName("script");
		for (var i = 0; i < ss.length; i++) {
			if (ss[i].src && ss[i].src.indexOf(url) != -1) {
				head.removeChild(ss[i]);
			}
		}
		var script = document.createElement("script");
		script.src = url;
		script.setAttribute("type", "text/javascript");
		script.charset="utf-8";
		head.appendChild(script);
		if ("function" == typeof(callback)) {
			if ("undefined" == typeof(script.onreadystatechange)) {
				script.onload = callback;
			}else {
				script.onreadystatechange = function() {
					if(this.readyState == "loaded" || this.readyState == "interactive" || this.readyState == "complete" ) {
						callback();
					}
				};
			}
		}
	},
	init	: function(uid,ctg_id,pic_id) {
		this.vistElements = (this._getElementsByTagname("cite", "vist_cnt").length <1 )? this._getElementsByTagname("span", "vist_cnt") : this._getElementsByTagname("cite", "vist_cnt");
		this.HitsWrite(uid,ctg_id,pic_id);
		if(ctg_id.length <1 || pic_id.length <1)
			this.HitsRead();
	},
	
	_getRequestData	: function() {
		if (!this.vistElements.length) return;
		for (var i = 0; i < this.vistElements.length; i++) {
			var key = this.vistElements[i].getAttribute("vist_id").toString();
			if (key.match(/^[0-9]+$/) && key.length <= 10) {
				var uidhex = this._getUidHex(key);
				this.uids.push(uidhex);
			}else if (key.match(/^[0-9a-z]{21}$/)) {
				this.pids.push(key);
			}else if (key.indexOf("|") > -1) {
				var arr = key.split("|");
				var uidhex = this._getUidHex(arr[0]);
				this.sids.push(uidhex + arr[1]);
			}
		}
	},
	_HitsReadOnlyRender		: function() {
		if (!_SinaPhotoHits.vistElements.length) return;
		for (var i = 0; i < _SinaPhotoHits.vistElements.length; i++) {
			vist_id = _SinaPhotoHits.vistElements[i].getAttribute("vist_id");
			if("undefined" != typeof(_HitsR[vist_id + "_pv"])){
				_SinaPhotoHits.vistElements[i].innerHTML = _HitsR[vist_id + "_pv"];
			}else {
				var arr = vist_id.split("|");
				if ("undefined" == typeof(arr[1])) continue;
				var uidhex = _SinaPhotoHits._getUidHex(arr[0]);
				if ("undefined" != typeof(_HitsR[uidhex + arr[1]])) {
				   _SinaPhotoHits.vistElements[i].innerHTML = _HitsR[uidhex + arr[1]];
				}
			}
		}
	},
	_HitsReadWriteRender	: function() {
		function formatnumber( n ){
			var tmp=Math.ceil(n.length/3);
			var num="";
			for(var i=tmp;i>0;i--){
				if(n.length-(i-1)*3<=0) left=0;
				else left=n.length-(i-1)*3;
				num+=","+n.substring(left,n.length-i*3);
				}
				num=num.substring(1,num.length);
			return num;
				//alert(num);
		}

		if (!_SinaPhotoHits.vistElements.length) return;
		var vist_id = _SinaPhotoHits.vistElements[0].getAttribute("vist_id");
		if(typeof(_HitsW) != 'undefiend' 
			&& "undefined" != typeof(_HitsW[vist_id])) {
		    _HitsW[vist_id] = formatnumber(_HitsW[vist_id]);
		    _SinaPhotoHits.vistElements[0].innerHTML = "<strong>"+_HitsW[vist_id]+"</strong>";
		}
	},
	
	HitsRead		: function() {
		this._getRequestData();
		if (!this.uids.length && !this.sids.length && !this.pids.length) return;
		var url = this._readURl;
		if (this.uids.length) url += "?uid=" + this.uids.join(",");
		if (this.sids.length) url += ((url.indexOf("?") > -1) ? "&" : "?") + "sid=" + this.sids.join(",");
		if (this.pids.length) url += ((url.indexOf("?") > -1) ? "&" : "?") + "pid=" + this.pids.join(",");
		url += "&var=_HitsR";

		this._scriptRequest(url, this._HitsReadOnlyRender);
	},
	
	HitsWrite		: function(uid, sid, pid) {

		uid = (uid && uid.match(/^[0-9]+$/)) ? uid : '';
		sid = (sid && sid.match(/^[0-9]+$/)) ? sid : '';
		pid = (pid && pid.match(/^[0-9a-z]{21}$/)) ? pid : '';
		pid = ('' != pid) ? pid.substring(8) : '';
	
		if (!uid) return;
		var uidhex = this._getUidHex(uid);
		var url = this._writeURl;
		if (uidhex) url += "&uid=" + uidhex;
		if (sid) url += "&sid=" + sid;
		if (pid) url += "&pid=" + pid;
		url += "&var=_HitsW";
		if(document.referrer != '0') url+= '&ref=' + encodeURIComponent(document.referrer)
		this._scriptRequest(url, _SinaPhotoHits._HitsReadWriteRender);
	}
};
var ctg_id = typeof ctgID =='undefined' ? "" : ctgID.toString();
var pic_id = typeof picID =='undefined' ? "" : picID;

_SinaPhotoHits.init(scope.$uid,ctg_id,pic_id);

});
