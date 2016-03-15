/**
 * @fileoverview 宝宝进度条的信息配置
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2010-08-16
 */
$import("sina/sina.js");
 
if(!scope.flashComponent) {
	scope.flashComponent = {};
}
scope.flashComponent.BabyBarConfig={
	"type1":{
		bgURL:"http://simg.sinajs.cn/blog7style/images/bring/baby_flashResource/babyBar/bg1.png",
		cursorURL:"http://simg.sinajs.cn/blog7style/images/bring/baby_flashResource/babyBar/cursor1.png",
		cursorX:47,
		cursorY:0,
		dltX:30,
		tX:60,
		tY:40,
		tOffsetY:-4,
		font:"黑体",
		color:"0x0066FF",
		size:"16"
	},
	"type2":{
		bgURL:"http://simg.sinajs.cn/blog7style/images/bring/baby_flashResource/babyBar/bg2.png",
		cursorURL:"http://simg.sinajs.cn/blog7style/images/bring/baby_flashResource/babyBar/cursor2.png",
		cursorX:120,
		cursorY:38,
		dltX:30,
		tX:80,
		tY:10,
		tOffsetY:-5,
		font:"黑体",
		color:"0xFFFF00",
		size:"18"
	},
	"type3":{
		bgURL:"http://simg.sinajs.cn/blog7style/images/bring/baby_flashResource/babyBar/bg3.png",
		cursorURL:"http://simg.sinajs.cn/blog7style/images/bring/baby_flashResource/babyBar/cursor3.png",
		cursorX:64,
		cursorY:20,
		dltX:30,
		tX:75,
		tY:43,
		tOffsetY:-6,
		font:"黑体",
		color:"0x006600",
		size:"18"
	},
	"type4":{
		bgURL:"http://simg.sinajs.cn/blog7style/images/bring/baby_flashResource/babyBar/bg4.png",
		cursorURL:"http://simg.sinajs.cn/blog7style/images/bring/baby_flashResource/babyBar/cursor4.png",
		cursorX:152,
		cursorY:58,
		dltX:30,
		tX:155,
		tY:18,
		tOffsetY:-6,
		font:"幼圆",
		color:"0xCD00AB",
		size:"16"
	}
};

scope.flashComponent.getFinalData = function(textTypes) {
	var listCfg=[],
	bc=scope.flashComponent.BabyBarConfig,
	i,
	l=textTypes.length,
	k;
	//初始化配置字符串
	for(i=0;i<l;i++){
		for(k in textTypes[i]){
			listCfg.push([k,"=",textTypes[i][k],";"].join(""));
		}
		
		var tpCfg=bc[textTypes[i].textType];
		for(k in tpCfg){
			listCfg.push([k,"=",tpCfg[k],";"].join(""));
		}
		listCfg.push("|");
	}
	listCfg.pop();
	return listCfg.join('');
}
