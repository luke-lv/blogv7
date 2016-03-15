$import("sina/core/dom/addHTML.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("lib/sendLog.js");
$import("lib/apply.js");
$import("lib/htmlTemplate.js");
$import("lib/util/getActionData.js");
$import("article/_article.js");

/**
 * @fileoverview 博客幻灯片推荐浮层
 * @author Qiangyee | wangqiang1@staff
 * @create 2012-08-23
 */
Article.SlideTJCover = function(cfg){
    var args = arguments;
    var o = args.callee._instance;

    this.cfg = cfg =  Lib.apply(this.cfg || {}, cfg);
    if (o){
        return o;
    }
    var __this = this;

    args.callee._instance = this;

    // 添加缩略小图
    var addImg = function (id, src, blogId){
        var img = new Image();
        img.src = src;
        $E(id).setAttribute("blogId", blogId);
        var setImg = function(id, src){
            //当前文章博文ID
            var cid = $E(id).getAttribute("blogId");
            if (cid === blogId) {
                $E(id).src = src;
            }
        }
        if (img.complete) {
            $E(id).src = src;
        } else {
            $E(id).src = pixPic;
            img.onload = function(){
                setImg(id, src);
            }
            img.onerror = function(){
                $E(id).src = "http://s4.sinaimg.cn/image/default_cover.gif#4";
            }
        }
        
    };

    // 为缩略图设置标题
    var setTitle = function (el, title, blogId){
        el = $E(el);
        title = title || "查看原文";
        if (el.textContent) {
            el.textContent = title;
        } else {
            el.innerText = title;
        }
        var href;
        if (blogId) {
            href = "http://blog.sina.com.cn/s/blog_"+blogId+".html"
        } else {
            href = "javascript:;";
        }
        el.href = href;
        
    };

    // 设置推荐浮层居中显示
    var fixLayerPos = function (containerEl, el){
        var top  = (containerEl.offsetHeight - el.offsetHeight)/2;
        var left = (containerEl.offsetWidth - el.offsetWidth)/2;
        if (top < 0){
            top = 0;
        }

        el.style.top = top+"px";

        if (left < 0){
            left = 0;
        }
        el.style.left = left+"px";
    };

    // 显示上一篇或下一篇幻灯
    var nextSlide = function (e){
        var datas = Lib.util.getActionData(e, "show-next-slide");
        if (!datas) {
            return;
        }

        var data = decodeURIComponent(datas.data).split("###");
        var blogId = data[0];

        var layer = new Article.MultipleImgLayer();
        layer.showNextSlide(blogId);
    };

    // 显示上一篇或下一篇幻灯推荐浮层
    var nextTJ = function (e){
        var datas = Lib.util.getActionData(e, "show-next-tj");
        if (!datas) {
            return;
        }
        var data   = decodeURIComponent(datas.data).split("###");
        var blogId = data[0];
        var time   = data[1] || "";
        var action = data[2] || "next";
        var layer  = new Article.MultipleImgLayer();
        layer.setDirection("next");
        
        layer.getNextSlideData(blogId, time, function(data){
			if (data.pre.blogId || data.next.blogId){
                showPageBtn();
				__this.show(data);
			} else{
                
                hidePageBtn(action);
            }
        }, action);

        return false;
    };

    var setActionData = function(id, data, time, action){
        if (data) {
            $E(id).setAttribute("action-data", 
                encodeURIComponent(data + "###" + time + "###" + action));
        }
    };
    var hidePageBtn = function(direction){
        $E(nodeIds[direction+"Btn"]).style.visibility = "hidden";
    }

    var showPageBtn = function(){
        $E(nodeIds["nextBtn"]).style.visibility = "";
        $E(nodeIds["preBtn"]).style.visibility = "";
    }

    var hideNextArea = function(direction){
        setTitle(nodeIds[direction+"Title"], "");
        addImg(nodeIds[direction+"Img"], "http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif");
        setActionData(nodeIds[direction+"Btn"], "");

        $E(nodeIds[direction+"Img"]).style.visibility = "hidden";
        $E(nodeIds[direction+"Title"]).style.visibility = "hidden";
        hidePageBtn(direction);
    };
    // 将中尺寸图片转换为小图
    var convertUrl = function(url){
        var urlReg = /(?:(?:ww\d+|s\d+).sinaimg.cn|photo\.sina\.com\.cn)\/(mw690|mw600|middle|bmiddle)/;
        var groups = url.match(urlReg);
        if (groups){
            switch(groups[1]){
                case "bmiddle" :
                    return url.replace(/\/bmiddle\//, "\/cover\/");
                case "mw690" : //middle
                    return url.replace(/\/mw690\//, "\/cover\/");
                case "middle" : 
                    return url.replace(/\/middle\//, "\/cover\/");
                case "mw600" :
                    return url.replace(/\/mw600\//, "\/cover\/");
                default : 
                    return url;
            }
        } else {
            return url;
        }
        
    };
    var pixPic = "http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif";
    var _tplStr = '<div id="#{entity}" class="showEnd" style="position:absolute;visibility:hidden;">'
              +'<div class="tit">'
                +'<strong>该篇博文浏览结束</strong>'
                +'<a id="#{review}" href="javascript:;" class="replay" title="重新浏览" hidefocus="true"></a></div>'
              +'<div class="pages">'
                +'<a id="#{preBtn}" href="javascript:void(0);" class="preview" action-type="show-next-tj" hidefocus="true">&lt;&lt;上一篇</a>'
                +'<a id="#{nextBtn}" href="javascript:void(0);" class="next" action-type="show-next-tj" hidefocus="true">下一篇&gt;&gt;</a></div>'
              +'<div class="content"><ul><li>'
                    +'<a id="#{preImgBtn}" action-type="show-next-slide" href="javascript:;" hidefocus="true"><img id="#{preImg}" src="'
                    + pixPic + '" /></a>'
                    +'<a id="#{preTitle}" href="javascript:;" target="_blank" hidefocus="true">标题</a></li>'
                  +'<li class="nomgr">'
                    +'<a id="#{nextImgBtn}" action-type="show-next-slide" href="javascript:;" hidefocus="true">'
                        +'<img id="#{nextImg}" src="'
                        + pixPic + '" /></a>'
                    +'<a id="#{nextTitle}" href="javascript:;" target="_blank" hidefocus="true">标题</a>'
                  +'</li>'
                +'</ul>'
              +'</div>'
            +'</div>';

    // 初始化幻灯片浮层，只需要初始化图片和loading图片
    var doc  = document,
        mask = null,
        tpl  = new Lib.HtmlTemplate(_tplStr);

    Core.Dom.addHTML(cfg.renderTo, tpl.getHtmlString());
    var nodeIds = tpl.getNodeIds();

    var _addEvent = Core.Events.addEvent;

    // _addEvent($E(nodeIds["entity"]), function(){
    //     Core.Events.stopEvent();
    //     return false;
    // });

    _addEvent($E(nodeIds["review"]), (function(){
        v7sendLog('49_01_06');
        this.cfg.review(this);
    }).bind2(this));

    _addEvent($E(nodeIds["preBtn"]), function(){
        v7sendLog('49_01_07');
    });

    _addEvent($E(nodeIds["nextBtn"]), function(){
        v7sendLog('49_01_08');
    });

    _addEvent($E(nodeIds["preImgBtn"]), function(){
        v7sendLog('49_01_09');
    });

    _addEvent($E(nodeIds["nextImgBtn"]), function(){
        v7sendLog('49_01_10');
    });

    //注册事件
    _addEvent($E(nodeIds["entity"]), nextSlide);

    _addEvent($E(nodeIds["entity"]), nextTJ);
    

    // 对外暴露的方法
    var _that = {

        isHidden : true,

        getEntity : function(){
            return $E(nodeIds["entity"]);
        },
        fixPos : function(){
            if (!this.isHidden) {
                fixLayerPos(this.cfg.renderTo, this.getEntity());
            }
        },
        /**
         * 显示推荐浮层
         */
        show : function(data){
            var coEl = $E(nodeIds["preImgBtn"]).parentNode.parentNode.parentNode;
            var btnEl = $E(nodeIds["preBtn"]).parentNode;
            if (!data) {
                coEl.style.display = "none";
                btnEl.style.display = "none";
                data = {};
            } else {
                coEl.style.display = "";
                btnEl.style.display = ""
            }

            var cfg = this.cfg,
                containerEl = cfg.renderTo,
                el = this.getEntity();
            if (el.offsetHeight == 0 || el.offsetWidth == 0){
                return false;
            }
            fixLayerPos(containerEl, el);

            this.isHidden = false;

            // 显示推荐浮层
            el.style.visibility = "inherit";
            
            // 为缩略图设置标题
            var preTitleEl = $E(nodeIds["preTitle"]),
                nextTitleEl = $E(nodeIds["nextTitle"]);
            var isHiddenBg = false;

            // 添加照片
            if (data.pre && data.pre.images && (data.pre.images.length > 0)) {
                var preBlogId = data.pre.blogId;
                var prePubTime   = data.pre.publishTime;
                $E(nodeIds["preTitle"]).style.visibility = "inherit";
                setTitle(preTitleEl, data.pre.title, preBlogId);

                addImg(nodeIds["preImg"], convertUrl(data.pre.images[0]),preBlogId);
                $E(nodeIds["preImg"]).style.visibility = "inherit";

                setActionData(nodeIds["preBtn"], preBlogId, prePubTime, "pre");

                $E(nodeIds["preBtn"]).style.visibility = "inherit";

                setActionData(nodeIds["preImgBtn"], preBlogId);
            } else {
                isHiddenBg = true;
                hideNextArea("pre");
            }

            if (data.next && data.next.images && (data.next.images.length > 0)) {
                var nextBlogId  = data.next.blogId;
                var nextPubTime = data.next.publishTime;
                $E(nodeIds["nextTitle"]).style.visibility = "inherit";
                setTitle(nextTitleEl, data.next.title, nextBlogId);
                addImg(nodeIds["nextImg"], convertUrl(data.next.images[0]), nextBlogId);
                $E(nodeIds["nextImg"]).style.visibility = "inherit";

                setActionData(nodeIds["nextBtn"], nextBlogId, nextPubTime, "next");
                $E(nodeIds["nextBtn"]).style.visibility = "inherit";
                
                setActionData(nodeIds["nextImgBtn"], nextBlogId);
            } else {
                isHiddenBg = true;
                hideNextArea("next");
            }

            if (isHiddenBg) {
                coEl.style.backgroundImage = "none"
            } else {
                if (!$IE6){
                    coEl.style.background = "url("+orURL+") 235px 100px no-repeat";
                } else {
                    coEl.style.backgroundImage = "url("+orURL+")";
                }
            }

            this.cfg.data = data;

            return true;
        },
        /**
         * 隐藏推荐浮层
         */
        hide : function(){
            var entity = this.getEntity();
            entity.style.visibility = "hidden";
            this.isHidden = true;
            return true;
        }
    }
    var orURL = "http://simg.sinajs.cn/blog7style/images/common/multishow_or."+($IE==6?"gif":"png");
    Lib.apply(this, _that);
};