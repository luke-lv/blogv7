$import("sina/sina.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/core/class/define.js");
$import("sina/core/events/addEvent.js");
$import("sina/utils/io/jsload.js");
$import("sina/utils/cookie/getCookie.js");

$import("lib/lib.js");
$import("lib/register.js");
$import("lib/listener.js");
$import('lib/tray/tpl/notice.js');
$import("lib/panel.js");

/**
 * @fileoverview 博文页通告浮层
 * @author Qiangyee | wangqiang1@staff
 * @created 2013-04-12
 */
Lib.register('tray.BlogNotice', function(lib) {

    var _addEvt = Core.Events.addEvent,
        setCookie = Utils.Cookie.setCookie,
        pageId = scope.$pageid;

    var notice = Core.Class.define(function() {
        lib.Panel.prototype.initialize.apply(this, arguments);
        this.setTemplate(lib.tray.tpl.notice);
        this.initEvt();
    }, lib.Panel, {
        initEvt: function() {
            var $this = this;
            _addEvt(this.getNode('close'), function(evt) {
                evt = evt || window.event;
                setCookie("closeNotice_fzp", $UID, 24, "/", ".blog.sina.com.cn");
                lib.Listener.notify('tray-announce-close', {});
                $this.destroy();
            });
        },
        update: function(json) {
            var $tj = this.getNode('tj'),
                $announce = this.getNode('announce');

            //广告后台数据
            var slotres = '';
            //除SLOT_58,SLOT_59以外，都是jobs/rightAD.js中所需要的数据。
            var sourceArr = ['SLOT_58', 'SLOT_59', 'SLOT_98', 'SLOT_99', 'SLOT_100', 'SLOT_101', 'SLOT_102'];
            // var sloturl = 'http://interface.blog.sina.com.cn/riaapi/pageslot/pageslot.php';
            var sloturl = 'http://comet.blog.sina.com.cn/api?maintype=pageslot';
            
            var reqdata = {
                id: sourceArr
            };
            if (typeof scope != 'undefined') {
                reqdata.blogeruid = scope.$uid;
            }
            if ($UID) {
                reqdata.loginuid = $UID;
            }

            if ($isLogin && json.announce.result && (pageId === "indexM" || pageId === "articleM" || pageId === "articlelistM")) {
                $announce.innerHTML = json.announce.announce_con;
                $announce.style.display = '';
            } else {
                // var adInfo = json.advertise;
                // var adCon1 = decodeURIComponent(adInfo.advertise_con1.content);
                // var adCon2 = decodeURIComponent(adInfo.advertise_con2.content);
                // var adHref1 = decodeURIComponent(adInfo.advertise_con1.link);
                // var adHref2 = decodeURIComponent(adInfo.advertise_con2.link);
                var noticeAd1 = this.getNode('noticeAd1');
                var noticeAd2 = this.getNode('noticeAd2');

                var complete = function(res) {
                    var randomIndex = 0;
                    var adcon1 = res[sourceArr[0]].res;
                    var adcon2 = res[sourceArr[1]].res;

                    if (adcon1 || adcon2) {
                        if (adcon1) {
                            randomIndex = 0;
                            if (adcon1.length > 1) {
                                randomIndex = Math.floor((adcon1.length + 1) * Math.random());
                            }
                            noticeAd1.innerHTML = adcon1[randomIndex].words;
                            noticeAd1.href = adcon1[randomIndex].a_href;
                            noticeAd1.title = adcon1[randomIndex].a_title;
                            noticeAd1.setAttribute('suda-uatrack', adcon1[randomIndex].a_c_suda.replace('suda-uatrack=', '').replace('"', '').replace('"', ''));

                            if (typeof SUDA !== 'undefined') {
                                SUDA.uaTrack(adcon1[randomIndex].a_v_suda_key, adcon1[randomIndex].a_v_suda_value);
                            }
                        }
                        if (adcon2) {
                            randomIndex = 0;
                            if (adcon2.length > 1) {
                                randomIndex = Math.floor((adcon2.length + 1) * Math.random());
                            }
                            noticeAd2.innerHTML = adcon2[randomIndex].words;
                            noticeAd2.href = adcon2[randomIndex].a_href;
                            noticeAd2.title = adcon2[randomIndex].a_title;
                            noticeAd2.setAttribute('suda-uatrack', adcon2[randomIndex].a_c_suda.replace('suda-uatrack=', '').replace('"', '').replace('"', ''));

                            if (typeof SUDA !== 'undefined') {
                                SUDA.uaTrack(adcon2[randomIndex].a_v_suda_key, adcon2[randomIndex].a_v_suda_value);
                            }
                        }

                        $tj.style.display = '';
                    }

                };

                if (scope.__subscribeSlot === 'waitting') {
                    scope.__subscribeSlotFunc = complete;
                } else if (typeof scope.__subscribeSlot === 'object') {
                    complete(scope.__subscribeSlot);
                } else {
                    scope.__subscribeSlot = 'waitting';
                    Utils.Io.JsLoad.request(sloturl, {
                        GET: reqdata,
                        onComplete: function(res) {
                            complete(res);
                            scope.__subscribeSlot = res;
                            if ('function' == typeof scope.__subscribeSlotFunc) {
                                scope.__subscribeSlotFunc(res);
                            }
                        },
                        onException: function() {
                        }
                    });
                }




                // noticeAd1.innerHTML = adCon1;
                // noticeAd1.href = adHref1;
                // noticeAd2.innerHTML = adCon2;
                // noticeAd2.href = adHref2;
                // $tj.style.display = '';
            }
        },
        /**
         * 初始化面板的呈现方式
         * @param {String} tempalte 模板HTML
         */
        setTemplate: function(template) {

            this.template = template;

            var tmp = new Lib.HtmlTemplate(this.template, this.uniqueID);
            this.tpl = tmp;

            //console.log('appendTo',this.appendTo);
            Core.Dom.insertHTML($E(this.appendTo), tmp.getHtmlString(), 'afterbegin');

            this.entity = $E("_" + this.uniqueID + "_panel");
            this.entity.style.display = "none";

            tempEntity = null;
        }
    });
    return notice;
});
