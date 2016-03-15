$import("sina/core/events/addEvent.js");
$import("sina/ui/dialog/windowDialog.js");
$import("sina/utils/io/jsload.js");
$import("lib/login/ui.js");
$import("lib/dialogConfig.js");
$import("lib/checkAuthor.js");
/**
 * @fileoverview 导入微博加V认证
 *
 * @create 2012-11-26
 * @author Qiangyee
 */
$registJob("importV", function (){

    var importBtn = $E("import-v");
    if (!importBtn) {
        return;
    }
    
    importBtn = importBtn.parentNode;
    var _addEvent = Core.Events.addEvent;
    var apiURL = "http://control.blog.sina.com.cn/blog_rebuild/riaapi/vblog/";
    var _this = {
        // 登录后调用
        loginSuccess : function(){
            // 登录完成后设置cookie
            Lib.checkAuthor();
            _this.getWeiboInfo();
        },
        // 获取博客用户的
        getWeiboInfo : function(){
            //http://control.blog.sina.com.cn/blog_rebuild/riaapi/vblog/get_weibo_info.php
            var url = apiURL + "get_weibo_info.php";
            Utils.Io.JsLoad.request(url, {
                onComplete  : function(result){
                    var msg = "";
                    var blogerInfo;
                    var okFun = function(){};
                    var cancelFun = function(){};
                    /*
                    result = {
                        code : "A00006",
                        data : {
                            type:2,
                            nick: "aaa"
                        }
                    }*/
                    if ("A00006" === result.code) {
                        blogerInfo = result.data;
                        blogerInfo.verifiedTypeName = _this.getVerifiedType(blogerInfo.type);
                        if (blogerInfo.verifiedTypeName) {
                            _this.comfirmImport(blogerInfo);
                        }
                    }
                    if ((blogerInfo && (-1 == blogerInfo.type))
                            || "A00009" === result.code
                            || "A00008" === result.code) {
                        msg = "抱歉，目前仅支持微博认证用户！";
                    } else if ("A00003" === result.code) {
                        msg = "尚未开通博客，点击页面左上角开通按钮，开通博客。"

                        okFun = cancelFun = function(){
                            location.hash = "#openBlogBtnTray";
                        };
                    } else if ("A00005" === result.code) {
                        msg = "博客账号与所绑微博登陆账号不统一，无法导入。";
                    } else if ("A00007" === result.code) {
                        msg = "目前已经是博客认证用户，请勿重复导入。";
                    }
                        
                    if (msg) {
                        winDialog.alert(msg, {
                            width:400,
                            funcOk : okFun,
                            funcCancel : cancelFun,
                            icon : "01"
                        }, "___importV");
                    }
                },
                onException : function(data){

                },
                timeout : 30000
            });
        },
        // 导入用户微博
        syncVInfo : function(){
            var importVURL =  apiURL + "sync_vfinfo.php";
            Utils.Io.JsLoad.request(importVURL, {
                onComplete  : function(result){
                    
                    var msg = "";
                    var confirm = winDialog.getDialog("___confirmV");
                    confirm.close();
                    if ("A00006" === result.code) {
                        var successFunc = function(){
                            location.href = "http://blog.sina.com.cn/u/"+$UID;
                        };
                        winDialog.alert("导入成功！", {
                            width:300,
                            subText : [
                                '点击“',
                                '<a href="http://control.blog.sina.com.cn/blog_rebuild/blog/controllers/setpage.php?uid=' + $UID + '&status=pageset">',
                                    '页面设置',
                                '</a>',
                                ,'”，定义认证信息显示位置'
                            ].join(''),
                            funcOk : successFunc,
                            funcClose :successFunc,
                            icon : "03"
                        }, "___importVtips");
                    } else {
                        if ("A00005" === result.code) {
                            msg = "博客账号与所绑微博登陆账号不统一，无法导入。";
                        }
                        winDialog.alert(msg, {
                            width:400,
                            funcOk : function(){
                            },
                            funcCancel : function(){},
                            icon : "01"
                        }, "___importVtips");
                    }

                },
                onException : function(data){
                },
                timeout : 30000
            });
        },
        getVerifiedType : function(type){
            var verifiedType = ["名人","政府","企业","媒体","校园","网站","应用","团体","待审企业"];
            var typeName = verifiedType[type];
            return typeName || "";
        },
        comfirmImport : function(blogerInfo){
            
            var subText = ['<div class="v_info">',
					'<p><span>昵&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称 ：</span> ',
                    blogerInfo.nick,
                    '</p>',
					'<p><span>认证类型 ：</span> ',
                    blogerInfo.verifiedTypeName,
                    ,
                    '</p>',
					'<p><span>认证说明 ：</span> ',
                    blogerInfo.verified_reason || "无",
                    '</p>',
				'</div>'].join("");
            winDialog.confirm('微博身份导入后，博客昵称将同步为微博昵称。',{
                width:400,
                subText : subText,
                funcOk : function(){
                    _this.syncVInfo();
                },
                funcCancel : function(){
                    
                },
                icon : "04"
            }, "___confirmV");
        },
        onImportV : function(){

            Lib.checkAuthor();

            if (!$isLogin) {
                var loginObj = new Lib.Login.Ui();
                loginObj.login(_this.loginSuccess);
            } else {

                _this.getWeiboInfo();
            }
            return false;
        }
    };

    scope.___importV = _this.getWeiboInfo;
    _addEvent(importBtn, _this.onImportV);

});
