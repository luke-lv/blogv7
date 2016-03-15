define('mods/kit/math/fixSize', function(require,exports,module){

	var fixSize = function(options){
		var model = $.extend({
			maxWidth : 100,
			maxHeight : 100,
			originWidth : 100,
			originHeight : 100,
			width : 0,
			height : 0,
			//计算方式 ['clip','scale']
			type : 'scale'
		}, options);

		model.scale = model.originWidth / model.originHeight;

		if(model.type === 'scale'){
			model.width = Math.floor(model.maxHeight * model.scale);
			model.width = Math.min(model.maxWidth, model.width);
			model.height = Math.floor(model.width / model.scale);
		}else if(model.type === 'clip'){
			if(model.originWidth > model.originHeight){
				model.height = model.maxHeight;
				model.width = model.height * model.scale;
			}else{
				model.width = model.maxWidth;
				model.height = model.width / model.scale;
			}
		}

		return model;
	};

	module.exports = fixSize;

});
