/**
 * @fileoverview 渲染访问统计页面 右侧
 * @author 武建 zouwujian@sina.com 
 * @created 2010-5-5
 */
$import("sina/sina.js");
$import("sina/utils/flash/swfObject.js");
$import("sina/core/math/getRandomNumber.js");
$import("lib/interface.js");
$import("sina/utils/io/jsload.js");
$import("sina/core/string/formatNumber.js");

$registJob("visite_count", function(){
	window.visiteCount=new scope.visite_count();	
});

/**
 * 渲染 访问统计页面类
 */

 scope.visite_count=Core.Class.create();
 
 scope.visite_count.prototype={
 	/**
 	 * flash 地址
 	 */
	chartURL:$_GLOBAL.flashBasicURL+"chart.swf",
	pieURL:$_GLOBAL.flashBasicURL+"pie.swf",
	/**
	 * flash 容器
	 */	
	chartCon:"chartSWF",
	pieCon:"pieSWF",
	/**
	 * flash 节点
	 */
	chartNode:null,
	pieNode:null,
	/**
	 * 访问数据 json调用地址       
	 */
	dataURL:"http://sjs.sinajs.cn/visite_count.js.php",
	/**
	 * 调用接口
	 */
	interfaceObj:null,
	/**
	 *  data
	 */
	chartData:null,
	chartNum:null,
	lastUpdateTime:null,
	nowDate:null,
	pieData:null,
	/**
	 * 初始化函数
	 */
	initialize:function(){	
		this.checkFlashVersion();			
	},
	/**
	 * 检查flash版本
	 */
	checkFlashVersion:function(){
		var ver=deconcept.SWFObjectUtil.getPlayerVersion();
		if(ver.major>=9){
			this.initChartSwf();		
			if(scope.$nClass){
				this.initPieSwf();		
			}			
		}else{
			this.showUpTips();			
		}		
	},
	/**
	 * 显示 升级提示
	 */
	showUpTips:function(){		
		$E("chartSWF").style.cssText="width:680px;height:230px;";
		$E("pieSWF").style.cssText="width:320px;height:270px;";
		$E("pieSWF").innerHTML=$E("chartSWF").innerHTML='您可以在<a href="http://get.adobe.com/flashplayer/" target="_blank">此处下载免费的Adobe flash player installer</a>。成功安装程序后，可返回此处查看。';
	},
	/**
	 * 加载chart swf
	 */
	initChartSwf:function(){
		var FlashPlayer = new Utils.Flash.swfObject(this.chartURL+"?t="+Core.Math.getRandomNumber(10,10000), "chart", "680", "230", "9.0");
		FlashPlayer.addParam("quality", "high");			
		FlashPlayer.addParam("allowScriptAccess", "always");			
		FlashPlayer.write(this.chartCon);		
	},	
	/**
	 * chart ready
	 */
	chartReady:function(){
		this.chartNode = $E("chart");
		trace("chart swf 加载完毕");	
		var _this=this;	
		
		setTimeout(function(){
			_this.chartNode.renderChart(scope.chartAndPieData.chart);
		},500);
		
	},
	/**
	 * 加载 pie swf
	 */
	initPieSwf:function(){
		if($E(this.pieCon))
		{
			var FlashPlayer = new Utils.Flash.swfObject(this.pieURL+"?t="+Core.Math.getRandomNumber(10,10000), "pie", "320", "270", "9.0");
			FlashPlayer.addParam("quality", "high");			
			FlashPlayer.addParam("allowScriptAccess", "always");
		//FlashPlayer.addParam("wmode", "transparent");
			FlashPlayer.write(this.pieCon);			
		}
		
	},
	/**
	 * pie flash 加载完毕
	 */
	pieReady:function(){
		
		this.pieNode=$E("pie");
		var _this=this;
		//alert(scope.chartAn);
		setTimeout(function(){_this.pieNode.renderPie(scope.chartAndPieData.pie);},500);
		
	}	
	
 };
