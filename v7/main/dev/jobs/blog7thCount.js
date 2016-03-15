$import("sina/utils/io/jsload.js");
$import("sina/ui/dialog/windowDialog.js");
$import("sina/utils/cookie/getCookie.js");
$import("sina/utils/cookie/setCookie.js");
$import("sina/core/events/stopDefaultEvent.js");
$import("lib/sendLog.js");
$import("lib/checkAuthor.js");
$import("sina/ui/dialog/windowDialog.js");
$import("lib/login/ui.js");
$registJob('blog7thCount', function() {
    Lib.checkAuthor();
    //++++++++++++++++++++++++++++++++++++++++分享按钮们++++++++++++++++++++++++++++++++++++++++++++++++++++++
    var _p_share_title ="新浪博客七周年视频  博客七周年 感谢有你";
    var _p_share_pic = "http://www.sinaimg.cn/blog/qing/image/luoyimei/video.jpg";
    var _p_share_url = "http://blog.sina.com.cn/blog_7years/blogvideo.html";
    var _p_share_text = "#新浪博客七周年#新浪博客七周年视频——《感谢有你》！感谢所有生活在新浪博客的博主们！:http://blog.sina.com.cn/blog_7years/blogvideo.html";
    var _p_share_textWeibo = "#新浪博客七周年#新浪博客七周年视频——《感谢有你》！感谢所有生活在新浪博客的博主们！http://video.sina.com.cn/v/b/84691108-2264489285.html";
    if ($E('share_db')) {
        $E('share_db').href = "javascript:void((function(){var%20u='http://shuo.douban.com/!service/share?image=&href=" + encodeURIComponent(_p_share_url) + "&name=" + encodeURIComponent(_p_share_title) +"';window.open(u,'douban','toolbar=0,resizable=1,scrollbars=yes,status=1,width=450,height=330');return%200;})());";
    }
    if ($E('share_kx')) {
        $E('share_kx').href = "javascript:void(kaixin=window.open('http://www.kaixin001.com/~repaste/share.php?&rurl="+escape(_p_share_url)+"&rtitle="+escape(_p_share_title)+"&rcontent="+escape(_p_share_text)+"','kaixin'));kaixin.focus();";
    }
    // 根据不同的杂志社显示不同的文案
    var x = "javascript:void((function(s,d,e,r,l,p,t,z,c){var%20f='http://v.t.sina.com.cn/share/share.php?appkey=2264489285&ralateUid=2264489285"
    +(scope.$ralateUid?"&ralateUid="+scope.$ralateUid:"")+"',u=z||d.location,p=['&url=',e(u),'&title=',e(t||d.title),'&content=',c||'gb2312','&pic=',e(p||'')].join('');function%20a(){if(!window.open([f,p].join(''),'mb',['toolbar=0,status=0,resizable=1,width=440,height=430,left=',(s.width-440)/2,',top=',(s.height-430)/2].join('')))u.href=[f,p].join('');};if(/Firefox/.test(navigator.userAgent))setTimeout(a,0);else%20a();scope.weiboLog();})(screen,document,encodeURIComponent,'','','"+_p_share_pic+"','"+_p_share_textWeibo+"','"+_p_share_url+"','utf-8'));";
    //x = encodeURIComponent(x);
    if ($E('share_weibo')) {
        $E('share_weibo').href = x;

    }
    scope.weiboLog = function() {
        v7sendLog("50_01_07");
    }
    if ($E('share_rr')) {
        $E('share_rr').href = "javascript:void(function(){var renren=window.open('http://share.renren.com/share/buttonshare.do?link="+encodeURIComponent(_p_share_url)+"&title="+_p_share_title+"&content="+encodeURIComponent(_p_share_text)+"');}())";
    }
    //++++++++++++++++++++++++++++++++++++++++分享按钮们++++++++++++++++++++++++++++++++++++++++++++++++++++++
    var userLoginDiv = $E("userLoginDiv");
    var userLogin = $E("userLogin");
    if(userLoginDiv) {
        if($isLogin) {
            var html =   '你好，<a target="_blank" href="http://blog.sina.com.cn/u/'+$UID+'" class="nikename">'+$nick.substring(0,6)+'</a><a href="http://login.sina.com.cn/cgi/login/logout.php">退出</a>';
            userLoginDiv.innerHTML = html;
        };
        if(userLogin) {
            userLogin.onclick = function() {
                new Lib.Login.Ui().login( function() {
                    location.reload();
                });
                return;

            }
        }
    };
    var myThx =$E("myThx");
    var didThx =$E("didThx");
    var thxCount =$E("thxCount");
    var allCount = 0;
    var  isThx = Utils.Cookie.getCookie("blog7Thx");

    if(isThx) {
        didThx.style.display = "";
        myThx.style.display  ="none";
    }

    function addZero (obj) {
        var zero;
        obj =""+obj;
        if(obj.length <8) {
            zero = 8 - obj.length;
        };
        var temp ="";
        for(var i =0; i<zero;i++) {
            temp +="0"
        };
        return temp + obj;
    }

    function callCount() {
        Utils.Io.JsLoad.request("http://control.blog.sina.com.cn/blog_7years/videoNum.php", {
            onComplete: function(result) {
                if(result.code == "A00006") {
                    thxCount.innerHTML = addZero(result.data.message);
                    allCount = result.data.message;
                    Utils.Cookie.setCookie("blog7Thx", "true");
                } else {

                }

            },
            GET: {
                type:1,
                n:Math.random()
            }

        });
    };

    callCount();
    if(myThx) {
        myThx.onclick = function(e) {
            // console.log(11)
            if(isThx)
                return;
            Core.Events.stopDefaultEvent(e);
            v7sendLog("50_01_11");

            Utils.Io.JsLoad.request("http://control.blog.sina.com.cn/blog_7years/videoNum.php", {
                onComplete: function(result) {
                    if(result.code == "A00006") {
                        myThx.style.display = "none";
                        didThx.style.display  = "";
                        thxCount.innerHTML = addZero(parseInt(result.data.message)+parseInt(allCount));

                    } else {
                        var sucdlg = winDialog.alert(result.data.message, {
                            funcOk: function() {
                            },
                            textOk: "确定",
                            title: "提示",
                            icon: "01" // 可选值："01"、"02"、"03"、"04"、"05"
                        });
                    }

                },
                GET: {

                    n:Math.random()
                }

            });
        }
    }
    var timer = setInterval(callCount,5000);

});