/**
 * @Fileoverview 博客积分签到 博文编辑器页和个人中心页 
 * @author jiangwei5@staff.sina.com.cn
 * @date 2014/08/12
 */
$import("lib/interface.js");
$import("lib/dialogConfig.js");
$import("sina/utils/tpl.js");
$import("lib/panel.js");
$import("sina/ui/dialog/backShadow.js");
$import("sina/core/system/winSize.js");
$import('sina/core/events/addEvent.js');
$import("sina/core/events/getEventTarget.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/events/stopDefaultEvent.js");

Lib.register('jfCheckIn', function(lib) {
    var checkEL = $E('jf_check');
    var addEvent = Core.Events.addEvent;
    var stopDefaultEvent = Core.Events.stopDefaultEvent;
    var getEvent = Core.Events.getEvent;
    var getEventTarget = Core.Events.getEventTarget;
    
    var reqType = location.host == 'control.blog.sina.com.cn' ? 'ajax' : 'ijax';
    var itf = new Interface("http://control.blog.sina.com.cn/blog_rebuild/riaapi/points/register_get_points.php",reqType);
    var initHtml = '<a href="javascript:void();" class="checkbtn">签到领积分</a><p>连续签到可领取更多积分<a href="javascript:void();">详情</a></p>';
    var checkedHtml = '<a href="javascript:void();" class="checkbtn">已签到<span>＋{points}分</span></a><p>已连续签到<span>{days}</span>天，继续可获得更多积分 <a href="javascript:void();">详情</a></p>';
    var lock = 0;
    var jfck = {
        status: 0,
        init: function (){
            if(!checkEL) return;
            var self = this;
            itf.request({
                POST: {
                    act: 'get'
                },
                onSuccess: function(data){
                    var status = self.status = data.code/1;
                    checkEL.innerHTML = status ? Utils.tpl(checkedHtml, data) : initHtml;
                    addEvent(checkEL, function (){
                        var ev = getEvent();
                        var tarEl = getEventTarget(ev);
                        stopDefaultEvent(ev);
                        if(tarEl.tagName.toUpperCase() == "A"){
                            if(/详情/.test(tarEl.innerHTML)){
                                jfPannl.show();
                            }else{
                                if(!self.status && !lock){
                                    lock = 1;
                                    self.checkIn();
                                }
                            }
                        }
                    });
                },
                onError: function(){},
                onFail: function(){}
            });
        },
        checkIn: function (){
            var self = this;
            itf.request({
                POST: {},
                onSuccess: function(data){
                    var status = self.status = data.code/1;
                    checkEL.innerHTML = status ? Utils.tpl(checkedHtml, data) : initHtml;
                },
                onError: function(result){
                    winDialog.alert(result && result.data || "操作失败");
                    lock = 0;
                    //已签到积分已领时 重新init一下
                    if(result && result.code == 'A11109'){
                        self.init();
                    }
                },
                onFail: function(){
                    winDialog.alert("请求异常");
                    lock = 0;
                }
            });
        }
    };
    var jfPannl = {
        tpl: '<table class="CP_w" id="#{panel}" style="z-index:9999">\
                <thead>\
                    <tr>\
                        <th class="tLeft"><span></span></th>\
                        <th class="tMid"><div class="bLyTop"><strong>签到积分规则：</strong><cite><a node-data="btnclose" href="#" class="CP_w_shut" title="关闭">关闭</a></cite></div></th>\
                        <th class="tRight"><span></span></th>\
                    </tr>\
                </thead>\
                <tfoot>\
                    <tr>\
                        <td class="tLeft"><span></span></td>\
                        <td class="tMid"><span></span></td>\
                        <td class="tRight"><span></span></td>\
                    </tr>\
                </tfoot>\
                <tbody>\
                    <tr>\
                        <td class="tLeft"><span></span></td>\
                        <td class="tMid">\
                        <div class="CP_layercon1">\
                            <div class="CP_check">\
                              <table class="CP_w_ttl" width="100%">\
                                <tbody><tr><td class="td1">1天签到</td><td class="td2">每日＋1分</td></tr>\
                                <tr><td class="td1">连续3天签到</td><td class="td2">每日＋2分</td></tr>\
                                <tr><td class="td1">连续10天签到</td><td class="td2">每日＋4分</td></tr>\
                                <tr><td class="td1">连续20天签到</td><td class="td2">每日＋6分</td></tr>\
                                <tr><td class="td1">连续30天签到</td><td class="td2">每日＋8分</td></tr>\
                               </tbody></table>\
                               <div class="CP_w_cnt SG_tetb">如果连续签到中断（有一天未签到）重新计算积分</div>\
                               <p class="CP_w_btns_Mid"><a node-data="btnclose" class="SG_aBtn SG_aBtnB" href="#" ><cite>关闭</cite></a></p>\
                            </div>\
                        </div>\
                        </td>\
                        <td class="tRight"><span></span></td>\
                    </tr>\
                </tbody>\
            </table>',
        bs: null,
        panel: null,
        width: 303,
        height: 346,
        isInit: 0,
        init: function (){
            var self = this;
            var bs = self.bs = new BackShadow(0.4);
            var panel = self.panel = new Lib.Panel();
            
            panel.setTemplate(self.tpl);
            var box = panel.getNode("panel");
            addEvent(box, function (){
                var ev = getEvent();
                var tarEl = getEventTarget(ev);
                var nd = tarEl.getAttribute("node-data") || tarEl.parentNode.getAttribute("node-data");
                stopDefaultEvent(ev);
                if(nd == "btnclose"){
                    self.hide();
                }
            });
            self.setPosition();
            self.isInit = 1;
        },
        setPosition: function (){
            var self = this;
            var win = Core.System.winSize();
            var x = win.width / 2 - self.width / 2;
            var y = win.height / 2 - self.height / 2 - 20;
            self.panel.setPosition(x, y);
            self.panel.setFixed(true);
        },
        show: function (obj){
            if(!this.isInit){
                this.init();
            }
            this.bs.show();
            this.panel.show();
        },
        hide: function (){
            this.panel.hide();
            this.bs.hidden();
        }
    };
    
    return jfck;
});