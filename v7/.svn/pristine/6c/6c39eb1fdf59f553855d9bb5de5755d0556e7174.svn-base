/**
 * @fileoverview
 *    博客首页相册专辑组件 id=86
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("sina/core/function/bind2.js");
$import("sina/ui/template.js");

$import("lib/component/class/registComp.js");
$import("lib/component/extend/comp_dynamic.js");
$import("lib/interface.js");

$import("msg/componentMSG.js");
$registComp(86, {
        /*
         * 专辑模板
         */
        "htmlTemplate": ['<li><div class="smallPic">'
            , '<a href="#{ctg_url}" target="_blank"><img src="#{cover_img_url}" width="80" height="80"'
            , ' alt="#{category}" title="#{category}" /></a></div>'
            , '<div class="albumlisttxt">'
            , '<a href="#{ctg_url}" target="_blank">#{category}</a><em class="SG_txtc">(#{pic_cnt})</em></div>'
            , '</li>'].join("")
        /*
         * 载入相册专辑数据
         */, "load": function () {
            var i_getLastestVideo = new Interface("http://photo.blog.sina.com.cn/services/blogwidget_ctg_list.php", "jsload");
            var type = {
                "210": 3,
                "510": 2,
                "730": 1
            };
            i_getLastestVideo.request({
                GET: {
                    "uid": scope.$uid, "type": type[this.size]
                }, onSuccess: Core.Function.bind2(function (oData) {
//				this.cacheData = oData.record;
//				this.count = oData.count;
                    this["render_" + this.size](oData);
                }, this), onError: Core.Function.bind2(function () {
                    this.setContent('<div class="loadFailed">加载失败！</div>');
                }, this), onFail: Core.Function.bind2(function () {
                    this.setContent('<div class="loadFailed">加载失败！</div>');
                }, this)
            });
            if (scope.$pageid == "pageSetM" && this.setManage) {
                this.setManage();
            }
        }
        /*
         * 按 210 像素宽度渲染相册专辑组件
         */, "render_210": function (oData) {
//		oData = oData || this.cacheData;
//		oData = oData.slice(0, 6);
            this.parseToHTML(oData);
        }
        /*
         * 按 510 像素宽度渲染相册专辑组件
         */, "render_510": function (oData) {
//		oData = oData || this.cacheData;
//		oData = oData.slice(0, 4);
            this.parseToHTML(oData);
        }
        /*
         * 按 730 像素宽度渲染相册专辑组件
         */, "render_730": function (oData) {
//		oData = oData || this.cacheData;
//		oData = oData.slice(0, 7);
            this.parseToHTML(oData);
        }
        /*
         * 相册专辑组件由 Json 转为 HTML
         */, "parseToHTML": function (oData) {
            this.setContent(oData);
        }
    }, 'dynamic');