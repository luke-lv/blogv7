/**
 * 时间处理类 
 */

/**格式化日期原型控制  yyyy-M-dd*/
$import("sina/sina.js");

window.dayArray = [31,28,31,30,31,30,31,31,30,31,30,31];

var DateSelector = function(cfg)
{	
	window.startTime = {};
	window.endTime = {};
	
	//trace("----CFG TEST----"+trimHeadZero(cfg.from.substring(5, 7)));
	//var justtest = "----CFG TEST----"+trimHeadZero(cfg.from.substring(5, 7));
	//判断一下, 设置开始时间
	if(typeof(cfg.from) != 'undefined')
	{
		//trace("----CFG HAVE VALUE----");
		window.startTime = {
			year	:parseInt(cfg.from.substring(0, 4), 10),
			month	:parseInt(trimHeadZero(cfg.from.substring(5, 7)), 10),
			day		:parseInt(trimHeadZero(cfg.from.substring(8, 10)), 10),
			hh		:parseInt(trimHeadZero(cfg.from.substring(11, 13)), 10),
			timeobj	:null
		}
	}
	else
	{
		var nowTime = new Date();
		//trace(nowTime.getFullYear()+" "+nowTime.getMonth()+" "+nowTime.getDate());
		window.startTime = {
			year	:parseInt(nowTime.getYear(), 10),
			month	:parseInt(nowTime.getMonth(), 10),
			day		:parseInt(nowTime.getDate(), 10),
			hh		:parseInt(nowTime.getHours(), 10),
			timeobj	:null
		}
		
	}
	
	var timeobj = new Date();
	timeobj.setFullYear(window.startTime.year);
	timeobj.setMonth(window.startTime.month-1);
	timeobj.setDate(window.startTime.day);
	timeobj.setHours(window.startTime.hh);
		
	window.startTime.timeobj = timeobj;
	
	//设置结束时间
	var nextTime = new Date(window.startTime.timeobj);
	
	if (articleEditorCFG.articlevData == null) {
		if (typeof(cfg.to) != 'undefined') {
			var dtype = cfg.to.split('-')[0];
			if (dtype == 'y') {
				nextTime.setFullYear(nextTime.getYear() + parseInt(cfg.to.split('-')[1]), 10);
			}
			else 
				if (dtype == 'm') {
					//trace(dtype + '|>----' + nextTime.getMonth());
					nextTime.getMonth()
					var tempMonth = nextTime.getMonth() + parseInt(cfg.to.split('-')[1], 10);
					nextTime.setMonth(tempMonth);
					//trace('DATE----' + nextTime);
				}
				else 
					if (dtype == 'd') {
						nextTime.setDate(nextTime.getDate() + parseInt(cfg.to.split('-')[1], 10));
					}
					else 
						if (dtype == 'h') {
							nextTime.setHours(nextTime.getHours() + parseInt(cfg.to.split('-')[1], 10));
						}
		}
		else {
			nextTime.setMonth(nextTime.getMonth() + 2);
		}
	}
	else {
		var tempExpire = articleEditorCFG.articlevData.expireTime;
		
		nextTime.setFullYear(parseInt(tempExpire.substring(0, 4), 10));
		nextTime.setMonth(parseInt(trimHeadZero(tempExpire.substring(5, 7)), 10)-1);
		nextTime.setDate(parseInt(trimHeadZero(tempExpire.substring(8, 10)), 10));
		nextTime.setHours(parseInt(trimHeadZero(tempExpire.substring(11, 13)), 10), 0, 0);
		
		//trace("----NEW DATE----"+nextTime);
	}
	
	window.endTime = {
		year	:parseInt(nextTime.getFullYear(), 10),
		month	:parseInt(nextTime.getMonth(), 10),
		day		:parseInt(nextTime.getDate(), 10),
		hh		:parseInt(nextTime.getHours(), 10),
		timeobj	:nextTime
	}
	
	//添加节点事件
	$E('year').onchange = function(){
		valueChange('year');
	}
	$E('month').onchange = function(){
		valueChange('month');
	}
	$E('day').onchange = function(){
		valueChange('day');
	}
	$E('hh').onchange = function(){
		valueChange('hh');
	}
	
	//渲染节点
	rederDateItems();
}

var valueChange = function(stype)
{
	var d_e_obj = window.endTime;
	var month = $E('month').value;
	var days = window.dayArray[month-1];
	
	//trace(month+"----"+days);
	//判断润年
	if(month == 2 && (stype == 'month' || stype == 'year'))
	{
		if(isSpecialYear(parseInt($E('year').value, 10)))
		{
			days = 29;
			$E('day').options.length = 0;
			for (var m = 1; m <= days; m++) {
				var opt = new Option(m, m);
				if (opt.value == d_e_obj.day) 
					opt.selected = true;
				
				$E('day').options.add(opt);
			}
		}else {
			$E('day').options.length = 0;
			for (var m = 1; m <= days; m++) {
				var opt = new Option(m, m);
				if (opt.value == d_e_obj.day) 
					opt.selected = true;
				
				$E('day').options.add(opt);
			}
		}
	}
	
	if (stype == 'month') 
	{
		$E('day').options.length = 0;
		for (var m = 1; m <= days; m++) {
			var opt = new Option(m, m);
			if (opt.value == d_e_obj.day) 
				opt.selected = true;
			
			$E('day').options.add(opt);
		}
	}
	
	var selectDate = new Date(parseInt($E('year').value, 10), parseInt($E('month').value, 10), parseInt($E('day').value, 10), parseInt($E('hh').value, 10));
	
	//强制选择当前日期之后
	//和需求不合, 先注释掉
	/*
	if(dateCompare(selectDate, new Date()))
	{
		rederDateItems();
	}
	*/
}

var rederDateItems = function()
{
	var d_s_obj = window.startTime;
	var d_e_obj = window.endTime;
	
	var currentMonth = 0;
	
	//渲染年
	$E('year').options.length = 0;
	for(var y=0;y<=2;y++)
	{
		var opt = new Option(d_s_obj.year+y, d_s_obj.year+y);
		$E('year').options.add(opt);
		
		if(opt.value == d_e_obj.year)
			opt.selected = true;
	}
	//渲染月
	$E('month').options.length = 0;
	for (var m = 0; m <= 11; m++) 
	{
		var opt = new Option(m+1, m+1);
		
		$E('month').options.add(opt);
		if ((parseInt(d_e_obj.month, 10)+1) == parseInt(opt.value+"", 10)) {
			currentMonth = m;
			opt.selected = true;
		}
	}
	//alert($E('month').innerHTML+"........."+currentMonth+"........."+d_e_obj.month+"........."+(parseInt(d_e_obj.month, 10)+1));
	//渲染日
	$E('day').options.length = 0;
	for(var d=1;d<=window.dayArray[currentMonth];d++)
	{
		var opt = new Option(d, d);
		
		$E('day').options.add(opt);
		if(opt.value == d_e_obj.day)
			opt.selected = true;
	}
	//渲染小时
	$E('hh').options.length = 0;
	for(var h=0;h<=23;h++)
	{
		var opt = new Option(h, h);
		$E('hh').options.add(opt);
		
		if(opt.value == d_e_obj.hh)
			opt.selected = true;
	}
}
/**去掉头部的0*/
function trimHeadZero(str)
{
	//trace("----TRIM----"+str);;
	return str.replace(/^0/, '');
}

/**时间比较*/
function dateCompare(date1, date2)
{
	return ((date1.getTime())<(date2.getTime()));
}

/**是否为润年*/
function isSpecialYear(year)
{
	return (new Date(year, 2, 0).getDate() == 29);
}