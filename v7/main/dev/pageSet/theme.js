/**  
 * @fileoverview 风格设置的页签
 * @author xinyu@staff.sina.com.cn
 *
 */
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/fixEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/function/bind2.js");
$import("sina/core/function/bind3.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/core/system/br.js");
$import("lib/insertMoban.js");
$import("msg/themeMSG.js");
$import("pageSet/tabs.js");
$import("pageSet/singleFunc/funcChangeTheme.js");
$import("pageSet/singleFunc/funcCustomStyle.js");

var themeTabs = Core.Class.create();
themeTabs.prototype = {
	_eventDispatcher:{
		events:{},
		dispatch:function(eventName){
			var k,
				me=this,
				arg=Array.prototype.slice.call(arguments),
				c=10;
				
			arg.shift();

			(function _dip(){
				if (me.events[eventName]) {
					me.events[eventName].apply(this, arg);
				}else {
					c-- > 0 &&
					setTimeout(_dip, 500);
				}
			})();
		}
	},
	
    initialize: function(obj){
    	var tplInfo = this.parseQueryString(window.location.search);
    	this._tplNum = tplInfo.tplnum;
    	this._tplType = tplInfo.tpltype;
    	this._pageSrc = tplInfo.refer;
        this.createTabs(obj);
    },
    parseQueryString: function(data){
	   var params = {};
	   var arr = data.split("&");
	   for(var i=0, l=arr.length; i<l; i++){
		   var a = arr[i].split("=");
		   params[a[0]] = a[1];
	   }
	   return params;
	},
    hiddenContent: function(arr){
        for (i = 0; i < arr.length; i++) {
            $E(arr[i]).style.display = "none";
        }
        
    },
    showContent: function(arr){
        for (i = 0; i < arr.length; i++) {
            $E(arr[i]).style.display = "block";
        }
    },
    createTabs: function(obj){
        var _this = this;
        var tabs = new Tabs2(obj, {});
        var initflag = false;
        var firstop = 0;
        /*
	        modified xiaoyue3@staff
	        下线模版用户点击公告里的立即更换到指定分类下的具体模版
	        多加了一个判断条件，如果下线此段代码，直接使用else里的内容，
	        if里条件直接注掉
        */
		if(_this._tplType || _this._tplType === '0'){
			firstop=_this._tplType;
		}else{
			//此段代码被挪到if条件里，原来在if条件外面，并且没有if条件 modified xiaoyue3@staff
			for (var k in scope.theme_cnf) {//首先看看用户模板在那个分类中，如果下线了，则初始化最新推荐
	           // if (k == __pageSetVar.selectedTpl.split('_')[0]) {
	                if (Core.Array.findit(scope.theme_cnf[k].data, __pageSetVar.selectedTpl) > -1) {
	                    initflag = true;
						firstop=k;
						break;
	                }
	           // }
	        }
		}
		for (k in scope.theme_cnf) {//加入各个tab
            var op = {
                className: "cur",//k==0?"fir cur":"cur",
                onabort: Core.Function.bind3(_this.hiddenTag, _this, [k]),
                onfocus: Core.Function.bind3(_this.showTag, _this, [k])
            };
            if (firstop == k) {
                    op.isFocus = true;
                    this.initItems(k);
            }

            var title = '<a href="#" onclick="return false;">' + scope.theme_cnf[k].name + '</a>';
            
            this[k + "_tab"] = new Tab2(title, op);
            tabs.add(this[k + "_tab"]);
			if ($IE6) {
				$T($E('styleSettingTabUl'), 'li')[0].style.backgroundImage = "none";
			}
        }
        //渲染推荐模板
        this.renderPushTpl();
    },
    /**
     * 推荐模板
     */
    renderPushTpl: function(){
        var tpl = '<p><strong>推荐模板</strong></p>\
                    <p><a id="pushTemplate" href="#" onclick="return false"><img src="{0}" alt=""></a></p>\
                    <p class="SG_txtb">{1}</p>';
        $E('styleSetting_r').innerHTML = tpl.format(scope.pushTpl_conf.picurl, scope.pushTpl_conf.text);
        Core.Events.addEvent($E('pushTemplate'), Core.Function.bind3(this.bgEvent, this, [$E('pushTemplate'), scope.pushTpl_conf.data]), 'click');
    },
    /**
     * 初始化某个模板分类
     * @param {Object} id
     */
    initItems: function(id){
        var _this = this;
        var items = $E('stylesetting_' + id + '_tab');
        if (!items) {
            var div = $C('div');
            div.id = 'stylesetting_' + id + '_tab';
            div.className = "styleSelector";
            $T($E('styleSetting'), 'div')[0].insertBefore(div, $E('styleSettingEnd'));
            var ul = $C('ul');
            //trace("scope.theme_cnf[id].data.length=" + scope.theme_cnf[id].data.length);
            for (var i = 0; i < scope.theme_cnf[id].data.length; i++) {
                var li = $C('li');
				if (id == 0) {//最新推荐处多加一个标识，好进行样式选择，否则id一样，不知道选哪个了。
					li.id = "theme|" + id + "|" + scope.theme_cnf[id].data[i];
				}
				else {
					li.id = "theme|" + scope.theme_cnf[id].data[i];
				}
                li.innerHTML = '<div class="frame"><a title="' + scope.theme_cnf[id].names[i] + '" href="javascript:;" onclick="return false;"><img class="thumb" alt="' + scope.theme_cnf[id].names[i] + '" src="http://simg.sinajs.cn/blog7newtpl/css/'+scope.theme_cnf[id].data[i].split('_')[0]+'/'+scope.theme_cnf[id].data[i]+'/thumb.jpg"/></a><img alt="" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="selectedIco SG_icon SG_icon106" width="18" height="18"/></div><p>' + scope.theme_cnf[id].names[i] + '</p>';
           		//指定分类下的某一套模版
                if(_this._tplNum){
                	__pageSetVar.selectedTpl = _this._tplNum;
                	__pageSetVar.pageSetSrc = _this._pageSrc;
                }
                if (scope.theme_cnf[id].data[i] ==__pageSetVar.selectedTpl) {
                    li.className = "selected";
                    dwThemeCss(__pageSetVar.selectedTpl,'theme');
                }

                Core.Events.addEvent(li, Core.Function.bind3(_this.bgEvent, _this, [li, scope.theme_cnf[id].data[i]]), 'click');
                ul.appendChild(li);
            }
            div.appendChild(ul);
        }
    },
    /**
     * 模板分类之间切换，某个模板分类的隐藏。
     * @param {String} id 模板分类号
     */
    hiddenTag: function(id){
        var items = $E('stylesetting_' + id + '_tab');
        if (items) {
            items.style.display = "none";
        }
    },
    /**
     * 模板分类之间切换，某个模板分类的显示。
     * @param {String} id 模板分类号
     */
    showTag: function(id){
        var items = $E('stylesetting_' + id + '_tab');
        if (!items) {
            this.initItems(id);
            items = $E('stylesetting_' + id + '_tab');
        }
        
        items.style.display = "block";
    },
    showTabs: function(id){
        this[id + "_tab"].setFocus();
    },
    /**
     * 点击某个图片后产生的背景变化事件
     * @param {Object} li 点击的li
     * @param {Object} id 被点击的li所代表的背景图
     */
    bgEvent: function(li, id){
        if (id == __pageSetVar.selectedTpl) {
//            this.setSelect(__pageSetVar.selectedTpl, 'selected');
            return;
        }
		//trace('选择的模板的id='+id);
        __pageSetVar.tempid=id;
        if (Core.Array.findit(scope.overdue_theme_cnf, __pageSetVar.selectedTpl) > -1) {
            winDialog.confirm("你目前使用的商业模板已经过期，如果更换将无法恢复。是否更换？", {
                funcOk: function(){
                	this.changeBg();
                }.bind2(this)
            });
        }else{
			this.changeBg();
		}
        
    },
	/**
	 * 背景变化
	 */
    changeBg: function(){
		
        if (__pageSetVar.selectedTpl != "") {
            this.setSelect(__pageSetVar.selectedTpl, '');
        }
        __pageSetVar.selectedTpl = __pageSetVar.tempid;
		
		
		//这砣代码被移上来了
		if(__pageSetVar.selectedTpl.split('_')[0]=='13'||$_GLOBAL.flashtemplate[__pageSetVar.selectedTpl]){//动感模板特殊处理
			//插入动感模板
			Lib.insertMobanFunc(__pageSetVar.selectedTpl);
		}else{
			var headflash=$E('headflash');
			if (headflash) {
				headflash.innerHTML='';
				headflash.style.display="none";
			}
		}

		this._eventDispatcher.dispatch("BGChanged",__pageSetVar.selectedTpl);

        
        this.setSelect(__pageSetVar.selectedTpl, 'selected');
        for (var i = 2; i < 5; i++) {
            __pageSetVar["customPic_" + i].apply = '0';
            __pageSetVar.funcNoUsePic(i + '');
        }
		
        dwThemeCss(__pageSetVar.selectedTpl,'theme');
		//博客标题位置、导航位置使用默认
		$E('blogTitle').style.cssText='';
		$E('blognav').style.cssText='';
		scope.$setTitleDragable();
		
		/*您现在看到的这行注释所在的位置，以前是插入动感模板的那砣代码，现在移到上面去了一点点*/
		
		//针对自定义部分处理-----------------------------------------
			for(var i=2;i<5;i++){
				var items = $E('customstylesetting_' + i + '_tab');
				var items2= $E('customstylesetting_' + i+ '_tab_nouse');
		        if (items) {
					items2.style.display='none';
		            items.style.display = "none";
		        }
				__pageSetVar.tabs[1][i+"_tab"].setAbort();
		}
		if($E('customTips'))$E('customTips').style.display = "none";
		__pageSetVar.tabs[1]["1_tab"].setFocus();
		__pageSetVar.tabs[1].showTag(1);
		//------------------------------------------------------------
		
        //modified xiaoyue3 下线10_41  信科比此套模版绑定的组件

		// if(Core.Array.findit(scope.bussiness_conf,__pageSetVar.selectedTpl)>-1){
		// 	//trace('选中的模板绑定了商业化组件');
		// 	 winDialog.confirm($SYSMSG.B90002, {
  //               funcOk: function(){
  //               	window.maintabs.componentTab.setFocus();
		// 			window.maintabs.styleSettingTab.setAbort();
  //               },
		// 		textOk:'是',
		// 		textCancel:'否'
  //           });
		// }

		
		
		//----------------------------------------------------------------------------------------------------------
		//育儿模板 提示 用户 选择 组件  meichun1@staff.sina.com.cn	 14:19 2010/8/20	 {
		//----------------------------------------------------------------------------------------------------------
		
		if (Core.Array.findit(scope.babyTpl_conf, __pageSetVar.selectedTpl) > -1 ) {
				var _arr = __pageSetVar.component_list,
				findit = Core.Array.findit,
		
				/*3个组件只要有一个不存在 就提示用户 有配套组件*/
				needAdd116 = findit(_arr, 116) == -1,
				needAdd115 = findit(_arr, 115) == -1,
				needAdd114 = findit(_arr, 114) == -1,
		
				needAdd = needAdd116 || needAdd115 || needAdd114;
		
				needAdd && winDialog.confirm($SYSMSG.B90002, {
						funcOk: function() {
								needAdd116 && addComp(116, "育儿要闻", 1);
								needAdd115 && addComp(115, "实用工具", 1);
								needAdd114 && addComp(114, "宝宝资料", 1);
						},
						textOk: '是',
						textCancel: '否'
				});
		}
		//----------------------------------------------------------------------------------------------------------
		//  }
		//----------------------------------------------------------------------------------------------------------
		
		
		if(__pageSetVar.selectedTpl.indexOf("18_")>-1&&Core.Array.findit(__pageSetVar.component_list,"98")==-1){
			//trace('选中的模板绑定了商业化组件');
			
			 window.addComp("98","315行业关注度调查",1);
		}
		
		if (Core.Array.findit(scope.blog365Tpl_conf, __pageSetVar.selectedTpl) > -1){//判断是否使用的365模版，若是，提醒增加365组件
			var 	_arr = __pageSetVar.component_list,
					findit = Core.Array.findit,
					needAdd365 = findit(_arr, 365);
					
					needAdd365 && winDialog.confirm($SYSMSG.B90002, {
						funcOk: function(){
							needAdd365 && addComp(365, "365", 1);
						},
						textOk: '是',
						textCancel: '否'
					});
		}
		
		__pageSetVar.tempid=null;
    },
    /**
     * 根据传入的id以及样式名，修改对应的模板、色系的选择样式
     * @param {Object} id
     * @param {Object} classname
     */
    setSelect: function(id, classname){
        if ($E('color|' + id)) {
			$E('color|' + id).className = classname;
		}
        if ($E('theme|0|' + id)) {
			$E('theme|0|' + id).className = classname;
		}
		if ($E('theme|'+ id)) {
			$E('theme|'+ id).className = classname;
		}
    },
	
	addEventListener:function(eventName,handle){
		this._eventDispatcher.events[eventName]=handle;
	}
};


