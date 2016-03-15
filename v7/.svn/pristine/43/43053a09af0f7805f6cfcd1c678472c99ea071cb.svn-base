/**
 * tags组件，给已有文章新加TAG组件
 * @auth    dcw1123 | chengwei1@staff.sina.com.cn
 * @auth    Modifed by Qiangyee | wangqiang1@staff  2011-08-26
 * @    Modifed by guanghui2  2012-04-19
 * @ copy from xblog ---liming9 haha~ 2012年8月8日
 */
$import("sina/core/events/addEvent.js");
$import("sina/core/string/trim.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/events/fireEvent.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/core/string/encodeHTML.js");
$import("sina/utils/io/ajax.js");
//tInputContiner tag容器
//tInput tag输入文本框
//tTags 隐藏域，它的值才是提交保存的值
//commonTagContainer 常用标签容器
/**
 *@example
 <code>
 var tagInput = TagsInput(tInputContiner, tInput, tTags, commonTagContainer);
 tagInput.addTag("标签",{insertIndex:2});
 </code>
 */
function TagsAddNew(tInputContiner, tInput, tTags){ //, commonTagContainer
    
	var __addEvent = Core.Events.addEvent;
    var returnObject = {};
    var splitChar = [',', '，'];
    var rBLANK = /\s/, rNOTAZ = /[^a-z]$/;
    /**
     * 添加标签
     * @param {String}  str 标签名称
     * @param {JSON}    opt 标签配置 deleteAble:是否可删除，insertIndex:插入位置
     */
    function createTag (str, opt) {
        str = str.replace(/[,，\s]/g, '');
        if(str===""){
            return;
        }
        str = Core.String.encodeHTML(str);
        str = substr(str, 20);
        var spans = tInputContiner.getElementsByTagName("div");
        if(spans.length>4) {
            tInput.value="";
            tInput.blur();
            //Xblog.effectTips("最多输入5个标签","alert","top");
            (!opt || !opt.notip)&&winDialog.alert('最多输入5个标签', {
                icon: '01'
            });
            return;
        }
        if((','+tTags.value+',').indexOf(','+str+',')>-1){
            tInput.value = "";
            return;
        }
        opt = opt || {};
        opt.deleteAble = typeof opt.deleteAble == 'boolean' ? opt.deleteAble : true;
        //var tn = document.createTextNode(str);
        var sp = document.createElement('div'), deleteBtn='';
        deleteBtn = (opt.deleteAble != false) ? '<a onclick="return false" href="javascript:;" title="删除">×</a>' : '';
        if (opt.deleteAble !== false)
            sp.setAttribute("deleteAble", "true");
        else
            sp.setAttribute("deleteAble", "false");
        sp.innerHTML = str + deleteBtn;
        sp.className = opt.className || "tag_tx";
        //sp.style.whiteSpace = 'nowrap';
        var tagsElArray = $T(tInputContiner, 'div');
        //sp.appendChild(tn);
        if ((null != opt.insertIndex) && (tagsElArray.length-1 > opt.insertIndex)) {
            tInputContiner.insertBefore(sp, tagsElArray[opt.insertIndex]);
        } else {
            tInputContiner.insertBefore(sp, tInput);
            var firstChild = tInputContiner.children[0];//SinaEx.firstChild(tInputContiner);
            if (firstChild && "EM" == firstChild.nodeName.toUpperCase()) {
                tInputContiner.removeChild(firstChild);
            }
        }
        setTagInputValue();
        return true;
    }
    /**
     * 删除标签
     * @param {String}  tagName 标签名称
     * @param {Boolean} deleteAble  删除的标签是否为可删除标签
     */
    function removeTag(tagName, deleteAble) {
        
        var tagEls = tInputContiner.getElementsByTagName("div");
        var removeEl, i=0, len=tagEls.length, txt, tag;
        var reg = /([^×]+)(×)*$/;
        if (deleteAble) {
            reg = /([^×]+)$/;
        }
        
        for (; i < len; i++) {
            txt = tagEls[i].innerText || tagEls[i].textContent;
            tag = txt.replace(reg,"$1"); //去掉删除那个符号x
            if (tagName == tag) {
                removeEl = tagEls[i];
                break;
            }
        }
        if (removeEl) {
            removeEl.parentNode.removeChild(removeEl);
        }
        setTagInputValue();
    }

    function setTagInputValue() {
        tInput.value = "";
        var spans = tInputContiner.getElementsByTagName("div");
        var a = [], i=0, len=spans.length, txt;
        for (; i < len; i++) {
            txt = spans[i].innerText || spans[i].textContent;
            a.push(txt.replace(/×$/,"")); //去掉删除那个符号x
        }
        tTags.value = a.join(splitChar[0]);
        if (len > 5) {
            //tInput.type="hidden"; //输入5个tag即停止
            //ie修改input的type属性报错 改为隐藏该input
            tInput.style.display="none";
        }else if (len===0){
            tInput.style.display="";
        }
    }

    function substr(str, len) {
        if (!str || !len) {
            return '';
        }
        var a = 0;
        var i = 0;
        var temp = '';
        for (i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 255) {
                a += 2;
            } else {
                a++;
            }
            if (a > len) {
                return temp;
            }
            temp += str.charAt(i);
        }
        return str;
    }

    function byteLen(str) {
        var aMatch = str.match(/[^\x00-\x80]/g);
        return (str.length + (!aMatch ? 0 : aMatch.length));
    }

    __addEvent(tInputContiner, function(e) {
        e = e || window.event;
        var t=e.target || e.srcElement;
        if(t.tagName.toUpperCase()==="A") { //单击删除tag
            setTimeout(function(){
                t.parentNode.parentNode.removeChild(t.parentNode);
                setTagInputValue();
            }, 10);
        }else{
            if(tInput.style.display==="none") {
                tInput.style.display = "";
            }
            tInput.focus();
        }

        tInputContiner.scrollTop = 0;
    });

    __addEvent(tInput, function() {
        createTag(tInput.value);
    }, "blur");
    
    __addEvent(tInput, function(e) {
        e = e || window.event;
        var c = e.keyCode || e.charCode;

        //回车键的keyCode是8
        //keyCode为8 是后退好不好...
        if(c===8) {
            var oldVal = tInput.value;
            //trace("oldVal="+oldVal);
            setTimeout( function() {
                var newVal = tInput.value
                //trace("newVal=="+newVal);
                if(oldVal==="" && newVal==="") {
                    //trace("here23");
                    //trace("here23=="+tInput.value);
                    var tagEl = tInput.previousSibling;
                    if (tagEl) {
                        var deleteAble = ("false" == tagEl.getAttribute("deleteAble")) ? false : true;
                        deleteAble && tInputContiner.removeChild(tInput.previousSibling);
                        deleteAble && setTagInputValue();
                    }
                } else {
                    tInput.value = newVal.replace(/^,/, "");
                }
            }, 25);
        }
    }, "keydown");

    __addEvent(tInput, function() {
        var v = tInput.value,
            vl=v.length,
            lc = v.substr(vl-1); //last char
        if($CHROME&&/\w/.test(lc)){return} //解决Chrome下输入法被打断之后就不能再输入的bug！！

        if(vl === 1) {
            if(lc === splitChar[0] || lc=== splitChar[1] || rBLANK.test(lc)) {
                tInput.value = "";
            }
        } else if(vl > 1) {
            // if(lc === splitChar[0] || lc=== splitChar[1] || rBLANK.test(lc) || (byteLen(v)>19&&rNOTAZ.test(lc))) {
            if(lc === splitChar[0] || lc=== splitChar[1] || rBLANK.test(lc) || byteLen(v)>19) {
                //tInput.value = "";
                createTag(v);
            }
        }
    }, "keyup");

    //opera不支持paste 在opera粘贴不生效
    __addEvent(tInput, function() {
        //var m = this;
        setTimeout( function() {
            var str=tInput.value;
            if(str) {
                createTag(str);
            }
        }, 25);
    }, "paste");


    // 向外部暴露添加标签接口
    returnObject.addTag = createTag;
    returnObject.removeTag = removeTag;
    return returnObject;
}
