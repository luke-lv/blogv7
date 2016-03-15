/**
 * ------------------------------------------------------------------------
 * @fileoverview 广告共享widget，由xy根据使用，修改代码并添加注释
 *
 *        union.space.sina.com.cn的接口返回类似：
 *                if(typeof(WGLOBALS) != 'object'){
 *					WGLOBALS	= {};
 *				}
 *                WGLOBALS['ad']        = {};
 *                WGLOBALS['ad']["PDPS"]        = ["PDPS000000004568","PDPS000000004468"];
 *
 *  接口返回形式2：
 *         var ad_={
                    adClickCode: ADFUSER,
                    adUrl: "http://xxxxxx", 
                    adType: "swf",
                    wmode: 'opaque',
                    adSrcV2: "http://d1.sina.com.cn/201111/01/366001_new64090.swf",
                    adPos: "PDPS000000004468", //广告显示位置。此码的代表在博文页显示(4568)，还是在博主页显示(4468)
                    show : "show_id" //显示广告的节点，可能不返回此节点
            };
 *
 * @author unknown
 * @modify xy | xinyu@staff.sina.com.cn
 * @modify wq | wangqiang1@staff
 * ------------------------------------------------------------------------
 */

/**
 * 老的方法，本来想去掉，但是发现，接口返回还是用这个，所以只好保留了。
 * 该方法由bal.blog.sina.com.cn/main/asfshow这个接口中返回的东西调用，
 * 所以，如果接口不返回的话，可以不设置sinablogbody的样式改变
 * @param {Object} PARAM
 */
function viewAd(b) {
    try {
        if (b.length) {
            adShare.viewAd(b)
        } else {
            adShare.viewAd([b])
        }
    } catch (a) {
    }
}

