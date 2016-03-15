/**
 * @fileoverview 垃圾箱基础类
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-12-16
 */

$import("sina/sina.js");
$import("sina/core/class/create.js");

$import("lib/interface.js");

/**
 * 垃圾箱基础类
 */
scope.SpamBase=Core.Class.create();
scope.SpamBase.prototype = {
	
	/**
	 * 删除的接口
	 */
	removeInterface:null,
	
	/**
	 * 删除所有信息的接口
	 */
	removeAllInterface:null,
	
	/**
	 * 恢复的接口
	 */
	restoreInterface:null,
	
	/**
	 * 选取信息的checkBox列表
	 */
	_cbList:null,
	
	/**
	 * 初始化
	 */
	initialize:function(cbList){
		this._cbList=cbList;
	},
	
	/**
	 * 全选
	 * @param {boolean} state 是否置为选中状态
	 */
	selectAll:function(state){
		var i,len;
		len=this._cbList.length;
		for(i=0;i<len;i++){
			this._cbList[i].checked=state;
		}
	},
	
	/**
	 * 删除指定信息
	 * @param {String} IDs 信息ID
	 */
	remove:function(IDs){
		var me=this;
		this.removeInterface.request({
			POST: {
				uid:scope.$uid,
				ids:IDs,
				version:7
			},
			onSuccess:function(){
				me.onRemoveSuccess();
			},
			onError:function(ex){
				me.onRemoveError(ex);
			}
		});
	},
	
	/**
	 * 删除所有信息
	 */
	removeAll:function(){
		var me=this;
		this.removeAllInterface.request({
			POST: {
				uid:scope.$uid,
				version:7
			},
			onSuccess:function(){
				me.onRemoveSuccess();
			},
			onError:function(ex){
				me.onRemoveError(ex);
			}
		});
	},
	
	/**
	 * 恢复指定信息
	 * @param {String} IDs 信息ID
	 */
	restore:function(IDs){
		var me=this;
		this.restoreInterface.request({
			POST: {
				uid:scope.$uid,
				ids:IDs,
				version:7
			},
			onSuccess:function(){
				me.onRestoreSuccess();
			},
			onError:function(ex){
				me.onRestoreError(ex);
			}
		});
	},
	
	/**
	 * 删除信息成功
	 */
	onRemoveSuccess:function(){},
	
	/**
	 * 删除信息失败
	 */
	onRemoveError:function(ex){},
	
	/**
	 * 恢复信息成功
	 */
	onRestoreSuccess:function(){},
	
	/**
	 * 恢复信息失败
	 */
	onRestoreError:function(ex){}
};