/**
页码
**/

define('mods/view/paging',function(require,exports,module){

	var $ = require('lib');
	var $view = require('lib/mvc/view');
	var $pagingModel = require('mods/model/paging');
	var $mustache = require('vendor/mustache/mustache');

	var TPL = {};

	TPL.paging = [
		'<div class="pageControl clearfix">',
			//上一页
			'{{#prev}}',
				'<a href="javascript:;" data-page="{{prev}}" title="上一页" class="CyPagesPrev">上一页</a>',
			'{{/prev}}',
			'{{^prev}}',
				'<span class="CyPagesPrev unAbleBtn" title="上一页">上一页</span>',
			'{{/prev}}',
			
			//首页
			'{{#firstPage}}',
				'<a href="javascript:;" data-page="{{first}}">{{first}}</a>',
			'{{/firstPage}}',

			//前分隔符
			'{{#prevSplit}}',
				'<em>...</em>',
			'{{/prevSplit}}',

			//页码列表
			'{{#list}}',
				'{{#isCurrent}}',
					'<span class="CyPagesCur">{{page}}</span>',
				'{{/isCurrent}}',
				'{{^isCurrent}}',
					'<a href="javascript:;" data-page="{{page}}">{{page}}</a>',
				'{{/isCurrent}}',
			'{{/list}}',

			//后分隔符
			'{{#nextSplit}}',
				'<em>...</em>',
			'{{/nextSplit}}',

			//末页
			'{{#lastPage}}',
				'<a href="javascript:;" data-page="{{last}}">{{last}}</a>',
			'{{/lastPage}}',

			//下一页
			'{{#next}}',
				'<a href="javascript:;" data-page="{{next}}" title="下一页" class="CyPagesNext">下一页</a>',
			'{{/next}}',
			'{{^next}}',
				'<span class="CyPagesNext unAbleBtn" title="下一页">下一页</span>',
			'{{/next}}',

			//跳转
			'<span class="cygopageBox psre">',
				'<span class="cygopageTit psre">第</span>',
				'<input role="input" class="cygopageNum psre" type="text" value="{{current}}">',
				'<span class="cygopageTit2 psre">页</span>',
			'</span>',
			'<span role="submit" class="cygopageGo" title="跳转到指定页">GO</span>',
		'</div>'
	].join('');

	var Paging = $view.extend({
		defaults : {
			node : null,
			tplPaging : TPL.paging
		},
		events : {
			'[data-page] click' : 'onPageTap',
			'[role="submit"] click' : 'onSubmit'
		},
		build : function(){
			this.model = new $pagingModel();
		},
		setEvents : function(action){
			var model = this.model;
			var proxy = this.proxy();
			model[action]('compute', proxy('render'));
			model[action]('change:current', proxy('onTurn'));
		},
		set : function(){
			this.model.set.apply(this.model, arguments);
		},
		get : function(){
			return this.model.get.apply(this.model, arguments);
		},
		validate : function(page){
			var result = true;
			//用于页码验证需求
			return result;
		},
		onSubmit : function(evt){
			evt.preventDefault();
			//这里不能使用role方法来查找input
			//因为元素内容每次都会重新生成
			var input = this.role('root').find('[role="input"]');
			var page = $.trim(input.val());
			if(this.validate(page)){
				this.set({
					current : page
				});
			}
		},
		onPageTap : function(evt){
			evt.preventDefault();
			var el = $(evt.currentTarget);
			var page = el.attr('data-page');
			this.set({
				current : page
			});
		},
		onTurn : function(){
			this.trigger('turn', this.model.get('current'));
		},
		render : function(){
			var conf = this.conf;
			var model = this.model.get();
			var list = model.list;

			if($.inArray(model.first, list) < 0){
				model.firstPage = model.first;
				if(list[0] !== model.first + 1){
					model.prevSplit = true;
				}
			}

			if($.inArray(model.last, list) < 0){
				model.lastPage = model.last;
				if(list[list.length - 1] !== model.last - 1){
					model.nextSplit = true;
				}
			}

			model.list = list.map(function(page, index){
				var item = {};
				item.page = page;
				if(page === model.current){
					item.isCurrent = true;
				}
				return item;
			});

			var html = $mustache.render(conf.tplPaging, model);
			this.role('root').html(html);
		}
	});

	module.exports = Paging;

});
