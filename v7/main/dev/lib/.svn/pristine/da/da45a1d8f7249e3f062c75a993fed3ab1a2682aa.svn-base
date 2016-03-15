/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview  给IE浏览器增加四角等比等比缩放功能,并动态提示图片尺寸
 */
$import("lib/editor/utils/utils.js");
$import("sina/core/class/create.js");
$import("sina/core/dom/setStyle.js");
$import("sina/core/dom/getXY.js");
$import('sina/core/system/getScrollPos.js');

Editor.Utils.ImageDrag = Core.Class.create();
Editor.Utils.ImageDrag.prototype = {
    initialize: function(editor){
    	this.editor=editor;
    },
    drag: function(el){
		if(!$IE){
			return;
		}
        var _target = el.target || el.srcElement;
        var _img2 = null;
        var _span2 = null;
        var _tempPos = [];
        var _imgPos = {};
        var _imgReSzie = "";
        var _mousePos = {};
        var _posAffer = {};
        
        var _scrollTop = Core.System.getScrollPos(this.editor.iframeDocument)[0];
        
       
            if (_target.s == null) {
                _target.s = {};
                _target.s.w = _target.offsetWidth;
                _target.s.h = _target.offsetHeight;
            }
            _target.onresizestart = function(){
				this.editor.imageOperate.hidden();
//                _tempPos = Core.Dom.getXY(_target);
                
                _imgPos.l = this.utils.getLeft(_target);
                _imgPos.t = this.utils.getTop(_target);
                _imgPos.w = _target.offsetWidth;
                _imgPos.h = _target.offsetHeight;
                
                _imgPos.nl = _imgPos.l;
                _imgPos.nt = _imgPos.t;
                _imgPos.nw = _imgPos.w;
                _imgPos.nh = _imgPos.h;
                
                _mousePos.x = el.x;
                _mousePos.y = el.y;
                
                _img2 = $C("img");
                _img2.src = _target.src;
                Core.Dom.setStyle(_img2, "position", "absolute");
                Core.Dom.setStyle(_img2, "border", "dashed black 1px");
                Core.Dom.setStyle(_img2, "opacity", "0.4");
                Core.Dom.setStyle(_img2, "left", _imgPos.l - 1);
                Core.Dom.setStyle(_img2, "top", _imgPos.t - 1);
                Core.Dom.setStyle(_img2, "width", _imgPos.w + "px");
                Core.Dom.setStyle(_img2, "height", _imgPos.h + "px");
                _target.insertAdjacentElement("afterEnd", _img2);
                _span2 = $C("div");
                _span2.innerText = _imgPos.w + " x " + _imgPos.h + " (0, 0)";
                Core.Dom.setStyle(_span2, "position", "absolute");
                Core.Dom.setStyle(_span2, "border", "solid black 1px");
                Core.Dom.setStyle(_span2, "left", el.x);
                Core.Dom.setStyle(_span2, "top", el.y);
                Core.Dom.setStyle(_span2, "width", "130px");
                Core.Dom.setStyle(_span2, "height", "20px");
                Core.Dom.setStyle(_span2, "backgroundColor", "#ffffff");
                Core.Dom.setStyle(_span2, "lineHeight", "20px");
                Core.Dom.setStyle(_span2, "textAlign", "center");
                Core.Dom.setStyle(_span2, "fontSize", "12px");
                
                _img2.insertAdjacentElement("afterEnd", _span2);
                if (el.x > _imgPos.l + _target.offsetWidth - 4) {//右
                    if (el.y + _scrollTop > _imgPos.t + _target.offsetHeight - 4) {// 下
                        _imgReSzie = "rb";
                    }
                    else 
                        if (el.y + _scrollTop < _imgPos.t + 4) {// 上
                            _imgReSzie = "rt";
                        }
                        else {// 中
                            _imgReSzie = "rm";
                        }
                }
                else 
                    if (el.x < _imgPos.l + 4) {// 左
                        if (el.y + _scrollTop > _imgPos.t + _target.offsetHeight - 4) {// 下
                            _imgReSzie = "lb";
                        }
                        else 
                            if (el.y + _scrollTop < _imgPos.t + 4) {// 上
                                _imgReSzie = "lt";
                            }
                            else {// 中
                                _imgReSzie = "lm";
                            }
                    }
                    else {// 中
                        if (el.y + _scrollTop < _imgPos.t + 4) {// 上
                            _imgReSzie = "ct";
                        }
                        else {// 下
                            _imgReSzie = "cb";
                        }
                    }
                //trace(_imgReSzie);
            }.bind2(this);
            _target.onresizeend = function(){
                //trace(_imgPos.nw + "x" + _imgPos.nh);
                _img2.removeNode(true);
                _span2.removeNode(true);
                _target.s.w = _imgPos.nw;
                _target.s.h = _imgPos.nh;
                Core.Dom.setStyle(_target, "width", _imgPos.nw + "px");
                Core.Dom.setStyle(_target, "height", _imgPos.nh + "px");
            	this.editor.history.add();
            }.bind2(this);
            _target.onresize = function(){
                //trace("imgSize: " + _imgPos.nw + "x" + _imgPos.nh);
                if (_imgReSzie == "rb") {// 右下
                    _imgPos.nw = el.x - _imgPos.l;
                    _imgPos.nh = Math.floor(_imgPos.nw * (_target.s.h / _target.s.w));
                }
                else 
                    if (_imgReSzie == "cb") {// 中下
                        _imgPos.nh = el.y - _mousePos.y + _imgPos.h;
                    }
                    else 
                        if (_imgReSzie == "ct") {// 中上
                            _imgPos.nh = _mousePos.y - el.y + _imgPos.h;
                            _imgPos.nt = _imgPos.t + Math.floor((_imgPos.h - _imgPos.nh));
                        }
                        else 
                            if (_imgReSzie == "rm") {// 右中
                                _imgPos.nw = el.x - _mousePos.x + _imgPos.w;
                            }
                            else 
                                if (_imgReSzie == "lm") {// 左中
                                    _imgPos.nw = _mousePos.x - el.x + _imgPos.w;
                                    _imgPos.nl = _imgPos.l + Math.floor((_imgPos.w - _imgPos.nw));
                                }
                                else 
                                    if (_imgReSzie == "rt") {// 右上
                                        _imgPos.nw = el.x - _imgPos.l;
                                        _imgPos.nh = Math.floor(_imgPos.nw * (_target.s.h / _target.s.w));
                                        _imgPos.nt = _imgPos.t + Math.floor((_imgPos.h - _imgPos.nh));
                                    }
                                    else 
                                        if (_imgReSzie == "lt") {// 左上
                                            _imgPos.nw = _mousePos.x - el.x + _imgPos.w;
                                            _imgPos.nh = Math.floor(_imgPos.nw * (_target.s.h / _target.s.w));
                                            _imgPos.nl = _imgPos.l + Math.floor((_imgPos.w - _imgPos.nw));
                                            _imgPos.nt = _imgPos.t + Math.floor((_imgPos.h - _imgPos.nh));
                                        }
                                        else 
                                            if (_imgReSzie == "lb") {// 左下
                                                _imgPos.nw = _mousePos.x - el.x + _imgPos.w;
                                                _imgPos.nh = Math.floor(_imgPos.nw * (_target.s.h / _target.s.w));
                                                _imgPos.nl = _imgPos.l + Math.floor((_imgPos.w - _imgPos.nw));
                                            }
                _imgPos.nw = Math.max(_imgPos.nw, 2);
                _imgPos.nh = Math.max(_imgPos.nh, 2);
	              if(isNaN(_imgPos.nw)|| isNaN(_imgPos.nh)){
				  	return ;
				  }
                Core.Dom.setStyle(_img2, "width", _imgPos.nw + "px");
                Core.Dom.setStyle(_img2, "height", _imgPos.nh + "px");
                Core.Dom.setStyle(_img2, "top", _imgPos.nt - 1 + "px");
                Core.Dom.setStyle(_img2, "left", _imgPos.nl - 1 + "px");
                
                Core.Dom.setStyle(_span2, "top", el.y + "px");
                Core.Dom.setStyle(_span2, "left", el.x + "px");
                
                _posAffer.x = _imgPos.nw - _target.s.w;
                _posAffer.y = _imgPos.nh - _target.s.h;
                
                _span2.innerText = _imgPos.nw + " x " + _imgPos.nh + " (" + (_posAffer.x > 0 ? "+" : "-") + Math.abs(_posAffer.x) + "," + (_posAffer.y > 0 ? "+" : "-") + Math.abs(_posAffer.y) + ")";
            };
    },
	utils:{
		getTop:function(element) {
			var top = 0;
			var el = $E(element);
			if (el.offsetParent) {
				while (el.offsetParent && el.offsetParent.style.position!="relative") {
					top += el.offsetTop;
					el = el.offsetParent;
				}
			}
			else 
				if (el.y) {
					top += el.y;
				}
			return top;
		},
		getLeft:function(element) {
			var left = 0;
			var el = $E(element);
			if (el.offsetParent) {
				while (el.offsetParent && el.offsetParent.style.position!="relative") {
					left += el.offsetLeft;
					el = el.offsetParent;
				}
			}
			else 
				if (el.x) {
					left += el.x;
				}
			return left;
		}
	}
};
