/**
 * @fileoverview 判断用户是否开通某个固定的产品
 * @author xy xinyu@staff.sina.com.cn
 * @date 2009-10-22
 */
$import("sina/core/string/j2o.js");
$import("sina/utils/io/jsload.js");
$import("sina/core/function/bind2.js");

var checkUserProduct = {
	isinit:false,
	func:null,
	product:"",
    flag: true,
    getReturn: function(name){
        switch (name) {
            case "blog":
                var tmp = ("0x" + scope.userProducts) & 0x00000001;
//				trace("tmp="+tmp);
                if (tmp != 0) {
                    this.flag = true;
                }
                else {
                    this.flag = false;
                }
                break;
            case "photo":
                var tmp = ("0x" + scope.userProducts) & 0x00000008;
                if (tmp != 0) {
                    this.flag = true;
                }
                else {
                    this.flag = false;
                }
                break;
            default:
                this.flag = true;
				
        }
		this.func();
    },
    check: function(name,func){
		this.product=name;
		this.func=func||function(){};
        if (scope.userProducts) {
            this.getReturn(name);
        }
        else {
            //xiaoyue3@modofied  uic接口升级，统一做了修改  2013-06-08
            // var url = "http://uic.sinajs.cn/uic?type=service&uids=" + $UID;
            var url = "http://uic.sso.sina.com.cn/uic/Query.php?" + "UID="+ $UID +"&Check=null&UserInfoTypes=[4]&ProductType=2";
            Utils.Io.JsLoad.request(url, {
                onComplete: function(result){
                   // trace("读取用户产品信息");
                    //trace(typeof result);
					if (typeof result == "object") {
						scope.userProducts = result.UserInfo[0][1];//Core.String.j2o(result);
						this.getReturn(this.product);
						this.isinit = true;
					}else{
						this.flag=false;
						this.isinit = true;
					}
                }
.bind2(this)                ,
                charset: "UTF-8"
            });
        }
    }
};

