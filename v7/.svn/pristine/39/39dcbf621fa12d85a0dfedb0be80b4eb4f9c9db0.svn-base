/**
 * @fileoverview 用户浏览行为统计
 * @author xy xinyu@staff.sina.com.cn
 * @date 2010-10-27
 */
$import("sina/sina.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/function/bind2.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/string/trim.js");
$import("sina/utils/io/jsload.js");
$import("sina/utils/io/ajax.js");
$import("sina/utils/excBeforeCloseWin.js");
$import("lib/LocalDB.js");


var StaticUser = Core.Class.create();
StaticUser.prototype = {
    container_id: null,
    is_init: false,
    localDB: null,
    initialize: function(cnt_id){
        this.container_id = cnt_id;
        if (!Lib.LocalDB.FlaDom) {//如果flash 还没有加载
            trace("first 加载")
            var _this = this;
            Lib.LocalDB.registerFun(function(){
                setTimeout(function(){
                    _this.loaded();
                }, 10);
            });
            Lib.LocalDB.loadFlash("trayFlashConnetion");
        }
        else {
            this.loaded();
        }
        
    },
    loaded: function(){
        var _this = this;
        if (Lib.LocalDB.get("SUKeya", 31536000000)) {//存在key,则在页面关闭时执行操作
            
             window.staticunload = function(){//离开页面时，记录用户在该页面访问的信息
             if ($IE) {
             var e = Core.Events.fixEvent(Core.Events.getEvent());
             	this.record();
             }
             else {
             	this.record();
             }
             };
             Core.Events.addEvent(window, Core.Function.bind2(window.staticunload, _this), 'beforeunload');
             
            //this.record();
        }
        else {//本机器不存在key,则需要提交一次
            Lib.LocalDB.set("SUKeya", window.staticTime + parseInt(Math.random() * 100000).toString());
            this.record();
            this.send();
        }
        
        var info = Lib.LocalDB.get("SUInfo", 31536000000);
        
        if (Lib.LocalDB.get("SULastTime", 31536000000)) {//用户上次提交信息的时间
            var lasttime = Lib.LocalDB.get("SULastTime", 31536000000);
            if ((new Date().getTime() - lasttime) > 3600000) {//上次提交时间为1小时前，则现在需要提交一次数据到服务器
                this.send();
            }
        }
        else {
            Lib.LocalDB.set("SULastTime", new Date().getTime());
        }
        
        //trace("info=" + info);
        
    },
    record: function(){
        var tmp = decodeURIComponent(Lib.LocalDB.get("SUInfo", 31536000000));
        var logininfo = "";
        
        var refer = document.referrer;
        //trace(typeof refer);
        //trace(">>>" + Lib.LocalDB.get("SULoginFlag", 31536000000) + "referer:" + refer);
        if ((ts = Utils.Cookie.getCookie('SUP')) != "") {//说明此用户已经登录了
            //记录该登录用户的uid,以及是否是博客用户-----------
            ts = decodeURIComponent(ts);
            if (ts != "") 
                logininfo += "|lu:" + ts.split('&uid=')[1].split('&')[0];
            if (scope.unreadMsg && scope.unreadMsg.isbloguser) {
                logininfo += "|ib:" + scope.unreadMsg.isbloguser;
            }
            //-----------------------------------------------

            if (!Lib.LocalDB.get("SULoginFlag")) {//说明该用户原来是未登录的，此时才记录是否主动登录
                logininfo += "|al:1|at:" + new Date().getTime();
            }
            else {
				if (refer == "") {//未知来源的漂移
					logininfo += "|al:4";
				}else if(refer.indexOf("blog.sina.com.cn")>-1){//新浪博客内漂移
					logininfo +="|al:2";
				}else{//新浪其他产品漂移来
					logininfo +="|al:3";
				}
            }
            
            if (Utils.Cookie.getCookie('ALF') != '') {
                logininfo += "|pu:1";
            }
            Lib.LocalDB.set("SULoginFlag", true);//标识该用户为已经登录用户
        }
        else {
            //if (document.referrer.indexOf("http://login.sina.com.cn/cgi/login/logout.php") > -1) {
            Lib.LocalDB.set("SULoginFlag", false);//标识该用户为未登录用户
            //}
        }
        var string = "et:" + window.staticTime + "|r:" + refer + "|u:" + window.location.href + "|lt:" + new Date().getTime().toString() + "|vu:" + scope.$uid + logininfo + ";";
        
        Lib.LocalDB.set("SUInfo", encodeURIComponent(tmp + string));
    },
    send: function(){
		var k=Lib.LocalDB.get("SUKeya", 31536000000);
		
			var t = decodeURIComponent(Lib.LocalDB.get("SUInfo", 31536000000));
			var ts = t.split(";");
			if (ts.length > 5) {
				//trace(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>开始分段提交");
				var tinfo = "";
				for (var i = 0; i < ts.length; i++) {
					if ((i + 1) % 5 == 0) {
						//staticLog(encodeURIComponent(tinfo));
						v7sendLog("StaticUser","",encodeURIComponent("k:"+k+";"+tinfo));
						tinfo = "";
					}
					else {
						tinfo += ts[i] + ";";
					}
				}
				if (tinfo != "") {
					//staticLog(encodeURIComponent(tinfo));
					v7sendLog("StaticUser","",encodeURIComponent("k:"+k+";"+tinfo));
				}
			}
			else {
				//staticLog(encodeURIComponent(t));
				v7sendLog("StaticUser","",encodeURIComponent("k:"+k+";"+t));
			}
			Lib.LocalDB.set("SUInfo", "");
			Lib.LocalDB.set("SULastTime", new Date().getTime());
		
    }
};


