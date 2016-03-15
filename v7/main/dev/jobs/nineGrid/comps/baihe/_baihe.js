
if (typeof Baihe == 'undefined') {
	Baihe = {};
}

Baihe.pkg = function(ns) {
    if (!ns || !ns.length){
		return null;
	}
    var levels = ns.split(".");
    var nsobj = Baihe;
    for (var i= (levels[0] == "Baihe") ? 1 : 0; i< levels.length; ++ i) {
        nsobj[levels[i]] = nsobj[levels[i]] || {};
        nsobj = nsobj[levels[i]];
    }
	return nsobj;
};
