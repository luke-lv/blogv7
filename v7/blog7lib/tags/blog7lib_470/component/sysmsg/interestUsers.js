/**
 * @fileInfo   可能感兴趣的人
 * @author     yongsheng4@staff.sina.com.cn
 * @update     2013-04-01
 * [todo]
 * 1、接口相关改造
 */
$import("sina/core/events/addEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/dom/createElement.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/core/dom/createElement.js");
$import("sina/ui/template.js");
$import("lib/checkAuthor.js");

Lib.sysmsg = Lib.sysmsg || {};
Lib.register('sysmsg.InterestUsers', function(lib) {
    var InterestUsers = Core.Class.create();
    InterestUsers.prototype = {
        tpl: {
            title: '<li class="tit">你可能感兴趣的人</li>',
            item: ['<li class="#{liclass}">',
                '<div class="mInfo">',
                '<div class="pic">#{upic}</div>',
                '<div class="txt">',
                '<a href="#{ublog}" onclick="v7sendLog(\'40_01_36\')" class="nickname" target="_blank">#{uname}</a>',
                '#{vip}',
                '<span class="note">#{reason}</span>',
                '</div>',
                '<a href="###" onclick="v7sendLog(\'40_01_37\');return false;" action-type="add_attention" action-data="uid=#{uid}" class="follow">关注Ta</a>',
                '</div>',
                '</li>'].join("")
        },
        initialize: function(ele) {
            this._box = ele;
            var _this = this;//ie7不支持bind
            this.getDate(function(data) {
                _this._showCom(data);
            });
        },
        //显示组件
        _showCom: function(result) {
            var html = this._formatTpl(result);
            Core.Dom.insertHTML(this._box, html, "BeforeEnd");
            this._bindEvents();
        },
        //获取接口数据
        getDate: function(callback) {
            // var data = {
            //     code: "",
            //     data: [{
            //         name: "你大爷的1",
            //         vip_status: 0,
            //         uid: "1374834850",
            //         reason: "好基友"
            //     }, {
            //         name: "你大爷的2",
            //         vip_status: 1,
            //         uid: "1374834860",
            //         reason: "好基友"
            //     },
            //     {
            //         name: "你大爷的3",
            //         vip_status: 1,
            //         uid: "1374834860",
            //         reason: "好基友"
            //     },
            //     {
            //         name: "你大爷e的4",
            //         vip_status: 1,
            //         uid: "1374834860",
            //         reason: "好基友"
            //     }]
            // };
            var _this = this;
            if(this._data){
                var t = this._spliceDate(3);
                callback(t);
            }else{
                Lib.checkAuthor();
                var inter = new Interface("http://control.blog.sina.com.cn/blog_rebuild/riaapi/profile/note/user_recommend.php", "jsload");
                inter.request({//$UID20770861
                    GET: {uid:$UID,cate_id:scope.$cate_id || ""},
                    onSuccess: function(data){
                      _this._data = data.msg;
                      if(_this._data.length>0){
                        var t = _this._spliceDate(3);
                        callback(t);
                      }else{
                        _this._hideBox();
                      }
                      //alert(JSON.stringify(result))
                    }.bind2(this),
                    onError: function(result){
                      _this._hideBox();
                    }.bind2(this),
                    onFail: function(){
                      _this._hideBox();
                    }.bind2(this)
                });
                // this._data = data.data;
                // var t = this._spliceDate(3);
                // callback(t);
            }
        },
        //分格数据
        _hideBox:function(argument) {
            if(this._box){
                this._box.style.display = "none";
            }
        },
        //分格数据
        _spliceDate:function(num) {
            var t = this._data.length >= num ? this._data.splice(0,num) : this._data;
            return t;
        },
        //数据格式化
        _formatData: function(data, islast) {
            var name = data.name;
            var uid = data.uid;
            var _data = {};
            _data['liclass'] = islast == 1 ? "nobd" : "";
            _data["uid"] = uid;
            _data["uname"] = name;
            _data["vip"]  = (data.vip_status == 1 || data.vip_status == 2) ? Lib.sysmsg.utils.getVipIcon(data.vip_status) : ""; //[todo]判断
            _data["upic"] = Lib.sysmsg.utils.getUserPic(uid, name, 30, "40_01_36");
            _data["ublog"] = Lib.sysmsg.utils.getUserBlogUrl(uid);
            _data["reason"] = Lib.sysmsg.utils.strTruncate(data.reason,24);
            return _data;
        },
        //格式化单条消息的模版
        _formatItemTpl: function(itemdata) {
            var tpl = this.tpl.item;
            if (tpl) {
                var itemsTemplate = new Ui.Template(tpl);
                var itemhtml = itemsTemplate.evaluateMulti([itemdata]);
                return itemhtml;
            } else {
                return "";
            }
        },
        //格式化模版
        _formatTpl: function(data) {
            data = data;
            var tpl = [];
            var len = data.length > 3 ? 3 : data.length;
            tpl.push(this.tpl.title);
            for (var i = 0; i < len; i++) {
                var islast = (i == (len - 1)) ? 1 : 0; //是否是最后一条
                var itemdata = this._formatData(data[i], islast); //格式化数据
                tpl.push(this._formatItemTpl(itemdata));
            }
            return tpl.join("");
        },
        //格式化内容
        _formatBodyTpl:function(data,islast) {
            var islast = islast || 0;
            var len = data.length > 3 ? 3 : data.length;
            var tpl = [];
            for (var i = 0; i < len; i++) {
                var itemdata = this._formatData(data[i], islast); //格式化数据
                tpl.push(this._formatItemTpl(itemdata));
            }
            return tpl.join("");
        },
        //事件绑定
        _bindEvents: function() {
            var _this = this;
            Lib.checkAuthor();
            var uid1 = $UID; //发出关注的人
            var delegateEl = this._box;
            Core.Events.addEvent(delegateEl, function(e) {
                var data = Lib.util.getActionData(e, "add_attention");
                if (!data) {
                    return;
                } else {
                    var target = data.targetEl;
                    var aid = Core.System.queryToJson(data.data).uid; //被关注的人
                    // var sign = Core.Dom.createElement('<span>已关注</span>');
                    // Lib.Component.Attention(uid1,uid2,function(){
                    //     //target.parentNode.replaceChild(sign,target);
                    //     target.className = "followed";
                    //     target.innerHTML = "已关注";
                    // });
                    var inter = new Interface("http://control.blog.sina.com.cn/riaapi/profile/attention_add.php", "ijax");
                    var data = {};
                    data.aid = aid;
                    data.uid = $UID;
                    inter.request({
                        POST: data,
                        onSuccess: function(result) {
                            _this._disAttention(target);
                        }.bind2(this),
                        onError: function(result) {
                            _this._disAttention(target);
                        }.bind2(this),
                        onFail: function() {
                            _this._disAttention(target);
                        }.bind2(this)
                    });
                }
            }, "click");
        },
        _disAttention: function(target) {
            target.className = "followed";
            target.innerHTML = "已关注";
            var li = target.parentNode.parentNode;
            var islast = li.className == "nobd" ? 1 : 0;//[todo]没有时直接隐藏
            var data = this._spliceDate(1);
            if(data.length>0){
                var html = this._formatBodyTpl(data,islast);
                var newli = Core.Dom.createElement(html);
                setTimeout(function(){
                    li.parentNode.replaceChild(newli,li);
                },1000);
                
            }else{
                setTimeout(function(){
                    li.parentNode.removeChild(li);
                },1000);
            }
        }
    };
    return InterestUsers;
});