/**
 * @fileoverview 夹页文章推荐
 *
 * @author  Qiangyee | wangqiagn1@staff
 * @create  2012-09-07
 */
$import("lib/680/_blogAd.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/system/br.js");
$import("lib/templateUtils.js");
$import("lib/oop2.js");
$import("lib/checkAuthor.js");
$import("lib/commonLog.js");
$import("other/sinaflash.js");

blogAd.TjRightAd = function(oParam, entity, logUrl){				// flash 和 img 两种
	Lib.checkAuthor();

	if($isAdmin || !blogAd.getInitPermission(oParam))
        return;

	this.oParam = oParam = oParam.ads[0];
	this.AD_HEIGHT = oParam.height;
    this.AD_WIDTH  = oParam.width;

	this.entity = entity;

	this.content = $E("module_tj_ad"+oParam.pos);

	if (oParam.type == "swf"){
		var cd = document.createElement("DIV");
		cd.id="adcontent_" + parseInt(Math.random() * 10000);
		this.content.appendChild(cd);
		this.appendSwf(oParam.ref, "", oParam.width, oParam.height, cd.id);

	} else if (oParam.type == "iframe"){
        this.content.appendChild(
			this.createNode('<iframe frameborder="0" scrolling="no" allowtransparency="yes"  src="'
                + (oParam.ref||"newzhaitong.jpg")
                + '" style="width:' + this.AD_WIDTH + 'px; height:'
                + this.AD_HEIGHT + 'px;" alt="" />')
		);
    } else {
		this.content.appendChild(
			this.createNode('<img src="'+(oParam.ref || "newzhaitong.jpg")+'" style="width:'+this.AD_WIDTH+'px; height:'+this.AD_HEIGHT+'px;" alt="" />')
		);
	}
	if(oParam.click){
		this.content.style.position = "relative";
		this.cantSeeMe = this.createNode('<a href="#" target="_blank"></a>');
		this.cantSeeMe.href = oParam.click;

		this.cantSeeMe.style.cssText = ($IE?"filter:alpha(opacity=0);":"opacity:0")
		+ "; height:"+this.AD_HEIGHT + "px; width:"
        + this.AD_WIDTH + "px; background:#F00; display:block;"
		+ "z-index:1020; position:absolute; left:0; top:0;";

		this.content.appendChild(this.cantSeeMe);
	}

    this.show();

    // 统计展现
    if(oParam.status && oParam.status.adstart){
        new Image().src = oParam.status.adstart;
    }
    if (logUrl){
        commonLog(logUrl);
    }
	
}.$defineProto({
	
	appendSwf:function(url, id, width, height, targetId){
		// V_movie, x_id, X_width, Z_height, v_version, z_bgColor, i_useExpressInstall, c_quality, I_xir, l_redirectUrl, o_detectKey
		if(typeof sinaFlash == "undefined") return;
		var sinaFlash2 = new sinaFlash(
			url,							//flash 的地址
			id,								//写入到页面后的 object id。
			width+"",						//宽
			height+"",						//高
			"9",							//flash 版本
			"#FFFFFF",						//flash 背景色
			false,							//是否使用 flash 快速升级
			"High",							//清晰度
			"http://www.sina.com.cn/",		//快速升级 url
			"http://www.sina.com.cn/",		//快速升级重定向 url
			false							//是否检测flash
		);
		sinaFlash2.addParam("allowScriptAccess", "always");		//是否允许脚本互访
		sinaFlash2.addParam("wmode", "transparent");			//透明度，FF 下使用 window 模式。解决输入法问题。
		// 现在改回transparent，因为window模式的flash，会遮盖js对话框，如果用原生alert，win7下的FF会停止响应
		sinaFlash2.write(targetId);			//写入容器的 id。
	},

	createNode:function(txt){
		var _box = $C("div");
		_box.innerHTML = txt;
		return _box.childNodes[0];
	},

	show:function(){
		this.entity.style.display = '';
	}
}).$mixProto(Lib.templateUtils);

