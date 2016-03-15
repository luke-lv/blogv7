/**
 * @fileoverview 组件设置页签
 * @author xinyu@staff.sina.com.cn
 * @date 2009-08-10
 */
$import("pageSet/tabs.js");
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/stopBubble.js");
$import("sina/core/events/fixEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/function/bind2.js");
$import("sina/core/function/bind3.js");
$import("sina/core/dom/insertHTML.js");
$import("sina/core/system/br.js");
$import("sina/core/string/a2u.js");
$import("sina/core/string/j2o.js");
$import("sina/core/array/findit.js");
$import("sina/core/array/ArrayWithout.js");
$import("sina/core/dom/getTop.js");
$import("sina/core/dom/getLeft.js");
$import("sina/ui/tween.js");
$import("lib/interface.js");
$import("pageSet/componentsClickEvent.js");

var modulesTab = Core.Class.create();

modulesTab.prototype = {

    initialize: function(obj){
        this.obj = obj;
        this.loadData();
    },
    loadData: function(){
        var _default = new Interface("http://control.blog.sina.com.cn/riaapi/sys_module/get_sysmodule.php", "jsload");
        _default.request({
            GET: {
                "uid": scope.$uid,
                "productid": "0x00000001"
            },
            onSuccess: function(data){
                for (var i = 1; i < 5; i++) 
                    __pageSetOrginal["componentsdata_" + i] = __pageSetVar["componentsdata_" + i] = [];
                if (data != "") {
                    __pageSetVar.originalComponentsData = data;
                    var _data = data;//Core.String.j2o(data);
                    for (var key in _data) {
                        if (_data[key] == null || _data[key].mod_order == "") {
                            continue;
                        }
                        _data[key].cid = key;
                        if (!_data[key].ria_title||((scope.isAdshare == "true" ||scope.isCompany=='true')&& key=='901')) 
                            continue;
                        _data[key].name = Core.String.a2u(_data[key].ria_title);
                        //trace(key+":"+_data[key].name + ";" + _data[key].mod_type + ";");
                        __pageSetVar["componentsdata_" + _data[key].mod_type].push(_data[key]);
                        
                    }
                    for (var i = 1; i < 5; i++) {
                        __pageSetVar["componentsdata_" + i] = __pageSetVar["componentsdata_" + i].sort(function(a, b){
                            return parseInt(a.mod_order) - parseInt(b.mod_order);
                        });
                    }
                    this.createTabs(this.obj);
                }
            }
.bind2(this)            ,
            onError: function(){
            
            }
            
        });
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
        var tempobj = {
            "1": "基础组件",
            "2": "娱乐组件",
            "4": "活动组件",
            "3": "专业组件"
        };
        for (var k in tempobj) {
            var op = {
                className: "cur",
                onabort: Core.Function.bind3(_this.hiddenTag, _this, [k]),
                onfocus: Core.Function.bind3(_this.showTag, _this, [k])
            };
            if (k == "1") {
                op.isFocus = true;
            }
			this.initItems(k);
            var title = '<a href="#" onclick="return false;">' + tempobj[k] + '</a>';
            this[k + "_tab"] = new Tab2(title, op);
            tabs.add(this[k + "_tab"]);
        }
        
    },
    /**
     * 初始化
     * @param {Object} id
     */
    initItems: function(id){
        var _this = this;
        var items = $E('moduleSetting_' + id + '_tab');
        if (!items) {
            var div = $C('div');
            div.id = 'moduleSetting_' + id + '_tab';
            div.className = "moduleSeltor";
            $E('moduleSetting').insertBefore(div, $E('moduleReview'));
            
			var ul = $C('ul');
			div.appendChild(ul);
			var ul2 = $E('hotListUl');
			if(!ul2) {
				ul2=$C('ul');
				ul2.id = 'hotListUl';
			}
			var hotcount=0;

            for (var i = 0; i < __pageSetVar["componentsdata_" + id].length; i++) {
            
                var isHave = Core.Array.findit(__pageSetVar.component_list, __pageSetVar["componentsdata_" + id][i].cid);
                //trace(__pageSetVar["componentsdata_" + id][i].cid + ";" + isHave);
                var li = $C('li');
                var checked = "";
                if(isHave > -1){
                    li.className = "checked";
                    checked = "checked";
                }
                

                //鼠标移动上去以及离开的效果-----------------------------------------------------------------------------
                Core.Events.addEvent(li, Core.Function.bind3(_this.previewEvent, _this, [id, i]), 'mouseover');
                Core.Events.addEvent(li, function(){
                    $E('previewModuleImg').src = "http://simg.sinajs.cn/blog7style/images/blog/components/0.gif";
                    $E('previewModuleText').innerHTML = "勾选左侧模块，并且可以通过拖动来改变模块位置。保存后模块即可显示在你的首页中。";
                }, 'mouseout');
                //--------------------------------------------------------------------------------------------------
				if(__pageSetVar["componentsdata_" + id][i].is_hot==1){
					var copyli=$C('li'), _cid = __pageSetVar["componentsdata_" + id][i].cid;
					if( _cid=='123' || _cid=='10010'){//10010 关注博主组件，加"新"
                        copyli.innerHTML='<input type="checkbox" ' + checked + ' value="' + _cid + '" id="components_9_'+ _cid + '" onclick="clickComponentsEvent(this, ' + _cid + ',\'' + __pageSetVar["componentsdata_" + id][i].ria_title + '\','+id+')"/><label style="color:red;" for="components_9_' + _cid + '">' + __pageSetVar["componentsdata_" + id][i].ria_title + '<img width="15" height="15" align="top" title="新" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon11" /></label>';
                    }else if( _cid=='113' ){
                        copyli.innerHTML='<input type="checkbox" ' + checked + ' value="' + _cid + '" id="components_9_'+ _cid + '" onclick="clickComponentsEvent(this, ' + _cid + ',\'' + __pageSetVar["componentsdata_" + id][i].ria_title + '\','+id+')"/><label for="components_1_' + _cid + '">' + __pageSetVar["componentsdata_" + id][i].ria_title + '</label>';
                    }else{
                        copyli.innerHTML='<input type="checkbox" ' + checked + ' value="' + _cid + '" id="components_9_'+ _cid + '" onclick="clickComponentsEvent(this, ' + _cid + ',\'' + __pageSetVar["componentsdata_" + id][i].ria_title + '\','+id+')"/><label style="color:red;" for="components_1_' + _cid + '">' + __pageSetVar["componentsdata_" + id][i].ria_title + '</label>';
                    }
					
					//鼠标移动上去以及离开的效果-----------------------------------------------------------------------------
					Core.Events.addEvent(copyli, Core.Function.bind3(_this.previewEvent, _this, [id, i]), 'mouseover');
	                Core.Events.addEvent(copyli, function(){
	                    $E('previewModuleImg').src = "http://simg.sinajs.cn/blog7style/images/blog/components/0.gif";
	                    $E('previewModuleText').innerHTML = "勾选左侧模块，并且可以通过拖动来改变模块位置。保存后模块即可显示在你的首页中。";
	                }, 'mouseout');
	                //--------------------------------------------------------------------------------------------------
				
					//说明是热门推荐组件
					var hotList = $E('h6_hotList');
					if(!hotList) {
						var h6=$C('h6');
						h6.id='h6_hotList';
						h6.innerHTML='热门推荐';
						$E('moduleSetting_1_tab').appendChild(h6);
						ul2.appendChild(copyli);
					} else {
						ul2.appendChild(copyli);
					}
					hotcount++;
				}else {
                    //音乐播放器组件
                    var musicli = 'components_2_8';
                    var curli = 'components_' + id + '_' +__pageSetVar["componentsdata_" + id][i].cid;
                    if(curli === musicli) {
                        if(!checked) {
                            li.innerHTML = '<input type="checkbox" disabled' + ' value="' + __pageSetVar["componentsdata_" + id][i].cid + '" id="components_' +id+'_'+ __pageSetVar["componentsdata_" + id][i].cid + '" onclick="clickComponentsEvent(this, ' + __pageSetVar["componentsdata_" + id][i].cid + ',\'' + __pageSetVar["componentsdata_" + id][i].ria_title + '\','+id+')"/><label style="color:#ccc;" for="components_' +id+'_'+ __pageSetVar["componentsdata_" + id][i].cid + '">' + __pageSetVar["componentsdata_" + id][i].ria_title + '</label><a target="_blank" style="margin-left:15px;" href="http://blog.sina.com.cn/s/blog_4b0f52990102dzu6.html">产品服务更新升级中，暂停使用</a>';
                        }else {
                    li.innerHTML = '<input type="checkbox" ' + checked + ' value="' + __pageSetVar["componentsdata_" + id][i].cid + '" id="components_' +id+'_'+ __pageSetVar["componentsdata_" + id][i].cid + '" onclick="clickComponentsEvent(this, ' + __pageSetVar["componentsdata_" + id][i].cid + ',\'' + __pageSetVar["componentsdata_" + id][i].ria_title + '\','+id+')"/><label for="components_' +id+'_'+ __pageSetVar["componentsdata_" + id][i].cid + '">' + __pageSetVar["componentsdata_" + id][i].ria_title + '</label>';
                        }
                    }else {
                        li.innerHTML = '<input type="checkbox" ' + checked + ' value="' + __pageSetVar["componentsdata_" + id][i].cid + '" id="components_' +id+'_'+ __pageSetVar["componentsdata_" + id][i].cid + '" onclick="clickComponentsEvent(this, ' + __pageSetVar["componentsdata_" + id][i].cid + ',\'' + __pageSetVar["componentsdata_" + id][i].ria_title + '\','+id+')"/><label for="components_' +id+'_'+ __pageSetVar["componentsdata_" + id][i].cid + '">' + __pageSetVar["componentsdata_" + id][i].ria_title + '</label>';
                    }
                    ul.appendChild(li);
                }
				if(__pageSetVar["componentsdata_" + id][i].cid == "10007"){
					li.innerHTML = '<input type="checkbox" ' + checked + ' value="' + __pageSetVar["componentsdata_" + id][i].cid + '" id="components_' +id+'_'+ __pageSetVar["componentsdata_" + id][i].cid + '" onclick="clickComponentsEvent(this, ' + __pageSetVar["componentsdata_" + id][i].cid + ',\'' + __pageSetVar["componentsdata_" + id][i].ria_title + '\','+id+')"/><label style="color:red" for="components_' +id+'_'+ __pageSetVar["componentsdata_" + id][i].cid + '">' + __pageSetVar["componentsdata_" + id][i].ria_title + '</label>';
				}
				
            }
			
			if(hotcount>0){
				//热门推荐存在的时候
				$E('moduleSetting_1_tab').appendChild(ul2);
			}
            
            
            
        }
    },
    /**
     * 点击事件
     * @param {Object} li
     * @param {Object} moduleid
     */
    clickEvent: function(li, moduleid){
    
        Core.Events.stopBubble();
        
        var isHave = Core.Array.findit(__pageSetVar.component_list, moduleid);
        //trace("click=" + moduleid + ";isHave=" + isHave + ";$E('components_'+moduleid).checked=" + $E('components_' + moduleid).checked);
        if (isHave > -1) {
            li.className = "";
            __pageSetVar.component_list = __pageSetVar.component_list.slice(0, isHave).concat(__pageSetVar.component_list.slice(isHave + 1, __pageSetVar.component_list.length));
            $E('components_' + moduleid).checked = false;
            //trace("isHave>-1时:" + __pageSetVar.component_list.join());
        }
        else {
            __pageSetVar.component_list.push(moduleid);
            li.className = "checked";
            $E('components_' + moduleid).checked = true;
            //trace("isHave=-1时:" + __pageSetVar.component_list.join());
        }
        
    },
    /**
     * 预览事件
     * @param {Object} id
     * @param {Object} i
     */
    previewEvent: function(id, i){
        $E('previewModuleImg').src = __pageSetVar["componentsdata_" + id][i].ria_icon;
        $E('previewModuleText').innerHTML = __pageSetVar["componentsdata_" + id][i].ria_desc;
    },
    /**
     * 模板分类之间切换，某个模板分类的隐藏。
     * @param {String} id 模板分类号
     */
    hiddenTag: function(id){
        var items = $E('moduleSetting_' + id + '_tab');
        if (items) {
            items.style.display = "none";
        }
        
    },
    /**
     * 模板分类之间切换，某个模板分类的显示。
     * @param {String} id 模板分类号
     */
    showTag: function(id){
        var items = $E('moduleSetting_' + id + '_tab');
        if (!items) {
            this.initItems(id);
            items = $E('moduleSetting_' + id + '_tab');
        }
        
        items.style.display = "block";
        
    },
    showTabs: function(id){
        this[id + "_tab"].setFocus();
    }

};
