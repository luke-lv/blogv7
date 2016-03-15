$import("sina/core/dom/getChildrenByClass.js");
$import("lib/component/class/registComp.js");
//$import("lib/dialogConfig.js");
//$import("lib/interface.js");
//$import("msg/pushcode.js");

/**
 * @fileoverview 猜你喜欢组件
 *
 * @create 2012-11-01
 * @author Qiangyee
 */
$registComp(940, {
    /**
     * 加载猜你喜欢组件
     *
     */
    load: function () {
        var byChildren = Core.Dom.getChildrenByClass;

        var that = this;

        Utils.Io.JsLoad.request('http://news.sina.com.cn/temp/87/20121031/blog_guess.js', {
            isRemove: false,
            onComplete: function () {

                var a = new window.tmpUidev.GuessList({
                    showCount: 5,
                    contId: 'module_body_940',
                    changeId: 'module_change_940',
                    needLine: true,
                    ulCssClass: 'reco_bloglist have_user',
                    lineCssClass: 'like_line',
                    liCssClass: 'reco_bloglist_con',
                    newsCssClass: 'blogname',
                    slideCssClass: '',
                    videoCssClass: '',
                    type: 'blog'  //all, news, silde, video, blog
                });
                //$E('module_body_940').style.height = 'auto';
                window.guessinstance = a;
            },
            onException: function () {
            },
            timeout: 30000
        });
    }
});
