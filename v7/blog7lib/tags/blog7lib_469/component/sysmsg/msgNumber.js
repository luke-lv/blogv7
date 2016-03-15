/**
 * @fileInfo   托盘消息面板消息数处理
 * @author     yongsheng4@staff.sina.com.cn
 * @update     2013-04-08
 */
$import("sina/core/class/create.js");
Lib.sysmsg = Lib.sysmsg || {};
Lib.sysmsg.MsgNumber = Core.Class.create();
Lib.sysmsg.MsgNumber.prototype = {
    initialize:function(data){
        this._initDom(data.el);
        this._showTips(data);
    },
    //节点初始化
    _initDom:function(els) {
        this._feed = els[0];
        this._mine = els[1];
        this._like = els[2];
    },
    _showTips:function(data) {
        if(data.feed>0){
            this._feed.style.display = "";
            this._feed.innerHTML = data.feed > 98 ? "99+" : data.feed;
        }else{
            this._hideTip(this._feed);
        }
        if(data.mine>0){
            this._mine.style.display = "";
            this._mine.innerHTML = data.mine > 98 ? "99+" : data.mine;
        }else{
            this._hideTip(this._mine);
        }  
        if(data.like>0){
            this._like.style.display = "";
            this._like.innerHTML = data.like > 98 ? "99+" : data.like;
        }else{
            this._hideTip(this._like);
        }   
    },
    _hideTip:function(el) {
        el.style.display = "none";
        el.innerHTML = 0;
    }

}
    
