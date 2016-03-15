;
(function () {
    var SE = SinaEditor, Util = SE.Util, DOMUtil = SE.DOMUtil;

    function ColorPickerBtn(options, editor) {
        var domUtil = editor.domUtil, Layer = SE.ui.Layer, me = this, isSave = true, currToolbar, currDom;
        this.options = Util.extend({}, this.DEFAULT, options);
        var html = templateToHtml(this.options.html, this.options.template, this.options.colors);
        var pickerLayer = new Layer({
            html: html
        });
        var selector = this.options.delegateSelector;
        editor.on('toolbar.colorPickerBtn.click', function (e, toolbar) {
            toolbar.hide();
            var pos = toolbar.getPos();
            pickerLayer.show(pos);
            var color = editor.queryCommandState('color', editor.getRange()) || me.options.resetColor;
            var panel = pickerLayer.getNode('panel');
            var doms = domUtil.$('[colorValue]', panel), curr;
            while (doms.length) {
                curr = doms.pop();
                domUtil.delClass(curr, me.options.pickerActiveCls);
            }
            var dom1 = editor.doc.getElementById('color_range_' + me.options.resetColor);
            var dom2 = editor.doc.getElementById('color_range_' + color);
            if (dom1) {
                //domUtil.addClass(dom1, me.options.pickerActiveCls);
            }
            if (dom2) {
                domUtil.addClass(dom2, me.options.pickerActiveCls);
                currDom = dom2;
            }
            currToolbar = toolbar;
        });

        editor.on('toolbar.selectionchange', function (e, rng, path, toolbar) {
            var color = editor.queryCommandState('color', rng);
            color = color == me.options.resetColor ? '' : color;
            editor.fire('plugin.colorPickerBtn.ok', toolbar.getButton('colorPickerBtn'), color);
        }, false);

        editor.on('toolbar.show toolbar.hidden', function (e) {
            pickerLayer.hide();
        });
        var panel = pickerLayer.getNode('panel');
        domUtil.on(panel, 'mouseover', function (e) {
            domUtil.addClass(this, me.options.pickerActiveCls);
        }, false, selector);
        domUtil.on(panel, 'mouseout', function (e) {
            if (currDom != this) {
                domUtil.delClass(this, me.options.pickerActiveCls);
            }
        }, false, selector)
        domUtil.on(panel, 'click', function (e) {
            pickerLayer.hide();
            var color = this.getAttribute('colorValue'), btn;
            if (me.options.resetColor == color) {
                editor.exec('resetColor');
            } else {
                editor.exec('color', color);
            }
            if (currToolbar) {
                btn = currToolbar.getButton('colorPickerBtn');
            }
            color = color == me.options.resetColor ? '' : color;
            if (color) {
                var range = editor.getRange();
                var aNode = domUtil.isSpecificParent(range.startContainer, 'a', true);
                if (aNode) {
                    color = editor.queryCommandState('color', range);
                }
            }
            editor.fire('plugin.colorPickerBtn.ok', btn, color);
            editor.selection.getRange().select();
        }, false, selector);

        domUtil.each(this.options.events, function (i, n) {
            editor.on(i, n);
        });

        return {
            toolBars: [
                {
                    id: 'colorPicker',
                    name: 'colorPickerBtn',
                    exec: 'color resetColor',
                    tooltip: '字体颜色',
                    activeCls: 'hovered'
                }
            ]
        }

    }

    ColorPickerBtn.prototype.DEFAULT = {
        colors: [
            '#cc0000', '#d56a00', '#a29900', '#55a455', '#3398cc', '#663399', '#cc0066', //'#666666',
            '#cdcdce', '#333333'
        ],
        html: ['<div id="#{panel}" style="display:none;position:absolute;z-index:301;" class="BNE_editor_color BNE_editor_color1" ><{colors}></div>'].join(''),
        template: '<span class="color_all" style="background-color:<{color}>" colorValue="<{color}>" id="color_range_<{color}>"></span>',
        activeCls: 'hovered',
        pickerActiveCls: 'clicked',
        delegateSelector: 'span.color_all',
        resetColor: '#333333',
        //showClass : 'BEN_editor_cur'
        events: {}

    };

    function templateToHtml(html, template, colors, resetColor) {
        var arr = [], i = 0;
        for (; i < colors.length; i++) {
            arr.push(template.replace(/<\{color\}>/gi, colors[i]));
            if (colors[i] === resetColor) {
                arr[arr.length - 1]
            }
        }
        var colorHtml = arr.join('');
        arr = null;
        return html.replace(/<\{colors}\>/, colorHtml);

    }

    SinaEditor.PluginManager.register('colorPickerBtn', ColorPickerBtn);
})();
