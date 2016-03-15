/**
 * @fileoverview 插入动感模板
 * @author xy xinyu@staff.sina.com.cn
 */

$import('lib/lib.js');

Lib.insertMoban=function(){
	if (scope.tpl && scope.tpl != '' && (scope.tpl.split('_')[0] == '13'||$_GLOBAL.flashtemplate[scope.tpl])) {
        Lib.insertMobanFunc(scope.tpl);
    }
};
/**
 * 真正插入模板的方法，该方法在页面设置中选择模板处重用
 * @param {Object} id 模板号
 */
Lib.insertMobanFunc=function(id){
		var headflash = $E('headflash');
            if (headflash) {
                headflash.innerHTML = '';
                headflash.style.display = "";
                var swf_url = 'http://simg.sinajs.cn/blog7newtpl/css/' + id.split('_')[0] + '/' + id + '/top.swf';
                var width = 950, height = 266;
				if($_GLOBAL.flashtemplate[id].width){
					width=$_GLOBAL.flashtemplate[id].width;
				}
				if($_GLOBAL.flashtemplate[id].height){
					height=$_GLOBAL.flashtemplate[id].height;
				}
				trace('flash height='+height);
				var x = Utils.Flash.swfView.Add(swf_url, 'headflash', "headflash_f", width, height, "9.0.0.0", "#000", {}, {
                    allowScriptAccess: "false",
                    wmode: "transparent",
                    allowFullScreen: 'false'
                });
            }
};
