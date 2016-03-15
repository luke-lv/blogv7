/**
 * @fileoverview 极验验证geetest验证码组件
 * @author yifei2@staff.sina.com.cn
 * @example
 * @params
 * node-节点元素，id或者jquery选择器，必填
 * options-选项，geetest sdk相关选项，具体内容查阅geetest文档，选填
 * var geetest = new Comment.Geetest('#geetest-box');
 */

$import("sina/core/class/create.js");
$import("lib/commentv2/_comment.js");

CommentV2.Geetest = Core.Class.create();

CommentV2.Geetest.prototype = {
    // geetest对象
    geetestObj: null,
    // 插入验证码节点
    node: '',
    // geetest参数
    options: {
        // 前端展示形式
        // float：浮动式 embed：嵌入式 popup：弹出式
        type: 'float'
    },
    initialize: function(node, options){
        if(options) {
            this.options = options;
        }
        this.node = node || '';
        this.load();
    },
    // 请求接口获取验证码gt, challenge参数
    reqGeetestAuth: function(){
        var _this = this;
        var url = 'http://control.blog.sina.com.cn/riaapi/StartCaptchaServlet.php';
        Utils.Io.JsLoad.request(url, {
            GET: {
                rand: Math.round(Math.random()*100)
            },
            returnType: 'json',
            onComplete: function(res) {
                if(res.code === 'A00006' && res.data.success === 1) {
                    _this.loadGeetest(res.data);
                } else if (res.data.success === 2) {
                    //第三方验证码服务器出现错误，切换到旧版验证码
                    if (!window.scope) {
                        window.scope = {};
                    }
                    window.scope.check_code_type = 'old';
                }
            }
        });
    },
    // 加载gee验证码
    loadGeetest: function(config) {
        var _this = this;
        _this.geetestObj = new window.Geetest({
            product : _this.options.type || 'float',
            gt : config.gt,
            challenge : config.challenge,
            offline : !config.success,
            sandbox:true
        });
        _this.geetestObj.appendTo(_this.node);
    },
    load: function(){
        var _this = this;
        if(!window.Geetest) {
            // 动态加载验证的前端gt_lib库
            s = document.createElement('script');
            s.src = 'http://api.geetest.com/get.php?callback=gtcallback';
            document.body.appendChild(s);

            // 回调
            window.gtcallback = function() {
                _this.reqGeetestAuth();
            };
        }else {
            _this.reqGeetestAuth();
        }
    }

};