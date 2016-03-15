/**
 * @fileoverview 收藏的博文
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2009-08-18
 */

$import("sina/sina.js");
$import("sina/core/class/create.js");
$import("sina/core/events/stopEvent.js");

$import("lib/interface.js");

$import("msg/collection.js");

/**
 * 收藏的博文静态类
 */
scope.CollectionBlogs = {

    /**
     * 删除收藏的博文
     * @param {String} uid 被访问者UID
     * @param {String} blogID 收藏博文ID
     */
    removeBlog: function (uid, blogID, blog_id) {
        (new Interface("http://control.blog.sina.com.cn/admin/article/favourites_del.php", "jsload")).request({
            GET: {
                resourceids: blogID,
                blog_id: blog_id || '',
                uid: uid
            },
            onSuccess: function (data) {
                window.location = window.location.toString().replace(/#.*/, "");
            },
            onError: function (data) {
                winDialog.alert($COLLECTION_MSG[data["code"]], {
                        icon: "02",
                        funcDisplayFinished: function () {
                            //用户未登录，直接重新装载页面
                            if (data["code"] == "A00004") {
                                window.location = window.location.toString().replace(/#.*/, "");
                            }
                            Core.Events.stopEvent();
                        }
                    });
            },
            onFail: function () {
            }
        });
        return false;
    }
};
