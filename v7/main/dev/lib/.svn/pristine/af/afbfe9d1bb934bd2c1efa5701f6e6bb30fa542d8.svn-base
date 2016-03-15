/**
 * @fileInfo   托盘消息面板用到的公用方法
 * @author     yongsheng4@staff.sina.com.cn
 * @update     2013-04-10
 */
Lib.sysmsg = Lib.sysmsg || {};
Lib.sysmsg.utils = {
    //获取用户头像,uid用户uid，name用户昵称，size图片尺寸，默认为50，返回品种好的img标签
    getUserPic: function(uid, name, size,sendlog) {
        var size = size || 50;
        var url = this.getUserPicUrl(uid, size);
        var img = '<img src="' + url + '" width="' + size + '" height="' + size + '" alt="' + name + '" title="' + name + '"' + '/>';
        var log = sendlog ? 'onclick="v7sendLog(\''+ sendlog +'\')"' : "";
        img = '<a href="' + this.getUserBlogUrl(uid) + '" '+ log +' target="_blank">' + img + '</a>';
        return img;
    },
    //获取用户头像地址，uid用户uid，size图片尺寸，默认为50
    getUserPicUrl: function(uid, size) {
        var size = size || 50;
        var n = parseInt(uid) % 8 + 1;
        return "http://portrait" + n + ".sinaimg.cn/" + uid + "/blog/" + size;
    },
    //获取用户博客地址
    getUserBlogUrl: function(uid) {
        return "http://blog.sina.com.cn/u/" + uid;
    },
    //获取博文地址
    getAticleUrl: function(article_id) {
        return 'http://blog.sina.com.cn/s/blog_' + article_id + '.html';
    },
    //获取图片地址
    getImgUrl: function(img_id) {
        return 'http://photo.blog.sina.com.cn/photo/' + img_id;
    },
    //获取相册文地址
    getPhotosUrl: function(photo_id, uid) {
        return 'http://photo.blog.sina.com.cn/category/u/' + uid + '/s/' + photo_id;
    },
    //获取vip图标
    getVipIcon: function(index) {
        var vipicon = {
            1: {
                icon: "SG_icon146",
                info: "新浪个人认证"
            },
            2: {
                icon: "SG_icon147",
                info: "新浪机构认证"
            }
        };
        var index = index || 1;
        var pic = '<a href="http://blog.sina.com.cn/v/verify" class="vip" target="_blank"><img class="SG_icon ' + vipicon[index].icon + '" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="13" title="' + vipicon[index].info + '" alt="' + vipicon[index].info + '" align="absmiddle" /></a>'
        return pic;
    },
    //生成随机数
    getRandom: function() {
        return (new Date()).getTime() + Math.random().toString().replace("0.", "");
    },
    //时间格式化
    getTime: function(time) {
        // var date = new Date(time);
        // var year = date.getFullYear();
        // var month = date.getMonth()+1;
        // var day = date.getDate();
        // month = month < 10 ? "0"+month : month;
        // day = day < 10 ? "0"+ day : day;
        //return year + "-" + month + "-" + day;
        return time;
    },
    //获取字符长度
    getLen: function(a) {
        if (!a){ 
            return 0;
        }
        var b = a.match(/[^\x00-\xff]/g);
        return a.length + (b ? b.length : 0);
    },
    //字符截断+...
    strTruncate: function(str, len, suffix) {
        str = str || "";
        if (typeof suffix == 'undefined') {
            suffix = "...";
        };
        return (this.getLen(str) > len) ? (this.truncete(str,len) + suffix) : str;

    },
    //字符截断
    truncete:function (b, c) {
        var d = b.replace(/\*/g, " ").replace(/[^\x00-\xff]/g, "**");
            b = b.slice(0, d.slice(0, c).replace(/\*\*/g, " ").replace(/\*/g, "").length);
            this.getLen(b) > c && c > 0 && (b = b.slice(0, b.length - 1));
            return b
    },
    //获取查看全部的链接地址tab大分类，type小分类;
    getAllLinkUrl: function(tab, type) {
        var url = {
            "content": { //内容
                article: "http://i.blog.sina.com.cn/blogprofile/index.php?com=1&type=all", //"http://i.blog.sina.com.cn/blogprofile/index.php?com=1&type=article",
                photo: "http://i.blog.sina.com.cn/blogprofile/index.php?com=1&type=all", //"http://i.blog.sina.com.cn/blogprofile/index.php?com=1&type=photo",
                like: "http://i.blog.sina.com.cn/blogprofile/index.php?com=1&type=all", //"http://i.blog.sina.com.cn/blogprofile/index.php?com=1&type=like",
                reprinted: "http://i.blog.sina.com.cn/blogprofile/index.php?com=1&type=all"
            },
            "remind": { //提醒
                attention: "http://i.blog.sina.com.cn/blog_rebuild/profile/controllers/notelist.php?action=profilenotice",
                slip: "http://control.blog.sina.com.cn/blogprofile/profilepaperlist.php?type=1",
                leave: "http://i.blog.sina.com.cn/blogprofile/wall.php",
                invite: "http://control.blog.sina.com.cn/blogprofile/profileinvitelist.php",
                notice: "http://i.blog.sina.com.cn//blog_rebuild/profile/controllers/notelist.php?action=profilesysnote",
                accept: "http://i.blog.sina.com.cn/blog_rebuild/profile/controllers/notelist.php?action=profilenotice"
            },
            "attitude": { //态度
                like: "http://i.blog.sina.com.cn/profilelist/profilelikelist.php",
                comment: "http://i.blog.sina.com.cn/blogprofile/profilecommlist.php?type=1",
                photocomment:"http://i.blog.sina.com.cn/blogprofile/profilecommlist.php?type=2",
                reply:"http://i.blog.sina.com.cn/blogprofile/profilereplylist.php",
                collect: "http://i.blog.sina.com.cn/blog_rebuild/profile/controllers/notelist.php?action=profilenotice",
                reprinted: "http://i.blog.sina.com.cn/blog_rebuild/profile/controllers/notelist.php?action=profilenotice"
            }
        }
        return url[tab][type] || "";
    }
}