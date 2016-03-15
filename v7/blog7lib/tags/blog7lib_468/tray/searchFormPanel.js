$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/fireEvent.js");
$import("sina/core/string/trim.js");

$import("sina/utils/io/jsload.js");
$import("lib/lib.js");
$import("lib/register.js");
$import("lib/htmlTemplate.js");
$import("lib/sendLog.js");
$import("lib/tray/tpl/searchForm.js");
$import("lib/tray/cateSearchPanel.js");
/**
 * @fileoverview 托盘搜索form框
 * @author Qiangyee | wangqiang1@staff
 * @created 2013-04-12
 */
Lib.register("tray.SearchFormPanel", function(lib){
    var _addEvt = Core.Events.addEvent;
    var _trim = Core.String.trim;
    
    var searchForm = Core.Class.define(function(cfg) {
        // 调用父类的初始化方法，必须使用apply
        lib.Panel.prototype.initialize.apply(this, arguments);

        this.setTemplate(lib.tray.tpl.searchForm);

        this.initEvt();
        
        this.catePanel = new lib.tray.CateSearchPanel();
        this.catePanel.entity.style.zIndex = 512;
        lib.Listener.on({
            name:'tray-categroy-search',
            callBack : this.search,
            scope : this
        });
    }, lib.Panel, {

        initEvt : function(){
            var me = this;
            var $queryTxt = this.getNode('queryTxt');
            
            //if (!$IE) {
                _addEvt($queryTxt, function(evt){
                    evt = evt || window.event;
                    var target = evt.target || evt.srcElement;
                    var offset = target.offsetWidth;
                    me.showCateSearch(target, offset, target.value);
                }, 'input');
            //} else {
                _addEvt($queryTxt, function(evt){
                    console.log(evt);
                    evt = evt || window.event;
                    if ('value' !== evt.propertyName) {
                        return;
                    }
                    var target = evt.target || evt.srcElement;
                    var offset = target.offsetWidth;
                    me.showCateSearch(target, offset, target.value);
                    
                }, 'propertychange');
            //}
            _addEvt($queryTxt, function(evt){
                evt = evt || window.event;
                var target = evt.target || evt.srcElement;
                var offset = target.offsetWidth;
                me.showCateSearch(target, offset, target.value);
            }, 'focus');

            // 增加搜索提交校验
            _addEvt(this.getNode('searchForm'), function(evt){
                evt = evt || window.event;
                var form = evt.target || evt.srcElement;
                
                if (!me.checkValidate(form)) {

                    Core.Events.stopEvent(evt);
                } else {

                    setTimeout(function(){
                        me.hideCateSearch();
                        me.resetForm();
                    }, 100);
                }
                
            }, 'submit');

            // 更新搜索面板位置
            _addEvt(window, function(){
                if (me.catePanel.isShow) {
                    var offset = $queryTxt.offsetWidth;
                    me.catePanel.showWithDom($queryTxt, -offset, 4);
                }
            }, 'resize');

        },
        /**
         * 检查搜索输入值
         */
        checkValidate : function(form){
            if (('q' in form) && !_trim(form['q'].value)) 
                return false;
            else if (('k' in form) &&  !_trim(form['k'].value))
                return false;
            else
                return true;
        },
        /**
         * 设置搜索form的数据
         */
        setForm : function(url, cfg){
            var defaultValue = {
                "queryTxt":"q",
                "ie":"utf-8", 
                "range":"",
                "t":"",
                "s":"", 
                "by":"",
                "type":"",
                "stype":"", 
                "e":"utf-8", 
                "c":""
            };
            var $searchForm = this.getNode('searchForm');
            $searchForm.action = url;
            lib.apply(defaultValue, cfg);
            var $queryTxt = this.getNode('queryTxt');
            $queryTxt.name = defaultValue['queryTxt'];
            delete defaultValue['queryTxt'];
            var attr, $query;
            for(var p in defaultValue){
                attr = defaultValue[p];
                if (typeof attr === 'string' 
                    && ($query = this.getNode(p)) ) {
                    $query.value = attr;
                }
            }
        },
        /**
         * 重置搜索框
         */
        resetForm : function(){
            this.setForm('http://search.sina.com.cn', {
                    "queryTxt" : "q", 
                    "range"    : "article", 
                    "s"        : "sup", 
                    "by"       : "all",
                    "stype"    : "1", 
                    "c"        : "blog"
                });
        },
        /**
         * 根据搜索类型搜索
         */
        search : function(type){
            
            var $searchForm = this.getNode('searchForm');
            var blogSearchUrl = 'http://search.sina.com.cn';
            var videoSearchUrl = 'http://video.sina.com.cn/search/index.php';
            var musicSearchUrl = 'http://music.sina.com.cn/yueku/search/s.php';
            
            switch(type){

                case "video" : 
                    this.setForm(videoSearchUrl, {
                        "queryTxt" : "k", 
                        "s"        : "sup", 
                        "type"     : "boke", 
                        "stype"    : "1"
                    });
                    break;

                case "bloger" : 
                    this.setForm(blogSearchUrl, {
                        "queryTxt" : "q",
                        "range"    : "author", 
                        "s"        : "sup", 
                        "by"       : "all",
                        "stype"    : "1", 
                        "c"        : "blog"
                    });
                    break;

                case "music" : 
                    this.setForm(musicSearchUrl, {
                        "queryTxt" : "k", 
                        "t"        : "song"
                    });
                    break;

                default : 
                    this.setForm(blogSearchUrl, {
                        "queryTxt" : "q", 
                        "range"    : "article", 
                        "s"        : "sup", 
                        "by"       : "all",
                        "stype"    : "1", 
                        "c"        : "blog"
                    });
            }
            if ($IE) {
                this.getNode('submit').click();
            } else {
                Core.Events.fireEvent(this.getNode('submit'), 'click');
            }
            
        },
        /**
         * 显示分类搜索浮层
         */
        showCateSearch : function($withEl, offset, v){
            var catePanel = this.catePanel;
            if (v && catePanel.isHidden) {
                catePanel.showWithDom($withEl, -offset, 4);
            } else if (!v) {
                this.hideCateSearch();
            }
            catePanel.updateSearch(v);
        },
        /**
         * 显示分类搜索浮层
         */
        hideCateSearch : function(){
            var catePanel = this.catePanel;
            catePanel.hide();
            catePanel.updateSearch('');
        }
    });
    return searchForm;
});