function __dosZWFCall() {
    return true;
}
function __ZWFloadJS() {
    return true;
}
if (typeof(_ZWF) == "undefined")
    var _ZWF = {};
_ZWF.pubDate = "2008-4-10";
_ZWF.$ = function (id) {
    return document.getElementById(id)
};
_ZWF.scriptID = "zoomsun_widget_frame";
_ZWF.staticServer = "";
_ZWF.mainServer = "http://widget.say-on.com/go/";
_ZWF.hubServer = "http://widget.say-on.com/go/";
_ZWF.SvrAddress = {
    rssProxy: _ZWF.mainServer + "getrss.do",
    iask: _ZWF.mainServer + "iask.do",
    update: _ZWF.mainServer + "update.do",
    note: _ZWF.mainServer + "note.do",
    reg: _ZWF.mainServer + "reg.do",
    giftStoreInfo: _ZWF.mainServer + "gsl.do",
    gifthot: _ZWF.mainServer + "gethot.do",
    giftMyInfo: _ZWF.mainServer + "gl.do",
    giftUpdate: _ZWF.mainServer + "gupdate.do",
    authUpdate: _ZWF.mainServer + "authupdate.do",
    auth: _ZWF.mainServer + "auth.do"};
_ZWF.hostPage = document.URL;
_ZWF.embs = {typelen: {}, item: {}, pNodes: {}, wtmp: {}};
_ZWF.widgets = {};
_ZWF.childWins = {};
_ZWF.skinCfgs = {};
_ZWF.skins = {};
_ZWF.skinCfgWaits = {};
_ZWF.fwin = {};
_ZWF.desk = {};
_ZWF.achs = {};
_ZWF.readyState = "uninitialized";
_ZWF.bShowStatus = true;
_ZWF.inSlowNet = false;
_ZWF.sinaUsers = {};
_ZWF.blindIEHTML = '<iframe border="0" frameborder="0" style="position:relative;width:100%;height:100%;filter:progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0);"></iframe>';

function __dosZWFReady() {
    return (_ZWF && _ZWF.readyState == "Ready");
}
_ZWF.showStatus = function (s) {
    if (_ZWF.bShowStatus)
        window.status = s;
};
_ZWF.importJS = function (jssrc, jsid, loadFun) {
    if (!jsid) jsid = escape(jssrc);
    var ojs = _ZWF.$(jsid);
    if (ojs)
        return true;
    if (!document.body) {
        document.write('<script type="text/javascript" id="' + jsid + '" src="' + jssrc + '"></scr' + 'ipt>');
    } else {
        ojs = document.createElement("SCRIPT");
        ojs.charset = "utf-8";
        ojs.language = "javascript";
        ojs.type = "text/javascript";
        ojs.id = jsid;
        ojs.src = jssrc;
        if (typeof(loadFun) == "function") {
            if (typeof(ojs.onreadystatechange) == "undefined")
                ojs.onload = loadFun; else
                ojs.onreadystatechange = function () {
                    if (this.readyState == "loaded" || this.readyState == "interactive" || this.readyState == "complete") {
                        loadFun();
                    }
                };
        }

        ojs = document.body.appendChild(ojs);
    }
    return false;
};
_ZWF.init = function () {
//	var ojs = _ZWF.$(_ZWF.scriptID);
//	_ZWF.staticServer = ojs.src.replace(/(.*\/)widget_frame\.js/,"$1");
//	if(typeof(_COMM) == "undefined" )
//		_ZWF.importJS(_ZWF.staticServer+"comm.js","zoomsun_widget_comm",_ZWF.commLoaded);
//	else
    _ZWF.commLoaded();
    _ZWF.commLoadBegin = (new Date()).valueOf();
    _ZWF.readyState = "Loading COMM";
    _ZWF.showStatus(_ZWF.readyState);
};
_ZWF.commLoaded = function () {
    _ZWF.readyState = "Initialize COMM";
    _ZWF.showStatus(_ZWF.readyState);
    _COMM.onMessage = _ZWF.gotMessage;
    _COMM.onComLoad = _ZWF.commInited;
    if (!_COMM.clientID)
        _COMM.init(); else
        _ZWF.commInited();
};
_ZWF.commInited = function () {
    _ZWF.readyState = "Ready";
    _ZWF.showStatus("");
    var d = new Date();
    var m = navigator.appVersion.match(/MSIE (\d\.\d);/);
    var fixIE = (m && m[1] && Number(m[1]) <= 6);
    var fixLinux = (navigator.platform.toLowerCase().search("linux") != -1);
    if (d.valueOf() - _ZWF.commLoadBegin > 1000 || fixIE || fixLinux)
        _ZWF.inSlowNet = true;
    _ZWF.findEmbeds();
    _ZWF.desk.tb = _UTL.truebody();

    window.setTimeout('_ZWF.startChat()', 200);
};

_ZWF.initWgtQueue = [];
_ZWF.findEmbeds = function () {
    var embs = document.embeds;
    var m, ms;
    var re = new RegExp("\\/wgt_static\\/loader\\.swf\\?(.*)", "i");
    var needRun = false;
// TODO: mediaplayer windowlessVideo=1
    if (embs.length != _ZWF.embs.typelen["embed"]) {
        for (var i = 0; i < embs.length; i++) {
            if (embs[i].style.display == "none")
                continue;
            m = embs[i].src.match(re)
            if (m && m[1]) {
                if (_COMM.chkInitFailed) {
                    embs[i].style.display = "none";
                    _ZWF.showStatus("Initialize Failed :( ");
                } else {
                    ms = m[1];
                    if (!_ZWF.embs.item[ms])
                        _ZWF.embs.item[ms] = [];
                    if (!_ZWF.embs.pNodes[ms])
                        _ZWF.embs.pNodes[ms] = [];
                    _ZWF.embs.pNodes[ms].push(embs[i].parentNode);
                    _ZWF.embs.item[ms].push(embs[i]);
                    if (_ZWF.embs.item[ms].length == 1)
                        _ZWF.initWgtQueue.push(ms);
                }
            }
        }
        _ZWF.embs.typelen["embed"] = embs.length;
        needRun = true;
    }

    if (needRun && _ZWF.initWgtQueue.length > 0)
        _ZWF.execInitWgtQueue();
    window.setTimeout("_ZWF.findEmbeds()", 1000);
};

_ZWF.execInitWgtQueue = function () {
    if (_ZWF.initWgtQueue.length == 0)
        return;
    var embarg = _ZWF.initWgtQueue.shift();
    _ZWF.initWidget(embarg);
    if (!_ZWF.inSlowNet)
        window.setTimeout("_ZWF.execInitWgtQueue()", 100);
};

_ZWF.initWidget = function (embarg, exe) {
    if (!embarg || embarg == "") return false;
    if (_ZWF.embs.wtmp[embarg]) {
        _ZWF.execInitWgtQueue();
        return;
    }
    _ZWF.embs.wtmp[embarg] = {embarg: embarg, exe: exe, cfg: null, childWin: {}, embs: null};
    var m = embarg.match(/^static=(.*)/);
    if (m && m[1]) {
        _ZWF.loadStaticWidget(_ZWF.embs.wtmp[embarg], _ZWF.staticServer + m[1]);
        _ZWF.execInitWgtQueue();
    } else {
        _ZWF.showStatus("Loading Settings ...");
        var blog = (_COMM.auth && _COMM.auth.bLogin > 0);
        if (blog)
            _COMM.loadXMLDoc(_ZWF.hubServer + "?" + embarg + "&l=" + _COMM.auth.bLogin, _ZWF.gotWidgetInfo); else
            _COMM.loadXMLDoc(_ZWF.mainServer + "?" + embarg, _ZWF.gotWidgetInfo);
    }

    return true;
};

