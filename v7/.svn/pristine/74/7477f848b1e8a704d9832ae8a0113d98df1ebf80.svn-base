/**
 * @fileoverview 初始化页面设置所需要的变量
 * @author xinyu@staff.sina.com.cn
 */

$import('pageSet/pageSetVariables.js');

scope.formatInfo = scope.formatInfo;//是几栏版式，1 代表1:3，2代表3:1，依次下去，5代表1:1:2
scope.isAdshare = ((scope.$private.ad == 1||scope.$private.adver==1)? "true" : "false");//是否是广告共享用户
scope.isCompany = (scope.$private.p4p>0? "true" : "false");//是否是企业用户
scope.$setDomain = true;

//记录版式信息--------------------------------------
if (scope.formatInfo && scope.formatInfo != "") {
    __pageSetOrginal.formatInfo = __pageSetVar.formatInfo = scope.formatInfo;
}
//----------------------------------------------------


//用户原来选择的背景色------------------------------------
__pageSetVar.selectedBgColor =  scope.backgroundcolor;
//------------------------------------------------------


//用户原来选择各个图片----------------------------------
var defaultValue = {
    "pid": "no",
    "repeat": "repeat-x",
    "align-h": "center",
    "align-v": "top",
    "apply": "0"
};
//---------------------------------------------------------------------

//原来用户选择的模板-------------------------------------

__pageSetVar.selectedTpl = scope.tpl;

//下线模版用户 页面设置页的来源,为下线模版做准备。

__pageSetVar.pageSetSrc = "";
//--------------------------------------------------

//用户原来使用的各种背景图的信息：------------------------------
for (var i = 2; i < 5; i++) {
    __pageSetVar["customPic_" + i] = scope.UserPic[(i - 2)];
	__pageSetOrginal["customPic_" + i]={};
//	//将目前显示在页面上的各种图片先记录下，如果用户点击不使用，则可以恢复原图
//    if (i == 2) {
//		__pageSetOrginal["customPic_" + i].showPic = $E('sinablogb').style.backgroundImage;
//		__pageSetOrginal["customPic_" + i].sinablogashowPic = $E('sinabloga').style.backgroundImage;//$E('sinabloga').style.backgroundImage;
//		__pageSetOrginal["customPic_" + i].bodyshowPic = document.body.style.backgroundImage;//
//	}
//	else 
//		if (i == 3) 
//			__pageSetOrginal["customPic_" + i].showPic = $E('blognavBg').style.backgroundImage;
//		else 
//			if (i == 4) 
//				__pageSetOrginal["customPic_" + i].showPic = $E('sinablogHead').style.backgroundImage;
//-------------------------------------------
    if (!__pageSetVar["customPic_" + i].pid || __pageSetVar["customPic_" + i].pid == "" || __pageSetVar["customPic_" + i].pid == null) {
        for (var k in defaultValue) {
			if (k != 'apply') {
            	__pageSetVar["customPic_" + i][k] = defaultValue[k];
			}
        }
    }
	
	for(var k in __pageSetVar["customPic_" + i]){
		__pageSetOrginal["customPic_" + i][k]=__pageSetVar["customPic_" + i][k];
	}
}
//-------------------------------------------------




//页面上原始的组件信息--------------------------------
__pageSetOrginal.component_lists = scope.component_lists;

//记录页面上有那些组件处于选中状态，用户选择某个组件后会增加到这个数组，隐藏后会从这里去掉
__pageSetVar.component_list = [];
for (k in scope.component_lists) {
//    trace(scope.component_lists[k].list instanceof Array);
    __pageSetVar.component_list = __pageSetVar.component_list.concat(scope.component_lists[k].list);
}
//for (i = 0; i < __pageSetVar.component_list.length; i++) {
//    trace(i + ";" + __pageSetVar.component_list[i]);
//}
if($E('customModuleText')){
	$E('customModuleText').innerHTML='页面最多放置25个组件，您已放置<strong>'+__pageSetVar.component_list.length+'</strong>个组件';
}
//-----------------------------------

//上传后的背景图片
__pageSetVar.uploadedBgImage="";
//原始背景图片
__pageSetVar.originalBgImage="";
//原始的背景状态
__pageSetVar.originalBackgroundAttachment="";
//fixed的状态值
__pageSetVar.isBgFixed="";



