/**
 * @fileoverview 得到模板编号，同时判断是否需要渲染动态模板
 * @author xy xinyu@staff.sina.com.cn
 * @modified luorui luorui1@staff.sina.com.cn
 */
$import('lib/lib.js');
$import('lib/interface.js');
$import('sina/utils/io/jsload.js');
$import('lib/insertMoban.js');
//为了不让少敏，杨皓修改相应的conf,那些很多。因此将插入动感模板的程序放到这里，在得到模板号以后执行

/**
 * 得到模板编号
 * @param {Object}
 */
Lib.tplFuncArr = {};
Lib.tplFuncCount = 0;
Lib.getTplNum = function(func){
    Lib.tplFuncArr[Lib.tplFuncCount++] = func ||
    function(){
    };
	//跳过这一步，直接读取真实的tpl。由于php缓存，scope很可能不准确。
    if ($isAdmin && scope.tpl && scope.tpl != '') {//如果已经有了模板号，则直接执行程序
        for (var k in Lib.tplFuncArr) {
            Lib.tplFuncArr[k]();
            Lib.tplFuncArr[k] = null;
            delete Lib.tplFuncArr[k];
        }
        return;
    }
    else {
        if ($IE) {//ie用户直接通过uid.css读取
//        trace("ie用户直接通过uid.css读取");
            var ss = document.styleSheets;
            var re = /\S*(blog7tpl([^t]*))\S*/gi;
			var re2=/\S*(blog7newtpl\/css([^t]*))\S*/gim;
			
            for (var i = 0; i < ss.length; i++) {
                if (ss[i].id == 'uid_link_css') {
                    var res = re.exec(ss[i].cssText);
					var res2  = re2.exec(ss[i].cssText);
					
                    if (res != null|| res2 != null) {
                        if (res != null) {
								scope.tpl = res[2].split('/')[2];
//								trace('老的匹配模式：'+res[2].split('/')[2]);
							}
							else 
								if (res2 != null) {
									scope.tpl = res2[2].split('/')[2];
//									trace('新的匹配模式：'+res2[2].split('/')[2]);
								}
                    }
                    break;
                }
            }
			
			for (var k in Lib.tplFuncArr) {
                Lib.tplFuncArr[k]();
                Lib.tplFuncArr[k] = null;
                delete Lib.tplFuncArr[k];
            }
        }
        else 
            if (!$IE && scope.$PRODUCT_NAME == 'blog7' ) {//blog7的非ie用户通过ajax
                        
				for (var k in Lib.tplFuncArr) {
		            Lib.tplFuncArr[k]();
		            Lib.tplFuncArr[k] = null;
		            delete Lib.tplFuncArr[k];
		        }
				return ;
			/**下面的代码不执行了，该css 在页面中已存在**/
                Utils.Io.Ajax.request('http://blog.sina.com.cn/s/' + scope.$uid + '.css?', {
                    onComplete: function(text){
                        // 根据返回接口，
                        //返回类似：@charset "utf-8";@import url("http://simg.sinajs.cn/blog7tpl/13/13_5/t.css"),得到scope.tpl
                        text = text.replace('\n', '');
                        var re = /\S*(blog7tpl([^t]*))\S*/gim;//|\S*(blog7newtpl\/css([^t]*))\S*
                        var re2=/\S*(blog7newtpl\/css([^t]*))\S*/gim;
                        var res = re.exec(text);
						var res2= re2.exec(text);
                        if (res != null||res2!=null) {
							if (res != null) {
								scope.tpl = res[2].split('/')[2];
							}
							else 
								if (res2 != null) {
									scope.tpl = res2[2].split('/')[2];
								}
                        }
						
						for (var k in Lib.tplFuncArr) {
                            Lib.tplFuncArr[k]();
                            Lib.tplFuncArr[k] = null;
                            delete Lib.tplFuncArr[k];
                        }
                    }.bind2(this),
                    returnType: 'txt'
                });
            }
            else 
                if (!$IE && scope.$PRODUCT_NANM != 'blog7') {//非blog7的非ie用户
                	Utils.Io.JsLoad.request('http://blog.sina.com.cn/s/' + scope.$uid + '.js', {	//换用 jsload，include 有问题。
                		GET:{
                			tm:new Date().getTime()
                		},
                		onComplete:function(){
	                    	//trace("tpl:"+scope.tpl);
	                        for (var k in Lib.tplFuncArr) {			//执行要后 remove，因为这个是共享的。
	                            Lib.tplFuncArr[k]();
	                            Lib.tplFuncArr[k] = null;
	                            delete Lib.tplFuncArr[k];
	                        }
                		}.bind2(this)
                	});
                }
    }
};


