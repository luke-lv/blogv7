/** 
 * @fileoverview 顶踩功能
 * @author zhihan | zhihan@sina.staff.com.cn
 */
$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/dom/insertAfter.js");
$import("lib/lib.js");

$import("sina/utils/flash/swfObject.js");
$import("sina/core/math/getUniqueId.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/dom/opacity.js");
$import("other/SinaEx.js");

$registJob('articleDigger_new', function() {

  if (!$_GLOBAL.diggerOpenFlag) {
    //不启用
    return;
  }

  var aid = scope.$articleid;
  function newGetNum() {
    var num = 0;
    var timmer = setInterval(function() {
      //trace('探测可以通过别的接口进行:'+num);
      if (scope.useNewInterfaceToGetNum) {
        trace('通过别的借口进行装载');

        scope.useNewInterfaceToGetNum.onSuccess = function(data) {
          scope.useNewInterfaceToGetNum = null;
          diggerCallBack(data);
        }
        scope.useNewInterfaceToGetNum.onError = function(data) {
          scope.useNewInterfaceToGetNum = null;
          diggerCallBack(null);
        }
        scope.useNewInterfaceToGetNum.onFail = function(data) {
          scope.useNewInterfaceToGetNum = null;
          diggerCallBack(null);
        }
        trace('装载完毕');
        clearInterval(timmer);
      }

    },
    50);
  }

  newGetNum();

  function setLikedStatus(_opt) {
    var states;
    $E('dbox2_'+aid).className = 'like_btn like_cur';
    _opt.ele.style.cursor = 'default';
    states = _opt.ele.getElementsByTagName('span')[0];
    
    states.innerHTML = _opt.ele.getElementsByTagName('a')[0].getAttribute('mnum') || 0;
    $E('dbox2_'+aid).innerHTML = '';
  }

  function setHoverLikeStatus(_opt) {
    $E('dbox2_'+aid).innerHTML = '+1';
    $E('dbox2_'+aid).className = 'like_btn like_h';
  }

  function setLikeStatus(_opt) {
    var ele = _opt.ele.getElementsByTagName('a')[0];
    $E('dbox2_'+aid).className = 'like_btn';
    ele.innerHTML = ele.getAttribute('mnum');
  }

  function diggerCallBack(data) {

    var mNum = data ? data['digg_m_' + aid] : 0;
    var countEle = $E('dbox2_' + aid);

    if (!countEle) {
      trace('没有找到计数模块，认为这是不需要顶踩功能的');
      return;
    }
    if (mNum) {
      countEle.innerHTML = mNum;
    } else {
      countEle.innerHTML = '0';
    }
    countEle.className = 'like_btn';
    
    var res_id = aid;
    countEle.setAttribute('mnum', mNum);
    //$E('d1_digg_count_'+res_id).innerHTML = '(' + mNum + ')';
    var parent = countEle.parentNode;
    countEle.cursor = 'pointer';
    var states = parent.getElementsByTagName('span')[0];
    states.innerHTML = '喜欢';
    scope.digger.bindEvent({
      //要改变class的ele
      'ele': parent
      //要绑定事件的ele
      //,'targetEle' : parent.getElementsByTagName('p')[1]
      ,
      'targetEle': countEle,
      'ti_title': encodeURIComponent(countEle.getAttribute('ti_title') || ''),
      'disClass': 'upBox upBox_dis',
      'res_id': res_id,
      'uid': scope.$uid,
      'res_type': '1',
      'whenFind': function(_opt) {
        setLikedStatus(_opt);
      },
      'events': {
        'mouseover': function(_opt) {
          return function() {
            setHoverLikeStatus(_opt);
          }
        },
        'mouseout': function(_opt) {
          return function() {
            setLikeStatus(_opt);
          }
        },
        'click': function(_opt) {
          return function() {
            scope.digger.diggerPost({
              'params': {
                'res_id': _opt.res_id,
                'res_uid': _opt.res_uid || scope.$uid,
                'action': '0',
                'res_type': '1',
                'ti_title': _opt.ti_title
              },
              'res_id': _opt.res_id,
              'res_uid': _opt.res_uid || scope.$uid,
              'action': '0',
              'res_type': '1',
              'onSuccess': function(data) {
                _opt.targetEle.onmouseover = function() {}
                _opt.targetEle.onmouseout = function() {}
                _opt.targetEle.onclick = function() {}
                var ele = $E('dbox2_' + _opt.res_id);
                var curr = parseInt(ele.getAttribute('mnum'),10) + 1;
                ele.innerHTML = curr;
                ele.setAttribute('mNum',curr);
                setLikedStatus(_opt);
              },
              'onError': function(data) {
                if (data.code == 'B00801') {
                  winDialog.alert("这篇博文您已经喜欢过啦!", {
                    icon: "01"
                  });
                  _opt.targetEle.onmouseover = function() {};
                  _opt.targetEle.onmouseout = function() {};
                  _opt.targetEle.onclick = function() {};
                  setLikedStatus(_opt);
                  scope.digger.setData(_opt.res_id, scope.$uid, 1);
                  var ele = $E('dbox2_' + _opt.res_id);
                  var curr = ele.getAttribute('mnum');
                  ele.innerHTML = curr;
                } else {
                  showError(data.code);
                }
              }
            });
            return false;
          }
        }
      }
    });
  }
});

