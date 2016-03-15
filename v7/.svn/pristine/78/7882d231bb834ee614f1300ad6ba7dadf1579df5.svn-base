/**
* @fileoverview 插入积分消费推广图
* @author jiangwei5
*/
$import('sina/core/dom/getElementsByClass.js');
$import('sina/core/dom/insertHTML.js');

$registJob('pointsAdInsert', function(){
/*
<div class="jf_ad">
    <a href="[url]" title="[title]">
        <img src="[imgUrl]" title="[title]" alt="[title]" />
    </a>
    <a href="#" class="tg_close"></a>
</div>
*/
    var template = '\
        <div class="jf_ad">\
            <a href="[url]" title="[title]">\
                <img src="[imgUrl]" title="[title]" alt="[title]" />\
            </a>\
        </div>';
    var url = "http://control.blog.sina.com.cn/admin/article/article_add.php";
    var imgUrl = "http://simg.sinajs.cn/blog7style/images/center/newversion/temp/fbq.jpg";
    var title = "超简洁新版发布器，你用了吗";
    
    var getElementsByClass = Core.Dom.getElementsByClass;
    var sites = {
        "profile_index": {
            el: getElementsByClass($E("module_956"), "div", "feedList")[0],
            where: "afterbegin"
        }
    };
    
    if(scope && scope.$pageid && sites[scope.$pageid]){
        var htmlStr = template.replace(/\[url\]/g, url)
                              .replace(/\[title\]/g, title)
                              .replace(/\[imgUrl\]/g, imgUrl);
        var site = sites[scope.$pageid];
        if(site.el && site.where){
            Core.Dom.insertHTML(site.el, htmlStr, site.where);
        }
    }
});