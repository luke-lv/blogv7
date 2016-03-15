/**
 * @fileoverview qing组件
 * @authors yifei2 <yifei2@staff.sina.com.cn>
 */

;(function() {
    /*** DomEx ***/
	if (typeof DomEx === "undefined") {
        DomEx = {};
    }
    DomEx.parent = function (node, nodeName) {
        // 文档节点没有tagName, 因此不能使用tagName
        nodeName = nodeName.toLowerCase();
        while(node){
            if(node.nodeName.toLowerCase() === nodeName){
                return node;
            }
            node = node.parentNode;
        }
        return null;
    };
    DomEx.addClass = function(node, classname) {
        var cn = node.className;
        if( (' '+cn+' ').indexOf(' '+classname+' ')===-1 ){
            node.className = classname+' '+cn;
        }
    };
    DomEx.removeClass = function(node, classname) {
        var cn = (' '+node.className+' ').replace(' '+classname+' ', ' ');
        node.className = cn.replace(/^\s+/, '').replace(/\s+$/, '');
    };
    DomEx.opacity = function(elm, value) {
        elm = typeof elm=="string"?$ID(elm):elm;
        elm.style.filter = 'alpha(opacity=' + value + ')';
        elm.style.opacity = value/100;
    };
    if( document.documentElement.contains ){
        DomEx.contains = function( a, b ) {
            return a.contains ? a.contains(b) : true;
        };
    }else if( document.documentElement.compareDocumentPosition ){
        DomEx.contains = function( a, b ) {
            return a===b || !!(a.compareDocumentPosition(b) & 16);
        };
    }else{
        DomEx.contains = function(a, b) {
            while(b){
                if(a===b){return true}
                b=b.parentNode;
            }
            return false;
        };
    }
    DomEx.enterLeave = function(wrapEle, fnOver, fnOut, delaytime){
        var __addEvent = addEvent(),
            
            _lastover = null, //上次鼠标移入的li
            _overtimer = 0,
            _outtimer = 0;
        
        fnOver = fnOver||function(){};
        fnOut = fnOut||function(){};
        delaytime = delaytime||0;
        
        //鼠标移入
        addEvent(wrapEle, function(event){
            clearTimeout(_outtimer);
            
            var e = event || window.event, ele = e.target||e.srcElement;
            _overtimer = setTimeout(function(){
                if( _lastover && DomEx.contains(_lastover, ele) )return;
                var t = DomEx.parent(ele, "li");
                if( t ){
                    if(_lastover){ //这是必要的
                        fnOut(_lastover);
                    }
                    fnOver(t);
                    _lastover = t;
                }else if(_lastover){
                    fnOut(_lastover);
                    _lastover = null;
                }
            }, delaytime);
        }, "mouseover");
        //鼠标移出
        addEvent(wrapEle, function(){
            clearTimeout(_overtimer);
            
            _outtimer = setTimeout(function(){
                if(_lastover){
                    fnOut(_lastover);
                    _lastover = null;
                }
            }, delaytime);
        }, "mouseout");
    };
    /*** DomEx ***/


    function addEvent(elm, func, evType, useCapture) {
        var _el = typeof elm == 'string' ?$E(elm) : elm;
        if(_el == null) {
            console.log("addEvent 找不到对象：" + elm);
            return;
        }
        if (typeof useCapture == 'undefined') {
            useCapture = false;
        }
        if (typeof evType == 'undefined') {
            evType = 'click';
        }
        if (_el.addEventListener) {
            //添加鼠标滚动事件支持
            if(evType == 'mousewheel' && $FF) {
                evType = 'DOMMouseScroll';
            }
            _el.addEventListener(evType, func, useCapture);
            return true;
        } else if (_el.attachEvent) {
            var r = _el.attachEvent('on' + evType, func);
            return true;
        } else {
            _el['on' + evType] = func;
        }
    }

    var $IE = 0;
    var _ua = navigator.userAgent.toLowerCase();
    if(_ua.match(/msie/)) {
        $IE = true;
    }
    //qing小图ul元素
    var $qingRecPic = $ID('qingRecPic');

    function $ID(id) {
    	var node = typeof id == "string"? document.getElementById(id): id;
		if (node != null) {
			return node;
		}
		return null;
    }
    function $tagName(obj, tagName) {
    	return obj.getElementsByTagName(tagName);
    }

    var el_recwin = $ID("qingRecWindow");
    if(!el_recwin){
        return;
    }

    var fxtimer = 0, looptimer = 0,
        imgs = $tagName($qingRecPic, "img"),
        len = imgs.length,
        showing = 0, //当前正在显示第i个
        popc = $IE ? 5:2,
        opc = 0;
    
    var _opacity = DomEx.opacity;
    initJob();

    DomEx.enterLeave($qingRecPic, function(li){
        var j = li.getAttribute("noo");
        showNoo(j);
    }, function(li){
        //var j = li.getAttribute("noo");
        //j!=showing && SinaEx.removeClass("current");
    }, 100);
    function initJob(){
        for(var i=0, li; i<len; i++){
            li = DomEx.parent(imgs[i], 'li');
            li && li.setAttribute("noo", i);
        }
        setTimeout(function(){
            el_recwin.style.background = '';
            loopShow();
        }, 5000);
    }
    function loopShow(){
        var j = showing+1;
        j>=len && (j=0);
        showNoo(j);
    }
    function showNoo(j){
        j = parseInt(j);
        if(showing===j){return}
        clearTimeout(fxtimer);
        clearTimeout(looptimer);
        DomEx.removeClass(DomEx.parent(imgs[showing],'li'), "current");
        DomEx.addClass(DomEx.parent(imgs[j],'li'), "current");
        _opacity(el_recwin, 0);
        
        var img = imgs[j];
        //北京qing组件uatrack布码
        if($ID('module_911')) {
            el_recwin.innerHTML = '<a suda-uatrack="key=blog_blogpage&value=h_qingmodulebj" href="'+img.parentNode.href
                +'" target="_blank" onclick="v7sendLog(\''+(img.parentNode.getAttribute('bigcode')||'00_00_qzj')+'\');return true;"><img src="'+img.getAttribute('bigsrc')
                +'" /><span>'+(img.getAttribute('alt')||'')+'</span></a>';
        }else {
            el_recwin.innerHTML = '<a href="'+img.parentNode.href
                +'" target="_blank" onclick="v7sendLog(\''+(img.parentNode.getAttribute('bigcode')||'00_00_qzj')+'\');return true;"><img src="'+img.getAttribute('bigsrc')
                +'" /><span>'+(img.getAttribute('alt')||'')+'</span></a>';
        }
        opc = 30;
        qingFadeIn();
        showing = j;
        looptimer = setTimeout(loopShow, 5000);
    }
    function qingFadeIn(){
        _opacity(el_recwin, opc);
        opc += popc;
        if(opc<100){
            fxtimer = setTimeout(qingFadeIn, 15);
        }else{_opacity(el_recwin, 100)}
    }

})();