/*
* @fileoverview points dial  
* @author jiangwei5
*/
$import('sina/core/events/addEvent.js');
$import('sina/core/events/getEvent.js');
$import('sina/core/events/stopDefaultEvent.js');
$import("sina/core/system/winSize.js");
$import('sina/core/events/getEventTarget.js');
$import('sina/core/dom/addClass.js');
$import('sina/core/dom/removeClass.js');
$import('sina/core/dom/getElementsByAttr.js');
$import('sina/utils/shareToWeibo.js');
$import("lib/dialogConfig.js");
$import("lib/checkAuthor.js");
$import("lib/login/ui.js");
$import("lib/interface.js");
$import("lib/sendLog.js");
$import("lib/panel.js");
$import("sina/ui/dialog/backShadow.js");

$registJob('dial', function(){
    var addEvent = Core.Events.addEvent;
    var rmClass = Core.Dom.removeClass;
    var addClass = Core.Dom.addClass;
    var stopDefaultEvent = Core.Events.stopDefaultEvent;
    var getEvent = Core.Events.getEvent;
    var getEventTarget = Core.Events.getEventTarget;
    var getElementsByAttr = Core.Dom.getElementsByAttr;
    //所需数据配置
    var CONF = {
        //用于分享的活动主图
        imgUrl: "http://simg.sinajs.cn/blog7style/images/activity/jfdraw/theme.jpg",
        itf: new Interface("http://control.blog.sina.com.cn/blog_rebuild/riaapi/points/lottery.php","ijax"),
        awards: {
            "L0": {
                i: 3,
                t: "再来一次"
            },
            "L018": {
                i: 7,
                t: "8个博客积分"
            },
            "L0118": {
                i: 4,
                t: "18个博客积分"
            },
            "L0158": {
                i: 1,
                t: "58个博客积分"
            },
            "L01188": {
                i: 6,
                t: "188个博客积分"
            },
            "L01288": {
                i: 0,
                t: "288个博客积分"
            },
            "L01588": {
                i: 5,
                t: "588个博客积分"
            },
            "L011888": {
                i: 2,
                t: "1888个博客积分"
            }
        }
    };
    //发送抽奖请求，callback返回抽中的结果
    function reqLottery(callback){
        CONF.itf.request({
            POST: {},
            onSuccess: function(data){
                var lock = "L0";
                if(data && data.type){
                    var n = parseInt(data['number'])||0;
                    n > 0 ? (lock = "L" + data.type + n) : '';
                }
                callback(lock);
            },
            onError: function(result){
                callback(result && result.data);
            },
            onFail: function(){
                callback();
            }
        }); 
    };
    //简单模板替换
    function tplRep(tpl, data){
        return tpl.replace(/{(\w+)}/g, function(all, match){
            return data[match];
        });
    }
    //浮层
    var hintLayer = {
        tpl: '<div id="#{panel}" style="z-index:5000;">' +
                '<div class="layer">' +
                    '<div class="close"><a node-data="btnclose" href="#" class="a3">×</a></div>' +
                    '<p class="p1" node-data="title">标题</p>' +
                    '<p class="p2" node-data="subtext">副标题</p>' +
                    '<div class="btn" node-data="btnbox">按钮</div>' +
                    '<div class="hint" node-data="hint">提示</div>' +
                '</div>' +
        '</div>',
        bs: null,
        panel: null,
        box: null,
        ctype: 0,
        width: 432,
        height: 244,
        init: function (){
            var self = this;
            var bs = self.bs = new BackShadow(0.4);
            var panel = self.panel = new Lib.Panel();
            
            panel.setTemplate(self.tpl);
            self.box = panel.getNode("panel");
            self.setPosition();
        },
        setPosition: function (){
            var self = this;
            var win = Core.System.winSize();
            var x = win.width / 2 - self.width / 2;
            var y = win.height / 2 - self.height / 2 - 20;
            self.panel.setPosition(x, y);
            self.panel.setFixed(true);
        },
        initDom: function (obj){
            var self = this;
            var arr = ["title", "subtext", "btnbox", "hint"];
            if(obj.type == self.ctype) return;
            for(var i = 0; i < arr.length; i++){
                var el = getElementsByAttr(self.box, "node-data", arr[i])[0];
                if(el && obj[arr[i]]){
                    el.innerHTML = obj[arr[i]];
                }
            }
            self.ctype = obj.type;
        },
        show: function (obj){
            this.initDom(obj);
            this.bs.show();
            this.panel.show();
        },
        hide: function (){
            this.panel.hide();
            this.bs.hidden();
        }
    };
    //转盘
    var dial = {
        box: $E("dial-box"),
        btn: getElementsByAttr($E("dial-box"), "node-data", "lottery-btn")[0],
        items: getElementsByAttr($E("dial-box"), "node-type", "item"),
        lockItems: getElementsByAttr(document, "node-data", "lock-items")[0],
        disable: false,
        isHint: 1,
        hintLayer: null,
        lock: null,
        init: function (){
            Lib.checkAuthor();
            hintLayer.init();
            
            this.hintLayer = hintLayer;
            this.showLockItems();
            this.initEvent();
        },
        initEvent: function (){
            var self = this;
            var hintLayer = self.hintLayer;
            //点击抽奖按钮事件绑定
            addEvent(self.btn, function (){
                var e = getEvent()
                stopDefaultEvent(e);
                self.start();
            });
            //提示浮层事件绑定
            addEvent(hintLayer.box, function (){
                var e = getEvent()
                var tarEl = getEventTarget(e);
                var tdata = tarEl.getAttribute("node-data");
                var ckb = getElementsByAttr(hintLayer.box, "node-data", "hint-ckb")[0];
                (ckb && ckb.checked) ? self.isHint = 0 : '';
                switch(tdata){
                    case "btnclose":
                        stopDefaultEvent(e);
                        hintLayer.hide();
                        break;
                    case "btnleft":
                        stopDefaultEvent(e);
                        hintLayer.hide();
                        self.start(1);
                        break;
                    case "btnright":
                        stopDefaultEvent(e);
                        self.hintLayer.hide();
                        if(tarEl.innerHTML.indexOf("分享") != -1){
                            Utils.shareToWeibo({
                                content: "我在博客积分大抽奖活动中抽到"+ CONF.awards[self.lock].t +"大奖，分享一下好手气，你也来试试吧~！",
                                img: CONF.imgUrl
                            });
                        }
                        break;
                    default:
                        break;
                }
            });
        },
        start: function (type){
            var self = this;
            self.check(function (t){
                if(t){
                    type ? self.startLottery() : self.showHint();
                }
            });
        },
        check: function (cb){
            var self = this;
            //检测是否登录
            if(!$isLogin){
                var Login = new Lib.Login.Ui();
                Login.login(function(){
                    cb(!self.disable);
                },false,"referer:"+location.href);
            }else{
                cb(!self.disable);
            }
        },
        //展示最新6条中奖信息
        showLockItems: function (){
            var self = this;
            var tpl = '<li><p class="p2">{uname}</p><p class="p3">抽中{text}</p></li>';
            CONF.itf.request({
                GET: {},
                onSuccess: function(data){
                    var htmlStr = '';
                    if(data && data.length > 0){
                        for(var i = 0; i < data.length && i < 6; i++){
                            var item = data[i];
                            var award = CONF.awards["L" + item.type + item['number']];
                            var text = award ? award.t : '';
                            text ? htmlStr += tplRep(tpl, {
                                uname: item.username,
                                text: text
                            }) : '';
                        }
                        self.lockItems.innerHTML = htmlStr;
                    }
                },
                onError: function(result){},
                onFail: function(){}
            });
        },
        startLottery: function (){
            var self = this;
            var speed = 200;
            var status = 0;
            var timer = null;
            var goodLock = function (){
                var curr = self.changeItem();
                switch(status){
                    case 0:
                        speed -= 50;
                        speed == 50 ? status = 1 : ''; 
                        break;
                    case 2:
                        if(speed < 500){
                            speed += 50;
                        }else{
                            speed += 5;
                            //到达中奖区，停止转动，并启用按钮
                            if(curr == CONF.awards[self.lock].i){
                                setTimeout(function (){
                                    self.showResult();
                                    rmClass(self.btn, "cj_active");
                                    self.disable = false;
                                }, 500);
                                return;
                            }
                        }
                        break;
                    default:
                        self.lock ? status = 2 : '';
                        break;
                }
                timer = setTimeout(goodLock, speed);
            };
            //开始抽奖，禁用按钮
            v7sendLog("20_01_01");//抽奖布码
            self.lock = null;
            self.disable = true;
            addClass(self.btn, "cj_active");
            //向后端请求抽奖 
            reqLottery(function (n){
                if(/^L/.test(n)){
                    goodLock();
                    setTimeout(function (){
                        self.lock = n;
                    }, 2000);
                }else{
                    self.showError(n);
                    rmClass(self.btn, "cj_active");
                    self.disable = false;
                }
            });
        },
        changeItem: function (){
            var curr = parseInt(this.box.getAttribute("node-active")) || 0;
            var items = this.items;
            var index = (curr + 1) % items.length;
            for(var i = 0; i < items.length; i++){
                rmClass(items[i], "fan" + (i+1));
            }
            addClass(items[index], "fan" + (index + 1));
            this.box.setAttribute("node-active", index);
            return index;
        },
        showError: function (msg){
            msg = msg == "积分不足" ? "您的积分不足" : (msg || "抽奖失败");
            this.hintLayer.show({
                type: "error",
                title: '抽奖提示: <span class="col1">抱歉，'+ msg +'! </span>',
                subtext: ' ',
                btnbox: '<a class="a" node-data="btnright" href="javascript:void(0)">确认</a>',
                hint: '<a href="http://control.blog.sina.com.cn/blog_rebuild/profile/controllers/points_list.php" target="_blank">查看积分</a>'
            })
        },
        showHint: function (){
            var self = this;
            //抽奖提示
            self.isHint ? self.hintLayer.show({
                type: "hint",
                title: '抽奖提示:每次抽奖将消耗<span class="col1">10积分</span>',
                subtext: ' ',
                btnbox: '<a node-data="btnleft" href="javascript:void(0)">继续抽奖</a><a class="a2" node-data="btnright" href="javascript:void(0)">取消抽奖</a>',
                hint: '<span>不再提示</span><input node-data="hint-ckb" type="checkbox"></div>'
            }) : self.start(1);
        },
        showResult: function (){
            var self = this;
            var lock = self.lock;
            if(lock == "L0"){
                //未中奖提示
                hintLayer.show({
                    type: lock,
                    title: '<span class="col1">很遗憾，没能中奖</span>',
                    subtext: '没给爸妈包红包吧？！这次没中奖',
                    btnbox: '<a node-data="btnleft" href="javascript:void(0)">继续抽奖</a><a class="a2" node-data="btnright" href="javascript:void(0)">取消抽奖</a>',
                    hint: '<a href="http://control.blog.sina.com.cn/blog_rebuild/profile/controllers/points_list.php" target="_blank">查看积分</a>'
                });
            }else{
                //中奖提示
                hintLayer.show({
                    type: lock,
                    title: '<span class="col1">恭喜您，抽中了'+ CONF.awards[lock].t +'</span>',
                    subtext: '1888，快到碗里来吧~~~',
                    btnbox: '<a node-data="btnleft" href="javascript:void(0)">继续抽奖</a><a node-data="btnright" href="javascript:void(0)">分享喜悦</a>',
                    hint: '<a href="http://control.blog.sina.com.cn/blog_rebuild/profile/controllers/points_list.php" target="_blank">查看积分</a>'
                });
            }
        }
    };
    
    //分享按钮绑定事件
    var shareBtn = getElementsByAttr(document, "node-data", "share-to-weibo")[0];
    addEvent(shareBtn, function (){
        var e = getEvent()
        stopDefaultEvent(e);
        Utils.shareToWeibo({
            content: "我参加了博客积分大抽奖活动，分享给大家，你也来试试吧~！",
            img: CONF.imgUrl
        });
    });
    dial.init();
});