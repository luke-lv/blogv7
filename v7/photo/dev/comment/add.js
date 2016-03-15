$import("sina/ui/template.js");

$import("comment/formatTime.js");

Comment.add = Core.Class.create();

Comment.add.prototype = {
    initialize: function(){
    
    },
    /**
     *
     * @param {Object} data
     *cid - 评论id
     uid - uid
     nick - 昵称
     photo_server - 头像服务器地址
     show_head - 头像模板
     show_name - 名字模板
     show_reply - 是否显示回复
     show_delete - 是否显示删除
     *comment - 评论内容
     time - 时间
     *
     */
    render: function(data){
        data.time = Comment.formatTime();

		
        if ($isLogin) {
            data.uid = $UID;
            data.photo_server = $UID % 8 + 1;
//			$E('commentloginM').style.display='';
        }
        else {
        }
        if ($isAdmin) {
            data.show_delete = "inline";
        }
        else {
            data.show_delete = "none";
        }
        data.show_reply = "none";
        if ($isLogin) {
            data.show_head = new Ui.Template(this.show_head).evaluate(data);
            data.show_name = new Ui.Template(this.show_name).evaluate(data);
        }
        else {
            data.show_head = '<img src="http://blogimg.sinajs.cn/v5images/default.gif" />';
            data.show_name = Core.String.encodeHTML(data.nick);
			data.nick = Core.String.encodeHTML(data.nick);
        }
        trace("****************");
        return new Ui.Template(this.struc).evaluate(data);
    },
    show_head: '\
		<a href="http://blog.sina.com.cn/u/#{uid}">\
			<img alt="#{nick}" src="http://portrait#{photo_server}.sinaimg.cn/#{uid}/blog/50" />\
		</a>\
	',
    show_name: '\
		<a href="http://blog.sina.com.cn/u/#{uid}">#{nick}</a>\
	',
    struc: '\
		<li id="cmt_#{cid}" class="SG_j_linedot1">\
			<table class="SG_revert_Left">\
				<tr>\
					<td>\
						#{show_head}\
						<!--<a href="http://blog.sina.com.cn/u/#{uid}">\
							<img alt="#{nick}" src="http://portrait#{photo_server}.sinaimg.cn/#{uid}/blog/50" />\
						</a>-->\
					</td>\
				</tr>\
			</table>\
			<div class="SG_revert_Cont">\
				<p>\
					<span class="SG_revert_Tit">\
						#{show_name}\
						<!--<a href="http://blog.sina.com.cn/u/#{uid}">#{nick}</a>-->\
					</span>\
					<span class="SG_revert_Time">\
						<em class="SG_txtc"><!-- 2009-08-30 18:29:12-->#{time}</em>\
						<a style="display:#{show_reply};" onclick="return false;" href="#" class="CP_a_fuc">\
							[<cite onclick="reply_comment(#{cid})">回复</cite>]\
						</a> \
						<a style="display:#{show_delete};" onclick="return false;" href="#" class="CP_a_fuc">\
							[<cite onclick="del_comment(#{cid})">删除</cite>]\
						</a>\
					</span>\
				</p>\
				<div class="SG_revert_Inner SG_txtb">#{comment}</div>\
			</div>\
		</li>\
	'
};
