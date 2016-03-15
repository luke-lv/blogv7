/**
 * @author fuqiang3@staff.sina.com.cn
 * @20140716
 * @fileoverview winbox基类，所有浮层继承，只依赖jquery,可拖拽
 */
$import('expands/jquery.js');

(function() {

  var $ = Lib.Expands.$;
  var isIE = (/msie/).test(navigator.userAgent.toLowerCase());
  var isIE6 = (isIE && 'undefined' == typeof(document.body.style.maxHeight));

  function _replace(arr, str) {
    $.each(arr, function(key, value) {
      str = str.replace('{{' + key + '}}', value);
    });
    return str;
  }

  var Mask = function(opts) {
    this.config = $.extend({
      maskHtml: '<div style="width:100%;height:100%;position:{{position}};z-index: 998;background:{{maskColor}};{{maskopactiy}};top:0;left:0;" class="__mask"></div>',
      opacity: 0.5,
      maskColor: '#000'
    },
    opts);
    this.dom = null;
    this.initMask();
  };

  Mask.prototype = {
    constructor: Mask,
    destory: function() {
      if (this.dom) {
        this.dom.remove();
        if (isIE6) {
          $(window).unbind('scroll resize', this._bindWindow);
        }
      }
    },
    show: function() {
      if (this.dom) this.dom.show();
    },
    hide: function() {
      if (this.dom) this.dom.hide();
    },
    initMask: function() {
      if (!this.dom) {
        var maskColor = this.config.maskColor;
        var opacity = this.config.opacity;
        var html = _replace({
          maskColor: maskColor,
          position: isIE6 ? 'absolute': 'fixed',
          maskopactiy: isIE ? 'filter:alpha(opacity=' + parseInt(opacity * 100, 10) + ')': 'opacity:' + opacity
        },
        this.config.maskHtml);
        this.dom = $(html);
        if (isIE6) {
          this.dom.append('<iframe style="width:100%;height:100%;" frameBorder="0" allowTransparency="true"></iframe>');
        }
        this.dom.hide();
        this.dom.appendTo('body');
        this.initEvent();
      }
    },
    _bindWindow: function(e) {
      var self = e.data.self;
      self.dom.css({
        'height': document.documentElement.clientHeight,
        'width': document.documentElement.clientWidth
      });
    },
    initEvent: function() {
      var self = this;
      if (isIE6) {
        $(window).bind('scroll resize', {
          self: self
        },
        self._bindWindow);
      }
    }
  };

  var WinBox = function(opts) {
    this.config = $.extend({
      hasMask: true,
      title: 'WinBox',
      width: 500,
      html: 'WinBox',
      autoHide: false,
      maskColor: '#000',
      hasDrag: true
    },
    opts);
    this.dom = null;
    this.mask = null;
    this.tmpHtml = '<div style="background:#fff;width:{{width}}px;" class="L_layer">\
                <div class="titlebox" data-role="drag">\
                  <a class="C_ico C_ico_close " href="#" data-role="closeWinBox">x</a>\
                  <span>{{title}}</span>\
                </div>\
                <div class="contentbox">{{html}}</div>\
              </div>';
    this.styleText = '';
    this.styleInline = null;
    this.initDom();
    this.initStyle();
    if (this.config.hasMask) this.initMask();
  };

  WinBox.prototype = {
    constructor: WinBox,
    destory: function() {
      if (this.mask) this.mask.destory();
      if (this.dom) {
        this.dom.remove();
        $(window).unbind('scroll reszie', this._bindWindow);
        this.dom.off('mousedown', '[data-role=drag]');
        this.dom.off('mouseup', '[data-role=drag]');
      }
      if (this.styleInline) this.styleInline.remove();
    },
    initStyle: function() {
      if (!this.styleInline) {
        this.styleInline = $('<style>' + this.styleText + '</style>').appendTo($('head:eq(0)'));
      }
    },
    initDom: function() {
      var config = this.config;
      if (!this.dom) {
        this.dom = $(_replace({
          width: config.width,
          title: config.title,
          html: config.html
        },
        this.tmpHtml));
        this.dom.hide();
        this.dom.appendTo('body');
        this.initEvent();
      }
    },
    initEvent: function() {
      var self = this;
      if (this.dom) {
        this.dom.on('click', '[data-role="closeWinBox"]', {
          self: this
        },
        this._close);
        $(window).bind('scroll resize', {
          self: this
        },
        this._bindWindow);
        if (this.config.hasDrag) {
          var iDiffX, iDiffY;
          function _mousemove(e) {
            if (iDiffX && iDiffY) {
              var top = e.pageY - iDiffY,
              left = e.pageX - iDiffX,
              boxWidth = self.dom.outerWidth(),
              boxHeight = self.dom.outerHeight();
              //边界判断
              if (top >= $(window).scrollTop() && top <= $(window).scrollTop() + $(window).height() - boxHeight && left >= 0 && left <= $(window).scrollLeft() + $(window).width() - boxWidth) {
                self.dom.offset({
                  left: left,
                  top: top
                });
              }
            }
          }
          this.dom.on('mousedown', '[data-role=drag]', function(e) {
            iDiffX = e.pageX - self.dom.offset().left;
            iDiffY = e.pageY - self.dom.offset().top;
            self.dom.css('cursor','move');
            $(document).on('mousemove', _mousemove);
          });
          $(document).on('mouseup', function(e) {
            iDiffX = 0;
            iDiffY = 0;
            $(document).off('mousemove', _mousemove);
            self.dom.css('cursor','');
          });
        }
      }
    },
    _bindWindow: function(e) {
      var self = e.data.self;
      self.setCenter();
    },
    _close: function(e) {
      var self = e.data.self;
      self.hide();
    },
    initMask: function() {
      if (!this.mask) {
        this.mask = new Mask();
      }
    },
    setCenter: function() {
      if (this.dom) {
        this.dom.css({
          position: isIE6 ? 'absolute': 'fixed',
          zIndex: 999
        });
        if (isIE6) {
          var topVal = $(window).height() / 2 + $(window).scrollTop() - boxHeight / 2;
          this.dom.css({
            top: topVal,
            left: $(window).width() / 2 - boxWidth / 2
          });
        } else {
          var boxWidth = this.dom.outerWidth();
          var boxHeight = this.dom.outerHeight();
          this.dom.css({
            top: '50%',
            left: '50%',
            'marginTop': - (boxHeight / 2),
            'marginLeft': - (boxWidth / 2)
          });
        }
      }
    },
    show: function(offset) {
      this.mask.show();
      if (this.dom) this.dom.show();
      this.setCenter();
    },
    hide: function() {
      this.mask.hide();
      if (this.dom) this.dom.hide();
    }
  };

  $.WinBox = WinBox;

})();
