/**
下拉选择框
**/

define('mods/view/select',function(require,exports,module){

	var $ = require('lib');
	var $view = require('lib/mvc/view');
	var $mustache = require('vendor/mustache/mustache');
	var $occurInside = require('lib/kit/evt/occurInside');

	var $doc = $(document);

	var TPL = {};
	TPL.root = [
		'<div class="selectView">',
			'<div role="box" class="ds_cont">',
				'<div role="selected" class="ds_title" data-value=""></div>',
				'<div class="ds_button"></div>',
			'</div>',
			'<div role="list" class="ds_list" style="display:none;"></div>',
		'</div>'
	];

	TPL.options = [
		'<div class="dsl_cont">',
			'{{#.}}',
				'<p role="option" data-index="{{index}}" data-value="{{value}}" title="{{text}}" {{#selected}}class="selected"{{/selected}}>{{text}}</p>',
			'{{/.}}',
		'</div>'
	].join('');

	var SelectBox = $view.extend({
		defaults : {
			target : null,
			template : TPL.root,
			tplOptions : TPL.options,
			styles : {}
		},
		events : {
			'[role="box"] click' : 'toggle',
			'[role="option"] mouseenter' : 'hoverOption',
			'[role="option"] mousedown' : 'choose'
		},
		build : function(){
			this.target = $(this.conf.target);
			this.deploy();
			this.refresh();
		},
		setStyles : function(){
			var conf = this.conf;
			var styles = conf.styles || {};
			var root = this.role('root');
			styles.width = this.target.width();
			root.css(styles);
		},
		deploy : function(){
			$(this.conf.target).css('display', 'none');
			this.role('root').insertAfter(this.target);
		},
		renderBox : function(){
			var node = this.target;
			this.role('selected')
				.attr('data-value', node.val())
				.html(node.find('option:selected').text());
		},
		renderOptions : function(){
			var model = [];
			var node = this.target;
			node.find('option').each(function(index){
				var item = {};
				var option = $(this);
				item.index = index;
				item.text = option.text();
				item.value = option.attr('value');
				if(option.prop('selected')){
					item.selected = true;
				}
				model.push(item);
			});
			var html = $mustache.render(this.conf.tplOptions, model);
			this.role('list').html(html);
		},
		refresh : function(){
			this.show();
			this.setStyles();
			this.renderBox();
			this.renderOptions();
		},
		hilight : function(target){
			this.role('root')
				.find('[role="option"].selected')
				.removeClass('selected');
			$(target).addClass('selected');
		},
		hoverOption : function(evt){
			var target = $(evt.currentTarget);
			this.hilight(target);
		},
		moveHover : function(delta){
			var root = this.role('root');
			var length = root.find('[role="option"]').length;
			var curIndex = root.find('[role="option"].selected').attr('data-index');
			curIndex = parseInt(curIndex, 10) || 0;

			var nextIndex = curIndex + delta;
			if(nextIndex >= length){
				nextIndex = nextIndex % length;
			}
			if(nextIndex < 0){
				nextIndex = length + nextIndex % length;
			}

			this.hilight(root.find('[role="option"][data-index="' + nextIndex + '"]'));
		},
		choose : function(){
			var selectedNode = this.role('root').find('[role="option"].selected');
			var value = selectedNode.attr('data-value');
			this.target.val(value);
			this.target.trigger('change');
			this.refresh();
			this.close();
		},
		onKeyDown : function(evt){
			var num = this.showIndex;
			var code = evt.keyCode + '';

			if (code === '38') {
				this.moveHover(-1);
				evt.preventDefault();
			}

			if (code === '40') {
				this.moveHover(1);
				evt.preventDefault();
			}

			if (code === '13' || code === '9') {
				this.choose();
			}

			if (code === '27') {
				this.close();
			}
		},
		toggle : function(){
			var listNode = this.role('list');
			if(listNode.css('display') === 'none'){
				this.open();
			}else{
				this.close();
			}
		},
		open : function(){
			this.renderOptions();
			this.role('list').show();
			$doc.on('mousedown', this.proxy('onOuterTap'));
			$doc.on('keydown', this.proxy('onKeyDown'));
		},
		close : function(){
			this.role('list').hide();
			$doc.off('mousedown', this.proxy('onOuterTap'));
			$doc.off('keydown', this.proxy('onKeyDown'));
		},
		onOuterTap : function(evt){
			if(!$occurInside(this.role('root'), evt)){
				this.close();
			}
		},
		show : function(){
			this.role('root').show();
		},
		hide : function(){
			this.role('root').hide();
		}
	});

	module.exports = SelectBox;

});
