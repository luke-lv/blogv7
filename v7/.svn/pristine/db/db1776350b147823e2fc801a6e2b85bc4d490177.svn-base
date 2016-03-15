/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 相关文章
 * @author dg.liu | dongguang@staff.sina.com.cn
 */
$import("editor/plugins/plugins.js");
$import("sina/core/class/create.js");
$import("sina/core/math/getUniqueId.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/click.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/getEventTarget.js");
$import("sina/core/array/ArrayWithout.js");
$import("sina/core/dom/addHTML.js");
$import("sina/core/string/j2o.js");
$import("sina/ui/template.js");
$import("sina/ui/pagination.js");
$import("sina/utils/cookie/getCookie.js");
$import("sina/utils/cookie/setCookie.js");
$import("sina/utils/json.js");


$import("lib/interface.js");

$import("other/getImgStaticPath.js");
$import("editor/plugins/ChangeCover.js");


Editor.Plugins.ArticleAssociate = Core.Class.create();
Editor.Plugins.ArticleAssociate.prototype = {
    /**
     * 所选择的文章id
     */
    select: [],
    /**
     * HashSet key 为文章id
     */
    articleList: {},
    /**
     * 提示信息类型，默认为分类模式
     */
    tipType: "cate",
    /**
     * 使显示类型 文本类型（txt）和图片类型（img）
     */
    showType: "txt",
    /**
     * 状态 operate(编辑操作状态)||view(预览状态)
     */
    state: "",
    initialize: function(containerId, status){
        this.containerId = containerId;
        this.initHtml();
        if (scope.$is_photo_vip) {
            trace("Vip");
			$E("showType_container").style.display = "";
            if ($E("assoc_style").value == 0) {
                this.showType = "img";
            }
            this.swapShowView();
        }
        var isEdit = /article_edit.php/.test(location.pathname);
        
        //xiaoyue3 @modified  淘博会下线 20140115
        // var tbhStatus = scope.$private && scope.$private.tbh_status;
        // if (tbhStatus) {
        //     this.tbhStatus = 1;
        // }

        // if (!isEdit && tbhStatus) {
        //     // 陶博会分类号默认，淘博会用户默认分类为32768
        //     this.selectCate = "32768";
        // } else {
            this.tbhStatus = 0;
        // }
        this.loadDataCount = 0;

        this.initOption();
        this.initInterface();
        this.initEvent();
		this.setNumTip();
    },
    /**
     * 根据cookie里面存储的文章id列表，初始化 select属性
     */
    initSelectbyCookie: function(){
        var selectCookie = decodeURIComponent(Utils.Cookie.getCookie("article_associate_" + scope.$uid));
        if (selectCookie && selectCookie != "") {
            this.select = selectCookie.split(",");
            this.cookieData = this.getDataFormCookie();
            this.setNumTip();
        }
    },
    /**
     * 建立读取文章数据的interface
     */
    initInterface: function(){
        this.txt_interface = new Interface("http://control.blog.sina.com.cn/riaapi/associate/get_articles.php", "ajax");
        this.img_interface = new Interface("http://control.blog.sina.com.cn/riaapi/associate/get_articles_xrank.php", "ajax");
    },
    /**
     * 切换编辑操作状态(operate)和预览状态(view)
     * @param {String} type  operate||view
     */
    setState: function(type){
        if (type == "operate") {
            if (this.showType == "txt") {
                $E("operate_list_view").style.display = "none";
                $E("operate_list_o").parentNode.style.display = "block";
            }
            else {
                $E("operate_img_list_view").parentNode.style.display = "none";
                $E("operate_img_list").parentNode.style.display = "block";
            }
            
            
            $E("view_operate").style.display = "none";
            
            $E("operate_info").style.display = "block";
            $E("operate_select").style.display = "block";
            $E("add_container").style.display = "block";
            this.state = "operate";
        }
        else 
            if (type == "view") {
            
                $E("operate_select").style.display = "none";
                $E("operate_info").style.display = "none";
                $E("add_container").style.display = "none";
                
                if (this.showType == "txt") {
                    $E("operate_list_view").style.display = "block";
                    $E("operate_list_o").parentNode.style.display = "none";
                }
                else {
                    $E("operate_img_list_view").parentNode.style.display = "block";
                    $E("operate_img_list").parentNode.style.display = "none";
                }
                $E("view_operate").style.display = "block";
                this.state = "view";
            }
        
    },
    /**
     * 初始化事件的绑定
     */
    initEvent: function(){
        Core.Events.addEvent($E("unselect"), this.unselect.bind2(this), "click");
        Core.Events.addEvent($E("article_add"), this.add.bind2(this), "click");
        Core.Events.addEvent($E("modify"), this.modify.bind2(this), "click");
        Core.Events.addEvent($E("showType_select_options"), this.swapShowType.bind2(this), "change");
        
        //	Core.Events.addEvent($E("delete"),this.del.bind2(this),"click");
    
    },
    /**
     * “修改”按钮所触发的事件
     */
    modify: function(){
        this.setState("operate");
		
        if ((this.showType=="txt" && !$E("operate_list_content").firstChild)||(this.showType=="img" && !$E("operate_img_list").firstChild)) {
            //编辑博文且有关联文章时
            this.initList();
            this.setNumTip();
        }
        $E("operate_list_view_ul").innerHTML = "";
        
    },
    /**
     * “删除”按钮所触发的事件
     */
    del: function(){
        winDialog.confirm($SYSMSG['B79004'], {
            funcOk: function(){
                this.remove();
            }.bind2(this),

            funcCancel: function(){
                editorTabs.showTab("article");
            }.bind2(this),

            textOk: "是",
            textCancel: "否",
            defaultButton: 1, // 默认是1，表示确定按钮默认聚焦，0 表示取消按钮默认聚焦
            title: "提示",
            icon: "04" // 可选值："01"、"02"、"03"、"04"、"05"
        }, "articleAssociateTip");
        var dia = winDialog.getDialog("articleAssociateTip");
        var closeBtn = dia.getNodes().btnClose;
        Core.Events.addEvent(closeBtn, function(){
            editorTabs.showTab("article");
        }, "click");
    },
    /**
     * 清空数据，返回初始化状态
     */
    remove: function(){
        this.select = [];
        this.articleList = {};
        this.selectCate = 0;
        this.modify();
        this.setNumTip();
        // if (this.tbhStatus) {
        //     $E("cate_select_options").value = "32768";
        //     this.selectCate = "32768";
        // } else {
            $E("cate_select_options").options[0].selected = true;
        // }
        this.loadDataCount = 0;
        this.loadData();
        
    },
    /**
     * “添加”按钮所触发的事件、将选择的文章添加到预览中，并按时间排序
     */
    add: function(){
        //trace(">>BEGIN ADD");
        var len = this.select.length;
        if (len < 1) {
            return;
        }
        var templateHtml, ele;
        if (this.showType == "txt") {
            templateHtml = '<li><label>#{r}#{w}<a target="_blank" href="http://blog.sina.com.cn/s/blog_#{i}.html">#{t}</a>#{m}#{p}#{v}</label><span>#{d}</span></li>';
            ele = $E("operate_list_view_ul");
        }
        else {
            templateHtml = '<div class="myPhotoblog_cell">\
			  <div class="myPhotoblog_view">\
			    <div class="myPhotoblog_area">\
			      <table border="0" cellspacing="0" cellpadding="0">\
			        <tr>\
			          <td><img src="#{imagePath}" /></td>\
			        </tr>\
			      </table>\
			    </div>\
			  </div>\
			  <div class="myPhotoblog_nm">\
						#{r}#{w}\
						<a target="_blank" href="http://blog.sina.com.cn/s/blog_#{i}.html">#{t}</a>\
						#{m}#{v}\
			  </div>\
			</div>';
            ele = $E("operate_img_list_view");
        }
        var template = new Ui.Template(templateHtml);
        ele.innerHTML = this.sortSelect(template);
        
        
        this.setState("view");
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
			
			if(at!=0 && at%4==0){
				html+='<div class="clearit"></div>';
			}
			at++;
            html += template.evaluate(artArr[q]);
            
        }
        return html;
    },
    /**
     * 比较select数据
     * @param {Array} data 要和select 进行比较的数据
     */
    compare: function(data){
        var s_len = this.select.length;
        var d_len = data.length;
        if (s_len == d_len) {
            for (var i = 0; i < s_len; i++) {
                if (this.select[i] != data[i].i) {
                    return false;
                }
            }
        }
        else {
            return false;
        }
        return true;
    },
    /**
     * 分页
     */
    page: function(pageNum, cate, count){
        var pageCount = 10;
        if (this.showType == "img") {
            pageCount = 8;
        }
        var maxPage = Math.ceil(count / pageCount, pageCount);
        if (maxPage > 1) {
            Ui.Pagination.init({
                "pageNode": "article_page",
                "nodeClassNamePrefix": "SG",
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
    /**
     * "重选"按钮所触发的事件，清空选项、清空select、更改提示文案。
     */
    unselect: function(){
        //trace("unselect");
        var len = this.select.length;
        for (var i = 0; i < len; i++) {
            var c;
            if (this.showType == "txt") {
                c = $E("Chb_" + this.select[i]);
            }
            else {
                c = $E("Chb_i_" + this.select[i])
            }
            if (c) {
                c.checked = false;
            }
        }
        this.select = [];
        this.setNumTip();
    },
    /**
     * 加载数据时的等待状态
     */
    waitStart: function(){
        $E("operate_list_o").style.display = "none";
        $E("operate_list_loading").style.display = "block";
    },
    /**
     * 取消加载数据时的等待状态，加载完成时调用
     */
    waitEnd: function(){
        $E("operate_list_loading").style.display = "none";
        $E("operate_list_o").style.display = "block";
    },
    /**
     * 功过_interface请求数据
     * @param {Number} page 第几页
     */
    loadData: function(page){
        var page = page || 1;
        var cate = this.selectCate || 0;
        //trace("cate:" + cate);
        var param = {
            uid: scope.$uid,
            s: 10,
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
        this.waitStart();
        this._interface.request({
            GET: param,
            onSuccess: function(_data){
                //debugger;
				var count, data;
				if (this.showType != "txt") {
					count = _data.count;
					data = _data.result;
				} else {
					count = this.cates[cate].count;
					data = _data;
				}
				if(count){
					this.setOption(count);
				}
                
                this.loadDataCount ++;

				this.parseData(data);
				this.waitEnd();
				
				this.page(page, cate, count);
			}.bind2(this)            ,
            onError: function(_data){
                showError(_data.code);
                //trace("error:" + _data);
            },
            onFail: function(){
            }
        });
    },
    /**
     * 选择框改变触发的函数、根绝选择的内容（selectCate）初始化数据
     */
    initList: function(){
        var ele = Core.Events.getEventTarget();
        
        if ("select" == ele.nodeName.toLowerCase()) {
            this.selectCate = ele.value;
        }
        this.loadData(1);
    },
    setOption: function(count){
        if (this.showType == "img") {
            $E("aa_option").innerHTML = '图片博文(' + count + ')'
        } else {
            $E("aa_option").innerHTML = '全部博文(' + count + ')'
        }
    },
    /**
     * 初始化选择框
     */
    initOption: function(){
        var data = articleEditorCFG.articleAssociate;
        this.cates = data.cates || {};
        this.createOption("全部博文", data.total || 0, "0", "aa_option");
        
        for (name in this.cates) {
            var n = this.cates[name].name;
            var c = this.cates[name].count;
            var i = this.cates[name].id;
            if (n && typeof(c) != "undefinded" && typeof(i) != "undefinded") {
                this.createOption(n, c, i);
            }
        }
        this.cates["0"] = {
            name: "全部博文",
            count: data.total || 0
        };
        // if (this.tbhStatus) {
        //     $E("cate_select_options").value = "32768";
        //     this.selectCate = "32768";
        // }
        
        //select 组件事件绑定
        Core.Events.addEvent($E("cate_select_options"), this.initList.bind2(this), "change");
    },
    /**
     * 创建option 并添加到页面
     * @param {String} name
     * @param {String} count
     * @param {String} value
     */
    createOption: function(name, count, value, id){
        var option = $C("option");
        if (id) {
            option.id = id;
        }
        option.innerHTML = name + "(" + count + ")";
        option.value = value;
        $E("cate_select_options").appendChild(option);
    },
    /**
     * 文章标题单击所触发的事件，选择或取消选择文章
     */
    selectArticle: function(){
        //trace("selectArticle");
        var ele = Core.Events.getEventTarget();
		var len=10;
		if(this.showType=="img"){
			len=8;
		}
        if (ele.checked) {
            if (this.select.length >= len) {
                Core.Events.stopEvent();
                showError("B78001");
                return;
            }
            if (this.showType == "txt") {
                this.select.push(ele.id.split("_")[1]);
            }
            else {
                this.select.push(ele.id.split("_")[2]);
            }
            
        }
        else {
            if (this.showType == "txt") {
                this.select = Core.Array.ArrayWithout(this.select, ele.id.split("_")[1]);
            }
            else {
                this.select = Core.Array.ArrayWithout(this.select, ele.id.split("_")[2]);
            }
        }
        this.setNumTip();
        //trace("this.select.length:" + this.select.length);
    },
    /**
     * 设置选择文章数、还可以选择文章数
     */
    setNumTip: function(){
		var countLen=10;
		if(this.showType=="img"){
			countLen=8;
		}
        var len = this.select.length;
        if (len > 0) {
            this.showUnselect();
            this.disabledAddButton();
        }
        else {
            this.hiddenUnselect();
            this.disabledAddButton(true);
        }
        $E("num_s").innerHTML = this.select.length;
        $E("num_l").innerHTML = countLen - this.select.length;
    },
    /**
     * 将”添加“按钮设置为不可用||可用
     * @param {Boolean} isTrue  true:不可用;false:可用
     */
    disabledAddButton: function(isTrue){
        var isTrue = isTrue || false;
        var ele = $E("article_add").parentNode;
        if (isTrue) {
            ele.className = "SG_aBtn SG_aBtn_dis";
        }
        else {
            ele.className = "SG_aBtn SG_aBtnB";
        }
    },
    /**
     * 显示“重选”按钮
     */
    showUnselect: function(){
        $E("unselect_container").style.display = "";
    },
    /**
     * 隐藏“重选”按钮
     */
    hiddenUnselect: function(){
        $E("unselect_container").style.display = "none";
    },
    /**
     * 保存
     */
    save: function(){
        var value = this.select.join(",");
        $E("assoc_article").value = value;
        if (this.historyData) {
            if (this.compare(this.historyData)) {
                return;
            }
        }
    },
    /**
     * 从cookie中取上次选择的数据
     */
    getDataFormCookie: function(){
        var data_str = Utils.Cookie.getCookie("article_associate_data_" + scope.$uid);
        //var d=decodeURIComponent(data_str);
        //alert(unescape(data_str));
        return Core.String.j2o(unescape(data_str));
    },
    /**
     * 将选择的数据存到cookie中
     */
    saveDataToCookie: function(){
        var data = {};
        //Utils.Json.flatten(this.articleList[this.select[i]]
        var len = this.select.length;
        for (var i = 0; i < len; i++) {
            data[this.select[i]] = this.articleList[this.select[i]];
        }
        //trace(Utils.Json.flatten(data));
        var data_str = Utils.Json.flatten(data);
        //var data_str=encodeURIComponent(Utils.Json.flatten(data));
        Utils.Cookie.setCookie("article_associate_data_" + scope.$uid, data_str, 999);
    },
    /**
     * 存储select中数据
     */
    saveSeleteData: function(){
        var len = this.select.length;
        var array = [];
        for (var i = 0; i < len; i++) {
            array.push(Utils.Json.flatten(this.articleList[this.select[i]]));
        }
        $E("assoc_article_data").value = array.join(",");
    },
    /**
     * 格式化数据
     * @param {Object} data
     */
    formatData: function(data){
        //是否推荐文章
        if (data.r) {
            // data.r = '<img height="18" width="18" align="absmiddle" title="已推荐到首页" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon107"/>';
            data.r = '<img height="18" width="18" align="absmiddle" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon107"/>';
        }
        //是否手机发表
        if (data.w) {
            //data.w = '<img height="18" width="18" align="absmiddle" title="此博文通过手机撰写(手机访问sina.cn)" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon105"/>';
            data.w = '<a href="http://news.sina.com.cn/437/2008/0703/24.html" target="_blank"><img height="18" width="18" title="手机博文" align="absmiddle" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon105"/></a>';
        }
        //是否存在图片
        if (data.p) {
            data.p = '<img height="15" width="15" align="absmiddle" title="此博文包含图片" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon18"/>';
        }
        //是否存在视频
        if (data.m) {
            data.m = '<img height="15" width="15" align="absmiddle" title="此博文包含视频" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon16"/>';
        }
        //是否投票文章
        if (data.v) {
            data.v = '<img height="15" width="15" align="absmiddle" title="此博文包含投票" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon33"/>';
        }
        return data;
    },
    /**
     * 分析数据、展示列表，并初始化文章标题点击事件
     * @param {Object} data
     */
    parseData: function(data){
        if (this.showType == "txt") {
            this.parseTxtData(data);
        } else {
            this.parseImgData(data);
        }
    },
    changeCover: function(){
        var ele = Core.Events.getEventTarget();
        var aid = ele.id.split("_")[2];
        
        if (!this.ccObj) {
            this.ccObj = new Editor.Plugins.ChangeCover()
        }
        this.ccObj.renderList(aid);
        
    },
    saveCover: function(){
        var ele = Core.Events.getEventTarget();
        var aid = ele.id.split("_")[2];
        this.ccObj.save(aid);
    },
	backCover: function(){
        var ele = Core.Events.getEventTarget();
        var aid = ele.id.split("_")[2];
        ele.style.display="none";
		$E("change_cover_"+aid).style.display="";
		
		$E("img_view_"+aid).style.display="";
		$E("cc_tip_"+aid).style.display="none";
        $E("back_cover_"+aid).style.display = 'none';
    },
    parseImgData: function(data){
        var ele = $E("operate_img_list");
        
        if (data) {
            ele.innerHTML = "";
        }
        else {
            ele.innerHTML = "<strong>此分类尚无博文，请选择其他分类</strong>";
			return;
        }
        var len = data.length;
        var tempHtml = '<div class="myPhotoblog_cell">\
		  <div class="myPhotoblog_view">\
		    <div class="myPhotoblog_area" id="img_view_#{i}">\
		      <table border="0" cellspacing="0" cellpadding="0">\
		        <tr>\
		          <td><img id="cover_img_#{i}" src="#{imagePath}" /></td>\
		        </tr>\
		      </table>\
		    </div>\
			<div id="cc_tip_#{i}" class="myPhotoblog_txt SG_clewtxta" style="display:none">抱歉！<br>该篇博文内的所有图片来自站外，无法更换封面。</div>\
			<div class="myPhotoblog_coverlist" id="cover_view_#{i}" style="display:none"></div>\
		  </div>\
		  <div class="myPhotoblog_cover"><a id="change_cover_#{i}" href="javascript:void(0)">换封面</a><a id="save_cover_#{i}" href="javascript:void(0)" style="display:none">保存封面</a><a id="back_cover_#{i}" href="javascript:void(0)" style="display:none">返回</a></div>\
		  <div class="myPhotoblog_nm">\
		    <input  #{selected} type="checkbox" id="Chb_i_#{i}" />\
		    <label for="Chb_i_#{i}">\
					#{r}#{w}\
					<a target="_blank" href="http://blog.sina.com.cn/s/blog_#{i}.html">#{t}</a>\
					#{m}#{v}\
			</label>\
		  </div>\
		</div>';
        
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
			if(at%4==0){
				temp = new Ui.Template(tempHtml+'<div class="clearit"></div>');
			}else{
				temp = new Ui.Template(tempHtml);
			}
			
            Core.Dom.addHTML(ele, temp.evaluate(data[i]));
            
            if (!this.articleList[data[i].i]) {
                this.articleList[data[i].i] = data[i];
            }
            Core.Events.addEvent($E("Chb_i_" + data[i].i), this.selectArticle.bind2(this), "click");
            Core.Events.addEvent($E("change_cover_" + data[i].i), this.changeCover.bind2(this), "click");
            Core.Events.addEvent($E("save_cover_" + data[i].i), this.saveCover.bind2(this), "click");
			Core.Events.addEvent($E("back_cover_" + data[i].i), this.backCover.bind2(this), "click");
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
            if (data.cover.length > 30) {
                data.imagePath = data.cover;
            }
            else {
                data.imagePath = getImgStaticPath(data.cover, "small");
            }
        }
        else {
            data.imagePath = "http://simg.sinajs.cn/blog7style/images/common/photoblog_default.gif";
        }
        return data;
    },
    
    parseTxtData: function(data){
        //trace(data);
        var ele = $E("operate_list_content");
        var select_value = $E("cate_select_options").value;
        ele.innerHTML = "";
        if (!data) {
            if (select_value == "0" && this.tipType != "all") {
                this.setTip("all");
            }
            if (select_value != "0" && this.tipType != "cate") {
                this.setTip("cate");
            }
            
            $E("operate_list_none").style.display = "block";
            return;
        }
        $E("operate_list_none").style.display = "none";
        var len = data.length;
        var __addEvent = Core.Events.addEvent;
        var __addHTML  = Core.Dom.addHTML;
        var __click    = Core.Events.click;
        var clickCount = 0;
        for (var i = 0; i < len; i++) {
            data[i] = this.formatData(data[i]);
            //是否选中
            if (Core.Array.findit(this.select, data[i].i) != -1) {
                data[i].selected = "checked";
            }
            else {
                data[i].selected = "";
            }
            var template = '<li><input #{selected} type="checkbox" id="Chb_#{i}"/>\
	            <label>#{r}#{w}\
					<a target="_blank" href="http://blog.sina.com.cn/s/blog_#{i}.html">#{t}</a>\
					#{m}#{p}#{v}\
				</label>\
	            <span>#{d}</span>\
			</li>';
            var temp = new Ui.Template(template);
            __addHTML(ele, temp.evaluate(data[i]));
            if (!this.articleList[data[i].i]) {
                this.articleList[data[i].i] = data[i];
            }
            __addEvent($E("Chb_" + data[i].i), this.selectArticle.bind2(this), "click");
            if ((clickCount < 5) && (1 === this.loadDataCount)) {
                __click($E("Chb_" + data[i].i));
                clickCount ++ ;
            }
        }
    },
    /**
     * 初始化hidstoryData、并根据historyData初始化select、articleList;
     * @param {Object} data
     */
    history: function(data){
        this.historyData = data || [];
        this.select = [];
        var len = this.historyData.length;
        for (var i = 0; i < len; i++) {
            this.select.push(this.historyData[i].i);
            this.articleList[this.historyData[i].i] = this.formatData(this.historyData[i]);
        }
        this.swapShowView();
    },
    setTip: function(type){
        var type = type || "cate";
        var ele = $E("operate_list_none");
        switch (type) {
            case "cate":
                ele.innerHTML = $SYSMSG["B79007"];
                break;
            case "all":
                ele.innerHTML = $SYSMSG["B79008"];
                break;
        }
        this.tipType = type;
    },
    swapShowType: function(){
        var ele = Core.Events.getEventTarget();
        trace(ele.value);
        if (ele.value != this.showType) {
            this.showType = ele.value;
            this.swapShowView();
            this.articleList = {};
            this.select = [];
            this.setNumTip();
            this.loadData();
        }
    },
    swapShowView: function(){
        if (this.showType == "txt") {
            $E("operate_img_list").parentNode.style.display = "none";
            $E("operate_list").style.display = "";
			 $E("assoc_style").value = 1;
        }
        else {
            $E("operate_list").style.display = "none";
            $E("operate_img_list").parentNode.style.display = "";
			$E("assoc_style").value = 0;
        }
		$E("showType_select_options").value=this.showType;
    },
    /**
     * 初始化html
     */
    initHtml: function(){
        var html = '\
			<div class="Actit" id="operate_select">\
			  <div class="fL">请选择要添加的文章：</div>\
			   <div class="fR">\
			   	<span id="showType_container" style="display:none">\
					<span>展现方式：</span>\
				    <select id="showType_select_options">\
						<option value="img" selected="selected">图片</option>\
						<option value="txt">文字</option>\
				    </select>\
				</span>\
			 <span>分类：</span>\
			    <select id="cate_select_options">\
			    </select>\
				 <select id="img_cate_select_options" style="display:none">\
			    </select>\
			  </div>\
			</div>\
			<div style="display: none;" class="Actit Actit1" id="view_operate">\
			  <div class="fL">我的更多文章： <a href="javascript:;" onclick="return false" class="CP_a_fuc">[<cite id="modify">修改</cite>]</a><!-- <a href="javascript:;" onclick="return false"  class="CP_a_fuc">[<cite id="delete">删除</cite>]</a>--></div>\
			</div>\
			<div class="AcInfo" id="operate_list">\
			  <div class="AcInfoBg">\
			    <div style="" class="chooseCurr" id="operate_list_o">\
			      <ul id="operate_list_content"></ul>\
			    </div>\
			    <div style="display: none;" class="nodate SG_txtb" id="operate_list_loading">\
			      <div class="loading"><img title="加载中" src="http://simg.sinajs.cn/blog7style/images/common/loading.gif"/><br/>\
			        读取中…</div>\
			    </div>\
				<div style="display:none;" class="nodate SG_txtb" id="operate_list_none">\
					<strong>此分类尚无博文，请选择其他分类</strong>\
			    </div>\
			    </div>\
			  </div>\
			   <div class="myPhotoblog" style="display:none"><div class="myPhotoblog_list" id="operate_img_list"></div>\
			   <div class="myPhotoblog_help">\
                          	<p><strong>帮助：</strong></p>\
                            <p class="SG_dot">以图片方式添加博文，是我们为VIP用户提供的特殊服务。</p>\
                            <p class="SG_dot">系统默认您博文中的第一张图片为该博文的“封面”。</p>\
                            <p class="SG_dot">点击“换封面”可以为您的封面换一张图。</p>\
                            <p class="SG_dot">您只能对新浪域下的图片进行此项设置。</p>\
                          </div>\
			   </div>\
			  <div style="display: none;" id="operate_list_view" class="chooseOk">\
			    <ul id="operate_list_view_ul"></ul>\
			  </div>\
			  <div class="myPhotoblog" style="display:none"><div class="myPhotoblog_list" id="operate_img_list_view"></div></div>\
			  <div class="noteInfo" id="operate_info">\
			    <div class="fL"><span class="SG_txtc">已选<span id="num_s">0</span>篇，还可以选<span id="num_l">10</span>篇 </span><a style="display:none" id="unselect_container" href="javascript:;" onclick="return false"  class="CP_a_fuc">[<cite id="unselect">重选</cite>]</a></div>\
			    <div class="fR" id="article_page"></div>\
			  </div>\
			</div>\
			<div class="AcInfoBtn" id="add_container"><a href="javascript:;"   onclick="return false" class="SG_aBtn SG_aBtn_dis"><cite id="article_add">添加</cite></a></div>';
        $E(this.containerId).innerHTML = html;
    }
};

/**
 * 时间比较函数
 * @param {Object} beginTime
 * @param {Object} endTime
 *  @author zh.li
 */
function comptime(beginTime, endTime){

    var beginTimes = beginTime.substring(0, 10).split('-');
    var endTimes = endTime.substring(0, 10).split('-');
    
    beginTime = beginTimes[1] + '/' + beginTimes[2] + '/' + beginTimes[0] + ' ' + beginTime.substring(10, 19);
    endTime = endTimes[1] + '/' + endTimes[2] + '/' + endTimes[0] + ' ' + endTime.substring(10, 19);
    
    //trace(beginTime);
    //trace(Date.parse(endTime) + "");
    
    var a = (Date.parse(endTime) - Date.parse(beginTime)) / 3600 / 1000;
    
    if (a < 0) {
        return 'bigger';
    }
    else 
        if (a > 0) {
            return 'smaller';
        }
        else 
            if (a == 0) {
                return 'equal';
            }
            else {
                return 'exception'
            }
    
}
