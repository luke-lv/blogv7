/** 
 * @fileoverview 把一段html字符串创建成一个元素节点
 * @author Book | liming9@staff.sina.com.cn
 * @create 2012-07-24
 * @forcopy $import("sina/core/dom/createElement.js");
 */
$import("sina/core/dom/_dom.js");

/**
 * 把一段html字符串创建成一个元素节点
 * @method
 * @param {String} html html字符串。注意这个字符串是只包含一个节点的字符串。该节点内就可以有多个子节点了。
        如果需要创建一系列节点可先用一个适当标签包裹。
 * @type HTMLElement
 * @example
        var lizi = Core.Dom.createElement('<div id="someId" class="someclass">这是例子<span>哦</span></div>');
        document.body.appendChild(lizi);
 */
Core.Dom.createElement = function(html){
    var node = document.createElement('div');
    node.innerHTML = html;
    return node.firstChild;
};
