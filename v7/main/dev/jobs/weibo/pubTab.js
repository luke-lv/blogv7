/**
 * @fileoverview 长微博切换输入类型
 * @author Book | liming9@staff.sina.com.cn
 * @date 2012-03-20
 */
$import("sina/core/events/addEvent.js");
$import("sina/core/events/fireEvent.js");
$import('sina/core/system/getParam.js');
$import("lib/dialogConfig.js");
$import("lib/winDialogEx.js");
$import("sina/utils/io/ajax.js");

$registJob('pubTab', function(){
    var _el_blog = $E("writeBlog"),
        _el_url = $E("pasteUrl"),
        _el_blogwrap = $E("blogWrap"),
        _el_urlwrap = $E("urlWrap");
    //写文章
    Core.Events.addEvent(_el_blog, function(){
        _el_url.className = "cur";
        _el_urlwrap.style.display = "none";
        _el_blog.className = "";
        _el_blogwrap.style.display = "";
        if( $E("myArtListWrap") ){
             $E("myArtListWrap").style.display = "none";
        }
    });
    //贴链接
    Core.Events.addEvent(_el_url, function(){
        _el_url.className = "";
        _el_urlwrap.style.display = "";
        _el_blog.className = "cur";
        _el_blogwrap.style.display = "none";
    });

    
    var url = Core.System.getParam("url");
    if( url ){
        //贴链接，没有url都是写文章
        _el_url.className = "";
        _el_urlwrap.style.display = "";
        _el_blog.className = "cur";
        _el_blogwrap.style.display = "none";
        url.length>7 && ($E("urlInput").value=url);
    }
    
    //从预览页点击发布按钮
    window.pub2sinawb = function(){
        Core.Events.fireEvent(_el_blogwrap.style.display==="none"?
            $E("pubToWeiboUrl"):$E("pubToWeibo"), "click");
    };
    
    var _url = "http://control.blog.sina.com.cn/t_sina_blog/bind_weibo_auto.php";
    var prv = scope.$private;
    //新增自动绑定微博,如果没有绑定成功，就让用户手动绑定
    if(prv && (!prv.t_sina || !prv.oauth_token || !prv.oauth_token_secret)){
        //此条件是新老用户（没有绑定微博） 
        if(!prv.unbind){
            //没有解绑过（证明是新用户）
            Utils.Io.Ajax.request(_url, {
                returnType : 'json',
                onComplete : function(data){
                    if(data.code === "A00006"){
                        //新用户自动绑定成功
                        // console.log("bindweibo success");
                        return;
                    }else{
                        //新用户手动绑定
                         bindWeibo();
                    }
                },
                onException: function(){}
            });
        }else{
            //新老用户 解绑过 手动绑定
            bindWeibo();
        }    
    }
    function bindWeibo(){
        var dialog, bindDialog = function(){
            dialog = winDialogEx.alert("发表长微博，请先用博客帐号绑定新浪微博", {
                funcOk: function(){
                    bindDialog();
                    var bwin = window.open("http://control.blog.sina.com.cn/t_sina_blog/bind_weibo_form.php?from=changweibo",
                        'bindweibo', 'toolbar=0,status=0,resizable=1,width=630,height=530,left=' + (screen.width-630)/2 + ',top=' + (screen.height - 530) / 2);
                    setTimeout(function(){
                        bwin && bwin.focus && bwin.focus();
                    }, 15);
                },
                funcClose: function(){
                    // bindDialog();
                },
                textOk: '<img align="absmiddle" width="15" height="15" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon51">绑定新浪微博'
            });
        };
        bindDialog();
        window.bindWeiboSuc = function(){
            if(dialog){dialog.close();dialog = null}
            dialog = winDialog.alert("您的博客帐号，已成功绑定微博！可以直接发布到新浪微博", {
                icon: "03",
                textOk: '确定'
            });
            setTimeout(function(){
                if(dialog){dialog.close();dialog = null}
            }, 3000);
        };
    }

});
