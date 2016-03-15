/** 
 * @fileoverview 设置时间的浮层
 * @author Book | liming9@staff.sina.com.cn
 * @create 2012-08-02
 * @forcopy $import("mojie/setTimeDialog.js");
 */
$import("mojie/_mojie.js");
$import("lib/dialogConfig.js");
$import("sina/core/math/getUniqueId.js");
$import("sina/core/date/UTC.js");
$import("mojie/Calendar.js");

/**
 * 简单地将单条数据渲染到模板的函数
 * @method
 * @param {String} tpl 待渲染的模板
 * @param {Array | Object} data 渲染到模板里的数据
 * @type String
 * @example
        
 */
Mojie.setTimeDialog = function(option){
    //var noop = function(){};
    var time = option.time&&new Date(option.time) || new Date();
    //var rnd = Core.Math.getUniqueId();
    var opt60 = getSelectOption(60);
    var _nodes;
    var tpl = '' +
        '<div class="CP_layercon2 addFriendItem">' +
            '<div class="timed">' +
                '<span>定时发布：</span><em id="txt_date">2012年12月20日</em><input id="#{date}" type="hidden" value="2012-12-20" />' + // size="10"
                '<select name="tselect" id="#{hour}">' +
                    getSelectOption(24) +
                '</select>时' +
                '<select name="tselect2" id="#{minute}">' +
                    opt60 +
                '</select>分' +
                '<select name="tselect3" id="#{second}">' +
                    opt60 +
                '</select>秒' +
            '</div>' +
            '<input type="hidden" value="" id="#{timeInput}" />' +
//日历开始
'<div id="#{calendarBody}" class="calendar" style="width:180px;">' +
    '<div class="calHd">' +
        '<div class="inner">' +
            '<a title="" href="javascript:;" class="btnMod preYear" id="#{preYearBtn}"></a>' +
            '<a title="" href="javascript:;" class="btnMod NextYear" id="#{nextYearBtn}"></a>' +
            '<a title="" href="javascript:;" class="btnMod preMon" id="#{preMonthBtn}"></a>' +
            '<a title="" href="javascript:;" class="btnMod NextMon" id="#{nextMonthBtn}"></a>' +
            '<div class="title">' +
                '<input type="text" value="2012" class="inputTxt focus inputYear" id="#{idCalendarYear}" />年' + // readonly="readonly"
                '<input type="text" value="12" class="inputTxt focus inputMon" id="#{idCalendarMonth}" />月' + // readonly="readonly"
                //'<input type="hidden" value="2012" id="#{idCalendarYear}" /><span id="txt_Year">2012</span>年' +
                //'<input type="hidden" value="12" id="#{idCalendarMonth}" /><span id="txt_Month">12</span>月' +
            '</div>' +
        '</div>' +
    '</div>' +
    '<div class="calBd">' +
        '<table>' +
            '<thead>' +
                '<tr>' +
                    '<td><span>日</span></td>' +
                    '<td><span>一</span></td>' +
                    '<td><span>二</span></td>' +
                    '<td><span>三</span></td>' +
                    '<td><span>四</span></td>' +
                    '<td><span>五</span></td>' +
                    '<td><span>六</span></td>' +
                '</tr>' +
            '</thead>' +
            '<tbody id="#{idCalendar}"><tr><td><a href="javascript:;" class="disabled">&nbsp;</a></td><td><a href="javascript:;" class="disabled">&nbsp;</a></td><td><a href="javascript:;" class="disabled">&nbsp;</a></td><td><a href="javascript:;" class="disabled">1</a></td><td><a href="javascript:;" class="disabled">2</a></td><td><a href="javascript:;" class="disabled">3</a></td><td><a href="javascript:;" class="disabled">4</a></td></tr><tr><td><a href="javascript:;" class="disabled">5</a></td><td><a href="javascript:;" class="disabled">6</a></td><td><a href="javascript:;" class="disabled">7</a></td><td><a href="javascript:;" class="selected">8</a></td><td><a href="javascript:;">9</a></td><td><a href="javascript:;">10</a></td><td><a href="javascript:;">11</a></td></tr><tr><td><a href="javascript:;">12</a></td><td><a href="javascript:;">13</a></td><td><a href="javascript:;">14</a></td><td><a href="javascript:;">15</a></td><td><a href="javascript:;">16</a></td><td><a href="javascript:;">17</a></td><td><a href="javascript:;">18</a></td></tr><tr><td><a href="javascript:;">19</a></td><td><a href="javascript:;">20</a></td><td><a href="javascript:;">21</a></td><td><a href="javascript:;">22</a></td><td><a href="javascript:;">23</a></td><td><a href="javascript:;">24</a></td><td><a href="javascript:;">25</a></td></tr><tr><td><a href="javascript:;">26</a></td><td><a href="javascript:;">27</a></td><td><a href="javascript:;">28</a></td><td><a href="javascript:;">29</a></td><td><a href="javascript:;">30</a></td><td><a href="javascript:;">31</a></td><td><a href="javascript:;" class="disabled">&nbsp;</a></td></tr></tbody>' +
        '</table>' +
    '</div>' +
'</div>' +
//日历结束
            '<div class="formTowho">' +
                '<div class="row1"></div>' +
                '<div class="btn"><a id="#{ok}" class="SG_aBtn SG_aBtnB" href="javascript:;"><cite>确认</cite></a>&nbsp;&nbsp;<a id="#{cancel}" class="SG_aBtn SG_aBtnB" href="javascript:;"><cite>取消</cite></a></div>' +
            '</div>' +
        '</div>';
    
    var dlg;
        
    //一切都是从这里开始的。。。
    //function main(){
        initDialog();
        initTime(option.time);
        initEvent();
        dlg.show();
        dlg.setFixed(true);
        dlg.setAreaLocked(true);
        dlg.setMiddle();
    //}
    
    function initDialog(){
        dlg = winDialog.createCustomsDialog({
            ad: false,
            drag: true,
            title: '设置时间',
            content: tpl,
            width: 360,
            //height: data.height,
            shadow: 1
        });
        _nodes = dlg.nodes;
        _nodes.btnClose.href = 'javascript:;';
        setTimeout(function(){_nodes.hour.focus()},1); //解决ie下浮层不能覆盖编辑器中光标的bug
    }
    
    function initEvent(){
        _nodes.btnClose.onclick = function() {
            var notClose = option.funcClose&&option.funcClose(getTime());
            !notClose && closeDlg();
        };
        _nodes.ok.onclick = function(){
            var notClose = option.funcOk&&option.funcOk(getTime());
            !notClose && closeDlg();
        };
        _nodes.cancel.onclick = function(){
            var notClose = option.funcCancel&&option.funcCancel(getTime());
            !notClose && closeDlg();
        };
        
        //日历初始化
        var lastDay = new Date();
        lastDay.setFullYear(lastDay.getFullYear()+1);
        //lastDay.setDate(lastDay.getDate()-1);
        var opt = {
            timeInput:_nodes.timeInput,
            preMonthBtn:_nodes.preMonthBtn,
            nextMonthBtn:_nodes.nextMonthBtn,
            preYearBtn:_nodes.preYearBtn,
            nextYearBtn:_nodes.nextYearBtn,
            //hourInput:$E("hourInput"),
            //minuteInput:$E("minuteInput"),
            container:_nodes.idCalendar,
            body:_nodes.calendarBody,
            dateInput:_nodes.date,
            lastDate: lastDay, //最多只选一年
            selectedDate: new Date(option.time),
            yearInput:_nodes.idCalendarYear,
            monthInput:_nodes.idCalendarMonth,
            onSelectDay: function(o) {
                o.className = "selected";
            },
            onToday: function(o) {
                o.className = "onToday";
            }
        };
        var calendar = new Mojie.Calendar();
        calendar.init(opt);
    }
    
    //初始化时间
    function initTime(ts){
        _nodes.timeInput.value = ts;
        //trace(ts);
        //trace(+new Date);
        var t = new Date(ts);
        var mm = t.getMonth()+1, dd = t.getDate();
        _nodes.date.value = t.getFullYear()+(mm<10?'-0'+mm:'-'+mm)+(dd<10?'-0'+dd:'-'+dd);
        _nodes.hour.value = t.getHours();
        _nodes.minute.value = t.getMinutes();
        _nodes.second.value = t.getSeconds();
    }
    
    //获取选择的时间
    function getTime(){
        var yyMMdd = _nodes.date.value.split('-');
        //return Date.UTC(dt[0], parseInt(dt[1],10)-1, parseInt(dt[2],10),
        //    $E('hour'+rnd).value, $E('minute'+rnd), $E('second'+rnd).value);
        return Core.Date.UTC({
            y: parseInt(yyMMdd[0], 10),
            M: parseInt(yyMMdd[1], 10) - 1,
            d: parseInt(yyMMdd[2], 10),
            h: parseInt(_nodes.hour.value, 10),
            m: parseInt(_nodes.minute.value, 10),
            s: parseInt(_nodes.second.value, 10)
        });
    }
    //获取时间选择的option，从0到max之间的数，包括0不包括max
    function getSelectOption(max){
        var s = '', i = 0;
        for(; i<max; i++){
            s += '<option value="'+i+'">'+i+'</option>';
        }
        return s;
    }
    
    function closeDlg(){
        dlg.hidden();
        //dlg.close();
        //dlg.destroy();
        var entity = dlg.__entity;
        entity.parentNode && entity.parentNode.removeChild(entity);
        dlg = null;
        _nodes = null;
    }
};
