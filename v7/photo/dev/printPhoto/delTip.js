/**
 * @fileoverview 相册冲印 删除 小叉叉提示
 * @author wujian|wujian@staff.sina.com.cn
 * 
 */
window.showDel=function(id){
	$E("span_"+id).className="error_pic_ico";
};
		
window.hideDel=function(id){
	$E("span_"+id).className="";
};