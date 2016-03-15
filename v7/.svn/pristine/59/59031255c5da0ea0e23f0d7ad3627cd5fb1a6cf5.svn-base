/**
 * @fileoverview 博客新模板，自定义浮层复写content
 * @author fuqiang3
 * @date 2014-07-30
 */
$import('lib/dialogConfig.js');
(function(){

  var supCreate = Ui.ModuleDialog.prototype.create;

  Ui.ModuleDialog.prototype.create = function(cfg){
    //根据cfg 里新增个 dialogName 判断是哪个弹层，再复写，setContent方法
    var dialog = supCreate.call(this,cfg);
    if(cfg.title == '发纸条' || cfg.title == '加好友'){
      dialog.setContent = function(str){
        str = 'abc';
        return Ui.Dialog.$super.setContent.call(this,str);
      };
    }
    return dialog;
  };

})();