_ZWF.loadStaticWidget = function (otmp, surl) {
    var embarg = otmp.embarg;
    var embs = _ZWF.embs.item[embarg];
    if (!embs) return;
    var oemb, did;
    for (var i = 0; i < embs.length; i++) {
        oemb = embs[i];
        if (!oemb) continue;
        did = '_Widget_' + otmp.embarg + "_" + i;
        var el = _ZWF.$(did);
        if (!el) {
            el = document.createElement("DIV");
            el.id = did;
            el.style.position = "absolute";
        }
        var opn = oemb.parentNode;
        if (!opn) {
            var pns = _ZWF.embs.pNodes[embarg];
            opn = pns[i];
        }
        oemb.style.width = '0px';
        oemb.style.height = '0px';
        oemb.style.visibility = 'hidden';
        oemb.style.display = "none";
        el = opn.appendChild(el);
        var wgtid = "_static_" + Math.floor(Math.random() * 1e10);
        var w = opn.clenthWidth;
        var h = opn.clientHeight;
        var ts = '';
        var mn = embarg.replace(/.*(\/|^)([^\/|\?]*).*/, "$2");
        var fid = "_Widget_Frame_" + wgtid + "_" + i + "_" + mn;
        var fs = surl + '?hid=' + _COMM.clientID + '&wgtid=' + wgtid;
        ts += '<iframe  id="' + fid + '" name="' + fid + '" ';
        ts += ' onload="if(this.src.search(\'empty.html\')!=-1){this.src=unescape(\'' + escape(fs) + '\')}" src="' + _ZWF.staticServer + 'empty.html" style="position:relative;cursor:default;"  scrolling="no" allowTransparency="true"  width="' + w + 'px" height="' + h + 'px"  border="0" frameborder="0" ></iframe>';
        el.innerHTML = ts;
        var oif = _ZWF.$(fid);
        if (!otmp.embs)
            otmp.embs = [];
        otmp.embs.push({oimp: oemb, odiv: el, owin: oif, w: w, h: h});
        _ZWF.widgets[wgtid] = otmp;

    }

};

_ZWF.gotWidgetInfo = function (xmls, surl) {
    var oxml = _ZXML.loadXMLStr(xmls);
    _ZWF.showStatus("Settings loaded");
    var ocfg = _ZXML.XML2Obj(oxml);
    if (!ocfg || !ocfg.widget || !ocfg.widget.attributes || !ocfg.widget.attributes.wid) {
        if (_ZWF.inSlowNet)
            _ZWF.execInitWgtQueue();
        return;
    }
    var ouh = ocfg.widget.application.updatehost;
    if (ouh) {
        for (var dat in ouh) {
            _ZWF.SvrAddress[dat] = ouh[dat];
        }
        delete ocfg.widget.application.updatehost;
    }
    var wat = ocfg.widget.attributes;
    var wgtid = ocfg.widget.attributes.wid;
    if (!ocfg.widget.application.owner) {
        ocfg.widget.application.owner = {};
    }
    if (!ocfg.widget.application.settings) {
        var mn = wat.wtype.substr(0, wat.wtype.indexOf("@"));
        mn = mn.toLowerCase();
        ocfg.widget.application.settings = {
            embComm: {},
            skin: {pubPath: mn + "/", subPath: "skins/default/"}};
        ocfg.widget.application.settings.embComm[mn] = {};
    }
    if (!ocfg.widget.application.owner.sina || typeof(ocfg.widget.application.owner.sina.nick) != 'string') {
        var osina = {uid: "", nick: ""};
        var opv = ocfg.widget.application.provider;
        if (!opv)
            opv = {uid: _UTL.getUrlArg("uid", surl), nick: null};
        if (opv.uid) {
            osina.uid = opv.uid;
            if (typeof(opv.nick) != "string" || opv.nick == "" || opv.nick == "null") {
                var udat = null;
                var tp = "undefined";
                eval("tp= typeof(_tempSianUidDate_" + osina.uid + ");");
                if (tp != "undefined")
                    eval("udat=_tempSianUidDate_" + osina.uid);

                if (udat && udat[osina.uid])
                    osina.nick = udat[osina.uid]; else if (_ZWF.sinaUsers[osina.uid] && typeof(_ZWF.sinaUsers[osina.uid]) == "string")
                    osina.nick = udat[osina.uid]; else
                    _ZWF.importJS("http://uic.sinajs.cn/uic?type=nick&uids=" + osina.uid + "&varname=_tempSianUidDate_" + osina.uid, "reqSinaUidData" + osina.uid, function () {
                        eval("_ZWF.gotSinaUidData('" + wgtid + "','" + osina.uid + "')")
                    });
            }
        }
        ocfg.widget.application.owner.sina = osina;
    }
    ocfg.widget.application.owner.uid = wat.ownerid;
    if (!ocfg.widget.data) {
        ocfg.widget.data = {};
    }
    var embarg = surl.substr(surl.indexOf("?") + 1);
    embarg = embarg.replace(/&l=\d$/, "");
    var owtmp = _ZWF.embs.wtmp[embarg];
    if (!owtmp) return;
    _ZWF.widgets[wgtid] = _ZWF.embs.wtmp[embarg];
    var oarg = null;
    var aa = embarg.split("&");
    var itm;
    for (var i = 0; i < aa.length; i++) {
        itm = aa[i].split("=");
        if (!itm || itm.length != 2)
            continue;
        if (!oarg) oarg = {};
        oarg[itm[0]] = itm[1];
    }
    _ZWF.widgets[wgtid].args = oarg;
    if (!ocfg.widget.application.settings.skin.pubPath.match(/^http/i))
        ocfg.widget.application.settings.skin.pubPath = (_ZWF.staticServer + ocfg.widget.application.settings.skin.pubPath);
    _ZWF.widgets[wgtid].cfg = ocfg;

    var oset = ocfg.widget.application.settings;
    var skid = oset.skin.pubPath;
    if (!_ZWF.skinCfgs[skid]) {
        _ZWF.showStatus("Loading Skin Settings...");
        if (!_ZWF.skinCfgWaits[skid])
            _ZWF.skinCfgWaits[skid] = [];
        _ZWF.skinCfgWaits[skid].push(wgtid);
        _COMM.loadXMLDoc(skid + "config.xml", _ZWF.gotSkinSettings);
    } else {
        _ZWF.applySkinSettings(skid, wgtid);
    }

};
_ZWF.gotSinaUidData = function (wgtid, sinaid) {
    var udat = null;
    try {
        eval("udat=_tempSianUidDate_" + sinaid);
    } catch (err) {
    }
    if (!udat) return;
    var nick = udat[sinaid];
    if (!nick) return;
    _ZWF.sinaUsers[sinaid] = {nick: nick};
    _ZWF.widgets[wgtid].cfg.widget.application.owner.sina.nick = nick;
    var snk = _ZWF.widgets[wgtid].cfg.widget.application.owner.nick;
    if (typeof(snk) != "string" || snk == "" || snk == 'null')
        _ZWF.widgets[wgtid].cfg.widget.application.owner.nick = nick;
};
_ZWF.gotSkinSettings = function (xmls, surl) {
    var oxml = _ZXML.loadXMLStr(xmls);
    _ZWF.showStatus("Skin Settings Loaded.");
    var ocfg = _ZXML.XML2Obj(oxml);
    if (!ocfg) {
        _ZWF.showStatus("");
        if (_ZWF.inSlowNet)
            _ZWF.execInitWgtQueue();
        return;
    }
    if (!ocfg.widgetApplication.pubPath.match(/^http/i))
        ocfg.widgetApplication.pubPath = (_ZWF.staticServer + ocfg.widgetApplication.pubPath);

    var skid = ocfg.widgetApplication.pubPath;
    _ZWF.skinCfgs[skid] = {ocfg: ocfg, waits: {}};
    var wts = _ZWF.skinCfgWaits[skid];
    if (!wts) return;
    for (var i = 0; i < wts.length; i++) {
        _ZWF.applySkinSettings(skid, wts[i]);
    }
    _ZWF.skinCfgWaits[skid].length = 0;

};

