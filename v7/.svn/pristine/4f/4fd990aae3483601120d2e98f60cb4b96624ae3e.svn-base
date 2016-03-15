
/** 
 * @fileoverview Qing 精品tag推荐
 * @author Book | liming9@staff.sina.com.cn
 * @date 2012年6月4日
 */
$import("lib/jobs.js");
$import("sina/core/events/addEvent.js");
$import("sina/ui/tween/tweenStrategy.js");
$import("other/SinaEx.js");

$registJob('qingTagRec', function(){
    var listwrap = $E("tag-list-wrap"),
        data = scope.reclist;
    if(!listwrap || !data || !data.length) return;

    var PERPAGE = 6;
    var PAGES = Math.floor( data.length/PERPAGE );
    var LOGCODE = /&x$/.test(window.location.href) ? '79_01_05' : '79_01_06'; //x结尾是封杀的，否则是未开通的

    Core.Events.addEvent($E("changeList"), function(evt){
        var firstUl, lastUl;
        firstUl = listwrap.children[0];
        lastUl = listwrap.children[1];
        lastUl.style.display = '';
        var tn = new Ui.TweenStrategy(0, 630, 0.63);
        tn.onTween=function(v){
            firstUl.style.left = -v +"px";
            lastUl.style.right = v +"px";
        };
        tn.onEnd = function(){
            firstUl.style.display = "none";
            firstUl.style.left = "";
            lastUl.style.right = "";
            firstUl.innerHTML = "";
            listwrap.appendChild(firstUl); //把元素移动到后面
            listwrap.page++;
            if(listwrap.page>=PAGES)listwrap.page=0;
            firstUl.innerHTML = getHtmlByPage(listwrap.page+1);
        };
        tn.start();
    });

    initPage();

    function initPage(){
        listwrap.page = 0; //当前显示第几页left:700px;
        var ul = SinaEx.createNode('<ul class="featured-tag-list" style="display:none;">'
            +getHtmlByPage(1)+'</ul>');
        listwrap.appendChild(ul);
    }

    function getHtmlByPage(pagenum){
        if(pagenum>=PAGES)pagenum = 0;//trace(pagenum);
        var start = pagenum*PERPAGE,
            datai,
            h = '';
        for(var i=0; i<PERPAGE; i++){
            datai = data[start+i];
            h += '<li>'+
                '<a class="img" href="'+$_GLOBAL.qingURL+'tag/'+datai.tag+'" onclick="v7sendLog(\''+
                    LOGCODE+'\');return true;" target="_blank">' +
                    '<img src="'+datai.pic+'" alt="" />' +
                    '<div class="tag_info">' +
                        '<h4>'+datai.tag+'</h4>' +
                        '<p>'+datai.title+'</p>' +
                    '</div>' +
                '</a>' +
            '</li>';
        }
        return h;
    }

});
