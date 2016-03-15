/** 
 * @fileoverview 评论审核展示
 * @author gaolei | gaolei2@staff.sina.com.cn
 */
$import("lib/commentv2/_comment.js");
CommentV2.CommentForCheck = Core.Class.create();
CommentV2.CommentForCheck.prototype = {
	initialize:function(opt){
		this._opt = opt;
		if(scope.$commentlistIsReady){
			this.load();
		}else{
			Lib.Listener.on({
	            name     : "commentlist-isready",
	            callBack : this.load,
	            scope    : this
	        });
        }
	},
	//获取参数[todo]通过url获取参数
	getParam:function() {
		return this._opt;
	},
	//获取评论数据
	load:function() {
		if($E("cmt_" + this._opt.cms_id)){
			this.setHashPos();
			return;
		}
		var param = this.getParam();
		this.getInterface = new Interface("http://control.blog.sina.com.cn/blog_rebuild/riaapi/profile/note/getCms.php", "jsload");
		this.getInterface.request({
            GET: param,
            onSuccess: function(_data){
             	this.rander(_data);
            }.bind2(this),
            onError: function(_data){
                
            },
            onFail: function(){
            }
        });
	},
	//渲染
	rander:function(item) {
		var $container = $E('article_comment_list');
		var comment = new CommentV2.Add();
        item.action_data = Utils.Json.flatten({
            commentid: item.id,
            articleid: scope.$articleid,
            // cms_body: item.cms_body,
            fromProduct: item.fromProduct,
            comm_uid: item.comm_uid,
            uname: item.nick_name,
            ulink: item.ulink
        });
        item.uname = item.nick_name;
        item.action_data = encodeURIComponent(item.action_data);
        if (item.fromProduct == "weibo"){
            item.from = '<img height="15" align="absmiddle" width="15" class="SG_icon SG_icon51" src="http://simg.sinajs.cn/images/common/sg_trans.gif">'
        }
        var $li = comment.render(item);
        $container.insertBefore($li, $container.firstChild);
        this.setHashPos();
	},
	//定位位置
	setHashPos:function() {
		var oldhash = window.location.hash;
			window.location.hash = "cmt_" + this._opt.cms_id;
			//debugger;
			window.location.hash = oldhash;
	}
}