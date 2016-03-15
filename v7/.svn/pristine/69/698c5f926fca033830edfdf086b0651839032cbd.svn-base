/**
 * @author darkty2009
 * 修改自 blog7/jobs/privateSetting.js
 * update 2010-02-03	footprint setting added		by dcw1123
 * update 2010-09-29	by meichun1@
 */
$import("lib/interface.js");
$import("sina/core/events/addEvent.js");
$import("sina/utils/form/radio.js");
$import("jobs/resource.js");

$registJob("power", function(){
    var setting_form = $E("blog_setting_form");
    var submit_btn = $E("key_save_btn");
    var cancel_btn = $E("key_cancel_btn");
    
    var _flag_set = false;
    var _flag_wall = false;
    
    
    function init_setting(){
        var inter = new Interface("http://control.blog.sina.com.cn/riaapi/conf/get_user_private.php?version=7", "jsload");
        inter.request({
            GET: {
                uid: $UID
            },
            onSuccess: function(data){
                setting_form.comment_key.value = data.cms;//评论开关初始化
                setting_form.note_key.value = data.pageset;//纸条接收初始化
                setting_form.friend_key.value = data.invitationset;//好友邀请初始化
                setting_form.trash_key.value = data.spamcms;//是否设置垃圾过滤初始化
                Utils.Form.Radio.set(setting_form.quote_key, data.quote);//博文转载初始化 
                Utils.Form.Radio.set(setting_form.private_key, data.isprivate);//访问设置 初始化
                Utils.Form.Radio.set(setting_form.foot_key, data.foot);//访问足迹初始化
            },
            onError: function(result){
                showError(result.code);
            }
        });
    }
    function init_wall(){
        var inter = new Interface("http://wall.cws.api.sina.com.cn/get_privacy.php?version=7", "jsload");
        inter.request({
            onSuccess: function(data){
            
                setting_form.wall_key.value = data.value; //留言板隐私 初始化
            },
            onError: function(result){
                showError(result.code);
            }
        });
    }
    
    Core.Events.addEvent(submit_btn, save);
    function save(){
        save_setting();
        save_wall();
    }
    function save_setting(){
        var inter_set = new Interface("http://control.blog.sina.com.cn/riaapi/conf/update_user_private.php", "ijax");
        var option = {
            "cms": $E('comment_key_id').value,//评论开关 保存数据
            "pageset": $E("note_key_id").value, //纸条接收设置 保存数据
            "invitationset": $E("friend_key_id").value,//好友邀请设置 保存数据
            "spamcms": $E("trash_key_id").value,//是否设置垃圾过滤 保存数据
            "quote": Utils.Form.Radio.get(setting_form.quote_key),//博文转载设置  保存数据
            "foot": Utils.Form.Radio.get(setting_form.foot_key), //是否留脚印 保存数据
            "isprivate": Utils.Form.Radio.get(setting_form.private_key)//访问设置 保存数据
        };
        var key_array = [];
        var value_array = [];
        for (var i in option) {
            key_array.push(i);
            value_array.push(option[i]);
        }
        inter_set.request({
            POST: {
                uid: $UID,
                privatekey: key_array.join(","),
                privatevalue: value_array.join(",")
            },
            onSuccess: function(){
                _flag_set = true;
                
                if (_flag_set && _flag_wall) 
                    save_ok();
            },
            onError: function(result){
                showError(result.code);
            }
        });
    }
    function save_wall(){
        var inter_wall = new Interface("http://wall.cws.api.sina.com.cn/set_privacy.php", "jsload");
        inter_wall.request({
            GET: {
                value: $E("wall_key_id").value //留言板隐私 保存数据
            },
            onSuccess: function(){
                _flag_wall = true;
                if (_flag_set && _flag_wall) 
                    save_ok();
            },
            onError: function(result){
                showError(result.code);
            }
        });
    }
    function save_ok(){
        winDialog.alert($RESOURCE['set_ok'], {
            icon: "03"
        });
        _flag_set = false;
        _flag_wall = false;
    }
    init_setting();
    init_wall();
    
});
