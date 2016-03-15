/** 
 * @fileoverview 长微博工具 贴链接
 * @author Book | liming9@staff.sina.com.cn
 * @version 1 | 2012-03-26
 */
$import("lib/dialogConfig.js");
$import("lib/winDialogEx.js");
$import("sina/core/string/trim.js");
$import("sina/core/string/leftB.js");
$import("sina/utils/io/ajax.js");

var CWB = {
    dialog: null,
    posting: false,
    //博文id
    data: {}, //blogid, title, content
    //已经检查了多少次，每次2秒，检测5次算失败
    times: 0,
    timer: 0,
    picUrl: "",
    
    //刷新页面
    refresh: function(){
        window.location.href = 'http://control.blog.sina.com.cn/admin/article/changWeiBo.php';
    },
    
    //检查生成长微博图片是否生成成功
    checkPic: function(data){
        var _this = this;
        this.dialog = winDialog.alert(data.tips+"正在生成长微博图片。需等一小会，请不要关闭~", {
            funcClose: function(){_this.dialog=null},
            icon: "05"
        });
        this.dialog.nodes.linkOk.style.display = "none"; //产品说要把关闭按钮去掉
        this.data = data;
        this.times = 0;
        this.posting = false;
        setTimeout(function(){
            CWB.loopCheck(); //延迟2秒检查
        }, 2000);
    },
    
    //循环检测
    loopCheck: function(){
        if( this.times>5 ){
            this.picFail();
            return;
        }
        this.times++; //放在这里++，超过5次检测就会报错，无论请求回来没有
        
        if( this.posting ){ return }
        this.posting = true;
        var _this = this;
        Utils.Io.Ajax.request("http://control.blog.sina.com.cn/admin/article/changWeiBoGetPic.php", {
            POST: {
                blog_id: _this.data.blogid
            },
            returnType: "json",
            onComplete: function(result){
                if( !_this.posting ){ return } //说明请求已经被abort掉了
                
                if( result && result.code==="A00006" ){
                    
                    clearTimeout(_this.timer);
                    if(_this.dialog){_this.dialog.close();_this.dialog = null;}
                    setTimeout(function(){
                        var p, dialog, np, picUrl = result.data.picUrl;
                        dialog = winDialogEx.alert("成功生成长微博图片！", {
                            funcOk: function(){
                                _this.pubWeibo(); //picSuccess
                            },
                            //textCancel: '放弃',
                            textOk: '<img align="absmiddle" width="15" height="15" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon51">发布到新浪微博'
                        });
                        np = document.createElement("p");
                        np.className = "pic_link";
                        np.innerHTML = '<a target="_blank" href="'+picUrl+'">查看图片</a>';
                        p = dialog.nodes.linkOk.parentNode;
                        p.parentNode.insertBefore(np, p);
                        //p.firstChild.className = "SG_aBtn SG_aBtnB icoBtn";
                        _this.picUrl = picUrl;
                    }, 20);
                    
                }
                _this.posting = false;
            },
            onException: function(e){
                //trace("nima="+e);
                _this.picFail();
            }
        });
        
        this.timer = setTimeout(function(){
            _this.loopCheck();
        }, 2000);
    },
    
    //生成长微博图片失败
    picFail: function(){
        clearTimeout(this.timer);
        this.times = 0;
        this.posting = false;
        
        if(this.dialog){this.dialog.close();this.dialog = null;}
        var _this = this;
        winDialogEx.confirm("对不起，生成长微博图片失败！", {
            icon: "04",
            funcOk: function(){
                _this.reCheck();
            },
            textOk: "重新生成",
            textCancel: "放弃"
        });
    },
    
    //重试生成长微博图片失败
    reCheck: function(){
        this.loopCheck();
        var _this = this;
        this.dialog = winDialog.alert("正在生成长微博图片。需等一小会，请不要关闭~", {
            icon: "05",
            funcClose: function(){_this.dialog=null},
            textOk: "关闭"
        });
        this.dialog.nodes.linkOk.style.display = "none";
    },
    
    pubWeibo: function(){
        if (CWB._waitWeibo) {
            return;
        }
        CWB._waitWeibo = !0;
        var _this = this;
        var title = this.data.title,
            wbContent;
        if(title){title+="："}
        
        wbContent = Core.String.leftB(title+this.data.content, 180) //.replace(/[\?\=\%\&]/g,'') //ie8下这些字符会导致弹不出浮层
            + (this.data.blog_type==="qing" ? "... "+$_GLOBAL.qingURL+ this.data.uid +"/"+ this.data.blogid +".html?1"
                :"...文字版>> http://blog.sina.com.cn/s/blog_" + this.data.blogid + ".html?")
            + " （新浪长微博>> http://t.cn/zOXAaic）";
        Utils.Io.Ajax.request("http://control.blog.sina.com.cn/admin/article/changWeiBoSend.php", {
            POST: {
                blog_type: _this.data.blog_type||'blog',
                blog_id: _this.data.blogid,
                pic_path: _this.picUrl,
                weibo_result: wbContent
            },
            returnType: "json",
            onComplete: function(result){
                CWB._waitWeibo = null;
                if( result && result.code==="A00006" ){
                    winDialog.alert("长微博发布成功", {
                        icon: "03",
                        funcOk: _this.refresh,
                        funcClose: _this.refresh,
                        textOk: '确定'
                    });
                }else if( result && result.code==="A00323" ){
                    winDialog.alert(result.data&&result.data.msg, {
                        icon: "01",
                        textOk: '关闭'
                    });
                }else{
                    _this.pubFail(result&&result.data&&result.data.msg);
                }
            },
            onException: function(e){
                CWB._waitWeibo = null;
                //trace("nima="+e);
                _this.pubFail();
            }
        });
    },
    //发布失败
    pubFail: function(msg){
        var _this = this;
        winDialogEx.confirm(msg||"长微博发布失败", {
            funcOk: function(){
                _this.pubWeibo();
            },
            funcClose: _this.refresh,
            funcCancel: _this.refresh,
            textOk: '重试',
            textCancel: '放弃'
        });
    }
    
};
