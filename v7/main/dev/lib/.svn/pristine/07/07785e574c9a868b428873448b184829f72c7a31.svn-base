$import("sina/core/dom/addClass.js");
$import("sina/core/dom/removeClass.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/string/leftB.js");
$import("sina/utils/io/jsload.js");

$import("lib/lib.js");
$import("lib/register.js");
$import("lib/util/hoverJq.js");
$import("lib/util/getActionData.js");
$import("lib/sendLog.js");
$import("lib/tray/tpl/cateSearch.js");
/**
 * @fileoverview 托盘搜索下拉面板
 * @author Qiangyee | wangqiang1@staff
 * @created 2013-04-12
 */
Lib.register("tray.CateSearchPanel", function(lib){
    var _addEvt = Core.Events.addEvent;
    //var url = 'http://search.sina.com.cn/?q=sdfasdf+&ie=utf-8&e=utf-8&range=article&ts=&s=&by=all&stype=title&c=blog'
    var leftB = Core.String.leftB;
    var byteLength = Core.String.byteLength;

    var catePanel = Core.Class.define(function() {

        lib.Panel.prototype.initialize.apply(this, arguments);
        this.setTemplate(lib.tray.tpl.cateSearch);

        this.initEvt();

    }, lib.Panel, {
        initEvt : function(){
            var nodes = this.getNodes();
            var $lis = $T(nodes['panel'], 'li');
            lib.util.hoverJq({
                'elm': $lis,
                'mouseenter': function(evt, el, index) {
                    Core.Dom.addClass(el, 'current');
                },
                'mouseleave': function(evt, el, index) {
                    Core.Dom.removeClass(el, 'current');
                },
                'delay': 50
            });
            _addEvt(nodes['panel'], function(evt){
                evt = evt || window.event;
                var searchData = lib.util.getActionData(evt, 'tray-search');
                if (searchData) {
                    lib.Listener.notify('tray-categroy-search',
                        searchData.data);
                }
            });
        },
        /**
         * 更新搜索分类浮层
         */
        updateSearch : function(v){
            
            if (5 < byteLength(v)) {
                v = leftB(v, 4) + '...';
            }
            
            var value = v.replace(/(<|>)/g, function($1){
                if ('<' === $1) {
                    return '&lt;';
                } else {
                    return '&gt;';
                }
            });

            var nodes = this.getNodes();
            nodes['article'].innerHTML = value;
            nodes['bloger'].innerHTML  = value;
            nodes['music'].innerHTML   = value;
            nodes['video'].innerHTML   = value;

        }
    });
    return catePanel;
});