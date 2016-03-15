/**
 * 编辑器对话框
 * @example
 * var dialog = new WinBox({title: 'test', html: '<p>HelloWorld!</p><button id="#{OK}" value="确定">'});
 * dialog.show();
 * var okBtn = dialog.getNode('OK');
 * alert(okBtn.value);
 * @class
 * @param {JSON} opts 对话框的配置
 * @param {String} opts.type 对话框的类型，alert, confirm, custom
 * @param {String} opts.title 对话框的标题
 * @param {String} opts.width 对话框的宽度
 * @param {String} opts.height 对话框的高度
 * @param {String} opts.content content 对话框的内部html(支持模板方式)
 * @param {Function} opts.funcBeforeClose  点"关闭"按钮后,对话框在关闭前执行的方法
 * @param {Function} opts.funcClose  "关闭"按钮执行的方法
 * @param {Number} opts.bgShadowOpacity  背景阴影层的透明度 0-1,小于0为不显示
 * @param {String} opts.tpl 自定义的对话框外部模板
 * @param {Boolean} opts.isAdamant  是否显示背景iframe以挡住select/flash之类的讨厌的东东
 * @param {String} name 对话框的名称
 *
 * @author wangqiang
 * @date 14-8-11
 */
SinaEditor.regist('ui.WinBox', function (SE) {

    var Util = SE.Util, DOMUtil = SE.DOMUtil;

    var WinBox = function (opts, name) {
        var dialog, self = this, $dom;
        if ('alert' === opts.type) {
            dialog = winDialog.alert(opts.text, opts, name);
        } else if ('confirm' === opts.type) {
            dialog = winDialog.confirm(opts.text, opts, name);
        } else {
            dialog = winDialog.create(opts, name);
        }
        if (dialog) {
            dialog.getNode = this.getNode;
            $dom = new DOMUtil();
            dialog.$dom = $dom;
//    $dom.on(window, 'resize scroll', function(){
//        self.__updateDialogPosition(dialog)
//    });
            this.$supper = dialog;
            return dialog;
        }
    };

    Util.mix(WinBox.prototype, {
        /**
         * 获取对话框的dom节点
         * @param {string} name dom节点的名称
         * @returns {HTMLElement}
         */
        getNode: function (name) {
            return this.nodes[name];
        },
        destroy: function () {
            this.destroyed = !0;
            this.$supper.destroy();
        },
        __updateDialogPosition: function (dialog) {
            if (this.destroyed) {
                return;
            }
            dialog.setMiddle();
        }
    });

    return WinBox;
});
