/**
 * 编辑器 dom 工具类库
 * @module DOMUtil
 * @constructor
 * @author gaolei2@staff.sina.com.cn
 * @param {HTMLDocument} doc - document对象
 * @param {HTMLWindow} win - window对象
 * @param {HTMLElement} body - 编辑器根节点
 */
SinaEditor.regist('DOMUtil', function (SE) {
    var Util = SE.Util, dtd = SE.dtd, env = SE.env;
    var hasContain = !!(document.createElement('div').contains);

    function DOMUtil(doc, win, body) {
        var self = this;
        self.doc = doc || document;
        self.win = win || window;
        self.body = body || self.doc.body;
        self.dtd = dtd;
        self.qwery = qwery();

        self.isBlock = function (node) {
            return dtd.$block[node.nodeName.toLowerCase()];
        };
    };

    DOMUtil.prototype = {

        constructor: DOMUtil,
        isIE: env.$msie,
        dtd: dtd,
        /**
         * 根据 selector 获得节点
         * @param {String} selector - 选择器
         * @param {Node} root - 根节点
         * @return {Node | NodeList} 符合 selector 的节点
         */
        $: function (selector, root) {
            var root = root || this.body || this.doc;

            // 直接调用qwery方法 https://github.com/ded/qwery
            return this.qwery(selector, root);

            // return this.getNodes(selector, root);
        },
        /**
         * 将child节点插入到parent节点的最后位置
         * @param {Node} child 将要插入的子节点
         * @param {HTMLElement} parent 父节点
         * @returns {Node} child 插入后的子节点
         */
        append: function (child, parent) {
            return parent.appendChild(child);
        },
        /**
         * 获取selector的内容
         * @deprecated
         * @param selector
         * @param root
         * @returns {*}
         */
        getNodes: function (selector, root) {
            var root = root || this.body || this.doc, match, simpleReg = /^#([\w\-]+)$|^\.([\w\-]+)$|^([\w\-]+)|^([\[\w\-\]]+)$/;
            // tagReg = /^<(\w+)>({.+})?(.*)(?:<\/\1>)?$/;

            if (match = simpleReg.exec(selector)) {
                if (match[1]) {
                    return this.doc.getElementById(match[1]);
                } else if (match[2]) {
                    return this.__getByCls(match[2], root);
                } else if (match[3]) {
                    return root.getElementsByTagName(match[3]);
                } else if (match[4]) {
                    return this.__getByAttr(match[4], root);
                }
            }
        },

        /**
         * 获取节点的属性值，或者设置节点的属性值
         * @param {HTMLElement} el - 需要设置属性的节点
         * @param {String} name  - 属性名称
         * @param {String} value  - 属性值，如果不传入，则返回节点属性值; 当name = 'style'时，value = [JSON | String]
         * @return {String|DOMUtil}  value - 参数为undefined时返回节点属性值，value不为undefined返回DOMUtil本身
         */
        attr: function (el, name, value) {
            if (!this.isNode(el) && 11 != el.nodeType) {
                return undefined;
            }
            if ('undefined' === typeof value) {

                switch (name) {
                    case 'id':
                        value = el.id;
                        break;
                    case 'className':
                    case 'class':
                        value = el.className;
                        break;
                    case 'style':
                        cssText = el.style.cssText;
                        break;
                    case 'innerHTML':
                    case 'value':
                        value = el[name];
                        break;
                    default:
                        value = el.getAttribute && el.getAttribute(name);
                }
                return value;
            } else {
                switch (name) {
                    case 'id':
                        el.id = value;
                        break;
                    case 'className':
                    case 'class':
                        el.className = value;
                        break;
                    case 'style':
                        if ('string' === typeof value) {
                            el.style.cssText = el.style.cssText + ";" + value;
                        } else {
                            this.setStyle(el, value);
                        }

                        break;
                    case 'innerHTML':
                        el[name] = value;
                        break;
                    case 'value':
                        el.value = value;
                        break;
                    default:
                        el.setAttribute(name, value);
                }
            }
            return this;
        },

        /**
         * 删除节点属性
         * @param {HTMLElement|NodeList|Array} el 节点或节点集合
         * @param {String|Array} attrName 属性值
         */
        removeAttr: function (el, attrName) {
            var elems, self = this;
            if ('length' in el) {
                elems = el;

            } else {
                elems = [el]
            }
            self.each(elems, function (i, el) {
                if (!Util.isArray(attrName)) {
                    attrName = [attrName];
                }
                self.each(attrName, function (i, attr) {
                    el.removeAttribute(attr);
                });
            });

        },

        /**
         * 批量设置节点属性
         * @param {HTMLElement} el - 设置属性html节点
         * @param {JSON} attrs - 属性json object
         */
        attrs: function (el, attrs) {
            for (var attr in attrs) {
                if (attrs.hasOwnProperty(attr)) {
                    this.attr(el, attr, attrs[attr]);
                }
            }
            return this;
        },

        /**
         * 设置CSS样式<br>
         * @memberof DOMUtil
         * @example
         * domUtil.setStyle(el,{
         *     "border": "1px solid red;",
         *     "backgroundColor": "red",
         *     "background-color": "green"
         * });
         *
         * @param {HTMLElement} el - 设置样式html节点
         * @param {JSON} style - 样式json
         */
        setStyle: (function () {
            var env = SinaEditor.env;
            var belowIE9 = (env.$msie && env.version < 9);
            var styleFloat = belowIE9 ? 'styleFloat' : 'cssFloat';
            var opacity = belowIE9 ? function (el, val) {
                el.style.filter = "alpha(opacity=" + (val * 100) + ")";
                if (!el.currentStyle || !el.currentStyle.hasLayout) {
                    el.style.zoom = 1;
                }
            } : function (el, val) {
                el.style.opacity = val;
            };

            return function (el, style) {
                var self = this;
                if ('length' in el) {
                    self.each(el, function (i, node) {
                        self.setStyle(node, style);
                    });
                } else {
                    self.each(style, function (styleName, val) {
                        // 暂时不支持 {"background-color": "green"} 这种方式
                        var arr;
                        if ((arr = styleName.split('-')) && (1 < arr.length)) {
                            styleName = arr[0];
                            for (var i = 1; i < arr.length; i++) {
                                styleName += arr[i].charAt(0).toUpperCase() + arr[i].substring(1);
                            }
                        }
                        switch (styleName) {
                            case 'opacity':
                                opacity(el, val);
                                break;
                            case 'float':
                                styleName = 'float';
                            default:
                                try {
                                    el.style[styleName] = val;
                                } catch (e) {
                                }

                        }

                    });
                }
                return this;
            }
        })(),
        /**
         * 获取指定el样式
         * @memberof DOMUtil
         * @example
         * domUtil.getStyle(el, "left");
         * @param {HTMLElement} el 节点对象
         * @param {string} property 样式名
         * @returns {string}
         */
        getStyle: (function () {
            var env = SinaEditor.env;
            var belowIE9 = (env.$msie && env.version < 9);
            var changeProperty = function (p) {
                var arr;
                if ((arr = p.split('-')) && (1 < arr.length)) {
                    p = arr[0];
                    for (var i = 1; i < arr.length; i++) {
                        p += arr[i].charAt(0).toUpperCase() + arr[i].substring(1);
                    }
                }
                return p;
            };

            if (belowIE9) {
                return function (el, property) {
                    var self = this, cssValue, cssText, css = property;

                    property = changeProperty(property);
                    switch (property) {
                        // 透明度
                        case "opacity":
                            var val = 100;
                            try {
                                val = el.filters['DXImageTransform.Microsoft.Alpha'].opacity;
                            } catch (e) {
                                try {
                                    val = el.filters('alpha').opacity;
                                } catch (e) {
                                }
                            }
                            cssValue = val / 100;
                            break;
                        // 浮动
                        case "float":
                            property = "styleFloat";
                        default:
                            var value = el.currentStyle ? el.currentStyle[property] : null;
                            cssValue = (el.style[property] || value);
                    }

                    if (!cssValue && (cssText = el.style.cssText)) {
                        var reg = new RegExp(css + ':[ ]*([^;]+)', 'i');
                        cssValue = cssText.match(reg);
                        cssValue = cssValue ? cssValue[1] : undefined;
                    }
                    return cssValue;
                }

            } else {
                return function (el, property) {
                    var self = this;
                    property = changeProperty(property);
                    // 浮动
                    if (property == "float") {
                        property = "cssFloat";
                    }
                    // 获取集合
                    try {
                        var computed = self.doc.defaultView.getComputedStyle(el, "");
                    } catch (e) {
                    }
                    return el.style[property] || (computed ? computed[property] : null);
                }
            }

        })(),

        /**
         * 设置el节点的CSS样式，此方法会覆盖原来的样式
         * @example
         * domUtil.setCSSText(el, 'float:left;text-align:center;');
         * // or
         * domUtil.setCSSText(el, {float:'left', textAlign:'center', 'background-color': 'red'});
         * @param {HTMLElement} el 设置样式的节点
         * @param {String|JSON} cssText style字符串或JSON串
         */
        setCSSText: function (el, cssText) {
            /**
             * 将大写字母转换为水平线加小写字母的形式
             * @example
             * upperToHorizontalLineAndLower("cssFloatBorderColor");
             * // return "css-float-border-color"
             * @param {String} text
             * @returns {String}
             */
            function upperToHorizontalLineAndLower(text) {
                text = text.replace(/([A-Z])/g, function (match) {
                    return '-' + match.toLowerCase();
                });
                return text;
            }

            if ('object' === typeof cssText) {
                var css = [];
                var env = SinaEditor.env;
                var belowIE9 = (env.$msie && env.version < 9);
                this.each(cssText, function (p, val) {
                    switch (p) {
                        case 'styleFloat':
                        case 'cssFloat':
                            p = 'float';
                            break;
                        case 'opacity':
                            if (belowIE9) {
                                p = 'filter';
                                val = "alpha(opacity=" + (val * 100) + ")";
                            }
                            break;
                    }
                    css.push(upperToHorizontalLineAndLower(p), ':', val, ';');
                });
                cssText = css.join('');
            }
            el.style.cssText = cssText;
        },
        /**
         * 获取Range的start节点，如果1 == startContainer.nodeType，返回startContainer.item(startOffset)
         * @param {Range} rng 当前Range
         * @returns {Node}
         */
        getStart: function (rng) {
            var start = rng.startContainer, startOffset = rng.startOffset;
            if (start.nodeType !== 1) {
                return start;
            } else if (start.childNodes.length > startOffset) {
                return start.childNodes.item(startOffset);
            } else {
                return start;
            }
        },
        /**
         * 获取Range的end节点，如果1 == endContainer.nodeType，endContainer.item(endOffset - 1)
         * @param {Range} rng 当前Range
         * @returns {Node}
         */
        getEnd: function (rng) {
            var end = rng.endContainer;
            var returnObj;
            if (1 === end.nodeType && (returnObj = end.childNodes[rng.endOffset - 1])) {
                return returnObj;
            } else {
                return end;
            }
        },
        /**
         * 将类数组或对象转换成数组
         * @param {NodeList | Node} arr - 需要转换成数组的内容
         * @return {Array} 数组
         */
        toArray: function (arr) {
            var resultArr = [];
            if (!this.isNode(arr)) {
                if ('length' in arr) {
                    for (var i = 0, l = arr.length; i < l; i++) {
                        resultArr[i] = arr[i];
                    }
                } else {
                    for (var i in arr) {
                        resultArr[i] = arr[i];
                    }
                }
            } else {
                resultArr.push(arr);
            }
            return resultArr;
        },
        /**
         * 判断节点是否是元素，文本或或文档片段节点
         * @param {Node} node - 需要判断的节点元素
         * @return {Boolean}
         */
        isNode: function (node) {
            return node && node.nodeName && (node.nodeType == 1 || node.nodeType == 11 || node.nodeType == 3);
        },

        __getByCls: function (cls, root) {
            var children, resultArr = [], hasByCls = !!this.doc.getElementsByClassName;

            if (hasByCls) {
                return root.getElementsByClassName(cls);
            } else {
                children = root.getElementsByTagName("*");
                this.each(children, function (index, elem) {
                    if (elem.className.indexOf(cls) >= 0) {
                        resultArr.push(elem);
                    }
                }, true);
                return resultArr;
            }
        },

        __getByAttr: function (str, root) {
            var children, resultArr = [];
            children = this.toArray(root.getElementsByTagName("*"));
            var attr = attr.replace(/\[|\]/g, "").split("=");

            if (attr.length === 1) {
                this.each(children, function (index, elem) {
                    if (elem.getAttribute(attr[0])) {
                        resultArr.push(elem);
                    }
                });
            } else if (attr.length === 2) {
                this.each(children, function (index, elem) {
                    if (elem.getAttribute(attr[0]) === attr[1]) {
                        resultArr.push(elem);
                    }
                });
            }
            return resultArr;
        },
        /**
         * 查找公共父节点
         * @param nodeA
         * @param nodeB
         * @returns {*}
         */
        getCommonAncestor: function (nodeA, nodeB) {
            if (!nodeA || !nodeB) {
                return;
            }
            if (nodeA == nodeB) {
                return nodeA;
            }
            if (nodeA.nodeType == 3) {
                nodeA = nodeA.parentNode
            }
            if (nodeB.nodeType == 3) {
                nodeB = nodeB.parentNode
            }
            var method = 'compareDocumentPosition', bitmask = 0x0010;
            if (hasContain) {
                method = 'contains';
                bitmask = 1;
            }

            while (nodeA) {

                if ((nodeA[method](nodeB) & bitmask) !== bitmask) {
                    nodeA = nodeA.parentNode;
                    continue;
                } else {
                    return nodeA;
                }
            }
            return undefined;
        },
        /**
         * 遍历dom树treewalker
         * @param start 开始节点
         * @param root  根节点，遍历到此节点结束
         * @param filter 过滤函数
         * @param walkParent
         * @returns {Walker}
         */
        treeWalker: function (start, root, filter, walkParent) {
            var root = root || this.body || this.doc.body;
            var Walker = function (start, root, filter, walkParent) {

                var node = start, __findSibling = function (node, root, start_name, sibling_name, shallow, filter) {
                        var sibling, parent, tmpNode;
                        filter = filter || function (node) {
                            return !!node;
                        };
                        if (node) {
                            tmpNode = node[start_name];
                            if (!shallow && tmpNode) {
                                if (false !== filter(tmpNode)) {
                                    return tmpNode;
                                } else {
                                    return __findSibling(tmpNode, root, start_name, sibling_name, shallow, filter);
                                }

                            }

                            if (node !== root) {
                                sibling = node[sibling_name];
                                if (sibling && (false !== filter(sibling))) {
                                    return sibling;
                                }

                                while ((parent = node.parentNode) && parent != root) {
                                    while (sibling = parent[sibling_name]) {
                                        if (sibling && (false !== filter(sibling))) {
                                            return sibling;
                                        } else {
                                            parent = sibling;
                                        }
                                    }
                                    node = parent;
                                }
                            }
                        }
                    }
                this.current = function () {
                    return node;
                }, this.next = function (shallow) {
                    var nextNode = __findSibling(node, root, 'firstChild', 'nextSibling', shallow, filter);
                    if (nextNode) {
                        node = nextNode;
                    }
                    return nextNode;
                }, this.prev = function (shallow) {
                    var prevNode = __findSibling(node, root, 'lastChild', 'previousSibling', shallow, filter);
                    if (prevNode) {
                        node = prevNode;
                    }
                    return prevNode;
                }

            };
            return new Walker(start, root, filter, walkParent);
        },

        /**
         * 查找从start到end节点的所有TextNode节点
         * @param start
         * @param end
         * @param ancestor
         * @returns {Array}
         */
        findAllTextNodes: function (start, end, ancestor) {

            function getTextNodes(walker, end, nodes) {
                var current = walker.current();
                while (current) {
                    if (3 === current.nodeType) {
                        nodes.push(current);
                    }
                    if (end == current) {
                        break;
                    }
                    current = walker.next();
                }
                return nodes;
            }

            ancestor = ancestor || this.body;

            var walker = this.treeWalker(start, ancestor), nodes = [];
            nodes = getTextNodes(walker, end, nodes);
            if (1 === end.nodeType) {
                walker = this.treeWalker(end.firstChild, end);
                nodes = getTextNodes(walker, end, nodes);
            }

            return nodes;
        },

        /**
         * 为节点添加className
         * @param elem
         * @param cls
         * @returns {*}
         */
        addClass: function (elem, cls) {
            if (!elem || !cls) {
                return false;
            }
            if (!this.hasClass(elem, cls)) {
                elem.className += " " + cls;
            }
            return elem;
        },
        /**
         * 删除节点className
         * @param elem
         * @param cls
         * @returns {*}
         */
        delClass: function (elem, cls) {
            if (!elem || !cls) {
                return false;
            }
            if (this.hasClass(elem, cls)) {
                elem.className = Util.trim(elem.className.replace(cls, ""));
            }
            return elem;
        },
        /**
         * 查询节点是否包含名为cls的className
         * @param elem
         * @param cls
         * @returns {boolean}
         */
        hasClass: function (elem, cls) {
            if (!elem || !cls) {
                return false;
            }
            var classReg = new RegExp("(^|\\s+)" + cls + "(\\s+|$)", 'g');
            return classReg.test(elem.className);
        },
        /**
         * 遍历arr对象，示例：
         * @example
         * // arr is Array
         * var arr = [1, {count:2}, 3, 4];
         * var domUtil = new DOMUtil();
         * domUtil.each(arr, function(index, item, arr){
         *     console.log('index', index);
         *     console.log('item', item);
         * }, false);
         *
         * // arr is Object
         * var obj = {count:2, name:'lava'};
         * var domUtil = new DOMUtil();
         * domUtil.each(obj, function(key, val, obj){
         *     console.log('key', key);
         *     console.log('val', val);
         * }, false);
         *
         * @param {Array|Object} arr 需要需要遍历的数组或对象
         * @param {Function} fun  处理函数
         * @param {Boolean} deep  是否深度遍历
         * @returns {Array|Object}
         */
        each: function (arr, fun, deep) {
            if (!arr) {
                return;
            }
            if ('length' in arr) {
                var i = 0, len = arr.length, isBreak;
                for (; i < len; i++) {
                    if (this.isNode(arr[i])) {
                        isBreak = fun.call(arr[i], i, arr[i], arr);
                        if (false === isBreak) {
                            break;
                        }
                        deep ? forEach(arr[i].children, fun, deep) : this.__emptyFun;
                    } else {
                        isBreak = fun.call(arr[i], i, arr[i], arr);
                        if (false === isBreak) {
                            break;
                        }
                    }
                }
                return arr;
            } else {
                for (var p in arr) {
                    if (arr.hasOwnProperty(p)) {
                        fun.call(arr[p], p, arr[p], arr);
                    }
                }
                return arr;
            }
        },

        __emptyFun: function () {
        },
        /**
         * 判断源节点src是否包含目标节点des
         * @param {Node} srcElement 源节点
         * @param {Node} desElement 目标节点
         * @returns {Boolean}
         */
        contains: function (srcElement, desElement) {
            if (!srcElement || !desElement) {
                return false;
            }
            var result = this.getNodePosition(srcElement, desElement);
            return !!(result & 0x10) || result === 0;
        },

        /**
         * 判断elem的父元素是否包含tags所含的标签
         * @param elem
         * @param tags
         */
        isSpecificParent: function (elem, tags, beSelf) {
            var pNode, pTag, tt, self = this;
            if (elem && tags) {
                if (typeof tags === 'string') {
                    tags = tags.split(',');
                } else if (tags.length === undefined) {
                    tags = this.toArray(tags);
                }

                pNode = beSelf && elem.nodeType == 1 ? elem : elem.parentNode;
                while (pNode && pNode !== this.body) {
                    pTag = pNode.nodeName.toLowerCase();
                    for (var i = 0, l = tags.length; i < l; i++) {
                        var tag = tags[i];
                        if (typeof tag !== 'string') {
                            if (self.isSameElement(tag, pNode)) {
                                return pNode;
                            }
                            continue;
                        }
                        tt = tags[i].toLowerCase();
                        if (tt === pTag) {
                            return pNode;
                        }
                    }
                    pNode = pNode.parentNode;
                }
                return false;
            }
        },

        /**
         * 删除节点本身
         *
         * @param {HTMLNode} node 将要删除的节点
         * @param {boolean} keepChild 是否要保留子节点，默认为false
         */
        remove: function (node, keepChild) {
            if (!node.parentNode) {
                return false;
            }
            if (keepChild) {
                while (node.firstChild) {
                    node.parentNode.insertBefore(node.firstChild, node);
                }
            }
            return node.parentNode.removeChild(node);
        },

        /**
         * 找到指定节点的编辑器初始根节点
         * @param {HTMLNode} elem 节点
         */
        parentUntilBody: function (elem) {
            if (elem.nodeType == 9) {
                return elem;
            }
            var pNode = elem;
            if (pNode == this.body) {
                return pNode;
            }
            while (pNode) {
                if (pNode == this.body) {
                    return pNode;
                } else {
                    pNode = pNode.parentNode;
                }
            }
            return null;
        },
        /**
         * 查找节点elem的前一个兄弟节点
         * @param {Node} elem
         * @returns {Node}
         */
        prev: function (elem) {
            return this.__findNode(elem, 'previousSibling');
        },
        /**
         * 查找节点elem的后一个兄弟节点
         * @param {Node} elem
         * @returns {Node}
         */
        next: function (elem) {
            return this.__findNode(elem, 'nextSibling');
        },

        __findNode: function (elem, dir) {
            var node = elem[dir];
            while (node && node.nodeType !== 1) {
                node = node[dir];
            }
            return node || null;
        },
        /**
         * 创建TextNode节点
         * @param {String} txt
         * @returns {TextNode}
         */
        createText: function (txt) {
            return this.doc.createTextNode(txt);
        },
        /**
         * 创建一个文档碎片
         * @returns {DocumentFragment} frag 新创建的文档碎片
         */
        createFragment: function () {
            return this.doc.createDocumentFragment();
        },
        /**
         * 为节点node设置属性
         * @param {HTMLElement} node
         * @param {JSON} attrs
         * @returns {HTMLElement}
         */
        setAttributes: function (node, attrs) {
            var self = this;
            self.each(attrs, function (attr, value) {
                self.attr(node, attr, value);
            });
            return node;
        },
        /**
         * 创建一个TagName为name的节点
         * @param {String} name  节点tagname
         * @param {JSON}  attrs   节点属性
         * @param {String} html  节点内部包含的html
         * @returns {HTMLElement}
         */
        create: function (name, attrs, html) {
            var self = this, el = self.doc.createElement(name);
            if (attrs) {
                self.attrs(el, attrs)
            }
            // console.log(el.style);
            if ('string' === typeof html) {
                el.innerHTML = html;
            }
            return el;
        },

        /**
         * createCSSClass()
         * http://www.happycode.info/
         * @param {string} selector
         * @param {string} style
         */
        createCSSClass: function (selector, style) {

            function getHeads() {
                return doc.getElementsByTagName("head");
            }

            var doc = this.document, styleSheet, mediaType, heads;

            if (!doc.styleSheets) {
                return;
            }
            heads = getHeads();
            if (heads.length == 0) {
                return;
            }

            if (doc.styleSheets.length > 0) {
                for (i = 0; i < doc.styleSheets.length; i++) {
                    if (doc.styleSheets[i].disabled) {
                        continue;
                    }
                    var media = doc.styleSheets[i].media;
                    mediaType = typeof media;

                    if (mediaType == "string") {
                        if (media == "" || (media.indexOf("screen") != -1)) {
                            styleSheet = doc.styleSheets[i];
                        }
                    } else if (mediaType == "object") {
                        if (media.mediaText == "" || (media.mediaText.indexOf("screen") != -1)) {
                            styleSheet = doc.styleSheets[i];
                        }
                    }

                    if (typeof styleSheet != "undefined") {
                        break;
                    }
                }
            }

            if (typeof styleSheet == "undefined") {
                var styleSheetElement = doc.createElement("style");
                styleSheetElement.type = "text/css";

                heads[0].appendChild(styleSheetElement);

                for (i = 0; i < doc.styleSheets.length; i++) {
                    if (doc.styleSheets[i].disabled) {
                        continue;
                    }
                    styleSheet = doc.styleSheets[i];
                }

                var media = styleSheet.media;
                mediaType = typeof media;
            }

            if (mediaType == "string") {
                for (i = 0; i < styleSheet.rules.length; i++) {
                    if (styleSheet.rules[i].selectorText.toLowerCase() == selector.toLowerCase()) {
                        styleSheet.rules[i].style.cssText = style;
                        return;
                    }
                }

                styleSheet.addRule(selector, style);
            } else if (mediaType == "object") {
                for (i = 0; i < styleSheet.cssRules.length; i++) {
                    if (styleSheet.cssRules[i].selectorText.toLowerCase() == selector.toLowerCase()) {
                        styleSheet.cssRules[i].style.cssText = style;
                        return;
                    }
                }

                styleSheet.insertRule(selector + "{" + style + "}", 0);
            }
        },
        /**
         * 根据指定的html，创建节点
         * @param {string} html
         * @returns {DocumentFragment}
         */
        createElementByHTML: function (html) {
            var tmpDiv = this.doc.createElement('div');
            tmpDiv.innerHTML = html;
            var frag = this.createFragment();
            this.each(tmpDiv.childNodes, function (i, el) {
                frag.appendChild(el);
            });
            tmpDiv = null;
            return frag;
        },
        /**
         * 获取doc的window对象
         * @param {HTMLDocument} doc 可选参数，document对象
         * @returns {DocumentView|Window}
         */
        getWin: function (doc) {
            doc = doc || this.doc;
            return doc.defaultView || doc.parentWindow;
        },
        /**
         * 获取或设置节点的innerHTML
         * @param {Node} elem - dom节点
         * @param {String} str - html片段
         * @returns {Node | String}
         */
        html: function (elem, str) {
            if (!elem) {
                return;
            }
            if (typeof str != undefined && typeof str == 'string') {
                elem.innerHTML = str;
                return elem;
            } else {
                return elem.innerHTML;
            }
        },

        /**
         * 获取节点的所有父节点
         * @param {Node} elem - dom节点
         * @param {Number|Boolean} count - numer取得父节点层级数, boolean是否包含自身
         * @param {List} fn - 节点的所有父节点集合
         */
        parents: function (elem, count) {
            var resultArr = [];
            var isCount = (typeof count === 'number');
            var pNode = (count === true) ? elem : elem.parentNode;
            // 直到document节点
            while (pNode && pNode != this.body) {
                if (isCount) {
                    if (count === 0) {
                        return resultArr;
                    }
                    count--;
                }
                resultArr.push(pNode);
                pNode = pNode.parentNode;

            }
            return resultArr;
        },
        /**
         * Note that we cannot use splitText() because it is bugridden in IE 9.
         * @param node
         * @param index
         * @returns {Node}
         */
        splitText: function (node, index) {
            var newNode = node.cloneNode(false);
            newNode.deleteData(index, node.length);
            node.deleteData(0, index);
            this.insertBefore(newNode, node);
            return node;
        },
        /**
         * 获取节点的位置
         * @param elem
         * @returns {number}
         */
        getIndexByChild: function (elem) {
            // console.log(elem, this.isNode(elem));
            if (!elem || !elem.parentNode) {
                //TODO 暂时添加，后期移除
                // debugger;
            }
            ;
            var parent = elem.parentNode, i = -1, childNodes = parent.childNodes;
            for (var l = childNodes.length - 1; i < l; i++) {
                if (elem === childNodes[i]) {
                    break;
                }
            }
            return i;
        },
        /**
         * 获取节点el的文本
         * @param el
         * @param text
         * @returns {*}
         */
        text: function (el, text) {
            var hasText = ('string' === typeof text);
            if ('textContent' in el) {
                hasText && (el.textContent = text);
                return el.textContent;
            } else {
                hasText && (el.innerText = text);
                return el.innerText
            }
        },
        /**
         * 为节点绑定事件
         * @param {Node|Array} elem - dom节点
         * @param {String} type - 事件名称
         * @param {Function} fn - 事件回调函数
         * @param {Boolean} capture - 是否为事件捕获阶段添加事件
         * @param {String} selector - 选择
         */
        on: function (elem, type, fn, capture, selector) {
            if (!elem) {
                return this;
            }
            var me = this;
            var bind = function (el) {
                var types = type.split(' '), pre = '', method = 'addEventListener';
                if (!(method in el)) {
                    method = 'attachEvent';
                    pre = 'on';
                }
                capture = capture || false;

                me.each(types, function (idx, type) {
                    if (selector === undefined) {
                        el[method](pre + type, function (evt) {
                            var e = me.fixEvent(evt);
                            fn.call(el, e);
                        }, capture);
                    } else {
                        el[method](pre + type, me.delegate(selector, function (evt) {
                            var e = me.fixEvent(evt);
                            fn.call(this, e);
                        }, el));
                    }
                });

            };
            if (Util.isArray(elem) || (elem.length && elem.item)) {
                me.each(elem, function (i, el) {
                    bind(el);
                });
            } else {
                bind(elem);
            }
            return this;
        },

        delegate: function (selector, fn, el) {
            var _this = this;
            var findTarget = function (target, root) {

                var i, array = _this.$(selector, root);
                for (; target && target !== root; target = target.parentNode) {
                    for (i = array.length; i--;) {
                        if (array[i] === target) return target;
                    }
                }
            }
            return function (e) {
                var e = _this.fixEvent(e);
                var target = findTarget(e.target, el);
                if (target) {
                    fn.apply(target, arguments);
                }
            }
        },
        /**
         * 移除节点的绑定事件
         * @param {Node} elem - dom节点
         * @param {Function} fn - 事件回调函数
         * @param {String} type - 时间名称
         */
        off: function (el, type, fn) {
            var types = type.split(' '), pre = '', method = 'removeEventListener';
            if (!(method in el)) {
                method = 'detachEvent';
                pre = 'on';
            }
            this.each(types, function (idx, type) {
                el[method](pre + type, fn);
            });
            return this;
        },
        /**
         * 修复DOMEvent时间
         * @param e
         * @returns {Event}
         */
        fixEvent: function (e) {
            e = e || this.win.event;
            if (!e.target) {
                e.target = e.srcElement;
            }
            if (!e.stopPropagation) {
                e.stopPropagation = function () {
                    e.cancelBubble = true;
                }
            }
            if (!e.preventDefault) {
                e.preventDefault = function () {
                    e.returnValue = false;
                }
            }
            if (!e.stop) {
                e.stop = function () {
                    e.stopPropagation();
                    e.preventDefault();
                }
            }
            if (SE.env.$msie && (9 > SE.env.version)) {
                if ('mouseover' == e.type) {
                    e.relatedTarget = e.fromElement;
                } else if ('mouseout' == e.type) {
                    e.relatedTarget = e.toElement;

                }
            }
            return e;
        },
        /**
         * 获取节点的left与top坐标
         * @param {Node} el
         * @returns {JSON} pos {left: 2, top: 42}
         */
        getPos: function (el) {
            if ((el.parentNode == null || el.offsetParent == null || el.style.display == "none") && el != document.body) {
                return false;
            }
            var parentNode = null;
            var pos = [];
            var box;
            var doc = el.ownerDocument;

            // FF
            pos = [el.offsetLeft, el.offsetTop];
            parentNode = el.offsetParent;
            var hasAbs = el.style.position == "absolute";

            if (parentNode != el) {
                while (parentNode) {
                    pos[0] += parentNode.offsetLeft;
                    pos[1] += parentNode.offsetTop;
                    if (!hasAbs && parentNode.style.position == "absolute") {
                        hasAbs = true;
                    }
                    parentNode = parentNode.offsetParent;
                }
            }

            // if ($SAFARI && hasAbs) {
            // pos[0] -= el.ownerDocument.body.offsetLeft;
            // pos[1] -= el.ownerDocument.body.offsetTop;
            // }
            parentNode = el.parentNode;
            // FF End
            while (parentNode.tagName && !/^body|html$/i.test(parentNode.tagName)) {
                if (parentNode.style.display.search(/^inline|table-row.*$/i)) {
                    pos[0] -= parentNode.scrollLeft;
                    pos[1] -= parentNode.scrollTop;
                }
                parentNode = parentNode.parentNode;
            }

            return {
                left: pos[0],
                top: pos[1]
            };
        },

        /**
         * 获取指定元素的ClientRect.
         * @param {HTMLElement} el 获取Rect的元素
         * @returns {ClientRect}
         */
        getRect: function (el) {
            var rect = el.getBoundingClientRect();
            if (!('width' in rect)) {
                rect = {
                    bottom: rect.bottom,
                    left: rect.left,
                    right: rect.right,
                    top: rect.top,
                    width: el.offsetWidth,
                    height: el.offsetHeight
                }
            }
            return rect;
        },
        /**
         * 将newElement插入referenceElement节点前
         * @param {HTMLElement} newElement  需要插入的节点
         * @param {HTMLElement} referenceElement  指定节点
         * @retrun {HTMLElement} newElement  插入的节点
         */
        insertBefore: function (newElement, referenceElement) {
            var pn = referenceElement.parentNode;
            return pn.insertBefore(newElement, referenceElement);
        },

        /**
         * 将newElement插入referenceElement节点后
         * @param {HTMLElement} newElement  需要插入的节点
         * @param {HTMLElement} referenceElement  指定节点
         * @retrun {HTMLElement} newElement  插入的节点
         */
        insertAfter: function (newElement, referenceElement) {
            var pn = referenceElement.parentNode;
            var node = referenceElement.nextSibling;
            if (node) {
                return this.insertBefore(newElement, node);
            } else {
                return pn.appendChild(newElement);
            }
        },
        /**
         * 将newElement插入referenceElement节点的制定位置
         * @param {HTMLElement} newElement 需要插入的节点
         * @param {HTMLElement} referenceElement 指定节点
         * @param {String} where 插入节点的位置 beforebegin:插入到referenceElement前边， afterbegin：插入到referenceElement第一个子节点之前，beforeend：插入到referenceElement最后一个子节点之后，afterend：插入到referenceElement节点后
         * @returns {HTMLElement}
         */
        insertNode: function (newElement, referenceElement, where) {
            var self = this;
            where = where.toLowerCase() || "beforeend";
            switch (where) {
                case "beforebegin":
                    return self.insertBefore(newElement, referenceElement);
                case "afterbegin":
                    if (!referenceElement.firstChild) {
                        return self.append(newElement, referenceElement);
                    } else {
                        return self.insertBefore(newElement, referenceElement.firstChild);
                    }
                case "beforeend":
                    if (!referenceElement.lastChild) {
                        return self.append(newElement, referenceElement);
                    } else {
                        return self.insertAfter(newElement, referenceElement.lastChild);
                    }
                case "afterend":
                    return self.insertAfter(newElement, referenceElement)
            }
        },
        filterNodeList: function (nodelist, filter, forAll) {
            var results = [];
            if (typeof filter != 'function') {
                var str = filter;
                filter = function (n) {
                    return Util.inArray(str.length !== undefined ? str : str.split(' '), n.tagName.toLowerCase())
                };
            }
            this.each(nodelist, function (i, n) {
                filter(n) && results.push(n)
            });
            return results.length == 0 ? null : results.length == 1 || !forAll ? results[0] : results
        },

        /**
         * 获取rng开始节点的html路径
         * @param {Range} rng
         * @returns {array} starContainer的所有父节点，包括startContainer
         */
        getElementPath: function (rng) {
            var start = rng.startContainer, offset = rng.startOffset;

            if (start.nodeType == 1 && start.childNodes.length > 0) {
                start = start.childNodes[offset] || start;
            }
            return this.parents(start, !0);
        },
        /**
         * 判断两个数组里的node节点是否相等
         * @param {array} pathA
         * @param {array} pathB
         */
        isSamePath: function (pathA, pathB) {
            var lenA = pathA.length, lenB = pathB.length, nodeA, nodeB;

            if (lenA != lenB) {
                return false;
            }

            if (0 === lenB || 0 == lenA) {
                return false;
            }

            var isSame = !1;
            for (var i = 0; i < lenA; i++) {
                nodeA = pathA[i];
                nodeB = pathB[i];
                if (3 == nodeA.nodeType && 3 == nodeB.nodeType && nodeB.nodeValue == nodeA.nodeValue) {
                    isSame = true;
                    continue;
                } else {
                    isSame = this.isSameElement(nodeA, nodeB);
                }
                if (!isSame) {
                    return false;
                }
            }

            return isSame;
        },
        /**
         *
         * @param node
         * @param root
         * @param filter
         * @param flag
         * @param guard
         * @returns {*}
         */
        getFilterTreeDom: function (node, root, filter, flag, guard) {
            var root = root || this.body || this.doc;
            var tmpNode = flag && node.firstChild, parent;

            !tmpNode && (tmpNode = node.nextSibling);

            while (!tmpNode && (parent = (parent || node).parentNode)) {
                if (parent.tagName == 'BODY' || parent == root || guard && !guard(parent)) {
                    return null;
                }
                tmpNode = parent.nextSibling;
            }

            if (tmpNode && filter && !filter(tmpNode)) {
                return this.getFilterTreeDom(tmpNode, false, filter, flag, guard);
            }
            return tmpNode;

        },
        /**
         *
         * @param node
         * @returns {*|boolean|string}
         */
        isBookMarkTag: function (node) {
            return node && node.nodeType == 1 && node.tagName == 'SPAN' && node.getAttribute('bookmarkTag');
        },
        /**
         *
         * @param node
         * @returns {number}
         */
        isEmptyInlineElement: function (node) {
            if (node.nodeType != 1 || !dtd.$removeEmpty[node.tagName]) {
                return 0;
            }
            node = node.firstChild;
            while (node) {
                //如果是创建的bookmark就跳过
                if (this.isBookMarkTag(node)) {
                    return 0;
                }
                if (node.nodeType == 1 && !this.isEmptyInlineElement(node) || node.nodeType == 3 && !!SinaEditor.noSpaceReg.test(node.nodeValue)) {
                    return 0;
                }
                node = node.nextSibling;
            }
            return 1;

        },
        /**
         *
         * @param node
         * @param ignoreNext
         * @param ignorePre
         */
        clearSpecialNode: function (node, ignoreNext, ignorePre) {
            var self = this;

            function clear(next, dir) {
                var tmpNode;
                while (next && !self.isBookMarkTag(next) && (self.isEmptyInlineElement(next) || !new RegExp(/[^\t\n\r\u200B\uFEFF]/.test(next.nodeValue)))) {
                    tmpNode = next[dir];
                    self.remove(next);
                    next = tmpNode;
                }
            };
            !ignoreNext && clear(node.nextSibling, 'nextSibling');
            !ignorePre && clear(node.previousSibling, 'previousSibling');
        },
        /**
         *
         */
        cssStyleToDomStyle: (function () {
            var test = document.createElement('div').style, cache = {
                    'float': test.cssFloat != undefined ? 'cssFloat' : test.styleFloat != undefined ? 'styleFloat' : 'float'
                };

            return function (cssName) {
                return cache[cssName] || (cache[cssName] = cssName.toLowerCase().replace(/-./g, function (match) {
                    return match.charAt(1).toUpperCase();
                }));
            };
        })(),
        /**
         *
         * @param nodeA
         * @param nodeB
         * @returns {*}
         */
        getNodePosition: function (nodeA, nodeB) {
            // 如果两个节点是同一个节点
            if (nodeA === nodeB) {
                // domUtils.POSITION_IDENTICAL
                return 0;
            }
            if (nodeA.compareDocumentPosition) {
                return nodeA.compareDocumentPosition(nodeB);
            }

            var node, parentsA = [nodeA], parentsB = [nodeB];

            node = nodeA;
            while (node = node.parentNode) {
                // 如果nodeB是nodeA的祖先节点
                if (node === nodeB) {
                    // domUtils.POSITION_IS_CONTAINED + domUtils.POSITION_FOLLOWING
                    return 10;
                }
                parentsA.push(node);

            }

            node = nodeB;
            while (node = node.parentNode) {
                // 如果nodeA是nodeB的祖先节点
                if (node === nodeA) {
                    // domUtils.POSITION_CONTAINS + domUtils.POSITION_PRECEDING
                    return 20;
                }
                parentsB.push(node);

            }

            parentsA.reverse();
            parentsB.reverse();

            if (parentsA[0] !== parentsB[0])
            // domUtils.POSITION_DISCONNECTED
                return 1;

            var i = -1;
            while (i++, parentsA[i] === parentsB[i]);
            nodeA = parentsA[i];
            nodeB = parentsB[i];

            while (nodeA = nodeA.nextSibling) {
                if (nodeA === nodeB) {
                    // domUtils.POSITION_PRECEDING
                    return 4
                }
            }
            // domUtils.POSITION_FOLLOWING
            return 2;
        },
        /**
         *
         * @param nodeA
         * @param nodeB
         * @returns {boolean}
         */
        isSameStyle: function (nodeA, nodeB, noStrict) {
            var styleA = nodeA.style.cssText.replace(/( ?; ?)/g, ';').replace(/( ?: ?)/g, ':'), styleB = nodeB.style.cssText.replace(/( ?; ?)/g, ';').replace(/( ?: ?)/g, ':');
            if (window.opera && window.opera.version) {
                styleA = nodeA.style;
                styleB = nodeB.style;
                if (styleA.length != styleB.length)
                    return false;
                for (var p in styleA) {
                    if (/^(\d+|csstext)$/i.test(p)) {
                        continue;
                    }
                    if (styleA[p] != styleB[p]) {
                        return false;
                    }
                }
                return true;
            }
            if (!styleA || !styleB) {
                return styleA == styleB;
            }
            styleA = styleA.split(';');
            styleB = styleB.split(';');
            if (styleA.length != styleB.length && !noStrict) {
                return false;
            }
            for (var i = 0, ci; ci = styleA[i++];) {
                if (!Util.inArray(styleB, ci)) {
                    return false;
                }
            }
            return true;
        },
        /**
         * 判断两个节点是否相等
         * @param {Node} nodeA
         * @param {Node} nodeB
         * @returns {boolean}
         */
        isSameElement: function (nodeA, nodeB) {
            var ie = this.isIE;
            if (3 == nodeA.nodeType && 3 == nodeB.nodeType) {
                if (3 !== nodeB.nodeType) {
                    return false;
                }
                if (nodeA !== nodeB) {
                    return false;
                }
                return true;
            }
            if (nodeA.tagName != nodeB.tagName) {
                return false;
            }

            var thisAttrs = nodeA.attributes, otherAttrs = nodeB.attributes;
            if (!(thisAttrs && thisAttrs)) {
                return false;
            }
            if (!ie && thisAttrs.length != otherAttrs.length) {
                return false;
            }
            var attrA, attrB, al = 0, bl = 0;
            for (var i = 0; attrA = thisAttrs[i++];) {
                if (attrA.nodeName == 'style') {
                    if (attrA.specified) {
                        al++;
                    }
                    if (this.isSameStyle(nodeA, nodeB)) {
                        continue;
                    } else {
                        return false;
                    }
                }
                if (ie) {
                    if (attrA.specified) {
                        al++;
                        attrB = otherAttrs.getNamedItem(attrA.nodeName);
                    } else {
                        continue;
                    }
                } else {
                    attrB = nodeB.attributes[attrA.nodeName];
                }
                if (!attrB.specified || attrA.value != attrB.value) {
                    return false;
                }
            }
            // 有可能attrB的属性包含了attrA的属性之外还有自己的属性
            if (ie) {
                for (i = 0; attrB = otherAttrs[i++];) {
                    if (attrB.specified) {
                        bl++;
                    }
                }
                if (al != bl) {
                    return false;
                }
            }
            return true;
        },
        /**
         *
         * @param node
         */
        trimWhiteTextNode: function (node) {
            function remove(dir) {
                var child;
                while ((child = node[dir]) && child.nodeType == 3 && !SinaEditor.noSpaceReg.test(child.nodeValue)) {
                    node.removeChild(child);
                }
            }

            remove('firstChild');
            remove('lastChild');
        },
        /**
         *
         * @param node
         * @param ignorePre
         * @param ignoreNext
         */
        mergeSibling: function (node, ignorePre, ignoreNext) {
            var self = this;

            function merge(rtl, start, node) {
                var next;
                if ((next = node[rtl]) && !self.isBookMarkTag(next) && next.nodeType == 1 && self.isSameElement(node, next)) {
                    while (next.firstChild) {
                        if (start == 'firstChild') {
                            node.insertBefore(next.lastChild, node.firstChild);
                        } else {
                            node.appendChild(next.firstChild);
                        }
                    }
                    self.remove(next);
                }
            }

            !ignorePre && merge('previousSibling', 'firstChild', node);
            !ignoreNext && merge('nextSibling', 'lastChild', node);
        },
        /**
         *
         * @param node
         * @param tagName
         * @param attrs
         */
        mergeChild: function (node, tagName, attrs) {
            var self = this;
            var list = node.getElementsByTagName(node.tagName.toLowerCase());
            for (var i = 0, ci; ci = list[i++];) {
                if (!ci.parentNode || self.isBookMarkTag(ci)) {
                    continue;
                }
                //span单独处理
                if (ci.tagName.toLowerCase() == 'span') {
                    if (node === ci.parentNode) {
                        self.trimWhiteTextNode(node);
                        if (node.childNodes.length == 1) {
                            node.style.cssText = ci.style.cssText + ";" + node.style.cssText;
                            if (ci.parentNode) {
                                while (ci && ci.firstChild) {
                                    ci.parentNode.insertBefore(ci.firstChild, ci);
                                }
                            }
                            self.remove(ci);
                            continue;
                        }
                    }
                    ci.style.cssText = node.style.cssText + ';' + ci.style.cssText;
                    if (attrs) {
                        var style = attrs.style;
                        if (style) {
                            style = style.split(';');
                            for (var j = 0, s; s = style[j++];) {
                                ci.style[self.cssStyleToDomStyle(s.split(':')[0])] = s.split(':')[1];
                            }
                        }
                    }
                    if (self.isSameStyle(ci, node)) {
                        if (ci.parentNode) {
                            while (ci && ci.firstChild) {
                                ci.parentNode.insertBefore(ci.firstChild, ci);
                            }
                        }
                        self.remove(ci);

                    }
                    continue;
                }
                if (self.isSameElement(node, ci)) {
                    if (ci.parentNode) {
                        while (ci && ci.firstChild) {
                            ci.parentNode.insertBefore(ci.firstChild, ci);
                        }
                    }
                    self.remove(ci);
                }
            }
        },
        /**
         *
         * @param node
         */
        mergeToParent: function (node) {
            var parent = node.parentNode, self = this;
            while (parent && dtd.$removeEmpty[parent.tagName]) {
                if (parent.tagName == node.tagName || parent.tagName == 'A') { //针对a标签单独处理
                    self.trimWhiteTextNode(parent);
                    //span需要特殊处理  不处理这样的情况 <span stlye="color:#fff">xxx<span style="color:#ccc">xxx</span>xxx</span>
                    if (parent.tagName == 'SPAN' && !self.isSameStyle(parent, node) || (parent.tagName == 'A' && node.tagName == 'SPAN')) {
                        if (parent.childNodes.length > 1 || parent !== node.parentNode) {
                            //node.style.cssText = parent.style.cssText + ";" + node.style.cssText;
                            parent = parent.parentNode;
                            continue;
                        } else {
                            //parent.style.cssText += ";" + node.style.cssText;
                            //trace:952 a标签要保持下划线
                            if (parent.tagName == 'A') {
                                //parent.style.textDecoration = 'underline';
                            }
                        }
                    }
                    if (parent.tagName != 'A') {
                        if (parent === node.parentNode) {
                            while (node && node.firstChild) {
                                node.parentNode.insertBefore(node.firstChild, node);
                            }
                            self.remove(node);
                        }
                        break;
                    }
                }
                parent = parent.parentNode;
            }
        },

        /**
         *
         * 复制nodeA的属性到nodeB
         * @nodeA nodeB
         *
         */
        copyAttrs: function (nodeA, nodeB) {
            var self = this;
            var cssText = nodeB.style.cssText;
            var attributes = nodeA.attributes;
            if (attributes) {
                if (SinaEditor.env.$msie && SinaEditor.env.version < 9) {
                    //IE下length的长度为131，每定义一个属性就减1.。哎
                    attributes = [];
                    var html = nodeA.outerHTML;
                    html.replace(/\s+([a-z0-9]+)(=['"]?([^='"\s>]+)['"]?(?=>|\s+?))?/gi, function (a, b, c, d) {
                        if (b != 'bookmarkTag' && b != 'style') {
                            attributes.push({
                                nodeType: 2,
                                value: d,
                                nodeName: b
                            });
                        }

                    });
                }

                if (attributes.length == 0) {
                    return nodeB;
                }
                var attrs = {};
                self.each(attributes, function (i, n) {
                    if (n && n.nodeType == 2) {
                        attrs[n.nodeName] = n.value;
                    }
                });
                self.setAttributes(nodeB, attrs)
            }
            if (cssText) {
                self.setAttributes(nodeB, {
                    style: cssText
                })
            }
            return nodeB;
        },
        /**
         * 将nodeA的子节点全部append到nodeB中
         * @nodeA nodeB
         */
        removeToAllChilds: function (nodeA, nodeB) {
            if (nodeA.nodeType == 1 && nodeA.childNodes.length > 0) {

                while (nodeA.firstChild) {
                    nodeB.appendChild(nodeA.firstChild);
                }
            }
            return nodeB;
        },

        /**
         *
         * 将一个文本节点的数个兄弟节点合并
         * @txtNode 要合并的节点
         */
        mergeTextNode: function (txtNode) {
            if (txtNode.nodeType != 3) {
                return;
            }
            var self = this;

            function merge(node, ltr) {
                while (node[ltr] && node[ltr].nodeType == 3) {
                    if (ltr == 'previousSibling') {
                        node.insertData(0, node[ltr].nodeValue);
                    } else {
                        node.appendData(node[ltr].nodeValue);
                    }
                    self.remove(node[ltr]);
                }
            }

            merge(txtNode, 'previousSibling');
            merge(txtNode, 'nextSibling');
            return txtNode;
        },
        /**
         * 处理mouseenter与mouseleave事件
         * @param {HTMLElement} el 监听事件的节点
         * @param {Function} enterFunc mouseenter的处理函数
         * @param {Function} leaveFunc mouseleave的处理函数
         * @param {String} selector 事件处理代理selector
         * @returns {DOMUtil}
         */
        hover: function (el, enterFunc, leaveFunc, selector) {
            var self = this;

            // 查询relatedTarget节点是否在target节点上，如果不是是则调用func
            function withInElement(evt, elem, func, type) {
                // 检测 mouse(over|out) 是否还在相同的父元素内
                var parent = evt.relatedTarget;
                // Firefox 有时候会把 relatedTarget 指定一个 XUL 元素
                // 对于这种元素，无法访问其 parentNode 属性
                try {

                    // Chrome 也类似，虽然可以访问 parentNode 属性
                    // 但结果却是 null
                    if (parent && parent !== self.doc && !parent.parentNode) {
                        return;
                    }

                    // 沿 DOM 树向上
                    while (parent && parent !== elem) {
                        parent = parent.parentNode;
                    }

                    if (parent !== elem) {
                        // 如果实际正好位于一个非子元素上面，那好，就处理事件
                        // 传入参数为事件，元素，所处位置
                        //console.log(elem);
                        func.apply(elem, [evt, elem]);
                    }

                    // 假定已经离开了元素，因为很可能鼠标放在了一个XUL元素上
                } catch (e) {
                }

            }

            // 查找hover的target节点，因为有selector，所以需要查询节点
            function findTarget(el, target) {
                var elem;
                if (selector) {
                    var elemArr = self.$(selector, el);
                    var parents = self.parents(target, true);
                    self.each(elemArr, function (i, child) {
                        self.each(parents, function (j, t) {
                            if (t == child) {
                                elem = child;
                                return false;
                            }
                        })
                        if (elem) {
                            return false;
                        }
                    });
                } else {
                    elem = el;
                }
                return elem;
            }

            enterFunc && self.on(el, 'mouseover', function (evt) {
                evt = self.fixEvent(evt);
                var target = evt.target;
                var elem = findTarget(el, target);

                withInElement(evt, elem, enterFunc, 'enter');
            }, false, selector);

            leaveFunc && self.on(el, 'mouseout', function (evt) {
                evt = self.fixEvent(evt);
                var target = evt.target;
                var elem = findTarget(el, target);
                withInElement(evt, elem, leaveFunc, 'leave');
            }, false, selector);
            return self;
        },

        breakParent: function (node, parent) {
            var tmpNode, parentClone = node, clone = node, leftNodes, rightNodes;
            do {
                parentClone = parentClone.parentNode;
                if (leftNodes) {
                    tmpNode = parentClone.cloneNode(false);
                    tmpNode.appendChild(leftNodes);
                    leftNodes = tmpNode;
                    tmpNode = parentClone.cloneNode(false);
                    tmpNode.appendChild(rightNodes);
                    rightNodes = tmpNode;
                } else {
                    leftNodes = parentClone.cloneNode(false);
                    rightNodes = leftNodes.cloneNode(false);
                }
                while (tmpNode = clone.previousSibling) {
                    leftNodes.insertBefore(tmpNode, leftNodes.firstChild);
                }
                while (tmpNode = clone.nextSibling) {
                    rightNodes.appendChild(tmpNode);
                }
                clone = parentClone;
            } while (parent !== parentClone);
            tmpNode = parent.parentNode;
            tmpNode.insertBefore(leftNodes, parent);
            tmpNode.insertBefore(rightNodes, parent);
            tmpNode.insertBefore(node, rightNodes);
            this.remove(parent);
            return node;
        },

        /**
         * 设置或获取编辑器的scrollTop
         * @param {number} top 设置的scrollTop高度，为undefined时不设置高度，返回编辑器的scrollTop
         * @returns {number} 编辑器的scrollTop
         */
        scrollTop: function (top) {
            var doc = this.doc;
            if (undefined == top) {
                return doc.body.scrollTop + doc.documentElement.scrollTop;
            } else {
                // 兼容ie与chrome等浏览器
                doc.documentElement.scrollTop = top;
                doc.body.scrollTop = top;
            }
            return top;
        }
    }
    return DOMUtil;
});
