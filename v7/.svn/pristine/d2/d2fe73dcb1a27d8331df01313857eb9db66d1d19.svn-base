/**
瀑布流视图组件
**/
define('mods/view/waterfall', function (require, exports, module){
	var $ = require('lib');
	var $view = require('lib/mvc/view');
	var $transAipai = require('mods/trans/aipai');
	var $mustache = require('vendor/mustache/mustache');
	var $find = require('lib/kit/obj/find');
	var $lock = require('lib/kit/func/lock');

	var TPL = {};
	TPL.item = [
		'<div role="item">item</div>'
	].join('');
	TPL.empty = [
		'暂无数据'
	].join('');
	/**
	@defaults 默认选项
	node: 指定一个外层父元素
	listBox: 列表直接父结点role值
	template: 列表中单个条目html模版
	emptyTpl: 没有数据时，需要显示的html模版
	**/
	var defaults = {
		node: null,
		listBox: 'list-box',
		template: TPL.item,
		emptyTpl: TPL.empty,
		itemWidth: 240,
		dataApi: '',
		postData: {},
		defaultPage: 1,
		pageSize: 20,
		columnNum: 4,
		offsetX: 10,
		offsetY: 10,
		scrollLoad: true,
		bottomHeight: 200,
		classes: {
			nodata: 'cln_no_data'
		},
		keys: {
			'page': 'page',
			'pageSize': 'count'
		}
	};

	var Waterfall = $view.extend({
		defaults: defaults,
		setOptions: function (options){
			var self = this;
			self.defaults = $.extend(true, defaults, self.defaults);
			self.supr(options);
		},
		build: function (){
			var self = this;
			self.isPauseScrollLoad = 0;
			self.columns = [];
			self.postData = self.conf.postData;
			self.curPage = self.conf.defaultPage;
			self.pageSize = self.conf.pageSize;
			self.listBox = self.role(self.conf.listBox);
			for(var i = 0; i < self.conf.columnNum; i++){
				self.columns[i] = [];
			}

			self.loadData();
		},
		setEvents: function (action){
			var self = this;

			var fn = function (){
				if(!self.isPauseScrollLoad && !self.isLoading && $(document).scrollTop() + $(window).height() + self.conf.bottomHeight > $(document).height()){
					this.loadData();
				}
			};
			if(self.conf.scrollLoad){
				$(window).on('scroll', $lock(fn, 300, self));
			}
		},
		/**
		@loadData 请求数据接口，获取数据
		**/
		loadData: function (){
			var self = this;
			var data = self.postData || {};
			var page = self.nextPage || self.conf.defaultPage;
			data[self.conf.keys.page] = page;
			data[self.conf.keys.pageSize] = self.pageSize;

			// 无数据时
			if(self.isNodata){
				self.onNoData();
				return;
			}

			// 第一次load时
			if(!self.isFirstLoaded){
				self.listBox.hide();
			}

			if(self.loadBefore()){
				self.isLoading = 1;
				self.showLoading();
				var callback = function (ret){
					self.loadCallback(ret);
					self.loadAfter(ret);
					self.isLoading = 0;
				};
				if(typeof self.conf.dataApi === 'function'){
					self.conf.dataApi(data, callback);
				}else{
					$transAipai.request(self.conf.dataApi, {
						data: data,
						onSuccess: callback
					});
				}
			}
		},
		/**
		@loadCallback 请求数据接口的回调，对数据进行处理
		对图片进行预加载，加载完成后放入itemQueue，等待插入列表
		**/
		loadCallback: function (ret){
			var self = this;
			var data = $find(ret, 'result.data') || {};
			var total = $find(ret, 'result.data.pageStr.totalNum') || 0;
			var list = data.list || [];
			var loadImg = function (url, cb){
				var img = new Image();
				img.onload = cb;
				img.src = url;
			};
			$.each(list, function (index, value){
				loadImg(value.imgUrl, function (){
					self.pushToList(value);
				});
			});

			if(self.columns.length === 0 && list.length === 0){
				self.isNodata = 1;
				self.listBox.html(self.conf.emptyTpl);
			}

			self.curPage = self.nextPage || self.conf.defaultPage;
			if(list.length === self.pageSize){
				self.nextPage = self.curPage + 1;
			}else{
				self.isNodata = 1;
			}

			// 第一次加载回来
			if(!self.isFirstLoaded){
				self.isFirstLoaded = 1;
				self.role('total').html(total);
				self.listBox.show();
			}
			self.hideLoading();
		},
		/**
		当已经没有数据时
		**/
		onNoData: function (){
			var self = this;
			var loading = self.role('loading');
			var ing = loading.data('ing');
			var nodataCls = $find(self.conf, 'classes.nodata');
			if(ing){
				return;
			}
			loading.data('ing', 1);
			loading.addClass(nodataCls);
			loading.html('没有数据了！');
			loading.fadeIn(function (){
				loading.fadeOut(5000, function (){
					loading.data('ing', 0);
				});
			});
		},
		/**
		数据加载前调用
		@return true/false 返回false不再执行数据请求
		**/
		loadBefore: function (){
			return true;
		},
		/**
		数据加载后调用
		@param ret 数据加载并执行完回调(loadCallback)之后调用
		**/
		loadAfter: $.noop,
		showLoading: function (){
			var self = this;
			var loading = self.role('loading');
			var nodataCls = $find(self.conf, 'classes.nodata');

			loading.html('正在为您拼命加载');
			loading.removeClass(nodataCls);
			loading.fadeIn();
		},
		hideLoading: function (){
			this.role('loading').fadeOut();
		},
		pushToList: function (item){
			var that = this;
			that.needPushQueue = that.needPushQueue || [];
			if(that.pushing){
				that.needPushQueue.push(item);
				return;
			}
			that.pushing = 1;
			if(!item){
				return;
			}
			var self = this;
			var columns = self.columns;
			// 当前数据将要插入列的索引
			var coluIndex = 0;
			// 所有列中最大和最小top值
			var minTop = 0, maxTop = 0;
			var itemHtml = '';
			var i, column, tmp;

			item.sWidth = self.conf.itemWidth;
			// 查找出所有列中最短的列作为当前将要插入的位置
			for(i = 0; i < columns.length; i++){
				column = columns[i];
				if(column.length === 0){
					coluIndex = i;
					minTop = 0;
					break;
				}else{
					tmp = column[column.length - 1];
					// 计算列中下一个将要插入元素的top值
					tmp.nextTop = tmp.nextTop || tmp.sTop + self.listBox.find('[item-id="'+ tmp.id +'"]').height() + self.conf.offsetY;
					// 记录最小值
					if(!minTop || minTop > tmp.nextTop){
						minTop = tmp.nextTop;
						coluIndex = i;
					}
					// 记录最大值
					if(!maxTop || maxTop < tmp.nextTop){
						maxTop = tmp.nextTop;
					}
				}
			}

			item.sLeft = coluIndex * (item.sWidth + self.conf.offsetX);
			item.sTop = minTop;
			columns[coluIndex].push(item);
			itemHtml = $mustache.render(self.conf.template, item) || '';
			itemHtml = $(itemHtml).hide().css({
				'left': item.sLeft,
				'top': item.sTop,
				'width': item.sWidth
			});
			self.listBox.append(itemHtml);
			self.listBox.css({
				'height': Math.max(maxTop, item.sTop + $(itemHtml).height() + self.conf.offsetY)
			});
			$(itemHtml).fadeIn();

			// 延迟一下执行 解决IE可能出现图片叠加bug
			setTimeout(function (){
				that.pushing = 0;
				if(that.needPushQueue.length){
					that.pushToList(that.needPushQueue.shift());
				}
			}, 50);
		}
	});

	module.exports = Waterfall;
});