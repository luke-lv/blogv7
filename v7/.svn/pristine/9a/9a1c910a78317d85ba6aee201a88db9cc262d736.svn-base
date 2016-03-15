(function () {
    /*
     * 注册blogupload插件
     */
    SinaEditor.PluginManager.register('blogupload', function (options, editor) {
        var dom = new DOMUtil(), evt = new Event();
        var count = 0, picModList = [], picUpload, upLoadingList = [], isLoading = false;
        var defaultText = '描述（可选，在图片下方显示）', descMaxLen = 42;
        var fomatText = '格式不符', sizeText = '尺寸过大', errorText = '上传失败', timeoutText = '上传超时', sysErrorText = '系统繁忙', defaultSize = 5 * 1024;

        var editorText = options.editorDefaultText || '写文章';
        var file;
        var uploadBtnStyle = {
            position: 'fixed',
            opacity: 0,
            zIndex: 100,
            overflow: 'hidden',
            top: '4em',
            right: '3em',
            height: '45px',
            width: '45px'
        };
        var ajax = new Util.ajax();

        if (!options || !options.uploadBtn) {
            // console.log('fatal error , need upload Btn');
            return;
        }
        if (typeof options.uploadBtn === 'string') {
            options.uploadBtn = dom.$('#' + options.uploadBtn);
        }
        if (options.uploadBtnStyle) {
            uploadBtnStyle = Util.extend(uploadBtnStyle, options.uploadBtnStyle);
        }

        picUpload = new PicUpload(options);

        evt.bind('uploadSuccess', uploadSuccess);
        evt.bind('uploadFail', uploadFail);

        dom.on(editor.body, 'blur', editorBodyBlur);
        dom.on(document.body, 'click', editorBodyFun);

        editor.ready(function () {
            createUploadInput();
            preDataProcess();
        });

        editor.registerCmd('isFinishUpload', {
            queryCommandState: function () {
                // 木有正在上传的图片，木有等待上传的图片
                return (!isLoading && upLoadingList.length === 0);
            },
            exec: function () {
            }
        });

        editor.registerCmd('isAllPicsLoaded', {
            queryCommandState: function () {
                // 是否有上传失败的图片
                var i = 0, l = picModList.length, mod, isAllLoaded = true;
                for (i = 0; i < l; i++) {
                    mod = picModList[i];
                    if (mod.loadState === -1 || mod.loadState === -2 || mod.loadState === -3) {
                        isAllLoaded = false;
                        break;
                    }
                }
                return isAllLoaded;
            },
            exec: function () {
            }
        });

        editor.registerCmd('replaceContent', {
            queryCommandState: function () {
                // var reg = /<dl\s+class="pic-mod"\s+contenteditable="false"><dt\s+[^>]+style=".*background-image: url\((http:\/\/s\d{1,2}\.sinaimg.cn\/\w+)\);">(.*?)<p\s+contenteditable="true"\s+[^>]+>([^(<\/p>)]*)(.*?)<\/dl>/mgi;
                var reg = /<dl[\s\S]+?background-image: url\(([\w\d\.\:\/]+)\)[\s\S]+?<p contenteditable="true" nopaste="true">([\s\S]+?)<\/p><\/div><\/dd>[\s\S]+?<\/dl>/img;
                var content = editor.getContent();
                return content.replace(reg, function (a, b, c) {
                    /*
                     * a:符合正则的dl字符串
                     * b:第一个分组，图片地址
                     * c:第二个分组，图片描述
                     */
                    c = c === defaultText ? '' : c;
                    return '<p data-role="pic-mod-img" style="text-align:center">' + '<img src="' + b + '" alt="' + c + '" /></p><br data-role="pic-mod"/>' + '<p data-role="pic-mod-text" style="text-align:center">' + c + '</p>'
                });
            },
            exec: function (cmd) {
            }
        });

        function preDataProcess() {
            //console.log('preDataProcess');
            var children = editor.body.children, modArr, text;
            text = editor.body.textContent || editor.body.innerText;
            //content = Util.trim(content);
            if (text === '' || text === '\u200B' || children.length === 0 || children[0].nodeType === 3 || children[0].nodeType === 8) {
                editor.setContent(editorText);
                dom.attr(editor.body, 'is-empty', 1);
                return;
            }
            //var modArr = reg.exec(content);
            var dls = dom.$('.pic-mod', editor.body);
            var i = 0, l = dls.length, mod, pic, desc, btn, item;
            for (i; i < l; i++) {
                item = dls[i];
                if (item.tagName.toLowerCase() === 'dl') {
                    mod = item;
                    pic = dom.$('.pic', mod)[0];
                    btn = dom.$('.b-del-mod', mod)[0];
                    desc = dom.$('.desc', mod)[0].children[0];
                    picModList.push(new PicMod(null, mod, pic, btn, desc, 1));
                }
            }
        }

        /*
         * 创建File输入框并绑定事件
         */
        function createUploadInput() {

            file = document.createElement('input');
            file.type = 'file';
            file.name = 'pic1';
            file.style.display = 'none';
            file.id = 'file_' + +new Date();
            // file.setAttribute('tabindex', -1);

            for (var i in uploadBtnStyle) {
                file.style[i] = uploadBtnStyle[i];
            }

            document.body.appendChild(file);
            // dom.on(file, 'touchend', fileBtnHide);
            dom.on(file, 'change', fileChangeHandler);
            // dom.on(file, 'blur', fileBtnHide);

        };

        function editorBodyFun(e) {
            var e = e || window.event, tar = e.target || e.srcElement;
            if (dom.contains(file, tar) || dom.contains(editor.body, tar)) {
                editorBodyFocus();
            } else {
                editorBodyBlur();
            }
        }

        /*
         * File输入框的change事件
         */
        function fileChangeHandler(e) {
            // console.log("fileChangeHandler");
            var file, reader, picMod, text;
            file = this.files[0];	// 一次只需选择一张图片

            // TODO  图片类型及大小判断
            picMod = new PicMod(this);
            picModList.push(picMod);
            picMod.setState(0);

            text = editor.body.textContent;
            if (text === editorText) {
                editor.setContent('');
            }

            picMod.addTo(editor);

            if (file && file.type && !/image/.test(file.type)) {
                picMod.setState(-1, fomatText);
                return false;
            }
            if (file && file.size && Math.ceil(file.size / 1024) > defaultSize) {
                picMod.setState(-1, sizeText);
                return false;
            }

            picMod.upload();
            createUploadInput();

            if (typeof FileReader !== 'undefined') {
                reader = new FileReader();
                reader.readAsDataURL(file);

                dom.on(reader, 'load', function (e) {
                    var data = this.result;
                    picMod.setState(0, data);
                });

                dom.on(reader, 'error', function (e) {
                    picMod.setState(-1, errorText);
                });
            }
        }

        function editorBodyFocus(e) {
            // console.log('editorBodyFocus');
            var text = editor.body.textContent || editor.body.innerText;
            // text = Util.trim(text);
            if (text === editorText) {
                editor.setContent('');
                editor.exec('enter');
                dom.attr(editor.body, 'is-empty', 0);
            }

            fileBtnShow();

        };

        function editorBodyBlur(e) {
            // console.log('editorBodyBlur');
            if (e) {
                e = e || window.event;
                var tar = e.target || e.srcElement, toEl = e.relatedTarget || e.toElement;
                // console.log(toEl)
                if (toEl && (toEl.tagName.toLowerCase() === 'input' && toEl.name === 'pic1')) {
                    return;
                }
            }

            var text = editor.body.textContent || editor.body.innerText;
            var isOnlyEnterNode = editor.body.innerHTML == '<p><br></p>';
            if (isOnlyEnterNode || text === '' || text === '\u200B') {
                editor.setContent(editorText);
                // 这里需要移除一个class，focus
                dom.delClass(editor.body, 'focus');
                dom.attr(editor.body, 'is-empty', 1);
            }

            setTimeout(fileBtnHide, 500);
        };

        function fileBtnHide(argument) {
            // console.log('fileBtnHide');
            options.uploadBtn.style.display = 'none';
            if (file) {
                file.style.display = 'none';
            }

        }

        function fileBtnShow(argument) {
            // console.log('fileBtnShow');
            options.uploadBtn.style.display = '';
            if (file) {
                file.style.display = '';
            }
        }

        /*
         * 编辑器图片模块
         */
        function PicMod(file, mod, pic, btn, desc, state) {
            this.file = file || null;
            this.mod = mod || null;
            this.pic = pic || null;
            this.btn = btn || null;
            this.desc = desc || null;
            this.loadState = state || 0;
            this.init();
        };

        PicMod.prototype = {
            constructor: PicMod,
            init: function () {
                if (!this.mod) {
                    this.createPicMod();
                }
                this.bindEvent();
            },
            createPicMod: function () {
                this.mod = document.createElement('dl');
                this.mod.className = 'pic-mod';
                dom.attr(this.mod, 'contenteditable', 'false');
                this.mod.innerHTML = '<dt contenteditable="true" class="pic b-pic-style pic-deflt" style="z-index:100;"></dt>' + '<dd class="desc-box"><div class="desc"><p contenteditable="true" nopaste="true">描述（可选，在图片下方显示）</p></div></dd><dd class="b-del-mod"><span><i class="b-ft-icon">#</i></span></dd>';
                this.pic = dom.$('.pic', this.mod)[0];
                this.btn = dom.$('.b-del-mod', this.mod)[0];
                this.desc = dom.$('.desc', this.mod)[0].children[0];
            },
            setState: function (state, data) {
                if (!this.pic) { // 上传完成之前就删除模块，this.pic不存在
                    return;
                }
                switch (state) {
                    case 1:
                        // 上传成功
                        // console.log('img upload success:'+data);
                        dom.delClass(this.pic, 'pic-deflt');
                        dom.delClass(this.pic, 'pic-load');
                        this.pic.innerHTML = '';
                        this.pic.style.backgroundImage = 'url(' + data + ')';
                        this.loadState = 1;
                        break;
                    case 0:
                        // 上传中
                        // console.log('img loading:'+data);
                        dom.addClass(this.pic, 'pic-load');
                        this.pic.innerHTML = '<div class="b-loding-gif"></div>';
                        if (data) {
                            dom.delClass(this.pic, 'pic-deflt');
                            this.pic.style.backgroundImage = 'url(' + data + ')';
                        }
                        break;
                    case -1:
                        // 上传失败
                        // console.log('img upload error:'+data);
                        data = data || '上传失败';
                        dom.delClass(this.pic, 'pic-load');
                        dom.addClass(this.pic, 'pic-deflt');
                        dom.addClass(this.pic, 'pic-fail');
                        this.pic.style.backgroundImage = '';
                        this.pic.innerHTML = '<span class="tips b-txt3">' + data + '</span>';
                        this.loadState = -1;
                        break;
                    case -2:
                        // 上传超时
                        dom.delClass(this.pic, 'pic-load');
                        dom.addClass(this.pic, 'pic-deflt');
                        dom.addClass(this.pic, 'pic-fail');
                        this.pic.style.backgroundImage = '';
                        this.pic.innerHTML = '<span class="tips b-txt3">' + timeoutText + '</span>';
                        this.loadState = -2;
                        break;
                    case -3:
                        // 系统繁忙
                        dom.delClass(this.pic, 'pic-load');
                        dom.addClass(this.pic, 'pic-deflt');
                        dom.addClass(this.pic, 'pic-fail');
                        this.pic.style.backgroundImage = '';
                        this.pic.innerHTML = '<span class="tips b-txt3">' + sysErrorText + '</span>';
                        this.loadState = -3;
                        break;
                    default:
                        console.log('bug');
                }
            },
            bindEvent: function () {
                dom.on(this.pic, 'focus', this.picFocus.bind(this));
                dom.on(this.btn, 'click', this.delMod.bind(this));
                // dom.on(this.btn, 'touchend', this.delMod.bind(this));
                dom.on(this.desc, 'focus', this.descBoxFocus.bind(this));
                dom.on(this.desc, 'blur', this.descBoxBlur.bind(this));
                dom.on(this.desc, 'click', this.descBoxClick.bind(this));
                // dom.on(this.desc, 'touchend', fileBtnHide);
                // dom.on(this.desc, 'input', this.countWord.bind(this));
                dom.on(this.desc, 'keydown', this.countWord.bind(this));
                dom.on(this.desc, 'keydown', this.cantReturn.bind(this));
            },
            picFocus: function (e) {
                // console.log('picFocus')
                this.pic.blur();
            },
            descBoxClick: function (e) {
                e.stopPropagation();
                fileBtnHide();
            },
            descBoxFocus: function (e) {
                if (this.desc) {
                    if (this.desc.innerHTML === defaultText) {
                        this.desc.innerHTML = '';
                    }
                }
                this.countWord(e);
            },
            descBoxBlur: function (e) {
                if (this.desc) {
                    if (this.desc.innerHTML === '') {
                        this.desc.innerHTML = defaultText;
                    }
                }
                this.countWord(e);
            },
            countWord: function (e) {
                e = dom.fixEvent(e);
                var l, str = this.desc.textContent || this.desc.innerText, len = descMaxLen, code = e.keyCode;
                l = str.length;
                if (l >= len) {
                    if (VK.BACKSPACE !== code && VK.DELETE !== code) {
                        e.preventDefault();
                    }
                }
            },
            cantReturn: function (e) {
                e = dom.fixEvent(e);
                if (VK.ENTER == e.keyCode) {
                    e.preventDefault();
                }
            },
            addTo: function (editor) {
                //if(editor.COMMANDS['enter']) {
                //	editor.exec('enter') ;
                //}
                var range = editor.selection.getRange(), start = range.startContainer;

                // console.log(range);
                if (editor.COMMANDS['insertnode']) { //TODO:不应直接用COMMAND判断
                    editor.exec('insertnode', this.mod);
                } else {
                    range.insertNode(this.mod);
                }
                editor.selection.setCursor(true);
                dom.attr(editor.body, 'is-empty', 0);

                setTimeout(fileBtnHide, 300);
            },
            delMod: function (e) {
                // console.log("delMod");
                e = dom.fixEvent(e);
                e.preventDefault();
                this.mod.parentNode.removeChild(this.mod);
                var index = Util.arrayIndexOf(picModList, this);
                picModList.splice(index, 1);

                this.mod = null;
                this.btn = null;
                this.pic = null;
                this.desc = null;
            },
            upload: function () {
                picUpload.load(this);
            }
        };

        /*
         * 图片上传模块
         */
        function PicUpload(options) {
            var options = options || {};
            var proxyUrl = options.proxyUrl || 'http://blog.sina.cn/dpool/blog/newblog/riaapi/mblog/cb.php', loadUrl = options.loadUrl || 'http://upload.photo.sina.com.cn/interface/pic_upload.php', timeout = options.timeout || 2 * 60 * 1000;

            // loadUrl = Util.urlParser(loadUrl);
            // loadUrl.param('domain', 1)
            // delete loadUrl.params['varname'];
            // loadUrl = loadUrl.toString();
            // console.log(loadUrl);
            loadUrl += '?domain=1';

            var frameId, frameHtml, frameWrapper, frameNode, formNode, cb, app, s;

            frameId = 'async_fileupload_' + (count++), frameHtml = '<iframe id="' + frameId + '" name="' + frameId + '" src="about:blank"></iframe>', frameWrapper = document.createElement('div');
            frameWrapper.innerHTML = frameHtml;
            frameWrapper.style.display = 'none';
            document.body.appendChild(frameWrapper);
            frameNode = dom.$('#' + frameId);

            formNode = document.createElement('form');
            formNode.setAttribute('target', frameId);
            formNode.setAttribute('enctype', 'multipart/form-data');
            formNode.setAttribute('method', 'post');

            cb = document.createElement('input');
            cb.type = 'hidden';
            cb.name = 'cb';

            app = document.createElement('input');
            app.type = 'hidden';
            app.name = 'app';
            app.value = 'photo'

            s = document.createElement('input');
            s.type = 'hidden';
            s.name = 's';
            s.value = 'rdxt';

            function getTicket(mod) {
                ajax.request('http://blog.sina.cn/dpool/blog/newblog/riaapi/mblog/getst.php', {
                    method: 'POST',
                    returnType: 'json',
                    timeout: 2 * 60 * 1000,
                    onComplete: function (result) {
                        // console.log('getTicket onComplete:\n');
                        if (result && (result.code === 'A00006')) {
                            upLoading(mod, result.data);
                        } else {
                            // console.log('getTicket error:'+result && result.data)
                            mod.setState(-1);
                        }

                    },
                    onException: function (result) {
                        // console.log('getTicket onException:\n');
                        mod.setState(-3);
                    },
                    onTimeout: function (result) {
                        // 超时
                        mod.setState(-2);
                    }
                });
            }

            function upLoading(mod, ticket) {
                var len, nextMod, callback, cbname, timer;
                if (!isLoading) {
                    isLoading = true;

                    cbname = 'editor' + editor.id + +new Date;
                    SinaEditor[cbname] = function (data) {
                        isLoading = false;
                        delete SinaEditor[cbname];
                        timer && clearTimeout(timer);
                        if (data && data.pid) {
                            evt.fire(mod, 'uploadSuccess', [data, mod]);
                        } else {
                            evt.fire(mod, 'uploadFail', [data, mod]);
                        }
                        len = upLoadingList.length;
                        if (len) {
                            nextMod = upLoadingList.shift()
                            nextMod.upload();
                        }
                    };
                    callback = 'SinaEditor' + '.' + cbname;
                    cb.value = proxyUrl + '?callback=' + callback;

                    formNode.innerHTML = '';
                    loadUrl += '&ticket=' + ticket + '&mime=image/jpeg';
                    formNode.setAttribute('action', loadUrl);
                    formNode.appendChild(app);
                    formNode.appendChild(s);
                    formNode.appendChild(cb);
                    formNode.appendChild(mod.file);

                    frameWrapper.appendChild(formNode);

                    formNode.submit();

                    timer = setTimeout(function () {
                        if (isLoading) {
                            isLoading = false;
                            delete SinaEditor[cbname];
                            evt.fire(mod, 'uploadFail', [
                                {msg: 'timeout'},
                                mod
                            ]);

                            len = upLoadingList.length;
                            if (len) {
                                nextMod = upLoadingList.shift()
                                nextMod.upload();
                            }
                        }
                    }, timeout);
                }
            };

            return {
                load: function (mod) {
                    if (isLoading) {
                        upLoadingList.push(mod);
                    } else {
                        getTicket(mod);
                    }
                }
            }
        };

        /*
         * 图片上传成功的回调事件
         */
        function uploadSuccess(e, data) {
            // console.log('uploadSuccess');
            var res = data[0], mod = data[1], img, src, random;
            random = Math.ceil(Math.random() * 15);
            img = new Image();
            src = 'http://s' + random + '.sinaimg.cn/bmiddle/' + res.pid;
            img.src = src;
            img.onload = function () {
                mod.setState(1, src);
            };
            img.onerror = function () {
                mod.setState(-1, errorText);
            };
        };

        /*
         * 图片上传失败的回调事件
         */
        function uploadFail(e, data) {
            // console.log('uploadFail');
            var res = data[0], mod = data[1];
            if (res && res.ret == '-9') {
                mod.setState(-1, fomatText);
                return;
            } else if (res && res.ret == '-10') {
                mod.setState(-1, sizeText);
                return;
            }
            if (res && res.msg === 'timeout') {
                mod.setState(-2);
                return;
            }
            mod.setState(-1, errorText);
        };

    });
})()
