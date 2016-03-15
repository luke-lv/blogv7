$import("sina/ui/template.js");
$import("sina/core/class/oop.js");
$import("lib/lib.js");
/**
 * @fileoverview 扩展Ui.Template，可以获取替换后的HTML字符串和HTML节点的ID数组
 * $import("lib/htmlTemplate.js");
 * 
 * @author wq | wangqiang1@staff.sina.com.cn
 * @created 2011-11-03
 * @param {String} tmpl html模板字符串
 * @param {String} uniqueID 全局唯一节点字符串
 */
Lib.HtmlTemplate = function(tmpl, uniqueID){
    //自动调用父类initialize方法
    this.uniqueID = uniqueID;
}.$extends(Ui.Template).$define({
    /**
     * 获取HTML替换#{XXXX}后的字符串
     * @example
        var htmlTpl = '<div id="#{entity}" class="goTop" ><a id="#{goToTop}" title="返回顶部" onclick="return false" href="javascript:void(0)"></a></div>';
        var tpl = new Lib.HtmlTemplate(htmlTpl);
        var htmlStr = tpl.getHtmlString();
        console.log(htmlStr);
     * @return {String}
     */
    getHtmlString : function(){
        if (!this._htmlStr){
            this._htmlStr = this.evaluate(this.getNodeIds());
        }
        return this._htmlStr;
    },
    /**
     * 获取替换#{XXXX}的字符串数组。<br>
     * 如：<code>
     *    var htmlTpl = '<div id="#{entity}" class="goTop" ><a id="#{goToTop}" title="返回顶部" onclick="return false" href="javascript:void(0)"></a></div>';
     *   var tpl = new Lib.HtmlTemplate(htmlTpl);
     *   var ids = tpl.getNodeIds();
     *   console.log(ids);
     *   </code>
     * 一般存储的是ID
     * @return {Array}
     */
    getNodeIds : function(){
        if(!this._nodes){
            var p=/\{[^\}]+(?=\})/g,
                i,
                nodes={},
                rets,
                r,
                uniqueID = this._getUniqueID();

            this.__templateNodesIDs = this.tmpl.match(p);
            rets = this.__templateNodesIDs;
            if (rets){
                i=rets.length;
                while(i--){
                    r = rets[i].replace("{","");
                    nodes[r] = "_"+ uniqueID + "_" + r;
                }
            }
            this._nodes = nodes;
        }
        return this._nodes;
    },
    /**
     * 获取替换#{XXXX}的字符串。<br>
     * 如：<code>
     *    var htmlTpl = '<div id="#{entity}" class="goTop" ><a id="#{goToTop}" title="返回顶部" onclick="return false" href="javascript:void(0)"></a></div>';
     *   var tpl = new Lib.HtmlTemplate(htmlTpl);
     *   var id = tpl.getNodeId("entity");
     *   console.log(id);
     *   </code>
     * 一般存储的是ID
     * @param  {String} name 节点名称
     * @return {String}
     */
    getNodeId : function(name){
        if(!this._nodes){
            this.getNodeIds();
        }
        return this._nodes[name];
    },
    /**
     * 获取#{XXXX}的节点。<br>
     * 如：<code>
     *    var htmlTpl = '<div id="#{entity}" class="goTop" ><a id="#{goToTop}" title="返回顶部" onclick="return false" href="javascript:void(0)"></a></div>';
     *   var tpl = new Lib.HtmlTemplate(htmlTpl);
     *   var id = tpl.getNode("entity");
     *   console.log(id);
     *   </code>
     * 一般存储的是ID
     * @param  {String} name 节点名称
     * @return {HTMLElement}
     */
    getNode : function(name){
        var id = this.getNodeId(name);
        return !id ? null : $E(id);
    },

    /**
     * 获取唯一ID
     */
    _getUniqueID : function(){
        if (!this.uniqueID) {
            this.uniqueID = parseInt(Math.random()*1000).toString() + (new Date).getTime().toString();
        }
        return this.uniqueID;
    }
});


