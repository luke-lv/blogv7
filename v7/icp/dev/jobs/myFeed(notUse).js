/**
 * @fileoverview 我的动态
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-14
 */

$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/ui/pagination.js");

$import("product/myFeed/feed.js");
$import("lib/dialogConfig.js");

/**
 * 我的动态
 */
scope.MyFeed=Core.Class.create();
scope.MyFeed.prototype={
	
	/**
	 * 当前页
	 */
	currentPage:1,
	
	/**
	 * 总记录数
	 */
	totalCount:20,
	
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
	 */
	initialize:function(){
		this.feed=new scope.Feed();
		this.updatePagination(this.currentPage);
		this.initFeedListButton();
		this.initAttentionFilter();
	},
	
	/**
	 * 更新分页
	 * @param {Number} pageID 当前页ID
	 */
	updatePagination:function(pageID){
		var _this=this;
		Ui.Pagination.init({
			"pageNode": "feedPage",
			"nodeClassNamePrefix":"SG",
			"curPage": _this.currentPage,
			"maxPage": Math.ceil(_this.totalCount / _this.eachPageCount),
			"pageTpl": function(nPage){
				
				//传入更新数据的回调函数
				_this.feed.updateData(function(content){
					_this.updateContent(content);
				},scope.$uid,nPage);
				
				_this.currentPage=nPage;
				return false;
			}
		}).show();
	},

	/**
	 * 更新内容区数据
	 * @param {Object} data
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
					_this.feed.filter=attentionFilters[idx]["name"];
					_this.feed.updateData(function(content){
						_this.updateContent(content);
						_this.setActiveFilterButton(attentionFilters[idx]["index"]);
					},scope.$uid,_this.currentPage);
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
			attentionFilterButtons[i].innerHTML=attentionFilterButtons[i].innerHTML.replace(/<\/?strong>/,"");
		}
		attentionFilterButtons[idx].innerHTML="<strong>"+attentionFilterButtons[idx].innerHTML+"</strong>";
	},
	
	/**
	 * 初始化动态显示列表按钮(好友动态/关注动态)
	 */
	initFeedListButton:function(){
		var _this=this;
		var feedListButtons=$E("feedListButtons").getElementsByTagName("li");
		var feedListButtonObjects=[
			{
				/**
				 * 好友动态列表
				 */
				"type":"friend",
				"index":0,
				"handle":function(){
					$E("attentionFilters").style.display="none";
				}
			},
			{
				/**
				 * 关注动态列表
				 */
				"type":"attention",
				"index":1,
				"handle":function(){
					$E("attentionFilters").style.display="";
					_this.setActiveFilterButton(0);
				}
			}
		];
		
		//为配置的动态类型按钮邦定事件
		var i,len=feedListButtonObjects.length;
		for(i=0;i<len;i++){
			Core.Events.addEvent(feedListButtons[i],function(idx){
				return function(){
					_this.feed.type=feedListButtonObjects[idx]["type"];
					_this.currentPage=1;
					_this.feed.updateData(function(content){
						feedListButtonObjects[idx]["handle"]();
						_this.updateContent(content);
						_this.setActiveFeedListButton(feedListButtonObjects[idx]["index"]);
					},scope.$uid,_this.currentPage);
					
				};
			}(i),"click");
		}
	},
	
	/**
	 * 设置当前活动动态显示列表按钮
	 * @param {Object} idx 
	 */
	setActiveFeedListButton: function(idx){
		var feedListButtons = $E("feedListButtons").getElementsByTagName("li");
		var i, len = feedListButtons.length;
		idx=idx % len;
		for (i = 0; i < len; i++) {
			feedListButtons[i].className="";
		}
		feedListButtons[idx].className="current";
	}
};

$registJob("myFeed", function(){
	var myFeed=new scope.MyFeed();
});
