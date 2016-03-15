/**
 * 统计，用于不需要返回值的统计。
 * 通过发出一个空的图片请求(不增加dom) 方便后端通过分析日志文件 得出数据
 * @author 武建 wujian@staff.sina.com.cn
 *  2010-9-8 11:19
 */
/**
 * 统计函数
 * @param {Object} param 参数
 * @example scope.$counter(["uid=167834895","nick=nhhhhh"])
 */
scope.msgPanelFlag=true;
scope.$counter=function(param){
	//var imgUrl="http://sjs.sinajs.cn/a.gif?"+param.join("&");
	//var img=new Image();
	//img.src=imgUrl;
	//img=null;
	
	Utils.Io.JsLoad.request("http://hits.sinajs.cn/A2/b.html?type=msg0908_01_01_" +param.join("_"), {
       onComplete: function(){
        }
    });
	
	//var imgUrl="http://hits.sinajs.cn/A2/b.html?type=msg0908_01_01_" +param.join("_");
	//var img=new Image();
	//img.src=imgUrl;
	//img=null;
};


