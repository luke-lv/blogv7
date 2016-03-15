/**
 * @fileoverview 根据页面的组件信息刷新整页组件
 * @author xinyu@staff.sina.com.cn
 */
(function () {
    var func = function (data) {
        for (var i = 0; i < data.length; i++) {
            var o = data[i];
            var width = o.size;
            for (var j = 0; j < o.list.length; j++) {
                var c = o.list[j];
                var div = $E('module_' + c);
                if (!div) {
                    div = $C('div');
                    div.id = "module_" + c;
                    div.className = 'SG_conn';
                    var name = __pageSetVar.originalComponentsData[c].ria_title;
                    div.innerHTML = '<div class="SG_connHead"><span class="title">' + name + '</span><span class="edit"></span></div><div class="SG_connBody"></div><div class="SG_connFoot"></div>';
                }

                $E('column_' + (i + 1)).appendChild(div);
//			   Lib.Component.refresh(c,{width:width});
                dragBase.add(c);
            }
        }
    };

    window.funcRefreshPageComponents = func;

})();
