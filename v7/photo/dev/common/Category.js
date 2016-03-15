
﻿/*
 * @author shaomin | shaomin@staff.sina.com.cn
  * @description Category is a collection of albums,there are 3 functions with it.
 * @example
 * 
 * 
 */
 $import("lib/interface.js");

 $import("sina/core/function/bind2.js");
 $import("sina/core/string/format.js");
 $import("sina/core/system/br.js");
 $import("sina/ui/pagination.js");
 $import("msg/pageDom.js");
 $import("common/BF.js");
 $import("action/checkKey.js");

 var Category = function(initCFG){

     this.initCfg = initCFG;
     return this;
 };

 Category.prototype.getList = function(visibletype,callback){
     window.ctglist = [];
     
     phpENTRY["getList"].request({
	 GET : {
	     uid : scope.$uid,
	     visible : visibletype
	 },
	 onSuccess : function(res){
	     ctglist = res.record;		
	     this.initCfg.currentList = ctglist;
	     if(typeof callback == "undefined")
	   	 this.renderLeftDom(this.initCfg);
	     else
		 callback.apply(null,ctglist);
	 }.bind2(this),
	 onError : function(res){
	     callErr(res.code);
	 }				
     });
 };


 Category.prototype.createPager = function(currentPage){
     var  mycfg = this.initCfg;  
     var max_page = ((mycfg.currentList.length % mycfg.pageNum)? 1 : 0) + Math.floor(mycfg.currentList.length / mycfg.pageNum);   
     Ui.Pagination.init({
	 "nodeClassNamePrefix" :"SG",
	 "pageNode" : mycfg.pagerNode,
	 "curPage" : currentPage,		
	 "maxPage" : max_page,
	 "pageTpl" : function(pageNum){this.applyHtml(pageNum);return true;}.bind2(this),
	 "type"    : mycfg["pagerType"]	
     }).show();			 
 };

 Category.prototype.renderLeftDom = function(initCfg){ 
     var index = 0;
    
     if(initCfg.currentList.length > 0){
	 if(initCfg.currentList.length > initCfg.pageNum){
	     if(typeof ctg_id != 'undefined'){
		 for(var i = 0;i<initCfg.currentList.length;i++){
		     if(typeof ctg_id != 'undefined' && initCfg.currentList[i].ctg_id == ctg_id){
			 index = i;
			 break;
		     }
		 }
		 var myPageNum = (((index+1) % initCfg.pageNum)? 1 : 0) + Math.floor((index+1) / initCfg.pageNum);
		 this.applyHtml(myPageNum);
		 this.createPager(myPageNum);
	     }else{
		 this.applyHtml(1);
		 this.createPager(1);		 
	     }	     
	 }else{
	     this.applyHtml(1);
	     $E("leftPager").style.display = 'none';
	 }
     }else{
	 initCfg.listLayer.innerHTML = '';
	 $E("ctgLayer").style.display = 'none';
	 $E("leftPager").style.display = 'none';
     }
 };

 Category.prototype.applyHtml = function(index){
     var lis = [];
     var oConfig = this.initCfg;
     var mylist = oConfig.currentList;

     for(var j = (index-1) * oConfig.pageNum ,l = j+Math.min(mylist.length-j, oConfig.pageNum);  j < l; j ++){	
	 var cate = mylist[j];
	 var mydiv = document.createElement("div");
	 if(oConfig.currentTpl == 'leftOutline'){
	     lis.push(CtgTpl["leftOutline"].format(
		 (typeof ctg_id !='undefined' && cate.ctg_id == ctg_id) ? "current" : "",
		 cate.cover_img_url,
		 cate.category,
		 cate.pic_cnt,
   		 cate.ctg_id,
		 DOMAIN+'/category/u/'+scope.$uid+'/s/'+cate.ctg_id
	     ));
	 }else{
	     lis.push(CtgTpl[oConfig.currentTpl].format(
		 j,
		 cate.category,
		 cate.pic_cnt,
		 cate.encrypt == "public" ? "none" : "inline"
	     ));
	     
	 }	 		 
     }
     try{
	 oConfig.listLayer.innerHTML =  lis.join("");   
     }catch(e){}
 };