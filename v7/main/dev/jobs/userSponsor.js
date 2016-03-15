/**
 * @fileoverview 博客用户赞助打赏功能
 * @author jiangwei5@staff.sina.com.cn
 * @date 
 */
$import("sina/core/dom/insertHTML.js");
$import("sina/core/events/addEvent.js");
$import("lib/uic.js");
$import("lib/panel.js");
$import("sina/core/system/winSize.js");
$import("sina/ui/dialog/backShadow.js");
$import("lib/listener.js");
$import("sina/core/dom/getChildrenByClass.js");
$import("sina/core/dom/getElementsByAttr.js");
$import("sina/utils/form/functionlimit.js");
$import("sina/utils/form/textareaMaxLength.js");
$import("sina/utils/form/radio.js");
$import("sina/core/function/bind3.js");
$import("lib/checkAuthor.js");
$import("lib/login/ui.js");
$import("sina/utils/cookie/getCookie.js");
$import("sina/utils/cookie/setCookie.js");
$import("lib/sendLog.js");
$import("sina/core/events/getEventTarget.js");

$registJob("userSponsor", function (){
    var insertHTML = Core.Dom.insertHTML;
    var addEvent = Core.Events.addEvent;
    var getChildrenByClass = Core.Dom.getChildrenByClass;
    var getEventTarget = Core.Events.getEventTarget;
    //布码信息
    var statCodes = {
        "index": {
            "info": ["26_01_01_", "26_01_02_"]
        },
        "article": {
            "info": ["26_01_03_", "26_01_04_"],
            "art": ["26_01_05_", "26_01_06_"]
        },
        "articletjTech": {
            "art": ["26_01_07_", "26_01_08_"]
        },
        "articletj": {
            "art": ["26_01_07_", "26_01_08_"]
        },
        "popup": ["26_01_11_", "26_01_12_"]
    };
    //当前页面信息
    var pageInfo = {
        id: scope.$pageid,
        aid: scope.$articleid,
        buid: scope.$uid,
        uid: null,
        nickName: null
    };
    //错误提示文本
    var ERROR_MSG = [
        "赞助金额不能为空，请选择一定数值！",
        "赞助金额最高5000元，请重新输入 ！",
        "赞助理由应在100字以内，请重新输入！",
        "对不起，1分钟内只能赞助1次！"
    ];
    //浮层操作对象
    var popup = {
        //浮层模板
        tpl: '<table class="CP_w" id="#{panel}" style="z-index: 5000">' +
                '<thead>' + 
                  '<tr>' + 
                    '<th class="tLeft"><span></span></th>' +
                    '<th class="tMid"><div class="bLyTop"><strong>赞助</strong><cite><a href="javascript:void(0)" class="CP_w_shut" title="关闭" id="#{btnclose}">关闭</a></cite></div></th>' +
                    '<th class="tRight"><span></span></th>' +
                  '</tr>' +
                '</thead>' +
                '<tfoot>' +
                  '<tr>' +
                    '<td class="tLeft"><span></span></td>' +
                    '<td class="tMid"><span></span></td>' +
                    '<td class="tRight"><span></span></td>' +
                 '</tr>' +
                '</tfoot>' +
                '<tbody>' +
                  '<tr>' +
                    '<td class="tLeft"><span></span></td>' +
                    '<td class="tMid"><div class="CP_layercon3 denounce">' +
                        '<ul class="denPicRow denPicRow01 clearfix">' + 
                          '<li><span class="a">收款博主：</span><span class="b" id="#{nickName}"></span></li>' +
                          '<li><span class="a"><span class="CP_w_star"><em>*</em></span>赞助金额：</span><span class="b rlist">' +
                            '<input name="option" type="radio" value="1" id="ccb1">' +
                            '<label for="ccb1">1元</label>' +
                            '<input name="option" type="radio" value="2" id="ccb2">' +
                            '<label for="ccb2">5元</label>' +
                            '<input name="option" type="radio" value="3" id="ccb3">' +
                            '<label for="ccb3">20元</label>' +
                            '<input name="option" type="radio" value="4" id="ccb4">' +
                            '<label for="ccb4">100元</label>' +
                            '<br>' +
                            '<input name="option" type="radio" value="5" id="ccb5">' +
                            '<label for="ccb5">其他</label>' +
                            '<input name="money2" type="text" class="SG_input" id="#{money2}">' +
                            '</span>' +
                            '<div class="ErrTips01"><span class="SG_clewtxta" id="#{err01}" style="display:none;"></span></div>' +
                          '</li>' +
                          '<li><span class="a">赞助理由：</span><span class="b">' +
                            '<textarea class="SG_textarea textawh" id="#{textarea}"></textarea>' +
                            '</span>' +
                            '<div class="ErrTips01"><span class="SG_clewtxta" id="#{err02}" style="display:none;"></span></div>' +
                          '</li>' +
                        '</ul>' +
                        '<form action="" method="post" id="#{sponsorForm}">' + 
                          '<input type="hidden" name="fuid" value="" />' +
                          '<input type="hidden" name="blogid" value="" />' +
                          '<input type="hidden" name="type" value="" />' +
                          '<input type="hidden" name="money" value="" />' +
                          '<input type="hidden" name="desc" value="" />' +
                        '</form>' +
                        '<div class="butt01"> <a href="javascript:void(0)" class="SG_aBtn SG_aBtnB " id="#{submit}"><cite>确认并付款</cite></a></div>' +
                        '<div class="clearit"></div>' +
                      '</div></td>' +
                    '<td class="tRight"><span></span></td>' +
                  '</tr>' +
                '</tbody>' +
              '</table>',
        ttTip: "可输入100字",//赞助留有框默认文案
        moneyTip: "请输入整数，每单最多5000元",//自定义金额框默认文案
        sId: "sponsorSid",//用于限制提交的cookie--key
        w: 500,
        h: 300,
        status: 0, //可用状态 0-不可用 1-可用
        bs: null, //遮罩
        panel: null, 
        type: 0, //赞助类型 0-博主 1-博文
        isError: 0, //错误标识
        show: function (){
            this.initInput();
            this.bs.show();
            this.panel.show();
            v7sendLog(statCodes.popup[0] + pageInfo.uid);
        },
        hide: function (){
            this.panel.hide();
            this.bs.hidden();
        },
        initInput: function (){
            var self = this;
            self.radios[0].checked = true;
            self.moneyInput.value = self.moneyTip;
            self.textarea.value = self.ttTip;
            self.moneyInput.style.color = self.textarea.style.color = "";
            self.hideError();
        },
        init: function (){
            var self = this;
            var bs = popup.bs = new BackShadow(0.4);
            var panel = popup.panel = new Lib.Panel();
            panel.setTemplate(self.tpl);
            panel.getNode("nickName").innerHTML = pageInfo.nickName;
            var radios = self.radios = Core.Dom.getElementsByAttr(panel.getNode("panel"), "name", "option");//点选按钮
            var moneyInput = self.moneyInput = panel.getNode("money2");//输入框
            var textarea = self.textarea = panel.getNode("textarea");//多行输入框 
            var submitEl = panel.getNode("submit");//提交按钮
            var closeEl = panel.getNode("btnclose");//关闭按钮
            
            //初始化输入框
            self.initInput();
            //关闭浮层事件
            addEvent(closeEl, function(){self.hide();});
            //确认提交事件
            addEvent(submitEl, function(){
                var moneys = [1, 5, 20, 100];
                var rValue = Utils.Form.Radio.get(radios);
                var moneyInputValue = moneyInput.value/1 || 9999;
                var textareaValue = textarea.value;
                if(self.isError){
                    return;
                }
                //自定义金额限制
                if( rValue == 5 && moneyInputValue > 5000 ){
                    self.showError(1, ERROR_MSG[(moneyInput.value && moneyInput.value != self.moneyTip) ? 1 : 0]);
                    return;
                }
                //使用cookie限制提交间隔
                if(Utils.Cookie.getCookie(self.sId)){
                    self.showError(2, ERROR_MSG[3]);
                    return;
                }
                //提交表单
                self.submitForm({
                    money: rValue < 5 ? moneys[rValue - 1] : moneyInputValue,
                    desc: textareaValue.replace(/(^\s+)|(\s+$)/g, '').replace(self.ttTip, '')
                });
            });
            //当点击单选固定数值的选项时，将自定值输入框初始原始状态，隐藏错误行为。
            addEvent(radios[0].parentNode, function (event){
                var tEl = getEventTarget(event);
                if(tEl.getAttribute("name") === "option" && tEl.value < 5){
                    moneyInput.value = self.moneyTip;
                    moneyInput.style.color = "";
                    self.hideError(1);
                }
            });
            //单行输入框绑定事件
            addEvent(moneyInput, function (){
                radios[4].checked = true;
                if(moneyInput.value === self.moneyTip){
                    moneyInput.value = "";
                    moneyInput.style.color = "#666";
                }
            }, "focus");
            Utils.Form.functionlimit(moneyInput, function (v){//自定义金额限制输入
                v = v.replace(/(^[0]+)|[^\d]/g,'').substring(0, 4)/1 || 0;
                if(v > 5000 || v === 0){
                    self.showError(1, ERROR_MSG[v && 1]);
                }else{
                    self.hideError(1);
                }
                return v || '';
            });
            
            //多行输入框绑定交互事件
            addEvent(textarea, function (){
                if(textarea.value.replace(/(^\s+)|(\s+$)/g, '') === self.ttTip){
                    textarea.value = "";
                    textarea.style.color = "#666";
                }
            }, "focus");
            addEvent(textarea, function (){
                if(textarea.value.replace(/(^\s+)|(\s+$)/g, '') === ''){
                    textarea.value = self.ttTip;
                    textarea.style.color = "";
                }
            }, "blur");
            Utils.Form.textareaMaxLength(textarea, 200);//赞助理由限制输入长度
            self.setPosition();
            self.status = 1;
        },
        setPosition: function (){
            var self = this;
            var win = Core.System.winSize();
            var x = win.width / 2 - self.w / 2;
            var y = win.height / 2 - self.h / 2 - 20;
            self.panel.setPosition(x, y);
            self.panel.setFixed(true);
        },
        submitForm: function (data){
            var self = this, form = this.panel.getNode("sponsorForm");
            form.fuid.value = scope.$uid;
            form.money.value = data.money;
            form.type.value = self.type;
            form.blogid.value = scope.$articleid || '';
            form.desc.value = data.desc;
            form.action = "http://control.blog.sina.com.cn/admin/rewards/rewards.php";
            //设置cookie限制，有效期一分钟
            Utils.Cookie.setCookie(self.sId, $UID + '_'+ new Date().valueOf(), 0.017, "/", ".blog.sina.com.cn");
            v7sendLog(statCodes.popup[1] + pageInfo.uid);
            form.submit();
        },
        showError: function (type, msg){
            var errorEl = this.panel.getNode("err0" + (type||1));
            msg ? errorEl.innerHTML = msg : '';
            if(errorEl.style.display === "none"){
                errorEl.style.display = "";
                this.isError++;
            }
        },
        hideError: function (type){
            var self = this;
            var hide = function (el){
                if(el.style.display !== "none"){
                    el.style.display = "none";
                    self.isError--;
                }
            };
            if(self.isError > 0){
                var errorEl = self.panel.getNode("err0" + (type||1));
                hide(errorEl);
                if(!type){
                    errorEl = self.panel.getNode("err02");
                    hide(errorEl);
                    self.isError = 0;
                }
            }
        }
    };

    //个人资料模块添加赞助入口
    function insertFor901(){
        var htmlStr = '<a type="0" href="javascript:void(0)" class="btn_helpcenter" id="userSponsor_1"></a>';
        var m901 = $E("module_901");
        if(m901){
            v7sendLog(statCodes[pageInfo.id].info[0] + pageInfo.uid + '_' + pageInfo.buid);
            var pEl = getChildrenByClass(m901, "SG_connBody")[0];
            var el = insertHTML(pEl, htmlStr, "beforeEnd");
            addEvent(el, function (){
                v7sendLog(statCodes[pageInfo.id].info[1] + pageInfo.uid + '_' + pageInfo.buid);
                showDiv();
            });
            return el;
        }
    }
    //博文下方添加赞助入口
    function insertForArt(){
        var htmlStr = '<div class="btndiv_help"><a type="1" href="javascript:void(0)" class="btn_help"></a></div>';
        var artBody = scope.$pageid === 'articletjTech' ? $E("sina_keyword_ad_area2") : $E("articlebody");
        if(artBody){
            v7sendLog(statCodes[pageInfo.id].art[0] + pageInfo.uid + '_' + pageInfo.aid);
            var pEl = getChildrenByClass(artBody, "shareUp")[0];
            var el = insertHTML(pEl, htmlStr, "afterbegin");
            addEvent(el, function (){
                v7sendLog(statCodes[pageInfo.id].art[1] + pageInfo.uid + '_' + pageInfo.aid);
                showDiv(1);
            });
            return el;
        }
    }
 
    function showDiv(type){
        popup.type = type || 0;
        //展示赞助浮层方法
        var show = function (){
            pageInfo.uid = $UID;
            if(popup.status){
                popup.show();
                return;
            }
            //初始化浮层
            popup.init();
            popup.show();
        };
        //检测是否登录
        if(!$isLogin){
            var Login = new Lib.Login.Ui();
            Login.login(function(){
                scope.blogOpener.showDialog(function() {
                    (Core.Function.bind3(show, null, []))();
                });
            },false,"referer:"+location.hostname+location.pathname+",func:0004"); //添加统计点，加关注 0004
        }else{
            show();
        }
    }
    function addSponsor(){
        Lib.checkAuthor();
        pageInfo.uid = $UID;
        //获取博主昵称
        Lib.Uic.getNickName([scope.$uid], function(oResult){
            for (var key in oResult) {
                pageInfo.nickName = oResult[key];
            }
        });
        //插入赞助入口结点
        insertFor901();
        insertForArt();
    }

    Lib.Listener.on({
        name: "add_user_sponsor",
        callBack: function (data){
            if(data && data.rewards && data.rewards.result && data.rewards.result == 1){
                addSponsor();
            }
        }
    }); 
});