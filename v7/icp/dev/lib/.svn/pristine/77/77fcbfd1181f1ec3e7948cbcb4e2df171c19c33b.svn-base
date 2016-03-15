/**
 * @author guangtian| guangtian@staff.sina.com.cn
 * @date 2015/11/5
 * 图片验证码
 */
$import("sina/core/events/fireEvent.js");
$import("sina/Evter.js");
Lib.imgCheck = function() {
    this.imgSrc = "http://interface.blog.sina.com.cn/riaapi/checkwd_image.php?";
    this.fresh_chk = false;
    this.events = ['img_check_post'];
    this.init();
};

Lib.imgCheck.prototype = {
    init: function(){
        this.render();
        this.bindEvent();
    },
    render: function(){
        var html = [
            '<span>验证码：</span>',
            '<input type="text" style="width: 46px;" id="login_check" tabindex="4" onclick="return false;" />&nbsp;&nbsp;',
            '<a class="SG_linka" id="check_show">请点击后输入验证码</a>',
            '<img id="comment_check_img" align="absmiddle" style="display:none;" />&nbsp;&nbsp;',
            '<a id="comment_get_vcode" href="#" onclick="return false;">收听验证码</a>'
            ].join('');
        $E('checkCodeBox').innerHTML = html;
    },
    bindEvent: function(){
        var self = this;
        //点击提示文字，刷新验证码
        Core.Events.addEvent("check_show", function () {
            self.refresh();
        }, 'click');
        //鼠标按下验证码图片时，刷新验证码
        Core.Events.addEvent("comment_check_img", function(){
            self.fresh_chk = false;
            self.refresh();
        }, 'mousedown');
        //验证码输入框获得焦点时，刷新验证码
        Core.Events.addEvent("login_check", function(){
            self.refresh();
        }, 'focus');
        Core.Events.addEvent("commentArea", function(){
            self.refresh();
            //self.fresh_chk = true;
        }, 'focus');
        Core.Events.addEvent($E('login_check'), function(){
            Evter.fire('img_check_post');
        }, 'keydown');
    },
    refresh: function(){
        if (this.fresh_chk) {
            return;
        }
        $E("comment_check_img").src = this.imgSrc + new Date().valueOf();
        $E("comment_check_img").style.display = "inline";
        $E("check_show").style.display = "none";
        this.fresh_chk = true;
    },
    getValidate: function(){
        return Core.String.trim($E("login_check").value);
    }
}
