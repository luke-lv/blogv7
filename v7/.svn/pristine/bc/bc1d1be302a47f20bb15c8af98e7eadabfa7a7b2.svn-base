/**
 * 注册视频UI插件
 * @author wangqiang
 * @date 2014-08-12
 */
SinaEditor.PluginManager.register('videoBtn', function (options, editor) {
    var SE = SinaEditor, DOMUtil = SE.DOMUtil, env = SE.env, WinBox = SE.ui.WinBox;

    var $dom = new DOMUtil();

    function bindLayerEvent(win) {
        window.insertVideoCallbackXHW = function (vid) {
//            console.log('微博回调:', vid);
            if (!vid) {
                return;
            }
            win.hide();
            setTimeout(function () {
                win.destroy();
            }, 20);
            if (env.$msie && env.version < 9) {
                editor.focus();
            }

            editor.exec('insertVideo', {vid: vid});
        }
    }

    function bindInsertVideoBtn() {
        $dom.on($dom.$('#insert_video'), 'click', function () {
            var uploadUrl = 'http://weibo.com/aj/video/upload?entry=blog&r=' + parseInt(Math.random() * 10000);
            var winContent = '<div><iframe frameborder="0" id="#{uploadVideo}" scrolling="no" style="width:100%;height:505px;" src="javascript:void(0)"></iframe></div>';
            var win = new WinBox({
                content: winContent,
                width: 680,
                funcClose: function (btn) {
                    setTimeout(function () {
                        win.destroy();
                    }, 20);
                },
                title: '插入视频'
            }, 'insert_video');
            bindLayerEvent(win);
            win.show();
            var iframe = win.getNode('uploadVideo');
            iframe.src = uploadUrl;
            win.setMiddle();
        }, false);
    }

    // 初始化按钮事件
    function init() {
        bindInsertVideoBtn();
    }

    init();
});