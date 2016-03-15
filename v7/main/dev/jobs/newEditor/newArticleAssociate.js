
/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 新编辑器插入相关文章
 * @author gaolei2@
 */

$import("sina/core/events/addEvent.js");
$import("sina/core/events/fixEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/events/stopDefaultEvent.js");

$import("sina/core/dom/setStyle2.js");

$import("sina/core/class/create.js");
$import("sina/core/class/extend.js");

$import("sina/core/function/bind2.js");

$import("lib/dialogConfig.js");
$import("lib/editor/AbstractStandard.js");  // 引这个就是为了Editor这个对象。。。

$import("editor/plugins/ArticleAssociate.js");
$import("jobs/newEditor/newChangeCover.js");

if (typeof SinaEditor == undefined){
    SinaEditor = {};
}

var __addEvent = Core.Events.addEvent,
    __fixEvent = Core.Events.fixEvent,
    __removeEvent = Core.Events.removeEvent,
    __stopDefault = Core.Events.stopDefaultEvent;
    __setStyle = Core.Dom.setStyle2;

SinaEditor.newArticleAssociate  = Core.Class.create();
SinaEditor.newArticleAssociate.prototype = {
    initialize: function(containerId, status){
        this.containerId = containerId;
        this.initHtml();
        if (scope.$is_photo_vip) {
            $E("showType_container").style.display = "";
            if ($E("assoc_style").value == 0) {
                this.showType = "img";
            }
            this.swapShowView();
        }
        var isEdit = /article_edit.php/.test(location.pathname);
        
        this.tbhStatus = 0;
        this.loadDataCount = 0;
        this.initOption();
        this.initInterface();
        this.initEvent();
        this.setNumTip();
    },
    initHtml: function(){
        // 插入文章浮层模版
        var html = ['<div class="e_layer_select">',
                            '<ul class="selected sel" style="display:none;" id="showType_container">',
                                '<li class="s1" id="showType_select_options">展现方式<a href="javascript:void(0);" class="down"><i class="icon i18_down_arr"></i></a></li>', 
                            '</ul>',
                            '<ul class="selected">',
                                '<li class="s1" id="cate_select_options">分类<a href="javascript:void(0);" class="down"><i class="icon i18_down_arr"></i></a></li>', 
                            '</ul>',
                        '</div>',
                        '<div class="e_layer_cont1" set="1">',
                            '<div id="operate_list_o">',
                                '<ul class="e_layer_word" id="operate_list_content">',
                                '</ul>',
                            '</div>',
                            '<div class="e_layer_word center" id="operate_list_loading" style="display: none;">',
                                '<div class="no_blog">',
                                    '<img src="http://simg.sinajs.cn/blog7style/images/blog_editor/bne_loading.gif" alt="">',
                                    '<p class="loading_word">读取中...</p>',
                                '</div>',
                            '</div>',
                            '<div class="e_layer_word center" id="operate_list_none" style="display: none;">',
                                '<p class="no_blog">此分类尚无博文，请选择其他分类</p>',
                            '</div>',
                            '<div class="e_layer_pic" style="display:none;">',
                                '<ul class="pic_line" id="operate_img_list">',
                                '</ul>',
                            '</div>',
                            '<div class="e_layer_warn">',
                            '<p class="p">已选<span id="num_s">5</span>篇，还可以选<span id="num_l">5</span>篇<a href="javascript:;" id="unselect_container"><span id="unselect">重选</span></a></p>',
                            '<div class="e_layer_page" id="article_page">',
                            '</div>',
                            '</div>',
                            '<a href="javascript:;" class="e_layer_btn btn_style" id="article_add">添加</a>',
                        '</div>'].join('');

        this.dialog = winDialog.createCustomsDialog({
            funcClose: this.hide.bind2(this),
            content: html,
            width: 670,
            title: '请选择要添加的文章'
        });

        // 插入更多文章到页面的模版
        if (!$E('article_add_list_view')){
            ele = $C('div');
            ele.innerHTML = ['<div class="BNE_insert" id="article_add_list_view" style="display:none;">',
                                '<div class="inse_tit">',
                                  '<a href="javascript:;" class="lk_a del_btn" id="article_associate_delete_btn"><span class="txt">删除</span><i class="icon i9_close"></i></a>',
                                  '<a href="javascript:;" class="lk_a modify_btn" id="article_associate_modify_btn"><span class="txt">编辑</span><i class="icon i8_edit"></i></a>',
                                    '<span class="tit">更多博文</span>',
                                '</div>',
                                '<!--更多博文_文字-->',
                                '<ul class="BNE_wmore" id="operate_list_view_ul">',
                                '</ul>',
                                '<!--/更多博文_文字-->',
                                '<!--更多博文_图片-->',
                                '<ul class="BNE_pmore" id="operate_img_list_view">',
                                '</ul>',
                                '<!--/更多博文_图片-->',
                            '</div>'].join('');
            $E('BNE_editor').appendChild(ele);
        }
    },
    initOption: function() {
        var data = articleEditorCFG.articleAssociate;
        this.cates = data.cates || {};

        var model = [], temp = {};
        //  提前push是因为ie浏览器会遍历的时候会把全部博文放到最后面
        model.push({
            value: 0,
            text: "全部博文",
            count: data.total || 0
        });
        
        for (var i in this.cates){
            temp = {};
            temp.value = this.cates[i].id;
            temp.text = this.cates[i].name;
            temp.count = this.cates[i].count;
            model.push(temp);
        }
        // 还要把内容放到this.cates中
        this.cates['0'] = {
            id: 0,
            name: "全部博文",
            count: data.total || 0
        }
        
        var config = {
            'triggerTpl': '<span>#{text}</span><a href="javascript:void(0);" class="down"><i class="icon i18_down_arr"></i></a>',
            'triggerClassName': 'menu',
            'triggerText': '全部博文',
            'optionTpl': '<li data-value="#{value}" data-defaultselected="#{defaultSelected}" data-selected="#{selected}" data-disabled="#{disabled}" data-text="#{text}"><a href="javascript:;" title="#{text}"><span>#{text}</span></a></li>',
            'name': 'cate_select_options',
            'model': model
        }

        var nodeCate = $E('cate_select_options');
        this.cateSelectOption = new Sina.Ui.Select(nodeCate, config);
        

        model = [
                        {value: 'txt', text: '文字'},
                        {value: 'img', text: '图片'}
                    ];

        config = {
            'triggerTpl': '<span>#{text}</span><a href="javascript:void(0);" class="down"><i class="icon i18_down_arr"></i></a>',
            'triggerClassName': 'menu sel1',
            'triggerText': '图片',
            'optionTpl': '<li data-value="#{value}" data-defaultselected="#{defaultSelected}" data-selected="#{selected}" data-disabled="#{disabled}" data-text="#{text}"><a href="javascript:;" title="#{text}"><span>#{text}</span></a></li>',
            'name': 'showType_select_options',
            'model': model
        }

        var nodeType = $E('showType_select_options');
        this.typeSelectOption = new Sina.Ui.Select(nodeType, config);

        this.swapShowView();

    },
    setOption: function(){
        if (!this.cateSelectOption){
            return;
        }
        var cateSelectOption = this.cateSelectOption;
        var node = cateSelectOption.getList().children[0];

        if (this.showType == 'txt'){
            node.setAttribute('data-text', '全部博文');
            node.innerHTML = '<span title="全部博文">全部博文</span>';
        }else{
            node.setAttribute('data-text', '图片博文');
            node.innerHTML = '<span title="图片博文">图片博文</span>';
        }
        if (cateSelectOption.getValue() == 0){
            cateSelectOption.setValue(0, false);
        }
    },
    disabledAddButton: function(isTrue){
        // console.log('disabledAddButton')
        var isTrue = isTrue || false;
        var ele = $E('article_add');
        if (isTrue){
            // ele.setAttribute('disabled', true); ie10 设置disabled属性，会导致按钮点击事件失效
            if (ele.className.indexOf('btn_default') < 0){
                ele.className += ' btn_default';
            }
        }else{
            // ele.setAttribute('disabled', false);
            if (ele.className.indexOf('btn_default') >= 0){
                ele.className = ele.className.replace('btn_default', '');
            }
        }
    },
    page: function(pageNum, cate, count){
        var pageCount = 6;
        if (this.showType == "img") {
            pageCount = 8;
        }
        var maxPage = Math.ceil(count / pageCount, pageCount);
        if (maxPage > 1) {
            Ui.Pagination.init({
                "pageNode": "article_page",
                "nodeClassNamePrefix": "number",
                "curPage": pageNum, // 当前所在页码
                "maxPage": maxPage,
                "pageTpl": this.loadData.bind2(this),
                "type": 1 // 指定类型为小区域翻页
            }).show();
        }
        else {
            $E("article_page").innerHTML = '';
        }
    },
    initEvent: function(){
        __addEvent($E("unselect"), this.unselect.bind2(this), "click");
        __addEvent($E("article_add"), this.add.bind2(this), "click");

        __addEvent($E('article_associate_modify_btn'), this.modify.bind2(this), 'click');
        __addEvent($E('article_associate_delete_btn'), this.del.bind2(this), 'click');

        this.cateSelectOption.addEventListener('change', this.initList.bind2(this));
        this.typeSelectOption.addEventListener('change', this.swapShowType.bind2(this));
    },
    initList: function(curNode, oldNode) {
        if (curNode){
            this.selectCate = curNode.getAttribute('data-value');
        }
        this.loadData(1);
    },
    loadData: function(page){
        var page = page || 1;
        var cate = this.selectCate || "0";

        var param = {
            uid: scope.$uid,
            s: 6,
            p: page,
            c: cate,
            random: Math.random()
        }
        if (this.showType != "txt") {
            param.x = "img";
            param.s = 8;
            this._interface = this.img_interface;
        }
        else {
            this._interface = this.txt_interface;
        }
        this.showLoading();
        this._interface.request({
            GET: param,
            onSuccess: function(_data){
                var count, data;
                if (this.showType != "txt") {
                    count = _data.count;
                    data = _data.result;
                } else {
                    count = this.cates[cate].count;
                    data = _data;
                }
                if (count){
                    this.setOption();
                }
                
                this.loadDataCount ++;

                this.parseData(data);
                
                this.page(page, cate, count);
            }.bind2(this),
            onError: function(_data){
                showError(_data.code);
                //trace("error:" + _data);
            }
        });
    },
    formatData: function(data) {
        //是否推荐文章
        if (data.r) {
            // data.r = '<img height="18" width="18" align="absmiddle" title="已推荐到首页" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon107"/>';
            // data.r = '<img height="18" width="18" align="absmiddle" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon107"/>';
            data.r = '<i class="icon jian"></i>';
        }
        return data;
    },
    parseTxtData: function(data){
        var ele = $E("operate_list_content");
        var select_value = $E("cate_select_options").value;
        ele.innerHTML = "";
        // console.log('parseTxtData')
        if (!data) {
            this.showNoBlog();
            return;
        }
        this.showTxtList()
        var len = data.length;
        var __addEvent = Core.Events.addEvent;
        var __addHTML  = Core.Dom.addHTML;
        var __click    = Core.Events.click;
        var clickCount = 0;
        // console.log(data);
        for (var i = 0; i < len; i++) {
            data[i] = this.formatData(data[i]);
            //是否选中
            // console.log(data[i]);
            if (Core.Array.findit(this.select, data[i].i) != -1) {
                data[i].selected = "checked";
            }
            else {
                data[i].selected = "";
            }

            var template = '<li><input type="checkbox" #{selected} id="Chb_#{i}" class="word_box" />'+
                            '<a href="http://blog.sina.com.cn/s/blog_#{i}.html" class="word_link" target="_blank">#{r}#{t}</a>'+
                            '</li>';
            var temp = new Ui.Template(template);
            __addHTML(ele, temp.evaluate(data[i]));
            if (!this.articleList[data[i].i]) {
                this.articleList[data[i].i] = data[i];
            }
            __addEvent($E("Chb_" + data[i].i), this.selectArticle.bind2(this), "click");
            var isSet = $E('article_add_list_view').getAttribute('is_set') && ($E('article_add_list_view').getAttribute('is_set') == '1');
            if (!isSet){// 如果已经设置更多博文了，就不需要默认选中文章功能
                if ((clickCount < 5) && (1 === this.loadDataCount)) {
                    __click($E("Chb_" + data[i].i));
                    clickCount ++ ;
                }
            }
        }
    },
    parseImgData: function(data){
        var ele = $E("operate_img_list");
        ele.innerHTML = '';
        if (!data) {
            this.showNoBlog();
            return;
        }
        
        this.showImgList();

        var len = data.length;

        var tempHtml = '<li>'+
                            '<a id="img_view_#{i}" href="javascript:;" title="" class="pic_link">'+
                                '<i id="change_cover_#{i}" class="icon i7_clicked icon_hover"></i>'+
                                '<span><img id="cover_img_#{i}" src="#{imagePath}" class="pic_img" alt=""></span>'+
                            '</a>'+
                            '<p id="cc_tip_#{i}" class="pic_link pic_nofile" style="display:none;"><i id="back_cover_#{i}" class="icon i9_clicked"></i>抱歉!<br>该篇博文内的所有图片来自站外，无法更换封面。</p>'+
                            '<div id="cover_view_#{i}" class="pic_link pic_link1" style="display:none;">'+
                            '</div>'+
                            '<p>'+
                                '<input id="Chb_i_#{i}" #{selected} type="checkbox">'+
                                '<a target="_blank" href="http://blog.sina.com.cn/s/blog_#{i}.html" title="" class="pic_tit">#{t}</a>'+
                            '</p>'+
                        '</li>';
        
        for (var i = 0; i < len; i++) {
            data[i] = this.formatData(data[i]);
            
            data[i] = this.formatCover(data[i]);
            //是否选中
            if (Core.Array.findit(this.select, data[i].i) != -1) {
                data[i].selected = "checked";
            }
            else {
                data[i].selected = "";
            }
            var temp;
            var at=i+1;
            // if(at%4==0){
            //     temp = new Ui.Template(tempHtml+'<div class="clearit"></div>');
            // }else{
            //     temp = new Ui.Template(tempHtml);
            // }
            temp = new Ui.Template(tempHtml);

            Core.Dom.addHTML(ele, temp.evaluate(data[i]));
            
            if (!this.articleList[data[i].i]) {
                this.articleList[data[i].i] = data[i];
            }
            __addEvent($E("Chb_i_" + data[i].i), this.selectArticle.bind2(this), "click");
            __addEvent($E("change_cover_" + data[i].i), this.changeCover.bind2(this), "click");
            // __addEvent($E("save_cover_" + data[i].i), this.saveCover.bind2(this), "click");
            __addEvent($E("back_cover_" + data[i].i), this.backCover.bind2(this), "click");
        }
    },
    /**
     * 增加imagePaht属性
     * @param {Object} data
     */
    formatCover: function(data){
        if (data.imagePath) {
            return data;
        }
        if (data.cover) {
            if (data.cover.length > 30 && data.cover.indexOf('photoblog_default.gif') > 0) {
                // data.imagePath = data.cover;
                data.imagePath = "http://simg.sinajs.cn/blog7style/images/blog_editor/bne_cover.gif";
            }
            else {
                data.imagePath = getImgStaticPath(data.cover, "small");
            }
        }
        else {
            data.imagePath = "http://simg.sinajs.cn/blog7style/images/blog_editor/bne_cover.gif";
        }
        return data;
    },
    showTxtList: function(){
        // console.log('showTxtList')
        $E('operate_list_content').style.display = '';
        $E('operate_list_o').style.display = '';

        $E('operate_img_list').style.display = 'none';
        $E('operate_img_list').parentNode.style.display = 'none';

        $E("operate_list_none").style.display = 'none';
        $E('operate_list_loading').style.display = 'none';
    },
    showImgList: function(){
        // console.log('showImgList')
        $E('operate_img_list').style.display = '';
        $E('operate_img_list').parentNode.style.display = '';

        $E("operate_list_none").style.display = 'none';
        $E('operate_list_loading').style.display = 'none';

        $E('operate_list_content').style.display = 'none';
        $E('operate_list_o').style.display = 'none';
    },
    showNoBlog: function(){
        // console.log('showNoBlog')
        $E("operate_list_none").style.display = '';
        $E('operate_list_loading').style.display = 'none';

        $E('operate_img_list').style.display = 'none';
        $E('operate_img_list').parentNode.style.display = 'none';

        $E('operate_list_content').style.display = 'none';
        $E('operate_list_o').style.display = 'none';
    },
    showLoading: function(){
        // console.log('showLoading')
        $E('operate_list_loading').style.display = '';
        $E("operate_list_none").style.display = 'none';

        $E('operate_img_list').style.display = 'none';
        $E('operate_img_list').parentNode.style.display = 'none';

        $E('operate_list_content').style.display = 'none';
        $E('operate_list_o').style.display = 'none';
    },
    add: function(){
        // console.log('add',this.select)
        var len = this.select.length;
        if (len < 1) {
            return;
        }

        var templateHtml, eleTxt, eleImg;
        eleTxt = $E("operate_list_view_ul");
        eleImg = $E("operate_img_list_view");
        if (this.showType == "txt") {
            templateHtml = '<li><a href="http://blog.sina.com.cn/s/blog_#{i}.html" class="wmore_link" target="_blank"><span class="dot"></span>#{r}#{t}</a></li>';
            var template = new Ui.Template(templateHtml);
            eleTxt.innerHTML = this.sortSelect(template);
            eleTxt.style.display = '';
            eleImg.style.display = 'none';
        }else {
            templateHtml = ['<li>',
                '<a target="_blank" href="http://blog.sina.com.cn/s/blog_#{i}.html" class="pmore_pic" title="#{t}"><img class="pmore_img" src="#{imagePath}" alt=""></a>',
                '<a target="_blank" href="http://blog.sina.com.cn/s/blog_#{i}.html" class="pmore_tit">#{t}</a>',
            '</li>'].join('');
            var template = new Ui.Template(templateHtml);
            eleImg.innerHTML = this.sortSelect(template);
            eleImg.style.display = '';
            eleTxt.style.display = 'none';
            eleTxt.parentNode.style.display = 'none';
        }

        $E('article_add_list_view').style.display = '';
        $E('article_add_list_view').setAttribute('is_set', 1);

        this.setState("view");
    },
    saveSeleteData: function(){
        var len = this.select.length;
        var array = [];
        var is_set = $E('article_add_list_view').getAttribute('is_set');
        if (is_set == 1){
            for (var i = 0; i < len; i++) {
                array.push(Utils.Json.flatten(this.articleList[this.select[i]]));
            }
            $E("assoc_article_data").value = array.join(",");
        }
    },
    sortSelect: function(template){
        var html = "";
        var len = this.select.length;
        var artArr = new Array(len);
        for (var i = 0; i < len; i++) {
            // var data = this.articleList[this.select[i]] || this.cookieData[this.select[i]];
            var data = this.articleList[this.select[i]]
            //Core.Dom.addHTML(ele, temp.evaluate(data));
            artArr[i] = data;
        }
        for (var m = 0; m < len; m++) {
            for (var n = 1; n < len; n++) {
                if (comptime(artArr[n - 1].d, artArr[n].d) == 'bigger') {
                    var temp = artArr[n - 1];
                    artArr[n - 1] = artArr[n];
                    artArr[n] = temp;
                }
            }
        }
        var at=0;
        for (var q = len - 1; q >= 0; q--) {
            //trace(">>" + artArr[q].d);
            artArr[q] = this.formatCover(artArr[q]);
            
            // if(at!=0 && at%4==0){
            //     html+='<div class="clearit"></div>';
            // }
            at++;
            html += template.evaluate(artArr[q]);
            
        }
        return html;
    },
    del: function(){
        winDialog.confirm($SYSMSG['B79004'], {
            funcOk: function(){
                this.remove();
                this.hide();
            }.bind2(this),

            funcCancel: function(){
                
            }.bind2(this),
            textOk: "是",
            textCancel: "否",
            defaultButton: 1, // 默认是1，表示确定按钮默认聚焦，0 表示取消按钮默认聚焦
            title: "提示",
            icon: "04" // 可选值："01"、"02"、"03"、"04"、"05"
        }, "articleAssociateTip");
    },
    remove: function(){
        // console.log('remove')
        this.select = [];
        this.articleList = {};
        this.selectCate = 0;
        this.loadDataCount = 0;
        this.setNumTip();
        $E('article_add_list_view').style.display = 'none';
        $E('article_add_list_view').setAttribute('is_set', 0);

        $E("operate_list_view_ul").innerHTML = '';
        $E("operate_img_list_view").innerHTML = '';
    },
    modify: function(){
        this.setState("operate");
        // if ((this.showType=="txt" && !$E("operate_list_content").innerHTML)||(this.showType=="img" && !$E("operate_img_list").innerHTML)) {
        //     //编辑博文且有关联文章时
        //     this.initList();
        //     this.setNumTip();
        // }
    },
    swapShowType: function(curNode, oldNode) {
        // console.log('swapShowType')
        if (curNode != oldNode){
            // console.log('!=')
            var v = curNode.getAttribute('data-value');
            this.showType = v;
            this.swapShowView();
            this.articleList = {};
            this.select = [];
            this.setNumTip();
            this.loadData();
        }
    },
    swapShowView: function(){
        if (this.showType == "txt"){
            $E("assoc_style").value = 1;
            $E("operate_img_list").parentNode.style.display = "none";
            $E('operate_list_content').style.display = '';
        }else{
            $E("assoc_style").value = 0;
            $E("operate_img_list").parentNode.style.display = "";
            $E('operate_list_content').style.display = 'none';
        }
        if (this.typeSelectOption){
            this.typeSelectOption.setValue(this.showType, false);
        }
    },
    setState: function(type){
        if (type == 'operate'){
            if (this.showType == 'txt'){
                $E('operate_list_o').style.display = '';
            }else{
                $E('operate_img_list').parentNode.style.display = '';
            }
            this.state = 'operate';
            this.show();
        }else if (type == 'view'){
            this.state = 'view';
            this.hide();
        }
    },
    show: function() {
        if (this.dialog){
            var eleTxt = $E("operate_list_content");
            var eleImg = $E("operate_img_list");
            if ((this.showType=="txt" && eleTxt.innerHTML == '')||(this.showType=="img" && eleImg.innerHTML == '')) {
                this.loadData();
            }
            this.setNumTip();
            this.dialog.show();
            this.dialog.setMiddle();
        }
    },
    hide: function() {
        if (this.dialog){
            try{   
                this.dialog.hide();
            }catch(e){

            }
            
        }
    },
    changeCover: function(){
        var ele = Core.Events.getEventTarget();
        var aid = ele.id.split("_")[2];
        if (!this.ccObj) {
            this.ccObj = new SinaEditor.ChangeCover()
        }
        this.ccObj.renderList(aid);
    }

};

Core.Class.extend(SinaEditor.newArticleAssociate.prototype, Editor.Plugins.ArticleAssociate.prototype, true);
