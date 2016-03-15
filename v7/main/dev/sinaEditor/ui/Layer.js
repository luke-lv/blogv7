/**
 *
 * @param opts
 * @constructor
 */
SinaEditor.regist('ui.Layer', function (SE) {
    var DOMUtil = SE.DOMUtil, Event = SE.Event, Util = SE.Util, HTMLTemplate = SE.ui.HTMLTemplate;

    function Layer(opts) {
        var self = this, domUtil;

        self.opts = Util.extend({
            html: '<div id="#{panel}">test</div>'
        }, opts);
        domUtil = self.domUtil = new DOMUtil();
        self.tmpl = new HTMLTemplate(self.opts.html);
        var frag = domUtil.createElementByHTML(self.tmpl.getHtmlString());
//	self.node = frag.childNodes[0];
//	self.node.style.left = '-10000px';

        domUtil.doc.body.appendChild(frag);
        self.event = new Event;
        self.node = self.tmpl.getNode('panel');
        self.isHidden = ('none' === domUtil.getStyle(self.node, 'display'));
//	if (!self.isHidden) {
//		self.hide();
//	}
    };
    Layer.prototype = {
        constructor: Layer,

        node: null,
        /**
         * @type {boolean} 是否隐藏
         */
        isHidden: true,

        /**
         *
         * @param name
         * @returns {HTMLElement}
         */
        getNode: function (name) {
            return this.tmpl.getNode(name);
        },
        /**
         * 显示浮层
         * @param opt
         */
        show: function (opt) {
            var self = this;
            self.node.style.display = 'block';
            if (opt && opt.left && opt.top) {
                self.setPos(opt.left, opt.top);
            }

            self.isHidden = false;
            self.fire('show');
        },
        /**
         * 隐藏浮层
         */
        hide: function () {
            var self = this;
            self.node.style.top = '-10000px';
            self.isHidden = true;
            self.fire('hide');
        },
        /**
         * 设置浮层位置
         * @param {Number} x
         * @param {Number} y
         */
        setPos: function (x, y) {
            var node = this.node;
            node.style.left = parseInt(x, 10) + 'px';
            node.style.top = parseInt(y, 10) + 'px';
        },
        /**
         * 触发事件
         * @param name
         * @param data
         */
        fire: function (name, data) {
            this.event.fire(this, name, data);
        },
        /**
         * 监听浮层事件
         * @param name
         * @param func
         */
        on: function (name, func) {
            this.event.on(this, name, func);
        },
        /**
         * 去除浮层事件
         * @param name
         * @param func
         */
        off: function (name, func) {
            /**TODO - 没有处理off的情况  用斜杠注释，ie8报错了
             * @author - Qiangyee
             * @date - 14-8-6
             * @time - 下午5:09
             */
            this.event.off(name, func);
        },
        /**
         * 获取node节点的尺寸
         * @returns {ClientRect}
         */
        getRect: function () {
            return this.node.getBoundingClientRect();
        }
    };

    return Layer;
});