/**
 * @fileoverview 绑定组件内的鼠标移动到图片上事件，显示幻灯播放按钮
 *
 * @author  Qiangyee | wangqiang1@staff
 * @create  2012-09-20
 */
$import("sina/core/array/foreach.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/dom/contains.js");
$import("lib/app.js");
$import("other/SinaEx.js");
App.bindSlideEvent = function (blogInfoList, wrap) {

    var foreach = Core.Array.foreach, uid = scope.$uid, //图片所在栏目的left值
        wrapLeft, //最小高度，小于这个高度就不出现分享按钮
        minHeight = 62, //83
        fixAutoHover = 1, __addEvent = Core.Events.addEvent;

    //找出图片所在图片博客链接
    var findLink = function (node) {
        var tagMore;
        while (node = node.parentNode) {
            if (node.nodeName.toUpperCase() == "A") {
                return node;
            }
        }

        return null;
    }

    var getWrapLeft = function () {
        wrapLeft = Core.Dom.getXY(wrap)[0] + wrap.clientWidth;
    }
    //鼠标移进图片执行函数
    var fnover = function () {
        if (this.width < 200 && this.height < 200) {
            return false;
        }
        var data = this.getAttribute("action-data");
        this.setAttribute("action-type", "show-slide");

        var left = Core.Dom.getXY(this)[0] + 10;

        //若图片超出容器
        left = Math.min(left, wrapLeft - 134);
        slideBtn.style.left = left + "px";

        slideBtn.style.top = (Core.Dom.getXY(this)[1] + 10) + "px";
        slideBtn.style.display = "";
        slideBtn.setAttribute("action-data", data);
    }

    //鼠标移出图片执行函数
    var fnout = function () {
        if (this.width < 200 && this.height < 200) {
            return false;
        }
        var e = Core.Events.getEvent(), et = e.relatedTarget || e.toElement;
        if (!et || !Core.Dom.contains(slideBtn, et)) {
            slideBtn.style.display = "none";
        }
    }
    // 绑定一篇文章的图片
    var bindBlogEvent = function (blogInfo) {
        var blogId = blogInfo.blogId
            , imgs = blogInfo.imgs
            , link = blogInfo.link
            , title = blogInfo.title
            , pubTime = blogInfo.publishTime;

        for (var i = 0, len = imgs.length; i < len; i++) {
            try {
                bindFn(imgs[i], blogId, link, title, pubTime);
            } catch (e) {
                // console.log(e);
            }
        }
    };
    // 判断图片是否为表情
    var isFacePic = function (img) {
        var src = img.getAttribute("real_src") || img.getAttribute("src") || "";
        if (-1 !== src.indexOf("sinaimg.cn/uc/myshow")) {
            return true;
        }
        if (-1 !== src.indexOf("img.t.sinajs.cn")) {
            return true;
        }
        if (-1 !== src.indexOf("simg.sinajs.cn")) {
            return true;
        }
        if (-1 !== src.indexOf("sinaimg.cn/small")) {
            return true;
        }
        if (-1 !== src.indexOf("sinaimg.cn/square")) {
            return true;
        }
        return false;
    }

    var bindImgEvent = function (img, blogId, link, title, pubTime) {
        var src = img.getAttribute("real_src") || img.getAttribute("src");
        src = encodeURIComponent(src);
        link = encodeURIComponent(link);
        title = encodeURIComponent(title);
        pubTime = encodeURIComponent(pubTime);

        img.setAttribute("action-data", src + '&' + blogId + '&' + link + '&' + title + '&' + pubTime);

        __addEvent(img, fnover.bind2(img), 'mouseover');
        __addEvent(img, fnout.bind2(img), 'mouseout');
    }
    // 绑定一篇博文的文章图片事件
    var bindFn = function (img, blogId, link, title, pubTime) {
        //表情图片 不出现 分享链接
        if (isFacePic(img) || !Core.Dom.contains(wrap, img)) {
            return;
        }
        getWrapLeft();

        var pnLink = findLink(img);

        if (!pnLink || (-1 === pnLink.href.indexOf("photo.blog.sina.com.cn"))) {
            return;
        }
        var currentSrc = img.getAttribute("src");
        var isDefault = (-1 !== currentSrc.indexOf("sg_trans.gif"));
        // trace("fuck:"+img.src);
        // 在IE下有的图片绑不上事件
        if (img.complete && !isDefault) {
            bindImgEvent(img, blogId, link, title, pubTime);
        } else {
            img.onload = (function () {
                bindImgEvent(this, blogId, link, title, pubTime);
                var src = this.getAttribute("real_src");
                var currentSrc = this.getAttribute("src");
                if (!src && (src === currentSrc)) {
                    img.onload = null;
                }
            }).bind2(img);
        }
    };

    var slideBtn = $E('slide-btn');
    if (!slideBtn) {
        slideBtn = SinaEx.createNode('<div id="slide-btn" style="left: -1000px; top: -1000px;position:absolute;" class="picSlideBtn" action-type="show-slide" action-data=""><a href="javascript:void(0);">幻灯播放</a></div>');
        document.body.appendChild(slideBtn);
    }

    for (var i = 0, len = blogInfoList.length; i < len; i++) {
        bindBlogEvent(blogInfoList[i]);
    }

};