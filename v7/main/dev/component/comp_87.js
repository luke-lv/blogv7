/**
 * @fileoverview
 *    博客首页视频列表组件 id=87
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
$registComp(87, {
        /*
         * 视频列表模板 210px
         */
        "htmlTemplate": ['<li class="videoCell">'
            , '<div class="videoReview">'
            , '<a href="http://you.video.sina.com.cn/b/#{videoid}-#{up_userid}.html" target="_blank">'
            ,
                '<img src="#{videoImage}" width="' + (this.size == 730 ? 120 : 80 ) + '" height="' + (this.size == 730 ? 90 : 60) + '" alt="#{nameAll}"'
            , ' title="#{nameAll}" border="0" /></a></div>'
            , '<div class="videoDesc">'
            , '<h6><a href="http://you.video.sina.com.cn/b/#{videoid}-#{up_userid}.html" target="_blank">'
            , '#{nameAll}</a></h6>'
            , '</div>'
            , '</li>'].join("")
        /*
         * 载入视频列表数据
         */, "load": function () {
            var i_getLastestVideo = new Interface("http://you.video.sina.com.cn/api/blogVideoList.php", "jsload");
            var currentStyle = {
                210: 1, 510: 2, 730: 3
            };
            i_getLastestVideo.request({
                GET: {
                    "uid": scope.$uid, "channelId": "", "page": 1, "style": currentStyle[this.size], "varname": "requestId_vl_" + scope.$uid
                }, onSuccess: Core.Function.bind2(function (oData) {
//				this.cacheData = oData.videoList;
//				this.count = oData.count;
//				this["render_" + this.size]();
                    this.setContent(oData.videoList);
                }, this), onError: function () {
                }, onFail: function () {
                }
            });
        }
        /*
         * 按 210 像素宽度渲染视频列表组件
         */, "render_210": function (oData) {
            oData = oData || this.cacheData;
            oData = oData.slice(0, 8);
            this.parseToHTML(oData);
        }
        /*
         * 按 510 像素宽度渲染视频列表组件
         */, "render_510": function (oData) {
            oData = oData || this.cacheData;
            oData = oData.slice(0, 6);
            this.parseToHTML(oData);
        }
        /*
         * 按 730 像素宽度渲染视频列表组件
         */, "render_730": function (oData) {
            oData = oData || this.cacheData;
            oData = oData.slice(0, 8);
            this.parseToHTML(oData);
        }
        /*
         *视频列表组件由 Json 转为 HTML
         */, "parseToHTML": function (oData) {
            // 如果视频数为 0，直接显示空文案
            if (oData.length == 0) {
                this.showEmpty();
            } else {
                var template = new Ui.Template(this.htmlTemplate);
                var result = '<div class="zVideolist"><ul class="zVideolistUl">' + template.evaluateMulti(oData) + '</ul>';
//			result += ((this.size == 510 && this.count > 6) || (this.size != 530 && this.count > 8)
//					? '<div class="zVideoMore"><span class="SG_more SG_floatR"><a target="_blank" href="'
//						+ 'http://you.video.sina.com.cn/vlist/' + scope.$uid + '.html">更多</a>&gt;&gt;</span></div></div>'
//					: '</div>');
                result += '<div class="zVideoMore"><span class="SG_more SG_floatR"><a target="_blank" href="' + 'http://you.video.sina.com.cn/vlist/' + scope.$uid + '.html">更多</a>&gt;&gt;</span></div></div>';
                this.setContent(result);
            }
        }
        /*
         * 视频列表为 0 的文案
         */, "showEmpty": function () {
            this.setContent('<div class="SG_nodata">' + $SYSMSG.B80006 + '</div>');
        }
    }, 'dynamic');