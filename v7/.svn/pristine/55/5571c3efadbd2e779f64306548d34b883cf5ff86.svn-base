/**
 * @fileoverview 用户识别二期，用户指纹技术测试
 * User: changchuan@staff.sina.com.cn
 * Date: 13-11-18
 * Time: 下午2:06
 * To change this template use File | Settings | File Templates.
 */
$import("sina/utils/flash/swf.js");
$registJob("userIdentificationfingerprint", function () {
    var loginterface = "http://highway.blog.sina.com.cn/writeXidInfo";
    var needPostInterface = "http://highway.blog.sina.com.cn/checkXid";
    var fontSwfUrl = "http://sjs.sinajs.cn/blog7swf/fonts.swf";

    var xid ="";

    /**
     <script type="text/javascript" src="js/simpleJavaScriptTemplating.js"></script>
     **/
    (function () {
        var cache = {};
        this.tmpl = function tmpl(str, data) {
            // Figure out if we're getting a template, or if we need to
            // load the template - and be sure to cache the result.
            var fn = !/\W/.test(str) ?
                cache[str] = cache[str] ||
                    tmpl(document.getElementById(str).innerHTML) :

                // Generate a reusable function that will serve as a template
                // generator (and which will be cached).
                new Function("obj",
                    "var p=[],print=function(){p.push.apply(p,arguments);};" +

                        // Introduce the data as local variables using with(){}
                        "with(obj){p.push('" +

                        // Convert the template into pure JavaScript
                        str
                            .replace(/[\r\t\n]/g, " ")
                            .split("<%").join("\t")
                            .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                            .replace(/\t=(.*?)%>/g, "',$1,'")
                            .split("\t").join("');")
                            .split("%>").join("p.push('")
                            .split("\r").join("\\'")
                        + "');}return p.join('');");

            // Provide some basic currying to the user
            return data ? fn(data) : fn;
        };
    })();
    /**
     <script type="text/javascript" src="js/platformConf.js"></script>
     **/
    var platformConf = [
        "Win", 1,
        "Mac", 2,
        "Linux", 3,
        "FreeBSD", 4,
        "iPhone", 21.1,
        "iPod", 21.2,
        "iPad", 21.3,
        "Win.*CE", 12.1,
        "Win.*Mobile", 12.2,
        "Pocket\\s*PC", 12.3,
        "", 999];
    /**
     <script type="text/javascript" src="js/pluginConf.js"></script>
     **/
    var pluginConf = {
        '驱动精灵在线版1.0.0.5': {
            classid: 'clsid:A9EA64C1-D146-4B99-86A7-68B1786D82C0',
            filename: "dgweb.dll",
            name: "驱动精灵在线版",
            version: '1.0.0.5'
        }, 'PPLive Lite Class ver 3.1.8.6046': {
            classid: 'clsid:EF0D1A14-1033-41A2-A589-240C01EDC078',
            filename: "pplugin2.dll",
            name: "PPLive Lite Class",
            version: '3.1.8.6046'
        },
        'baiduplayer Browser Plugin': {
            classid: 'clsid:02E2D748-67F8-48B4-8AB4-0A085374BB99',
            filename: "npxbdyy.dll",
            name: "BaiduPlayer Browser Plugin"
        },
        'webmod Class': {
            classid: 'clsid:FEE3C8C5-9BEA-4079-AB36-63ECABFC7392',
            filename: "Alidcp.dll"
        }
    };

    var Detectable_Components_in_Internet_Explorer_by_capclient = {
        "Address Book": "7790769C-0471-11D2-AF11-00C04FA35D02",
        "Windows Desktop Update NT": "89820200-ECBD-11CF-8B85-00AA005B4340",
        "DirectAnimation": "283807B5-2C60-11D0-A31D-00AA00B92C03",
        "DirectAnimation Java Classes": "4F216970-C90C-11D1-B5C7-0000F8051515",
        "DirectShow": "44BBA848-CC51-11CF-AAFA-00AA00B6015C",
        "Dynamic HTML Data Binding": "9381D8F2-0288-11D0-9501-00AA00B911A5",
        "Dynamic HTML Data Binding for Java": "4F216970-C90C-11D1-B5C7-0000F8051515",
        "Internet Connection Wizard": "5A8D6EE0-3E18-11D0-821E-444553540000",
        "Internet Explorer 5 Browser": "89820200-ECBD-11CF-8B85-00AA005B4383",
        "Windows Internet Explorer Classes for Java": "08B0E5C0-4FCB-11CF-AAA5-00401C608555",
        "Internet Explorer Help": "45EA75A0-A269-11D1-B5BF-0000F8051515",
        "Internet Explorer Help Engine": "DE5AED00-A4BF-11D1-9948-00C04F98BBC9",
        "Windows Media Player": "22D6F312-B0F6-11D0-94AB-0080C74C7E95",
        "NetMeeting NT": "44BBA842-CC51-11CF-AAFA-00AA00B6015B",
        "Offline Browsing Pack": "3AF36230-A269-11D1-B5BF-0000F8051515",
        "Outlook Express": "44BBA840-CC51-11CF-AAFA-00AA00B6015C",
        "Task Scheduler": "CC2A9BA0-3BDD-11D0-821E-444553540000",
        "Microsoft virtual machine": "08B0E5C0-4FCB-11CF-AAA5-00401C608500"
    };
    /**
     <script type="text/javascript" src="js/func.js"></script>
     **/

    var getNumRegx = /[\d][\d\.\_,\-]*/;
    var splitNumRegx = /[\.\_,\-]/g;

    /**
     * 得到一个ActiveX对象的实例
     *  @param objname   activeX对象名
     *  @returns {Object} activeX对象
     **/
    function getActiveXObject(objname) {
        var obj = null;
        try {
            obj = new window.ActiveXObject(objname);
        } catch (e) {
        }
        return obj;
    }

    function isDefined(obj) {
        return typeof obj != "undefined"
    }

    function isArray(obj) {
        return(/array/i).test(Object.prototype.toString.call(obj))
    }

    function isFunc(obj) {
        return typeof obj == "function"
    }

    function isString(obj) {
        return typeof obj == "string"
    }

    function isNum(obj) {
        return typeof obj == "number"
    }

    function isStrNum(obj) {
        return(typeof obj == "string" && (/\d/).test(obj))
    }


    /**
     * 得到字符串中的数字
     * @param str   要匹配的字符串
     * @param cReg  可选正则表达式，匹配指定模式的数字格式
     * @returns {String} 数字字符串
     */
    function getNum(str, cReg) {
        var result = isStrNum(str) ?
            (isDefined(cReg) ?
                new RegExp(cReg) : getNumRegx)
                .exec(str)
            :
            null;
        return result ? result[0] : null
    }


    /**
     * 格式化的数字字符串
     * @param strNum   需要格式化的数字字符串
     * @param capacity  几段，最大为4
     * @returns {*}
     * @example
     *          run：pluginDetector.formatNum('123-1-23,23,23',7)
     "          result：123,1,23,23"
     */
    function formatNum(strNum, capacity) {
        if (!isStrNum(strNum)) {
            return null
        }
        if (!isNum(capacity)) {
            capacity = 4
        }
        capacity--;
        var arr = strNum.replace(/\s/g, "").split(splitNumRegx).concat(["0", "0", "0", "0"]);
        for (var index = 0; index < 4; index++) {
            if (/^(0+)(.+)$/.test(arr[index])) {
                arr[index] = RegExp.$2
            }
            if (index > capacity || !(/\d/).test(arr[index])) {
                arr[index] = "0"
            }
        }
        return arr.slice(0, 4).join(",");
    }


    function garbage() {
        if (garbage['enable']) {
            return;
        }
        garbage['enable'] = 1;
        setTimeout(function () {
            garbage['enable'] = 0;
            window.CollectGarbage();
        }, 1000);

    }

    function loadFlash(url, callback, continerId) {
        window.loadFlash_guid = window.loadFlash_guid || 1;
        /**
         var flashvars = {    };
         var params = {
        menu: "false",
        scale: "noScale",
        allowFullscreen: "true",
        allowScriptAccess: "always",
        width:'1px',
        height:'1px',

        bgcolor: "",
        wmode: "direct" // can cause issues with FP settings & webcam
    };
         var attributes = {
        id: "swfid"+window.loadFlash_guid++
    };

         if( !continerId)
         {
             continerId = attributes.id+'continner';
             var dom= document.createElement("div");
             dom.id = continerId;
             document.body.appendChild(dom);
         }
         swfobject.embedSWF(
         url,
         continerId, "100%", "100%", "10.0.0",
         "expressInstall.swf",
         flashvars, params, attributes);
         **/
        //---------------------------
        var tdom = document.createElement("div");
        tdom.id = continerId || 'continerdiv' + Math.random();
        tdom.style.position = "absolute";
        tdom.style.height = "1px";
        tdom.style.width = "1px";
        tdom.style.left = "0px";
        tdom.style.top = "50px";
        tdom.style.zIndex = "9999";
        document.body.appendChild(tdom);
        var attributes = {
            id: "swfid" + window.loadFlash_guid++
        };
        Utils.Flash.swfView.Add(url, tdom.id, attributes.id, 1, 1, "6", "#FF0000", {}, {
            scale: "noscale",
            allowScriptAccess: "always"
        });
        //-----------------------------


        var fdom;

        function scflashOK() {
            callback(fdom);
        }

        function detectSCflash() {
            fdom = document.getElementById(attributes.id);
            if (fdom && typeof(fdom.GetVariable) != 'undefined') {
                scflashOK();
            } else {
                setTimeout(detectSCflash, 1000);
            }
        }

        detectSCflash();
    }

    function getAXOByClsid(clsid) {
        clsid = clsid.replace('clsid:', '');
        clsid = clsid.replace('{', '');
        clsid = clsid.replace('}', '');
        clsid = "clsid:" + clsid;
        var span = document.createElement('span');
        var html = '<' + 'object classid="' + clsid + '" ' + 'id="deployJavaPlugin" width="0" height="0">' + '<' + '/' + 'object' + '>';
        var result = false;
        span.innerHTML = html;
        var x = null;
        if (span.firstChild['object']) {
            x = span.firstChild;
        }
        setTimeout(function () {
            span.innerHTML = '';
            garbage();
        }, 1000);
        return x;
    }

    /**
     <script type="text/javascript" src="js/platform.js"></script>
     **/
    var OS = detectPlatform();

    function detectPlatform() {
        var OS = 999;
        var platform = navigator.platform || "";
        if (platform) {
            //该列表有待数据收集后更新

            for (var index = platformConf.length - 2; index >= 0; index = index - 2) {
                if (platformConf[index] && new RegExp(platformConf[index], "i").test(platform)) {
                    OS = platformConf[index + 1];
                    break
                }
            }
        }
        return OS;
    }

    /**
     <script type="text/javascript" src="js/screen.js"></script>
     **/
    var screenInfo = getScreenInfo();

    function getScreenInfo() {
        return screen.width + "*" + screen.height + "*" + screen.colorDepth;
    }

    /**
     <script type="text/javascript" src="js/font.js"></script>
     **/

    var fonts = "";

    /**
     * 获取系统字体
     * @param callback 返回函数，参数为字体名
     * @example
     getFonts(function( str ){
                document.write(  str  );
            });
     */
    function getFonts(callback) {
        function test(flashDom) {
            if (typeof(flashDom.getFonts) != 'undefined') {
                fontsStr = flashDom.getFonts();
                callback(fontsStr);
            } else {
                setTimeout(function () {
                    test(flashDom)
                }, 200);
            }
        }

        loadFlash(fontSwfUrl, test);
    }


    /**
     <script type="text/javascript" src="js/browser.js"></script>
     **/
    var browser = {};
    detectIE();
    detectNonIE();
    if (browser.isIE) {
        browser.name = 'IE';
        browser.version = browser.verIE;
    }
    if (browser.isGecko) {
        browser.name = 'Gecko';
        browser.version = browser.verGecko;
    }
    if (browser.isChrome) {
        browser.name = 'Chrome';
        browser.version = browser.verChrome;
    }
    if (browser.isSafari) {
        browser.name = 'Safari';
        browser.version = browser.verSafari;
    }
    if (browser.isOpera) {
        browser.name = 'Opera';
        browser.version = browser.verOpera;
    }


    function detectIE() {
        var userAgent = navigator.userAgent || "",
            doc = document,
            progid,
            progid1,
            progid2;
        /**探测是不是ie***/
        var tmp = doc.documentMode;
        try {
            doc.documentMode = ""
        } catch (e) {
        }
        browser.isIE = isNum(doc.documentMode) ? !0 : eval("/*@cc_on!@*/!1");
        try {
            doc.documentMode = tmp
        } catch (e) {
        }
        /**探测ie的真实版本号********/
        browser.verIE = null;
        if (browser.isIE) {
            browser.verIE = doc.documentMode || ((/^(?:.*?[^a-zA-Z])??(?:MSIE|rv\s*\:)\s*(\d+\.?\d*)/i).test(userAgent) ? parseFloat(RegExp.$1, 10) : 7)
        }


        //activeX是否启用
        browser.ActiveXEnabled = !1;
        //activeX过滤器是否启用
        browser.ActiveXFilteringEnabled = !1;

        if (browser.isIE) {
            try {
                browser.ActiveXFilteringEnabled = window.external.msActiveXFilteringEnabled()
            } catch (e) {
            }
            progid1 = [
                "Msxml2.XMLHTTP"
                , "Msxml2.DOMDocument"
                , "Microsoft.XMLDOM"
                , "TDCCtl.TDCCtl"
                , "Shell.UIHelper"
                , "HtmlDlgSafeHelper.HtmlDlgSafeHelper"
                , "Scripting.Dictionary"
            ];
            progid2 = [
                "WMPlayer.OCX"
                , "ShockwaveFlash.ShockwaveFlash"
                , "AgControl.AgControl"
            ];
            progid = progid1.concat(progid2);
            for (var x = 0; x < progid.length; x++) {
                if (getActiveXObject(progid[x])) {
                    browser.ActiveXEnabled = !0;
                }
            }

            if (browser.ActiveXEnabled && browser.ActiveXFilteringEnabled) {
                for (var x = 0; x < progid2.length; x++) {
                    if (getActiveXObject(progid2[x])) {
                        browser.ActiveXFilteringEnabled = !1;
                        break
                    }
                }
            }
        }
    }

    function detectNonIE() {
        ua = browser.isIE ? "" : navigator.userAgent || "",
            vendor = navigator.vendor || "",
            product = navigator.product || "";

        // todo 该列表有待更新，需收集国内浏览器数据

        browser.isGecko = (/Gecko/i).test(product) && (/Gecko\s*\/\s*\d/i).test(ua);
        browser.verGecko = browser.isGecko ? formatNum((/rv\s*\:\s*([\.\,\d]+)/i).test(ua) ? RegExp.$1 : "0.9") : null;

        browser.isChrome = (/(Chrome|CriOS)\s*\/\s*(\d[\d\.]*)/i).test(ua);
        browser.verChrome = browser.isChrome ? formatNum(RegExp.$2) : null;

        browser.isSafari = !browser.isChrome && ((/Apple/i).test(vendor) || !vendor) && (/Safari\s*\/\s*(\d[\d\.]*)/i).test(ua);
        browser.verSafari = browser.isSafari && (/Version\s*\/\s*(\d[\d\.]*)/i).test(ua) ? formatNum(RegExp.$1) : null;

        browser.isOpera = (/Opera\s*[\/]?\s*(\d+\.?\d*)/i).test(ua);
        browser.verOpera = browser.isOpera && ((/Version\s*\/\s*(\d+\.?\d*)/i).test(ua) || 1) ? parseFloat(RegExp.$1, 10) : null
    }

    /**
     <script type="text/javascript" src="js/flash.js"></script>
     **/

    var flashEnable = hasFlash();
    var flashVersion = formatNum(getFlashVersion());

    function hasFlash() {
        // look for a flag in the query string to bypass flash detection
        if (/hasFlash\=true/.test(location)) return true;
        if (/hasFlash\=false/.test(location)) return false;
        var pv = getFlashVersion().match(/\d+/g);
        var ver = formatNum(pv.join(","));
        return ver != '0,0,0,0';
    }

    /**
     *
     * @name flash.hasFlash.playerVersion
     * @desc Get the version of the installed Flash plugin.
     * @type String
     *
     **/
    function getFlashVersion() {
        // ie
        try {
            try {
                // avoid fp6 minor version lookup issues
                // see: http://blog.deconcept.com/2006/01/11/getvariable-setvariable-crash-internet-explorer-flash-6/
                var axo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.6');
                try {
                    axo.AllowScriptAccess = 'always';
                }
                catch (e) {
                    return '6,0,0,0';
                }
            } catch (e) {
            }
            return new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version').replace(/\D+/g, ',').match(/^,?(.+),?$/)[1];
            // other browsers
        } catch (e) {
            try {
                if (navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin) {
                    return (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]).description.replace(/\D+/g, ",").match(/^,?(.+),?$/)[1];
                }
            } catch (e) {
            }
        }
        return '0,0,0,0';
    };
    /**
     <script type="text/javascript" src="js/clientCaps.js"></script>
     **/
    function initOClientCaps() {
        if (initOClientCaps.init || !browser.isIE || OS != 1) {
            return false
        }
        ;
        initOClientCaps.init = 1;
        var div = document.createElement('div');
        div.style.height = "1px";
        div.style.width = "1px";
        div.style.left = "1px";
        div.style.top = "1px";
        div.id = "oClientCaps";
        div.position = "absolute";
        div.style.behavior = "url('#default#clientcaps')";
        //document.body.appendChild(div);
        return div;
    }

    var oClientCaps = initOClientCaps();
    /**
     * about clientcaps
     availHeight     //Retrieves the height of the working area of the system's screen, excluding the Microsoft Windows? taskbar.
     availWidth     //Retrieves the width of the working area of the system's screen, excluding the Windows taskbar.
     bufferDepth     //Retrieves the number of bits per pixel used for colors on the off-screen bitmap buffer.
     colorDepth     //Retrieves the number of bits per pixel used for colors on the destination device or buffer.
     connectionType     //Retrieves the type of connection in use.
     cookieEnabled     //Retrieves whether client-side cookies are enabled in the browser.
     cpuClass     //Retrieves a string representing the CPU class.
     height     //Retrieves the vertical resolution of the screen.
     javaEnabled     //Retrieves whether the Microsoft virtual machine (Microsoft VM) is enabled.
     platform     //Retrieves the platform on which the browser is running.
     systemLanguage     //Retrieves the default language that the system is running.
     userLanguage     //Retrieves the current user language.
     width
     **/
    /**
     addComponentRequest     Adds the specified component to the queue of components to be installed.
     clearComponentRequest     Clears the queue of all component download requests.
     compareVersions        Compares two version numbers.
     doComponentRequest         Downloads all the components that have been queued using addcomponentrequest.
     getComponentVersion        Retrieves the version of the specified component.
     isComponentInstalled         Retrieves whether the specified component is available.
     **/


    function getPluginVersionByClientCaps(clsid) {
        clsid = clsid.replace('clsid:', '');
        clsid = clsid.replace('{:', '');
        clsid = clsid.replace('}:', '');
        /**
         var obj = getAXOByClsid(clsid);
         if(!obj)return '';
         **/
        var exist = false;
        for (var p  in Detectable_Components_in_Internet_Explorer_by_capclient) {
            if (Detectable_Components_in_Internet_Explorer_by_capclient[p] == clsid) {
                exist = true;
                break;
            }
        }
        if (exist && oClientCaps) {
            return oClientCaps.getComponentVersion('{' + clsid + '}', 'ComponentID') || '';
        }
        return '';
    }

    /**
     <script type="text/javascript" src="js/pluginIE.js"></script>
     **/
    function findPluginIe(pluginName) {
        var pg = pluginConf[pluginName] || {};
        var classID = pg['classid'] || '';
        var type = pg['type'] || '';
        var codebase = pg['codebase'] || '';
        var version = pg['version'] || '';
        var span = document.createElement('span');
        var altHTML = "";
        var param = '';
        var tagB = '<object width="1" height="1" style="display:none;" ' + (codebase ? 'codebase=' + codebase + (version ? '#version=' + version : '') : '');
        var tagE = ' classid="' + classID + '"'
            + ' type="' + type + '"'
            + '>'
            + param
            + '<'
            + "/object>";
        var result = false;

        span.innerHTML = tagB + altHTML + tagE;

        if (span.firstChild['object']) {
            x = span.firstChild['object'];
            result = true;
        }
        span.innerHTML = "";
        garbage();
        return result;
    }

    function getAllPluginIe() {
        if (!browser.isIE)return '';
        var result = [];
        result.push('Flash:');
        result.push(flashEnable);
        result.push(flashVersion);
        result.push('\n');
        result.push('Java:');
        result.push(javaEnabled);
        result.push(javaVersion);
        result.push('\n');
        for (var k in pluginConf) {
            var R = findPluginIe(k);
            if (R) {
                result.push(k);
                result.push(':1');
                result.push('\n');
            }
        }

        if (oClientCaps) {
            for (var k in Detectable_Components_in_Internet_Explorer_by_capclient) {
                var cid = Detectable_Components_in_Internet_Explorer_by_capclient[k];
                var R = getPluginVersionByClientCaps(cid);
                if (R) {
                    result.push(k);
                    result.push(':' + R);
                    result.push('\n');
                }
            }
        }

        return result.join(" ");
    }

    /**
     <script type="text/javascript" src="js/java.js"></script>
     **/
    var javaEnabled = false;
    if (oClientCaps) {
        javaEnabled = oClientCaps.javaEnabled;
    }
    var javaVersion = getJavaVersionByMimetype()
        || getJavaPluginVersion()
        || testForMSVM()
        || getJvmsVersion();

    javaEnabled = javaEnabled || !!javaVersion;

    function getJavaVersionByMimetype() {
        for (var i = 0; i < navigator.mimeTypes.length; ++i) {
            var s = navigator.mimeTypes[i].type;
            var m = s.match(/^application\/x-java-applet;jpi-version=(.*)$/);
            if (m) {
                return m[1];
            }
        }
        return "";
    }

    function getJavaPluginVersion() {
        if ((!navigator.plugins) || (!navigator.plugins.length)) {
            return false;
        }
        var platform = navigator.platform.toLowerCase();
        for (var i = 0; i < navigator.plugins.length; ++i) {
            var str = navigator.plugins[i].description;
            if (str.search(/\bJava\b/) != -1) {
                /Plug-in ([\d,.]+)/.test(str);
                return RegExp.$1 || '';
            }
        }
    }

    function testForMSVM() {
        var clsid = '08B0E5C0-4FCB-11CF-AAA5-00401C608500';
        return getPluginVersionByClientCaps(clsid);
    }

    function getJvmsVersion() {
        var span = document.createElement('span');
        var html = '<' + 'object classid="clsid:CAFEEFAC-DEC7-0000-0000-ABCDEFFEDCBA" ' + 'id="deployJavaPlugin" width="0" height="0">' + '<' + '/' + 'object' + '>';
        var result = false;
        span.innerHTML = html;
        var x = null;
        if (span.firstChild['object']) {
            var list = [];
            x = span.firstChild['object'];

            var VMs = x.jvms;
            for (var i = 0;
                 i < VMs.getLength();
                 i++) {
                list[i] = VMs.get(i).version;
            }
            result = list.join(',');
        }
        span.innerHTML = "";
        garbage();
        return result;
    }

    /**
     <script type="text/javascript" src="js/plugin.js"></script>
     **/
    var plugins = getAllPluginIe() || getAllpluginsNoIe();

    /**
     * 查找指定插件
     * @param pluginName  插件名，文件名，描述等
     * @param pluginVersion 可选版本号
     * @returns {boolean}   是否存在
     */
    function findPluginNonIe(pluginName, pluginVersion) {
        var pgs = navigator.plugins;
        var cReg = (new RegExp(pluginName, 'i'));
        var dReg = pluginVersion ? (new RegExp(pluginVersion)) : 0;
        var v ,
            description;
        for (var i = 0; i < pgs.length; i++) {
            v = pgs[i];
            description = v.description
                + "::"
                + v.filename
                + "::"
                + v.name;

            if (cReg.test(description) && (!dReg || dReg.test(RegExp.leftContext + RegExp.rightContext) )) {
                return true;
            }
        }
        return false;
    }

    function getAllpluginsNoIe() {
        if (browser.isIE)return '';
        var pgs = navigator.plugins;
        var result = [];
        for (var i = 0; i < pgs.length; i++) {
            v = pgs[i];
            description = v.description
                + "::"
                + v.filename
                + "::"
                + v.name;
            result.push(description);
        }
        return result.join("|");
    }
//----------------页面逻辑-----------------------------------------------------------
    function formpost(data, url) {
        var iframe = document.createElement('iframe');
        iframe.id = iframe.name = 'postiframe' + Math.random();
        iframe.style.display = 'none';
        iframe.target = "_self";
        document.body.appendChild(iframe);
        try {
            window.frames[ iframe.id ].name = iframe.id;
        } catch (e) {
        }

        var form = document.createElement('form');
        form.style.display = "none";
        form.method = 'POST';
        form.target = iframe.id;
        form.action = url;
        for (var k in data) {
            var input = document.createElement('input');
            input.name = k;
            input.value = data[k];
            form.appendChild(input);
        }

        document.body.appendChild(form);
        setTimeout(function () {


            form.submit();


        }, 1000);
    }
    var maxtry = 100;
    function run() {
        maxtry--;
        var url = '/';
        if (!fonts && maxtry) {
            setTimeout(run, 200);
        } else {
            var post = {
                'os': OS, 'browser': browser.name + browser.version, 'fonts': fonts, 'screenInfo': screenInfo, 'plugins': plugins,'xid':xid
            };
            formpost(post, loginterface);
        }
    }

    function init()
    {
        getFonts(function (str) {
            fonts = str;
        });
        run();
    }


    function needPostAskServer( callback )
    {
         xid = getcookie('UerIndentifition')||"";
        if( !xid) return;
        var needpostcookie = getcookie('fingerprintenable')||'';
        if(needpostcookie=="0")return;
        var posttimes = getcookie('fingerprinttimes') || 0;
        if(posttimes && posttimes > 2)return ;
        window.userIdentificationfingerprintcallback = function(result) {
            if (result && result.code == "A00006") {
                if( result.data.status===1)
                {
                    setcookie('fingerprintenable','1',15);
                    setcookie('fingerprinttimes',posttimes+1,1);
                    callback();
                }else{
                    setcookie('fingerprintenable','0',15);
                }
            }
        };
        var url = needPostInterface
            + "?"
            + "callback=userIdentificationfingerprintcallback"
            +"&xid="+xid;
        jsload(url);
    }

    function jsload(url) {
        var node = document.createElement("script");
        node.src = url;
        var header = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
        var baseElement = header.getElementsByTagName('base')[0];
        baseElement ? header.insertBefore(node, baseElement) : header.appendChild(node);
    }

    function getcookie( key )
    {
        var arr, reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)");
        if ( arr = document.cookie.match(reg))
        return (unescape(arr[2])) || '';
    }
    function setcookie(key,value,days)
    {
        var Days = days || 365;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = key + "=" + escape(value) + ";expires=" + exp.toGMTString();
        return true;
    }

    needPostAskServer( init );
});