/**
 * @fileInfo   托盘消息面板
 * @author     yongsheng4@staff.sina.com.cn
 * @update     2013-04-08
 */
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/dom/contains.js");
$import("lib/panel.js");
//$import("sina/ui/tween/tweenStrategy.js");
//$import("sina/ui/tween/transition.js");
$import("lib/component/sysmsg/utils.js");
$import("lib/component/sysmsg/interestUsers.js");
$import("lib/component/sysmsg/tabManager.js");
$import("lib/component/sysmsg/remindSource.js");
$import("lib/component/sysmsg/attitudeSource.js");
$import("lib/component/sysmsg/contentSource.js");
$import("lib/component/sysmsg/msgNumber.js");
Lib.register('sysmsg.MsgPanel', function(lib){
    var MsgPanel = Core.Class.define(function() {
        lib.Panel.prototype.initialize();
        this._tab = null;
        var template = ['<div id="j-msgpanel-tabhead" class="hd">',
                            '<a href="###" onclick="v7sendLog(\'40_01_31\');return false;" j-tab="t1" class="current" _num="0"><span class="mico_nr"><em class="cor"></em></span>内容</a>',
                            '<a href="###" onclick="v7sendLog(\'40_01_32\');return false;" j-tab="t2" _num="0"><span class="mico_wd"></span>我的<em class="cor"></em></a>',
                            '<a href="###" onclick="v7sendLog(\'40_01_33\');return false;" j-tab="t3" _num="0"><span class="mico_xh"></span>喜欢<em class="cor"></em></a>',
                            '<em class="mtip" id="j-msg-feed-num" style="left:45px;display:none;">99</em>',
                            '<em class="mtip" id="j-msg-mine-num" style="left:122px;display:none;">99</em>',
                            '<em class="mtip" id="j-msg-like-num" style="left:199px;display:none;">99</em>',
                          '</div>',
                          '<div class="bd" id="j-msgpanel-tabbody">',
                                '<div j-tab-cnt="t1" style="display:none;">',
                                    '<ul class="mTab_nr"></ul>',
                                    '<div class="seeAll" id="j-goto-feed" style="display:none;"><a onclick="v7sendLog(\'40_01_35\')" href="###">查看所有&gt;&gt;</a></div>',
                                '</div>',
                                '<div j-tab-cnt="t2" style="display:none;">',
                                    '<ul class="mTab_wd" ></ul>',
                                    '<div class="seeAll" id="j-goto-mine" style="display:none;"><a onclick="v7sendLog(\'40_01_35\')" href="###">查看所有&gt;&gt;</a></div>',
                                '</div>',
                                '<div j-tab-cnt="t3" style="display:none;">',
                                    '<ul class="mTab_xh" ></ul>',
                                    '<div class="seeAll" id="j-goto-like" style="display:none;"><a onclick="v7sendLog(\'40_01_35\')" href="###">查看所有&gt;&gt;</a></div>',
                                '</div>',
                                '<ul class="mTab_wd" id="j-interest-list"></ul>',
                          '</div>'].join("");                         
        this.setTemplate('<div class="messageBox" id="#{panel}" style="">'+template+'</div>');
        this.entity.style.zIndex = 500;
        this._bindEvent();
    }, lib.Panel, {
        show:function() {
            // this.entity.style.display="";
            // this._updateBackIframe();
            // this.backIframe.style.display="";
            this.entity.style.display="";
            this.isHidden = !1;
            this.isShow = !0;
            if (this.backIframe) {
                this._updateBackIframe();
                this.backIframe.style.display="";
            }
            if(!this._tab){
                this._initTab();
            }
            this._selectTab();//根据消息数选中tab
        },
        _updatePanelIframe:function() {
            if (this.backIframe) {
                this._updateBackIframe();
            }
        },
        //初始化标签
        _initTab:function() {
            var _this = this;
            this._tab = new Lib.sysmsg.TabManager($E("j-msgpanel-tabhead"),$E("j-msgpanel-tabbody"));
            this._tab.on("select",function(targets) {
                var head = targets[0];
                var body = targets[1].getElementsByTagName("ul")[0];
                _this._setCont(head,body);
            });
            //this._tab.select("t1");
        },
        //设置消息内容
        _setCont:function(hd,bd) {
            var _this = this;
            var type = hd.getAttribute("j-tab");
            var _num = hd.getAttribute("_num") || 0;//旧消息数
            var num = 0;//消息数
            if(type == "t1"){//内容
                num = this.feed || 0;
                if(!this._contentSource){
                    this._contentSource = new Lib.sysmsg.ContentSource(bd);
                }
                if(num != _num){
                    this._contentSource.updateView({num:num},function(data){
                        _this._setAllLink($E("j-goto-feed"),"content",data);
                        _this._setInterest(data,bd);
                    })
                    hd.setAttribute("_num",num);
                }else{
                    if(num == 0){
                        this._contentSource.updateView({num:num},function(data){
                            _this._setAllLink($E("j-goto-feed"),"content",data);
                            _this._setInterest(data,bd);
                        });
                    }
                    this._setInterest({num:hd.getAttribute("_num")},bd);
                }
            }else if(type == "t2"){//提醒
                num = this.mine || 0;
                if(!this._remindSource){
                    this._remindSource = new Lib.sysmsg.RemindSource(bd);
                }
                if(num != _num){
                    this._remindSource.updateView({num:num},function(data){
                        _this._setAllLink($E("j-goto-mine"),"remind",data);
                        _this._setInterest(data,bd);
                    });
                    hd.setAttribute("_num",num);
                }else{//[todo]***must****接口请求失败需要显示感兴趣的人时显示不了了
                    if(num == 0){
                        this._remindSource.updateView({num:num},function(data){
                            _this._setAllLink($E("j-goto-mine"),"remind",data);
                            _this._setInterest(data,bd);
                        })
                    }
                    this._setInterest({num:hd.getAttribute("_num")},bd);
                }
            }else{//态度
                num = this.like || 0;
                if(!this._attitudeSource){
                    this._attitudeSource = new Lib.sysmsg.AttitudeSource(bd);
                }
                if(num != _num){
                    this._attitudeSource.updateView({num:num},function(data){
                        _this._setAllLink($E("j-goto-like"),"attitude",data);
                        _this._setInterest(data,bd);
                    });
                    hd.setAttribute("_num",num);
                }else{
                    if(num == 0){
                        this._attitudeSource.updateView({num:num},function(data){
                            _this._setAllLink($E("j-goto-like"),"attitude",data);
                            _this._setInterest(data,bd);
                        })
                    }
                    this._setInterest({num:hd.getAttribute("_num")},bd);
                }
            }
        },
        //更新tab内容
        _updateTabcont:function(data){
            if(this._tab){
                var target = this._tab.getFocus();
                var _this = this;
                var bd = target.bd.getElementsByTagName("ul")[0];
                var type = target.hd.getAttribute("j-tab");
                var num = 0;
                if(type == "t1"){
                    num = this.feed || 0;
                    if(num>0){
                        return;
                    }
                    this._contentSource.updateView({num:num},function(data){
                        _this._setAllLink($E("j-goto-feed"),"content",data);
                        _this._setInterest(data,bd);
                    })
                }else if(type == "t2"){
                    num = this.mine || 0;
                    if(num>0){
                        return;
                    }
                    this._remindSource.updateView({num:num},function(data){
                        _this._setAllLink($E("j-goto-mine"),"remind",data);
                        _this._setInterest(data,bd);
                    })
                }else{
                    num = this.like || 0;
                    if(num>0){
                        return;
                    }
                    this._attitudeSource.updateView({num:num},function(data){
                        _this._setAllLink($E("j-goto-like"),"attitude",data);
                        _this._setInterest(data,bd);
                    })
                }
            }
        },
        //设置查看全部连接
        _setAllLink:function(target,tab,data) {
            var type = data._firstmsgtype;
            var num = data.num;
            if(num == 0){
                target.style.display = "none";
                return;
            }
            if(type){
                var url = Lib.sysmsg.utils.getAllLinkUrl(tab,type);
                target.style.display = "";
                target.getElementsByTagName("a")[0].setAttribute("href",url);
            }
        },
        //感兴趣的人[todo]bd参数已经无效
        _setInterest:function(data,bd){
            var list = $E("j-interest-list");
            if(data.num == 0){
                list.style.display = "";
                if(!this._interestlist){
                    this._interestlist = new Lib.sysmsg.InterestUsers(list);
                }
            }else{
                list.style.display = "none";
            }
            this._updatePanelIframe();//更新ie6下iframe
        },
        //绑定body点击事件关闭浮层
        _bindEvent:function() {
            var _this = this;
            Lib.Listener.on({
                name : "tray-msg-click",
                callBack : function(data){
                    if(data == -1){//展开后点击消息跳过
                        return;
                    }
                    _this._eventHandle(data);
                }
            });
            Lib.Listener.on({
                name : "tray-newmsg-loaded",
                callBack : function(data){
                    if(_this.isShow){
                        _this._eventHandle(data);
                    }
                }
            });
            //消息面板内部事件等同于tray-newmsg-loaded的作用，但是不想影响其他订阅tray-newmsg-loaded的逻辑
            Lib.Listener.on({
                name : "the-msgnumber-update",
                callBack : function(data){
                    if(_this.isShow){
                        _this._eventHandle(data);
                    }
                }
            });
        },
        //事件句柄
        _eventHandle:function(data) {
            // body...
            var _data = {};
            _data.el = [];
            _data.el.push($E("j-msg-feed-num"));
            _data.el.push($E("j-msg-mine-num"));
            _data.el.push($E("j-msg-like-num"));
            _data.feed = data.feed > 99 ? 99 : data.feed;
            _data.mine = data.mine > 99 ? 99 : data.mine;
            _data.like = data.like > 99 ? 99 : data.like;
            this.feed = data.feed;
            this.mine = data.mine;
            this.like = data.like;
            this._msgnumber = new Lib.sysmsg.MsgNumber(_data);
            this._updateTabcont(data);

        },
        //根据消息数选中tab
        _selectTab:function() {
            if(this._tab){
                if(this.feed == 0){
                    if(this.mine == 0){
                        if(this.like == 0){
                            this._tab.select("t1");
                        }else{
                            this._tab.select("t3");
                        }
                    }else{
                        this._tab.select("t2");
                    }
                }else{
                    this._tab.select("t1");
                }
            }
        }
    });
    return MsgPanel;
});

    
