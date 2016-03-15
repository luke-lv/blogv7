/**
 * 注册视频插件
 * @author wangqiang
 * @date 2014-08-12
 */
SinaEditor.PluginManager.register('video', function (options, editor) {
    var domUtil = editor.domUtil;
    // 创建视频dom节点
    function createDom(vid) {

        var videoPicUrl = 'http://simg.sinajs.cn/blog7style/images/common/editor/insetvideo2.gif';
        var img = domUtil.create('img', {
            'se-holder': 1,
            src: videoPicUrl,
            vid: vid,
            width: 482,
            height: 388,
            contenteditable: false,
            'user-select': 'none'
        });

        // class: .video_box
        var wrapper = domUtil.create('div', {
            'se-holder': 1,
            'se-widget': 'video',
            unselectable: 'on',
            contenteditable: false,
            'user-select': 'none',
            style: {
                overflow: 'hidden',
                textAlign: 'center',
                marginBottom: '42px'
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

    editor.registerCmd('insertVideo', {
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
            if (!opts.vid) {
                return
            }
            var videoNode = createDom(opts.vid);
            var rng = editor.getRange();
            var start = domUtil.getStart(rng);//.startContainer;
            var parents = domUtil.parents(start, true);
            var wrapper = parents.pop();
            var editorBody = editor.body;
            if ((rng.collapsed && rng.startContainer == editorBody && 0 == rng.startOffset ) || (!wrapper || wrapper == editorBody)) {
                editorBody.appendChild(videoNode);
                var paragraph = createNewParagraph();
                domUtil.insertNode(paragraph, editorBody, 'beforeend');
                rng.setStart(paragraph, 0);
            } else {
                // 剪切当前的range
                rng.setEndAfter(wrapper);
                var lastFrag = rng.extractContents();
                var lastFragFirstChild = lastFrag.firstChild;

                // 插入节点，然后插入剩余的dom节点
                domUtil.insertAfter(videoNode, wrapper);

                if (domUtil.text(lastFragFirstChild)) {
                    domUtil.insertAfter(lastFrag, videoNode);
                } else {
                    var paragraph = createNewParagraph();
                    domUtil.insertAfter(paragraph, videoNode);
                    lastFragFirstChild = paragraph;
                }
                rng.setStart(lastFragFirstChild, 0);
            }

            rng.collapse(true);
            rng.select(true);
        }
    });

});
