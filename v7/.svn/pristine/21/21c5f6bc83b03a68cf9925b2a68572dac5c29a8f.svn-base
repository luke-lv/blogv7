/*
 * Copyright (c) 2007, Sina Inc. All rights reserved.
 * @fileoverview 随便逛逛
 */
$import("lib/lib.js");
$import("sina/core/class/create.js");
$import("sina/sina.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/fireEvent.js");
$import("sina/core/function/bind2.js");
$import("sina/utils/flash/swf.js");
$import("sina/core/system/pageSize.js");
$import("sina/core/system/getScrollPos.js");
$import("sina/core/system/winSize.js");
$import("sina/utils/io/jsload.js");
$import("lib/sendLog.js");
$import("other/SinaEx.js");
/**
 * @fileoverview 7.0版本中的随便逛逛移植自6.0，早先由朝亮、李明完成
 *
 * @author stan | chaoliang@staff.sina.com.cn
 *
 * @modified L.Ming | liming1@staff.sina.com.cn
 * @modified xy xinyu@staff.sina.com.cn
 * 			 2009-09-03
 * @modified xiaoyue | xiaoyue3@staff.sina.com.cn 2013——
 */
Lib.RandomStroll = Core.Class.create();
Lib.RandomStroll.prototype = {
	link_url:null,
    swf_url: $_GLOBAL.flashBasicURL + "lookViewSpring.swf?2",
    initialize: function(urllist){
    	this.link_url = urllist && urllist[ Math.floor(Math.random() * urllist.length) ];
//        var div = $C("div");
//        div.id = "ramdomVisitDiv";
//        div.style.position = "absolute";
//        div.style.top = scope._AD_HEIGHT ? (scope._AD_HEIGHT+30)+'px':"30px";
//        div.style.width = "140px";
//        div.style.zIndex="101";
        var div = SinaEx.createNode('<div id="ramdomVisitDiv" style="position:absolute;width:140px;z-index:101;"></div>');
        div.style.top = scope._AD_HEIGHT ? (scope._AD_HEIGHT+30)+'px':"30px";
        document.body.appendChild(div);
		
		//var tm = Math.floor(Math.random() * uidlist.length);
		//var uid = uidlist[tm];//新接口返回的是个性域名数组

		// var a = document.createElement("span");
		// 	a.id = 'openwin';
		// 	//a.setAttribute("href", link_url + "/" + uid);
		// 	// a.setAttribute("href", urllist[ Math.floor(Math.random() * urllist.length) ]);
		// 	// a.setAttribute("target", "_blank");
		// 	a.style.position = 'absolute';
		// 	a.style.top = '30px';
		// 	//a.style.left = (Core.System.winSize().width - 133) + 'px';
		// 	a.style.right = '0px';
		// 	a.style.width = '140px';
		// 	a.style.height = '87px';
		// 	a.style.zIndex = '100';
		// 	a.style.backgroundColor = '#fff';
		// 	if ($IE){
		// 		a.style.filter = 'alpha(opacity=0)';
		// 	}
		// 	else{
		// 		a.style.opacity = 0;
		// 	}
		// a.style.display = 'none';
		

		// document.body.appendChild(a);

		// Core.Events.addEvent("ramdomVisitDiv", function(e){
		// 	var e = Core.Events.fixEvent(e);
		// 	var win = Core.System.winSize();
		// 	if (win.width - e.clientX < 105 && e.clientY < 110){
		// 		setTimeout(function(){
		// 			//var tm = Math.floor(Math.random() * uidlist.length);
		// 			//var uid = uidlist[tm];//新接口返回的是个性域名数组
		// 			//$E('openwin').setAttribute("href", link_url + "/" + uid);
		// 			$E('openwin').setAttribute("href", urllist[ Math.floor(Math.random() * urllist.length) ]);
		// 			$E('openwin').style.display = '';
		// 		}, 150);
		// 	}
		// }, "mousemove");

		// Core.Events.addEvent("openwin", function(){
			
		// }, $IE ? "mouseenter" : "mouseover");
		
		// Core.Events.addEvent("openwin", function(){
		// 	$E('openwin').style.display = 'none';
			
		// }, $IE ? "mouseleave" : "mouseout");

		// this.a = a;
        this.div = div;
        this.lock();
        Core.Events.addEvent(window, function(){
            this.lock();
        }.bind2(this), "resize");
        Core.Events.addEvent(window, function(){
            this.lock();
        }.bind2(this), "scroll");
    },
    load: function(option){
        //{xmlURL: "xml/demo.xml", URL: "http://www.sina.com.cn"}
        Utils.Flash.swfView.Add(this.swf_url, "ramdomVisitDiv", "map", "140", "87", "8.0.0.0", "#000", {url:this.link_url}, {
            scale: "noscale",
            allowScriptAccess: "always",
            wmode: "transparent"
        });
        // alert("122");
        // Utils.Flash.swfView.Init();
    },
    lock: function(){
//        var scrpos = Core.System.getScrollPos();
        //		var str='';
        //		for(var i=0;i<scrpos.length;i++)
        //			str+=i+':'+scrpos[i]+";";
        //		trace('scroll pos='+str);
        //		str='';
//        var ppos = Core.System.pageSize();
        //		for(var i=0;i<ppos.length;i++)
        //			str+=i+':'+ppos[i]+";";
        //		trace('ppos pos='+str);
        //		
        //		trace('left='+Core.Dom.getLeft($E('ramdomVisitDiv')));
        //        var w = Core.System.pageSize()[2];
        //this.div.style.right = "0px";
//        var left = scrpos[1] + ppos[2] - 141;
//        if (window.innerWidth){
//			left -= 17;
//		}
        //this.div.style.left = left + 'px';
		//this.a.style.left = left + 'px';
        this.div.style.right = '0px';
		// this.a.style.right = '0px';
    },
    show: function(){
        $E("ramdomVisitDiv").style.display = "";
    },
    hide: function(){
        $E("ramdomVisitDiv").style.display = "none";
    }
};

//此方法放在最外面，是方便flash进行回调，好进行布码统计  @modified xiaoyue3@staff
function clickSendRandomLog(){
	v7sendLog("79_01_14", scope.$pageid, "");
}

function mouseoverSendRandomLog(){
	v7sendLog("79_01_13", scope.$pageid, "");
}



//Lib.RandomStroll.getRandomURL = function(url, link_url, rand, isSendLog){
//	var s = /\D/;
	/*
	if (s.test(uid)){
		//window.location.href = link_url + "/" + uid;
		//window.open(link_url + "/" + uid, '_self');
	}else{
		//window.location.href = link_url + "/" + uid;
		//window.open(link_url + "/" + uid, '_self');
	}
	//window.location.href = link_url + "/u/" + uid;
	*/
//};
/*
Lib.RandomStroll.GoUrlByConfig = {
    go: function(cnf){
        if (cnf && cnf.length) {
            var length = cnf.length;
            for (var i = 0; i < length; i++) {
                this.randomByProbability(cnf[i].probability, cnf[i].url);
            }
        }
    },
    randomByProbability: function(probability, url){
        var num = Boot.getRandomNum(1, probability);
        if (num == 1) {
            window.location.href = url;
        }
    }
};
*/
