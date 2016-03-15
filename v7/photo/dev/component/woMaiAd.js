$import("sina/core/class/create.js");
$import("lib/sendLog.js");

/**
 * @fileoverview 
 * 我买网广告
 * @create 2013-10-21
 * @author xiaoyue3 | Liu xiaoyue
 */

woMaiAd = Core.Class.create();
woMaiAd.prototype = {
    /**
     * 初始化我买网广告组件
     * 
     */
    initialize : function(uid){
    	v7sendLog("33_01_11_" + uid + "_" + window.location.href);
    }
};