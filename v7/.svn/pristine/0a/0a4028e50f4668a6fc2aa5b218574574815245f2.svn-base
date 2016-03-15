/**
 * @desc	百合滚动
 * @auth	gaolei | 
 */

$import("comps/oop.js");
$import("comps/baihe/_baihe.js");
$import("comps/baihe/slide/DataTrans.js");
$import("comps/baihe/slide/DataRender.js");
$import("comps/baihe/slide/HoriSlide.js");


// host 类
Baihe.slide = function(opt){
	var __this = this;
	opt = opt || {};
	opt.forSlide = opt.forSlide || {};
	opt.forRender = opt.forRender || {};
	opt.forTrans = opt.forTrans || {};
	
	this.dataTrans = new Baihe.DataTrans(opt.forTrans);
	this.dataTrans.dataParse();
	
	this.dataRender = new Baihe.DataRender(opt.forRender);
	this.animeObj = new Baihe.HoriSlide(opt.forSlide);
	
	setTimeout(function(){
		__this.animate();
	}, opt.slideInterval);
	
}.$defineProto({
	
	animate:function(){
		if(this.dataTrans.fixedSourceLen <= 1) return;
		this.animeObj.move();
	},
	
	stop:function(){
		this.animeObj.stop();
	},
	
	restore:function(){
		this.animeObj.restore();
	}
});







