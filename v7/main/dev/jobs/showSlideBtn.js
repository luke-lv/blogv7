/**
 * @fileoverview 博客文章详情页显示幻灯片按钮
 *
 * @author Qiangyee | wangqiang1@staff
 * @create 2012-08-20
 * 
 */
$registJob("showSlideBtn", function(sandBox){

    var foreach = Core.Array.foreach,
    pageid = scope.$pageid,
    isArt = pageid == "article" || pageid == "articleM" || pageid == 'article_new' || pageid == 'articleM_new',
    uid = scope.$uid,
    nickName,
    //图片所在栏目
    wrap = $E('sina_keyword_ad_area2') || document.body,
    //图片所在栏目的left值
    wrapLeft,
    image,
    //最小高度，小于这个高度就不出现分享按钮
    minHeight = 62, //83
    fixAutoHover = 1,
    __addEvent = Core.Events.addEvent;

    var slideWrapper = SinaEx.createNode('<div style="left: -1000px; top: -1000px;position:absolute;" class="picSlideBtn" action-type="show-slide" action-data="http%3A%2F%2Fww4.sinaimg.cn%2Flarge%2F697db644jw1dw1s1zljvaj.jpg"><a href="javascript:void(0);">幻灯播放</a></div>');

    document.body.appendChild(slideWrapper);

    //鼠标移进图片执行函数
    function fnover() {
        if (this.width < 200 && this.height < 200) {
            return false;
        }

        var src = this.getAttribute("real_src") || this.getAttribute("src");
        this.setAttribute("action-data", encodeURIComponent(src));
        this.setAttribute("action-type", "show-slide");
            
        var left = Core.Dom.getXY(this)[0] + 10;

        //若图片超出容器
        left = Math.min(left, wrapLeft - 134);
        slideWrapper.style.left = left + "px";

        slideWrapper.style.top = (Core.Dom.getXY(this)[1] + 10) + "px";
        if (fixAutoHover) {
            slideWrapper.style.display = "";
            slideWrapper.setAttribute("action-data", encodeURIComponent(this.src));
        }
    }

    //鼠标移出图片执行函数
    function fnout() {
        if (this.width < 200 && this.height < 200) {
            return false;
        }
        var e = Core.Events.getEvent(),
        et = e.relatedTarget || e.toElement;
        if (!et || !Core.Dom.contains(slideWrapper, et)) {
            slideWrapper.style.display = "none";
        }
    }
    // 判断图片是否为表情
    function isFacePic(img){
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

    function findParentLink(node){
        while (node = node.parentNode){
            if ("A" === node.nodeName.toUpperCase()) {
                return node;
            }
        }
        return null;
    }

    function bindEvent(img){
        __addEvent(img, fnover.bind2(img), 'mouseover');
        __addEvent(img, fnout.bind2(img), 'mouseout');
    }
    function bindFn(img) {
        //表情图片 不出现 分享链接
        if (isFacePic(img) || !Core.Dom.contains(wrap, img)) {
            return;
        }
        getWrapLeft();

        var pnLink = findLink(img);
        
        if (pnLink && (-1 === pnLink.href.indexOf("photo.blog.sina.com.cn"))){
            return;
        }
        var currentSrc = img.getAttribute("src");
        var isDefault = (-1 !== currentSrc.indexOf("sg_trans.gif"));
        // trace("fuck:"+img.src);
        // 在IE下有的图片绑不上事件
        if (img.complete && !isDefault) {
            bindEvent(img);
        } else {
            img.onload = (function(){
                bindEvent(this);
                var src = this.getAttribute("real_src");
                var currentSrc = this.getAttribute("src");
                if (!src && (src === currentSrc)) {
                    img.onload = null;
                }
            }).bind2(img);
        }
    }

    function getWrapLeft() {
        wrapLeft = Core.Dom.getXY(wrap)[0] + wrap.clientWidth;
    }

    Core.Events.addEvent(window, getWrapLeft, 'resize');

    //找出图片所在图片博客链接
    function findLink(node) {
        if (!isArt) {
           return null;
        }
        var tagMore;
        while (node = node.parentNode) {
            if (node.nodeName.toUpperCase() == "A") {
                return node;
            }
        }

        return null;
    }

    function bindWrapFn() {

        fixAutoHover = 1;
        foreach($T(wrap, 'img'), function(img) {
             //trace("fuck22:"+img.src);
            bindFn(img, 'src');
            
        });
    }

    bindWrapFn();

    scope.showPicSlide = function(img, src){
        bindFn(img);
    }
});
