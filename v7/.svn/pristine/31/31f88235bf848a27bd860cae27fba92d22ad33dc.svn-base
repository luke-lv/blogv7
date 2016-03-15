$import("lib/interface.js");
$import("lib/dialogConfig.js");
$import("lib/sendLog.js");

$registJob("checkImgBlogger", function(){
    var itf = {
        check: new Interface("http://control.blog.sina.com.cn/blog_rebuild/riaapi/points/check_vip.php","ajax"),
        redeem: new Interface("http://control.blog.sina.com.cn/blog_rebuild/riaapi/points/points_redeem.php","ajax")
    };
    
    checkImgBlogger();
    
    //验证是否为图片博主
    function checkImgBlogger(cb){
        var cb = cb || function (){};
        itf.check.request({
            POST: {
                type: 3
            },
            onSuccess: function (data){
                scope.$is_photo_vip = 1;
            },
            onError: function (result){
                //未开通没有权限时
                if(result && result.code == "A00001"){
                    scope.$redeemImgBloggerDialog = redeemImgBlogger;
                }
            },
            onFail: function (){
            }
        }); 
    }
    function redeemImgBlogger(cb){
        v7sendLog('18_01_01');
        var sucdlg = winDialog.alert("抱歉，图片超过5m！", {
			funcOk: function(){
				itf.redeem.request({
                    POST: {
                        user: scope.$uid || $UID,
                        type: 3,
                        auto: 1
                    },
                    onSuccess: function(data){
                        scope.$is_photo_vip = 1;
                        cb(data);
                    },
                    onError: function(result){
                        if(result && result.code == "A00003"){
                            winDialog.alert(result.data, {subText:'<a href="http://blog.sina.com.cn/huodong/lottery.html?f=1">马上获得1888积分! </a>'});
                        }else{
                            winDialog.alert(result && result.data);
                        }
                    },
                    onFail: function(){
                    }
                });
			},
			textOk: "马上兑换",
            subText: "150积分开通10m大图上传"
		}, "redeemImgBloggerDialog");
    }
});