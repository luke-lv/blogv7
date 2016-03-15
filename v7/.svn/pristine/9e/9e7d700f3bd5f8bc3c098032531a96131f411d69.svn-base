$import("sina/core/dom/addHTML.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/stopBubble.js");
$import("sina/core/string/trim.js");
$import("sina/ui/tween/tweenStrategy.js");
$import("sina/ui/layerCount.js");
$import("lib/sendLog.js");
$import("lib/sendSuda.js");
$import("lib/onlyShadow.js");
$import("lib/htmlTemplate.js");
$import("article/_article.js");
$import("article/slideTJCover.js");
$import("lib/diYuanXinLog.js");
/**
 * @fileoverview 多图幻灯片
 *
 * @author Qiangyee | wangqiang1@staff
 * @date   2012-07-23
 */
Article.MultipleImgLayer = function(cfg){
    
    var args = arguments;
    var o = args.callee._instance;
    if (o){
        return o;
    }

    args.callee._instance = this;

    var me = this;

    var hideScroller = function(){
        if ($FF){
            me.scrollTop = document.documentElement.scrollTop;
        }
        
        if ($IE6){
            document.body.setAttribute("scroll", "no");
        } else {
            document.documentElement.style.overflow = "hidden";
            !$IE8 && (document.body.style.overflow = "hidden");
        }
    };

    var showScroller = function(){
        
        if ($IE6){
            document.body.removeAttribute("scroll");
        } else {
            document.documentElement.style.overflow = "auto";
            !$IE8 && (document.body.style.overflow = "auto");
        }

        if ($FF){
            document.documentElement.scrollTop = me.scrollTop;
        }
        
    };

    // 获取显示窗口的尺寸
    var getWinSize = function(){
        var clientSize = function(name){
            var doc = document,
                docElemProp = doc.documentElement[ "client" + name ],
                body = doc.body;
            return doc.compatMode === "CSS1Compat" && docElemProp ||
                body && body[ "client" + name ] || docElemProp;
        }
        return {
            height : clientSize("Height"),
            width  : clientSize("Width")
        }
    };

    // 显示loading图标
    var showLoading = function(winSize){

        var loadingEl = $E(layerNodesId["multiPicLoading"]),
            height  = Math.max(winSize.height, 500),
            width   = Math.max(winSize.width, 500);
        
        loadingEl.style.top  = (height - 181)/2 + "px";
        loadingEl.style.left = (width - 141)/2 + "px";

        removeCurrentPic();

    };
    
    // 隐藏loading图标
    var hideLoading = function(){
        $E(layerNodesId["multiPicLoading"]).style.top = "-1000px";
    };

    // 更新浮层的宽和高
    var updateWinPosAndSize = function(entity){
        var winSize = getWinSize(),
            height  = Math.max(winSize.height, 500),
            width   = Math.max(winSize.width, 500),
            doc     = document,
            scrollHeight = doc.documentElement.scrollTop + doc.body.scrollTop;

        entity.style.height = height + "px";
        entity.style.width  = width + "px";
        entity.style.top    = scrollHeight + "px";

        var contentEl = $E(layerNodesId["multiPicContent"]);
        contentEl.style.height = (height-88) + "px";
        
    };
    
    var getCurrentPic = function(){
        var contentEl = $E(layerNodesId["multiPicContent"]);
        var pics = contentEl.getElementsByTagName("IMG"),
            img, attr;
        for (var i = 0, l = pics.length; i < l; i++) {
            img  = pics[i];
            attr = img.getAttribute("origin-size");
            if (attr) {
                return img;
            };
        };
        //console.log("getCurrentPic:" + pics.length);
        return null;
    };

    // 删除当前正在显示的图片
    var removeCurrentPic = function(){

        var curentPic = getCurrentPic();
        
        if (curentPic){
            //console.log(curentPic.src);
            curentPic.parentNode.removeChild(curentPic);
        }
    };

    var setCurrentPicSize = function(winSize, imageEl){
        
        var maxHeight = Math.max(winSize.height - 88, 412);
        var maxWidth  = Math.max(winSize.width, 500);
        var imgHeight = imageEl.height;
        var imgWidth  = imageEl.width;

        imageEl.setAttribute("origin-size", imgWidth+"*"+imgHeight);
        var hPercent = ((winSize.height-88)/imgHeight);
        var wPercent = (winSize.width/imgWidth);

        if (!isFinite(hPercent) || !isFinite(wPercent)){
            return;
        }
        // 1、缩放图片算法，比率小于1，代表图片超宽或高
        // 2、总是缩放比率最小的那个属性
        var rate = 1, width, height;
        if ( (1 > hPercent) && (hPercent < wPercent) ){
            height = Math.min(imgHeight, maxHeight);
            rate = height/imgHeight;
            width = rate * imgWidth;
            imageEl.height = height;
            imageEl.width = width;
            //imageEl.removeAttribute("width");
        } else if ( 1 > wPercent ){
            width = Math.min(imgWidth, maxWidth);
            rate = width/imgWidth;
            height = rate * imgHeight;
            imageEl.width  = width;
            imageEl.height = height;
            //imageEl.removeAttribute("height");
        }
        if ($IE && $IE < 8){
            imageEl.style.zoom = 1;
        }
        //trace("size: width"+ imgWidth + "  height:" + imgHeight + " rate:" +rate)
    };

    var setCurrentPicPos = function(containerEl, el){
        if (el.offsetHeight == 0 || el.offsetWidth == 0){
            return;
        }
        //trace("img width:"+el.offsetWidth + "  height:"+el.offsetHeight);
        //trace("con width:"+containerEl.offsetWidth + "  height:"+containerEl.offsetHeight);
        // 设置图片居中
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

        trace("left: "+left+" top:"+top);

        var oPicEl = $E(layerNodesId["orignalPic"]);
        oPicEl.style.top = (top + 10) + "px";
        oPicEl.style.left = (left + 10) + "px";
    };

    var showOrignalLink = function(){
        var oPicEl = $E(layerNodesId["orignalPic"]);
        oPicEl.style.visibility = "inherit";
    }

    var hideOrignalLink = function(){
        var oPicEl = $E(layerNodesId["orignalPic"]);
        oPicEl.style.visibility = "hidden";
    }

    var sendStaticCode = function(src){
        var gImg = "___$image"+ new Date().getTime();
        var img = window[gImg] = new Image();
        blogId = $E(layerNodesId["multiPicLike"]).getAttribute("blog-id");
        img.src = "http://control.blog.sina.com.cn/riaapi/article/filmslide.php?"
                +gImg+"&blogId="+blogId
                    +"&img="+src;
        img.onload = img.onerror = function(){
            img = null;
            window[gImg] = null;
        }
    };

    var tipsShow = false;
    var showError = function(msg, okCb, closeCb){
        
        if (tipsShow) {
            return;
        }
        tipsShow = true;
        winDialog.alert(msg, {
            icon: "01",
            textOk:"知道了",
            funcOk: function(){
                errorCount = 0;
                tipsShow = false;
                goToNextPic();
                okCb && okCb();
            },
            funcClose: function(){
                errorCount = 0;
                tipsShow = false;
                goToNextPic();
                closeCb && closeCb();
            }
        }, "slide-box-tips");
    };

    // 如果所有图片都不符合展示规范则，提示
    var showTooSmall = function(msg){
        if (isHidden) {
            return;
        };
        smallCount = 0;
        showError(msg || "图片太小啦，无法展示！");
    };

    var setOrignalPicUrl = function(src){
        var urlReg = /(?:(?:ww\d+|s\d+).sinaimg.cn|photo\.sina\.com\.cn)\/large/;
        var groups = src.match(urlReg);
        // if (urlReg.test(src)){
        //     src = src.replace(/\/large\//, "\/orignal\/");
        // }
        $E(layerNodesId["orignalLink"]).href = src;
    };

    // 记录当前需要显示的图片的url
    var currentSrc = "";

    // 显示单张图片
    // @param {Object} imgUrl 图片链接
    // @param {Number} len    图片的总张数
    // @param {Number} index  图片所在的位置
    // @param {HTMLIMGElement} img 图片元素，用于自身调用
    var showPic = function(imgUrl, len, index, img){
        if (isHidden) {
            return;
        }

        var src = convertUrl(imgUrl.url);
        if (!img) {
            var img = new Image();
            img.src = src;
        }

        currentSrc = src;
        
        // 设置图片计数
        var indexHtml = "<em>"+ (currentPicIndex+1) +"</em>/<span>"
                        + len + "</span>";
        $E(layerNodesId["multiPicIndex"]).innerHTML = indexHtml;
        // 首先去除上一张图片
        removeCurrentPic();

        var winSize   = getWinSize();

        // 将图片放到一个页面看不见的区域，目的是为了获取原始图片的大小
        img.style.top = "-10000px";
        img.style.position = "absolute";

        imgContainer.appendChild(img);

        var isRightSize = img.width > 200 || img.height > 200;
        // 图片返回尺寸后就开始显示图片
        if ((!$IE6 && isRightSize) || (img.complete && isRightSize)){
            
            _setStyle(img, "opacity", 0.5);
            // 隐藏loading图
            hideLoading();
            // 万能的setTimeout这里需要获取图片的宽和高
            setTimeout((function(image){
                var pn = $E(layerNodesId["multiPicContent"]);
                return function(){
                    // 如果不是当前要显示的图片，则退出
                    if (image.src !== currentSrc){
                        imgContainer.removeChild(image);
                        return;
                    }
                    sendStaticCode(image.src);
                    image.setAttribute("action-type", "show-large-layer");
                    image.setAttribute("action-data", encodeURIComponent(image.src));
                    // 将图片加入幻灯片
                    pn.appendChild(image);
                    setTimeout(function(){

                    setCurrentPicSize(getWinSize(), image);
                    
                    // 设置图片居中
                    setCurrentPicPos(pn, image);
                    //开始动画
                    var tween = new Ui.TweenStrategy(.5, 1, 0.5);

                    tween.onTween = function(v){
                        // 如果不是当前要显示的图片，则退出
                        if (img.src !== currentSrc){
                            if (image.parentNode){
                                image.parentNode.removeChild(image);
                            }
                            tween.stop();
                            image = null;
                            return;
                        }
                        _setStyle(image, "opacity", v);
                    }
                    tween.start();
                    setOrignalPicUrl(image.src);
                    });
                }
            })(img));
            
        } else {
            args = arguments;
            showLoading(winSize);
            // TODO 如果图片为gif格式onload会出问题，
            // 为了提升用户体验，改成一个setInterval去获取图片的宽和高
            // 这样获取图片宽高的速度会明显提升
            var count = 0, delay = 15;
            var t = setInterval((function(image, i){
                return function(){
                    // 表明浮层已被隐藏
                    if (!_images){
                        clearInterval(t);
                        return;
                    }
                    // console.log(currentPicIndex);
                    var isRightSize = image.offsetWidth > 200 || image.offsetHeight > 200;
                    
                    // 5秒钟超时
                    var time = count * delay/1000;
                    count ++;
                    var isSmall = image.complete && image.width > 0 && image.height>0 && image.width < 200 && image.height < 200;
                    // 统计小图片数量
                    if (isSmall && !_images[i].recordSmall){
                        smallCount ++;
                        _images[i].recordSmall = 1;
                    }
                    // 显示错误提示，加载失败和图片太小的问题
                    if (_images && _images.length == (smallCount + errorCount)){
                        clearInterval(t);
                        if (errorCount == 0) {
                            showTooSmall();
                        }
                        return;
                    }
                    // 图片太小跳到下一页
                    if (time > 5 || isSmall){
                        clearInterval(t);
                        // 图片超时也算一种出错
                        errorCount ++;
                        if (i === currentPicIndex) {
                            removeCurrentPic();
                            goToNextPic();
                        }
                        return;
                    }
                    // 图片加载完成后调用自身
                    if (image.complete && isRightSize){
                        clearInterval(t);
                        var params = [];
                        for (var l = 0, len = args.length; l < len; l++) {
                            params.push(args[l]);
                        }
                        params.push(image);
                        args.callee.apply(null, params);
                        return;
                    }
                }
            })(img, index), delay);

            // 图片出错跳到下一张
            img.onerror = (function(i){

                return function(e){
                    if (!_images[i].recordError){
                        errorCount ++;
                        _images[i].recordError = 1;
                    }
                    
                    if ((errorCount + smallCount)>= len){
              clearInterval(t);
                        showError("抱歉，图片读取失败。");
                        return;
                    }
                    img.onerror = null;
                    removeCurrentPic();
                    goToNextPic();
                }
            })(index);
        }
    };

    // 根据用户的点击状态跳转到下一张显示
    var goToNextPic = function(){
        
        if ("pre" === $E(layerNodesId["multiPicEntity"]).getAttribute("direction")){
            prePic();
        } else {
            nextPic();
        }

    };

    // 将小尺寸图片转换为大图
    var convertUrl = function(url){
        var urlReg = /(?:(?:ww\d+|s\d+).sinaimg.cn|photo\.sina\.com\.cn)\/(mw690|mw600|middle|bmiddle)/;
        var groups = url.match(urlReg);
        if (groups){
            switch(groups[1]){
                case "bmiddle" :
                    return url.replace(/\/bmiddle\//, "\/large\/");
                case "mw690" : //middle
                    return url.replace(/\/mw690\//, "\/large\/");
                case "middle" : 
                    return url.replace(/\/middle\//, "\/large\/");
                case "mw600" :
                    return url.replace(/\/mw600\//, "\/large\/");
                default : 
                    return url;
            }
        } else {
            return url;
        }
        
    };
    
    // 预加载后几张图片
    var loadingNextPic = function(imgUrls, sum){
        var imgUrl = null,
            count  = Math.abs(sum),
            len    = imgUrls.length;

        for (var i = 1; i < count; i++){
            var index = (sum > 0) ? (currentPicIndex + i) : (currentPicIndex - i);

            imgUrl = imgUrls[index];
            if (imgUrl && imgUrl.loaded === 0){
                
                (function(src, pos){
                    setTimeout(function(){
                        var img = new Image();
                        img.onload = img.onerror = function(){
                            img = null;
                        };
                        img.src = src;
                        //console.log("index:"+index);
                        _images[pos].loaded = 1;
                    }, 40);
                })(convertUrl(imgUrl.url), index);
            }
        }
        
    };
    // 判断图片是否为表情
    var isFacePic = function (src){
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
    };
    // 初始化幻灯片的数据
    var initShow = function(pics, blogId){
        var i,
            len = pics.length,
            winSize = getWinSize();

        _images = pics;
 
        if (0 < len){
            showLoading(winSize);
            showBorder();
            var hasPos = false;
            for (i = 0; i < len; i++){
                if (_images[i].click){
                    
                    currentPicIndex = i;
                    showPic(_images[i], len, i);
                    hasPos = true;
                    break;
                }
            }
            if (!hasPos){
                currentPicIndex = 0
                showPic(_images[0], len, 0);
            }
            
            loadingNextPic(_images, 3);
            loadingNextPic(_images, -3);
        } else {
            hideLayer();
        }
    };

    // 隐藏幻灯浮层
    var hideLayer = function(evt){

        if (evt){
            var targetEl = Core.Events.getEventTarget(evt);
            if ("IMG" === targetEl.nodeName.toUpperCase()){
                return;
            }
        }
        if (tjCover) {
            tjCover.hide();
        }
        if (imgContainer){
            imgContainer.innerHTML = "";
            document.body.removeChild(imgContainer);
            imgContainer = null;
        }

        isHidden = true;
        var winSize = getWinSize();

        showScroller();
        
        var entityId = layerNodesId["multiPicEntity"];
        var entityEl = $E(entityId);
        entityEl.style.display = "none";
        mask.hidden();
        _images = [];
        currentPicIndex = 0;
        errorCount = 0;
        smallCount = 0;
        nextSildeData = null;

        __this.data = null;

        if (loginUi && loginUi.dialog) {
            loginUi.dialog.hidden();
        }
    };
    
    var isTJShow = false;

    var setHidden = function(id){
        $E(id).style.visibility = "hidden";
    };

    var setVisible = function(id){
        $E(id).style.visibility = "inherit";
    };

    var hideBorder = function(direction){

        setHidden(layerNodesId["multiPicLike"]);
        setHidden(layerNodesId["multiPicTitle"]);
        setHidden(layerNodesId["multiPicIndex"]);

        if ("next" === direction) {
            setHidden(layerNodesId["multiPicNext"]);
        } else {
            setHidden(layerNodesId["multiPicPre"]);
        }
    };

    var showBorder = function(){

        setVisible(layerNodesId["multiPicLike"]);
        setVisible(layerNodesId["multiPicTitle"]);
        setVisible(layerNodesId["multiPicIndex"]);
        setVisible(layerNodesId["multiPicNext"]);
        setVisible(layerNodesId["multiPicPre"]);
    };

    var hideTJCover = function(){
        if (tjCover) {
            tjCover.hide();
        }
        
    };

    var showTJCover = function(direction){
        isTJShow = true;
        var currentImg = getCurrentPic();
        if (currentImg) {
            currentImg.style.visibility = "hidden";
            currentImg = null;
        }
        

        hideBorder(direction);
        hideOrignalLink();

        if (!tjCover) {
            tjCover = new Article.SlideTJCover({
                renderTo : $E(layerNodesId["multiPicContent"]),
                review : function(){
                    showBorder();
                    currentPicIndex = -1;
                    nextPic();
                    tjCover.hide();
                }
            });
        }
        var blogId = $E(layerNodesId["multiPicEntity"]).getAttribute("blog-id");
        var blogLink = $E(layerNodesId["multiPicTitle"]);
        var time = decodeURIComponent(blogLink.getAttribute("publish-time") || "");
        __this.getNextSlideData(blogId, time, function(data){
            tjCover.show(data);
        }, "");
        
    };

    // 显示前一张图片
    var prePic = function(evt){
        if (evt){
            Core.Events.stopEvent(evt);
        }
        Lib.sendSuda(function () {
            try{
                //2013.4.12 suda代码修改
                //S_pSt()函数不再使用, 如果需要统计动态加载等调用SUDA.log()
                SUDA.log("","blog_slide_page"); 
            }catch(e){
            }
        });

        Lib.diYuanXinLog(function () {
            try{
              vjEventTrack("");
            }catch(e){
            }        
        }); 

        var len = _images.length;

        if (currentPicIndex <= 0){
            showTJCover("pre");
            currentPicIndex = -1;
            return;
        } else {
            currentPicIndex --;
        }
        isTJShow && hideTJCover();
        isTJShow && showBorder();
        isTJShow = false;
        var img = _images[currentPicIndex];
        showPic(img, len, currentPicIndex);
        $E(layerNodesId["multiPicEntity"]).setAttribute("direction", "pre");
        loadingNextPic(_images, -3);
    };

    // 显示上一张照片
    var nextPic = function(evt){  
        Lib.sendSuda(function () {
            try{
                //2013.4.12 suda代码修改
                //S_pSt()函数不再使用, 如果需要统计动态加载等调用SUDA.log()
                SUDA.log("","blog_slide_page"); 
            }catch(e){
            }
        });
        Lib.diYuanXinLog(function () {
            try{
               vjEventTrack(""); 
            }catch(e){
            }        
        }); 

        if (evt){
            Core.Events.stopEvent(evt);
        }
        
        var len = _images.length;
        
        if (currentPicIndex >= len-1){
            showTJCover("next");
            currentPicIndex = len;
            return;
        } else {
            currentPicIndex ++;
        }
        
        isTJShow && hideTJCover();
        isTJShow && showBorder();
        isTJShow = false;
        var img = _images[currentPicIndex];
        showPic(img, len, currentPicIndex);
        $E(layerNodesId["multiPicEntity"]).setAttribute("direction", "next");
        loadingNextPic(_images, 3);
    };

    // 喜欢此文章
    var like = function(evt){

        Core.Events.stopEvent(evt);
        var likeBtn = $E(layerNodesId["multiPicLike"]),
            blogId  = likeBtn.getAttribute("blog-id"),
            url     = "http://control.blog.sina.com.cn/admin/digg/post_digg.php";
        var isBlocked = likeBtn.getAttribute("block");
        if (isBlocked === "1"){
            return;
        }
        var titleEl = $E(layerNodesId["multiPicTitle"]);

        var title   = titleEl.innerText || titleEl.textContent;

        likeBtn.setAttribute("block", "1");
        Utils.Io.JsLoad.request(url, {
            onComplete: function(result){
                likeBtn.setAttribute("block", "0");
                var code = result.code;
                if (code === "A00006" || code === "B00801"){
                    likeBtn.className = "ico_unlike ico_liked";
                    likeBtn.innerHTML = "已喜欢";
                    if (scope.digger) {
                        scope.digger.setData(blogId,scope.$uid,1);
                    }
                    var diggerEl = $E("dbox_"+blogId)
                    diggerEl.onmouseover = function(){}
                    diggerEl.onmouseout = function(){}
                    diggerEl.onclick = function(){}
                    var ele = $E('dbox2_'+blogId);
                    diggerEl.style.cursor = 'default';
                    var states = diggerEl.getElementsByTagName('p')[1];
                    if(states){
                        diggerEl.className = 'upBox upBox_dis';
                        var cons = states.innerHTML;
                        var div = SinaEx.createNode("<div>"+cons+"</div>");
                        var firstP = SinaEx.findNode(div,"nextSibling","firstChild");
                        if(firstP) div.removeChild(firstP);
                        var con = div.innerHTML;
                        
                        if(con === '顶'){
                            states.innerHTML = '<img width="15" height="15" align="absmiddle" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon34">已顶';
                        }else{
                            states.innerHTML = '已喜欢';
                        }
                        var curr = parseInt(ele.getAttribute('mnum'))+1;
                        ele.innerHTML = curr;
                    }else{
                        var curr = parseInt(ele.getAttribute('mnum'))+1;
                        diggerEl.getElementsByTagName('span')[0].innerHTML = curr;
                    }
                    
                } else if ("A00800" === code) {
                    showError("对不起，您短时间点击喜欢过多，请多休息，注意身体！感谢您对新浪博客的支持和关注！",function(){
                    }, function(){
                    });
                } else {
                    showError(result.message||"发生错误，请稍候再试",function(){
                    }, function(){
                    });
                }
            },
            GET:{
                res_id   : blogId, //flmxw
                res_uid  : scope.$uid,
                action   : "0",
                res_type : "1",
                ti_title : encodeURIComponent(title)
            },
            onException: function(){
                aObj.setAttribute("block", "false");
                showError(result.message||"发生错误，请稍候再试",
                    function(){
                    }, function(){
                    });
            }
        });
    };

    var fixSildeBox = function(){
        updateWinPosAndSize($E(layerNodesId["multiPicEntity"]));
        setTimeout(function(){
            var winSize = getWinSize(),
                el = null;

            if (!isTJShow) {
                el = getCurrentPic();
                el && setCurrentPicSize(winSize, el);
                // 设置图片居中
                el && setCurrentPicPos($E(layerNodesId["multiPicContent"]), el);
            } else {
                if (tjCover && !tjCover.isHidden) {
                    tjCover.fixPos();
                }
            }
        }, 25);
    };
    // 窗口重置的时候
    var onRisize = function(evt){

        if (isHidden){
            return;
        }

        var winSize = getWinSize(),
            body    = document.body,
            args    = arguments,
            _this   = this;

        setTimeout(function(){
            
            var currentSize = getWinSize();

            if (currentSize.height === winSize.height 
                && currentSize.width === winSize.width){
                fixSildeBox();
            }
            
        }, 80);

    };
    var BaseZ = 99999;
    var zIndex = BaseZ + parseInt(Ui.LayerCount() || 0,10);
    // 多图片幻灯片浮层模板
    var _tplStr = '<div id="#{multiPicEntity}" class="dialogMultiShow" \
                style="display:none;z-index:'+(zIndex+1)+';">\
              <a id="#{multiPicClose}" href="javascript:void(0);" title="关闭" class="close" style="z-index:'+(zIndex+2)+'" hidefocus="true">关闭</a>\
              <a id="#{multiPicPre}" href="javascript:void(0);" class="btn_preview" style="z-index:'+(zIndex+2)+'" hidefocus="true"></a>\
              <a id="#{multiPicNext}" href="javascript:void(0);" class="btn_next" style="z-index:'+(zIndex+2)+'" hidefocus="true"></a>\
              <a id="#{multiPicLike}" href="javascript:void(0);" class="ico_unlike" style="z-index:'+(zIndex+2)+'" hidefocus="true">喜欢</a>\
              <div class="bd">\
                <div id="#{multiPicIndex}" class="count"><em>5</em>/<span>20</span></div>\
                <div id="#{multiPicContent}" class="pic" style="position:relative;">\
                    <div class="con" id="#{orignalPic}" style="position:absolute;z-index:1025;">\
                        <a id="#{orignalLink}" target="_blank" href="#" class="opic" title="查看原图"  hidefocus="true">查看原图</a>\
                    </div>\
                    <div id="#{multiPicLoading}" class="loadding" style="top:-10000px;">图片加载中......</div>\
                </div>\
                <div class="title"><a id="#{multiPicTitle}" target="_blank" href="javascript:void(0);"  hidefocus="true">标题</a></div>\
              </div>\
            </div>';

    // 初始化幻灯片浮层，只需要初始化图片和loading图片
    var doc  = document,
        mask = null,

        __this = this,

        tpl  = new Lib.HtmlTemplate(_tplStr),
        layerNodesId = tpl.getNodeIds(),
        layerHtml    = tpl.getHtmlString(),

        errorCount = 0,
        smallCount = 0,

        _images   = [],
        _addEvent = Core.Events.addEvent,
        _setStyle = Core.Dom.setStyle,
        isHidden  = true,
        
        // 当前显示的图片序号，从0开始
        currentPicIndex = 0,

        cssURL = "http://simg.sinajs.cn/blog7style/css/common/multishow.css",
        tjCover = null,
        nextSildeData = null;
    
    Utils.Io.loadExternalCSS(cssURL, function(){});

    Core.Dom.addHTML(document.body, layerHtml);

    _addEvent($E(layerNodesId["multiPicClose"]), hideLayer);

    _addEvent($E(layerNodesId["multiPicPre"]), prePic);

    _addEvent($E(layerNodesId["multiPicNext"]), nextPic);

    _addEvent($E(layerNodesId["multiPicLike"]), like);

    _addEvent(document, function(e){
        if (isHidden) {
            return;
        }
        var direction = $E(layerNodesId["multiPicEntity"]).getAttribute("direction");
        if (37 === e.keyCode && !(isTJShow && direction === "pre")) {
            prePic();
        } else if (39 === e.keyCode && !(isTJShow && direction === "next")) {
            nextPic();
        }
    }, "keydown");

    //_addEvent($E(layerNodesId["multiPicEntity"]), hideLayer);

    _addEvent($E(layerNodesId["multiPicTitle"]), function(e){
        Core.Events.stopBubble(e);
    });

    _addEvent($E(layerNodesId["multiPicContent"]), function(e){
        var datas = Lib.util.getActionData(e, "show-large-layer");
        if (!datas) {
            return;
        }

        showOrignalLink();
    }, "mouseover");
    _addEvent($E(layerNodesId["multiPicContent"]), function(e){
        var datas = Lib.util.getActionData(e, "show-large-layer");
        if (!datas) {
            return;
        }
        var toEl = e.toElement || e.relatedTarget;
        var fromEl = e.srcElement || e.target;
        if (toEl && "A" === toEl.nodeName.toUpperCase() 
            && "IMG" === fromEl.nodeName.toUpperCase()) {
            return;
        }
        hideOrignalLink();
        
    }, "mouseout");
    _addEvent(window, onRisize, "resize");

    var imgContainer = null;

    var loginUi = null;
    Lib.checkAuthor();

    if (!$isLogin) {
        loginUi = new Lib.Login.Ui();
    }

    // 对外暴露的方法
    var _that = {
        scrollTop : 0,
        /**
         * 显示幻灯片浮层
         * @param {Array}      pics     所有需要幻灯显示的图片
         * @param {HTMLElemnt | String} link     文章链接
         * @param {String}     title    文章标题
         * @param {boolean}    isLiked  该文章是否喜欢
         * @param {String}     blogId   文章ID
         * @param {String}     publishTime   文章发布时间  2012-08-27 09:37:40
         */
        show : function(pics, link, title, isLiked, blogId, publishTime){

            var entityId = layerNodesId["multiPicEntity"];
            var entityEl = $E(entityId);
            if (!entityEl || !pics.length){
                return;
            }
            Lib.checkAuthor();
            isTJShow = false;
            if (!imgContainer) {
                // 预加载图片容器
                imgContainer = document.createElement("DIV");
                imgContainer.id = "_sile-img-box"+(new Date()).getTime();
                imgContainer.style.position = "absolute";
                imgContainer.style.top = "-10000px";
                this.imgContainer = imgContainer;
                document.body.appendChild(imgContainer);
            }
            hideOrignalLink();

            errorCount = 0;
            smallCount = 0;

            title = title || "";

            isHidden = false;
            var winSize = getWinSize();

            hideScroller();

            blogId = blogId || scope.$articleid;

            $E(layerNodesId["multiPicEntity"]).setAttribute("blog-id", blogId);

            setTimeout(function(){
                if (!mask) {
                    mask = new Lib.OnlyShadow( .9, doc.body, 'mask_mutiplepic', {zIndex:zIndex});
                    mask.entity.style.zIndex = zIndex;
                    mask.entity.style.backgroundColor = "black";
                }
                var currentSize = getWinSize();
                mask.entity.style.width = currentSize.width + "px";
                mask.show();
                entityEl.style.display = "";
            
                updateWinPosAndSize(entityEl);
                // 过滤表情
                var tmpPics = [];
                for (var i=0, len=pics.length; i < len; i++) {
                    o = pics[i]
                    if (!isFacePic(o.url)) {
                        tmpPics.push(o);
                    }
                }

                if (0 < tmpPics.length) {
                    initShow(tmpPics, blogId);
                } else {
                    showTooSmall();
                }
                
                if (link){
                    var blogHref = (typeof link !== "string") ? link.href : link;
                    var blogLink = $E(layerNodesId["multiPicTitle"]);
                    blogLink.href = blogHref;
                    blogLink.innerHTML = "";
                    blogLink.setAttribute("publish-time", encodeURIComponent(publishTime));
                    var  text = document.createTextNode(Core.String.trim(title) || "查看原文");
                    blogLink.appendChild(text);

                    var likeBtn = $E(layerNodesId["multiPicLike"]);

                    likeBtn.setAttribute("blog-id", blogId);
                    if (isLiked){
                        likeBtn.className = "ico_unlike ico_liked";
                        likeBtn.innerHTML = "已喜欢";
                    } else {
                        likeBtn.className = "ico_unlike";
                        likeBtn.innerHTML = "喜欢";
                    }
                }
            }, 25);

            var _this = this;
        },
        
        /**
         * 获取推荐页的数据
         *
         */
        getNextSlideData : function(blogId, publishTime, callBack, action){
            var me = this;
            Utils.Io.JsLoad.request("http://control.blog.sina.com.cn/riaapi/article/getArticlePrevNextPic.php?rnd="+Math.random(),{
                GET : {
                    blog_id : blogId,
                    blog_pubdate : publishTime,
                    uid    : $UID || "",
                    action : action || ""
                },
                onComplete : function(data) {
                    //console.log(resultText);
                    if ("A00006" === data.code){
                        me.data = data.data;
                    } else {
                        me.data = {pre:{}, next:{}};
                    }

                    callBack && callBack(me.data);
                },
                onException: function() {
                }
            });
        },
        setDirection : function(direction){
            $E(layerNodesId["multiPicEntity"])
                .setAttribute("direction", direction);
        },
        showNextSlide : function(blogId){

            var data = this.data;
            
            if (data){
                this.recordPV(blogId);
                var blogInfo;
                for (var p in data) {
                    blogInfo = data[p]
                    if (blogInfo && (blogId === blogInfo.blogId) ) {
                        break;
                    }
                }
                if (blogInfo) {
                    var link = "http://blog.sina.com.cn/s/blog_"+blogInfo.blogId+".html",
                        url, 
                        pics = [],
                        images = blogInfo.images;

                    for (var i = images.length - 1; i >= 0; i--) {
                        url = blogInfo.images[i]
                        pics.unshift({ 
                            url    : url,
                            loaded : 0,
                            click  : 0
                        });
                    };
                    this.show(pics, link, blogInfo.title, blogInfo.isLiked, blogInfo.blogId, blogInfo.publishTime);
                    if (tjCover) {
                        tjCover.hide();
                    }
                }
            }
        },

        recordPV : function(blogId){
            if (blogId !== scope.$articleid){
                var img = new Image();
                var rnd = parseInt(Math.random()*1000);
                // var imgSrc = "http://hits.blog.sina.com.cn/hits?act=4&aid="
                //        + blogId +"&ref="+ encodeURIComponent(location.href)
                //            + "&rnd=" + rnd;
                var imgSrc = "http://comet.blog.sina.com.cn/api?maintype=hits&act=4&aid="
                        + blogId +"&ref="+ encodeURIComponent(location.href)
                            + "&rnd=" + rnd;
                img.src = imgSrc;
                window["log_pv" + rnd] = img;
                img.onload = img.onerror = function(){
                    window["log_pv" + rnd] = null;
                    img = null;
                }
            }
        },
        /**
         * 隐藏幻灯片浮层
         *
         */
        hide : function(){
            hideLayer();
            
        },
        

        /**
         * 销毁幻灯片浮层
         *
         */
        destroy : function(){

            hideLayer();

            showScroller();

            document.body.removeChild($E(layerNodesId["multiPicEntity"]));

            layerHtml = null;
            _images    = null;

            layerNodesId = null;
            if (tjCover) {
                tjCover.destroy();
                tjCover = null;
            }
            
        }
    };

    Lib.apply(this, _that);
};
