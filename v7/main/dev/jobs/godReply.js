/**
 * @Fileoverview 神回复
 * @author jiangwei5@staff.sina.com.cn
 * @date 2014/08/27
 */
$import("lib/panel.js");
$import("lib/commentv2/post.js");
$import("lib/checkAuthor.js");
$import("lib/login/ui.js");
$import("sina/core/dom/getElementsByAttr.js");
$import("sina/core/events/addEvent.js");
$import('sina/core/events/getEventTarget.js');
$import('sina/core/events/stopDefaultEvent.js');
$import("sina/core/dom/addClass.js");
$import("sina/core/dom/removeClass.js");
$import("sina/core/dom/getStyle.js");
$import("sina/core/dom/setStyle.js");
$import("sina/core/dom/getXY.js");
$import("sina/core/system/winSize.js");
$import("sina/utils/tpl.js");

$registJob('godReply', function() {
    var getElementsByAttr = Core.Dom.getElementsByAttr;
    var addEvent = Core.Events.addEvent;
    var getEventTarget = Core.Events.getEventTarget;
    var stopDefaultEvent = Core.Events.stopDefaultEvent;
    var winSize = Core.System.winSize;
    var setStyle = Core.Dom.setStyle;
    var Panel = Lib.Panel;
    
    var root = $E('sinablogbody');
    var faceImgPath = 'http://simg.sinajs.cn/blog7style/images/common/godreply/';
    var godReply = {
        oPanel: new Panel(),//操作面板 神回复按钮及表情列表层
        fPanel: new Panel(),//表情展示层
        commentPost: new CommentV2.Post(),
        faceImgs: [{
                code: '0101',
                img: faceImgPath + 'E___0101GD00SIGT.gif',
                title: '贱人就是矫情'
            },{
                code: '0102',
                img: faceImgPath + 'E___0102GD00SIGT.gif',
                title: '人艰不拆'
            },{
                code: '0103',
                img: faceImgPath + 'E___0103GD00SIGT.gif',
                title: '朕知道了'
            },{
                code: '0104',
                img: faceImgPath + 'E___0104GD00SIGT.gif',
                title: '不明觉厉'
            },{
                code: '0105',
                img: faceImgPath + 'E___0105GD00SIGT.gif',
                title: '这真是极好的'
            },{
                code: '0106',
                img: faceImgPath + 'E___0106GD00SIGT.gif',
                title: '也真是醉了'
            },{
                code: '0107',
                img: faceImgPath + 'E___0107GD00SIGT.gif',
                title: '点个赞'
            },{
                code: '0108',
                img: faceImgPath + 'E___0108GD00SIGT.gif',
                title: '你那么萌你家人造吗'
            },{
                code: '0109',
                img: faceImgPath + 'E___0109GD00SIGT.gif',
                title: '涨姿势'
            }
        ],
        init: function (){
            var self = this;
            self.commentPost.articleid = scope.$articleid;
            self.initOpanel();//初始化右侧神回复按钮操作面板
            self.initFopanel();//初始化表情浮层面板
        },
        initOpanel: function (){
            var self = this;
            var panel = self.oPanel;
            var template = self.getOpanelTpl();
            panel.setTemplate(template);

            var btnWidth = 58;
            var btnHeight = 58;
            var templateWidth = parseInt(Core.Dom.getStyle(panel.entity,'width'), 10) || 308;
            var marginLeft = 5;
            var resizeT;
            var btn = getElementsByAttr(panel.entity, 'node-data', 'btn-golgreply')[0];
            var replyConlist = getElementsByAttr(panel.entity, 'node-data', 'reply-conlist')[0];
            panel.setFixed(true);
            resize();
            panel.showList = function (){
                replyConlist.style.display = "";
            };
            panel.hideList = function (){
                replyConlist.style.display = "none";
            };
            function resize() {
                if (resizeT) clearTimeout(resizeT);
                resizeT = setTimeout(function() {
                    var ws = winSize();
                    var rootOffset = Core.Dom.getXY(root);
                    var rootWidth = parseInt(Core.Dom.getStyle(root,'width'));
                    var left = Math.min(ws.width - templateWidth - btnWidth - 20, rootOffset[0] + rootWidth + marginLeft - templateWidth);
                    var top = Math.max(ws.height - 260 - btnHeight, 80);
                    panel.setPosition(left, top);
                },
                300);
            }
            addEvent(btn.parentNode, function (){
                btn.style.display = "";
            }, 'mouseover');
            addEvent(btn.parentNode, function (){
                btn.style.display = "none";
            }, 'mouseout');
            addEvent(btn.parentNode, function (){
                replyConlist.style.display = replyConlist.style.display != 'none' ? 'none' : '';
            });
            addEvent(replyConlist, function (){
                var target = getEventTarget();
                var tagName = target.tagName.toLocaleLowerCase();
                if(tagName == 'img'){
                    target = target.parentNode;
                }
                var num = parseInt(target.getAttribute("data-num"));
                if(num >= 0){
                    stopDefaultEvent();
                    panel.currTar ? Core.Dom.removeClass(panel.currTar, "click") : '';
                    Core.Dom.addClass(target, "click");
                    panel.currTar = target;
                    self.cfaceData = self.faceImgs[num];
                    self.fPanel.show();
                }
            });
            addEvent(window, resize, 'resize');
            addEvent(window, resize, 'scroll');
            panel.show();
        },
        initFopanel: function (){
            var self = this;
            var panel = self.fPanel;
            var template = '<div class="godreply_show" id="#{panel}" style="z-index:1001">\
                               <div class="reply_pic_l" node-data="facebox">\
                                 <img node-data="faceimg" title="" alt="" src="">\
                               </div>\
                               <div class="btn_group" node-data="action" style="display:none;"><a href="#" class="a1" action-type="ok">发表</a><a href="#" class="a2" action-type="cancel">取消</a></div>\
                               <div class="jgimg" node-data="success" style="display:none;"><img src="http://simg.sinajs.cn/blog7style/images/common/godreply/jf.gif"><div class="txt">发表成功</div></div>\
                           </div>';
            panel.noIframe = true;
            panel.setTemplate(template);
            panel.setFixed(true);
            
            var entity = panel.entity;
            var facebox = Core.Dom.getElementsByAttr(entity, 'node-data', 'facebox')[0];
            var faceImg = Core.Dom.getElementsByAttr(entity, 'node-data', 'faceimg')[0];
            var btns = Core.Dom.getElementsByAttr(entity, 'node-data', 'action')[0];
            var successEl = Core.Dom.getElementsByAttr(entity, 'node-data', 'success')[0];
            var imgWidth = 460;
            var imgHeight = 230;
            var resizeT;
            
            resize();
            function resize() {
                if (resizeT) clearTimeout(resizeT);
                resizeT = setTimeout(function() {
                    var ws = winSize();
                    var left = parseInt((ws.width - imgWidth)/2 - 85, 10);
                    var top = parseInt(ws.height/2 - imgHeight, 10);
                    panel.setPosition(left, top);
                },
                300);
            }
            
            panel._show = panel.show;
            panel.show = function (){
                var data = self.cfaceData;
                faceImg.title = data.title;
                faceImg.alt = data.title;
                faceImg.src = data.img;
                // successEl.style.display = "none";
                successEl.style.visibility = "hidden";
                btns.style.display = "none";
                facebox.style.display = "";
                setStyle(entity,"background", "none");
                var val = 0;
                var d = 2;
                (function(){
                    var ws = winSize();
                    var w = imgWidth*d;
                    var h = imgHeight*d;
                    var left = parseInt((ws.width - w)/2 - 85, 10);
                    var top = parseInt(ws.height/2 - h, 10);
                    faceImg.width = w;
                    faceImg.height = h;
                    panel.setPosition(left, top);
                    setStyle(entity,"width", w);
                    setStyle(entity,"opacity", val);
                    val += 0.1;
                    d -= 0.1;
                    if (val < 1) {
                        setTimeout(arguments.callee, 20)
                    }else{
                        resize();
                        setStyle(entity,"opacity", 1);
                        setStyle(entity,"background", "");
                        btns.style.display = "";
                        self.domShake($E("sinabloga"));
                    }
                })();
                panel._show();
            };

            addEvent(btns, function (){
                var target = getEventTarget();
                var type = target.getAttribute('action-type');
                stopDefaultEvent();
                if(type == 'ok'){
                    Lib.checkAuthor();
                    if ($isLogin) {
                        self.submit();
                    }else{
                        var Login = new Lib.Login.Ui();
                        Login.login(function(){
                            scope.blogOpener.showDialog(function() {
                                self.submit();
                            });
                        },false,"referer:"+location.hostname+location.pathname+",func:godFace");
                    }
                    panel.hide();
                }else if(type == 'cancel'){
                    panel.hide();
                }
            });
            addEvent(window, resize, 'resize');
            addEvent(window, resize, 'scroll');
            
            //评论请求后处理
            self.commentPost.onSuccess = function(){
                self.oPanel.hideList();//隐藏表情列表
                //神评论成功后 显示积分-1效果
                btns.style.display = "none";
                facebox.style.display = "none";
                successEl.style.display = "";
                successEl.style.visibility = "";
                panel._show();
                var val = 1;
                (function (){
                    setStyle(entity,"opacity", val);
                    val -= 0.1;
                    if(val > 0){
                        setTimeout(arguments.callee, 100)
                    }else{
                        panel.hide();
                        setStyle(entity,"opacity", '');
                    }
                })();
            };
            
            self.commentPost.onError = function(){
                //
            };
        },
        getOpanelTpl: function (){
            var faceImgs = this.faceImgs;
            var liTpl = '<li title="{title}" data-num="{i}"><img src="{img}" title="{title}" alt="{title}"/></li>'
            var facelis = '';
            for(var i = 0; i < 9; i++){
                var item = faceImgs[i];
                if(item){
                    item.i = i;
                    facelis += Utils.tpl(liTpl, item);
                }
            }
            var template = '<div class="godreply" id="#{panel}" style="z-index:999;">\
                              <div class="btn"><span node-data="btn-golgreply" style="display:none;">神回复</span></div>\
                              <div class="reply_con" node-data="reply-conlist" style="display:none;">\
                                <div class="txt">神回复，只要<span>1积分</span>就可以了哦</div>\
                                <ul class="reply_pic_s">'+facelis+'</ul>\
                              </div>\
                            </div>';
            
            return template;
        },
        //抖动dom
        domShake: function (el){
            var d = 20;//最大幅度
            var t = 1;//方向
            var s = 0.5;
            var c = 0;
            (function (){
                var l = 0;
                var r = 0;
                switch(t){
                    case 1:
                        c += s;
                        c > 1 ? c = 1: '';
                        l = d*c;
                        if(c == 1){
                            t = 2;
                        }
                        break;
                    case 2:
                        c -= s;
                        c < 0 ? c = 0 : '';
                        l = c;
                        if(c == 0){
                            t = 3;
                            d -= 2;
                        }
                        break;
                    case 3:
                        c += s;
                        c > 1 ? c = 1: '';
                        r = c;
                        if(c == 1){
                            t = 4;
                        }
                        break;
                    case 4:
                        r = --c;
                        c < 0 ? c = 0 : '';
                        if(c == 0){
                            t = 1;
                            d -= 2;
                        }
                        break;
                    default:
                        break;
                }
                
                if(d > 0){
                    setStyle(el,"padding", "0 "+r+"px 0 "+l+"px");
                    setTimeout(arguments.callee, 1);
                }else{
                    setStyle(el,"padding", "0");
                }            
            })();
        },
        //提交评论
        submit: function (){
            var self = this;
            var fdata = self.cfaceData;
            var data = {
                god: 1,
                comment: '[emoticons=E___'+fdata.code+'GD00SIG]'+fdata.title+'[/emoticons]',//self.face.data.code,
                login_name: "",
                login_pass: "",
                check: "",
                comment_anonyous : "新浪网友",
                anonymity        : false,
                // is_mobile: +is_mobile,
                is_t             : 0 //默认不分享到微博
            };
            self.commentPost.post(data);
        }
    };
    
    godReply.init();
});