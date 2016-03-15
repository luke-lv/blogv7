/**
 * @fileoverview 统计下msn搬家流程中各个步骤的流失率问题
 */
$import("sina/sina.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/function/bind2.js");
$import("sina/utils/io/jsload.js");
$import("sina/utils/io/ajax.js");
$import("sina/core/class/create.js");
$import("lib/lib.js");
$import("lib/jobs.js");
$import("lib/LocalDB.js");


var statisticUniqueUser = Core.Class.create();
statisticUniqueUser.prototype = {
    container_id: null,
    is_init: false,
    localDB: null,
    initialize: function(cnt_id){
        this.container_id = cnt_id;
        if (!Lib.LocalDB.FlaDom) {//如果flash 还没有加载
            //trace("first 加载")
            var _this = this;
            Lib.LocalDB.registerFun(function(){
                setTimeout(function(){
                    _this.loaded();
                }, 10);
            });
            Lib.LocalDB.loadFlash("msnStFlash");
        }
        else {
            this.loaded();
        }
        
    },
    loaded: function(){
        var _this = this;
        if (Lib.LocalDB.get("MSNKey", 31536000000)) {//存在key,则在页面关闭时执行操作 
        }
        else {//本机器不存在key,则需要提交一次
            Lib.LocalDB.set("MSNKey", "msn_" + window.staticTime + parseInt(Math.random() * 100000).toString());
        }
        this.send();
        
    },
    send: function(){
        var k = Lib.LocalDB.get("MSNKey", 31536000000);
		var cid='';
		if(Utils.Cookie.getCookie("c_uid")){
			cid=Utils.Cookie.getCookie("c_uid");
		}
        Utils.Io.JsLoad.request("http://move.blog.sina.com.cn/msnmove/log_rcv_api.php?key=" + k + "&url=" + encodeURIComponent(window.location.href)+"_time_"+new Date().getTime()+"&cid="+cid, {
            onComplete: function(){
            }
        });
    }
};


$registJob("statisticUniqueUser", function(){

    window.sUU = new statisticUniqueUser();
    
});
