/*
   随检测文本的高度自动变化
   author liming  | liming1@staff.sina.com.cn
          shaomin | shaomin@staff.sina.com.cn
*/

$import("sina/utils/form/_form.js");
$import("sina/sina.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/function/bind2.js");
$import("sina/core/system/br.js");
$import("sina/core/dom/setStyle.js");
$import("sina/core/dom/setStyle2.js");
$import("sina/core/dom/getStyle.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/string/leftB.js");

Utils.Form.magicTextarea = function(oNode, nLength) {
    var commentHeight = null,isCloned = null;
    if(oNode == null){
        return;
    }
    if(typeof oNode == "string"){
        oNode = $E(oNode);
    }
    
    // 让指定文本框随着用户的输入，总是多显示一个空行
    var listenNode = function () {
        if ($IE && document.activeElement != this) {
            return;
        }
        var valueLength = Core.String.byteLength(oNode.value);
        if(valueLength > nLength){
            oNode.value = Core.String.leftB(oNode.value, nLength);
        }
        var nodeHeight;
        if (!$IE) {
            // 用一个高度为 0 的克隆 TEXTAREA 来计算实际内容的高度，用于和按行数计算的高度比较
            // 选择较大者用于输入框的实际高度
            if (!$E("clonedTextarea")) {
                isCloned = this.cloneNode(true);
                // isCloned.className = oNode.className;
                Core.Dom.setStyle2(isCloned,{
                     "height"  : "0px",
                     "display" : "none"
                });

                isCloned.id = "clonedTextarea";
                document.body.appendChild(isCloned);
            }
            
            var valueHeight = window.parseInt(this.scrollHeight);
            if ($E("clonedTextarea") != null) {
                $E("clonedTextarea").value = this.value;
                valueHeight = window.parseInt($E("clonedTextarea").scrollHeight);
            }
            
            var lineHeight = parseInt(Core.Dom.getStyle(this, "lineHeight")) * (this.value.split("\n").length - 1) + 18;	
            
            nodeHeight = (lineHeight > valueHeight) ? lineHeight : valueHeight;
            
        } else {
            var range = this.createTextRange();
             // 如果文本框是多行，且最后一行是空行，额外增加 15 像素高度，以免不自动撑高
            nodeHeight = parseInt(range.boundingHeight) + (/\r\n$/.test(this.value) && this.value != "" ? 19 : 4);
        }

        Core.Dom.setStyle(this, "height", (nodeHeight) + "px");	
    };
     
    if (!$IE) {
        Core.Events.addEvent(oNode, listenNode.bind2(oNode), "input");
    } else {
        Core.Events.addEvent(oNode, listenNode.bind2(oNode), "mouseout");
        Core.Events.addEvent(oNode, listenNode.bind2(oNode), "keyup");
        Core.Events.addEvent(oNode, listenNode.bind2(oNode), "keypress");
    }
    Core.Events.addEvent(oNode, listenNode.bind2(oNode), "focus");
    Core.Events.addEvent(oNode, function () {
        var valueLength = Core.String.byteLength(oNode.value);
        if (valueLength > nLength) {
            oNode.value = Core.String.leftB(oNode.value, nLength);
        }
        Core.Dom.setStyle(this, "paddingBottom", 0);
        // 修复 IE 下 textarea 的 padding-bottom 设置为 0 之后，高度不缩回去的 BUG
        if ($IE) {
            if(commentHeight == null){commentHeight = true;}
            var h = (commentHeight = !commentHeight) ? 1 : -1;
            Core.Dom.setStyle(this, "height", parseInt(Core.Dom.getStyle(this, "height")) + h);
        }
    }.bind2(oNode), "blur");
 }