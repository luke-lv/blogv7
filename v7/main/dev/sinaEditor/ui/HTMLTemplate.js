/**
 * Js模板引擎类
 * @example
 * var tpl = 'this is a #{vo}';
 * var tmp = new HTMLTemplate(tpl);
 * var data = {'vo':'test'};
 * console.log(tmp.evaluate(data)); // output:this is a test;
 *
 * data = [{vo:test},{vo:bug}];
 * var reverse = true;
 * console.log(tmp.evaluateMulti(data,reverse));// output:this is a bugthis is a test
 * @param {String} tmpl html模板字符串
 * @param {JSON} opts html模板配置
 * @param {String} opts.uniqueID html模板ID的唯一ID
 * @param {RegExp} opts.pattern html模板替换项的正则表达式
 * @author wq | wangqiang1@staff.sina.com.cn
 * @class
 */
SinaEditor.regist('ui.HTMLTemplate', function (SE) {
    var Util = SE.Util, DOMUtil = SE.DOMUtil;
    var HTMLTemplate = function (tmpl, opts) {
        var self = this;

        if (!tmpl) {
            throw new Error('tmpl未定义');
        }

        self.opts = Util.merge(opts, {
            uniqueID: Util.uniqueId('template'),
            pattern: /(#\{(.*?)\})/g
        });
        self.domUtil = self.opts.domUtil || new DOMUtil();
        self.tmpl = tmpl;
    };
    HTMLTemplate.prototype = {
        constructor: HTMLTemplate,
        /**
         * 渲染单条数据的方法
         * @param {Object} data 渲染模板所需要的数据,对应与模板中需要的数据
         * @return {String} 替换好的模板
         * @example
         * var tpl = 'this is a #{vo}';
         *
         */
        evaluate: function (data) {
            var self = this;
            return self.tmpl.replace(self.opts.pattern, function () {
                return data[arguments[2]] || "";
            });
        },
        /**
         * 渲染多条数据的方法
         * @param {Array} data 渲染模板所需要的数据(多条) data[{},{}]
         * @param {Object} reverse    是否进行反向
         */
        evaluateMulti: function (data, reverse) {
            var self = this;
            var _buffer = [];
            self.domUtil.each(data, function () {

            });
            self.domUtil.each(data, Util.bind(function (i, v) {
                i = reverse ? data.length - i : i;
                _buffer[i] = self.evaluate(v);
            }, self));
            return _buffer.join("");
        },
        /**
         * 获取HTML替换#{XXXX}后的字符串
         * @example
         var htmlTpl = '<div id="#{entity}" class="goTop" ><a id="#{goToTop}" title="返回顶部" onclick="return false" href="javascript:void(0)"></a></div>';
         var tpl = new HtmlTemplate(htmlTpl);
         var htmlStr = tpl.getHtmlString();
         console.log(htmlStr);
         * @return {String}
         */
        getHtmlString: function () {
            if (!this._htmlStr) {
                this._htmlStr = this.evaluate(this.getNodeIds());
            }
            return this._htmlStr;
        },
        /**
         * 获取替换#{XXXX}的字符串数组。<br>
         * @example
         *    var htmlTpl = '<div id="#{entity}" class="goTop" ><a id="#{goToTop}" title="返回顶部" onclick="return false" href="javascript:void(0)"></a></div>';
         *   var tpl = new HtmlTemplate(htmlTpl);
         *   var ids = tpl.getNodeIds();
         *   console.log(ids);
         *
         * // 一般存储的是ID
         * @return {Array}
         */
        getNodeIds: function () {
            if (!this._nodes) {
                var p = /\{[^\}]+(?=\})/g, i, nodes = {}, rets, r, uniqueID = this._getUniqueID();

                this.__templateNodesIDs = this.tmpl.match(p);
                rets = this.__templateNodesIDs;
                if (rets) {
                    i = rets.length;
                    while (i--) {
                        r = rets[i].replace("{", "");
                        nodes[r] = r + '_' + uniqueID;
                    }
                }
                this._nodes = nodes;
            }
            return this._nodes;
        },
        /**
         * 获取替换#{XXXX}的字符串。<br>
         * @example
         *    var htmlTpl = '<div id="#{entity}" class="goTop" ><a id="#{goToTop}" title="返回顶部" onclick="return false" href="javascript:void(0)"></a></div>';
         *   var tpl = new HtmlTemplate(htmlTpl);
         *   var id = tpl.getNodeId("entity");
         *   console.log(id);
         *
         * // 一般存储的是ID
         * @param  {String} name 节点名称
         * @return {String}
         */
        getNodeId: function (name) {
            if (!this._nodes) {
                this.getNodeIds();
            }
            return this._nodes[name];
        },
        /**
         * 获取#{XXXX}的节点。<br>
         * @example
         *    var htmlTpl = '<div id="#{entity}" class="goTop" ><a id="#{goToTop}" title="返回顶部" onclick="return false" href="javascript:void(0)"></a></div>';
         *   var tpl = new HtmlTemplate(htmlTpl);
         *   var id = tpl.getNode("entity");
         *   console.log(id);
         *
         * // 一般存储的是ID
         * @param  {String} name 节点名称
         * @return {HTMLElement}
         */
        getNode: function (name) {
            var id = this.getNodeId(name);
            return (!id || !id.length) ? null : this.domUtil.$('#' + id)[0];
        },

        /**
         * 获取唯一ID
         */
        _getUniqueID: function () {
            if (!this.opts.uniqueID) {
                this.opts.uniqueID = Util.uniqueId('template');
            }
            return this.opts.uniqueID;
        }
    };

    return HTMLTemplate;
});