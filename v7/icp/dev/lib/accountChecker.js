/** 
 * @fileoverview 漫游账号、高危账号处理的类
 * @author Book | liming9@staff.sina.com.cn
 * @version 1 | 2012-05-25
 */
$import("lib/lib.js");
$import("lib/IframeDialog.js");
$import("sina/core/class/create.js");
$import("sina/core/events/addEvent.js");
$import("sina/core/events/fireEvent.js");

Lib.AccountChecker = Core.Class.create();
Lib.AccountChecker.prototype = {
    initialize: function(ssoUrl){
        if(ssoUrl.indexOf('vt=1')>0 || ssoUrl.indexOf('vt=2')>0){
            this.showDialog(ssoUrl);
        }else{
            window.location.href = ssoUrl;
        }
    },
    showDialog: function(ssoUrl){
        document.domain = 'sina.com.cn';
        if(!window.accDialog){
            window.accDialog = new Lib.IframeDialog({
                url: ssoUrl,
                title: '账号安全',
                width: 300,
                height: 165
            });
            scope.accCallback = function(){
                window.accDialog.close();
            };
        }
        window.accDialog.show();
        var nodes = window.accDialog.dialog.nodes;
        var content = nodes.content;
        content.firstChild.style.marginLeft = '25px';
        nodes.btnClose.style.display = "none";
        var p = document.createElement('p');
        p.style.lineHeight = '70px';
        p.innerHTML = '　　为了您的账号安全，请输入验证码后再进行操作';
        content.insertBefore(p, content.firstChild);
    },
    hideDialog: function(){
        window.accDialog && window.accDialog.hidden();
    }
};
