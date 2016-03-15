/**
 * @fileoverview 点击组件的上下移动按钮的事件
 * @author xinyu@staff.sina.com.cn
 * @date 2009-08-14
 */
$import("sina/core/array/findit.js");
(function () {
    window.funcMoveUpDown = {
        up: function (id) {
            var obj = $E('module_' + id);
            var parent = obj.parentNode;
            var complist = [];
            for (var i = 0; i < parent.childNodes.length; i++) {
                if (parent.childNodes[i].nodeType == 3)
                    continue;
                complist.push(parent.childNodes[i]);
            }
            if (complist[0] == obj)//为第一个元素，不能向上移动
                return;
            //广告共享计划用户不能覆盖第一个用户
            if ((scope.isAdshare == "true" || scope.isCompany == "true") && complist[Core.Array.findit(complist, obj) - 1] == $E('module_901'))
                return;
//			trace(obj.id+";"+obj.previousSibling.id);
            parent.insertBefore(obj, complist[Core.Array.findit(complist, obj) - 1]);
        },
        down: function (id) {
            var obj = $E('module_' + id);
            var parent = obj.parentNode;
            var complist = [];
            for (var i = 0; i < parent.childNodes.length; i++) {
                if (parent.childNodes[i].nodeType == 3)
                    continue;
                complist.push(parent.childNodes[i]);
            }
            if (complist[complist.length - 1] == obj)//为最后一个元素，不能向下移动
                return;
            if ((scope.isAdshare == "true" || scope.isCompany == "true") && obj == $E('module_901'))
                return;
            ;
            parent.insertBefore(complist[Core.Array.findit(complist, obj) + 1], obj);
        }
    };
})();
