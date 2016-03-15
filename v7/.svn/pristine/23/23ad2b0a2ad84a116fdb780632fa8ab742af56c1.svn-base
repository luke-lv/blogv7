/**
 * @fileoverveiw 编辑、新增文本组件或者列表组件
 * @author xinyu@staff.sina.com.cn
 */
$import('pageSet/singleFunc/funcEditPhotoBlogComponent.js');
$import('pageSet/singleFunc/funcEditLinkComponent.js');
$import('pageSet/singleFunc/funcEditTextComponent.js');
(function () {
    window.editCustomComp = function (id, type) {
        if (type == "html") {
            editTextComp.edit(id);
        } else if (type == "link") {
            editLinkComp.edit(id);
        } else if (type == "photoblog") {
            editPhotoBlogComp.edit(id);
        }
    };
})();
