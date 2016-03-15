/**
 * @fileoverview
 *    博文列表组件同步管理器
 每个博文列表组件加载的时候，会自动将它的ID及分类注册到这里
 每次博文列表组件刷新的时候，都会看看是否有相同分类的博文列表组件存在，有就刷新他们
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @history
 *
 */
$import("lib/app.js");

App.articleListComponentSynchronize = {
    "cacheData": {}, "regist": function (sCompId, sType, sSize) {
        this.cacheData[sCompId] = {
            type: sType, size: sSize
        };
    }, "synchronize": function (sCompId, sType) {
        for (var key in this.cacheData) {
            if (key != sCompId && sType == this.cacheData[key].type) {
//				alert("刷新组件：" + key);
                Lib.Component.refresh(key, {
                    forceRefresh: true
                });
            }
        }
    }
};
