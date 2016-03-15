/**
 * @fileoverview 文章管理类包装的工厂函数
 * @author L.Ming | liming1@staff.sina.com.cn
 * @modified dcw1123 | chengwei1@staff.sina.com.cn
 */
$import("sina/core/events/stopEvent.js");
$import("sina/core/events/getEvent.js");
$import("sina/core/system/br.js");

$import("articleManage/article_delete.js");
$import("articleManage/article_deleteDraft.js");
$import("articleManage/article_clearRecycleBin.js");
$import("articleManage/article_restoreRecycleBin.js");
$import("articleManage/article_addFavorite.js");
$import("articleManage/article_deleteFavorite.js");
$import("articleManage/article_setTop.js");
$import("articleManage/article_replaceTop.js");
$import("articleManage/article_unsetTop.js");
$import("articleManage/article_more.js");
$import("articleManage/article_modifyCate.js");
$import("articleManage/article_deleteClockpub.js");
$import("articleManage/article_sendClockpub.js");

$import("worldcup/articleFunc/article_hide.js");
$import("worldcup/articleFunc/article_restore.js");
$import("lib/openBlog.js");
$import("lib/sendLog.js");

$articleManage = function (sArticleId, nAction, oOption) {
    if ($IE) {
        try {
            Core.Events.stopEvent();
            $E("a_layer_" + scope.moreLayerId[1]).style.display = "none";
            $E("a_layer_" + scope.moreLayerId[0]).style.display = "none";		//因为阻止冒泡了。点击功能按钮，浮层就不消失了。呃…特别加上
        } catch (e) {
        }
    }
    oOption = oOption || {};
    switch (nAction) {
        case 1: // 删除到回收站 OK
            new App.deleteArticle(sArticleId, oOption);
            break;
        case 2: // 草稿箱删除 OK
            new App.deleteDraftArticle(sArticleId, oOption);
            break;
        case 3: // 回收站删除 OK
            new App.clearRecycleBinArticle(sArticleId, oOption);
            break;
        case 4: // 回收站恢复 OK
            new App.restoreRecycleBinArticle(sArticleId, oOption);
            break;
        case 5: // 收藏文章
            var testFunc = function () {
                scope.blogOpener.showDialog(function () {
                    new App.addFavoriteArticle(sArticleId, oOption);
                });
            }
            Lib.checkAuthor();
            if (!$isLogin) {
                v7sendLog('48_01_35');
                new Lib.Login.Ui().login(testFunc);
            } else {
                testFunc();
            }

            break;
        case 6: // 删除收藏
            new App.deleteFavoriteArticle(sArticleId, oOption);
            break;
        case 7: // 文章置顶 OK
            new App.setTopArticle(sArticleId, oOption);
            break;
        case 8: // 替换置顶文章 OK
            new App.replaceTopArticle(sArticleId, oOption);
            break;
        case 9: // 取消文章置顶
            new App.unsetTopArticle(sArticleId, oOption);
            break;

        //added by dcw1123
        case 10:	//弹出更多选项。
            App.moreLayer(sArticleId, Core.Events.getEvent());
            break;
        case 11:	//修改博文分类。
            new App.modifyCategory(sArticleId, oOption);
            break;
        case 12:	//隐藏世界杯博文
            new App.articleHide(sArticleId, oOption);
            break;
        case 13:	//回复世界杯博文
            new App.articleRestore(sArticleId, oOption);
            break;
        case 14:	//删除定时列表博文
            new App.deleteClockpub(sArticleId, oOption);
            break;
        case 15:	//立即发布定时列表博文
            new App.sendClockpub(sArticleId, oOption);
            break;
    }
};