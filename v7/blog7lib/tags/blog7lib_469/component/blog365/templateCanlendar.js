/**
 * @fileoverview 博客365——模版页面365日历
 * @author gaolei | gaolei2
 * @date 2012-11-20
 */

$import("lib/util/hoverJq.js");
$import("lib/classUtils.js");
$import("sina/utils/io/jsload.js");
$import("sina/core/array/foreach.js");
$import("lib/checkAuthor.js");
$import("lib/sendLog.js");

;(function (){
	if (scope.tpl !== "8_52"){
		return;
	}

	Lib.checkAuthor();
	var tmp ='<ul id="blog365_calCon">' +
						'<li class="d1"><div class="pic"></div></li>' +
						'<li class="d2"><div class="pic"></div></li>' +
						'<li class="d3"><div class="pic"></div></li>' +
						'<li class="d4"><div class="pic"></div></li>' +
						'<li class="d5"><div class="pic"></div></li>' +
						'<li class="d6"><div class="pic"></div></li>' +
						'<li class="d7"><div class="pic"></div></li>' +
						'<li class="d8"><div class="pic"></div></li>' +
						'<li class="d9"><div class="pic"></div></li>' +
						'<li class="d10"><div class="pic"></div></li>' +
						'<li class="d11"><div class="pic"></div></li>' +
						'<li class="d12"><div class="pic"></div></li>' +
						'<li class="d13"><div class="pic"></div></li>' +
						'<li class="d14"><div class="pic"></div></li>' +
						'<li class="d15"><div class="pic"></div></li>' +
						'<li class="d16"><div class="pic"></div></li>' +
						'<li class="d17"><div class="pic"></div></li>' +
						'<li class="d18"><div class="pic"></div></li>' +
						'<li class="d19"><div class="pic"></div></li>' +
						'<li class="d20"><div class="pic"></div></li>' +
						'<li class="d21"><div class="pic"></div></li>' +
						'<li class="d22"><div class="pic"></div></li>' +
						'<li class="d23"><div class="pic"></div></li>' +
						'<li class="d24"><div class="pic"></div></li>' +
						'<li class="d25"><div class="pic"></div></li>' +
						'<li class="d26"><div class="pic"></div></li>' +
						'<li class="d27"><div class="pic"></div></li>' +
						'<li class="d28"><div class="pic"></div></li>' +
						'<li class="d29"><div class="pic"></div></li>' +
						'<li class="d30"><div class="pic"></div></li>' +
						'<li class="d31"><div class="pic"></div></li>'+
						'<li class="actpage"><div class="pic"><a title="活动页" target="_blank" href="http://qing.blog.sina.com.cn/tag/365"></a></div></li>'+
					'</ul>'+
					'<div class="wdate" id="blog365_dateNum"></div>';

	var url = 'http://control.blog.sina.com.cn/riaapi/activity/get_blog365.php?data=1';
	preRender();

	Utils.Io.JsLoad.request(url, {
		GET: {
			uid: scope.$uid || ""
		},
		onComplete : function(result){
			if (result.code && result.code === "A00006"){
				// console.log(result.data)
				renderHTML(result.data);
			}
		}
	});

	
	function preRender(){
			var div = $C("div");
			div.className = "module365";
			div.style.position = "absolute";
			div.style.top = "0px";
			div.style.right = "0px";
			div.style.zIndex = "200"
			div.innerHTML = tmp;
			
			$E("headarea") && $E("headarea").appendChild(div);
			
			var children = $E("blog365_calCon") && $E("blog365_calCon").children;
		
			//现在的时间
			var 	now = new Date(),
					day = now.getDate(),
					year = now.getFullYear(),
					month = now.getMonth()+1;	//getMonth返回0-11
			
			var t1 = now.getTime();
			var t2 = new Date(year,0,1).getTime();
			var time = t1-t2;
			if (time == 0){
				time = 1;
			}else{
				time = Math.floor(time/(24*60*60*1000))+1;
			}
			$E("blog365_dateNum").innerHTML = time;	//计算今年1月1日到今天是第多少天
			
			// var isAdmin = ($UID == scope.$uid);
			if ($isAdmin){
				//今天节点的操作
				var 	today = children[day-1];
						todayDiv = today.getElementsByTagName("div")[0];
						
				today.className += " today";
				var html = '<a onclick="v7sendLog(\'48_01_22\')" href="http://control.blog.sina.com.cn/admin/article/article_add.php?tag365" target="_blank"><span class="rectoday" title="记录今天"></span></a>';
				todayDiv.innerHTML = html;

				//将来节点的操作
				var monthDays = daysNum(year, month);
				for (var j=day; j<monthDays; j++){
					var 	child = children[j],
							childDiv = child.getElementsByTagName("div")[0];
							
					child.className += " coming";
					var preTime = year+'-'+month+'-'+(j+1);
					var html = '<a onclick="v7sendLog(\'48_01_23\')" href="http://control.blog.sina.com.cn/admin/article/article_add.php?tag365='+preTime+'" target="_blank"><span class="tq">提前<br>记录</span></a>';
					childDiv.innerHTML = html;
				}
			}
			

	}
	
	function renderHTML(data){

		var children = $E("blog365_calCon") && $E("blog365_calCon").children;
		
		//现在的时间
		var 	now = new Date(),
				day = now.getDate(),
				year = now.getFullYear(),
				month = now.getMonth()+1;	//getMonth返回0-11
		
		//返回当月的数据
		for (var item in data){
			var i = item.split("-")[2]-1;//因为日期从1开始，而DOM数组从0开始
			
			var 	child = children[i],
					childDiv = child.getElementsByTagName("div")[0];

			if (data[item].pre && data[item].href){//如果预置
				child.className = "d"+(i+1)+" writed";
				var html = '';
				if ($isAdmin){
					html = '<a href="'+data[item].href+'" target="_blank" ><span class="date">'+(i+1)+'日</span></a>'
					childDiv.innerHTML = html;
				}
				childDiv.innerHTML = html;
			}else{
				if (i === (day-1)){
					child.className = "d"+day;
				}
				var href, html;
				href = (data[item].href) ? data[item].href : "javascript:void(0);"; 
				target = (data[item].href) ? "_blank" : "";
				if (data[item].src && data[item].src.indexOf("sinaimg.cn")>=0){//IE7,8,9空白img标签会显示默认小图标，删掉
					html = '<a href="'+href+'" target="'+target+'"><img src="'+data[item].src+'"/><span class="date">'+(i+1)+'日</span></a>';
				}else{
					html = '<a href="'+href+'" target="'+target+'"><span class="date">'+(i+1)+'日</span></a>';
				}
				childDiv.innerHTML = html;
			}
		}
	};
	
	// 返回当月的天数
	function daysNum(y, m){
		var isLeap = function(y){
			return y%400?(y%100?(y%4?0:1):0):1;
		};
		if (!y*m){
			return 0;
		}
		var d = 31;
		switch(m){
            case 4:
            case 6:
            case 9:
            case 11:
                d = 30;
                break;
            case 2:
                d = isLeap(y) ? 29 : 28;
                break;
        }
        return d;
	}
})();