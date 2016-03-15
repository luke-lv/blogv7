/**
 * @fileoverview 获得图片的路径
 * @author xinyu@staff.sina.com.cn
 */

(function(){
	var getImgStaticPath=function(pid, type){
            if (!pid) {
                return "";
            }
            var type = type || "orignal";
            try{
                var num = (eval("0X" + pid.substring(pid.length - 2)) % 16) + 1;
                //return "http://static" + num + ".photo.sina.com.cn/" + type + "/" + pid;
                //Modified by W.Qiang , pictures's domain changes to sinaimg.cn, 2011-03-17
                return "http://s" + num + ".sinaimg.cn/" + type + "/" + pid;
            }catch(e){
                trace("图片URL计算出错！PID:"+pid);
                return "";
            }
    };
	window.getImgStaticPath=getImgStaticPath;
})();
