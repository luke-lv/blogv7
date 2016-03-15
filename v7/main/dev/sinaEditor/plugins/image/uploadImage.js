;
(function () {
    /**
     * 图片上传逻辑
     * @author wangqiang
     * @date 14-8-13
     */
    var uploadHolder = {
        checkFlashVersion: function () {
            var obj = deconcept.SWFObjectUtil.getPlayerVersion();
            if (obj.major < 10) {
                return false;
            }
            return true;
        },
        installTip: function () {
            if (!this.checkFlashVersion()) {
                this.alert('我们的产品需要安装flashplayer 10或更高版本，请 <a href="http://get.adobe.com/flashplayer">点击此处</a> 免费下载', {
                    width: 550
                });
            }
        },
        instance: null,
        setUp: function (container, opts) {
            var self = this;
            if (self.instance) {
                return;
            }
            self.instance = new UploadImage(container, 'newFileUpload', {
                width: 47,
                height: 41,
                noMarker: true,
                zIndex: 30,
                nodes: {
                    relatedId: false
                },
                flashFile: 'fileuploadv6.swf',
                click: opts.click,
                error: opts.error,
                selectFile: opts.selectFile,
                uploadFinish: opts.uploadFinish,
                allFinish: opts.allFinish
                //      ,
                //      imageInfo: opts.imageInfo
            });
            window.uploadImage = self.instance;
            window.uploadImageIsRead = function () {
                return self.isReady();
            }
            //window.imageList =
        },
        isReady: function () {
            //trace("flase_callback:uploadImageIsRead");
            if (this.instance) {
                return true;
            } else {
                return false;
            }
        },
        /**
         * 提示对话框
         * @param {String}  text 对话框显示的文本
         * @param {Object}  cfg 对话框的配置参数
         * @param {Function}  cfg.funcOk "确定"按钮执行的方法
         * @param {String}  cfg.textOk "确定"按钮的文本
         * @param {Function}  cfg.funcClose "关闭"按钮执行的方法
         * @param {Function}  cfg.funcBeforeClose 点"关闭"按钮后,对话框在关闭前执行的方法
         * @param {String}  cfg.title 标题
         * @param {String}  cfg.icon 显示图标 ["01","01","03","04"]
         * @param {Number}  cfg.width 宽度
         * @param {Number}  cfg.height 高度
         * @param {String}  cfg.subText 次级文本
         * @param {Number}  cfg.bgShadowOpacity 背景阴影层的透明度 0-1,小于0为不显示
         */
        alert: function (text, opts) {
            opts.type = 'alert';
            opts.text = text;
            return new SinaEditor.ui.WinBox(opts, 'upload_image_error')
        }
    }
    SinaEditor.uploadHolder = uploadHolder;
})();