_ZWF.applySkinSettings = function (skid, wgtid) {
    _ZWF.showStatus("");
    if (_ZWF.inSlowNet)
        window.setTimeout("_ZWF.execInitWgtQueue()", 100);
    if (!_ZWF.skinCfgs[skid] || !_ZWF.widgets[wgtid]) {
        return false;
    }
    var owgt = _ZWF.widgets[wgtid];
    var oset = owgt.cfg.widget.application.settings;
    var oskdef = _ZWF.skinCfgs[skid].ocfg.widgetApplication;

    _ZWF.widgets[wgtid].skin = {
        pubPath: skid,
        subPath: oset.skin.subPath,
        cfg: oskdef};

    _ZWF.initEmb(wgtid);

    return true;
};

_ZWF.initEmb = function (wgtid) {
    var owgt = _ZWF.widgets[wgtid];
    var embarg = owgt.embarg;
    var oset = owgt.cfg.widget.application.settings;
    var oskdef = owgt.skin.cfg;

    var embs = [];
    var oemb;
    var itms = _ZWF.embs.item[embarg];
    if (!itms) {
        if (owgt.exe && owgt.exe.funName) {
            var fun = owgt.exe.funName;
            if (!_ZWF.achs[fun])
                _ZWF.achs[fun] = [];
            if (!owgt.exe.argStr)
                owgt.exe.argStr = '';
            if (typeof(owgt.exe.argStr) != 'string')
                owgt.exe.argStr = String(owgt.exe.argStr);
            _ZWF.achs[fun].push({
                wid: "widget_hostPage",
                URL: oset.skin.pubPath + oset.skin.subPath,
                hid: _COMM.clientID,
                cid: _COMM.clientID,
                wgtid: wgtid,
                argStr: owgt.exe.argStr,
                srcElement: owgt.exe.srcElement});
            var fn = owgt.skin.pubPath + 'js/zwfapp.js';

            _ZWF.importJS(fn, null, function () {
                eval('_ZWA.' + owgt.exe.funName + '("' + owgt.exe.argStr.replace(/\"/g, '\\"') + '")')
            });
            return true;
        } else {
            return null;
        }
    }
    for (var i = 0; i < itms.length; i++) {
        oemb = itms[i];
        if (!oemb)
            continue;
        if (oemb.tagName.toUpperCase() == "A") {
            if (!oemb.name || oemb.name != '_widgetAnchor')
                continue;
            var fun = oemb.getAttribute("fun");
            if (fun) {
                if (!_ZWF.achs[fun])
                    _ZWF.achs[fun] = [];
                _ZWF.achs[fun].push({
                    wid: "widget_hostPage",
                    URL: oset.skin.pubPath + oset.skin.subPath,
                    hid: _COMM.clientID,
                    cid: _COMM.clientID,
                    wgtid: wgtid,
                    argStr: oemb.getAttribute("args"),
                    srcElement: oemb});
                oemb.href = "javascript:void(_ZWA.exec('" + fun + "','" + oemb.getAttribute("args") + "'," + (_ZWF.achs[fun].length - 1) + "))";
                var fn = owgt.skin.pubPath + 'js/zwfapp.js';
                _ZWF.importJS(fn);
            }
            continue;
        }
        if (oemb.style.display == "none")
            continue;
        var h = ( oemb.style.height == "" ? (oemb.height == "" ? oemb.clientHeight : oemb.height) : oemb.style.height );
        var w = ( oemb.style.width == "" ? (oemb.width == "" ? oemb.clientWidth : oemb.width) : oemb.style.width );
        var el = document.createElement("DIV");
        el.id = '_Widget_' + embarg + "_" + i;
        el.style.position = "relative";
        var opn = oemb.parentNode;
        if (!opn) {
//				window.status = "fixed: "+embarg;
            var pns = _ZWF.embs.pNodes[embarg];
            opn = pns[i];
        }
        oemb.style.width = '0px';
        oemb.style.height = '0px';
        oemb.style.visibility = 'hidden';
        oemb.style.display = "none";
        el = opn.appendChild(el);

        var ts = "";
        var fid = "_Widget_Frame_" + wgtid + "_" + i + "_";
        var embComm = oemb.getAttribute("wgtModule");
        if (!embComm) {
            for (var dat in oset.embComm) {
                embComm = dat;
                break;
            }
        }
        oset.skin.subPath = "skins/default/";
        var sfile = _ZWF.getSkinFilename(oskdef.components, embComm);
        var satt = oemb.getAttribute("skin");
        var odef = oskdef.skinDefine;
        if (odef) {
            for (var dat in odef) {
                if (!satt || dat == satt) {
                    oset.skin.subPath = "skins/" + odef[dat].attributes.path + "/";
                    sfile = _ZWF.getSkinFilename(odef[dat], embComm);
                    break;
                }
            }
        }
        owgt.skin.subPath = oset.skin.subPath;
        var fn = fid + embComm;
        var oif = _ZWF.$(fn);
        if (oif || !sfile || sfile == "")
            continue;
        var fs = "";
        fs = _UTL.getAbsPath(oset.skin.pubPath + oset.skin.subPath, sfile) + '?hid=' + _COMM.clientID + '&wgtid=' + wgtid + '&modid=' + i;
        ts += '<iframe  id="' + fn + '" name="' + fn + '" onload="if(this.src.search(\'empty.html\')!=-1){this.src=unescape(\'' + escape(fs) + '\')}" src="' + _ZWF.staticServer + 'empty.html" style="position:relative;cursor:default;"  scrolling="no" allowTransparency="true"  width="' + w + 'px" height="' + h + 'px"  border="0" frameborder="0" ></iframe>';
        el.innerHTML = ts;
//		oif = _ZWF.$(fn);
//		oif.src = fs;
        embs.push({oimp: oemb, odiv: el, owin: oif, w: w, h: h});
    }
    _ZWF.widgets[wgtid].embs = embs;
    return embs;
};

_ZWF.getSkinFilename = function (ocom, emb) {

    if (ocom && ocom[emb]) {
        var hms = _ZXML.getArray(ocom[emb].html);
        if (typeof(hms) == 'string')
            return hms;
        var ohm, hst;
        for (var i = 0; i < hms.length; i++) {
            ohm = hms[i];
            if (ohm.attributes && ohm.attributes.host) {
                hst = ohm.attributes.host;
                if (hst.search(/\./) != -1 && location.host.search(hst) != -1) {
                    return ohm.attributes.file;
                }
            }
        }
        ohm = hms[0];
        if (ohm.attributes && ohm.attributes.file)
            return ohm.attributes.file; else
            return ohm;
    }

    return "";

};

_ZWF.gotMessage = function (sender, omsg) {
    switch (omsg.type) {
        case "registration":
            var wgtid = omsg.message.wgtid;
            var modid = omsg.message.modid;
            _ZWF.childWins[omsg.key] = omsg.message;
            var owgt = _ZWF.widgets[wgtid];
            var oset = owgt.cfg ? owgt.cfg.widget.application : null;
            var wid = omsg.message.wid;
            var args = null;
            var odiv, divID;
            if (wid) {
                if (_ZWF.fwin.args[wid])
                    args = _ZWF.fwin.args[wid];
                odiv = _ZWF.fwin.wins[wid].odiv;
                divID = odiv.id;
                _ZWF.fwin.wins[wid].childWinKey = omsg.key;
                _ZWF.fwin.wins[wid].childWinCid = sender;

            } else {
                odiv = owgt.embs[modid].odiv;
                divID = odiv.id;
                _ZWF.widgets[wgtid].childWinKey = omsg.key;
                _ZWF.widgets[wgtid].main = {mname: omsg.message.mname, cid: omsg.message.cid};
            }
            var cst = (typeof(odiv.currentStyle) != "undefined" ? odiv.currentStyle : document.defaultView.getComputedStyle(odiv, null) );
            if (!cst)
                cst = {backgroundColor: "transparent", color: "#808080"};
            var ost = {};
            var f8 = "";
            if (owgt.embs && owgt.embs[modid] && owgt.embs[modid].oimp) {
                var atts = owgt.embs[modid].oimp.attributes;
                var at, m;
                for (var i = 0; i < atts.length; i++) {
                    at = atts[i];
                    m = at.nodeName.match(/^wgtColor_(.*)/i);
                    if (m && m[1])
                        ost[m[1].toLowerCase()] = at.nodeValue;
                }
                f8 = owgt.embs[modid].oimp.getAttribute("f8");
            }
            var css = {backgroundColor: cst.backgroundColor, color: cst.color, style: ost};
            var winInfo = {divID: divID, skin: owgt.skin, css: css,
                f8: f8,
                wgtInfo: (_ZWF.widgets[wgtid].cfg ? _ZWF.widgets[wgtid].cfg.widget.attributes : null),
                staticServer: _ZWF.staticServer,
                mainServer: _ZWF.mainServer,
                SvrAddress: _ZWF.SvrAddress,
                hostPage: document.URL};
            _ZWF.childWins[omsg.key].winInfo = winInfo;
            var oau = _COMM.auth;
            if (_COMM.auth.cookies) {
                if (oau.cookies.search("=") != -1)
                    oau.cookies = escape(_COMM.auth.cookies);
                oau.loginAccList = {};
            }
            if (oset) {
                try {
                    oset.owner.sina.nick = _ZWF.sinaUsers[oset.owner.sina.uid].nick;
                } catch (err) {
                }
            }
            _COMM.sendMessage(sender, {type: "regSuccess", key: "settings", message: {args: args, winInfo: winInfo, oset: oset, auth: oau}});
            _STATS.add(omsg.message.mname + "_loaded", oset ? (oset.owner.sina && oset.owner.sina.uid ? oset.owner.sina.uid : oset.owner.uid) : 'static');
            break;
        case "reqWidgetData":
            var wgtid = omsg.message.wgtid;
            var owgt = _ZWF.widgets[wgtid];
            var odat = owgt.cfg.widget.data;
            _COMM.sendMessage(sender, {type: "gotWidgetData", key: omsg.key, message: odat});
            break;
        case "reqLanRes":
            _COMM.sendMessage(sender, {type: "gotLanRes", key: omsg.key, message: _ZWF.skinCfgs[omsg.key].ocfg.widgetApplication.lanRes});
            break;
        case "reqAppData":
            _COMM.sendMessage(sender, {type: "gotAppData", key: omsg.key, message: _ZWF.skinCfgs[omsg.key].ocfg.widgetApplication.appData});
            break;

        case "updateConfig":
            var ocaller = _ZWF.childWins[omsg.key];
            if (!ocaller) break;
            var wgtid = ocaller.wgtid;
            var objs = omsg.message.node.split(".");
            var ndstr = "_ZWF.widgets[wgtid].cfg.widget.";
            var nd = null;
            for (var i = 0; i < objs.length; i++) {
                eval("nd =" + ndstr + objs[i]);
                if (!nd)
                    eval(ndstr + objs[i] + "={}");
                ndstr += objs[i] + ".";
                nd = null;
            }
            eval("_ZWF.widgets[wgtid].cfg.widget." + omsg.message.node + "=omsg.message.nodeObj");
            break;
        case "reqObject":
            var rl = omsg.message;
            for (var dat in rl) {
                var obj;
                eval("obj=" + rl[dat]);
                _COMM.sendMessage(sender, {type: "gotObject", key: dat, message: obj});
            }
            break;
        case "fwinCommand":
            var ocaller = _ZWF.childWins[omsg.key];
            if (!ocaller) break;
            var oarg = omsg.message;
            var afun;
            if (oarg.fun == "openHtml") {
                var wid = oarg.wid;
                if (_ZWF.fwin.wins[wid]) {
                    _ZWF.fwin.openHtml(ocaller, oarg);
                } else {
                    _ZWF.createFwinQueue.push({ocaller: ocaller, oarg: oarg});
                    window.setTimeout("_ZWF.execCreateFwin()", 200);
                }
            } else {
                try {
                    eval("afun=_ZWF.fwin." + oarg.fun);
                } catch (err) {
                }
                if (typeof(afun) == "function")
                    afun(ocaller, oarg);
            }
            break;
        case "command":
            switch (omsg.key) {
                case "exec":
                    var afun;
                    try {
                        eval("afun = " + omsg.message.funName);
                    } catch (err) {
                    }
                    if (typeof(afun) == "function")
                        afun(omsg.message.args);
                    break;
                case "utility":
                    var afun;
                    try {
                        eval("afun = _ZWF.utl." + omsg.message.funName);
                    } catch (err) {
                    }
                    if (typeof(afun) == "function")
                        afun(omsg.message.args);
                    break;
                case "setHTML":
                    var odiv = $(omsg.message.divID)
                    if (odiv) {
                        odiv.innerHTML = omsg.message.html;
                    }
                    break;
                case "testSpeed":
                    var afun;
                    try {
                        eval("afun = _ZWF." + omsg.message.funName);
                    } catch (err) {
                    }
                    if (typeof(afun) == "function")
                        afun(omsg.message.args);
                    break;
            }
            break;
        case "reqManagerData":
            _COMM.sendMessage(sender, {type: "gotManagerData", key: omsg.key, message: _ZWF.skinCfgs[omsg.key].ocfg.widgetApplication.managerData});
            break;
        case "sinaCookie":
            if (omsg.key == "save")
                _COMM.saveSinaCookie(omsg.message);
            break;
        case "onWinkEnd":
            _ZWF.wink.hide(omsg.key);
            break;
        case "reqChatData":
            window.setTimeout("_ZWF.chat.reqChatData('" + sender + "','" + omsg.key + "')", 500);
            break;
        default:
            break;
    }

};

_ZWF.doTestSpeedDiv = function (mes) {
    if (!mes.testDiv)return;
    if (!mes.testHtml) mes.testHtml = '';
    var el = _ZWF.$(mes.testDiv);
    if (!el) {
        el = document.createElement("DIV");
        el.id = mes.testDiv;
        el.style.display = "none";
        document.body.appendChild(el);
    }
    el.innerHTML = mes.testHtml;

}

_ZWF.createFwinQueue = [];
_ZWF.execCreateFwin = function () {
    if (_ZWF.createFwinQueue.length > 0) {
        _ZWF.fwin.openHtml(_ZWF.createFwinQueue[0].ocaller, _ZWF.createFwinQueue[0].oarg);
        _ZWF.createFwinQueue.shift();
    }
    if (_ZWF.createFwinQueue.length > 0) {
        window.setTimeout("_ZWF.execCreateFwin()", 200);
    }
};

_ZWF.fwin = {};
_ZWF.fwin.wins = {};
_ZWF.fwin.args = {};
_ZWF.fwin.evs = {};
_ZWF.fwin.baseZ = 1000;
_ZWF.fwin.maxZ = 0;

_ZWF.fwin.openHtml = function (ocaller, oarg) {
    var wid = oarg.wid;
    var ofw = _ZWF.fwin.wins[wid];
    var winType = (typeof(oarg.winType) == "string" ? oarg.winType : "");

    if (ofw && !oarg.epos) {
        _ZWF.fwin.show(wid);
        if (oarg.align) {
            _ZWF.fwin.align(ocaller.wid, wid);
        } else {
            _ZWF.fwin.autoPos(wid);
        }
        _ZWF.fwin.bringToTop(wid, winType, oarg.bHideOther);
        return;
    }
    if (ofw && ofw.bhidden) {
        _ZWF.fwin.show(wid);
        _ZWF.fwin.bringToTop(wid, winType, oarg.bHideOther);
        return;
    }
    if (!oarg.src)
        return;

    var w = h = 50;
    if (!ofw) {
        w = Number(oarg.width);
        h = Number(oarg.height);
    } else {
        w = ofw.width;
        h = ofw.height;
    }

    var x = y = 0;
    var ocdiv = (ocaller.srcElement ? ocaller.srcElement : _ZWF.$(ocaller.winInfo.divID) );
    if (ocdiv && ocdiv.tagName.toLowerCase() != "body") {
        var pos = _UTL.getAbsPosition(ocdiv);
        if (oarg.followEvent) {
            if (oarg.epos) {
                x = pos.x + oarg.epos.x;
                y = pos.y + oarg.epos.y;
            } else {
                x = pos.x + w + pos.w > _ZWF.desk.tb.clientWidth ? pos.x - w : pos.x + w;
                y = pos.y;
            }
            if (pos.spos && (pos.spos.h != pos.h || pos.spos.w != pos.w)) {
                if (x > pos.spos.w - oarg.width)
                    x = pos.spos.w - oarg.width;
                if (y > pos.spos.h - oarg.height)
                    y = pos.spos.h - oarg.height;
            }
        } else {
            x = oarg.left ? oarg.left : Math.round((pos.w - w) / 2) + pos.x;
            y = oarg.top ? oarg.top : Math.round((pos.h - h) / 2) + pos.h;
        }
    } else {
        x = Math.floor((_ZWF.desk.tb.clientWidth - w) / 2);
        y = Math.floor((_ZWF.desk.tb.clientHeight - h) / 2);
    }

    if (x < 0) x = 0;
    if (y < 0) y = 0;

    var z = _ZWF.fwin.baseZ;
    if (oarg.zIndex)
        z += Number(oarg.zIndex);

    if (z > _ZWF.fwin.maxZ)
        _ZWF.fwin.maxZ = z;

    _ZWF.fwin.args[wid] = oarg.fwinArgs;
    var spath = ocaller.URL;
    spath = spath.substr(0, spath.lastIndexOf("/"));
    var surl = _UTL.getAbsPath(spath, oarg.src) + '?hid=' + ocaller.hid + '&pid=' + ocaller.cid + '&wgtid=' + ocaller.wgtid + '&wid=' + wid;

    var el = _ZWF.$(wid);
    var fid = "_Widget_FloatWin_" + wid;
    var oif
    if (!el) {
        el = document.createElement("DIV");
        el.id = wid;
        el.style.position = "absolute";
        el.style.border = "1px dotted";
        el.style.background = "transparent url('" + _ZWF.staticServer + "images/wait24trans.gif') no-repeat center center";
        document.body.appendChild(el);
        el.innerHTML = '<iframe onload="_ZWF.fwin.onWinLoad(\'' + wid + '\')"  src="' + _ZWF.staticServer + 'empty.html" onfocus="_ZWF.fwin.bringToTop(\'' + wid + '\')" id="' + fid + '" name="' + fid + '"  style="position:relative;cursor:default;" width="100%" height="100%" scrolling="no" allowTransparency="true" border="0" frameborder="0" ></iframe>';
        oif = _ZWF.$(fid);
        oif.src = surl;
    }
    el.style.left = x + "px";
    el.style.top = y + "px";

    oif = _ZWF.$(fid);
    if (!ofw) {
        el.style.width = w + "px";
        el.style.height = h + "px";
        el.style.zIndex = z;
        oif.style.width = w + "px";
        oif.style.height = h + "px";
    }

    var did = "_Widget_DragDiv_" + wid;
    var odg = _ZWF.$(did);
    if (oarg.enableDrag) {
        if (!odg) {
            odg = document.createElement("DIV");
            odg.id = did;
            odg.style.position = "absolute";
            document.body.appendChild(odg);
            odg.innerHTML = '<div onmousedown="_ZWF.fwin.bringToTop(\'' + wid + '\');_ZDrag.start(event,_ZWF.$(\'' + wid + '\'),function(){_ZWF.fwin.afterDrag(\'' + wid + '\')},function(){_ZWF.fwin.afterDrag(\'' + wid + '\')} );return false;" style="background-color:transparent;position:relative;height:10px;width:95%;cursor:move;"><span style="width:100%;height:100%">&nbsp;</span></div>';
        }
        odg.style.display = "";
        odg.style.left = x + "px";
        odg.style.top = y + "px";
        if (!ofw) {
            odg.style.width = Math.floor(w * .95) + "px";
            odg.style.height = "10px";
            odg.style.zIndex = (z + 1);
        }
    }

    if (navigator.appName.indexOf("Microsoft") != -1) {
        var bid = "_Widget_BlindIE_" + wid;
        var obd = _ZWF.$(bid);
        if (!obd) {
            obd = document.createElement("DIV");
            obd.id = bid;
            obd.style.position = "absolute";
            document.body.appendChild(obd);
            obd.innerHTML = _ZWF.blindIEHTML;
        }
        if (odg)
            odg.style.display = "";
        if (!ofw) {
            obd.style.width = w + "px";
            obd.style.height = h + "px";
            obd.firstChild.style.width = w + "px";
            obd.firstChild.style.height = h + "px";
            obd.style.zIndex = (z - 1);
        }
        obd.style.left = x + "px";
        obd.style.top = y + "px";
    }
    var ofm = frames[fid];
    _ZWF.fwin.wins[wid] = {id: wid, pWgtid: ocaller.wgtid, pCid: ocaller.cid, top: y, left: x, width: w, height: h, zIndex: z, ofm: ofm,
        odiv: el, obd: obd, odg: odg, bhidden: false, bAutoHide: oarg.bAutoHide, enableDrag: oarg.enableDrag, winType: winType};
    if (oarg.align) {
        _ZWF.fwin.align(ocaller.wid, wid);
    } else {
        _ZWF.fwin.autoPos(wid);
    }
    _ZWF.fwin.bringToTop(wid, winType, oarg.bHideOther);

    return true;

};

_ZWF.fwin.bringToTop = function (id, winType, bHideOther) {
    var ofw = _ZWF.fwin.wins[id];
    if (!ofw || ofw.odiv.style.zIndex > _ZWF.fwin.maxZ)    return false;
    var bh = (typeof(winType) == "string" && winType != "" && bHideOther);

    var ow;
    for (var dat in _ZWF.fwin.wins) {
        ow = _ZWF.fwin.wins[dat];
        if (ow.id == id)
            continue;
        if (bh && ow.winType == winType)
            _ZWF.fwin._hide(ow.id);
        if (ow.odiv.style.zIndex <= _ZWF.fwin.maxZ)
            continue;
        ow.odiv.style.zIndex = ow.zIndex;
        if (ow.obd)
            ow.obd.style.zIndex = (ow.zIndex - 1);
        if (ow.odg)
            ow.odg.style.zIndex = (ow.zIndex + 1);
    }

    ofw.odiv.style.zIndex = (_ZWF.fwin.maxZ + 10);
    if (ofw.obd)
        ofw.obd.style.zIndex = (_ZWF.fwin.maxZ + 9);
    if (ofw.odg)
        ofw.odg.style.zIndex = (_ZWF.fwin.maxZ + 11);

};

_ZWF.fwin.onWinLoad = function (id) {
    var ofw = _ZWF.fwin.wins[id];
    if (!ofw)    return false;
    ofw.odiv.style.border = "none";
    ofw.odiv.style.background = "none";
};

_ZWF.fwin.openLogin = function (ocaller, oarg) {
    _ZWF.fwin._hide("widget_registration");
    var ofw = _ZWF.fwin.wins[oarg.wid];
    oarg.wid = "widget_login";
    oarg.src = _ZWF.staticServer + "login.html";
    oarg.width = 320;
    oarg.height = 240;
    oarg.zIndex = 100;
    oarg.enableDrag = true;
    oarg.bAutoHide = false;
    oarg.followEvent = false;
    _ZWF.fwin.openHtml(ocaller, oarg);
};

_ZWF.fwin.openReg = function (ocaller, oarg) {
    _ZWF.fwin._hide("widget_login");
    var ofw = _ZWF.fwin.wins[oarg.wid];
    oarg.wid = "widget_registration";
    oarg.src = _ZWF.staticServer + "reg.html";
    oarg.width = 320;
    oarg.height = 345;
    oarg.zIndex = 100;
    oarg.enableDrag = true;
    oarg.bAutoHide = false;
    oarg.followEvent = false;
    _ZWF.fwin.openHtml(ocaller, oarg);
};

_ZWF.fwin.hide = function (ocaller, oarg) {
    _ZWF.fwin._hide(oarg.wid);
};

_ZWF.fwin.popMe = function (ocaller, oarg) {
    var wid = oarg.wid;
    var ofw = _ZWF.fwin.wins[wid];
    if (!ofw) return;
    var winType = (typeof(ofw.winType) == "string" ? ofw.winType : "");
    _ZWF.fwin.show(wid);
    _ZWF.fwin.autoPos(wid);
    _ZWF.fwin.bringToTop(wid, winType, oarg.bHideOther);

};

_ZWF.fwin.resizeTo = function (ocaller, oarg) {
    _ZWF.fwin._resizeTo(oarg.wid, oarg.w, oarg.h);
    _ZWF.fwin.autoPos(oarg.wid);
};

_ZWF.fwin.close = function (id) {
    var ofw = _ZWF.fwin.wins[id];
    if (!ofw)
        return false;
    if (typeof(_ZWF.fwin.evs["body_onmousedown"]) == "function") {
        document.body.onmousedown = _ZWF.fwin.evs["body_onmousedown"];
        delete _ZWF.fwin.evs["body_onmousedown"];
    }

    ofw.odiv.innerHTML = "";
    if (ofw.obd)
        document.body.removeChild(ofw.obd);
    if (ofw.odg)
        document.body.removeChild(ofw.odg);
    delete _ZWF.fwin.wins[id];
    // TODO fix FF BUG
    return true;
};

_ZWF.fwin._hide = function (id) {
    var ofw = _ZWF.fwin.wins[id];
    if (!ofw || ofw.bhidden)
        return false;
    if (typeof(_ZWF.fwin.evs["body_onmousedown"]) == "function") {
        document.body.onmousedown = _ZWF.fwin.evs["body_onmousedown"];
        delete _ZWF.fwin.evs["body_onmousedown"];
    }

    if (ofw.odg)
        ofw.odg.style.display = "none";
    if (ofw.obd)
        ofw.obd.style.display = "none";

    ofw.width = ofw.odiv.clientWidth;
    ofw.height = ofw.odiv.clientHeight;
    _ZWF.fwin._resizeTo(id, 0, 0);
    ofw.bhidden = true;

    if (ofw.childWinKey && _ZWF.childWins[ofw.childWinKey]) {
        var oifo = _ZWF.childWins[ofw.childWinKey];
        if (oifo.onHiddenNotify)
            _COMM.sendMessage(oifo.onHiddenNotify, {type: "fwinChanged", key: "hidden", message: {cid: oifo.cid, bhidden: true}});
    }
    return true;
};
_ZWF.fwin.show = function (id) {
    var ofw = _ZWF.fwin.wins[id];
    if (!ofw || !ofw.bhidden)
        return false;

    if (ofw.bAutoHide) {
        if (typeof(document.body.onmousedown) == "function") {
            _ZWF.fwin.evs["body_onmousedown"] = document.body.onmousedown;
        }
        document.body.onmousedown = function () {
            eval('_ZWF.fwin._hide("' + id + '")')
        };
        _ZWF.fwin.autoHideID = id;
    }
    if (ofw.odg)
        ofw.odg.style.display = "";
    if (ofw.obd)
        ofw.obd.style.display = "";
    ofw.odiv.style.display = "";
    _ZWF.fwin._resizeTo(id, ofw.width, ofw.height);
    ofw.bhidden = false;
    if (ofw.childWinKey && _ZWF.childWins[ofw.childWinKey]) {
        var oifo = _ZWF.childWins[ofw.childWinKey];
        if (oifo.onHiddenNotify)
            _COMM.sendMessage(oifo.onHiddenNotify, {type: "fwinChanged", key: "hidden", message: {cid: oifo.cid, bhidden: false}});
    }

    return true;
};

_ZWF.fwin.autoHide = function () {
    if (_ZWF.fwin.autoHideID) {
        _ZWF.fwin._hide(_ZWF.fwin.autoHideID);
        _ZWF.fwin.autoHideID = null;
    }
};

_ZWF.fwin.afterDrag = function (id) {
    var ofw = _ZWF.fwin.wins[id];
    if (!ofw)    return false;
    var x = Number(ofw.odiv.style.left.replace(/\D/g, ""));
    var y = Number(ofw.odiv.style.top.replace(/\D/g, ""));
    _ZWF.fwin.moveTo(id, x, y);
};
_ZWF.fwin.moveTo = function (id, x, y) {
    _ZWF.fwin.show(id);
    var ofw = _ZWF.fwin.wins[id];
    if (!ofw)    return false;
    ofw.odiv.style.left = x + "px";
    ofw.odiv.style.top = y + "px";
    if (ofw.odg) {
        ofw.odg.style.left = x + "px";
        ofw.odg.style.top = y + "px";
    }
    if (ofw.obd) {
        ofw.obd.style.left = x + "px";
        ofw.obd.style.top = y + "px";
    }
    return true;
};

_ZWF.fwin.autoPos = function (id) {
    var ofw = _ZWF.fwin.wins[id];
    if (!ofw)    return false;
    var tb = _ZWF.desk.tb;
    var sy, sx;
    var bm = false;
    var x = ofw.odiv.offsetLeft;
    var y = ofw.odiv.offsetTop;
    var h = ofw.odiv.offsetHeight;
    var w = ofw.odiv.offsetWidth;
    if (typeof(window.pageYOffset) == "undefined") {
        sy = tb.scrollTop;
        sx = tb.scrollLeft;
    } else {
        sy = window.pageYOffset;
        sx = window.pageXOffset;
    }
    if (y < sy) {
        ofw.odiv.style.top = sy + "px";
        bm = true;
    }
    if (x < sx) {
        ofw.odiv.style.left = sx + "px";
        bm = true;
    }
    if (y + h > sy + tb.clientHeight) {
        y = sy + tb.clientHeight - h;
        y = (isNaN(y) || y < 0) ? 0 : y;
        ofw.odiv.style.top = y + "px";
        bm = true;
    }
    if (x + w > sx + tb.clientWidth) {
        x = sx + tb.clientWidth - w;
        x = (isNaN(x) || x < 0) ? 0 : x;
        ofw.odiv.style.left = x + "px";
        bm = true;
    }
    if (bm)
        _ZWF.fwin.afterDrag(id);
};

_ZWF.fwin.align = function (id1, id2) {

    var ofw1 = _ZWF.fwin.wins[id1];
    if (!ofw1)    return false;
    var ofw2 = _ZWF.fwin.wins[id2];
    if (!ofw2)    return false;
    var tb = _ZWF.desk.tb;
    var pos1 = _UTL.getAbsPosition(ofw1.odiv);
    var pos2 = _UTL.getAbsPosition(ofw2.odiv);
    var lf, rf;
    if (pos1.x <= pos2.x) {
        lf = {p: pos1, w: ofw1};
        rf = {p: pos2, w: ofw2};
    } else {
        lf = {p: pos2, w: ofw2};
        rf = {p: pos1, w: ofw1};
    }
    var x = lf.p.x + lf.p.w;
    if ((x + rf.p.w) > tb.clientWidth || rf.p.x < (lf.p.x + lf.p.w)) {
        var allw = lf.p.w + rf.p.w;
        if (allw < tb.clientWidth) {
            var rx = Math.floor((tb.clientWidth - allw) / 2);
            _ZWF.fwin.moveTo(lf.w.id, rx, pos1.y);
            x = (rx + lf.p.w);
        } else {
            x = Math.floor((tb.clientWidth - w) / 2) + tb.scrollLeft;
        }
        _ZWF.fwin.moveTo(rf.w.id, x, pos1.y);
    }
    _ZWF.fwin.autoPos(id1);
    _ZWF.fwin.autoPos(id2);

};

_ZWF.fwin.resizeEmbTo = function (ocaller, oarg) {
    var ofm = _ZWF.$("_Widget_Frame_" + ocaller.wgtid + "_" + ocaller.modid + "_" + ocaller.mname);
    if (!ofm) return;
    ofm.style.width = oarg.w + "px";
    ofm.style.height = oarg.h + "px";
};

_ZWF.fwin._resizeTo = function (id, w, h) {
    var ofw = _ZWF.fwin.wins[id];
    if (!ofw)    return false;
    if (ofw.odiv.offsetWidth != w || ofw.odiv.offsetHeight != h) {
        ofw.odiv.firstChild.style.width = w + "px";
        ofw.odiv.firstChild.style.height = h + "px";
        ofw.odiv.style.width = w + "px";
        ofw.odiv.style.height = h + "px";
        if (ofw.odg) {
            ofw.odg.style.width = Math.floor(w * .95) + "px";
        }
        if (ofw.obd) {
            ofw.obd.style.width = w + "px";
            ofw.obd.style.height = h + "px";
            var fc = ofw.obd.firstChild;
            fc.style.width = w + "px";
            fc.style.height = h + "px";
        }
        _ZWF.fwin.afterDrag(id);
    }
    return true;

};

_ZWF.widget = {};
_ZWF.widget.exec = function (wgtID, cmd, args) {
    var owgt = _ZWF.widgets[wgtID];
    if (!owgt) {
        var oarg, s;
        for (var dat in _ZWF.widgets) {
            oarg = _ZWF.widgets[dat].args;
            if (!oarg) continue;
            var has = true;
            for (var ad in oarg) {
                s = ad + "=" + oarg[ad];
                if (wgtID.search(s) == -1) {
                    has = false;
                    break;
                }
            }
            if (has) {
                owgt = _ZWF.widgets[dat];
                break;
            }
        }
    }
    if (owgt && owgt.main && owgt.main.cid) {
        _COMM.sendMessage(owgt.main.cid, {type: "command", key: "exec", message: {funName: cmd, args: args} });
    }

};

_ZWF.fwin.playWink = function (ocaller, oarg) {
    window.setTimeout("_ZWF.wink.load('" + oarg.winkID + "')", 200);
};

_ZWF.utl = {};

_ZWF.utl.showNotify = function (oarg) {
    if (_ZWF.utl.notifyTimer)
        window.clearTimeout(_ZWF.utl.notifyTimer);
    var tb = _ZWF.desk.tb;
    var did = "_ZWF_widget_Notify_Div";
    var el = _ZWF.$(did);
    if (!el) {
        el = document.createElement("DIV");
        el.id = did;
        el.style.position = "absolute";
        document.body.appendChild(el);
    }
    var z = _ZWF.fwin.baseZ + 150;
    if (typeof(window.pageYOffset) == "undefined") {
        y = tb.scrollTop;
        x = tb.scrollLeft;
    } else {
        y = window.pageYOffset;
        x = window.pageXOffset;
    }
    var w = 308;
    var h = 82;
    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.width = w + "px";
    el.style.height = h + "px";
    el.style.zIndex = z;
    el.style.display = "none";
    var obd = null;
    var isIE = (navigator.appName.indexOf("Microsoft") != -1);
    if (isIE) {
        var bid = "_Widget_BlindIE_" + did;
        obd = _ZWF.$(bid);
        if (!obd) {
            obd = document.createElement("DIV");
            obd.id = bid;
            obd.style.position = "absolute";
            document.body.appendChild(obd);
            obd.innerHTML = _ZWF.blindIEHTML;
        }
        obd.style.display = "";
        obd.style.width = w + "px";
        obd.style.height = h + "px";
        obd.firstChild.style.width = w + "px";
        obd.firstChild.style.height = h + "px";
        obd.style.zIndex = (z - 1);
        obd.style.left = x + "px";
        obd.style.top = y + "px";
    }

    var ts = '<div style="width:100%;height:100%;' + _PNG.getBgStr(_ZWF.staticServer + "/utility/notify/images/notify_bg_1.png") + '">' + '<div onclick="_ZWF.utl.hideNotify();" style="float:right;cursor:pointer;position:relative;width:28px;height:24px;"></div>' + '<div onclick="_UTL.open(\'' + oarg.link + '\')" style="position:relative;width:272px;height:64px;padding-top:16px;cursor:pointer;filter:progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=100);">'
    ts += '<table border="0" width="272" style="color:#FFFFFF;vertical-align:middle;font-size: 12px" height="50" cellspacing="0" cellpadding="0"><tr>';
    ts += '<td width="64" align="right" valign=top><div style="padding-left:4px;width:40px;height:40px;overflow:hidden" align=right><img src="%NotifyImg%" border=0 height=40px ></div></td>';
    ts += '<td valign=top><div style="width:200px;height:39px;line-height:14px;margin-left:12px;overflow:hidden;">%NotifyText%</div></td>';
    ts += '</tr></table>';
    var txt = oarg.text;
    txt = txt.replace(/\n/gm, "<br>");
    ts = ts.replace(/%NotifyText%/gm, txt);
    ts = ts.replace(/%NotifyImg%/gm, oarg.img);
    ts += '</div></div>';
    el.innerHTML = ts;

    _ZWF.utl.fade(did, true, 5, 0);
    var tot = 4000 + (oarg.time ? oarg.time : 5000);

    _ZWF.utl.notifyTimer = window.setTimeout('_ZWF.utl.hideNotify()', 9000);

};

_ZWF.utl.reloadAll = function () {
    location.reload(true);
};

_ZWF.utl.loctionGo = function (url) {
    location.href = url;
};

_ZWF.utl.historyGo = function (num) {
    if (!num)
        num = -1;
    num = Number(num);
    history.go(num);
};

_ZWF.utl.resize = function (elid, w, h) {
    var el = _ZWF.$(elid);
    if (!el)
        return false;
    if (w && w != el.offsetWidth)
        el.style.width = w + 'px';
    if (h && h != el.offsetHeight)
        el.style.height = h + 'px';
};

_ZWF.utl.fade = function (divID, bIn, step, beg) {
    var odiv = _ZWF.$(divID);
    if (!odiv) return;
    step = Number(step);
    if (step < 1 || step > 100)
        return;
    if (_ZWF.utl.fadeTimer)
        window.clearTimeout(_ZWF.utl.fadeTimer);

    if (bIn) {
        if (odiv.style.display == "none") {
            odiv.style.display = "";
        }
        beg += step;
        if (beg > 100)
            beg = 100;
    } else {
        beg -= step;
        if (beg < 0)
            beg = 0;
        if (beg == 0 && odiv.style.display != "none") {
            odiv.style.display = "none";
        }
    }
    var bf = (beg > 0 && beg < 100);
    if (typeof(odiv.style.filter) != "undefined")
        odiv.style.filter = bf ? "progid:DXImageTransform.Microsoft.Alpha(opacity=" + beg + ")" : "none"; else
        odiv.style.opacity = beg / 100;
    if (bf)
        _ZWF.utl.fadeTimer = window.setTimeout('_ZWF.utl.fade("' + divID + '",' + bIn + ',' + step + ',' + beg + ')', 100); else if (_ZWF.utl.onFadeEnd)
        try {
            eval(_ZWF.utl.onFadeEnd);
            _ZWF.utl.onFadeEnd = null;
        } catch (err) {
        }
}

_ZWF.utl.hideNotify = function () {
    if (_ZWF.utl.notifyTimer)
        window.clearTimeout(_ZWF.utl.notifyTimer);
    var did = "_ZWF_widget_Notify_Div";
    _ZWF.utl.fade(did, false, 5, 100);
    var bid = "_Widget_BlindIE_" + did;
    var obd = _ZWF.$(bid);
    if (obd)
        obd.style.display = "none";
};

_ZWF.utl.execFun = function () {
    var al = arguments.length;
    var funName = arguments[0];
    var brv = arguments[1];
    var s = '';
    for (var i = 2; i < al; i++) {
        if (i > 2)
            s += ',';
        s += 'arguments[' + i + ']';
    }
    var rv = null;
    try {
        eval((brv ? 'rv = ' : '') + funName + '(' + s + ')');
    } catch (err) {
    }
    ;

    if (brv)
        return rv;
};

_ZWF.utl.evalStr = function (str) {
    try {
        eval(str);
    } catch (err) {
    }
    ;
};

_ZWF.wink = {};
_ZWF.wink.player = null;
_ZWF.wink.load = function (winkID) {
    if (!winkID)
        return;
    var wid = "widget_winkPlayer";
    var tb = _ZWF.desk.tb;
    var w = tb.clientWidth;
    var h = tb.clientHeight;
    var x;
    var y;
    if (typeof(window.pageYOffset) == "undefined") {
        y = tb.scrollTop;
        x = tb.scrollLeft;
    } else {
        y = window.pageYOffset;
        x = window.pageXOffset;
    }

    var z = _ZWF.fwin.baseZ + 200;
    var did = "_ZWF_widget_winkPlayer_Div";
    var fid = "_ZWF_widget_winkPlayer_Frame";
    var el = _ZWF.$(did);
    var ofw = frames[fid];
    if (!el) {
        el = document.createElement("DIV");
        el.id = did;
        el.style.overflow = "hidden";
        el.style.position = "absolute";
        el.style.border = "1px dotted";
        el.style.background = "transparent url('" + _ZWF.staticServer + "images/wait24trans.gif') no-repeat center center";
        document.body.appendChild(el);
        el.innerHTML = '<iframe onload="_ZWF.wink.onWinLoad()"  src="' + _ZWF.staticServer + 'empty.html" id="' + fid + '" name="' + fid + '"  style="position:relative;cursor:default;" width="100%" height="100%" scrolling="no" allowTransparency="true" border="0" frameborder="0" ></iframe>';
    }

    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.width = w + "px";
    el.style.height = h + "px";
    el.style.zIndex = z;
    el.firstChild.style.width = w + "px";
    el.firstChild.style.height = h + "px";

    var obd = null;
    if (navigator.appName.indexOf("Microsoft") != -1) {
        var bid = "_Widget_BlindIE_" + wid;
        obd = _ZWF.$(bid);
        if (!obd) {
            obd = document.createElement("DIV");
            obd.id = bid;
            obd.style.position = "absolute";
            document.body.appendChild(obd);
            obd.innerHTML = _ZWF.blindIEHTML;
        }
        obd.style.display = "";
        obd.style.width = w + "px";
        obd.style.height = h + "px";
        obd.firstChild.style.width = w + "px";
        obd.firstChild.style.height = h + "px";
        obd.style.zIndex = (z - 1);
        obd.style.left = x + "px";
        obd.style.top = y + "px";
    }
    if (!_ZWF.wink.player || !_ZWF.wink.player.wid) {
        var oif = _ZWF.$(fid);
        oif.src = _ZWF.staticServer + 'winkplayer/player.html?hid=' + _COMM.clientID + '&winkid=' + winkID;
        _ZWF.wink.player = {odiv: el, obd: obd, ofw: ofw, wid: null};
    } else {
        _COMM.sendMessage(_ZWF.wink.player.wid, {type: "playWink", key: winkID, message: {}});
    }
};

_ZWF.wink.onWinLoad = function () {
    if (!_ZWF.wink.player)
        return;
    var odiv = _ZWF.wink.player.odiv;
    odiv.style.border = "none";
    odiv.style.background = "none";
};

_ZWF.wink.hide = function (winkID) {
    if (!_ZWF.wink.player)
        return;
    _ZWF.wink.player.wid = winkID;
    var ow = _ZWF.wink.player;
    if (ow.obd)
        ow.obd.style.display = "none";
    var odiv = ow.odiv;
    odiv.firstChild.style.width = "0px";
    odiv.firstChild.style.height = "0px";
    odiv.style.width = "0px";
    odiv.style.height = "0px";
};

if (typeof(_ZWA) == "undefined")
    var _ZWA = {};

_ZWA.temp = {};
_ZWA.exec = function (funName, argStr) {
    var fun = null;
    try {
        eval("fun = _ZWA." + funName);
    } catch (err) {
    }
    ;
    if (typeof(fun) == "function")
        fun(argStr);
};

_ZWA.load = function (el, wid, funName, argStr) {

    var fun = null;
    try {
        eval("fun = _ZWA." + funName);
    } catch (err) {
    }
    ;
    if (typeof(fun) == "function") {
        fun(argStr);
    } else {
        _ZWF.initWidget(wid + "&wtype=zwapop", {srcElement: el ? el : document.body, funName: funName, argStr: argStr});
    }

};

_ZWA.load2 = function (args) {
    var idx = args[0];
    _ZWA.temp[idx] = args;
    window.setTimeout('_ZWA.loading("' + idx + '")', 200);
};

_ZWA.loading = function (idx) {
    var args = _ZWA.temp[idx];
    if (args)
        _ZWA.load(null, args[0], args[1], args[2]);
}

_ZWA.getCaller = function (funName, mid) {
    if (!mid)
        mid = 0;
    var achs = _ZWF.achs[funName];
    if (!achs || achs.length < 1)
        return null; else
        return achs[mid];
};

_ZWF.chatHosts = [
    {h: "say-on"},
    {h: "space.sina", disabled: true},
    {h: "widget.sina"},
    {h: "pengyou.sina"},
    {h: "penyou.sina"},
    {h: "blog.sina.com.cn", disabled: true}
];

_ZWF.chat = {
    to: function () {
    },
    notify: function () {
    },
    hostSettings: {}};

_ZWF.startChat = function () {

    var h = document.location.host.toLowerCase();
    var lst = _ZWF.chatHosts;
    var js = "http://webim.pengyou.sina.com.cn/wchat/js/buddy.js";
    var css = "http://webim.pengyou.sina.com.cn/wchat/images/v2/buddy.css";
    var enb = false;//true;
    var itm;
    for (var i = 0; i < lst.length; i++) {
        itm = lst[i];
        if (h.search(itm.h) != -1) {
            if (!itm.disabled)
                enb = true;
            if (itm.js)
                js = itm.js;
            if (itm.css)
                js = itm.css;
            _ZWF.chat.hostSettings = itm;
            break;
        }
    }

    if (typeof(__sayon_webim_msg_pop__) == "undefined") {
        __sayon_webim_msg_pop__ = enb;
    }

    if (__sayon_webim_msg_pop__ == false)
        return;

    if (!_COMM.auth.sinaUserInfo || !_COMM.auth.sinaUserInfo.uid)
        return;

    if (typeof(_ZWF.chat.start) != "function") {
        _UTL.importJS(js, "zoomsun_widget_chat_js", null, 'GBK');
        _UTL.importCSS(css);
    } else {
        _ZWF.chat.start();
    }
};

//_ZWF.init();

window.setTimeout("_ZWF.init()", 200 + Math.floor(100 * Math.random()));
