define("mods/view/test", function(require, module, exports){
	var $easyTemplate = require("lib/kit/str/easyTemplate");
	
	var $tpl = require("mods/tpl/xxx");
	
	var data = {}
	
	var html = $easyTemplate($tpl, data).toString();
	
	node.append(html);
	
});
