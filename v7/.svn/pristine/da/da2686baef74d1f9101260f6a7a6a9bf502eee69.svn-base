/**
 * @fileoverview 垃圾箱类
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-12-17
 */

$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");

$import("lib/interface.js");
$import("lib/dialogConfig.js");
$import("lib/sysmsg.js");
$import("lib/msg/systemMSG.js");
$import("msg/blogComment.js");

$import("product/spam/spamBase.js");
$import("product/blogmsg/centertip.js");
/**
 * 垃圾箱类
 */
scope.Spam=Core.Class.create();
scope.Spam.prototype = {
	
	/**
	 * 类型
	 */
	type:"",
	
	/**
	 * 类型文字
	 */
	typeText:{
		"" : "信息",
		"comment" : "评论",
		"guestBook" : "留言",
		"note" : "纸条"
	},
	
	/**
	 * 垃圾箱基础类对象
	 */
	spamBase:null,
	
	/**
	 * 清空垃圾箱的按钮
	 */
	removeAllButtons:null,
	
	/**
	 * 删除按钮
	 */
	removeButtons:null,
	
	/**
	 * 恢复按钮
	 */
	restoreButtons:null,
	
	/**
	 * 全选按钮
	 */
	selectAllCbs:null,
	
	/**
	 * 信息选取的checkBox列表
	 */
	_cbList:null,
	
	/**
	 * 初始化
	 */
	initialize:function(cbList,selectAllCbs,removeButtons,restoreButtons,removeAllButtons,objInterfaceSet){
		this._cbList=cbList;
		this.removeAllButtons=removeAllButtons;
		this.selectAllCbs=selectAllCbs;
		this.removeButtons=removeButtons;
		this.restoreButtons=restoreButtons;
		this.spamBase=new scope.SpamBase(this._cbList);
		this._initHandle();
		this._initDataInterface(objInterfaceSet);
		
		this._initRemoveAllButtons();
		this._initSelectAllButtons();
		this._initRemoveButtons();
		this._initRestoreButtons();
		this._initCbList();
	},
	
	/**
	 * 初始化操作后的处理
	 */
	_initHandle:function(){
		this.spamBase.onRemoveSuccess=function(){
			winDialog.alert("删除操作成功。",{
				funcOk:function(){
					window.location.href=window.location.href.replace(/#.*$/,"");
				},
				funcClose:function(){
					window.location.href=window.location.href.replace(/#.*$/,"");
				}, 
				icon: "03"
			});
		};
		this.spamBase.onRemoveError=function(ex){
			winDialog.alert($SYSMSG[ex["code"]]);
		};
		
		this.spamBase.onRestoreSuccess=function(){
			  centerTips.show("恢复操作成功");	
			setTimeout(function(){
				window.location.reload();
			},2000);   
			/**
			winDialog.alert("恢复操作成功。",{funcOk:function(){
					window.location.href=window.location.href.replace(/#.*$/,"");
				},
				icon: "03"
			});
			***/
		};
		this.spamBase.onRestoreError=function(ex){
			if(ex["code"] == 'A00004' || ex["code"] == 'A00005')
			{
				winDialog.alert("没有权限",{funcOk:function(){
					window.location.href=window.location.href.replace(/#.*$/,"");
				}
			});	
			}else
			{
				winDialog.alert($SYSMSG[ex["code"]]);	
			}			
		};
		
		
	},
	
	/**
	 * 初始化数据接口
	 * @param {Object} objInterfaceSet
	 */
	_initDataInterface:function(objInterfaceSet){
		var p;
		for(p in objInterfaceSet){
			this.spamBase[p]=objInterfaceSet[p];
		}
	},
	
	/**
	 * 初始化清空垃圾箱按钮
	 */
	_initRemoveAllButtons:function(){
		var i,
			len=this.removeAllButtons.length,
			me=this;
			
		for(i=0;i<len;i++){
			Core.Events.addEvent(this.removeAllButtons[i],function(){
				winDialog.confirm("是否删除所有垃圾"+me.typeText[me.type]+"？删除后不可恢复",{
					funcOk:function(){
						me.spamBase.removeAll();
					}
				});
			},"click");
		}
	},
	
	/**
	 * 初始化全选按钮
	 */
	_initSelectAllButtons:function(){
		var i,j,
			len=this.selectAllCbs.length,
			me=this;
		for(i=0;i<len;i++){
			Core.Events.addEvent(this.selectAllCbs[i],function(idx){
				return function(){
					me.spamBase.selectAll(me.selectAllCbs[idx].checked);
					me._setSelectAllCbsState(me.selectAllCbs[idx].checked);
				};
			}(i),"click");
		}
	},
	
	/**
	 * 初始化checkBox列表
	 */
	_initCbList:function(){
		var i,j,
			len=this._cbList.length,
			me=this,
			sum;
		for(i=0;i<len;i++){
			Core.Events.addEvent(this._cbList[i],function(idx){
				return function(){
					sum=0;
					for(j=0;j<len;j++){
						if(me._cbList[j].checked){
							sum++;
						}
					}

					me._setSelectAllCbsState(sum==len);
				};
			}(i),"click");
			this._cbList[i].checked = this.selectAllCbs[0].checked;
		}
	},
	
	/**
	 * 初始化删除按钮
	 */
	_initRemoveButtons:function(){
		var i,
			len=this.removeButtons.length,
			me=this;
			
		for(i=0;i<len;i++){
			Core.Events.addEvent(this.removeButtons[i],function(){
				if(me._checkSelected()){
					winDialog.confirm("是否删除当前选择的垃圾"+me.typeText[me.type]+"？删除后不可恢复",{
						textOk:'删除',
						funcOk:function(){
							me.spamBase.remove(me._getSelectedIDs());
						}
					});
				}else{
					winDialog.alert("请选择一条垃圾"+me.typeText[me.type]);
				}
			},"click");
		}
	},
	
	/**
	 * 初始化恢复按钮
	 */
	_initRestoreButtons:function(){
		var i,
			len=this.restoreButtons.length,
			me=this;
			
		for(i=0;i<len;i++){
			Core.Events.addEvent(this.restoreButtons[i],function(){
				if(me._checkSelected()){
					me.spamBase.restore(me._getSelectedIDs());
					/**
					winDialog.confirm("是否恢复当前选择的垃圾"+me.typeText[me.type]+"？",{
						funcOk:function(){
							me.spamBase.restore(me._getSelectedIDs());
						}
					});
					**/
				}else{
					winDialog.alert("请选择一条垃圾"+me.typeText[me.type]);
				}
			},"click");
		}
	},
	
	/**
	 * 设置全选按钮的选取状态
	 * @param {boolean} state
	 */
	_setSelectAllCbsState:function(state){
		var i,len=this.selectAllCbs.length;
		for (i = 0; i < len; i++) {
			this.selectAllCbs[i].checked = state;
		}
	},
	
	/**
	 * 获取当前选择的信息ID
	 */
	_getSelectedIDs:function(){
		var i,
			len=this._cbList.length,
			activeIDs=[];
		for(i=0;i<len;i++){
			if(this._cbList[i].checked){
				activeIDs.push(this._cbList[i].value);
			}
		}
		
		return activeIDs.join(",");
	},
	
	/**
	 * 检测是否选择了信息
	 */
	_checkSelected:function(){
		var i,len=this._cbList.length;
		for(i=0;i<len;i++){
			if (this._cbList[i].checked) {
				return true;
			}
		}
		return false;
	}
	
};