/**
 * @fileoverview 模板克隆
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-09-18
 */

$import("sina/sina.js");
$import("lib/component/templateClone/templateClone.js");
$import("lib/dialogConfig.js");
$import('lib/getTplNum.js');
$import("lib/checkAuthor.js");
$import("lib/insertMoban.js");

$registJob("insertDynaMoban", function(){
	Lib.getTplNum(function(){
		Lib.insertMoban();//插入动感模板
	});
});