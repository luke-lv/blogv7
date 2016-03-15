/* 
 * 注册链接UI插件
 */
;
(function () {
    SinaEditor.PluginManager.register('linkBtn', function (options, editor) {
        var SE = SinaEditor, DOMUtil = SE.DOMUtil, ENV = SE.env, Layer = SE.ui.Layer, VK = SE.VK, Util = SE.Util;

        var $dom = new DOMUtil();
        var linkPanel = null;

        //
        function unLink() {
            editor.exec('unlink');
        }

        function addLink(url) {
            if (0 !== url.indexOf('http://')) {
                url = 'http://' + url;
            }
            editor.exec('link', {url: url});
        }

        function bindInput(input, panel) {
            var emptyTxt = $dom.attr(input, 'placeholder');
            $dom.on(input, 'keydown mousedown', function (e) {
                e = $dom.fixEvent(e);
                var target = e.target;
                if (emptyTxt == Util.trim(target.value)) {
                    target.value = '';
                }
            });
            $dom.on(input, 'blur', function (e) {
                e = $dom.fixEvent(e);
                var target = e.target;
                if ('' == Util.trim(target.value)) {
                    target.value = emptyTxt;
                }
            });
            $dom.on(input, 'keyup', function (e) {
                e = $dom.fixEvent(e);
                var target = e.target;
                var addBtn = panel.getNode('add');

                var url = Util.trim(target.value);
                if (url) {
                    $dom.text(addBtn, '添加');
                    if (VK.ENTER === e.keyCode) {
                        addLink(url);
                        target.value = '';
                        linkPanel.hide();
                    }
                } else {
                    $dom.text(addBtn, '返回');
                }

            });
        }

        function bindAddBtn(addBtn, input) {
            $dom.on(addBtn, 'click', function (e) {
                e = $dom.fixEvent(e);
                var url = Util.trim(input.value);
                if (url) {
                    addLink(url);
                }
                linkPanel.hide();
                e.preventDefault();
            });

        }

        function link(toolbar, html) {
            var pos = toolbar.getPos(), input = null, addBtn = null;

            if (!linkPanel) {
                linkPanel = new Layer({html: html});
                linkPanel.show(pos);
                input = linkPanel.getNode('address');
                addBtn = linkPanel.getNode('add');
                bindInput(input, linkPanel);
                bindAddBtn(addBtn, input);
            } else {
                linkPanel.show(pos);
                input = linkPanel.getNode('address');
            }

            var holder = $dom.attr(input, 'placeholder');
            if ((9 > ENV.version) && ENV.msie) {
                input.value = holder;
            } else {
                input.value = '';
            }
        }

        // 初始化按钮事件
        function init() {

            var html = ['<div id="#{panel}" class="BNE_editor_color BNE_editor_color1 BNE_editor_cur" style="z-index:301;position:absolute;">',
                '<input placeholder="请输入链接地址" id="#{address}" class="input_link" type="text">',
                '<a class="add_link" href="javascript:void(0)" title="" id="#{add}">返回</a>',
                '<i class="arrow-down"></i>', '</div>'].join('');

            editor.on('toolbar.linkbtn.click', function (e, toolbar) {

                var btn = toolbar.getButton('linkBtn');
                //console.log('toolbar.linkbtn.click', btn.actived);

                if (btn.actived) {
                    unLink();
                } else {
                    link(toolbar, html);
                }
            });

            editor.on('toolbar.selectionchange', function (e, rng, path, toolbar) {
                var state = editor.queryCommandState('link', rng, path);
                var btn = toolbar.getButton('linkBtn');
                //console.log('toolbar.selectionchange.link', state);
                if (state) {
                    btn.active();
                } else {
                    btn.normal();
                }

            });

            editor.on('selectionchange', function () {
                if (linkPanel) {
                    linkPanel.hide();
                }
            });
        }

        init();
        return {
            toolBars: [
                {
                    id: 'link',
                    name: 'linkBtn',
                    exec: 'link unlink',
                    tooltip: '加链接',
                    activeCls: 'hovered'
                }
            ]
        }
    });
})();