$registJob("static", function(){
	window.staticClass = new StaticUser();
	
    //下载应用提示浮层 by姚垚

    var dowAndroidTipDiscover = function(){
        var node_dis = document.createElement("div");
        node_dis.className = "dowAndroidTip";
        node_dis.id = "dow_AndroidTip";
        //node_dis.innerHTML = '<div class="dowAndroidTipInner"><p><span style="cursor:pointer;"id="link_down">保存此博客到手机<br />阅读随时随地</span></p><a class="close" id="close_discover" href="#" title="关闭">关闭</a></div>';
        node_dis.innerHTML = ''+ 
            '<div class="dowAndroidTipInner">' +
                '<p style="cursor:pointer;" id="save2mobile">将此博客<span>保存到手机</span></p>' +
                '<p style="cursor:pointer;" id="save2mobile2">阅读随时随地</p>' +
                '<span class="arrowMod"><span class="arrowModInner"></span></span>' +
                '<a id="close_discover" class="close" href="javascript:;" title="关闭">关闭</a>' +
            '</div>';
        $E("headarea").appendChild(node_dis);
        var inputXY = Core.Dom.getXY(document.body);
        var inputBtnXY = Core.Dom.getXY($E("blogtopoption"));
        node_dis.style.position = "absolute";
        node_dis.style.left = inputXY[0]+ 728 +"px";
        node_dis.style.top = inputBtnXY[1]-45+"px";

        //关闭按钮布码 by姚垚
        $E("close_discover").onclick = function(){
            v7sendLog('70_01_05_'+($UID||0));
            $E("dow_AndroidTip").style.visibility = "hidden";
            return false;
        };
        $E("save2mobile").onclick = $E("save2mobile2").onclick = function(e){
            Core.Events.stopEvent(e);
            v7sendLog('70_01_06_'+($UID||0));
            window.open("http://appmaster.hudee.com/sina/download.jsp?uid="+scope.$uid);
            $E("dow_AndroidTip").style.visibility = "hidden";
            //return false;
        };
    };


	//手机应用布码
	var androidBtn = Core.Dom.byClz($E("blogtopoption"), "a", "dwnAndroid");
	if( androidBtn.length ){
		androidBtn = androidBtn[0];
        if((Core.String.trim(androidBtn.innerText || androidBtn.textContent||""))==="下载应用"){
            //为下载应用浮层进行展示
            dowAndroidTipDiscover();
        }
		Core.Events.addEvent(androidBtn, function(){
			var txt = Core.String.trim(androidBtn.innerText || androidBtn.textContent||""),
				code;
			switch(txt){
				case "下载应用": code = "70_01_01_"+($UID||0); break;
				case "制作应用": code = "70_01_02_"+$UID; break;
				case "管理应用": code = "70_01_04_"+$UID; break;
				case "制作中": code = "70_01_03_"+$UID;
			}
			code && v7sendLog(code);
		});
	}
	
});
