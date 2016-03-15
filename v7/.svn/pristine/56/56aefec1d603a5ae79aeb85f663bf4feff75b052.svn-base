/**
 * 注册link插件
 * @author wangqiang
 * @date 2014-08-12
 */
SinaEditor.PluginManager.register('music', function (options, editor) {
    var SE = SinaEditor, Util = SE.Util, domUtil = editor.domUtil;
    // 创建音乐dom节点
    function createMusicDom(musicUrl, autoPlay) {

        var musicPicUrl = 'http://simg.sinajs.cn/blog7style/images/common/editor/musicplayer.png';
        var img = domUtil.create('img', {
            'se-holder': 1,
            src: musicPicUrl,
            songlist: musicUrl,
            autoplay: autoPlay,
            playerid: 'musicplayer_' + Util.uniqueId(false),
            'user-select': 'none',
            style: {
                overflow: 'hidden',
                textAlign: 'center'
            }
        });
        //class: .music_box
        var wrapper = domUtil.create('div', {
            'se-holder': 1,
            'se-widget': 'music',
            unselectable: 'on',
            contenteditable: false,
            style: {
                overflow: 'hidden',
                textAlign: 'center',
                'padding-bottom': '28px'
            }
        });
        wrapper.appendChild(img);
        return wrapper;
    };

    function createNewParagraph() {
        var paragraph = domUtil.create('p', {
            innerHTML: SinaEditor.env.$webkit ? '<br se-holder="1">' : ''
        });
        return paragraph;
    }

    editor.registerCmd('insertMusic', {
        queryCommandState: function (cmd, rng, elementPath) {
            var state = !1;
            editor.domUtil.each(elementPath, function (i, item) {
                if ('A' === item.nodeName.toUpperCase()) {
                    state = !0;
                    return false;
                }
            });
            return state;
        },
        exec: function (cmd, opts) {
            // console.log('添加链接：',opt.url);
            var lastNode, url, urls = [];
            domUtil.each(opts.musicList, function (i, url) {
                urls.push(decodeURIComponent(url));
            });
            url = urls.join('|');
            var node = createMusicDom(url, opts.autoPlay);
            //debugger
            var rng = editor.getRange();
            var start = domUtil.getStart(rng);//.startContainer;
            //console.log(start);
            var parents = domUtil.parents(start, true);
            var wrapper = parents.pop();
            var editorBody = editor.body;
            // ie有时候获取的Range不在editor的body内！
            if (wrapper && 1 != wrapper.nodeType) {
                wrapper = null;
            }
            var startContainer = rng.startContainer;
            var startOffset = rng.startOffset;
            // editor没有Range的情况
            if ((rng.collapsed && startContainer == editorBody && 0 == startOffset ) || !wrapper || wrapper == editorBody) {
                editorBody.appendChild(node);
                var paragraph = createNewParagraph();
                domUtil.insertNode(paragraph, editorBody, 'beforeend');
                rng.setStart(paragraph, 0);
            } else {


                //console.log(wrapper);
                // 剪切当前的range
                rng.setEndAfter(wrapper);
                var next = wrapper.nextSibling;
                var prev = wrapper.previousSibling;
                var parent = wrapper.parentNode;

                var lastFrag = rng.extractContents();
                // wrapper被剪切到frag里的情况
                if (1 !== wrapper.parentNode) {
                    if (next) {
                        domUtil.insertBefore(node, next);
                    } else if (prev) {
                        domUtil.insertAfter(node, prev);
                    } else {
                        domUtil.append(node, parent)
                    }
                } else {
                    // 插入节点，然后插入剩余的dom节点
                    domUtil.insertAfter(node, wrapper);
                }
                var tmpFirst = lastFrag && lastFrag.firstChild;
                if (tmpFirst) {
                    domUtil.insertAfter(lastFrag, node);
                    rng.setStart(tmpFirst, 0);
                } else {
                    domUtil.insertAfter(lastFrag, node);
                    if (!tmpFirst) {
                        var paragraph = createNewParagraph();
                        domUtil.insertAfter(paragraph, node);
                        rng.setStart(paragraph, 0);
                    } else {
                        domUtil.insertAfter(lastFrag, node);
                        rng.setStart(tmpFirst, 0);
                    }
                }
            }
            rng.collapse(true);
            rng.select(true);
        }
    });

});

