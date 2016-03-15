/**
 * @discarded 通知，通知：
 * 		该方法已经被重构，所以可以被废除了，现在先保留该文件，以保证之前使用该方法的功能可以正常使用
 * 		替代的方法为
 * 			$import("sina/core/class/oop.js");
 * 		现在开始请使用此方法
 * 
 * 												Random
 * 												2010-10-14
 * 
 * 
 * @see sina/core/class/oop.js
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * @fileoverview 类的申明
 * @author Random | YangHao@staff.sina.com.cn
 * @created 2010-04-01
 * @demo
 * 		//类定义
 * 		var Class1=function(name){
 * 
 * 			//这里是构造函数
 * 
 * 			this.name=name || "class1";
 * 		}.define({
 * 
 * 			//这里是属性和方法的定义
 * 
 * 			name:"",
 * 			show:function(){
 * 				alert(this.name);
 * 			}
 * 		});
 * 
 * 		//类继承
 * 		var SubClass1=function(name){
 * 			this.name=name || "subClass1";
 * 		}.$extends(Class1).define({
 * 			show:function(){
 * 				alert("name:"+this.name);
 * 			}
 * 		});
 * 		
 * 		//实例化
 * 		var class1=new Class1("Class1 Name");
 * 		class1.show();
 * 		
 * 		var subClass1=new SubClass1();
 * 		subClass1.show();
 */


Function.prototype.getPrototype=function(){
    var p=function(){};
    p.prototype=this.prototype;
    return new p();
};

Function.prototype.define=function(obj){
    var k;
    for(k in obj){
        this.prototype[k]=obj[k];
    }
    return this;
};

Function.prototype.$extends=function(){
	var ret,
		me=this;
		sup1=arguments[0];
    
    if(sup1){
        ret=function(){
            sup1.apply(this,arguments);
			me.apply(this,arguments);
        };
        ret.prototype=sup1.getPrototype();
        ret.constructor=sup1;
    }
    return ret;
};