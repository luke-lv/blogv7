/**
 * @fileoverview
 *    微博 Widget (id=93)
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/sina.js");
$import("sina/core/function/bind2.js");

$import("lib/component/class/registComp.js");
$import("lib/component/extend/comp_dynamic.js");
$import('lib/getTplNum.js');
$registComp(93, {
    "load": function () {
        Lib.getTplNum(Core.Function.bind2(this.createIframe, this));
    }, "createIframe": function () {
        var miniblog_width = this.size - 22;
        var miniblog_height = 450;
        var miniblog_url = "http://service.weibo.com/widget/widget_blog.php?uid=" + scope.$uid + "&width=" + miniblog_width + "&height=" + miniblog_height;//下线skin参数 + "&skin=" + scope.tpl;
        var miniblog = '<iframe src="' + miniblog_url + '" frameborder="0" scrolling="no" allowtransparency="true" style="width:' + miniblog_width + 'px;height:' + miniblog_height + 'px;margin:10px;"></iframe>';
        this.getContent().innerHTML = (miniblog);
    }
    /*
     * 重新加载微博组件
     * @param {Number}	sSize			按什么尺寸重载
     * @param {Boolean}	bAddManage		是否需要加管理链接
     * @param {Boolean}	bForceRequest	是否强制刷新
     */, "reload": function (sSize, bAddManage, bForceRequest) {
        var sizeCorrect = sSize == null || (sSize && (sSize == 210 || sSize == 510 || sSize == 730));
        if (!sizeCorrect) {
            Debug.error("请检查传入的组件尺寸是否正确。" + sSize);
            return;
        }
        this.size = sSize || this.size;
        this.load();
    }
}, "dynamic");