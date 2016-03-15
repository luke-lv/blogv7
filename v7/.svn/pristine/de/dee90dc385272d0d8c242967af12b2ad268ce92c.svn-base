/**
 * paste处理
 *
 */
SinaEditor.PluginManager.register('paste', function (options, editor) {
    var SE = SinaEditor, Util = SE.Util, env = SE.env;

    options = Util.extend({
        getType: function (range) {
            return 'text/html';
        }
    }, options);

    function pastebin(range, content) {
        var div = editor.doc.createElement('div');
        div.style.display = 'inline';
        div.innerHTML = content;
        if (!div.firstChild) {
            return;
        }
        if (!range.collapsed) {
            range.deleteContents();
        }
        if (typeof options.getType === 'function' && options.getType(range) == 'text/plain') { //粘贴纯文本
            var text = div.textContent || div.innerText;
            if (text) {
                var txtNode = editor.doc.createTextNode(text);
                range.insertNode(txtNode);
                range.setStartAfter(txtNode);
                range.select(true)
            }
            return;
        }
        range.moveToTxtNode(false, false, true);
        var currNode, frag, fillTxt = editor.doc.createTextNode('pastebin');
        frag = editor.doc.createDocumentFragment();
        var start = range.startContainer, offset = range.startOffset, _hasCurrNode = false;
        if (!SinaEditor.env.$msie && SinaEditor.env.version <= 10) {
            var brStart = range.startContainer;
            if (brStart.nodeType == 3 && range.startOffset >= brStart.nodeValue.length && brStart.nextSibling && brStart.nextSibling.nodeType == 1) {
                brStart = brStart.nextSibling;
            }
            if (brStart.nodeType == 1 && brStart.tagName == 'BR') {
                while (brStart && brStart.parentNode && brStart.parentNode != editor.domUtil.body) {
                    if (editor.domUtil.isBlock(brStart.parentNode)) {

                        //brStart.parentNode.insertBefore(fillTxt, brStart);
                        range.setStartBefore(brStart);
                        editor.domUtil.remove(brStart);
                        range.collapse(true);
                        break;
                    }
                    brStart = brStart.parentNode;
                }
                start = range.startContainer, offset = range.startOffset;
            }
        }
        var tmpRange = range.cloneRange();
        tmpRange.boundaryToBlock();
        var _start = tmpRange.startContainer;

        if (tmpRange.startContainer != editor.domUtil.body) {
            tmpRange.setStart(start, offset);
            if(tmpRange.endContainer!=editor.domUtil.body) {
              tmpRange.setEndAfter(tmpRange.endContainer);
            }
            var _frag = tmpRange.extractContents();
            var dom = _frag.firstChild, firstChild = div.firstChild;
            if (editor.domUtil.isBlock(_start)) { //处理首部
                if (firstChild) {
                    if (editor.domUtil.isBlock(firstChild)) {
                        while (firstChild.firstChild) {
                            currNode = firstChild.firstChild;
                            _start.appendChild(firstChild.firstChild);
                        }
                        editor.domUtil.remove(firstChild);
                    } else {
                        currNode = firstChild;
                        _start.appendChild(firstChild);
                    }

                }
            }
            if (dom && div.lastChild) { //处理尾部
                if (!dom.firstChild) {
                    _frag.removeChild(dom);
                } else {
                    if (div.lastChild.nodeType == 3) {
                        currNode = div.lastChild;
                        _hasCurrNode = true;
                        dom.insertBefore(div.lastChild, dom.firstChild);
                        div.appendChild(dom);
                    }

                    if (div.lastChild.nodeType == 1) {
                        if (editor.domUtil.isBlock(div.lastChild)) { //这里不需要处理了
                            currNode = div.lastChild.lastChild || div.lastChild;
                        } else {
                            currNode = div.lastChild;
                            dom.insertBefore(div.lastChild, dom.firstChild);
                        }
                        _hasCurrNode = true;
                        div.appendChild(dom);
                    }

                }
                range.setStartAfter(_start);
                range.collapse(true);
            } else {
                while (_frag.firstChild && _frag.firstChild.firstChild) {
                    currNode = _frag.firstChild.firstChild;
                    _start.appendChild(_frag.firstChild.firstChild);
                }
            }

        }
        while (div.lastChild) {
            if (div.lastChild.nodeType == 1 || div.lastChild.nodeType == 3) {
                if (!_hasCurrNode) {
                    currNode = div.lastChild;
                }
                var _currNode = div.lastChild;
                if (frag.firstChild) {
                    frag.insertBefore(_currNode, frag.firstChild);
                } else {
                    frag.appendChild(_currNode);
                }
            } else {
                editor.domUtil.remove(div.lastChild);
            }
        }
        range.insertNode(frag);
//        console.log(currNode);
        range.setStartAfter(currNode);
        range.collapse(true);
        range.select(true);
        editor.fire('afterpaste', range);
        editor.fire('saveUndo', !range.collapsed, true);
    }

    editor.ready(function () {
        var domUtil = editor.domUtil, id;
        var filter = new SinaEditor.FilterHTML(domUtil);
        editor.on('paste', function (e, evt) {
            try{
                if (id) { //防止按着ctrl+v不放手或粘贴过慢的情况。
                    evt.preventDefault();
                    return;
                }
                var range = editor.getRange(true);
//                console.log('startContainer', range.startContainer);
                var bookmark = range.createBookMark('pasteBin');
                var div = editor.doc.createElement('div');
                id = 'pasteBin_' + +new Date;
                div.id = id;

                if (env.$webkit) {
                    var txt = editor.doc.createTextNode('\u200B\u200B');
                    div.appendChild(txt);
                }
                domUtil.body.appendChild(div);
                range.setStart(div, 0);
                bookmark.start.style.display = '';
                div.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;left:-1000px;white-space:nowrap;z-index:-9999';

                //var top = domUtil.getPos(bookmark.start).top;

                //div.style.top =  top  + 'px'; //呵呵
//                console.log(domUtil.getRect(bookmark.start));
                if (env.$msie && env.version <= 10) { //ie10 内容无法粘到div里
                    var text = window.clipboardData.getData('text');
                    var texts = text.split(/[\n|\r]/g), txt = '';
                    while (true) {
                        var txt = texts.shift();
                        if (txt === undefined) {
                            break;
                        }
                        txt = Util.trim(txt);
                        if (txt == '') {
                            continue;
                        }
                        div.innerHTML += '<p>' + txt + '</p>';
                    }
                    evt.preventDefault();
                }
                if (!env.$webkit) {
                    range.collapse(true);
                } else {
                    range.setEnd(div, 1);
                }
                range.select(true);
                editor.fire('beforepaste');
                window.setTimeout(function () {
                    var div = editor.doc.getElementById(id);
                    if (!div) {
                        return;
                    }
                    domUtil.remove(div);
                    var html = filter.pasteHtml(div);
                    id = null;
                    try {
                        range.moveToBookMark('pasteBin');
                        pastebin(range, html);
                    } catch (e) {
                    }
                    div = null;

                }, 0);
            } catch(err) {
              evt.preventDefault(); 
            }
        });
    });

});
