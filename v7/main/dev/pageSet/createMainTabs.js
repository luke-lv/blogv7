/**
 * @fileoverview 建立主要的那些tabs
 * @author xinyu@staff.sina.com.cn
 * 
 */
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/function/bind2.js");
$import("sina/core/function/bind3.js");
$import("sina/core/dom/insertHTML.js");
$import('sina/core/system/getParam.js');

$import("lib/sendLog.js");

$import("pageSet/tabs.js");
$import("pageSet/customStyle.js");
$import("pageSet/theme.js");
$import("pageSet/setFormat.js");
$import("pageSet/components.js");
$import("pageSet/customComponents.js");
$import("pageSet/initialVars.js");
$import("pageSet/singleFunc/funcSave.js");
$import("pageSet/singleFunc/funcCancel.js");
//$import("pageSet/singleFunc/funcSetToGuide.js");//快速装饰博客下线  wujian 2010-8-31
$import("pageSet/singleFunc/funcRepire.js");

var mainTabs=Core.Class.create();
mainTabs.prototype={
	initialize: function(obj){
		var abctest=1;
		this.createTabs(obj);
	},
	hiddenContent: function (arr){
		for(i = 0;i < arr.length; i ++){
			  $E(arr[i]).style.display = "none";
		}
      
    },
	showContent:  function (arr){
		for(i = 0;i < arr.length; i ++){
			  $E(arr[i]).style.display = "block";
		}
    },
	createTabs:function(obj){
		this.tabs = new Tabs2(obj, {});
		//风格设置------------------------------------------
		this.styleSettingTab=new Tab2("<span>风格设置</span>", {
			isFocus: true,
	        className: "cur",
	        onabort: Core.Function.bind3(this.hiddenContent, this, [["styleSetting"]]),
	        onfocus: Core.Function.bind3(this.showContent, this, [["styleSetting"]])
	    });
	    this.tabs.add(this.styleSettingTab);
		
		__pageSetVar.tabs=[];
		__pageSetVar.tabs[0]=new themeTabs($E('styleSettingTabUl'));//初始化时就有“风格设置”的页签
		//-----------------------------------------------------------------
		
		
		//自定义风格-------------------------------------------------------------
		var customStyleSettingTab=new Tab2("<span>自定义风格</span>", {
			isFocus: false,
	        className: "cur",
	        onabort: Core.Function.bind3(this.hiddenContent, this, [["customStyleSetting"]]),
	        onfocus: Core.Function.bind3(this.showContent, this, [["customStyleSetting"]])
	    });
	    this.tabs.add(customStyleSettingTab);
		customStyleSettingTab.addOnFocus(function(){
			if(!__pageSetVar.tabs[1]){
				__pageSetVar.tabs[1] = new customStyleSettingTabs($E('customStyleUl'));
			}
			v7sendLog('13_01_02');
		});
		
		//-------------------------------------------------------------------------
		
		//版式设置--------------------------------------------------------------------
		var formsetSettingTab=new Tab2("<span>版式设置</span>", {
			isFocus: false,
	        className: "cur",
	        onabort: Core.Function.bind3(this.hiddenContent, this, [["formsetSetting"]]),
	        onfocus: Core.Function.bind3(this.showContent, this, [["formsetSetting"]])
	    });
	    this.tabs.add(formsetSettingTab);
		formsetSettingTab.addOnFocus(function(){
			if(!__pageSetVar.tabs[2])
				__pageSetVar.tabs[2] = new setFormat();
			v7sendLog('13_01_03');
		});
		//----------------------------------------------------------------------------
		
		//组件设置--------------------------------------------------------------------
		this.componentTab=new Tab2("<span>组件设置</span>", {
			isFocus: false,
	        className: "cur",
	        onabort: Core.Function.bind3(this.hiddenContent, this, [["moduleSetting"]]),
	        onfocus: Core.Function.bind3(this.showContent, this, [["moduleSetting"]])
	    });
	    this.tabs.add(this.componentTab);
		this.componentTab.addOnFocus(function(){
			if(!__pageSetVar.tabs[3])
				__pageSetVar.tabs[3] = new modulesTab($E('moduleSettingVtabs'));
			v7sendLog('13_01_04');
		});
		//----------------------------------------------------------------------------
		//style="position:relative; padding-right:25px"<img height="15" style="position:absolute;top:3px;right:7px" width="15" title="新" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon11">
		//自定义组件设置--------------------------------------------------------------------
		var customComponentsTab=new Tab2('<span>自定义组件</span>', {			isFocus: false,
	        className: "cur",
	        onabort: Core.Function.bind3(this.hiddenContent, this, [["customModule"]]),
	        onfocus: Core.Function.bind3(this.showContent, this, [["customModule"]])
	    });
	    this.tabs.add(customComponentsTab);
		customComponentsTab.addOnFocus(function(){
			if(!__pageSetVar.tabs[4])
			__pageSetVar.tabs[4] = new customComponents();
			v7sendLog('13_01_05');
		});
		//----------------------------------------------------------------------------
		
		funcChangeFormat.addNoneDiv();
		
		Core.Events.addEvent($E('savaPageSet'),funcSave,'click');
		Core.Events.addEvent($E('cancelPageSet'),funcCancel,'click');
		//快速装饰博客下线  wujian 2010-8-31
		//if ($E('settoguide')) {
		//	Core.Events.addEvent($E('settoguide'), SetToGuide, 'click');
		//}

		var hiddendiv = $E('hiddendiv');
        if (!hiddendiv) {
            hiddendiv = $C('div');
			hiddendiv.id='hiddendiv';
            hiddendiv.style.display = "none";
            document.body.appendChild(hiddendiv);
        }

        //默认显示哪个tab，后续需要加的话请在这里加if判断就行 liming9@2012年10月24日
        var showtab = Core.System.getParam('showtab');
        if( showtab==3 ){
            this.tabs.swapTags(this.componentTab);
        }

	},
	/**
	 * 返回当前的tabs
	 */
	getTabs:function(){
		return this.tabs;
	}
};




