/**
 * @author wujian@staff.sina.com.cn
 * @date 2010-8-6
 *  用途  创建一个节点
 *  @example 
 *  createNode("span" { "id":"testSpan",
 *  				"class":"ff",
 *  				"style":"display:none"
 *  				})
 *   
 */
$import("sina/core/dom/_dom.js");
$import("sina/sina.js");
$import("sina/core/array/foreach.js");

/**
 * 创建属性节点 
 * @param {Object} tagName 节点tag
 * @param {Object} propertyObj 属性对象
 * @param {Object} txt 插入文本
 */
Core.Dom.createNode = function(tagName,propertyObj,txt){
	//欢迎大家来补充
	var cfg={
		"class":"className",
		"style":"style.cssText"
	}
	var ele=$C(tagName);
	if(txt){
		ele.appendChild(document.createTextNode(txt));
	}
	if(!propertyObj){
		return ele;
	}
	var tempkey
	for(var key in propertyObj){
		tempkey=cfg[key]||key;
		trace("key=="+key);
		trace("tempkey=="+tempkey+"propertyObj[key]="+propertyObj[key]);
		
	//	ele.setAttribute(tempkey,propertyObj[key]);
		ele[tempkey]=propertyObj[key];
	}
	return ele;
};

Core.Dom.children=function(children){
	if (typeof children == 'object') { // array can hold nodes and text
			Core.Array.foreach(flatten(children),function(e){
                if (typeof e == 'object') 
                    element.appendChild(e);
                else 
                    if (_isStringOrNumber(e)) 
                        element.appendChild(_text(e));
            })           
        }else{//文本与数字
			 if (_isStringOrNumber(children)){
			 	element.appendChild(_text(children));
			 }                 
		} 
		
     var _text=function(text){
	 	 return document.createTextNode(text);
	 }
	 var _isStringOrNumber=function(param){
        return (typeof param == 'string' || typeof param == 'number');
    }  
	var flatten=function(eleArray){
		var re=[];
		for(var i=0,len=eleArray.length;i<len;i++){
			if(typeof eleArray[i]=='object'){//子元素还是数组 递归吧
				re.concat(arguments.callee(eleArray[i]));
			}else{
				re[re.length]=eleArray[i];
			}
		}
		return re;
	}  
	
};

	