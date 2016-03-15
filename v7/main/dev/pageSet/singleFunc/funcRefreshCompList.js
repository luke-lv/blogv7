/**
 * @fileoverview 刷新页面上的组件列表scope.component_lists
 * @author xinyu@staff.sina.com.cn
 *
 */
(function () {
    window.funcRefreshCompList = function () {
        trace("执行组件信息刷新");
        scope.component_lists = {};

        for (var i = 1; i < 4; i++) {
            var o = {};
            o.size = $E('column_' + i).offsetWidth;
            if (o.size == 0)
                continue;
            o.list = [];
            var child = Core.Dom.getChildrenByClass($E("column_" + i), "SG_conn");
            if (child.length == 0)
                continue;
            for (var j = 0; j < child.length; j++) {//新组件列表写入页面的scope.component_lists变量
                if (child[j].id.replace('module_', '').match(/\d+/gi) != null) {
                    o.list.push(child[j].id.replace('module_', ''));
                }
            }
            scope.component_lists[i] = o;
        }
    };

})();
