/**
 * @fileoverview 博客首页 看电影组件
 * @author wujian|wujian@staff.sina.com.cn
 *
 */
$import("lib/component/class/registComp.js");
$import("lib/component/extend/comp_dynamic.js");
$import("lib/checkAuthor.js");
$import("sina/ui/dialog/windowDialog.js");
$import("sina/utils/io/jsload.js");
$import("sina/core/string/expand.js");
$import("sina/core/string/collapse.js");

$import("sina/core/string/byteLength.js");
$import("sina/ui/template.js");

$import("lib/interface.js");
$import("lib/checkAuthor.js");
$import("lib/msg/componentMSG.js");

$registComp(121, {

        /*
         * 博主看过的影视（评价过的影视）接口
         */
        "getCommList": new Interface("http://control.blog.sina.com.cn/riaapi/film/get_my_filmcommentnew.php", "jsload")
        /**
         * 博主删除不希望显示的评价 接口
         */, "delComm": new Interface("http://control.blog.sina.com.cn/riaapi/film/hide_my_film.php", "jsload")
        /*
         * 载入影评数据
         */, "load": function () {//alert("load")
            this.getCommList.request({
                GET: {
                    "uid": scope.$uid
                }, onSuccess: Core.Function.bind2(function (oData) {
                    trace("---------ok----------");
                    // 缓存当前的数据
                    this.cacheData = oData;
                    this["render_" + this.size](this.cacheData);
                }, this), onError: Core.Function.bind2(function (oData) {
                    trace("---------error----------");

                    this.showError(oData.code);

                }, this), onFail: Core.Function.bind2(function (oData) {
                    this.showError($SYSMSG.A80101);
                }, this)
            });
            if (scope.$pageid == "pageSetM" && this.setManage) {
                this.setManage();
            }
        }
        /*
         * 按 210 像素宽度渲染看电影组件
         */, "render_210": function (oData) {
            //alert(210)
            oData = oData || this.cacheData;
            this.parseToHTML(oData, 6);
        }
        /*
         * 按 510 像素宽度渲染看电影组件
         */, "render_510": function (oData) {
            //alert(510)
            oData = oData || this.cacheData;
            this.parseToHTML(oData, 5);
        }
        /*
         * 按 730 像素宽度渲染看电影组件
         */, "render_730": function (oData) {
            //alert(730)
            oData = oData || this.cacheData;
            this.parseToHTML(oData, 7);
        },

        /**
         * 看电影组件由 Json 转为 HTML
         * @param {Object} oData
         * @param {Object} len 限制长度
         */
        "parseToHTML": function (oData, len) {
            //oData格式 data:{filmlist:[{},{}],cnt:12}
            var newData = oData, //count=newData.cnt,
                oData = newData.filmlist;

            // 如果留言数为 0，直接显示空文案
            if (oData.length == 0) {
                this.showEmpty();
            } else {
                Lib.checkAuthor();
                var html = [], temp = "";

                len = len > oData.length ? oData.length : len;

                for (var i = 0; i < len; i++) {
                    var type = oData[i].type == 2 ? "movie" : "tv";
                    //var url='http://control.blog.sina.com.cn/admin/article/article_add.php?film_id='+oData[i].filmid+'&type='+type;
                    var url = "http://blog.sina.com.cn/s/blog_" + oData[i].blogid + ".html";
                    /*	var btn="";
                     if($isAdmin){//判断是否为博主
                     btn=['<span class="del" style="display:none;" onclick="window.hideMyComm(\''+oData[i].filmid+'\',\''+oData[i].type+'\')"',
                     ' onmouseover="this.style.display = \'\';"'+' onmouseout="this.style.display = \'none\';"',
                     '>',
                     '<img height="15" align="absmiddle" width="15" title="隐藏"  alt="隐藏" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon6">',
                     '</span>'].join("");
                     }*/

                    temp = ['<li id="filmComm_' + oData[i].filmid + '"><div class="smallPic"><a href="' + url + '"',
                        //'onmouseover="if(this.parentNode.lastChild.className==\'del\'){this.parentNode.lastChild.style.display=\'\';}" ',
                        //'onmouseout="if(this.parentNode.lastChild.className==\'del\'){this.parentNode.lastChild.style.display=\'none\';}"',
                            ' target="_blank" title="' + oData[i].title + '">',
                            '<img src="' + oData[i].imgurl + '" alt="' + oData[i].title + '" title="' + oData[i].title + '" width="90" height="134" /></a>',
                        //btn,
                        '</div>',
                        //'<div class="albumlisttxt"><a href="'+url+'" title="'+oData[i].title+'" target="_blank">'+oData[i].title+'</a></div>',
                        '</li>'].join("");

                    html.push(temp);
                }

                var allTips = '<div class="morelink"><a href="http://blog.sina.com.cn/s/article_film_' + scope.$uid + '_1.html" target="_blank">查看全部&gt;&gt;</a></div>';

                var innerHTML = ['<div class="moviesbox">', //'<div class="SG_tag">',
                    //'<ul><li class="current"><span><strong>看过的</strong></span><span class="tagR"></span></li>', 
                    //'<li><span><a href="#">近期热播</a></span><span class="tagR"></span></li>',
                    //'</ul></div>',
                    '<ul class="list">', html.join(""), '</ul>', allTips, '</div>'].join("");
                // alert(len)

                //this.setContent(innerHTML);
                this.getContent().innerHTML = (!$isAdmin ? '<div class="cloneWidget" style="padding:0 0 10px;">' : '') + innerHTML + ($isAdmin ? '' : '<div class="cloneLink"><a title="添加到我的博客" href="#" onclick="' + 'Lib.Component.clone(' + this.compId + ', ' + this.size + ');return false;"><img alt="" src="http://' + 'simg.sinajs.cn/blog7style/images/widget/add1.gif" /> 添加到我的博客</a></div></div>');

                var that = this;
                /**
                 * 设置 window.hideMyComm函数
                 * @param {Object} uid  默认博主的 不用传入
                 * @param {Object} filmid
                 * @param {Object} type
                 */
                /*	window.hideMyComm=function(filmid,type){
                 winDialog.confirm("隐藏此影评？", {
                 funcOk : function () {
                 var ele=$E("filmComm_"+filmid);

                 ele.parentNode.removeChild(ele);
                 ele=null;
                 that.delComm.request({
                 GET: {
                 "uid": scope.$uid,
                 "filmid":filmid,
                 "type":type
                 }
                 ,onSuccess	: Core.Function.bind2(function(oData){

                 this.load();
                 }, that)
                 ,onError	: Core.Function.bind2(function(oData){
                 if(oData.code == "A00101"){
                 this.setContent($SYSMSG[oData.code]);
                 }else{
                 this.showError(oData.code);
                 }
                 }, that)
                 ,onFail	: Core.Function.bind2(function(oData){
                 this.showError($SYSMSG.A80101);
                 }, that)
                 });
                 }
                 ,"textOk"		: "是"
                 ,"textCancel"	: "否"
                 ,"icon"			: "04"
                 });

                 }	*/
            }

        }
        /*
         * 数据为 0 的文案
         */, "showEmpty": function () {
            Lib.checkAuthor();
            if ($isAdmin) {
                /*var html=['<div class="comTip">',
                 '<p>你还没有写过影评，<br><span>现在就去<a title="" href="http://data.ent.sina.com.cn/movie/index.html" target="_blank">电影库</a>搜电影吧！</span></p>',
                 '</div>'].join("");*/
                var html = ['<div class="comTip">',
                    '<p>你还没有写过影评，<br><span><a title="" href="http://control.blog.sina.com.cn/admin/article/article_add.php?film_id=9383&type=movie" target="_blank">现在就写一篇《阿凡达》的影评</a>体验一下吧！</span></p>',
                    '</div>'].join("");
            } else {
                var html = ['<div class="comTip">', '<p>博主还没有写过影评</p>', '</div>'].join("");
            }

            innerHTML = ['<div class="moviesbox">', //'<div class="SG_tag">',
                // '<ul><li class="current"><span><strong>看过的</strong></span><span class="tagR"></span></li>',
                //'<li><span><a href="#">近期热播</a></span><span class="tagR"></span></li>',
                // '</ul></div>',

                html, '</div>'].join("");
            innerHTML = (!$isAdmin ? '<div class="cloneWidget" style="padding:0 0 10px;">' : '') + innerHTML + ($isAdmin ? '' : '<div class="cloneLink"><a title="添加到我的博客" href="#" onclick="' + 'Lib.Component.clone(' + this.compId + ', ' + this.size + ');return false;"><img alt="" src="http://' + 'simg.sinajs.cn/blog7style/images/widget/add1.gif" /> 添加到我的博客</a></div></div>');
            this.setContent(innerHTML);
        }
    }, 'dynamic');
