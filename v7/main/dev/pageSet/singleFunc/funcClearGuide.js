/**
 * @fileoverview 清除用户向导的那个li上的样式，因为只要版式一变，组件增减，都不能算是向导了，所以得清除那个东西
 * @author xinyu@staff.sina.com.cn
 *
 */

(function () {
    window.funcClearGuide = function () {
        if (__pageSetVar.guideInfo && $E(__pageSetVar.guideInfo)) {
            $E(__pageSetVar.guideInfo).className = '';
            __pageSetVar.guideInfo = null;
        }
    };
})();
