/**
 * Copyright (c) 2009, Sina Inc. All rights reserved.
 
 * @fileoverview 编辑标题和内容区域的focus和blur事件
 * @author gaolei2@
 */

$import("sina/sina.js");
$import("sina/core/string/trim.js");
$import("sina/core/dom/setStyle2.js");
$import("sina/core/dom/getStyle.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/stopDefaultEvent.js");
$import('sina/utils/form/sinput.js');
$import('sina/utils/form/functionlimit.js');
$import("sina/ui/Placeholder.js");

$registJob("editor_focus", function() {

    var articleTitle = $E('article_title');
    var DEFAULT_TITLE_TIP = '请输入标题';

    var __setStyle = Core.Dom.setStyle2;
    var __getStyle = Core.Dom.getStyle;
    var __addEvent = Core.Events.addEvent;
    var __stopEvent = Core.Events.stopDefaultEvent;

    function process(ele) {

        __setStyle(ele, {
            'resize': 'none',
            'height': '',
            'overflow-y': 'hidden'
        });

        var scrollHeight = ele.scrollHeight;
        var lineHeight = parseInt(__getStyle(ele, 'line-height'), 10);
        if (scrollHeight < lineHeight) {
            scrollHeight = lineHeight;
        }
        __setStyle(ele, {
            'height': scrollHeight + 'px'
        });
    }

    if (articleTitle) {

        process(articleTitle);

        if (articleTitle.getAttribute('old-value') != '') { // 编辑的情况
            articleTitle.value = articleTitle.getAttribute('old-value');
            process(articleTitle);
        }

        new Sina.Ui.Placeholder(articleTitle, {
            text: DEFAULT_TITLE_TIP
            // ,useHTML5: true
        });

        // 限定标题长度
        Utils.Form.limitMaxLen(articleTitle, 96);
        // 去除标题空格
        Utils.Form.functionlimit(articleTitle, Core.String.trim, true);

        // 标题自动换行
        __addEvent(articleTitle, function(e) {
            var val = articleTitle.value;
            var oldval = articleTitle.getAttribute('old-value') || '';
            if (oldval == '' || val != oldval) {
                process(articleTitle);
            }
            articleTitle.setAttribute('old-value', val);
        }, 'keyup');

        __addEvent(articleTitle, function(e) {
            var e = e || window.event;
            if (e.keyCode == 13) {
                __stopEvent(e);
            }
        }, 'keydown');

        // 换成input了，不需要过滤了
        // __addEvent(articleTitle, function(e) {

        //   var clipboardData = (e.clipboardData || window.clipboardData);
        //   var text = clipboardData.getData('text/plain');

        //   this.value = this.value + text.replace(/\n|\r|\u21B5|\u200B/gm, '');

        //   __stopEvent(e);

        // }, 'paste');

    }

  var editorNode = $E('editor');
  var DEFAULT_BODY_TIP = '请输入正文';

    if (editorNode) {
        // editorNode是div节点  所以需要用text进行判断是否插入内容
        // TODO ====  以后还要判断是否有图片
        var editor = SinaEditor.get(0);
        editor.ready(function() {
            window.editorPlaceHolder = new Sina.Ui.Placeholder(editorNode, {
                text: DEFAULT_BODY_TIP,
                checkCanShowFn: function() {
                    var editor = SinaEditor.get(0);
                    return editor.isEmptyContent();
                    // var text = this.node.textContent || this.node.innerText;
                    // return (this.node && !text);
                }
            });
            editor.on('afterCommand', function(e) {
                editorPlaceHolder.hide();
            });
        });

        // ie6下 min-height不管用，手动设置高度，超过则删掉height值
        // ie6跳得比较厉害，所以删掉这个功能
        // if ($IE6){
        //     // console.log('ie6下 min-height不管用，手动设置高度，超过则删掉height值')
        //     editor.ready(function(){
        //         var editorNode = $E('editor');
        //         editor.on('afterCommand', (function (node) {
        //             // console.log('afterCommand**********************')
        //             setEditorHeight(node);
        //         })(editorNode));

        //         __addEvent(editorNode, function(e){
        //             var node = $E('editor');
        //             setEditorHeight(node);
        //         }, 'keyup');

        //     });

        //     function setEditorHeight (node) {
        //         var defaultHeight = 230;
        //         var scrollHeight = node.scrollHeight;

        //         if (scrollHeight <= defaultHeight){
        //             node.style.height = ''; // 空值保持不变
        //         }else{
        //             node.style.height = scrollHeight + 'px';
        //         }
        //     }
        // }

    }

});

