/** 
 * @fileoverview 简单地将单条数据渲染到模板的函数
 * @author Book | liming9@staff.sina.com.cn
 * @create 2012-07-24
 * @forcopy $import("sina/utils/tpl.js");
 */
$import("sina/utils/utils.js");

/**
 * 简单地将单条数据渲染到模板的函数
 * @method
 * @param {String} tpl 待渲染的模板
 * @param {Array | Object} data 渲染到模板里的数据
 * @type String
 * @example
        var html = Utils.tpl('<a target="_blank" href="http://blog.sina.com.cn/u/{0}">{1}</a>', [18277423, '苍老师的博客']);
        //返回 '<a target="_blank" href="http://blog.sina.com.cn/u/18277423">苍老师的博客</a>'

        var html = Utils.tpl('<a target="_blank" href="http://blog.sina.com.cn/u/{uid}">{blogname}</a>', {
            uid: 18277423,
            blogname: '苍老师的博客'
        });
        //返回 '<a target="_blank" href="http://blog.sina.com.cn/u/18277423">苍老师的博客</a>'
 */
Utils.tpl = function(tpl, data){
    return tpl.replace(/{(\w+)}/g, function(all, match){
        return data[match];
    });
};
