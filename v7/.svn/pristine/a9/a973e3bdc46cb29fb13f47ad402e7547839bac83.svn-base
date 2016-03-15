/**
 * @desc	注册流程正则校验
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("comps/oop.js");
$import("comps/reg/_reg.js");
$import("sina/core/string/byteLength.js");


Reg.RegEx = function(opt){
	this.str = opt.str;
	this.reportCall = opt.reportCall;
	this.stop = false;
	
}.$defineProto({
	setStr: function(str){
		this.str = str;
	},
	cantEmpty: function(tip){
		// console.log("regex: "+this.stop);
		if(!this.stop && !this.str){
			this.reportCall(tip || "此项不能为空");
			this.stop = true;
		}
		return this;
	},
	cantHaveSpace: function(tip){
		if(!this.stop && (/ |　/.test(this.str))){
			this.reportCall(tip || "不能包含空格");
			this.stop = true;
		}
		return this;
	},
	cantHaveNum: function(tip){
		if(!this.stop && !(/^[0-9]/.test(this.str))){
			this.reportCall(tip || "不能含有数字");
			this.stop = true;
		}
		return this;
	},
	cantNumAll: function(tip){
		if(!this.stop && (/^[\d]+$/.test(this.str))){
			this.reportCall(tip || "不能全是数字");
			this.stop = true;
		}
		return this;
	},
	cantHaveChinese: function(tip){
		if(!this.stop && (/[\u4E00-\u9FA5]/.test(this.str))){
			this.reportCall(tip || "不能含有中文");
			this.stop = true;
		}
		return this;
	},
	cantHaveUnicode: function(tip){
		if(!this.stop && (/[\uFF00-\uFFFF]/.test(this.str))){
			this.reportCall(tip || "不能使用全角字符");
			this.stop = true;
		}
		return this;
	},
	cantLenWrong:function(limit, tip){
		var __tmp = limit.split("-");
		var __low = __tmp[0];
		var __hi = __tmp[1] || __low;
		var __len = Core.String.byteLength(this.str);
		if(!this.stop && (__len<__low || __len>__hi)){
			this.reportCall(tip || "长度不符合，应为 " + limit + " 位");
			this.stop = true;
		}
		return this;
	},
	cantUnderlineLast: function(tip){
		if(!this.stop && (/_$/.test(this.str))){
			this.reportCall(tip || "下划线不能在最后");
			this.stop = true;
		}
		return this;
	},
	cantUnderlineBothSide: function(tip){
		if(!this.stop && (/(^_+)|(_+$)/.test(this.str))){
			this.reportCall(tip || "首尾不能是下划线");
			this.stop = true;
		}
		return this;
	},
	cantSpaceBothSide: function(tip){
		if(!this.stop && (/(^[ 　]+)|([ 　]+$)/.test(this.str))){
			this.reportCall(tip || "首尾不能有空格");
			this.stop = true;
		}
		return this;
	},
	cantSinaMail:function(tip){
		if(!this.stop && (/@(sina|vip[.]sina|2008[.]sina|51uc)[.](cn|com|com[.]cn)$/.test(this.str))){
			this.reportCall(tip || "有新浪邮箱吗？请直接 <a href='http://login.sina.com.cn/signup/signin.php?entry=blog' style='color:#CC0000; text-decoration:underline;'>登录</a>");
			this.stop = true;
		}
		return this;
	},
	notAEmail:function(tip){
		if(!this.stop && !(/^[0-9a-z][_.0-9a-z-]{0,31}@([0-9a-z][0-9a-z-]{0,30}\.){1,4}[a-z]{2,4}$/.test(this.str))){
			this.reportCall(tip || "邮箱地址格式不正确");
			this.stop = true;
		}
		return this;
	},
	cantWiredCharPWR: function(tip){
		if(!this.stop && !(/[\w\~\!\@\#\$\%\^\&\*\(\)\+\`\-\=\[\]\\\{\}\|\;\'\:\"\,\.\/\<\>\?]/.test(this.str))){
			this.reportCall(tip || "不能含有特殊字符");
			this.stop = true;
		}
		return this;
	},
	cantWiredChar: function(tip){
		if(!this.stop && (/>|<|,|\[|\]|\{|\}|\?|\/|\+|=|\||\'|\\|\"|:|;|\~|\!|\@|\#|\*|\$|\%|\^|\&|\(|\)|\-|\—|\.|`/.test(this.str))){
			this.reportCall(tip || "不能含有特殊字符");
			this.stop = true;
		}
		return this;
	},
	cantUpcase: function(tip){
		if(!this.stop && (/[A-Z]/.test(this.str))){
			this.reportCall(tip || "不能含有大写字母");
			this.stop = true;
		}
		return this;
	},
	mustLetterOrNum:function(tip){
		if(!this.stop && (/[^0-9a-z]/i.test(this.str))){
			this.reportCall(tip || "输入的是数字或英文字母");
			this.stop = true;
		}
		return this;
	},
	mustNormalChar: function(tip){
		if(!this.stop && (/[^0-9a-zA-Z\u4E00-\u9FA5]/.test(this.str))){
			this.reportCall(tip || "不能包含半角数字、半角字母和汉字以外的字符");
			this.stop = true;
		}
		return this;
	}
	
});


