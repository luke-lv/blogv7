
/** 
 * @fileoverview Qing 图片墙滚动
 * @author Cjlory | guanghui2@staff.sina.com.cn
 */
$import("lib/jobs.js");
$import("sina/core/dom/insertHTML.js");
$import("lib/TweenStrategyEx.js");
$import("lib/logSystem.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/array/foreach.js");
$import("sina/core/dom/getElementsByClass.js");
$import("sina/utils/io/jsload.js");

$registJob('qingDiscover', function(){
    if(!$E("discover")) return;
    scope.logSystem();
    scope.$pageId=3;
    
    //为当前页面所有图片框 加click事件
    Core.Array.foreach(Core.Dom.byClz(document,"div","cell"),function(item,index){
        Core.Events.addEvent(item,function(event){
            clickHandler(item);
        });
    });

    if($E("discover") && $E("discover").parentNode){
        $E("discover").parentNode.style.position="relative";
    }
    
    //6秒刷新一次
    setTimeout(function(){
        refresh();
        setInterval(refresh,6000);
    },6000);
    
    var url=$_GLOBAL.qingURL+"/blog/api/getdiscoverlist.php",
        rowHeight=Core.Dom.byClz($E("discover"),"div","row")[0].offsetHeight;
    
    function refresh(){
        Utils.Io.JsLoad.request(url,{
            onComplete:function(result){

                if(result.code==="A00006" && result.data.list.length===6){
                    
                    scope.$pageId=result.data.curPage || 1;
                    
                    var list=result.data.list,html=[];
                    html[html.length]='<div class="row">';
                    //接口写死只能返回6个才能走通。图片墙要显示4个不得已在这里做手脚（6-2=4）
                    for(var i=0;i<list.length-2;i++){
                        html[html.length]='<div blogid="'+list[i].blogId+'" class="cell'+(list[i].type===1?" cellText": list[i].type===4 ?" cellMusic":"")+'">';
                        html[html.length]='<div class="content">';
                        if(list[i].type===1){
                            //文字
                            if(list[i].title){
                                html[html.length]='<h3>'+list[i].title+'</h3>';
                            }
                            html[html.length]='<p>'+list[i].content+'</p>';
                        }else{
                            //图片 视频
                             html[html.length]='<img alt="'+list[i].nick+'" '+list[i].imageStyle+' src="'+list[i].content+'"/>';
                        }
                        
                        if(list[i].type===3 || list[i].type===4){
                            //视频
                            html[html.length]='<span class="ico_play"></span>';
                        }
                        html[html.length]='<span class="tag">'+list[i].tagname+'</span>';
                        if(list[i].type===1){
                            html[html.length]='<span class="txtopa"></span>';
                        }
                        
                        html[html.length]='</div>';
                        html[html.length]='<div class="cate"></div>';
                        html[html.length]='</div>';
                    }
                    html[html.length]='</div>';
                    
                    Core.Dom.insertHTML($E("discover"),html.join(""),"AfterBegin");
                    
                    //为新添加的元素注册 click事件
                    Core.Array.foreach(Core.Dom.byClz(document,"div","cell"),function(item,index){
                        if(index>5){
                            return;
                        }
                        Core.Events.addEvent(item,function(event){
                            clickHandler(item);
                        });
                    });
                    
                    $E("discover").style.marginTop=-rowHeight+"px";
                    
                    //row显示动画
                    var tween=new xBlog.TweenStrategyEx([parseInt($E("discover").style.marginTop)],[0],1.5,function(t, b, c, d){
                        return -c * ((t=t/d-1)*t*t*t - 1) + b;
                    });
                    tween.onTween=function(v){
                        $E("discover").style.marginTop=v[0]+"px";
                    }
                    tween.onEnd=function(){
                        var rows=Core.Dom.byClz($E("discover"),"div","row");
                            lastRow=rows[rows.length-1];
                        lastRow.parentNode.removeChild(lastRow);
                    }
                    tween.start();
                }
            },
            //returnType:"json",
            GET:{
                pageNum:6,
                pageId:++scope.$pageId,
                //pageId:1,
                rnd:Math.random()
            }
        });
    }
    
    function clickHandler(domEle){
        var tag=Core.Dom.byClz(domEle,"span","tag")[0].innerHTML,
        blogId = domEle.getAttribute("blogid");
        window.open($_GLOBAL.qingURL+"/blog/controllers/tag.php?tag="+encodeURIComponent(tag)+"&blogid="+blogId);
    }
//  function mOver(ele){
//      var author=Core.Dom.byClz(ele,"em","author")[0];
//      author.style.display="";
//      //垂直居中
//      author.style.top=(rowHeight-author.offsetHeight)/2+"px";
//      var mask=Core.Dom.byClz(ele,"span","mask")[0];
//      mask.style.display="block";
//  }
//  
//  function mOut(ele){
//      var author=Core.Dom.byClz(ele,"em","author")[0];
//      author.style.display="none";
//      var mask=Core.Dom.byClz(ele,"span","mask")[0];
//      mask.style.display="none";
//  }
});