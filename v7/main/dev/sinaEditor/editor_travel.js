/**
 * 引用编辑器文件
 * @author Qiangyee
 * @date 2014-08-04
 */
;
(function (w) {
    'use strict';
    $import("sinaEditor/core/SinaEditor.js"); //编辑器管理器
    $import("sinaEditor/core/Util.js"); //核心工具库
    $import("sinaEditor/core/VK.js"); //核心工具库
    $import("sinaEditor/core/dom/Env.js"); //编辑器管理器
    $import("sinaEditor/core/Event.js"); //事件处理组件
    $import("sinaEditor/core/dom/dtd.js");
    $import("sinaEditor/core/dom/qwery.js");
    $import("sinaEditor/core/dom/DOMUtil.js");
    $import("sinaEditor/core/dom/Range.js");
    $import("sinaEditor/core/dom/Selection.js");
    $import("sinaEditor/core/dom/IERange.js");
    $import("sinaEditor/core/dom/IESelection.js");
    $import("sinaEditor/core/Quirks.js");
    $import("sinaEditor/plugins/plugin.js"); //插件管理器
    $import("sinaEditor/core/Editor.js"); //编辑器核心模块
    $import("sinaEditor/core/virtualNode.js");
    $import("sinaEditor/core/htmlFilter.js"); //编辑器核心模块

    //Toolbar
    $import("sinaEditor/theme/default.js");
    $import("sinaEditor/ui/HTMLTemplate.js");
    $import("sinaEditor/ui/Layer.js");
    $import("sinaEditor/ui/WinBox.js");
    $import("sinaEditor/ui/Button.js");
    $import("sinaEditor/ui/GroupButton.js");
    $import("sinaEditor/ui/ToolBar.js");
    $import("sinaEditor/core/animate.js");
    $import("sinaEditor/plugins/toolBar.js"); //工具条工具

    //$import("sinaEditor/plugins/initIframeContent.js");
    $import("sinaEditor/plugins/initDivContent.js");
    //以上文件必需加载

    //plugin
    $import("sinaEditor/plugins/basestyle/basestyle.js");

    $import("sinaEditor/plugins/title/title.js");
    $import("sinaEditor/plugins/title/titleBtn.js");

    $import("sinaEditor/plugins/justify/justify.js");
    $import("sinaEditor/plugins/justify/justifyBtn.js");

    $import("sinaEditor/plugins/color/colorPicker.js");
    $import("sinaEditor/plugins/color/colorPickerBtn.js");

    $import("sinaEditor/plugins/listener/undo.js");
    $import("sinaEditor/plugins/listener/enterkey.js");
    $import("sinaEditor/plugins/listener/deletekey.js");
    $import("sinaEditor/plugins/listener/paste.js");
    $import("sinaEditor/plugins/listener/hotkey.js");

    $import("sinaEditor/plugins/link/link.js");
    $import("sinaEditor/plugins/link/linkBtn.js");

    $import("sinaEditor/plugins/image/uploadImage.js");
    $import("sinaEditor/plugins/image/image.js");
    $import("sinaEditor/plugins/image/imageBtn.js");

    $import("sinaEditor/plugins/widget/widget.js");

    $import("sinaEditor/plugins/video/video.js");
    $import("sinaEditor/plugins/video/videoBtn.js");

    $import("sinaEditor/plugins/music/music.js");
    $import("sinaEditor/plugins/music/musicBtn.js");
    
    $import("sinaEditor/plugins/travel/travel.js");

    $import("sinaEditor/plugins/suda/suda.js");

})(window);
