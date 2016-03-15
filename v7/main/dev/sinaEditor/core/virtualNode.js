/*
 * dom操作虚拟类
 * contructor Elem Node
 * 依赖 DOMUtil Util dtd filterHtml
 * @author luying1@staff
 **/
;
(function (SE) {
    var Util = SE.Util, DOMUtil = SE.DOMUtil, dtd = SE.dtd;
    /*
     * Elem
     * Element构造器
     * contructor
     *
     * */
    function Elem(doc) {
        this.doc = doc || document;
        this.domUtil = new DOMUtil(this.doc);
    };

    Elem.prototype = {

        constructor: Elem,

        createRoot: function (tagName, attributes) {
            var node = new Node({
                nodeType: 9, //这个其实是document的nodeType
                tagName: tagName
            });
            if (attributes) {
                this.domUtil.setAttributes(node, attributes);
                if (attributes.style) {
                    node.setAttribute('style', attributes.style);
                }

                if (attributes.id) {
                    node.setAttribute('id', attributes.id);
                }
            }

            return node;

        },
        createElement: function (tagName, attributes) {
            var node = new Node({
                nodeType: 1,
                attributes: attributes || {},
                tagName: tagName
            });

            if (attributes) {
                this.domUtil.setAttributes(node, attributes);
                if (attributes.style) {
                    node.setAttribute('style', attributes.style);
                }
                if (attributes.id) {
                    node.setAttribute('id', attributes.id);
                }
            }
            return node;
        },

        createTextNode: function (data) {
            return new Node({
                nodeType: 3,
                nodeValue: Util.unhtml(data)
            });
        },

        createComment: function (data) {
            return new Node({
                nodeType: 8,
                nodeValue: data.replace(/<!--([^(-->)]*)-->/g, '$1')
            });
        }

    }

    /*
     * Node
     * contructor
     * 实现模拟dom树
     * */
    function Node(opts) {

        this.nodeType = opts.nodeType || 1, //低版本的js不能定义常量。这么做是不安全的。这里只是为了兼容原生的。使用时要小心

            this.previousSibling = null;

        this.nextSibling = null;

        this.parentNode = null;

        this.lastChild = null;

        this.firstChild = null;

        this.attributes = [];

        this.attrs = {};

        this.style = {};

        this.style.cssText = '';

        if (this.nodeType != 3 && !this.nodeType != 8) {

            this.children = [];

            this.tagName = opts.tagName.toUpperCase();

            this.tagNameLower = this.tagName.toLowerCase();

        } else {

            this.nodeValue = opts.nodeValue;

        }
    };

    Node.ErrorCode = {
        NODE_ERR: 'is not a node object',
        NODE_TYPE_ERR: 'nodeType error'


    }

    Node.prototype = {

        constructor: Node,

        appendChild: function (node) {
            if (this.nodeType == 3) {
                throw Error(Node.ErrorCode.NODE_TYPE_ERR);
                return null;
            }

            if (!node instanceof Node) {
                throw Error(NODE_ERR);
                return null;
            }

            if (this.parentNode && this.parentNode == node || this == node) { //这里应该遍历node节点的所有子节点都不允许为this,但考虑性能问题，省略了。
                throw Error('');
                return null
            }

            if (node.parentNode) {
                node.parentNode.removeChild(node);
            }
            node.parentNode = this;
            node.previousSibling = this.children[this.children.length - 1] || null;
            node.nextSibling = null;
            if (node.previousSibling) {
                node.previousSibling.nextSibling = node;
            }
            this.children.push(node);

            if (this.children.length == 1) {
                this.firstChild = node;
            }
            this.lastChild = node;
            return this;
        },

        insertBefore: function (node, child) {
            if (this.nodeType == 3) {
                throw Error(Node.ErrorCode.NODE_TYPE_ERR);
                return null;
            }

            if (!node instanceof Node || !child instanceof Node) {
                throw Error(NODE_ERR);
                return null;
            }

            if (this !== child.parentNode) {
                return false;
            }

            if (node.parentNode) {
                node.parentNode.removeChild(node);
            }

            node.parentNode = this;

            if (child.previousSibling) {
                child.previousSibling.nextSibling = node;
            }

            node.previousSibling = child.previousSibling;

            node.nextSibling = child;

            child.previousSibling = node;

            var i = 0, item;

            do {
                item = this.children[i];
                if (item == child) {
                    this.children.unshift(node);
                    i = null;
                    this.firstChild = node;
                    break;
                }
                if (item.nextSibling == child) {
                    this.children.splice(i, 0, node);
                    break;
                }
            } while ((item = this.children[i]) && i++)

            return this;

        },

        removeChild: function (child) {
            if (!child instanceof Node) {
                throw Error(NODE_ERR);
                return null;
            }

            if (child.parentNode != this) {
                return null;
            }

            var i = 0, childs = this.children, len = childs.length;

            for (; i < len; i++) {
                var item = childs[i], prev, next;
                if (item == child) {
                    if (prev = childs[i - 1]) {
                        prev.nextSibling = childs[i + 1] || null;
                    }

                    if (next = childs[i + 1]) {
                        next.previousSibling = childs[i - 1] || null;

                    }
                    child.previousSibling = child.parentNode = child.nextSibling = null;

                    childs.splice(i, 1);

                    this.firstChild = childs[0] || null;
                    this.lastChild = childs[childs.length - 1] || null;
                    prev = next = null;
                    break;
                }

            }

            return child;

        },

        removeChildByIndex: function (index) {
            var node = this.children[index];
            if (node) {
                node.previousSibling && (node.previousSibling.nextSibling = node.nextSibling);
                node.nextSibling && (node.nextSibling.previousSibling = node.previousSibling);
                node.parentNode = node.nextSibling = node.previousSibling = null;
                this.children.splice(index, 1);
                this.firstChild = this.children[0] || null;
                this.lastChild = this.children[this.children.length - 1] || null;

            }
            return node || null;
        },

        hasChild: function () {
            return this.children.length !== 0;
        },

        hasAttribute: function () {
            return this.attributes.length !== 0;
        },

        getAttribute: function (attrName) {
            return this.attrs[attrName] || null;
        },
        setAttribute: function (attrName, value) {

            if (!this.attrs[attrName] && this.attrs[attrName] !== null && typeof value !== undefined) {
                this.attributes.push({
                    nodeValue: value,
                    value: value,
                    nodeType: 2,
                    nodeName: attrName,
                    name: attrName
                });
            }

            this.attrs[attrName] = value;

        },
        getELementById: function (id) {
        }, //TODO:暂时不需要这些操作

        getElementsByTagName: function (tagName) {
        },

        getElementsByClass: function (className) {
        },

        getElementsByAttribute: function (attribute) {
        },

        isCompleteEmptyNode: function (isRemove) {
            var parent = this.parentNode, result = true;
            if (this.nodeType == 3 || this.nodeType == 8) {
                if (this.nodeValue.replace(/[\s\n\r\t\u200B\uFEFF]/g, '').length == 0) {
                    isRemove && this.parentNode && this.parentNode.removeChildByIndex(0);
                    return true;
                }
                return false;
            }
            if (this.hasAttribute()) {
                return false;
            }
            var i = 0, childs = this.children, item;

            for (; i < childs.length; i++) {
                if (!childs[i].isCompleteEmptyNode()) {
                    result = false;
                    if (!isRemove) {
                        break;
                    }
                } else {
                    if (isRemove) {
                        if (this.removeChildByIndex(i)) {
                            i--;
                        }

                    }
                }
            }
            if (childs.length === 0 && parent && isRemove && this.nodeType != 9 && !dtd.$empty[this.tagName]) {
                parent.removeChild(this);
            }
            return result;
        },
        parseHtml: function (html, isPaste) {
            var filter = new SinaEditor.FilterHTML;
            var rs = filter.filterHtml({
                html: html,
                root: this
            }, false, true);
            return rs;
        },
        html: function () {
            var me = this, arr = [''];

            function find(node, tmp, unit) {
                if (node.nodeType == 9) {
                    node = node.children[0];
                }
                if (!node) {
                    return '';
                }
                var next = node.nextSibling, prev = node.previousSibling;
                if (node.nodeType == 1 && dtd[node.tagName]) {
                    var length = node.children.length, tagName = node.tagNameLower;
                    if (tagName !=='style' && /*dtd.$block[tagName] || */ !node.isCompleteEmptyNode()) { //过滤空的inline标签
                        if (dtd[node.parentNode.tagName] && dtd[node.parentNode.tagName][node.tagName]) {
                            tmp[unit] += '<' + tagName;
                            if (node.hasAttribute()) {
                                var n = 0, attrs = node.attributes, nl = attrs.length, curr;
                                for (; n < nl; n++) {
                                    curr = attrs[n];
                                    tmp[unit] += ' ' + curr.name + '="' + curr.value + '"';
                                }
                            }
                            if (!dtd.$empty[tagName]) {
                                tmp[unit] += '>';
                                unit += 1;
                                tmp.splice(unit, 0, '', '</' + tagName + '>');
                            } else {
                                tmp[unit] += '/>';
                            }
                            length && (unit = find(node.children[0], tmp, unit));
                            unit++;
                        }
                    }

                }

                if (node.nodeType == 3) {
                    tmp[unit] += node.nodeValue;
                }

                if (node.nodeType == 8) {
                    tmp[unit] += '<!--' + node.nodeValue + '-->';
                }

                if (next) {
                    unit = find(next, tmp, unit);
                }
                return unit;
            }

            find(me, arr, 0);
            return arr.join('');
        }

    }

    SE.Elem = Elem;

    //function test() {
    //    var elem = new SinaEditor.Elem();
    //    var root = elem.createRoot('div', {
    //        id: 'root'
    //    });
    //    var div1 = elem.createElement('div', {
    //        id: 'div1'
    //    });
    //    var div2 = elem.createElement('div', {
    //        id: 'div2'
    //    });
    //    var p1 = elem.createElement('p', {
    //        id: 'p1'
    //    });
    //    var p2 = elem.createElement('p', {
    //        id: 'p2'
    //    });
    //    var text1 = elem.createTextNode('text1');
    //    var text2 = elem.createTextNode('text2');
    //    root.appendChild(div1);
    //    root.appendChild(div2);
    //    div1.appendChild(p1);
    //    div1.appendChild(text2);
    //    console.info(root);
    //    console.info(root.html());
    //    return root.html();
    //}
    //test();
})(SinaEditor)
