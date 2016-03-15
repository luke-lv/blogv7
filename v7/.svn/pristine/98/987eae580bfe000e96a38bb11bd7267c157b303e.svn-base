/**
 * @desc	活动站头像漂浮墙
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("sina/sina.js");
$import("sina/ui/tween.js");
$import("sina/core/dom/setStyle.js");

(function(){
	
	var parent = $E('many_person');
	if(!parent) return;
	
	parent.innerHTML = "";
	var _len = scope.floats || 20;
	
	var moveTimer = 0;
	var shiftTimer = 0;
	var zindex = 10;
	
	var leftrang = 485-50;					// 这两个是放置图片的长和宽度，50是图片的宽度
	var heightrang = 293-50;
	
	var persw = scope.persw || [];
	
	var firstThreads = true;
	
	
	// 创建、格式化容器。once！
	var div_arr = [];
	var _div;
	
	for(i=0; i<_len; i++){
		_div = $C("div");
		Core.Dom.setStyle(_div, "opacity", 0);		// 头像容器透明
		
		_div.setAttribute('zIndex', zindex);
		_div.onmouseover = function(){
			this.style.zIndex = 1000;
			clearTimer();
		};
		_div.onmouseout=function(){
			this.style.zIndex = this.getAttribute('zIndex');
			startTimer();
		};
		
		zindex++;
		div_arr.push(_div);
		
		parent.appendChild(_div);
	}
	
	// 
	changeHead();
	show();
	startTimer();
	startMov();
	
	
	
	
	
	// 
	function changeHead(){
		var _div;
		var _len = div_arr.length;
		var luckyArr = luckySelect(persw.length, _len);
		
		firstThreads = true;
		
		for(i=0; i<_len; i++){
			_div = div_arr[i];
			
			_div.setAttribute('xflag', Math.random()>0.5 ? -1:1);
			_div.setAttribute('yflag', Math.random()>0.5 ? -1:1);
			
			_div.innerHTML = '\
				<a href="http://blog.sina.com.cn/u/' + persw[luckyArr[i]] + '" target="_blank">\
					<img src="' + getPhoto(persw[luckyArr[i]]) + '"/>\
				</a>';
			_div.style.cssText += "\
				; background-image:url(http://simg.sinajs.cn/blog7actstyle/images/bg_faceline.jpg)\
				; padding:4px\
				; position:absolute\
				; z-index:" + zindex + "\
				; left:" + (Math.floor(Math.random()*leftrang)) + "px\
				; top:" + (Math.floor(Math.random()*heightrang)) + "px\
				; width:50px\
				; height:50px;";
		}
	}
	
	// 移动动画
	function startMov(){
		moveTimer = setInterval(function(){
			move();
		}, 50);
	}
	function clearMov(){
		clearInterval(moveTimer);
	}
	
	// 计时切换。不用 setInterval。
	function startTimer(){
		shiftTimer = setTimeout(function(){
			var _len = div_arr.length;
			
			for(i=0; i<_len; i++){
				Ui.tween(div_arr[i], ["opacity"], [0], 0.7, "simple", {
					end: function(){
						if(firstThreads){
							firstThreads = false;
							clearMov();
							
							changeHead();
							show();
							startTimer();
							
							startMov();
						}
					}
				});
			}
		}, 1000*5);
	}
	function clearTimer(){
		clearTimeout(shiftTimer);
	}
	
	
	// 头像显现
	function show(){
		for(i=0; i<div_arr.length; i++){
			Ui.tween(div_arr[i], ["opacity"], [1], 0.7, "simple");
		}
	}
	
	
	// 移动头像
	function move(){
		for(i=0; i<div_arr.length; i++){
			var o = div_arr[i];
			if(o.style.zIndex == 1000) continue;		// hover 者，不移动
			
			var l = parseInt(o.style.left, 10);
			var t = parseInt(o.style.top, 10);
			
			var xf = +o.getAttribute("xflag");
			var yf = +o.getAttribute("yflag");
			
			if(l>leftrang || l<0) o.setAttribute("xflag", xf*-1);			// 方向反置
			if(t>heightrang || t<0) o.setAttribute("yflag", yf*-1);
			
			if(+o.getAttribute("xflag") == 1) o.style.left = (l+1)+"px";
			else o.style.left = (l-1)+"px";
			
			if(+o.getAttribute("yflag") == 1) o.style.top = (t+1)+"px";
			else o.style.top = (t-1)+"px";
		}
	};
	
	// 获取头像地址
	function getPhoto(id){
		return "http://portrait" + ((+id) % 8 + 1) + ".sinaimg.cn/" + id + "/blog/50";
	}
	
	//根据长度，从中选择 10 个。排重。
	function luckySelect(length, qua){
		var result = [];
		var serv = [];
		var curIdx;
		var i;
		
		// 与原数组同长度的递增序列。
		for(i=0; i<length; i++){
			serv.push(i);
		}
		
		// 源数组长度不够，则取小。
		qua = length < qua ? length : qua;
		for(i=0; i<qua; i++){
			curIdx = Math.ceil(Math.random()*(length-i-1));
			result.push(serv[curIdx]);
			serv.splice(curIdx, 1);
		}
		return result;
	}
	
})();





