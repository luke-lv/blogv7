/**
 * 编辑器工具栏组件
 * @module Toolbar
 * @constructor
 * @author gaolei2@
 * @param {Object} options toolbar的控制项
 * @param {Editor} editor 编辑器实例
 */
SinaEditor.PluginManager.register('toolBar', function (opts, editor) {
    var SE = SinaEditor, DOMUtil = SE.DOMUtil, Button = SE.ui.Button, ToolBar = SE.ui.ToolBar, GroupButton = SE.ui.GroupButton, Util = SE.Util;

    var mainToolbar, hasFire = false, domUtil = new DOMUtil();

    opts = Util.extend({
        id: 'toolbar',
        tpl: '',
        name: 'main'
    }, opts);


    function onSelectionChange(e, range) {
        var editorSelection = editor.selection,
            tmpRange = range.cloneRange(),
            typeToolBar = mainToolbar,
            toolbar = typeToolBar.toolBarCon,
            hasChange = false;

        function toShowToolbar() {
            if (onSelectionChange.timer) {
                window.clearTimeout(onSelectionChange.timer);
            }
            var rangePos = getRangePos(tmpRange);
            if (!rangePos) {
                typeToolBar.hide();
                editor.fire('toolbar.hidden', typeToolBar, tmpRange);
                return;
            }

            if (editor.fire('toolbar.beforeshow', typeToolBar, tmpRange) === false) {
                return;
            }
            var left = rangePos.left, top = rangePos.top;
            var pos = typeToolBar.getPos();
            if (pos.left != left + 'px' || pos.top != top + 'px') {
                hasChange = true;
                typeToolBar.show(function () {
                    editor.fire('toolbar.show', this);
                    range = range.startContainer.parentNode ? range : editor.getRange(true);
                    var elementPath = editor.domUtil.getElementPath(range);
                    editor.fire('toolbar.selectionchange', range, elementPath, this);
                    return left;
                }, top, true);
            } else if (!typeToolBar.isShow()) {
                typeToolBar.show(left, top);
            }
            editor.fire('toolbar.aftershow', typeToolBar, tmpRange);
        }

        if (tmpRange && !tmpRange.collapsed) {
            if (typeToolBar.isShow()) {
                if (onSelectionChange.timer) {
                    window.clearTimeout(onSelectionChange.timer);
                }
                onSelectionChange.timer = window.setTimeout(function () {
                    if (typeToolBar.isShow()) {
                        toShowToolbar();
                    }
                }, 100);
            } else {
                toShowToolbar();
            }

        } else {
            typeToolBar.hide();
            editor.fire('toolbar.hidden', typeToolBar);
        }
        return hasChange
    }

    function getRangePos(range) {
        if (range.collapsed) {
            return;
        }
        range.shrinkBoundary();
        //range.moveToTxtNode(true); //修正range.使期不选中多余的节点

        var bkmk = range.createBookMarkByClone('pos'), sc = range.startContainer, so = range.startOffset, ec = range.endContainer, eo = range.endOffset, bs = bkmk.bookmark.start, be = bkmk.bookmark.end, hack = SinaEditor.env.$msie && SinaEditor.env.version < 8, topOfst = 55, leftOfst = hack ? 0 : 0, domUtil = editor.domUtil, filter = function (node) {

            return (node.nodeType == 3 && (!domUtil.isBookMarkTag(node.parentNode)  && !!SinaEditor.noSpaceReg.test(node.nodeValue))) || domUtil.isBookMarkTag(node)
        };
        //if (!be) debugger;
        var nextTxt = domUtil.getFilterTreeDom(bs, null, filter, true), lastTxt = nextTxt, tmp = nextTxt;
        if (!nextTxt || domUtil.isBookMarkTag(nextTxt)) { //选区如果没有文本节点则不显示toolbar
            range.moveToBookMarkByClone(bkmk);
            return false;
        }
        while (tmp && !domUtil.isBookMarkTag(tmp)) {
            lastTxt = tmp;
            tmp = domUtil.getFilterTreeDom(tmp, null, filter, true);
        }

        var testNode = editor.doc.createElement('span');
        testNode.style.display = 'inline-block';
        testNode.innerHTML = '1';
        nextTxt.parentNode.insertBefore(testNode, nextTxt);
        var bso = domUtil.getPos(testNode);
        testNode.innerHTML = '\uFEFF';
        if (lastTxt.nextSibling) {
            lastTxt.parentNode.insertBefore(testNode, lastTxt.nextSibling);
        } else {
            lastTxt.parentNode.appendChild(testNode);
        }
        var beo = domUtil.getPos(testNode), left, top, typeToolBar = mainToolbar, toolbar = typeToolBar.toolBarCon, ofst;
        if(beo.top - 1 === bso.top){
            beo.top = bso.top; 
        }
        if (!typeToolBar.isShow()) {
            toolbar.style.display = '';
            ofst = toolbar.offsetWidth / 2;
            toolbar.style.display = 'none';
        } else {
            ofst = toolbar.offsetWidth / 2;
        }
        ofst = ofst + leftOfst;
        range.setStart(nextTxt, 1);
        range.collapse(true);

        if (beo.top === bso.top) { //在同一行
            top = beo.top - topOfst;
            left = bso.left + (beo.left - bso.left) / 2 - ofst;

        } else {
            top = bso.top - topOfst;
            left = bkmk.body.offsetWidth / 2 + domUtil.getPos(bkmk.body).left - ofst;
        }
        domUtil.remove(testNode);
        testNode = null;
        range.moveToBookMarkByClone(bkmk);
        nextTxt = null;
        return {
            left: left,
            top: top
        };

    }

    editor.on('pluginOnLoaded', function () {
        mainToolbar = new ToolBar(opts, editor);

        //domUtil.on(mainToolbar.toolBarCon,'mousedown keydown',function(){
        //    editor.isInBody = true; 
        //})
        mainToolbar.hide();
        domUtil.each(editor.plugins, function (i, pluginItem) {
            var pluginBars, btn;
            if (pluginItem && (pluginBars = pluginItem.toolBars)) {
                domUtil.each(pluginBars, function (i, btnOpt) {
                    if ('group' === btnOpt.type) {
                        btn = new GroupButton(btnOpt);
                        mainToolbar.addGroupButton(btn);

                    } else {

                        btn = new Button(btnOpt);
                        mainToolbar.addButton(btn);
                    }
                });
            }
        });
        //监听编辑器的afterCommand方法，触发编辑器的toolbar.selectionchange方法
        editor.on('afterCommand', function (e, cmdName, range, elementPath) {
            if (!cmdName || !Util.inArray(mainToolbar.cmds, cmdName)) {
                return;
            }
            if (!onSelectionChange(e, range)) {
                editor.fire('toolbar.selectionchange', range, elementPath, mainToolbar);
            }

        });

        editor.on('selectionchange', function (e, range, cause) {
            if (cause != 'command') {
                onSelectionChange(e, range);
            }
        });

        domUtil.hover(editor.body, function onMouseOver(e, elem) {
//      console.log('toolbar.paragraphenter %s', elem);
            editor.fire('toolbar.paragraphenter', elem, mainToolbar);
        }, function onMouseOut(e, elem) {
//      console.log('toolbar.paragraphleave %s', elem);
            editor.fire('toolbar.paragraphleave', elem, mainToolbar);
            // BUG: BLOGBUG-14438
        }, 'p,div[se-img="wrapper"],h1,h2');

    });
});

