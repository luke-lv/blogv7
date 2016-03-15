
if (typeof Reg == 'undefined') {
	Reg = {};
}

Reg.pkg = function(ns) {
    if (!ns || !ns.length){
		return null;
	}
    var levels = ns.split(".");
    var nsobj = Reg;
    for (var i= (levels[0] == "Reg") ? 1 : 0; i< levels.length; ++ i) {
        nsobj[levels[i]] = nsobj[levels[i]] || {};
        nsobj = nsobj[levels[i]];
    }
	return nsobj;
};
