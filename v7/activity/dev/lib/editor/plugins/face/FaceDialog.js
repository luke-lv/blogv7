/**
 * Copyright (c) 2010, Sina Inc. All rights reserved.
 * @fileoverview 插入表情浮层
 * @author dg.liu | dongguang@staff.sina.com.cn
 */
$import("lib/editor/plugins/plugins.js");
$import("sina/core/class/create.js");
$import("lib/editor/plugins/face/FacePage.js");

Editor.Plugins.FaceDialog = Core.Class.create();

Editor.Plugins.FaceDialog.prototype = {
	initialize: function(){
		this.initDialog();
		this.initTab();
		this.renderAllList();
		
    },
	/**
	 * 初始化所有表情列表
	 */
	renderAllList: function(){
		//没有分页的
		scope.faceOperate.renderList($E(scope.faceOperate.hot_container),"high");
		scope.faceOperate.renderList($E(scope.faceOperate.hot_in_container),"iny","name");
		
		//有分页的
		var mh_page=new Editor.Plugins.FacePage($E(scope.faceOperate.high_page_container),scope.faceOperate.getData("morehigh").data.length,scope.faceOperate.highpage,this.randerMoreHighList.bind2(this));
		var mhi_page=new Editor.Plugins.FacePage($E(scope.faceOperate.in_page_container),scope.faceOperate.getData("moreiny").data.length,scope.faceOperate.inypage,this.randerMoreInList.bind2(this));
	},
	/**
	 * 初始化更多精彩表情列表
	 * @param {Number} _page 页码，默认为1
	 */
	randerMoreHighList:function(_page){
		var page=_page||1;
		scope.faceOperate.renderList($E(scope.faceOperate.high_container),"morehigh","",page);
	},
	/**
	 * 初始化更多IN语表情列表
	 * @param {Number} _page 页码，默认为1
	 */
	randerMoreInList:function(_page){
		var page=_page||1;
		scope.faceOperate.renderList($E(scope.faceOperate.in_container),"moreiny","name",page);
	},
	/**
	 * 初始化dialog并显示
	 */
	initDialog:function(){
		var tpl = ['<table id="#{panel}" class="CP_w">', '<thead id="#{titleBar}">', '<tr>', '<th class="tLeft"><span></span></th>', '<th class="tMid">', '<div class="bLyTop">', '<strong id="#{titleName}"></strong>', '<cite><a title="关闭" class="CP_w_shut" id="#{btnClose}" href="javascript:;" onclick="return false">关闭</a></cite>', '</div>', '</th>', '<th class="tRight"><span></span></th>', '</tr>', '</thead>', '<tfoot>', '<tr>', '<td class="tLeft"><span/></td>', '<td class="tMid"><span></span></td>', '<td class="tRight"><span></span></td>', '</tr>', '</tfoot>', '<tbody>', '<tr>', '<td class="tLeft"><span></span></td>', '<td class="tMid">', '<div id="#{content}">', '</div>', '</td>', '<td class="tRight"><span></span></td>', '</tr>', '</tbody>', '</table>'].join("");
        this.dialog = winDialog.createCustomsDialog({
            tpl: tpl,
            title: "博文表情",
            content: this.initBaseHtml(),
            width: 500
        }, "face");
        this.dialog.setMiddle();
		this.dialog.addEventListener("hidden",function(){
			this.destroy();
		});
		this.dialog.setAreaLocked(true);
        this.dialog.show();
	},
	/**
	 * 显示弹出层
	 */
	show:function(){
		this.dialog.show();
	},
	/**
	 * 初始化“更多精彩表情/更多精彩IN语"选项卡
	 */
	initTab:function(){
	   this.tab = new Tabs($E(scope.faceOperate.tab_container), {});
       highTab = new Tab('<div><em>更多精彩表情</em></div>', {
            isFocus: true,
            className: "cur"
        });
       inTab = new Tab('<div><em>更多精彩IN语</em></div>', {
            isFocus: false,
            className: "cur"
        });
		
		highTab.addOnAbort(Core.Function.bind3(swapTab, this, [scope.faceOperate.high_content, "hidden"]));
        inTab.addOnAbort(Core.Function.bind3(swapTab, this, [scope.faceOperate.in_content, "hidden"]));
        
        highTab.addOnFocus(Core.Function.bind3(swapTab, this, [scope.faceOperate.high_content]));
        inTab.addOnFocus(Core.Function.bind3(swapTab, this, [scope.faceOperate.in_content]));
		
        this.tab.add(highTab);
        this.tab.add(inTab);
		function swapTab(tabContentId, type){
            if (type && type == "hidden") {
                $E(tabContentId).style.display = "none";
            }
            else {
                $E(tabContentId).style.display = "";
				
            }
        }
	},
	/**
	 * 初始化基础的html
	 */
	initBaseHtml:function(){
		return '<div style="width: 440px;" class="CP_layercon2">\
			<div class="facein">\
            	<div class="facein_line1">\
                	<div class="facein_hot">\
                    	<div class="facein_tit">最热门表情</div>\
                        <div class="facein_hotlist">\
                        	<ul id="'+scope.faceOperate.hot_container+'">\
                            </ul>\
                        </div>\
                    </div>\
                    <div class="facein_in">\
                    	<div class="facein_tit">最潮IN语</div>\
                        <div class="facein_inlist">\
                        	<ul id="'+scope.faceOperate.hot_in_container+'">\
                            </ul>\
                        </div>\
                    </div>\
                    <div class="clearit"></div>\
                </div>\
                <div class="facein_line2">\
                <div class="CP_w_tag" id="'+scope.faceOperate.tab_container+'">\
                </div>\
                    <div class="insertface_hot">\
                    </div>\
                    <div class="faceinContent" id="'+scope.faceOperate.high_content+'">\
                        <div class="facein_hotlist">\
                        	<ul id="'+scope.faceOperate.high_container+'">\
                            </ul>\
                        </div>\
                        <div class="SG_page" id="'+scope.faceOperate.high_page_container+'">\
                        </div>\
                    </div>\
                    <div style="display: none;" class="faceinContent" id="'+scope.faceOperate.in_content+'">\
                        <div class="facein_inlist">\
                        	<ul id="'+scope.faceOperate.in_container+'">\
                            </ul>\
                        </div>\
                    	<div class="SG_page" id="'+scope.faceOperate.in_page_container+'">\
                        </div>\
                    </div>\
                </div>\
            </div>\
		</div>';
	}
};

