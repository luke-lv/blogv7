// 这个是新版编辑器的引导浮层
$import("sina/ui/panel.js");
$import("sina/ui/dialog/backShadow.js");
$import('sina/core/events/addEvent.js');
$import('sina/utils/cookie/getCookie.js');
$import('sina/utils/cookie/setCookie.js');

$registJob("newEditorGuideLayer", function(){

    var noCookie = Utils.Cookie.getCookie('new_editor_guide_'+scope.$uid) != 1;

    if (noCookie && (articleEditorCFG && articleEditorCFG.articleStatus == 1)){
        var articleTitle = $E('article_title');
        if (articleTitle){
            articleTitle.style.visibility = 'hidden';
            var pNode = articleTitle.parentNode;
            var spanTit = pNode.children[0];
            spanTit && (spanTit.style.visibility = 'hidden');
        }

        var editor = $E('editor');
        if (editor){
            var pNode = editor.parentNode;
            var spanEdt = pNode.children[0];
            pNode.style.height = '700px';
            spanEdt && (spanEdt.style.visibility = 'hidden');
        }

        var myPanel=new Ui.Panel(),
            template='<div id=#{container} class="guide_img"><a id="#{close}" href="javascript:void(0);" class="guide_btn" title="关闭"></a></div>';
        var myShadow = new BackShadow(0.6);

        myPanel.setTemplate('<div id="#{panel}">'+template+'</div>');
        myPanel.entity.style.zIndex = 1025;
        myPanel.entity.style.marginLeft = '-500px';
        myPanel.entity.style.width = '1000px';

        var img = new Image();
        img.onload = function(){
            // ie6不能把图片放到按钮后面
            myPanel.nodes.container.insertBefore(img, myPanel.nodes.close);
            // myPanel.nodes.container.appendChild(img);

            myShadow.show();
            myPanel.show();

            myPanel.entity.style.left = '50%';
            myPanel.entity.style.top = '52px';

            if (myPanel.nodes.close){
                Core.Events.addEvent(myPanel.nodes.close, function(){
                    pNode.style.height = '';
                    myPanel.hidden();
                    myShadow.hidden();
                    articleTitle && (articleTitle.style.visibility = 'visible');
                    spanTit && (spanTit.style.visibility = 'visible');
                    spanEdt && (spanEdt.style.visibility = 'visible');
                    Utils.Cookie.setCookie('new_editor_guide_'+scope.$uid, 1, 24*365*5);
                    return false;
                });
            }
        }
        if ($IE6){
            img.src = 'http://simg.sinajs.cn/blog7style/images/blog_editor/guide_img.gif';
        }else{
            img.src = 'http://simg.sinajs.cn/blog7style/images/blog_editor/guide_img.png';
        }

    }

});
