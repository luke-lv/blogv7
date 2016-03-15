/*
 * @author guangtian| guangtian@staff.sina.com.cn
 * @date 2015/11/5
 * 新旧验证码管理模块
 */
$import('lib/builder.js');
$import('lib/commentv2/geetest.js');
$import('lib/imgCheck.js');
$import("lib/audioCheck.js");
$import("msg/blogComment.js");
$import("sina/core/dom/wrap.js");
Lib.checkManager = function(obj){
    this.checkObj = null;
    this.init(obj);
};

Lib.checkManager.prototype = {
    init: function(obj_int){
        var self = this;
        if(obj_int&&obj_int.id){
            this.geetest = new CommentV2.Geetest(obj_int.id);
        }else{
            this.geetest = new CommentV2.Geetest('#checkCodeBox');
        }
        var geetestHD = setInterval(function(){
            if (self.geetest.geetestObj) {
                clearInterval(geetestHD);
                self.checkObj = self.geetest.geetestObj;
                self.checkObj.onReady(function(){
                    if(self.geetest.options.type==='float'){
                        var gt_hoder= Core.Dom.byClz(document,'div','gt_holder');
                        gt_hoder[gt_hoder.length-1] .style.zIndex='9999';
                    }
                });
            } else if (scope.check_code_type === 'old') {
                clearInterval(geetestHD);
                this.checkObj = new Lib.imgCheck();
                var dom = $E("comment_get_vcode");
                var cont = Core.Dom.wrap(dom, "span");
                if (cont) {
                    Lib.AudioCheck.render(cont, Lib.AudioCheck.soundUrl+"?"+new Date().getTime());
                }
            }
        }, 20);
    },
    refresh: function(){
        this.checkObj.refresh();
    },
    validate: function(){
        return this.checkObj.getValidate();
    },
    setFreshChk: function(flag){
        this.checkObj.fresh_chk && (this.checkObj.fresh_chk = flag);
    },
    getPostData: function(paramm){
       var data = {};
        var extend=function(o,n){
           for(var p in n)if(n.hasOwnProperty(p) && !o.hasOwnProperty(p))o[p]=n[p];
        };
        validate = this.validate();
       // console.log(validate);
        if (typeof validate === 'object') {
            for (var i in validate) {
                data[i] = validate[i];
            }
        } else {
            data.authcode = validate;
        }
        extend(data,paramm);
        return data;
    },
    getErrorCode: function() {
        var errCode = 'B36115';
        if (scope.check_code_type === 'old') {
            errCode = 'B36106';
        }
        return errCode;
    }
}