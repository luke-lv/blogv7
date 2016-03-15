/**
 * ua检测
 */
SinaEditor.regist('env', function (SE) {
    function userAgent() {
        var ua = navigator.userAgent;
        var matches;
        if (matches = /msie (\d+\.\d+)/i.exec(ua)) {
            Env.$msie = true;
        } else if (/Trident\/\d+\.\d+;/i.exec(ua)) {
            Env.$msie = true;
            matches = /(?:rv:|MSIE)[ ]*(\d+\.{0,1}\d*)/i.exec(ua);
        } else if (matches = /firefox[\/\s](\d+\.\d+)/i.exec(ua)) {
            Env.$firefox = true;
        } else if (matches = /chrome\/(\S+) safari\/(?:\S+)/i.exec(ua)) {
            Env.$webkit = true;
            Env.$chrome = true;
        } else if (matches = /safari\/(\S+)/i.exec(ua)) {
            Env.$webkit = true;
            Env.$safari = true;
        } else if (matches = /opera[\/\s](\d+\.\d+)/i.exec(ua)) {
            Env.$opera = true;
        }

        if (matches) {
            Env.version = parseInt(matches[1], 10);
        }

        if (/Mac OS/.test(ua) && /Mac/.test(navigator.platform)) {
            Env.mac = !0;
        }

        if (Env.$msie && Env.version < 7) {
            Env.$ie6 = true;
        }

        if (Env.$msie) {
            Env.$belowIe9 = false;
            if (Env.version < 9) {
                Env.$belowIe9 = true;
            }
        }
    }

    /**
     * UA信息
     */
    var Env = {
        /**
         * @property {boolean} mac - Mac系统
         */
        mac: !1,
        /**
         * @property {number} version - 浏览器版本号
         */
        version: 0,
        /**
         * @property {boolean} $webkit - Webkit内核浏览器
         */
        $webkit: false,
        /**
         * @property {boolean} $firefox - Firefox浏览器
         */
        $firefox: false,
        /**
         * @property {boolean} $msie - msie浏览器
         */
        $msie: false,
        /**
         * @property {boolean} $safari - Safari浏览器
         */
        $safari: false,
        /**
         * @property {boolean} $opera - Opera浏览器
         */
        $opera: false,
        /**
         *  @property {boolean} $ie6 - ie6浏览器
         */
        $ie6: false,
        /**
         *  @property {boolean} $ie6 - ie6浏览器
         */
        $belowIe9: undefined
    };

    var userAgentStr = navigator.userAgent;

    userAgent(userAgentStr);
    /**
     * UA信息
     * @type {{mac: boolean, version: number, $webkit: boolean, $firefox: boolean, $msie: boolean, $safari: boolean, $opera: boolean}}
     */
    return Env;
});
