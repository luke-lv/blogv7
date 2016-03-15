$import("sina/sina.js");

$import("lib/tray/trayPanel.js");
$import("lib/component/platformTray/platformTrayPlus.js");
$import("lib/checkAuthor.js");
$import("lib/openBlog.js");
$import("lib/listener.js");
$import("sina/utils/cookie/getCookie.js");
// $import("sina/core/system/keyValue.js");
$import("lib/login/info.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/dom/getXY.js");
/**
 * @fileoverview 顶部托盘
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-24
 * @modified Qiangyee | wangqiang1@staff 新托盘上线 2013-04-25
 * @modified fuqiang3 | 新版编辑器顶导样式修复 2014-08-28
 */
$registJob("tray_new", function() {
  // 注册托盘数据加载成功通知
  Lib.Listener.add("tray-data-loaded");
  Lib.checkAuthor();

  var _addEvt = Core.Events.addEvent;
  var JSON = Lib.util.JSON;

  var tray;
  var $logo = $E("login_bar_logo_link_350");
  var isNewTray = 'ntopbar_main' === $logo.parentNode.className;
  var attr = function(el, attr, v) {
    if (typeof v !== "string") {
      return el.getAttribute(attr);
    } else {
      return el.setAttribute(attr, v);
    }
  };

  function moveChilds(childs,target){
     for(var i=0;i<childs.length;i++){
        clone = childs[i].cloneNode(true);
        target.appendChild(clone); 
     }
  }

  function getMaxWidth(lis){
      var maxW = 0;
      for(var i=0;i<lis.length;i++){
        var li = lis[i]; 
        var clone = document.createElement('span');
        document.body.appendChild(clone);
        clone.style.cssText = 'font-size:14px;padding:0 20px 0;';
        moveChilds(li.childNodes,clone);
        maxW = Math.max(clone.offsetWidth,maxW) + 5 + 10; //2个 padding 内部
        document.body.removeChild(clone);
      }
      return maxW;
  }

  Lib.tray.msgSummaryPanel.prototype._updateCont = function(fun) {
    var _list = [];
    var _this = this;
    // if(this.isHidden && this._lock == 0){
    //     return;
    // }
    this._lock = 0;
    if(this._requirestate){
        this._getDate(
            {},
            function(_data){
                _list.push(_this._getComment(_data));
                _list.push(_this._getMessage(_data));
                _list.push(_this._getGbook(_data));
                _list.push(_this._getNotice(_data));
                //_this._setThePos();
                $E("j-summary-list").innerHTML = _list.join("");
                _this._srcPot.setAttribute("old-msg-count",_this._srcPot.getAttribute("msg-count"));
                //1024下定位不准问题
               //if($IE6  || $IE7 || $IE8){
                    //写一个获取子元素真实宽度的方法
                    var lis = $E('j-summary-list').getElementsByTagName('li');
                    var maxW = getMaxWidth(lis);
                    //$E("j-summary-list").style.width = "296px";
                    $E("j-summary-list").style.width = maxW +'px';
                //}
                _this._showAction();
                //_this._setThePos();
            },
            function(_data){
                
            }
        );
        this._requirestate = 0;//置为不请求新接口
    }
  };
  //ie6不跟屏幕滚动
  Lib.tray.TrayPanel.prototype._ie6fix = function(){};
  Lib.tray.msgSummaryPanel.prototype._setThePos = function() {
    if ($IE6 || $IE7 || $IE8) {
      this.entity.style.width = "auto";
    }
    var pop = Core.Dom.getXY(this._srcPot);
    var sv = this._srcPot.className == "link" ? - 2: 0; //class不一样位置有偏差
    var width = ($IE7 || $IE6 || $IE8) ? this.entity.offsetWidth: this.entity.clientWidth;
    var x = pop[0] + this._srcPot.clientWidth - width + sv;
    // if (this._srcPot.getAttribute("adshow") == 1 && this._scrolling === 0) {
        var y = pop[1] + this._srcPot.clientHeight;
    // }else{
    //     var y = this._srcPot.clientHeight + 14;
    // }
    if ($IE6 || $IE7 || $IE8) { //ie变态bug 宽度设置两次才生效
      this.entity.style.width = this.entity.clientWidth + 1 + "px";
      this.entity.style.width = this.entity.clientWidth - 1 + "px";
      y = y - 2;
    }
    if($IE6) y = y - 1; 
    this.setPosition(x, y);
  };
  Lib.tray.unReadMsgPanel.prototype._setThePos = function() {
    var pop = Core.Dom.getXY(this._srcPot);
    var sv = this._srcPot.className == "link" ? - 2: 0; //class不一样位置有偏差
    var width = ($IE7 || $IE6) ? this.entity.offsetWidth: this.entity.clientWidth;
    /*
    if (pop[0]) {
      var x = pop[0] + this._srcPot.clientWidth - width + sv;
      // if (this._srcPot.getAttribute("adshow") == 1 && this._scrolling === 0) {
          var y = pop[1] + this._srcPot.clientHeight + 6;
      // }else{
      //     var y = this._srcPot.clientHeight + 20;
      // }
      this.setPosition(x, y);
    }
    */
     if(pop[0]){
         var x = pop[0] + this._srcPot.clientWidth - width + sv;
         var _y = 0;
         if(this._srcPot.getAttribute("adshow") == 1 && this._scrolling === 0){
             _y = pop[1];
         }
         var y = this._srcPot.clientHeight + _y + 26;
         this.setPosition(x,y);
     }
  };
  //重写浮层定位
  Lib.tray.SearchFormPanel.prototype.showCateSearch = function($withEl, offset, v) {
    var catePanel = this.catePanel;
    if (v && catePanel.isHidden) {
      catePanel.showWithDom($withEl, - offset, 2);
    } else if (!v) {
      this.hideCateSearch();
    }
    catePanel.updateSearch(v);
  };

  Lib.tray.TrayPanel.prototype.showNewMsgTips = function(data, sign) {
    var sum = data.sum - data.feed;
    var $tips = this.getNode('newTips');
    var $trayMsg = this.getNode('trayMsg');
    var offsetLeft,offsetTop;
    if (sum) {
      // 显示消息飘红
      if ($trayMsg.getAttribute("unread-show-state") == '0' && $trayMsg.getAttribute("msg-panel-show-state") == '0') { //未读消息层&下拉浮层显示时不显示消息数
        $tips.style.display = 'block';
      }
      if (scope.$pageid == "editor") { //发博文页只显示飘红
        $tips.style.display = 'block';
      }
      var msgNode = this.getNode('trayMsg');
      offsetLeft = Core.Dom.getXY(msgNode)[0];
      offsetTop = Core.Dom.getXY(msgNode)[1];
      $tips.style.left = (offsetLeft + msgNode.offsetWidth - $tips.offsetWidth + 5) + 'px';
      $tips.style.top = (offsetTop - 5) + 'px';
      if (sum < 10) {
        $tips.innerHTML = sum;
      } else {
        $tips.innerHTML = '•••';
      }
      if (!this.newTipsLog) {
        v7sendLog('40_01_49_' + $UID);
        this.newTipsLog = 1;
      }

      // 设置新消息数据
      $trayMsg.setAttribute('msg-count', JSON.stringify(data));

      // 播放声音
      // this.msgLoader.play();
      // title显示消息数
      this.startTitleTips(sum);
    } else {
      // 设置新消息数据
      $trayMsg.setAttribute('msg-count', JSON.stringify(data));
      this.stopTitleTips();
    }

    // 显示个人中心飘红
    var feed = data.feed;
    if (feed) {
      var $feed = this.getNode('newFeed');
      $feed.style.display = 'block';
      var centerNode = Core.Dom.getElementsByClass(this.entity,'span','link')[1];
      offsetLeft = Core.Dom.getXY(centerNode)[0];
      offsetTop = Core.Dom.getXY(centerNode)[1];
      $feed.style.left = (offsetLeft + centerNode.offsetWidth - $feed.offsetWidth - 5) + 'px';
      $feed.style.top = (offsetTop - 5) + 'px'; 
      feed = (feed < 10) ? feed: '•••';
      $feed.innerHTML = feed;

      if (!$feed.addEvt) {
        $feed.addEvt = 1;
        _addEvt($feed, function() {
          location.href = 'http://i.blog.sina.com.cn/blogprofile/index.php?com=1';
          $feed.style.display = 'none';
          $feed.innerHTML = '';
        });
      }
    }
  };
  var logoId = 'login_bar_logo_link_350';

  Lib.tray.TrayPanel.prototype.initBlogMenu = function(info) {
    var $bindEl = this.getNode('addArticle');
    var isInit = attr($bindEl, 'init');
    if (!isInit) {
      attr($bindEl, 'init', '1');
      var $this = this;
      var $tabEl = $this.getNode('blogMenu');
      var flag = 0;
      Lib.util.hoverJq({
        elm: $tabEl,
        mouseenter: function(e, el, i) {
          var offsetLeft = $tabEl.offsetWidth;
          clearTimeout($this.hoverTimeout);
          if (!flag) {
            flag = 1;
            var blogMenu = $this._findSub('blogMenu');
            var panel;
            if (!blogMenu) {
              panel = new Lib.tray.BlogMenuPanel();
              $this.addSubPanel('blogMenu', panel, $bindEl, $tabEl);
              if (info['tbh_status'] === 1) {
                panel.getNode('tbh_status').style.display = "";
              }
            }
            var $blogMenuPanel = panel.getNode('panel');
            Lib.util.hoverJq({
              elm: $blogMenuPanel,
              mouseenter: function(e, el, i) {
                clearTimeout($this.hoverTimeout);
                $this._showPanel('blogMenu', - offsetLeft, - 1);
              },
              mouseleave: function(e, el, i) {
                $this.hoverTimeout = setTimeout(function() {
                  $this._hideActiveSub();
                },
                $this.hoverTime);
              }
            });
          }
          if($IE6){
          $this._showPanel('blogMenu', - offsetLeft, -2);
          }else{
          $this._showPanel('blogMenu', - offsetLeft, - 1);
          }
        },
        mouseleave: function(e, el, i) {
          $this.hoverTimeout = setTimeout(function() {
            $this._hideActiveSub();
          },
          $this.hoverTime);
        }
      });
    }

  };
  Lib.tray.TrayPanel.prototype.initUserMenu = function() {
    var $bindEl = this.getNode('userMenu');
    var isInit = attr($bindEl, 'init');
    if (!isInit) {
      attr($bindEl, 'init', '1');
      var $this = this;
      var hasEmail;
      var $tabEl = $this.getNode('userMenu');
      var userMenu = $this._findSub('userMenu');
      var flag = 0;

      Lib.util.hoverJq({
        elm: $bindEl,
        mouseenter: function(e, el, i) {
          clearTimeout($this.hoverTimeout);
          if (!flag) {
            flag = 1;
            var panel;
            if (!userMenu) {
              panel = new Lib.tray.UserMenuPanel();
              $this.addSubPanel('userMenu', panel, $bindEl, $tabEl);
            } else {
              panel = userMenu.panel;
            }
            var $userPanelNode = panel.getNode('panel');
            panel.initUserInfo($UID);

            Lib.util.hoverJq({
              elm: $userPanelNode,
              mouseenter: function(e, el, i) {
                clearTimeout($this.hoverTimeout);
                  $this._showPanel('userMenu', - 183, -1);
              },
              mouseleave: function(e, el, i) {
                $this.hoverTimeout = setTimeout(function() {
                  $this._hideActiveSub();
                },
                $this.hoverTime);
              }
            });

            getEmail(function(hasEmail) {
              if (hasEmail) {
                panel.getNode('mail').style.display = '';
              }
            });
          }
          if($IE6){
            $this._showPanel('userMenu', - 183, -2);
          }else{
            $this._showPanel('userMenu', - 183, -1);
          }
        },
        mouseleave: function(e, el, i) {
          $this.hoverTimeout = setTimeout(function() {
            $this._hideActiveSub();
          },
          $this.hoverTime);
        }
      });

      var getEmail = function(cb) {
        if (typeof hasEmail === 'boolean') {
          cb(hasEmail);
        } else {
          //初始化邮件提醒(请求邮箱接口，判断email字段是否为空，
          //为空的话，没有开通新浪邮箱)
          Utils.Io.JsLoad.request("http://service.mail.sina.com.cn/mailproxy/mail.php", {
            onComplete: function() {
              var email = sinamailinfo.email;
              if (email !== "") {
                hasEmail = ! 0;
              } else {
                hasEmail = ! 1;
              }
              cb(hasEmail);
            },
            onException: function() {}
          });
        }
      };
    }
  };

  if (isNewTray) {
    tray = Lib.TrayPanel();
  } else {
    tray = new Lib.PlatformTrayPlus();
  }

  var userInfo = Lib.Login.info();
  var uid = userInfo.uid;

  window.$onceLog = false;
  var onceloggedonblog = unescape(Utils.Cookie.getCookie("onceloggedonblog"));
  if (onceloggedonblog && uid) { //只有uid和Cookie同时存在，才考虑促登陆状态
    time = onceloggedonblog;
    var now = new Date().getTime();
    if (time && (now > time)) {
      $onceLog = true;
    }
  }

  if ($isLogin) {
    tray.load("login");
  } else if (!isNewTray && $onceLog) {
    // console.log("促登陆")
    tray.load("oncelogedon");
  } else {
    tray.load("logout");
  }

  //配置全局的托盘呈现修改方法
  window.$tray = {};
  window.$tray.renderLogin = function() {
    Lib.checkAuthor();
    if ($isLogin) {
      tray.load("login");
    }
  };
  window.$tray.renderLogout = function() {
    tray.load("logout");
  };

});

