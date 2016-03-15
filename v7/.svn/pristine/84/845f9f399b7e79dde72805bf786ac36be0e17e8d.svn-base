/**
 * @fileoverview 绑定msn程序
 * @author xy xinyu@staff.sina.com.cn
 * @date 2010-06-10
 */
$import("sina/sina.js");
$import("sina/utils/io/ajax.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/function/bind3.js");
$import("sina/core/system/br.js");
$import("sina/core/string/trim.js");
$import('sina/utils/copy.js');
$import('sina/utils/limitReg.js');

$import("lib/showError.js");
$import("lib/LocalDB.js");
$import("lib/flashClipboard.js");

$registJob("bindmsn", function(){
	
	//如果是呈现的复制验证码区域，则绑定flash剪贴板功能
	var bindBox1=$E("bind_box1");
	bindBox1 && bindBox1.style.display != "none" && updateflashClipboard();
	
	//Utils.limitReg($E('msn_account'), /[\s\u3000]$/gi);
	Core.Events.addEvent($E('msn_account'),function(){
		$E("msn_account").value=Core.String.trim($E("msn_account").value.replace(/[\s\u3000]/gi,''));
	},'blur');

    var count = 0;
    scope.flsdata = {
        num: 0
    };
    setTimeout(function(){
        if (Lib.LocalDB.isFlashReady) {
            var t = Lib.LocalDB.get("msn_data", 86400000);
            if (typeof t != "undefined") 
                scope.flsdata = t;
        }
    }, 15000);
    
    
    //刷新是否绑定成功接口
    var intvfuc = function(){
        if (scope.flsdata.num > 10 || parseInt($E('msn_state').value) != 2) {
            //trace("clear");
            clearInterval(scope.msnintv);
            
        }
        else {
            //trace("no clear");
            var bind = new Interface("http://control.blog.sina.com.cn/msnbot/checkstate.php?t=" + new Date().getTime(), "ajax");
            var data = {
                "uid": scope.$uid
            };
            
            bind.request({
                GET: data,
                onSuccess: function(data){
					if ($E('bind_box3').style.display == "") {
					}
					else {
						$E('bind_box3').style.display = "none";
						$E('bind_box1').style.display = "none";
						$E('bind_box2').style.display = "";
						$E('msn_state').value = "3";
					}
					clearInterval(scope.msnintv);
                    
                }
            });
            scope.flsdata.num++;
        }
        if (Lib.LocalDB.isFlashReady) {
            Lib.LocalDB.set("msn_data", scope.flsdata);
        }
    };
    scope.msnintv = setInterval(intvfuc, 30 * 1000);
    //-------------------------------------------
    
	var savefunc=function(){
        var value = $E("msn_account").value;
        if (Core.String.trim(value) == "") {
            $E('msn_error_1').style.display = "";
            $E('msn_error_1').innerHTML = "请输入您的MSN帐号。";
            return;
        }
        // var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*\w+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        var reg = /^[a-z0-9][a-z0-9.\-_]*@[a-z0-9][a-z0-9_\-.]*\.[a-z]{2,3}$/i;
        if (!reg.test(value)) {
            $E('msn_error_1').style.display = "";
            $E('msn_error_1').innerHTML = "请输入有效的MSN账号。";
            return;
        }
        
        $E('msn_error_1').style.display = "none";
        
        
        var bind = new Interface("http://control.blog.sina.com.cn/msnbot/msn_process.php?t=" + new Date().getTime(), "ajax");
        var data = {
            "uid": scope.$uid,
            "msnaccount": encodeURIComponent(value),
            "type": 0
        };
        
        bind.request({
            GET: data,
            onSuccess: function(data){
            
                $E('bind_box3').style.display = "none";
                $E('bind_box1').style.display = "";
				updateflashClipboard();
                $E('msn_code').value = data.vcode;
                $E('msn_bot').innerHTML = data.bot;
                $E('msn_state').value = "2";
                scope.msnintv = setInterval(intvfuc, 30 * 1000);
				$E('msn_account_1').innerHTML=$E('msn_account').value;
				$E('msn_account_2').innerHTML=$E('msn_account').value;
				
            },
            onError: function(data){
				if (data.code == "B00023") {
					$E('msn_error_1').style.display = "";
					$E('msn_error_1').innerHTML = "请输入有效的MSN账号。";
				}
				else {
					showError(data.data.msg);
				}
			}
        });
    };
	
	
	Core.Events.addEvent($E('msn_account'),function(){
		e=Core.Events.getEvent();
		if(e.keyCode==13){
			savefunc();
		}
	},'keydown');
    //确定绑定的按钮
    Core.Events.addEvent("msn_ok", savefunc);
    
    //在未完成绑定的情况下删除绑定
    Core.Events.addEvent('msn_delete_1', function(){
        winDialog.confirm("您确定要移除绑定的MSN吗？", {
            funcOk: function(){
                var bind = new Interface("http://control.blog.sina.com.cn/msnbot/msn_process.php?t=" + new Date().getTime(), "ajax");
                var data = {
                    "uid": scope.$uid,
                    "type": 1
                };
                
                bind.request({
                    GET: data,
                    onSuccess: function(data){
                    
                        $E('bind_box3').style.display = "";
                        $E('bind_box1').style.display = "none";
                        $E('msn_state').value = "1";
						$E('msn_account').value="";
                    },
                    onError: function(data){
						showError(data.data.msg);

                    }
                });
                
            }
        });
    });
    
    
    //复制验证码
    Core.Events.addEvent($E('msn_copy'), function(){
        var flag = Utils.text2Copy($E('msn_code').value);
        if (flag == true) 
            winDialog.alert("复制成功", {
                icon: "03"
            });
        
    });
    
    //在完成绑定的情况下删除绑定
    Core.Events.addEvent('msn_delete_2', function(){
        winDialog.confirm("您确定要移除绑定的MSN吗？", {
            funcOk: function(){
                var bind = new Interface("http://control.blog.sina.com.cn/msnbot/msn_process.php?t=" + new Date().getTime(), "ajax");
                var data = {
                    "uid": scope.$uid,
                    "type": 1
                };
                
                bind.request({
                    GET: data,
                    onSuccess: function(data){
                    
                        $E('bind_box3').style.display = "";
                        $E('bind_box2').style.display = "none";
                        $E('msn_state').value = "1";
						$E('msn_account').value="";
                    },
                    onError: function(data){
                        showError(data.data.msg);
                    }
                });
                
            }
        });
    });
    
	/**
	 * 更新flash剪贴板呈现
	 */
    function updateflashClipboard(){
		if($E("Lib.FlashClipboardMovie_1")){
			return;
		}
		
		var btnCopy=$E("msn_copy"),
			msnCode=$E("msn_code"),
		 	fcb=new Lib.FlashClipboard.Client();
		
		fcb.addEventListener("complete",function(){
			winDialog.alert("验证码已成功复制到剪贴板。",{
				icon:"03"
			});
		});
		fcb.addEventListener("mouseMove",function(){
			msnCode && fcb.setText(msnCode.value);
		});
		btnCopy && fcb.glue(btnCopy);
	}
});

