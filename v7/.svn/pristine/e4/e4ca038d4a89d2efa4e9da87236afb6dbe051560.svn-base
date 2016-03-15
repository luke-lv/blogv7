/**
 * @fileoverview 相册冲印 dom数据 转换为xml
 * @author wujian|wujian@staff.sina.com.cn
 *
 */
$import("printPhoto/cookie.js");

$import("lib/dialogConfig.js");
$import("sina/ui/pagination.js");
$import("sina/ui/tween.js");
$import("sina/ui/dialog/layer.js");
$import("sina/ui/dialog/backShadow.js");
$import("sina/utils/io/ajax.js");
/**
 * 数据 构造 成为xml
 */
scope.domToXml = function(){
    var template = ['<photos>', 
					'<abbrurl>@URL@</abbrurl>', 
					'<middleurl>@URL1@</middleurl>', 
					'<orignalurl>@URL2@</orignalurl>', 
					'<photoname>@pic_title@</photoname>', 
					'<length>@length@</length>',
					 '</photos>'].join("");
    var temp, len, result;
    var xmlArr = [];
    //var chongyinObj={};
    var chongyinObj = [];
    var w = 0, h = 0;
    var id = null;
    url = "";
    url_middle = "";
    url_original = "";
    pic_title = "";
    var child = $E("chyPicCon").childNodes;
	
    for (var i = 0; i < child.length; i++) {
        //for (var i = child.length-1; i>=0; i--) {	//应熊伟要求 倒序		
        id = child[i].childNodes[0].id.split("_")[1];
        
        if (id && window.state.picCache["pic_" + id]) {
        
            w = window.state.picCache["pic_" + id].w;
            h = window.state.picCache["pic_" + id].h;
            trace("w=" + w);
            url = window.state.picCache["pic_" + id].square_url;
            url_middle = window.state.picCache["pic_" + id].middle_url;
            url_original = window.state.picCache["pic_" + id].original_url;
            pic_title = window.state.picCache["pic_" + id].title;
            //转义xml
            //pic_title=pic_title.replace(/</g,"&lt;");
            //pic_title=pic_title.replace(/>/g,"&gt;");
            //trace("dom url"+a.data.picObj["pic_"+id].original_url);
            //trace("dom id"+id);
            //trace("dom w"+w);
            len = w > h ? (w + "-" + h) : (h + "-" + w);
            temp = template.replace("@URL@", url);
            //chongyinObj["pic_"+id]={"pic_id":id,"w":w,"h":h,"square_url":url,"middle_url":url_middle,"original_url":url_original,"title":pic_title};
            chongyinObj.push({
                "pic_id": id,
                "w": w,
                "h": h,
                "square_url": url,
                "middle_url": url_middle,
                "original_url": url_original,
                "title": pic_title
            });
            //trace("i=="+i);
            temp = temp.replace("@length@", len);
            temp = temp.replace("@URL1@", url_middle);
            temp = temp.replace("@URL2@", url_original);
            
            pic_title = pic_title.replace("&#65509;", "￥");//转义 解决bug
            try {
                pic_title = encodeURI(pic_title);
            } 
            catch (e) {
            
            }
            
            
            
            temp = temp.replace("@pic_title@", pic_title);
            
            xmlArr.push(temp);
        }
    }
    //chongyinObj["test"]="hi test!";
    result = "<wdxc>" + xmlArr.join("") + "</wdxc>";
   
    DB.setFlashCookie(chongyinObj);
    
    //动画
    window.state.shadow = new BackShadow(0.4);
    window.state.shadow.show();
    
    //先tween 动画  然后提交
    var layer = ['<div class="printlayer">', 
					'<div class="printlayer_bg"></div>',
					'<div class="printlayer_box">', 
						'<div class="title">请稍候，<br/>', 
						'我们正在把您本次选中的照片导入新浪商城进行冲印。</div>', 
					'<div class="content">', 
					'导入完成后，页面将自动跳转，请勿关闭浏览器', 
					'<div class="pacebar">', 
					'<div class="pacebar_bg">', 
					'<em style="width:0%;" id="tweenNode"></em></div><span id="tweenNum"></span>',    //	'<div class="btn">',
    //'<a href="http://www.126.com/" class="nextstep"><em>下一步</em></a>',
    //'<!--不可点击按钮-->',
    //'<!--<a href="#" class="nextstep noclick"><em>下一步</em></a>-->',
    //'选择照片打印张数和纸质</div>',
    				'</div></div></div></div>'].join("");
    window.state.layer = new Lib.Panel();
    window.state.layer.setTemplate('<div style="position:absolute;z-index:2000;" id="#{panel}">' + layer + '</div>');
   // alert(result)
    var ww = 457;
    var hh = 238;
    var win = Core.System.winSize();
    var _x = win.width / 2 - ww / 2;
    var _y = win.height / 2 - hh / 2 - 20;
    window.state.layer.setPosition(_x, _y); 
    //trace("here 2");
    window.state.layer.show();
    
    //new	Ui.tween($E("tweenNode"),["width"],[323],3,"simple",{end:function(){
    
    new Ui.tween($E("tweenNode"), ["width"], [323], 3, "simple", {
        end: function(){
            //$E("xmlform").submit();	
            //alert("done!");
        },
        tween: function(){
            var t = parseInt((parseInt($E("tweenNode").style.width) / 323) * 100);
            if (t >= 90) {
                //this.stop();	
                $E("tweenNum").innerHTML = t + "%";
                Ui.tween.stop($E("tweenNode"));
                
            }
            else {
                $E("tweenNum").innerHTML = t + "%";
            }
            
        }
    });
    
    //提交
    
   // var b = a;
    //trace(result);
    var listUrl = "http://photo.blog.sina.com.cn/services/is_normal_photo_print.php";
    Utils.Io.Ajax.request(listUrl, {
        POST: {
            content: result,
            uid: scope.$uid,
            varname: "dd"
        },
        returnType: "json",
        onComplete: function(data){
            //a.data.tween.stop();
            //	$E("tweenNum").innerHTML="100%";
            //alert(1);
            
            //email           新浪用户email
            //inviterid       固定为sinaphoto
            //registerDate    用户注册时间
            //code            第一步中我的相册返回给sina的 email+时间戳 字符串
            //	trace(data.code);
            //	trace(dd.code)
            if (data.code == "A00006") {
                Lib.checkAuthor();
                //构造表单 提交数据	http://dxht2.wodexiangce.cn/partner/sinaphoto.faces		
                var s = ['<form action="http://www.wodexiangce.cn/partner/sinaphoto.faces" style="display:none;" id="xmlform" method="post" >', 
							'<input type="text" value="' + scope.$uid + '" id="email" name="email" />', 
							'<input type="text" value="sinaphoto" id="inviterid" name="inviterid" />', 
							'<input type="text" value="' + data.data + '" id="code" name="code" />', 
							'</form>'].join("");
                var ele = $C("div");
                ele.innerHTML = s;
                ele.style.cssText = "display:none";
                document.body.appendChild(ele);
                //$E("xmlStr").value=result;
                //alert($E("xmlData").value);
                new Ui.tween($E("tweenNode"), ["width"], [323], 3, "simple", {
                    end: function(){
                        $E("xmlform").submit();
                    },
                    tween: function(){
                        var t = parseInt((parseInt($E("tweenNode").style.width) / 323) * 100);
                        $E("tweenNum").innerHTML = t + "%";
                    }
                });
            }
            else {
                Ui.tween.stop($E("tweenNode"));
                $E("tweenNode").style.cssText = "width:0px;";
                $E("tweenNum").innerHTML = "0%";
                window.state.layer.close();
                window.state.shadow.close();
                
                winDialog.alert('网络繁忙，请稍后再试', {
                    icon: "01",
                    funcOk: function(){
                    }
                });
            }
            
            
            
        },
        onException: function(){
            //Ui.tween.res
            Ui.tween.stop($E("tweenNode"));
            $E("tweenNode").style.cssText = "width:0px;";
            $E("tweenNum").innerHTML = "0%";
            window.state.layer.close();
            window.state.shadow.close();
            
            winDialog.alert('网络繁忙，请稍后再试', {
                icon: "01",
                funcOk: function(){
                }
            });
        }
    });
    
    
};
