/**
 * @fileoverview 博客积分金笔打赏
 * @author jiangwei5@staff.sina.com.cn
 * @date 
 */
// $import("sina/core/dom/insertHTML.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/getEventTarget.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/events/stopDefaultEvent.js");
$import("sina/core/system/winSize.js");
// $import("sina/core/dom/getChildrenByClass.js");
$import("sina/core/dom/getElementsByAttr.js");
$import('sina/core/string/trim.js');
$import("sina/utils/form/radio.js");
$import("sina/utils/io/jsload.js");
// $import("lib/uic.js");
$import("lib/checkAuthor.js");
$import("lib/login/ui.js");
$import("lib/panel.js");
$import("sina/ui/dialog/backShadow.js");
$import("lib/sendLog.js");
$import("lib/interface.js");
$import("lib/listener.js");
$import("sina/utils/tpl.js");

$registJob("goldPan", function (){
    // var insertHTML = Core.Dom.insertHTML;
    var addEvent = Core.Events.addEvent;
    // var getChildrenByClass = Core.Dom.getChildrenByClass;
    var getElementsByAttr = Core.Dom.getElementsByAttr;
    var stopDefaultEvent = Core.Events.stopDefaultEvent;
    var getEvent = Core.Events.getEvent;
    var getEventTarget = Core.Events.getEventTarget;
    var trim = Core.String.trim;
    var Radio = Utils.Form.Radio;
    //当前页面信息
    var pageInfo = {
        articleid: scope.$articleid,//博文id
        uid: scope.$uid,//博主uid
        _uid: (typeof $UID !== 'undefined' ? $UID : null),//登录用户uid
        goldPanNum: 0, //博文已获赠金笔数
        _goldPanNum: 0 //登录用户当前拥有金笔数
    };
    var itf = {
        //获取用户拥有的金笔数接口
        getGoldPanNum: new Interface('http://control.blog.sina.com.cn/blog_rebuild/riaapi/goldpen/user_goldpen_num.php', 'ijax'),
        //给文章赠送金笔接口
        giveGoldpan: new Interface('http://control.blog.sina.com.cn/blog_rebuild/riaapi/goldpen/donate.php', 'ijax'),
        //兑换金笔接口
        redeem: new Interface("http://control.blog.sina.com.cn/blog_rebuild/riaapi/points/points_redeem.php","ijax"),
        //土豪榜和提名榜浮层接口
        zindexGold: new Interface("http://control.blog.sina.com.cn/blog_rebuild/riaapi/goldpen/goldpen_rank.php","ijax")
    };
    var MSG = {
        "M00": "赠送成功~！",
        "M10": "请输入1~100整数",
        "M11": "请选择或者输入您要赠送的金笔数",
        "M12": "请求失败",
        "M13": "赠送失败",
        "M14": "不能给自己的文章赠送金笔"
    };
    //浮层操作对象
    var lock = 0;
    //博文正文下方赠金笔浮层面板
    var popup = {
        //浮层模板
        tpl: '<table class="CP_w" id="#{panel}" style="z-index: 5000">'+
          '<thead>'+
            '<tr>'+
              '<th class="tLeft"><span></span></th>'+
              '<th class="tMid"><div class="bLyTop"><strong>赠金笔</strong><cite><a node-data="btn-close" href="#" class="CP_w_shut" title="关闭">关闭</a></cite></div></th>'+
              '<th class="tRight"><span></span></th>'+
            '</tr>'+
          '</thead>'+
          '<tfoot>'+
            '<tr>'+
              '<td class="tLeft"><span></span></td>'+
              '<td class="tMid"><span></span></td>'+
              '<td class="tRight"><span></span></td>'+
            '</tr>'+
          '</tfoot>'+
          '<tbody>'+
            '<tr>'+
              '<td class="tLeft"><span></span></td>'+
              '<td class="tMid"><div class="CP_layercon3 jiben">'+
              '<div class="SG_tag tag_h">'+
                                '<ul>'+
                                  '<li class="current"><span><strong><a node-data="gold-exchange" href="javascript:void(0)">金笔兑换</a></strong></span><span class="tagR"></span></li>'+
                                  '<li><span><strong><a node-data="tyrant-standings" href="javascript:void(0)">今日土豪榜</a></strong></span><span class="tagR"></span></li>'+                          
                                  '<li><span><strong><a node-data="nomination-list" href="javascript:void(0)">今日提名榜</a></strong></span><span class="tagR"></span></li>'+
                                '</ul>'+
                              '</div>'+
              '<div name="jiben_tab" class="jiben_tab">'+
                  '<ul class="denPicRow denPicRow01 clearfix" name="radioAll">'+
                    '<li><span class="a">兑换服务：</span><span class="b">金笔道具</span></li>'+
                    '<li><span class="a"><span class="CP_w_star"></span>赠送数量：</span><span class="b rlist">' +
                          '<input name="num" value="1" type="radio" id="jb1">' +
                          '<label for="jb1">1支</label>' +
                          '<input name="num" value="10" type="radio" id="jb2">' +
                          '<label for="jb2">10支</label>' +
                          '<input name="num" value="20" type="radio" id="jb3">' +
                          '<label for="jb3">20支</label>' +
                          '<input name="num" value="50" type="radio" id="jb4">' +
                          '<label for="jb4">50支</label>' +
                          '<input name="num" value="100" type="radio" id="jb5">' +
                          '<label for="jb5">100支</label>' +
                          '<br>' +
                          '<input name="num" value="0" type="radio" id="jb5">' +
                          '<label for="jb6">其他</label>' +
                          '<input type="text" maxLength="4" class="SG_input" id="jb6" node-data="other-num" value="请输入整数">' +
                          '</span>' +
                        '</li>' +
                        '<li><span class="a cold">现有金笔：</span><span class="b cold" node-data="own-num">12支</span></li>' +
                        '<li><span class="a cold">还需兑换：</span><span class="b cold" node-data="need-num">2支 x 50=100(积分)</span></li>' +
                  '</ul>'+
                  '<div id="hidden"></div>' +
                  '<div class="butt01" id="button01"><a node-data="btn-ok" href="#" class="SG_aBtn SG_aBtnB "><cite>确认</cite></a><a target="_blank" href="http://blog.sina.com.cn/s/blog_4b0f52990102v0dd.html" class="jf_rule">点击了解更多规则</a></div>'+
                 '</div>'+
                  '<div class="clearit"></div>'+
                '</div></td>'+
              '<td class="tRight"><span></span></td>'+
            '</tr>'+
          '</tbody>'+
        '</table>',        
          thTpl: '<tr>'+
                                    '<th width="50px" align="center"><a href="{1}"><img src="{0}"></a></th>'+
                                    '<th width="240px" align="left"><a href="{1}">{2}</a></th>'+
                                    '<th width="105px" align="left">{3}<!--今日提名榜此处是“收到金笔”--></th>'+
                                    '<th width="110px" align="left"><strong><span>{4}</span>支</strong></th>'+
                                    '<th align="left"><img src="http://simg.sinajs.cn/blog7style/images/common/badge/badge14.png" class="badge" style="background-image:url(../../images/common/badge/badge14.png);_background-image: url(../../images/common/badge/badge14.gif);"></th>'+
                                  '</tr>',
          testTpl: '<tr>'+
                                    '<td align="center"><a href="{1}"><img src="{0}"></a></td>'+
                                    '<td><a href="{1}">{2}</a></td>'+
                                    '<td>{3}</td>'+
                                    '<td><strong><span>{4}</span>支</strong></td>'+
                                    '<td><img src="http://simg.sinajs.cn/blog7style/images/common/badge/badge14.png" class="badge" style="background-image:url(../../images/common/badge/badge14.png);_background-image: url(../../images/common/badge/badge14.gif);"></td>'+
                                  '</tr>',        
        w: 669,
        h: 412,
        bs: null, //遮罩
        panel: null,
        box: null,
        radios: null,
        input: null,
        ownNumEl: null,
        needNumEl:null,
        cNum:1,
        price:1,//单价调整为1积分 20150104 jiangwei5
        updateTag: null,
        goldExchange: null,
        tyrantStandings: null,
        nominationList: null,
        init: function (){//在这里新增一个初始化切换的方法就ok了
            var self = this;
            var bs = popup.bs = new BackShadow(0.4);
            var panel = popup.panel = new Lib.Panel();
            panel.setTemplate(self.tpl);
            
            var box = self.box = panel.getNode("panel");
            self.radios = getElementsByAttr(box, "name", "num");
            self.input = getElementsByAttr(box, "node-data", "other-num")[0];
            self.ownNumEl = getElementsByAttr(self.box, "node-data", "own-num")[0];
            self.needNumEl = getElementsByAttr(self.box, "node-data", "need-num")[0];

            //加的代码，起始
            self.goldExchange = getElementsByAttr(self.box,"node-data","gold-exchange")[0];
            self.tyrantStandings = getElementsByAttr(self.box,"node-data","tyrant-standings")[0];
            self.nominationList = getElementsByAttr(self.box,"node-data","nomination-list")[0];
             //加的代码，结束
            
            self.initBox();
            self.initEvent();
            self.setPosition();
        },
        initBox: function (){
            var self = this;
            var radios = self.radios;
            var len = radios.length;
            var num = self.cNum;
            
            Radio.set(radios, num);
            if(!parseInt(Radio.get(radios))){
                radios[len - 1].checked = true;
                self.input.value = num;
            }
            self.input.value = MSG["M10"];
            self.ownNumEl.innerHTML = pageInfo._goldPanNum + '支';
            self.changeNeed(num);
        },
        initEvent: function (){
            var self = this;
            addEvent(self.input, function (){
                var val = self.getNum(self.input);
                self.radios[self.radios.length-1].checked = true;
                self.input.value = val || '';
            }, 'focus');
            addEvent(self.input, function (){
                var val = self.getNum(self.input);
                self.input.value = val || MSG["M10"];
                self.changeNeed(val);
            }, 'blur');
            addEvent(self.box, function (){
                var ev = getEvent();
                var tarEl = getEventTarget(ev);
                var ntype = tarEl.getAttribute("node-data") || tarEl.parentNode.getAttribute("node-data");
                if(ntype == "btn-close"){
                    stopDefaultEvent();
                    self.hide();
                }else if(ntype == "btn-ok"){
                    stopDefaultEvent();
                    if(!lock){
                        lock = 1;
                        self.submit();
                    }
                }else{
                    var val = self.getNum();
                    val != self.cNum ? self.changeNeed(val) : '';
                }
            });

            //加的代码，起始
            addEvent(self.goldExchange,function(){
                var jibenTab = getElementsByAttr(self.box,'name','jiben_tab')[0];
                var hidden = $E('hidden');
                var button01 = $E('button01');
                var radioAll = getElementsByAttr((document.getElementsByTagName('body'))[0],'name','radioAll')[0];
                radioAll.style.display = "block";
                hidden.style.display = 'none';
                button01.style.display = 'block';
                self.goldExchange.parentNode.parentNode.parentNode.className = "current";
                self.tyrantStandings.parentNode.parentNode.parentNode.className = "";
                self.nominationList.parentNode.parentNode.parentNode.className = "";
                //jibenTab.innerHTML = self.tplChage; 
            });
            addEvent(self.tyrantStandings,function(){
                var jibenTab = getElementsByAttr(self.box,'name','jiben_tab')[0];
                var radioAll = getElementsByAttr((document.getElementsByTagName('body'))[0],'name','radioAll')[0];
                var hidden = $E('hidden');
                var button01 = $E('button01');
                button01.style.display = 'none';
                radioAll.style.display = "none";
                hidden.style.display = 'block';
                self.goldExchange.parentNode.parentNode.parentNode.className = "";
                self.tyrantStandings.parentNode.parentNode.parentNode.className = "current";
                self.nominationList.parentNode.parentNode.parentNode.className = "";
                //jibenTab.innerHTML = self.tplTyrant;
                itf.zindexGold.request({
                    GET: {
                        type: 'donate'
                    },
                    onSuccess: function(data){
                      if(data.length){
                        var html = '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="top_tab">';
                        for(var i=0;i<data.length;i++){
                            if(i ==0){
                               html = html + Utils.tpl(self.thTpl,[data[i]['photo'],'http://blog.sina.com.cn/u/' + data[i]['uid'],data[i]['nickname'],'送出金笔',data[i]['number']]);
                            }
                            else
                            {
                              html = html + Utils.tpl(self.testTpl,[data[i]['photo'],'http://blog.sina.com.cn/u/' + data[i]['uid'],data[i]['nickname'],'送出金笔',data[i]['number']]);
                            }
                        }
                        html = html + '</table><div class="butt01"> <a href="http://control.blog.sina.com.cn/blog_rebuild/profile/controllers/goldpen_rank.php?action=1" class="SG_aBtn SG_aBtnB "><cite>查看更多</cite></a></div>';
                        hidden.innerHTML = html;
                      }
                      else
                      {
                        hidden.innerHTML = "";
                      }
                    },
                    onError: function(result){
                       if(result.code == 'A00005'){
                          alert('非法操作');                                               
                        }
                        else if(result.code == 'A11007'){
                          alert('非博客用户，只是新浪用户');
                        }
                        else if(result.code == '00015'){
                          alert('参数错误');
                        }
                    },
                    onFail: function(){console.log(arguments[0]);
                    }
                });                
            });
            addEvent(self.nominationList,function(){
                var jibenTab = getElementsByAttr(self.box,'name','jiben_tab')[0];
                var radioAll = getElementsByAttr((document.getElementsByTagName('body'))[0],'name','radioAll')[0];
                var hidden = $E('hidden');
                var button01 = $E('button01');
                button01.style.display = 'none';
                radioAll.style.display = "none";
                hidden.style.display = 'block';
                self.goldExchange.parentNode.parentNode.parentNode.className = "";
                self.tyrantStandings.parentNode.parentNode.parentNode.className = "";
                self.nominationList.parentNode.parentNode.parentNode.className = "current";
                //jibenTab.innerHTML = self.tplTyrant;

                itf.zindexGold.request({
                    GET: {
                        type: 'receive'
                    },
                    onSuccess: function(data){                                         
                      if(data.length){
                        var html = '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="top_tab">';
                        for(var i=0;i<data.length;i++){
                            if(i ==0){
                               html = html + Utils.tpl(self.thTpl,[data[i]['photo'],'http://blog.sina.com.cn/u/' + data[i]['uid'],data[i]['nickname'],'收到金笔',data[i]['number']]);
                            }
                            else
                            {
                              html = html + Utils.tpl(self.testTpl,[data[i]['photo'],'http://blog.sina.com.cn/u/' + data[i]['uid'],data[i]['nickname'],'收到金笔',data[i]['number']]);
                            }
                        }
                        html = html + '</table><div class="butt01"> <a href="http://control.blog.sina.com.cn/blog_rebuild/profile/controllers/goldpen_rank.php?action=2" class="SG_aBtn SG_aBtnB "><cite>查看更多</cite></a></div>';
                        hidden.innerHTML = html;
                      }
                      else{
                        hidden.innerHTML = "";
                      }
                    },
                    onError: function(result){
                       if(result.code == 'A00005'){
                          alert('非法操作');                                               
                        }
                        else if(result.code == 'A11007'){
                          alert('非博客用户，只是新浪用户');
                        }
                        else if(result.code == '00015'){
                          alert('参数错误');
                        }
                    },
                    onFail: function(){
                    }
                });
            });
            //加的代码，结束
        },
        changeNeed: function (n){
            var self = this;
            var need = 0;
            if(n > pageInfo._goldPanNum){
                need = n - pageInfo._goldPanNum;
            }
            self.cNum = n;
            self.needNumEl.innerHTML = need + '支 x '+ self.price +'='+ need*self.price +'(积分)';
        },
        updateOwnNum: function (type){
            var self = this;
            var time = new Date().valueOf();
            if(type != 1 && (!pageInfo._uid || (time - self.updateTag) < 60*1000)) return;
            self.updateTag = time;
            itf.getGoldPanNum.request({
                GET: {
                    uid: pageInfo._uid
                },
                onSuccess: function(data){
                    pageInfo._goldPanNum = parseInt(data && data.total) || 0;
                    self.initBox();
                    self.updateTag = new Date().valueOf();
                },
                onError: function(result){
                },
                onFail: function(){
                }
            });
        },
        getNum: function (input){
            var num = input ? Math.abs(parseInt(trim(input.value))||0) : Math.abs(parseInt(Radio.get(this.radios)/1 || this.input.value/1 || 0));
            return num > 100 ? 100 : num;
        },
        submit: function (){
            var self = this;
            var num = self.getNum();
            //不能给自己的文章赠送金笔
            if(pageInfo.uid == pageInfo._uid){
                winDialog.alert(MSG["M14"]);
                lock = 0;
                return;
            }
            if(!num){
                winDialog.alert(MSG["M11"]);
                lock = 0;
                return;
            }else if(num > pageInfo._goldPanNum){
                var newnum = num - pageInfo._goldPanNum;
                redeemGoldpan(newnum, function (s, t){
                    if(s){
                        giveGoldpan({
                            blogid: pageInfo.articleid,
                            num: num,
                            newnum: newnum
                        }, function (s, t){
                            if(s){
                                winDialog.alert(MSG["M00"]);
                                updateActGPN();
                                self.updateOwnNum(1);
                                self.hide();
                                lock = 0;
                            }else{
                                winDialog.alert(t);
                                lock = 0;
                            }
                        });
                        //兑换成功，更新已有金笔数
                        pageInfo._goldPanNum = num;
                        self.ownNumEl.innerHTML = num + '支';
                        self.changeNeed(num);
                    }else{
                       winDialog.alert(t); 
                       lock = 0;
                    }
                });
            }else{
                giveGoldpan({
                    blogid: pageInfo.articleid,
                    num: num
                }, function (s, t){
                    if(s){
                        winDialog.alert(MSG["M00"]);
                        updateActGPN();
                        self.updateOwnNum(1);
                        self.hide();
                        lock = 0;
                    }else{
                        winDialog.alert(t);
                        lock = 0;
                    }
                });
            }
        },
        show: function (){
            this.updateOwnNum();
            this.bs.show();
            this.panel.show();
        },
        hide: function (){
            this.panel.hide();
            this.bs.hidden();
        },
        setPosition: function (){
            var self = this;
            var win = Core.System.winSize();
            var x = win.width / 2 - self.w / 2;
            var y = win.height / 2 - self.h / 2 - 20;
            self.panel.setPosition(x, y);
            self.panel.setFixed(true);
        }
    };
    //喜欢成功后，弹出赠一支金笔的浮层面板 20150104 jiangwei5
    var popupLiked = {
        tpl: [
            '<table class="CP_w" id="#{panel}" style="z-index: 5000">',
                '<thead>',
                    '<tr>',
                        '<th class="tLeft"><span></span></th>',
                        '<th class="tMid"><div class="bLyTop"><strong>提示</strong><cite><a href="#" class="CP_w_shut" data-node="btn-close" title="关闭">关闭</a></cite></div></th>',
                        '<th class="tRight"><span></span></th>',
                    '</tr>',
                '</thead>',
                '<tfoot>',
                    '<tr>',
                        '<td class="tLeft"><span></span></td>',
                        '<td class="tMid"><span></span></td>',
                        '<td class="tRight"><span></span></td>',
                    '</tr>',
                '</tfoot>',
                '<tbody>',
                    '<tr>',
                        '<td class="tLeft"><span></span></td>',
                        '<td class="tMid">',
                        '<div class="CP_layercon9 jinbi_f">',    
                            '<p><strong>写的不错，送支金笔奖励一下吧！只需要1积分哦！！！！！</strong></p>',
                            '<p class="CP_w_btns_Mid"><a class="SG_aBtn SG_aBtnB" href="#" data-node="btn-ok"><cite>确认</cite></a></p>',    
                        '</div>',
                        '</td>',
                        '<td class="tRight"><span></span></td>',
                    '</tr>',
                '</tbody>',
            '</table>'
        ].join(""),
        w: 396,
        h: 198,
        bs: null, //遮罩
        panel: null,
        box: null,
        init: function (){//在这里新增一个初始化切换的方法就ok了
            var self = this;
            var bs = self.bs = new BackShadow(0.4);
            var panel = self.panel = new Lib.Panel();
            panel.setTemplate(self.tpl);
            
            var box = self.box = panel.getNode("panel");
            var closeBtn = getElementsByAttr(box, "data-node", "btn-close")[0];
            var okBtn = getElementsByAttr(box, "data-node", "btn-ok")[0];
            //关闭事件
            addEvent(closeBtn, function (){
                stopDefaultEvent();
                self.hide();
            });
            //确认提交事件
            addEvent(okBtn, function (){
                stopDefaultEvent();
                if(!lock){
                    lock = 1;
                    self.submit();
                }
            });
            self.setPosition();
            self.isInit = 1;
        },
        submit: function (){
            var self = this;
            var num = 1;//默认一支金笔
            //不能给自己的文章赠送金笔
            if(pageInfo.uid == pageInfo._uid){
                winDialog.alert(MSG["M14"]);
                lock = 0;
                return;
            }

            if(pageInfo._goldPanNum < num){
                var newnum = num - pageInfo._goldPanNum;
                redeemGoldpan(newnum, function (s, t){
                    if(s){
                        giveGoldpan({
                            blogid: pageInfo.articleid,
                            num: num,
                            newnum: newnum
                        }, function (s, t){
                            if(s){
                                winDialog.alert(MSG["M00"]);
                                updateActGPN();//成功更新获赠金笔数
                                self.hide();
                                lock = 0;
                            }else{
                                winDialog.alert(t);
                                lock = 0;
                            }
                        });
                    }else{
                       winDialog.alert(t); 
                       lock = 0;
                    }
                });
            }else{
                giveGoldpan({
                    blogid: pageInfo.articleid,
                    num: num
                }, function (s, t){
                    if(s){
                        winDialog.alert(MSG["M00"]);
                        updateActGPN();//成功更新获赠金笔数
                        self.hide();
                        lock = 0;
                    }else{
                        winDialog.alert(t);
                        lock = 0;
                    }
                });
            }
        },
        show: function (){
            !this.isInit ? this.init() : '';
            this.bs.show();
            this.panel.show();
        },
        hide: function (){
            this.panel.hide();
            this.bs.hidden();
        },
        setPosition: function (){
            var self = this;
            var win = Core.System.winSize();
            var x = win.width / 2 - self.w / 2;
            var y = win.height / 2 - self.h / 2 - 20;
            self.panel.setPosition(x, y);
            self.panel.setFixed(true);
        }
    };
    //获取当前登录用户的积分数
    function getUserData(cb){
      var attention = new Interface("http://blogtj.sinajs.cn/api/get_attention_num.php", "jsload");
          var getVal = {
              "uid": $UID,
              "suid": $UID,
              "attention": "suid",
              "userpointuid": $UID,
              "s": "1"
          };
          attention.request({
              GET: getVal,
              onSuccess: function (oData) {
                cb(oData);
              },
              onError: function () {cb({})},
              onFail: function () {cb({})}
          });
    }
    //兑换金笔
    function redeemGoldpan(num, cb){
        itf.redeem.request({
            POST:{
                type: 10,
                num: num,
                user: '',
                auto: 0
            },
            onSuccess: function(data){
                cb(true);
            },
            onError: function(result){
                cb(false, result && result.data);
            },
            onFail: function(){
                cb(false, MSG["M12"]);
            }
        });
    }
    //给文章赠送金笔
    function giveGoldpan(data, cb){
        itf.giveGoldpan.request({
            POST: data,
            onSuccess: function(data){
                cb(1);
            },
            onError: function(result){
                cb(0, result && result.data);
            },
            onFail: function(){
                cb(0, MSG["M13"]);
            }
        });
    }
    //更新文章获赠金笔数
    function updateActGPN(){
        Utils.Io.JsLoad.request(
            "http://comet.blog.sina.com.cn/api?maintype=goldpen&blogid=" + pageInfo.articleid, 
            {
                onComplete : function(data) {
                    var el = $E("goldPan-num");
                    if(data && el){
                        el.innerHTML = pageInfo.goldPanNum = parseInt(data.blog_receive)||0;
                    }
                },
                onException : function () {
                }
            });
    }
    function initGoldPan(){
        /*
        //页面插入结点部分，应由php页面直接输出，后期这部分将去除
        var pEl = getChildrenByClass($E("share"), "up")[0];
        var btnHTML = '<div class="upBox upBox_add">'+
                        '<p class="count" id="goldPan-num">0</p>'+
                        '<p class="link" id="goldPan-give"><img class="SG_icon SG_icon214" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="20" height="16" title="赠金笔" align="absmiddle">赠金笔</p>'+
                      '</div>';
        insertHTML(pEl, btnHTML, "beforeend");
        */
        Lib.checkAuthor();
        //请求当前文章已获赠金笔数
        updateActGPN();
        
        popup.init();
        //当前登录用户积分数大于0时
        $isLogin ? getUserData(function(data){
            pageInfo._userpoint = data.userpoint;
            pageInfo._goldPanNum = data.goldpen;
            // console.log(data);
            if(data.userpoint > 0 || data.goldpen > 0){
                Lib.Listener.on({
                  name: "article_like_success",
                  callBack: function (){
                      popupLiked.show();//添加喜欢后赠金笔引导
                  }
                });
            }
        }) : '';

        addEvent($E("goldPan-give"), function (){
            //检测是否登录
            if(!$isLogin){
                var Login = new Lib.Login.Ui();
                Login.login(function(){
                    scope.blogOpener.showDialog(function() {
                        pageInfo._uid = $UID;
                        popup.show();
                    });
                },false,"referer:"+location.hostname+location.pathname+",func:giveGoldpan");
            }else{
                popup.show();

                var jibenTab = getElementsByAttr((document.getElementsByTagName('body'))[0],'name','jiben_tab')[0];                
                var otherNum = getElementsByAttr((document.getElementsByTagName('body'))[0],'node-data','other-num')[0];               
                getElementsByAttr((document.getElementsByTagName('body'))[0],'node-data','gold-exchange')[0].parentNode.parentNode.parentNode.className = "current";
                getElementsByAttr((document.getElementsByTagName('body'))[0],'node-data','tyrant-standings')[0].parentNode.parentNode.parentNode.className = "";
                getElementsByAttr((document.getElementsByTagName('body'))[0],'node-data','nomination-list')[0].parentNode.parentNode.parentNode.className = "";
                

                var radioAll = getElementsByAttr((document.getElementsByTagName('body'))[0],'name','radioAll')[0];
                var hidden = $E('hidden');
                var button01 = $E('button01');
                button01.style.display = 'block';
                radioAll.style.display = "block";
                hidden.style.display = 'none';                              
            }            
        });
    }
    
    initGoldPan();
});