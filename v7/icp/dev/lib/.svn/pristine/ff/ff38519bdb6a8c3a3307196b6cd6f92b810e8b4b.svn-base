/*
 * Copyright (c) 2014, Sina Inc. All rights reserved.
 */
/** 
 * @fileoverview 各种正则验证规则
 * @author Edwin | zhihang1@staff.sina.com.cn
 */
$import("lib/lib.js");
$import("sina/sina.js");
$import("sina/core/array/foreach.js");
$import("sina/core/string/trim.js");

Lib.checkRegExp = (function(){
		
	var checkBase = function( regStr ){
		return function( beRegStr ){
			if( new RegExp(regStr).test(beRegStr) ){
				return true;
			}else{
				return false;
			}
		};
	};
	var checkDec = function(value){
		if(/[\uFF00-\uFFFF]/.test(value)){
			return false;
		}
			return true;
	};
	var checkEml = function( eml ){
		//if( !/^[\.\w]([(\/)(\-)(\+).\w])*@([(\-)\w]{1,64}\.){1,7}[(\-)\w]{1,64}$/.test(eml) ){
		if(!/^[0-9a-z_][_.0-9a-z-]{0,31}@([0-9a-z][0-9a-z-]{0,30}\.){1,4}[a-z]{2,4}$/.test(eml)){
		   return false;
		} else{
			if( eml && eml != "" && (eml.indexOf("@") != -1) ){
				var indexOfA = eml.indexOf("@");
				var name = eml.substring( 0, indexOfA );
				if( name.length >64 || eml.length > 256 ){
					return false;
				}else{
					return true;
				}
			}
		}
		return false;
	};
	var checkQQEml = function( eml ){
		if( !/^[\.\w]([(\/)(\-)(\+).\w])*@(qq|vip.qq)\.com$/.test(eml) ){
		   return false;
		} else{
			if( eml && eml != "" && (eml.indexOf("@") != -1) ){
				var indexOfA = eml.indexOf("@");
				var name = eml.substring( 0, indexOfA );
				if( name.length >18 || eml.length > 29 ){
					return false;
				}else{
					return true;
				}
			}
		}
		return false;
	};
	
	var checkWeakPassword = (function(){
		var weak_password_list = [
			'000000','111111','11111111','112233','123123',
			'123321','123456','654321','666666','888888',
			'abcdef','abcabc','abc123','a1b2c3','aaa111',
			'123qwe','qwerty','qweasd','admin','password',
			'p@ssword','passwd','iloveyou','5201314'
		];
		var weak_password_hash = {};
		Core.Array.foreach(weak_password_list, function(str){
			weak_password_hash[Core.String.trim(str)] = true;
		});
		return function(pwd){
			if(weak_password_hash[pwd]){
				return false;
			}else{
				return true;
			}
		};
	})();
	
	return {
		'mobile': checkBase( "^1(\\d{10})+$" ),
		'mobileNew': checkBase( "^\\d{6,14}$" ),
		//'nickName': checkBase( "^[a-zA-Z0-9\u4e00-\u9fa5\uff00-\uffff\u0800-\u4e00\u3130-\u318f\uac00-\ud7a3_]*$" ),
		'nickName': checkBase("^[0-9a-zA-Z\u4e00-\u9fa5_-]*$"),
		'question': checkBase("^[0-9a-zA-Z\u4e00-\u9fa5_?？-]*$"),
		'cardID': checkBase( "^(([0-9]{15})|([0-9]{18})|([0-9]{17}(x|X)))$" ),
		'URLoose': checkBase( "^([^://])+\\:\\/\\/([^\\.]+)(\\.)(.+)([^\\.]+)$"),
		'URL': checkBase( "^http:\\/\\/([\\w-]+(\\.[\\w-]+)+(\\/[\\w-   .\\/\\?%@&+=\\u4e00-\\u9fa5]*)?)?$" ),
		'imgURI': checkBase( "(\.jpg|\.gif|\.png|\.bmp|\.JPG|\.GIF|\.PNG|\.BMP)$" ),
//		'password':checkBase("^[0-9a-zA-Z\\\._\\\-\\\?]{6,16}$"),
		'email': checkEml,
		'password':checkBase('^([\\w\\~\\!\\@\\#\\$\\%\\^\\&\\*\\(\\)\\+\\`\\-\\=\\[\\]\\\\\{\\}\\|\\;\\\'\\:\\"\\,\\.\\/\\<\\>\\?]{6,16})$'),
		'dec':checkDec,
		'zipCode': checkBase( "(\\d{6})+$" ),
		'weak' : checkWeakPassword,
		//检测字符串是否为空
		'empty': function( str ){
			if( !str ){
				return false;
			}
			if( !(str instanceof String) ){
				str = str.toString();
			}
			if( (Core.String.trim(str)).length ){
				return true;
			} else{
				return false;
			}
		},

		'realName': function(str){
			if(new RegExp("^[\u4e00-\u9fa5]{2,6}$").test(str)){
				return true;
			}else if(new RegExp("^[a-z]{2,20}$").test(str)){
				return true;
			}else if(!(new RegExp("[0-9\s_><,\\[\\]\\{\\}\?\/\+\=\|\'\\\":;\~\!\@\#\*\$\%\^\&\(\)`\xff00-\xffff]").test(str))){
				return true;
			}else{
				return false;
			}
		},

		'QQNum': function( str ){
			if(new RegExp( "^[1-9][0-9]{4,11}$").test(str) ){
				return true;
			} else if( checkQQEml(str) ){
				return true;
			} else{
				return false;
			}
		},

		'UCNum': function( str ){
			if( new RegExp("^[1-9][0-9]{4,9}$").test(str) ){
				return true;
			} else{
				return false;
			}
		},

		//测试密码强度
		'pwdPower': function( sPW ){
			function CharMode( iN ){
				if( iN>=65 && iN <=90 ){
					return 2;//大写字母
				}else if( iN>=97 && iN <=122 ){
					return 4;//小写
				}else if( iN>=48 && iN<=57){
                    return 1;//数字
                }else{
					return 8;//特殊字符
				}
			}
			//计算出当前密码当中一共有多少种模式
			function bitTotal( num ){
				var modes = 0;
				for ( i=0; i<4; i++ ){
					if ( num & 1 ){
						modes++;
					}
					num>>>=1;
				}
				return modes;
			}
			//checkStrong函数 返回密码的强度级别
			var Modes = 0,
				len = sPW.length;
			if(len<6){
				return 1;
			}
			
			for ( i=0; i<len; i++ ){
				//测试每一个字符的类别并统计一共有多少种模式.
				Modes |= CharMode(sPW.charCodeAt(i));
			}
			var btotal = bitTotal(Modes);
			if ( sPW.length >= 10 ) {
				btotal++;
			}
			if( !checkWeakPassword(sPW) ){
				btotal = 1;
			}
			btotal = Math.min(Math.max(btotal, 1), 3);
			return btotal;
		}
	}
})();