$import("sina/core/class/oop.js");
$import("sina/core/function/bind2.js");
$import("sina/utils/json.js");

$import("lib/interface.js");
$import("lib/checkAuthor.js");
$import("lib/sendLog.js");

$import("msg/blogComment.js");
$import("lib/commentv2/_comment.js");

CommentV2.List = function(opt){
	
	this.containerNode = '',		// 列表的父节点
	this.type = '',					// 类型 comment | reply
	this.operation = '',			// 操作 add reply share report
	this.data = '',					// 各种操作需要的的数据
	this.page = 1,					// 页码
	this.total = 0,					// 列表条目总数
	this.url = '';					// 接口地址
	this.trim = Core.String.trim;
	this.jsonUtil = Utils.Json;
	this.init(opt);
	
}.$define({
	init: function(opt){ 
		trace("super init")
		this.__merge(opt);
		this.load(this.page);
	},
	__merge: function(opt){	// 不管传递什么参数，都直接复制
		for (var index in opt){
			this[index] = opt[index];
		} 
	},
	load: function(page){
		
	},
	render: function(){
	
	},
	/** 
	 *	为评论列表绑定事件
	 */
	bindEvent: function(){
		var __this = this;
		// trace("CommentV2.CommentList.bindEvent");
		if (!scope.commentlistIsBind){
			this.addEvent(this.containerNode, __this.delegate.bind2(__this), 'click');
			this.onListener();
		}
		scope.commentlistIsBind = true;
	},
		/** 
	 *	评论列表的事件代理
	 * @param e 事件对象
	 */
	
	delegate: function(e){
		trace('CommentV2.CommentList.delegate');
		e = e || window.event;
		var tar = e.target || e.srcElement;
		var node, actionType, type, operation, dataObj;
		node = this.getTarget(tar, this.containerNode);
		if (node){// 找到符合条件的节点
			actionType = this.getType(node);					// 获得节点的类型
			if (actionType){
				type = actionType.split("_")[0];					// type有两种 comment评论的相关操作 reply回复的相关操作
				operation = actionType.split("_")[1];			// operation有四种 add新增 reply回复 share分享 report举报				
				dataObj = this.str2obj(this.getData(node)); // 获得操作相关的数据内容并转换为对象
				if (type == 'comment'){// 评论列表的操作
					// trace(scope.$articleid);
					var containerNode = $E("comment_"+dataObj.commentid);	// 操作的父节点
					this[operation]({
						type: type,
						operation: operation,
						articleid: scope.$articleid,
						data: dataObj,
						containerNode: containerNode,
						node: node
					});
				}else{// 回复列表的操作
					// trace("reply:"+type)
					var containerNode = $E("reply_"+dataObj.replyid);
					this.replyList[dataObj.commentid][operation]({
						type: type,
						operation: operation,
						articleid: scope.$articleid,
						data: dataObj,
						containerNode: containerNode,
						node: node
					});
				}
			}
		}
	},
	
	onListener: function(){ 
		Lib.Listener.on({
			name     : "commentlist-commentadd",
			callBack : this.add,
			scope    : this
		});
	},
	
	removeEvent: function(){
		trace("CommentV2.CommentList.removeEvent");
		this.removeEvent(this.containerNode, this.delegate, 'click');
	},
	
	toggle: function(){
		this.isDisplay() ? this.hide() : this.show();
	},
	show: function(){
		this.containerNode.style.display = '';
	},
	hide: function(){
		this.containerNode.style.display = 'none';
	},
	isDisplay: function(){
		return this.containerNode ? this.containerNode.style.display !== 'none' : false;
	},
	error: function(code){
		 this.containerNode.innerHTML = '<li class="CP_litem"><div class="CP_cmt_none">' + $SYSMSG[code] + '</div></li>';
	},
	paging: function(){
    
    },
	add: function(){
	
	},
	del: function(){
	
	},
	report: function(){
	
	},
	reply: function(){
	
	},
	share: function(){
	
	},
	obj2str: function(obj){
		return encodeURIComponent(this.jsonUtil.flatten(obj));
	},
	str2obj: function(str){
		return this.jsonUtil.eval(decodeURIComponent(str));
	},
		/** 
	 *	事件代理中，找到符合条件的节点
	 * @param node    事件节点
	 * @param parent  父节点
	 */
   
	getTarget: function(node, parent){
		while (node && node !== parent ){
			if (node.tagName.toLowerCase() == 'a'){
				return node;
			}
			node = node.parentNode;
		}
		return null;
	},
	
	/** 
	 *	事件代理中，找到符合条件的节点的类型
	 * @param node 节点
	 */
	
	getType: function(node){
		return node && node.getAttribute('action-type');
	},
	
	/** 
	 *	事件代理中，找到符合条件的节点的数据
	 * @param node 节点
	 */
	
	getData: function(node){
		return node && node.getAttribute('action-data');
	}
});