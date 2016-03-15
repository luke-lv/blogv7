/**
 * @fileoverview
 *    图片博客 - 图片博文列表
 * @author Luo Rui | luorui1@staff.sina.com.cn
 * @version 1.0
 *
 */
$import("sina/utils/io/ajax.js");

$import("lib/interface.js");

$import("component/comp_10007.js");
$registComp("10007", {
    "pagesize": 5, "interfaceSaveSet": new Interface('http://control.blog.sina.com.cn/riaapi/component_config/write_component.php', 'ajax'), "interfaceReadSet": new Interface('http://control.blog.sina.com.cn/riaapi/component_config/read_component.php', 'ajax'), "interfaceShow": new Interface('http://control.blog.sina.com.cn/riaapi/appMake_Show.php', 'jsload'), "interfaceGetList": new Interface('http://control.blog.sina.com.cn/riaapi/photoblog/get_abroad_blog_list_by_page.php', 'jsload') //分页获取博文列表

    , "load": function () {
        this.renderPaging(this.size > 210 ? 1 : 3);
        this.load = this.trueLoad;
        this.trueLoad();
    }, "checkUserFlash": function () {
        var ver = this.getFlashVer();
        if (ver < 9) {
            var obj = $T(this.getContent(), 'object')[0];
            if (!obj) obj = $T(this.getContent(), 'embed')[0];
            if (!obj) return;
            obj.style.display = 'none';
            html = '<div class="noFlash_txt">' + '您可以在<a href="http://get.adobe.com/flashplayer/" target="_blank">此处下载免费的Adobe flash player installer</a>。成功安装程序后，可返回此处查看flash地图。' + '</div>';
            Core.Dom.insertHTML(Core.Dom.getElementsByClass(this.getContent(), 'div', 'mapFlash')[0], html, "AfterBegin");
        }
    }, "trueLoad": function () {
        var _this = this;
        this.interfaceShow.request({
            GET: {
                uid: scope.$uid,
                vid: this.compId,
                width: this.size
            }, onSuccess: function (data) {
                _this["render_" + _this.size](data);
                return;
            }, onError: function (data) {
                showError(data.code);
            }, onFail: function () {
                showError(data.code);
            }
        });
        return;
    }, "render_210": function (data) {
        this.render(data);
        this.renderPaging(3);
    }, "render_510": function (data) {
        this.render(data);
        this.renderPaging(1);
    }, "render_730": function (data) {
        this.render(data);
        this.renderPaging(1);
    }, "render": function (data) {
        this.getContent().innerHTML = data;
        this.isSetOn = null;
        this.checkUserFlash();
    }, "renderPaging": function (type) {
        var _this = this;
        var maxPage = this.getMaxPage();
        if (!$E("comp_" + this.compId + "_page")) return;
        $E("comp_" + this.compId + "_page").style.display = 'block';

        if (maxPage > 1) {
            Ui.Pagination.init({
                "pageNode": "comp_" + this.compId + "_page",
                "nodeClassNamePrefix": "SG",
                "curPage": 1, // 当前所在页码
                "maxPage": maxPage, //最大页数
                "pageTpl": function (page) {
                    _this.renderList(page);
                },
                "type": type
            }).show();
        }
    }, "getMaxPage": function () {
        if (!$E("cnt_abroad")) return;
        var count = $E('cnt_abroad').innerHTML;
        return Math.ceil(count / this.pagesize);
    }, "renderList": function (page) {
        var _this = this;
        this.interfaceGetList.request({
            GET: {
                uid: scope.$uid,
                page: page,
                size: _this.pagesize
            }, onSuccess: function (data) {
                _this.createList(data);
            }
        });
    }, "createList": function (data) {
        var template = '<li class="SG_dot">{0}{1}<a href="http://blog.sina.com.cn/s/blog_{2}.html" target="_blank">{3}</a></li>';
        var htmlStr = '';
        for (var n = 0, m = data.length; n < m; n++) {
            htmlStr += template.format(data[n].suggest, '[' + this.nationMap[data[n].nation] + ']', data[n].blog_id, data[n].blog_title);
        }
        $E('comp_10007_list').innerHTML = htmlStr;
    }, "getUserSet": function () {
        if (this.isSetOn == null) {
            this.isSetOn = true;
            Core.Dom.insertHTML(this.getContent(), '<div id="comp_' + this.compId + '_set"></div>', "AfterBegin");
            Core.Function.bind2(function () {
                var usersetHtml = '<div class="vp_login #{cls}"><div>' + ' 用分类筛选：<select id="comp_' + this.compId + '_type">#{type}</select>' + '</div>#{span210start}<a href="#" onclick="Core.Function.bind2(Lib.Component.instances[' + this.compId + '].saveUserSet, Lib.Component.instances[' + this.compId + '])();return false;" class="SG_aBtn SG_aBtnB "><cite>确定</cite></a>&nbsp;' + '<a href="#" onclick="Core.Dom.removeNode($E(\'comp_' + this.compId + '_set\'));Lib.Component.instances[' + this.compId + '].isSetOn=null;return false;" class="SG_aBtn SG_aBtnB "><cite>取消</cite></a>#{span210end}</div>';
                var tplData = {
                    cls: this.size == 210 ? 'w4' : this.size == 510 ? 'w2' : 'w1',
                    type: '<option value="1">全部显示</option><option value="0">国内</option><option value="2">国外</option>'
                };
                var hashMap = {
                    "0": 1,
                    "1": 0,
                    "2": 2
                };
                this.interfaceReadSet.request({
                    GET: {
                        "uid": scope.$uid
                    }, POST: {
                        "title_code": this.compId
                    }, onSuccess: Core.Function.bind2(function (oData) {
                        var info = oData[this.compId];
                        this.displayType = info.my_body.display_type;
                        var template = new Ui.Template(usersetHtml);
                        var result = template.evaluate(tplData);
                        $E('comp_' + this.compId + '_set').innerHTML = result;
                        $E('comp_' + this.compId + '_type').selectedIndex = hashMap[this.displayType];
                    }, this), onError: function (oData) {
                        showError(oData.code);
                    }, onFail: function () {
                        showError("A00001");
                    }
                });
            }, this)();
        }

    }
    /*
     * 保存用户设置并刷新当前列表
     */, "saveUserSet": function () {
        Debug.info("save..." + this.compId);
        // 如果显示模式和分类都未变化，就直接删除设置 DIV，不做接口提交
        var displayType = $E('comp_' + this.compId + '_type').value;
        if (displayType == this.displayType) {
            Debug.log("组件 " + this.compId + " 没有任何修改，直接关掉设置浮层");
            Core.Dom.removeNode($E('comp_' + this.compId + '_set'));
            this.isSetOn = null;
        } else {
            this.interfaceSaveSet.request({
                POST: {
                    "title_code": this.compId,
                    "display_type": displayType,
                    "cat": 0
                },
                onSuccess: Core.Function.bind2(function () {
                    this.isSetOn = null;
                    Core.Dom.removeNode($E('comp_' + this.compId + '_set'));
                    Debug.info("如果改变了分类或者显示模式，就刷新组件");
                    this.load();
                }, this),
                onError: function (oData) {
                    showError(oData.code);
                },
                onFail: function () {
                    showError("A00001");
                }
            });
        }
    }, "getFlashVer": function () {
        var version = 0;
        var nav = navigator;
        if (nav.plugins && nav.plugins.length) {
            for (var n = 0, m = nav.plugins.length; n < m; n++) {
                if (nav.plugins[n].name.indexOf('Shockwave Flash') != -1) {
                    version = nav.plugins[n].description.split('Shockwave Flash ')[1].split(' ')[0];
                    break;
                }
            }
        } else if (window.ActiveXObject) {
            for (var n = 10; n >= 2; n--) {
                try {
                    var obj = eval("new ActiveXObject('ShockwaveFlash.ShockwaveFlash." + n + "');");
                    if (obj) {
                        version = n + '.0';
                        break;
                    }
                } catch (e) {
                }
            }
        }
        return parseInt(version);
    }, "nationMap": {
        1: '中国',
        2: '阿尔巴尼亚',
        3: '阿尔及利亚',
        4: '阿富汗',
        5: '阿根廷',
        6: '阿联酋',
        7: '阿鲁巴',
        8: '阿曼',
        9: '阿塞拜疆',
        10: '埃及',
        11: '埃塞俄比亚',
        12: '爱尔兰',
        13: '爱沙尼亚',
        14: '安道尔',
        15: '安哥拉',
        16: '安圭拉',
        17: '安提瓜和巴布达',
        18: '奥地利',
        19: '澳大利亚',
        20: '巴巴多斯',
        21: '巴布亚新几内亚',
        22: '巴哈马',
        23: '巴基斯坦',
        24: '巴拉圭',
        25: '巴勒斯坦',
        26: '巴林',
        27: '巴拿马',
        28: '巴西',
        29: '白俄罗斯',
        30: '百慕大',
        31: '保加利亚',
        32: '北马里亚纳群岛',
        33: '贝宁',
        34: '比利时',
        35: '冰岛',
        36: '玻利维亚',
        37: '波多黎各',
        38: '波黑',
        39: '波兰',
        40: '波斯尼亚和墨塞哥维那',
        41: '博茨瓦纳',
        42: '伯利兹',
        43: '不丹',
        44: '布基纳法索',
        45: '布隆迪',
        46: '朝鲜',
        47: '赤道几内亚',
        48: '丹麦',
        49: '德国',
        50: '东帝汶',
        51: '多哥',
        52: '多米尼加',
        53: '多米尼克',
        54: '俄罗斯',
        55: '厄瓜多尔',
        56: '厄立特里亚',
        57: '法国',
        58: '法罗群岛',
        59: '法属波利尼西亚',
        60: '法属圭亚那',
        61: '梵蒂冈',
        62: '斐济',
        63: '菲律宾',
        64: '芬兰',
        65: '佛得角',
        66: '冈比亚',
        67: '刚果（布）',
        68: '刚果（金）',
        69: '哥伦比亚',
        70: '哥斯达黎加',
        71: '格林纳达',
        72: '格陵兰',
        73: '格鲁吉亚',
        74: '古巴',
        75: '瓜德罗普',
        76: '关岛',
        77: '圭亚那',
        78: '哈萨克斯坦',
        79: '海地',
        80: '韩国',
        81: '荷兰',
        82: '荷属安的列斯',
        83: '黑山',
        84: '洪都拉斯',
        85: '基里巴斯',
        86: '吉布提',
        87: '吉尔吉斯斯坦',
        88: '几内亚',
        89: '几内亚比绍',
        90: '加拿大',
        91: '加那利群岛',
        92: '加纳',
        93: '加蓬',
        94: '柬埔寨',
        95: '捷克',
        96: '津巴布韦',
        97: '喀麦隆',
        98: '卡塔尔',
        99: '开曼群岛',
        100: '科摩罗',
        101: '科特迪瓦',
        102: '科威特',
        103: '克罗地亚',
        104: '肯尼亚',
        105: '库克群岛',
        106: '拉脱维亚',
        107: '莱索托',
        108: '老挝',
        109: '黎巴嫩',
        110: '利比里亚',
        111: '利比亚',
        112: '立陶宛',
        113: '列支敦士登',
        114: '留尼旺',
        115: '卢森堡',
        116: '卢旺达',
        117: '罗马尼亚',
        118: '马达加斯加',
        119: '马德拉群岛',
        120: '马耳他',
        121: '马尔代夫',
        122: '马拉维',
        123: '马来西亚',
        124: '马里',
        125: '马其顿',
        126: '马绍尔群岛',
        127: '马提尼克',
        128: '毛里求斯',
        129: '毛里塔尼亚',
        130: '美国',
        131: '美属萨摩亚',
        132: '美属维尔京群岛',
        133: '蒙古',
        134: '蒙特塞拉特',
        135: '孟加拉国',
        136: '秘鲁',
        137: '密克罗尼西亚',
        138: '缅甸',
        139: '摩尔多瓦',
        140: '摩洛哥',
        141: '摩纳哥',
        142: '莫桑比克',
        143: '墨西哥',
        144: '纳米比亚',
        145: '南非',
        146: '瑙鲁',
        147: '尼泊尔',
        148: '尼加拉瓜',
        149: '尼日尔',
        150: '尼日利亚',
        151: '纽埃',
        152: '挪威',
        153: '帕劳',
        154: '皮特凯恩',
        155: '葡萄牙',
        156: '日本',
        157: '瑞典',
        158: '瑞士',
        159: '萨尔瓦多',
        160: '萨摩亚',
        161: '塞尔维亚',
        162: '塞拉利昂',
        163: '塞内加尔',
        164: '塞浦路斯',
        165: '塞舌尔',
        166: '沙特阿拉伯',
        167: '圣多美和普林西比',
        168: '圣赫勒拿',
        169: '圣基茨和尼维斯',
        170: '圣卢西亚',
        171: '圣马力诺',
        172: '圣文森特和格林纳丁斯',
        173: '斯里兰卡',
        174: '斯洛伐克',
        175: '斯洛文尼亚',
        176: '斯威士兰',
        177: '苏丹',
        178: '苏里南',
        179: '索马里',
        180: '所罗门群岛',
        181: '塔吉克斯坦',
        182: '泰国',
        183: '坦桑尼亚',
        184: '汤加',
        185: '特克斯和凯科斯群岛',
        186: '特立尼达和多巴哥',
        187: '突尼斯',
        188: '图瓦卢',
        189: '土耳其',
        190: '土库曼斯坦',
        191: '托克劳',
        192: '瓦利斯和富图纳',
        193: '瓦努阿图',
        194: '危地马拉',
        195: '委内瑞拉',
        196: '文莱',
        197: '乌干达',
        198: '乌克兰',
        199: '乌拉圭',
        200: '乌兹别克斯坦',
        201: '西班牙',
        202: '西撒哈拉',
        203: '希腊',
        204: '新加坡',
        205: '新喀里多尼亚',
        206: '新西兰',
        207: '匈牙利',
        208: '叙利亚',
        209: '牙买加',
        210: '亚美尼亚',
        211: '亚速尔群岛',
        212: '也门',
        213: '伊拉克',
        214: '伊朗',
        215: '以色列',
        216: '意大利',
        217: '印度',
        218: '印度尼西亚',
        219: '英国',
        220: '英属维尔京群岛',
        221: '约旦',
        222: '越南',
        223: '赞比亚',
        224: '乍得',
        225: '智利',
        226: '中非'
    }
}, "dynamic");
