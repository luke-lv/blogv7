/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 * @fileoverview 新编辑器插入相关文章
 * @author gaolei2@
 */


$import("sina/core/events/addEvent.js");
$import("sina/core/events/fixEvent.js");
$import("sina/core/events/removeEvent.js");
$import("sina/core/events/stopDefaultEvent.js");

$import("sina/core/dom/setStyle2.js");

$import("sina/core/class/create.js");
$import("sina/core/class/extend.js");

$import("sina/core/function/bind2.js");

$import("lib/dialogConfig.js");

$import("msg/blogEditorMSG.js");
$import("sina/ui/Select.js");
$import("jobs/newEditor/newArticleAssociate.js");

//重写UI组件
   Ui.Pagination.show = function(oNode,nCurPage){
     nCurPage = nCurPage * 1;
     var hash = this._cache_node;
     if(oNode != null) {
       this._cache_node = hash = Ui.Pagination._list[oNode.id];
       hash.curPage = nCurPage;
     }
     var ambit = [];
     if(hash.viewSize * 2 + 1 >= hash.maxPage){
       ambit[1] = hash.minPage;
       ambit[2] = hash.maxPage;
     }
     else if(hash.curPage <= hash.minPage + hash.viewSize){
       ambit[1] = hash.minPage;
       ambit[2] = hash.minPage + (hash.viewSize * 2 - 1);
       ambit[3] = hash.maxPage;
     }
     else if(hash.curPage >= hash.maxPage - hash.viewSize){
       ambit[0] = hash.minPage;
       ambit[1] = hash.maxPage - (hash.viewSize * 2 - 1);
       ambit[2] = hash.maxPage;
     }
     else{
       ambit[0] = hash.minPage;
       ambit[1] = hash.curPage - (hash.viewSize - 1);
       ambit[2] = hash.curPage + (hash.viewSize - 1);
       ambit[3] = hash.maxPage;
     }

     var result = [];
     // 分页起始部分的统计信息
     if(hash.countTpl != null){
       result.push(this._createPage("", "", "", "", hash.countTpl));
     }
     // 上一页按钮
     if(hash.type != 2 && hash.curPage != hash.minPage){
       if(hash.type == 3)
         result.push(this._createPage("prev_next", hash.curPage - 1, 3, hash.curPage - 1, "<"));
       else
       result.push(this._createPage("prev_next", hash.curPage - 1, 3, hash.curPage - 1, "<"));
     }
     
     // 中部的分页信息
     if(hash.type != 3){
       if(ambit[0] != null){
         var str = (ambit[0] == hash.curPage) ? this._createPage(hash.nodeClassNamePrefix+ ' a_hover', 1, 6, hash.curPage, ambit[0])
           : this._createPage(hash.nodeClassNamePrefix, 1, 1, ambit[0], ambit[0]);
         result.push(str);
       }

       if(hash.type == 1 && ambit[0] != null){
         result.push(this._createPage(hash.nodeClassNamePrefix, "", "", "", "..."));
       }

       for(var i = ambit[1]; i <= ambit[2]; i ++){
         if(i == ambit[1] && i != hash.minPage && hash.type == 2){
           var LS = hash.curPage - hash.dotRate;
           LS = LS < hash.minPage ? hash.minPage : LS;
           result.push(this._createPage(hash.nodeClassNamePrefix, hash.viewSize + 1, 2, hash.curPage - hash.viewSize - 1, "..."));
         }
         else if(i == ambit[2] && i != hash.maxPage && hash.type == 2){
           var RS = hash.curPage + hash.dotRate;
           RS = RS > hash.maxPage ? hash.maxPage : RS;
           result.push(this._createPage(hash.nodeClassNamePrefix, hash.viewSize + 1, 4, hash.curPage + hash.viewSize + 1, "..."));
         }
         else{
           str = (i == hash.curPage) ? this._createPage(hash.nodeClassNamePrefix + ' a_hover', 1, 6, hash.curPage, i)
             : this._createPage(hash.nodeClassNamePrefix,i, 3, i, i);
           result.push(str);
         }
       }
       if(hash.type == 1 && ambit[3] != null){
         result.push(this._createPage(hash.nodeClassNamePrefix, "", "", "", "..."));
       }
       if(ambit[3] != null && hash.showLastPage){
         str = (ambit[3] == hash.curPage) ? this._createPage(hash.nodeClassNamePrefix+' a_hover', hash.curPage - 1, 3, hash.curPage, ambit[3])
             : this._createPage(hash.nodeClassNamePrefix, 1, 5, ambit[3], ambit[3]);
         result.push(str);
       }
     }
     else{
       result.push(this._createPage(hash.nodeClassNamePrefix, "", "", "", hash.curPage + hash.maxPage));
     }
     // 下一页按钮
     if(hash.type != 2 && hash.curPage != hash.maxPage){
       if(hash.type == 3)
         result.push(this._createPage("prev_next", hash.curPage + 1, 3, hash.curPage + 1, '>'));
       else
         result.push(this._createPage("prev_next", hash.curPage + 1, 3, hash.curPage + 1, '>'));
     }
     // 总页数
     if (hash.showTotal == true){
       result.push(this._createPage(hash.nodeClassNamePrefix, "", "", "", "共" + hash.maxPage + "页"));
     }

     $E(hash.pageNode).innerHTML = result.join("");
   };
   Ui.Pagination._createPage = function(sClass, sTipPage, nTipIndex, nHrefPage, sHrefText){
     if(sHrefText == ""){ return "";}
     var sTitle = (sTipPage === "" || nTipIndex == "") ? "" : this._getTips(sTipPage, nTipIndex);
     
     // var sLink = '<a title="'+sTitle+'" class="'+sClass+'"' + this._getUrl(nHrefPage) + '>' + sHrefText + '</a>';
     var sLink = '<a title="'+ sTitle+'" class="'+ sClass +'" '+ this._getUrl(nHrefPage) +'>'+ sHrefText +'</a>'
     return sLink;
   };

$registJob("article_associate", function() {

    var __addEvent = Core.Events.addEvent,
        __fixEvent = Core.Events.fixEvent,
        __removeEvent = Core.Events.removeEvent,
        __stopDefault = Core.Events.stopDefaultEvent,
        __setStyle = Core.Dom.setStyle2;

    var articleAssociateNode = $E('article_associate');
    var bneEditor = $E('BNE_editor');

    if (!window.articleAssociate) {
        
        window.articleAssociate = new SinaEditor.newArticleAssociate(articleAssociateNode, articleEditorCFG.articleStatus);
        window.articleAssociate.initSelectbyCookie();

        function showArticleAssociate(){

            window.articleAssociate.show();
        }
        // window.articleAssociate.initList();
        // editorTabs.addCloseCallbackFunc("article",  articleAssociate.del.bind2(articleAssociate));

        __addEvent(articleAssociateNode, showArticleAssociate);
    }




});

