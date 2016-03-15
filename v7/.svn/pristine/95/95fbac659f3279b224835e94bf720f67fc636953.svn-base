/**
 * @fileoverview 动态类
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-09-02
 */

$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/ui/pagination.js");

$import("product/myFeed/feedBase.js");
$import("lib/dialogConfig.js");

/**
 * 动态类
 */
scope.Feed=Core.Class.create();
scope.Feed.prototype={
	
	/**
	 * 当前页
	 */
	currentPage:1,
	
	/**
	 * 总记录数
	 */
	totalCount:0,
	
	/**
	 * 每页最多显示的记录数
	 */
	eachPageCount:10,
	
	/**
	 * feed对象
	 */
	feed:null,
	
	/**
	 * 初始化
	 * @type {String} 动态的类型
	 * 				"personal" 个人动态
	 * 				"attention" 关注动态
	 */
	initialize:function(type){
		this.feedBase=new scope.FeedBase();
		this.feedBase.type=type;
	},
	
	/**
	 * 呈现信息
	 */
	render:function(){
		this.updatePagination(this.currentPage);
		if (this.feedBase.type == "attention") {
			this.initAttentionFilter();
		}
	},
	
	/**
	 * 更新分页
	 * @param {Number} pageID 当前页ID
	 */
	updatePagination:function(pageID){
		var _this=this;
		var maxPage=Math.ceil(_this.totalCount / _this.eachPageCount);
		Ui.Pagination.init({
			"pageNode": "feedPage",
			"nodeClassNamePrefix": "SG",
			"curPage": _this.currentPage,
			"maxPage": maxPage,
			"pageTpl": function(nPage){
			
				//传入更新数据的回调函数
				_this.feedBase.updateData(function(content, count){
					_this.totalCount = count;
					_this.updateContent(content);
					window.location=window.location.toString().replace(/#.*/,"")+"#feedContent";
				}, scope.$uid, nPage);
				
				_this.currentPage = nPage;
				return false;
			}
		}).show();	
		$E("feedPage").style.display=maxPage <= 1?"none":"";
		
		if ($E("feedPageLine")) {
			$E("feedPageLine").style.display = $E("feedPage").style.display;
		}
	},

	/**
	 * 更新内容区数据
	 * @param {String} content 内容
	 */
	updateContent:function(content){
		$E("feedContent").innerHTML=content;
		this.updatePagination(this.currentPage);
	},
	
	/**
	 * 初始化关注动态数据筛选按钮事件
	 */
	initAttentionFilter:function(){
		var _this=this;
		var attentionFilterButtons=$E("attentionFilters").getElementsByTagName("a");
		var attentionFilters=[
			{
				/**
				 * 全部关注
				 */
				"name":"all",
				"index":0
			},
			{
				/**
				 * 博文关注
				 */
				"name":"blog",
				"index":1
			},
			{
				/**
				 * 图片关注
				 */
				"name":"photo",
				"index":2
			},
			{
				/**
				 * 视频关注
				 */
				"name":"video",
				"index":3
			}
			
		];
		
		//为配置的每个筛选按钮绑定事件
		var i,len=attentionFilters.length;
		for(i=0;i<len;i++){
			Core.Events.addEvent(attentionFilterButtons[i],function(idx){
				return function(){
					_this.currentPage=1;
					_this.feedBase.filter=attentionFilters[idx]["name"];
					_this.feedBase.updateData(function(content,count){
						_this.totalCount=count;
						_this.updateContent(content);
						_this.setActiveFilterButton(attentionFilters[idx]["index"]);
						_this.updatePagination(1);
					},scope.$uid,_this.currentPage);
					Core.Events.stopEvent();	
				};
			}(i),"click");
		}
	},
	
	/**
	 * 设置活动动态数据筛选按钮
	 * @param {Object} idx
	 */
	setActiveFilterButton:function(idx){
		var attentionFilterButtons=$E("attentionFilters").getElementsByTagName("a");
		var i, len = attentionFilterButtons.length;
		idx=idx % len;
		for (i = 0; i < len; i++) {
			attentionFilterButtons[i].innerHTML=attentionFilterButtons[i].innerHTML.replace(/<\/?strong>/gi,"");
		}
		attentionFilterButtons[idx].innerHTML="<strong>"+attentionFilterButtons[idx].innerHTML+"</strong>";
	}
};

