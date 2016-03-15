/*
 * @author : luying1@staff.sina.com.cn
 * @file : travel.js
 * @description : 旅游频道编辑器业务插件
 * @version :1.0
 * @date : 2015.03.09
 *
 * */

(function(SE) {
    window.onerror = null;
    var Util = SE.Util,
        n = 199,
        loadScript = function(path, cb) {
            var script = document.createElement('script'),
                parent = document.getElementsByTagName('head')[0];
            script.onload = script.onreadystatechange = script.onerror = function() {
                if (/loaded|complete|undefined/.test(script.readyState)) {
                    script.onload = script.onerror = script.onreadystatechange = null;
                    script.parentNode.removeChild(script);
                    script = undefined;
                    if (cb) cb();
                }
            };
            script.src = path;
            parent.appendChild(script);
        };

    /*
     *  @联想词实例
     * */
    function createAssociate() {
        var associate = {
            source: 'http://control.blog.sina.com.cn/admin/ria/ly_destination_name.php?call_back=' + n,
            cache: {},
            timer: null,
            currKey: null,
            noHide: false,
            bind: function(input, list) {
                associate.input = input;
                editor.domUtil.on(input, 'focus', associate.init);
                editor.domUtil.on(input, 'blur', associate.unset);
                editor.domUtil.on(document.body, 'click', function(e) {
                    var pos = editor.domUtil.getNodePosition(e.target, list);
                    if (pos != 4 && pos != 10) {
                        associate.list.style.display = "none"
                    }
                });
                if (list) {
                    associate.list = list;
                    editor.domUtil.on(list, 'click', function(e) {
                        e.preventDefault();
                        input.value = this.innerHTML;
                        input.aid = this.getAttribute('aid');
                        list.style.display = 'none';
                    }, false, 'a');
                }
            },
            init: function() {
                var _this = this;
                associate.timer = window.setInterval(function() {
                    if (!_this.value && associate.list) {
                        associate.list.style.display = "none";
                    }
                    if (_this.value == associate.currKey) {
                        return;
                    }
                    associate.currKey = _this.value;
                    associate.get(_this.value);
                }, 200);
            },
            unset: function() {
                window.clearInterval(associate.timer);
                associate.timer = null;
            },
            get: function(key) {
                var _this = this;
                window['travel_' + n] = function(data) {
                    if (key != associate.currKey) {
                        return;
                    }
                    if (data && data.length !== undefined) {
                        associate.cache[escape(key)] = data;
                        associate.render(data);
                    }
                }
                if (associate.cache[escape(key)]) {
                    associate.render(associate.cache[escape(key)]);
                } else {
                    loadScript(this.source + '&city_name=' + unescape(key), function() {})
                }
            },
            render: function(data) { //to rebuild
                //for render;
            }
        };
        return associate;
    }


    function Travel(options, editor) {
        this.options = Util.extend({
            maxLen: {
                address: 100,
                tip: 500,
                content: 40000
            },
            maxAddWidgets: 20,
            operateCls: {
                'del': 'operate_case2',
                'both': 'operate_case3',
                'add': 'operate_case1'
            }
        }, options || {});
        this.body = editor.body;
        this.widgetNum = 0;
        this.domUtil = editor.domUtil;
        this.widgets = {};
        this.ids = [];
        this.currWidget = null;
        this.operateCls = this.options.operateCls;
        this.init();
    }

    Travel.prototype = {
        constructor: Travel,

        getWidget: function(wid) {
            if (this.widgets[wid]) {
                if (!this.widgets[wid].isDel) {
                    return this.widgets[wid];
                } else {
                    return null;
                }
            }
            return null
        },

        gotoWidget: function(widget) {
            var curr = this.currWidget;
            if (!widget) {
                return;
            }
            this.saveWidget(curr);
            this.loadWidget(widget);
        },

        init: function() {
            var _this = this;
            editor.ready(function() {
                window.setTimeout(function() {
                    _this.placeholder = editor.body.previousSibling;
                });
            });
            //重写editor.isEmptyContent
            editor.isEmptyContent = function() {
                var isEmptyContent = editor.constructor.prototype.isEmptyContent;
                for (var i in _this.widgets) {
                    var widget = _this.widgets[i];
                    if (widget) {
                        if (!isEmptyContent.call(editor, widget.clone || editor.body)) {
                            return false;
                        }
                    }
                }

                return true;
            }

            //重写editor.setContent 

            editor.setContent = function(content, isSetInnerHtml) {
                var reg = /<div\s+style="|'id:ass_(\d+)"|'\s*>/gi;
                //return editor.constructor.prototype.setContent.apply(editor,[content,isSetInnerHtml])
                try {
                    if (reg.test(content)) {
                        var div = this.domUtil.create('div', {
                            style: 'display:none'
                        }, content);
                        //document.body.appendChild(div);
                        while (div.firstChild) {
                            var node = div.firstChild;
                            if (node.nodeType != 1) {
                                this.domUtil.remove(node);
                                node = null;
                                continue;
                            }
                            var p = node.getElementsByTagName('p');
                            var bef = p[0],
                                aft = p[p.length - 1];
                            var address = bef.getElementsByTagName('span')[1];
                            var tip = aft.getElementsByTagName('em')[0];
                            this.domUtil.remove(bef);
                            this.domUtil.remove(aft);
                            address = address ? address.innerHTML : '';
                            tip = tip ? tip.innerHTML : '';
                            var body = this.domUtil.create('div'),
                                isInline = false;
                            while (node.firstChild) {
                                var first = node.firstChild;
                                this.domUtil.remove(first);
                                if (first.nodeType == 3 && Util.trim(first.nodeValue).length == 0) {
                                    continue;
                                }
                                if (this.domUtil.isBlock(first)) {
                                    body.appendChild(first);
                                    isInline = false;
                                } else {
                                    if (isInline) {
                                        body.lastChild.appendChild(first);
                                    } else {
                                        var p = document.createElement('p');
                                        p.appendChild(first);
                                        body.appendChild(p);
                                    }
                                    isInline = true;
                                }
                            }
                            body = body.innerHTML;
                            this.domUtil.remove(node);
                            var widget = _this.createWidget();
                            _this.gotoWidget(widget);
                            document.getElementById(widget.input).value = address;
                            document.getElementById(widget.textarea).value = tip;

                            editor.constructor.prototype.setContent.apply(editor, [body, isSetInnerHtml]);
                            node = null;
                        }
                        _this.delWidget(_this.getWidget(_this.ids[0]));
                        //this.domUtil.remove(div);
                        div = null;
                    } else {
                        editor.constructor.prototype.setContent.apply(editor, [content, isSetInnerHtml]);
                    }
                } catch (e) {
                    console.dir(e);
                    editor.constructor.prototype.setContent.apply(editor, [content, isSetInnerHtml]);

                }

            }

            //重写editor.getContent
            editor.getContent = function() {
                var htmls = [],
                    arr = ['['];
                for (var i = 0; i < _this.ids.length; i++) {
                    var id = _this.ids[i];
                    var widget = _this.getWidget(id);
                    if (widget) {
                        var html = _this.widgetToHtml(widget);
                        htmls.push(html.html);
                        arr.push(html.json, i == _this.ids.length - 1 ? '' : ',');
                    }
                }
                arr.push(']');

                //更新页面json串
                var input = document.getElementById('travel_json_str');
                if (!input) {
                    var form = document.getElementById('editorForm');
                    input = this.domUtil.create('input', {
                        name: 'travel_json',
                        type: 'hidden',
                        id: 'travel_json_str'
                    });
                    form.appendChild(input);
                }
                input.value = arr.join('');
                return htmls.join('');
            }


            this.currWidget = this.createWidget.call(this, 'travel_hehe');
            this.loadWidget(this.currWidget);
            //this.loadCss.call(this);
            this.domUtil.on(this.body.parentNode, 'mouseover', function(e) {
                if (editor.body != this) {
                    var target = _this.getWidget(this.widgetId);
                    _this.gotoWidget(target);
                }
            }, false, 'div.' + this.body.className.split(/\s+/)[0]);

            this.domUtil.on(this.body.parentNode, 'click', function(e) {
                e.preventDefault();
                if (_this.widgetNum >= _this.options.maxAddWidgets) {
                    return;
                }
                var widget = _this.createWidget('travel_' + +new Date);
                _this.saveWidget(_this.currWidget);
                _this.currWidget.operate.className = 'operate_case2';
                _this.loadWidget(widget);
            }, false, '.travel_add');
            this.domUtil.on(this.body.parentNode, 'click', function(e) {
                e.preventDefault();
                var widget = _this.getWidget(this.id);
                if (widget) {
                    _this.delWidget(widget);
                }
            }, false, 'a.travel_del');

            //editor.on('beforeGetContent', function() {});
            window.setTimeout(function() {
                if (window.scope && window.scope._tagsMng) {
                    window.scope._tagsMng.addTag('\u6E38\u8BB0');
                }
            }, 150)

        },
        widgetToHtml: function(widget) {
            if (!widget) {
                return;
            }
            var address = document.getElementById(widget.input).value,
                body = this.currWidget === widget ? editor.constructor.prototype.getContent.apply(editor, [null, false]) : widget.content,
                tip = document.getElementById(widget.textarea).value,
                tmp = [],
                aid = document.getElementById(widget.input).aid,
                obj = {};

            //整理数据 
            var json = [];
            json.push('{');
            json.push('"mdd_name":');
            json.push('"', address + '"', ',');
            json.push('"mdd_tip":');
            json.push('"', tip, '"', ',');
            json.push('"mdd_desc":');
            var _body = body.replace(/(\n|\r|\t)/gm, '').replace(/(")/g, '\\$1');
            json.push('"', _body, '"', ',');
            json.push('"mdd_id":');
            json.push('"', aid, '"')
            json.push('}');
            obj = {
                mdd_name: address,
                mdd_tip: tip,
                mdd_desc: body,
                mdd_id: aid
            };
            aid = aid || +new Date;

            if (widget.id === this.ids[0]) {
                tmp.push('<div style="id:ass_', aid, '">');
            } else {
                tmp.push('<div style="border-top:1px solid #eee;margin-top:-30px">');
            }

            tmp.push('<p style="font-size: 15px; margin: 35px 0px 10px; position: relative;"><img src="http://simg.sinajs.cn/blog7style/images/blog_editor/lv_arr.gif" style="margin-right: 10px;"><span style="color: #999; line-height: 22px; vertical-align: middle;">游玩地点：</span><span style="width: 536px; line-height: 22px; color: #333; margin-left: 6px; vertical-align: middle;">', address, '</span></p>');

            tmp.push(body);

            tmp.push('<p style="overflow: hidden;margin-top: 10px;margin-bottom: 75px;width: 100%; color: #666; font-size: 15px; line-height: 28px;"><span style="font-size:14px;margin-left:5px;"><em style="color: #666;font-size: 15px;line-height: 28px;">', tip, '</em></span></p>');

            tmp.push('</div>');
            return {
                html: tmp.join(''),
                json: json.join(''),
                obj: obj
            }

        },
        resetOperate: function() {

            var first = this.getWidget(this.ids[0]);
            if (!first) {
                return;
            }
            var last = this.getWidget(this.ids[this.ids.length - 1]);
            if (this.widgetNum == 1) {
                first.operate.className = this.operateCls.add;
                return;
            }
            for (var w = 0; w < this.ids.length; w++) {
                var id = this.ids[w];
                var widget = this.widgets[id];
                if (last === widget) { //只有一个
                    if (this.ids.length >= this.options.maxAddWidgets) {
                        widget.operate.className = this.operateCls.del;
                    } else {
                        widget.operate.className = this.operateCls.both;
                    }
                } else {
                    widget.operate.className = this.operateCls.del;
                }

            }

        },
        createWidget: function(id) {
            if (this.widgets[id]) {
                return;
            }

            if (this.ids.length > this.options.maxAddWidgets) {
                return;
            }
            var id = id || 'travel' + +new Date(),
                form = {
                    'address': {
                        name: 'address',
                        type: 'text',
                        label: '游玩地点（必填）：',

                    },
                    'tip': {
                        name: 'tip',
                        type: 'textarea',
                        label: '温馨提示：'

                    }
                },
                address, tip, associate, ul, html = [],
                operate, input, textarea;

            address = this.domUtil.create('div', {
                id: id + '_' + form.address.name,
                'class': 'travel'
            }, '<span class="name">' + form.address.label + '</span><input autocomplete="off" placeholder="请输入游玩地点" id="' + id + '_input" name="' + form.address.name + '" type="' + form.address.type + '"/>');

            tip = this.domUtil.create('div', {
                id: id + '_' + form.tip.name,
                'class': 'travel travel_hint'
            }, '<div class="hint"><div class="name">' + form.tip.label + '</div><textarea placeholder="请输入温馨提示" id="' + id + '_textarea" onkeydown="this.style.height=\'29px\';this.style.display="inline-block";this.style.height=this.scrollHeight + \'px\'" name="' + form.tip.name + '"></textarea></div>');
            html.push('<div class="delete_place"><a href="#" class="travel_del" id="', id, '">删除游玩地点</a></div>');
            html.push('<div class="add_place"><i class="icon i47_add travel_add"></i><span class="des travel_add" id="', id, '">添加游玩地点</span></div>');
            operate = this.domUtil.create('div', {
                'class': 'operate_case3'
            }, html.join(''));

            ul = this.domUtil.create('ul', {
                id: 'associate_list',
                'class': 'think_list'
            });
            input = id + '_input';
            textarea = id + '_textarea';
            ul.style.display = 'none';
            associate = createAssociate();
            associate.render = function(data) {
                var html = [];
                for (var i = 0; i < data.length; i++) {
                    var name = data[i].parent ? data[i].parent.name + '-' + data[i].name : data[i].name;
                    html.push('<li><a href="#" aid="', data[i].id, '">', name, '</a></li >');
                }
                ul.innerHTML = html.join('');
                if (i > 0) {
                    ul.style.display = 'block';
                } else {
                    ul.style.display = 'none';
                }
            }



            //添加地点操作按钮
            this.widgets[id] = {
                tip: tip,
                address: address,
                input: input,
                textarea: textarea,
                list: ul,
                body: this.body,
                operate: operate,
                associate: associate,
                id: id
            }
            this.ids.push(id);
            this.widgetNum++;
            return this.widgets[id];
        },
        saveWidget: function(widget) {
            widget.content = editor.constructor.prototype.getContent.apply(editor, [null, false]);
            widget.clone = this.domUtil.create('div', {
                id: 'travel' + widget.id,
                'class': editor.body.className + ' BNE_block BNE_forbid',
                style: editor.body.style.cssText
            });
            widget.clone.innerHTML = widget.content;
            widget.clone.widgetId = widget.id;
            this.domUtil.insertBefore(widget.clone, this.body);
            editor.constructor.prototype.setContent.apply(editor, [editor.opts.emptyContent]);
        },

        delWidget: function(widget) {
            if (this.widgetNum <= 1) {
                return;
            }
            for (var w = 0; w < this.ids.length; w++) {
                var item = this.ids[w];
                if (item === widget.id) {
                    break;
                }
            }
            if (this.currWidget === widget) {
                var next = this.getWidget(this.ids[w + 1]);
                if (next) {
                    this.gotoWidget(next);
                } else {
                    var prev = this.getWidget(this.ids[w - 1]);
                    if (prev) {
                        this.gotoWidget(prev);
                    }
                }
            }
            for (var o in widget) {
                var item = widget[o];
                if (item && item.parentNode && item != editor.body) {
                    this.domUtil.remove(item);
                    item = widget[o] = null;
                }
            }
            this.ids.splice(w, 1);
            widget.isDel = true;
            this.widgetNum--;
            this.resetOperate();
        },
        changeBody: function(widget) {
            editor.constructor.prototype.setContent.apply(editor, [widget.content || editor.opts.emptyContent]);
            if (widget.clone && widget.clone.parentNode) {
                this.domUtil.insertAfter(editor.body, widget.clone);
                this.domUtil.remove(widget.clone);
                //widget.clone = null;
            } else {
                var lastWidget = this.getWidget(this.ids[this.ids.length - 2]);
                if (lastWidget && lastWidget.operate.parentNode) {
                    this.domUtil.insertAfter(editor.body, lastWidget.operate);
                }
            }

        },
        loadWidget: function(widget) {
            this.changeBody(widget);
            this.domUtil.insertAfter(widget.tip, widget.body);
            this.domUtil.insertBefore(widget.address, widget.body);
            this.domUtil.insertAfter(widget.operate, widget.tip);
            var input = document.getElementById(widget.input);
            this.domUtil.insertAfter(widget.list, input);
            widget.associate.bind(input, widget.list);
            if (this.placeholder) {
                this.domUtil.insertBefore(this.placeholder, editor.body);
            }
            this.currWidget = widget;
            this.resetOperate();
            widget.body.setAttribute('id', editor.body.id);
            editor.focus();
        },
        formCheck: function() {
            for (var id = 0; id < this.ids.length; id++) {
                var item = this.ids[id],
                    widget = this.getWidget(item);
                if (!widget || widget.isDel) {
                    continue;
                }
                var res = this.widgetToHtml(widget).obj;
                if (Util.trim(res.mdd_name) == '') {
                    return {
                        code: 2,
                        msg: '游玩地点不能为空',
                        widget: document.getElementById(widget.input)
                    }
                }

                if (res.mdd_name.length > this.options.maxLen.address) {
                    return {
                        code: 2,
                        msg: '游玩地点不能超过' + this.options.maxLen.address + '个字',
                        widget: document.getElementById(widget.input)
                    }
                }

                var div = this.domUtil.create('div', {}, res.mdd_desc);
                var text = Util.trim(div.textContent || div.innerText);
                div = null;
                if (text.length == 0) {
                    return {
                        code: 2,
                        msg: '游玩内容不能为空',
                        widget: editor.body
                    }
                }



                if (res.mdd_tip.length > this.options.maxLen.tip) {
                    return {
                        code: 2,
                        msg: '温馨提示不能超过' + this.options.maxLen.tip + '个字',
                        widget: document.getElementById(widget.tip)
                    }
                }

            }
            var content = editor.getContent(null, false);
            var reg = /[\u4E00-\u9FA5，]/g;
            var len = content.replace(reg, 'heh').length;
            if (len > this.options.maxLen.content) {
                return {
                    code: 2,
                    msg: '游玩内容不能超过1万个汉字、2万个字符',
                    widget: editor.body
                }
            }
            if (this.ids.length > this.options.maxAddWidgets) {
                return {
                    code: 2,
                    msg: '游玩地点最多只能添加' + this.options.maxAddWidgets + '个',
                    widget: document.getElementById(widget.tip)
                }
            }

            return {
                code: 1,
                msg: '验证通过',
                widget: this.widgets
            };
        },
        //loadCss: function() {
        //    if (document.getElementById('travel_style_tag')) {
        //        return;
        //    }
        //    var style = document.createElement('style');
        //    style.setAttribute('id', 'travel_style_tag');
        //    style.innerHTML = ['.BNE_editor .travel{ font-size:15px; margin:25px 0; position:relative;}', '.BNE_editor .travel .name{ color:#999; line-height:32px; vertical-align:middle;}', '.BNE_editor .travel input{ width:525px; border-bottom:1px dashed #eee; padding:6px 2px; color:#333; margin-left:6px; font-size:15px; height:20px; line-height:20px; vertical-align:middle; _width:532px;}', '.BNE_editor .travel_hint{  margin-top:20px;}', '.BNE_editor .travel_hint textarea{ line-height:28px; border:0 none; outline:0 none; height:28px; font-size:15px; color:#666; width:100%; margin-top:2px;background: none; overflow:auto;border-bottom:1px dashed #eee; }', '.BNE_editor .travel_hint .name{  width:75px;padding-right:6px; margin-right:2px; line-height:28px; }', '.BNE_editor .travel .hint{ width:100%; color:#666; font-size:15px; line-height:28px;}', '.BNE_editor .travel .placeholder textarea{color:#ccc;}', '.BNE_editor .add_place{ font-size:24px; color:#ffac28; text-align:center; border-top:1px solid #eee; padding-top:30px; cursor:pointer;}', '.BNE_editor .add_place .icon{ margin-right:16px;}', '.BNE_editor .add_place .des{ line-height:31px;}', '.BNE_editor .think_list{ width:528px; position:absolute; right:0; top:33px; *top:34px; _right:30px; max-height:238px;_height:238px; overflow:auto; font-size:14px;background:#fbfbfb; border:1px solid #f7f7f7; border-top:0 none;box-shadow: 0px 1px 0px rgba(0,0,0,.08);}', '.BNE_editor .think_list li{ height:34px; line-height:34px; width:100%}', '.BNE_editor .think_list li a{ display:block;height:34px; line-height:34px; color:#333; background:#fbfbfb; padding:0 20px;}', '.BNE_editor .think_list li a:hover{ background:#eee;}', '.BNE_editor .delete_place{ font-size:15px; margin:30px 0; height:32px;*padding-bottom:30px; *margin-bottom:0;}', '.BNE_editor .delete_place a{ display:block;width:120px; float:right; line-height:30px; border:1px dashed #ddd;color:#999; text-align:center; }', '.BNE_editor .operate_case1{ margin:50px 0 80px;}', '.BNE_editor .operate_case1 .delete_place{ display:none;}', '.BNE_editor .operate_case2 .add_place{ display:none;}', '.BNE_editor .operate_case2{ border-bottom:1px solid #eee; margin-bottom:30px;}'].join('');
        //    var head = document.getElementsByTagName('head');
        //    if (head && head.length > 0) {
        //        head[0].appendChild(style);
        //    } else {
        //        document.body.appendChild(style);
        //    }
        //}
    };

    SE.PluginManager.register('travel', Travel);

})(SinaEditor);
