/**
 * 注册音乐UI插件
 * @author wangqiang
 * @date 2014-08-12
 */
SinaEditor.PluginManager.register('musicBtn', function (options, editor) {
    var SE = SinaEditor, VK = SE.VK, DOMUtil = SE.DOMUtil, Util = SE.Util, WinBox = SE.ui.WinBox;

    var $dom = new DOMUtil();
    var domUtil = editor.domUtil;
    var musicList = [];

    var winContent = [
        '<div class="e_layer_cont2">', '<form action="add" onsubmit="return false;" name="addWebMusic">',
        '<dl class="e_layer_music">', '<dt class="md">音乐地址：</dt>', '<dd>', '<div class="music_input">',
        '<input id="#{mp3Address}" style="width:96%;padding-left:10px;" maxlength="255" placeholder="请输入音乐地址（http://）,支持MP3格式" class="tag_input" type="text"/>',
        '</div>', '<a id="#{mp3OK}" href="javascript:void(0)" class="music_btn btn_style">确定</a>', '</dd>', '</dl>',
        '<p class="music_warn" style="display:none;" id="#{error}">音乐地址要求必须为http地址且为mp3格式，请重新输入！</p>',
        '<dl class="e_layer_music">', '<dt>已选歌曲：</dt>', '<dd>', '<ul id="#{musicSelect}" class="music_select"></ul>',
        '</dd>', '</dl>',
        '<p class="mp"><input id="#{autoPlay}" type="checkbox" class="music_box"/><label for="#{autoPlay}">本博文自动音乐播放</label></p>',
        '<a id="#{insert}" href="javascript:void(0)" class="music_btn m_btn btn_style">插入音乐</a>', '</form>',
        '</div>'].join('');

    function showError(win) {
        var warn = win.getNode('error');
        warn.style.display = '';
    }

    function hideError(win) {
        var warn = win.getNode('error');
        warn.style.display = 'none';
    }

    function isValidate(url) {
        var parser = Util.urlParser(url);
        var pathname = parser.pathname;
        if (!pathname || !/\/[^\/]+\.mp3$/i.test(pathname)) {
            return false;
        } else {
            return true;
        }
    }

    function isRepeat(url) {
        return -1 !== musicList.indexOf(url);
    }

    function addToSelect(mp3AddressInput, address, selectList, win) {
        if (!address) {
            showError(win);
            return
        }
        if (0 !== address.indexOf('http://')) {
            address = 'http://' + address;
        }
        if (!isValidate(address)) {
            showError(win);
            return;
        }
        hideError(win);
        mp3AddressInput.value = '';
        if (isRepeat(address)) {
            return;
        }

        musicList.push(address);
        var li = $dom.create('li', {
            address: encodeURIComponent(address)
        }, ['<span class="music_chosen">', address, '</span>',
            '<a class="music_close" title="关闭" href="javascript:void(0)">×</a>'].join(''));
        selectList.appendChild(li);

    }

    function bindLayerEvent(win) {
        var mp3AddressInput = win.getNode('mp3Address');
        var mp3OKBtn = win.getNode('mp3OK');
        var autoPlay = win.getNode('autoPlay');
        var insertBtn = win.getNode('insert');
        var selectList = win.getNode('musicSelect');

        $dom.on(mp3AddressInput, 'keyup', function (e) {
            var address = Util.trim(mp3AddressInput.value);
            if (e.keyCode === VK.ENTER) {
                addToSelect(mp3AddressInput, address, selectList, win);
            } else if (address && !isValidate(address)) {
                showError(win);
            } else {
                hideError(win);
            }
        });

        $dom.on(mp3OKBtn, 'click', function (e) {
            var address = Util.trim(mp3AddressInput.value);
            addToSelect(mp3AddressInput, address, selectList, win);
        });
        $dom.on(insertBtn, 'click', function (e) {

            var autoPlay = win.getNode('autoPlay').checked ? 1 : 0;
            if (0 == musicList.length) {
                new WinBox({
                    type: 'alert',
                    text: '抱歉，您还没有选择音乐，请至少选择一首。'
                });
                return;
            }
            win.hide();
            editor.exec('insertMusic', {
                musicList: musicList,
                autoPlay: autoPlay
            });
            musicList = [];
        });
        $dom.on(selectList, 'click', function (e) {
            var target = e.target;
            var li = target.parentNode;
            var url = decodeURIComponent($dom.attr(li, 'address'));
            var index = musicList.indexOf(url);
            if (-1 !== index) {
                musicList.splice(index, 1);
            }
            $dom.remove(li);
        }, false, 'a');
    }

    function bindInsertMusicBtn(win) {

        function resetForm(win) {
            var ul = win.getNode('musicSelect');
            ul.innerHTML = '';
        }

        $dom.on($dom.$('#insert_music'), 'click', function () {
            if (!win) {
                win = new WinBox({
                    content: winContent,
                    funcClose: function (btn) {
                        musicList = [];
                        return;
                    },
                    width: 671, //音乐浮层需要宽度
                    title: '插入音乐'
                }, 'insert_music');
                bindLayerEvent(win);
            }
            resetForm(win);
            win.show();
            win.setMiddle();
        }, false);
    }

    // 初始化按钮事件
    function init() {
        bindInsertMusicBtn();
    }

    init();
});
