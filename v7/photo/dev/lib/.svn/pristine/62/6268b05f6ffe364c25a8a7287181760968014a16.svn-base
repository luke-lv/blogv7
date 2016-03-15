$import("sina/core/events/getEventTarget.js");
$import("lib/util/_util.js");
/**
 * @fileoverview 获取委托事件的源节点和数据，在需要委托的节点上加入action-type和action-data属性
 * @author  Qiangyee | wangqiang1@staff
 * @created 2011-12-05
 * @example
    html 文件如下：
    <ul id="aaaaa">
        <li>
            ...
            <a href="#" title="删除" action-type="remove_comment" action-data="blogId=89524acb3e7f8a">X</a>
            ...
        </li>
        ...
     <ul>
    <code>
    var delegateEl = $E("aaaaa");
    Core.Events.addEvent(delegateEl, function(e){
        var data = Lib.util.getActionData(e, "remove_comment");
        if(!data){
            return;
        }
        
        ...
    },"click");
    </code>
 * @param evt {Event}  事件对象
 * @param actionType {String}  事件类型，需要监听的节点动作
 * @return actionData {Object}  代理事件对象和数据
 */
Lib.util.getActionData = function(evt, actionType, typeAttrName, dataAttrName){
    if (!actionType){
        throw "[Lib.util.getActionData] param actionType is undefined!";
    }
    evt = evt || window.event;
    var _getTarget = Core.Events.getEventTarget, tEl, delegateEl, typeStr, types, type, data,
        typeAttrName = typeAttrName || "action-type",
        dataAttrName = dataAttrName || "action-data";
    tEl = _getTarget(evt);
    delegateEl = evt.currentTarget || (document.documentElement || document.body);
    
    while(tEl && tEl != delegateEl){
        typeStr = tEl.getAttribute(typeAttrName) || "";
        types = typeStr.split(",");
        for (var i=0, len=types.length; i<len; i++){
            type = types[i];
            if (actionType === type){
                data = tEl.getAttribute(dataAttrName);
                return {
                    actionType : actionType,
                    targetEl   : tEl,
                    data : data
                }
            }
        }
        tEl = tEl.parentNode;
    }
    return null;
};

