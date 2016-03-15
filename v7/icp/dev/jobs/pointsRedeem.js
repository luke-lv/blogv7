/**
*@description 积分服务兑换
*@author jiangwei5
*/
// $import("sina/core/dom/insertHTML.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopDefaultEvent.js");
$import("sina/core/events/getEventTarget.js");
$import("sina/core/events/getEvent.js");
$import("lib/dialogConfig.js");
$import("lib/interface.js");
// $import("sina/core/date/getTimeObj.js");
// $import("sina/core/date/getTimestamp.js");
$import("lib/uic.js");
$import('sina/core/system/getParam.js');
// $import('sina/utils/form/inputListen.js');
$import('sina/core/dom/addClass.js');
$import('sina/core/dom/removeClass.js');
$import("sina/core/dom/getElementsByAttr.js");
$import("sina/utils/form/radio.js");
$import('sina/core/string/trim.js');

$registJob("pointsRedeem", function(){
    // var insertHTML = Core.Dom.insertHTML;
    var addEvent = Core.Events.addEvent;
    var stopDefaultEvent = Core.Events.stopDefaultEvent;
    var getEvent = Core.Events.getEvent;
    var getEventTarget = Core.Events.getEventTarget;
    var getElementsByAttr = Core.Dom.getElementsByAttr;
    var Radio = Utils.Form.Radio;
    var trim = Core.String.trim;
    
    var urlPr = "http://blog.sina.com.cn/u/";
    var defaultFaceUrl = "http://simg.sinajs.cn/blog7style/images/center/newversion/face_2bg.gif";
    var gotoUrl = "http://control.blog.sina.com.cn/blog_rebuild/profile/controllers/points_list.php";
    var itf = {
        redeem: new Interface("http://control.blog.sina.com.cn/blog_rebuild/riaapi/points/points_redeem.php","ajax"),
        getUid: new Interface("http://control.blog.sina.com.cn/blog_rebuild/riaapi/points/uhosttouid.php","ajax"),
        autoRenew: new Interface("http://control.blog.sina.com.cn/blog_rebuild/riaapi/points/auto_renew.php","ajax")
    };
    var MSG = {
        "M00": "兑换成功~！",
        "M01": "兑换失败~！",
        "M02": "没有找到该用户信息",
        "M03": "请输入需要开通服务的博客地址",
        "M04": "未输入对象博客地址或输入不合法!",
        "M05": "未勾选'已确认并同意'选项!",
        "M06": "请输入1~9999整数",
        "M07": "积分不足",
        "M99": "未知错误"
    };
    var rType = Core.System.getParam("type") || 3;
    var submitBtn = $E("redeem_submit");
    var isLock = 0;
    var lock = function (status){
            isLock = status;
            isLock ? Core.Dom.addClass(submitBtn, "int_btn_gray") : Core.Dom.removeClass(submitBtn, "int_btn_gray");
        };
    //兑换服务 私密博文、图片博主、荣誉徽章
    var redeem = {
        uid: scope.$uid || $UID,//当前用户uid
        rduid: null,//兑换对象的用户uid
        type: rType,//兑换服务类型
        sStatus: 0,//服务状态 0-未开通; 1-开通不带自动续费; 2-开通带自动续费
        blogUrlInput: $E("redeem_blog_url"),
        checkbox: $E("redeem_checkbox"),
        forOtherEl: $E("for_other"),
        validityEl: $E("serve_validity"),
        redeemBlogInfoEl: $E("redeem_blog_info"),
        autoRenew: $E("auto_renew"),
        init: function (){
            this.initDom();
            this.initEvent();
        },
        initDom: function (){
            var self= this;
            self.sStatus = parseInt(trim(self.autoRenew.innerHTML)/1) || 0;
            self.changeRenewEl();
            self.checkbox.checked = true;
            self.blogUrlInput.value = urlPr + self.uid;
            self.showBloggerInfo();
        },
        changeRenewEl: function (){
            this.autoRenew.innerHTML = this.sStatus == 2 ? '<span class="info_s1">已开通</span><a href="javascript:void();">取消</a>' : '<span class="info_s1">未开通</span><a href="javascript:void();">开通</a>';
        },
        initEvent: function (){
            var self= this;
            //为其他人兑换 点击事件
            self.forOtherEl.href = "javascript:void();";
            addEvent(self.forOtherEl, function (){
                stopDefaultEvent();
                self.blogUrlInput.value = "";
                self.showBloggerInfo();
            });
            addEvent(self.autoRenew, function (){
                stopDefaultEvent();
                var tarEl = getEventTarget();
                if(tarEl.tagName.toLocaleLowerCase() == "a"){
                    self.showConfirm();
                }
            });
            //input事件
            addEvent(self.blogUrlInput, function (){
                self.showBloggerInfo();
            }, "blur");
            self.blogUrlInput.setAttribute("maxLength", 100);
            //提交按钮事件
            submitBtn.href = "javascript:void();";
            addEvent(submitBtn, self.submit);
        },
        showConfirm: function (){
            var self = this;
            var req = function (s){
                itf.autoRenew.request({
                    POST: {
                        type: self.type,
                        status: s == 2 ? 3 : 1
                    },
                    onSuccess: function(data){
                        winDialog.alert("操作成功");
                        self.sStatus = s;
                        self.changeRenewEl();
                    },
                    onError: function(result){
                        winDialog.alert(result && result.data && "操作失败");
                    },
                    onFail: function(){
                        winDialog.alert("操作失败");
                    }
                });
            };
            if(self.sStatus == 2){
                winDialog.confirm(
                    "服务到期后，将不再进行自动续费，是否确认此操作？",
                    {
                        funcOk: function (){
                            req(1);
                        }
                    },
                    "autoRenewConfirm");
            }else{
                winDialog.confirm(
                    "服务到期后，系统将为您自动续费该服务，是否确认此操作？",
                    {
                        funcOk: function (){
                            req(2);
                        }
                    },
                    "autoRenewConfirm");
            }
        },
        updateWhoInfo: function (name, url){
            var self = this;
            name = name || MSG['M02'];
            url = url || defaultFaceUrl;
            self.redeemBlogInfoEl.innerHTML = '<img src="' 
               + url 
               + '"/><span>' 
               + name
               + '</span>';
            
            if(!self.rduid || self.rduid == self.uid){
                if(!self.sStatus){
                    self.checkbox.parentNode.style.display = "block";
                    self.autoRenew.parentNode.style.display = "none";
                }else{
                    self.checkbox.parentNode.style.display = "none";
                    self.autoRenew.parentNode.style.display = "block";
                }
            }else{
                self.checkbox.parentNode.style.display = "none";
                self.autoRenew.parentNode.style.display = "none";
            }
        },
        showBloggerInfo: function(){
            var self = this;
            var url = self.blogUrlInput.value;
            url = url.replace(/(^\s+)|([\?\#\s]{1}.*$)/g,"");
            if(url){
                //若url开头没有http://，则自动补上
                if(!/^http\:\/\//.test(url)){
                    url = "http://" + url;
                    self.blogUrlInput.value = url;
                }
                self.getUid(url, function (uid){
                    if(!uid) self.updateWhoInfo();
                    var n = parseInt(uid) % 8 + 1;
                    var faceUrl = "http://portrait"+n+".sinaimg.cn/"+uid+"/blog/50";
                    self.rduid = uid || null;
                    
                    Lib.Uic.getNickName([uid], function(oResult){
                        for (var key in oResult) {
                            self.updateWhoInfo(oResult[key], faceUrl);
                            return;
                        }
                    });
                });
            }else{
                self.updateWhoInfo(MSG['M03']);
                self.rduid = null;
            }
        },
        getUid: function (url, cb){
            var uid;
            if(/^http:\/\/(photo\.)?blog\.sina\.com\.cn/.test(url)){
                var mat = url.match(/(\/\d{4,}$)|(_\d{4,}[_\.]{1})|(blog_[0-9a-z]{10,})/);
                if(mat){
                    if(mat[3]){
                        uid = parseInt(mat[3].replace(/^blog_|[0-9a-z]{8}$/g,''),16);
                    }else{
                        uid = mat[0].replace(/^\D|\D$/g,'');
                    }
                    cb(uid);
                }else if(/^http\:\/\/blog\.sina\.com\.cn\/(\w+)$/.test(url)){
                    itf.getUid.request({
                        POST: {
                            uhost: RegExp.$1
                        },
                        onSuccess: function(data){
                            cb(data);
                        },
                        onError: function(result){
                            cb();
                        },
                        onFail: function(){
                            cb();
                        }
                    });  
                }
            }else{
                cb();
            }
        },
        check: function (){
            var self = this;
            if(isLock) return false;
            if(!self.rduid){
                winDialog.alert(MSG['M04']);
                return false;
            }
            // if(!self.checkbox.checked){
                // winDialog.alert(MSG['M05']);
                // return false;
            // }
            return true;
        },
        submit: function (){
            var self = redeem;
            stopDefaultEvent();
            if(self.check()){
                lock(1);
                itf.redeem.request({
                    POST: {
                        user: self.rduid,
                        type: self.type,
                        auto: (self.sStatus ? self.sStatus - 1 : (self.rduid == self.uid && self.checkbox.checked)/1)
                    },
                    onSuccess: function(data){
                        winDialog.alert(MSG["M00"], {
                            funcOk:function (){
                                location.href = gotoUrl;
                            },
                            funcClose:function (){
                                location.href = gotoUrl;
                            }
                        });
                        // lock(0);
                    },
                    onError: function(result){
                        if(result && result.code == "A00003"){
                            winDialog.alert(result.data, {subText:'<a href="http://blog.sina.com.cn/huodong/lottery.html">马上获得1888积分! </a>'});
                        }else{
                            winDialog.alert(result && result.data);
                        }
                        lock(0);
                    },
                    onFail: function(){
                        winDialog.alert(MSG["M01"]);
                        lock(0);
                    }
                }); 
            }
        }
    };
    //金笔兑换
    function goldPanRedeem(){
        var box = $E("redeem_box");
        var radios = getElementsByAttr(box, "name", "num");
        var input = getElementsByAttr(box, "node-data", "other-num")[0];
        var needPoints = getElementsByAttr(box, "node-data", "need-points")[0];
        var pointsNum = getElementsByAttr(box, "node-data", "points-num")[0];
        var price = 1;//单价
        var cNum = 1;//默认数量
        var changeNeed = function (n){
            n = Math.abs(parseInt(n) || 0);
            if(n != cNum){
                needPoints.innerHTML = n * price;
                cNum = n;
            }
        };
        var getNum = function (el){
            return el ? Math.abs(parseInt(trim(el.value))||0) : Math.abs(parseInt(Radio.get(radios)/1 || input.value/1 || 0));
        };
        pointsNum = pointsNum.innerHTML/1 || 0;
        Radio.set(radios, 1);
        needPoints.innerHTML = cNum * price;
        input.value = MSG["M06"];
        input.setAttribute("maxLength", 4);
        //事件绑定
        addEvent(input, function (){
            var val = trim(input.value);
            radios[radios.length-1].checked = true;
            if(val == MSG["M06"]){
                input.value = '';
            }
        }, 'focus');
        addEvent(input, function (){
            var val = getNum(input);
            input.value = val || MSG["M06"];
            changeNeed(val);
        }, 'blur');
        addEvent(box, function (){
            var ev = getEvent();
            var tarEl = getEventTarget(ev);
            if("redeem_submit" == tarEl.id || "redeem_submit" == tarEl.parentNode.id){
                stopDefaultEvent(ev);
                if(isLock) return;
                lock(1);
                var num = getNum();
                if(!num){
                    winDialog.alert(MSG["M06"]);
                    lock(0);
                    return;
                }
                if(pointsNum < num*price){
                    // winDialog.alert(MSG["M07"]);
                    winDialog.alert(MSG["M07"], {subText:'<a href="http://blog.sina.com.cn/huodong/lottery.html?f=1">马上获得1888积分! </a>'});
                    lock(0);
                    return;
                }
                //提交
                itf.redeem.request({
                    POST: {
                        type: rType,
                        num: num,
                        user: '',
                        auto: 0
                    },
                    onSuccess: function(data){
                        winDialog.alert(MSG["M00"], {
                            funcOk:function (){
                                location.href = gotoUrl;
                            },
                            funcClose:function (){
                                location.href = gotoUrl;
                            }
                        });
                        // lock(0);
                    },
                    onError: function(result){
                        if(result && result.code == "A00003"){
                            winDialog.alert(result.data || MSG["M07"], {subText:'<a href="http://blog.sina.com.cn/huodong/lottery.html?f=1">马上获得1888积分! </a>'});
                        }else{
                            winDialog.alert(result && result.data || MSG["M99"]);
                        }
                        lock(0);
                    },
                    onFail: function(){
                        winDialog.alert(MSG["M01"]);
                        lock(0);
                    }
                }); 
            }else{
                var num = getNum();
                changeNeed(num);
            }
        });
    }
    if(rType == 10){
        //金笔兑换
        goldPanRedeem();
    }else{
        redeem.init();
    }
});