var adShare = {
    config: {
        db: "",
        user: "",
        id: {
            sinablog: { //修改为报备的状态，只在顶部显示，去掉底部广告位
                PDPS000000004468: "adversite_top",
                PDPS000000004568: "adversite_top"
            }
        }
    },
    dataUrl: "http://bal.blog.sina.com.cn/main/adfshow?",
    _initVariable: function (k, a) {
        trace("initVar");
        var d = 0;
        var b = [];
        var c = [];
        var f = [];
        var g = {};
        var l = "";
        var m = typeof(l);
        try {
            if (a.length == 1 && a[0] instanceof Object) {
                f = a[0]
            } else {
                f = a
            }
            for (var j in k) {
                l = f[d] != undefined ? f[d++] : k[j];
                l = j.indexOf("$") > -1 && m.toString() == "string" ? $E(l) : l;
                b[j] = l
            }
        } catch (h) {
        }
        return b
    },
    init: function () {
        var f = this._initVariable({
            UID: "",
            db: "",
            CHANNEL: "",
            url: "http://www.sinaimg.cn/pay/space/js/sinaflash.js",
            //ad: "http://union.space.sina.com.cn/widget_ad/__widget_ad_conf.php?uid=",
            border: 0,
            local: "yes",
            js: "mid"
        }, arguments);
        this.config.db = f.db;
        this.config.user = f.CHANNEL;
        var e;
        var b = [];
        var d = this;
        var a = typeof(sina);
        if (a.toString() != "object") {
            this.loadScript(f.url, function () {
                trace("load script over");
                d.showAd(f);
            });
        } else {
            d.showAd(f);
        }
    },
    showAd: function (e) {
        var d = {};
        trace("showad");
        d.border = e.border;
        d.local = e.local;
        d.js = e.js;
        d.db = e.db;

        // for old html
        var uid = $E('blogads').getAttribute('uid');
        // modifed by wangqiang1@staff
        // 4468为博主首页
        // 4568为博文正文页
        if (scope.$pageid == "index") {
            e.PDPS = "PDPS000000004468";
        } else if (scope.$pageid == "article") {
            e.PDPS = "PDPS000000004568";
        }
        if (uid == null || typeof(uid) == undefined) {
            d.user = e.CHANNEL + "|" + e.UID + "|" + e.PDPS;
            GET = [];
            for (var c in d) {
                GET[GET.length] = c + "=" + d[c]
            }
            this.loadScript(this.dataUrl + GET.join("&"), function () {
            }, "utf-8")
        }

        d.user = e.CHANNEL + "|" + e.UID + "|" + e.PDPS;
        GET = [];
        for (var c in d) {
            GET[GET.length] = c + "=" + d[c]
        }
        this.loadScript(this.dataUrl + GET.join("&"), function () {
        }, "utf-8");
    },
    viewAd: function (j) {
        var b;
        var h;
        var d;
        var k;
        var e;
        var bc = true;
        var a = ["", "F_13", "F_31", "F_121", "F_211", "F_112"];

        var l = ["blogads", "blogads2"];
        for (var f = 0; f < j.length; f++) {
            k = this.getExistObject(j[f]["adPos"], j[f]["show"]);
            if (!k) {
                return false
            }
            if (bc) {
                bc = false;
                $E("sinablogbody").className = "sinablogbody " + a[scope.formatInfo];
            }

            $E(l[f]).style.display = "";
            b = j[f]["width"] ? j[f]["width"] : "640";
            h = j[f]["height"] ? j[f]["height"] : "90";
            d = j[f]["wmode"] ? j[f]["wmode"] : "transparent";
            if (j[f]["adType"]) {
                k.style.display = "";
                if (k.className) {
                    k.className = k.className.replace("SinaAd_hide", "")
                }
            }
            switch (j[f]["adType"]) {
                case "swf":
                    var g = typeof(sinaFlash);
                    if (g.toString() != "function") {
                        break
                    }
                    var c = new sinaFlash(j[f]["adSrcV2"], "", b, h, "7", "", false, "high");
                    c.addParam("wmode", j[f]["wmode"]);
                    c.addVariable("adlink", escape(j[f]["adClickCode"] + j[f]["adUrl"]));
                    if (k.innerHTML.indexOf("_ad_") == -1) {
                        c.write(k.id)
                    } else {
                        k.innerHTML = k.innerHTML.replace("_ad_", '<div id="' + j[f]["adPos"] + j[f]["adPos"] + '"></div>');
                        c.write(j[f]["adPos"] + j[f]["adPos"])
                    }
                    break;
                case "img":
                    e = '<a style="width:' + b + "px; height:" + h + 'px;" href="' + j[f]["adClickCode"] + j[f]["adUrl"] + '" target="_blank"><img border=0 src="' + j[f]["adSrcV2"] + '"/></a>';
                    if (k.innerHTML.indexOf("_ad_") == -1) {
                        k.innerHTML = e
                    } else {
                        k.innerHTML = k.innerHTML.replace("_ad_", e)
                    }
                    break;
                case "html":
                    e = j[f]["html"];
                    if (k.innerHTML.indexOf("_ad_") == -1) {
                        k.innerHTML = e
                    } else {
                        k.innerHTML = k.innerHTML.replace("_ad_", e)
                    }
                    break;
                default:
                    document.title += " "
            }
        }
    },
    getExistObject: function (d, c) {
        try {
            var b = $E(d) == null ? $E(this.config.id[this.config.db][d]) : $E(d)
        } catch (f) {
            try {
                var a = $E(c) == null ? $E(this.config.id[this.config.db][c]) : $E(c)
            } catch (f) {
                document.title += " "
            }
        }
        return b ? b : a
    },
    loadScript: function (b, d, c) {
        var a = document.createElement("script");
        a.type = "text/javascript";
        if (c) {
            a.charset = c
        }
        if (d) {
            a.onload = a.onreadystatechange = function () {
                if (a.readyState && a.readyState != "loaded" && a.readyState != "complete") {
                    return
                }
                a.onreadystatechange = a.onload = null;
                d()
            }
        }
        a.src = b;
        document.getElementsByTagName("head")[0].appendChild(a)
    }
};