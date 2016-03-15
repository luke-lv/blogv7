$import("sina/core/events/addEvent.js");
$import("sina/utils/io/ajax.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/string/trim.js");
$import("sina/core/dom/byClass.js");
$import("sina/utils/limitLength.js");

$import("lib/login/ui.js");
$import("lib/checkAuthor.js");
$import("lib/interface.js");

/**
 * @fileoverview 立即申请淘博会按钮
 *
 * @create 2010-12-05
 * @author Qiangyee
 */
$registJob("recordSaler", function(){
    var btn = $E("record");
    if (!btn) {
        return;
    }
    var _addEvent   = Core.Events.addEvent;
    var _byteLength = Core.String.byteLength;
    var _trim       = Core.String.trim;
    var _byCls      = Core.Dom.byClass;

    var _this = {
        checkShopName : function(name){
            var el = $E("shop_name");
            var msg = "请输入30个字以内的店铺名称";;
            var isDefault = el.value == el.getAttribute("placeholder");
            if (!name || isDefault || 60 < _byteLength(name)) {
                this.showError(el, msg);
                return false;
            }
            if (2 > _byteLength(name)) {
                msg = "店铺名称不得少于1个汉字或者2个字节";
                this.showError(el, msg);
                return false;
            }
            this.clearError(el);
            return true;
        },
        checkSrcUrl : function(url){
            
            var reg = /^(?:http:\/\/)*(?:[^\/]+)\.(?:taobao|tmall)\.com(?:(\/)[\S]*)*/i;
            if (!reg.test(url)) {
                var msg = "店铺地址输入格式有误";
                this.showError($E("srcurl"), msg);
                return false;
            }
            this.clearError($E("srcurl"));
            return true;
        },
        checkType : function(type){
            if (type && !isNaN(type) && 0 < parseInt(type, 10)) {
                this.clearError($E("item_type"));
                return true;
            } else {
                var msg = "请选择你的主营类目";
                this.showError($E("item_type"), msg);
                return false;
            }
        },
        clearError : function(el){
            var ddEl = el.parentNode;
            var errorEl = _byCls("red", "span", ddEl)[0];
            
            if (errorEl) {
                errorEl.style.display = "none";
            }
            var rightEl = _byCls("right", "span", ddEl)[0];
            if (!rightEl) {
                rightEl = $C("span");
                rightEl.className = "right";
                ddEl.appendChild(rightEl);
            }
            rightEl.style.display = "";
            rightEl.innerHTML = '<img align="absmiddle" src="http://simg.sinajs.cn/blog7style/images/special/fair/ico_zc.jpg" alt="正确">';
        },
        showError : function(el, msg){
            var ddEl = el.parentNode;
            var errorEl = _byCls("red", "span", ddEl)[0];
            if (!errorEl) {
                errorEl = $C("span");
                errorEl.className = "red";
                ddEl.appendChild(errorEl);
            }
            var rightEl = _byCls("right", "span", ddEl)[0];
            if (rightEl) {
                rightEl.style.display = "none";
            }
            errorEl.style.display = "";
            errorEl.innerHTML = '<img align="absmiddle" src="http://simg.sinajs.cn/blog7style/images/special/fair/ico_cw.jpg" alt="错误">' + msg;
        },
        submit : function(shopName, srcUrl, type){
            var url = "http://i.blog.sina.com.cn/blog_rebuild/riaapi/profile/tbh/shopapply.php";
  
            Utils.Io.Ajax.request(url, {
                POST: {
                    shop_name : shopName,
                    srcurl : srcUrl,
                    item_type : type,
                    ac : 2,
                    u : $UID,
                    t : 1
                },
                returnType : "json",
                onComplete: function(result){
                    _this.isPost = !0;
                    if ("A00006" == result.code) {
                        var form = $C("form");
                        var url  = result.data + "&rnd=" + parseInt(Math.random() * 1000);
                        
                        var input = $C("input");
                        input.name = "ac";
                        input.value = 2;
                        form.method = "post";
                        form.action = url;
                        form.appendChild(input);
                        document.body.appendChild(form);
                        form.submit();
                    } else {
                        winDialog.alert(result.data);
                    }
                }.bind2(this),
                onException: function(msg, url){
                    _this.isPost = !0;
                    winDialog.alert("系统繁忙，请稍后再试！");
                }
            });
        },
        onSubmit : function(){
            if (_this.isPost) {
                return;
            }
            //获取卖家资料
            var shopName = this.getShopName();
            var srcUrl = this.getSrcUrl();
            var type =  this.getType();
            //校验
            var flag = this.checkShopName(shopName);
            flag = this.checkSrcUrl(srcUrl) && flag;
            flag = this.checkType(type) && flag;
            if (flag) {
                this.submit(shopName, srcUrl, type);
            }
        },
        getShopName : function(){
            return _trim($E("shop_name").value);
        },

        getSrcUrl : function(){
            return _trim($E("srcurl").value);
        },

        getType : function(){
            return _trim($E("item_type").value);
        },
        
        initEmptyText : function(){
            
            _addEvent($E("shop_name"), function(){
                _this.checkShopName(_this.getShopName());
            }, "keyup");
            _addEvent($E("srcurl"), function(){
                _this.checkSrcUrl(_this.getSrcUrl());
            }, "keyup");

            _addEvent($E("item_type"), function(){
                _this.checkType(_this.getType());
            }, "change");

            if (!$IE) {
                return;
            }

            $E("shop_name").value = $E("shop_name").getAttribute("placeholder");
            $E("srcurl").value = $E("srcurl").getAttribute("placeholder");
            
            _addEvent($E("shop_name"), _this.setEmptyText, "focus");
            _addEvent($E("srcurl"), _this.setEmptyText, "focus");
            _addEvent($E("item_type"), _this.setEmptyText, "focus");

            _addEvent($E("shop_name"), _this.setInputTips, "blur");
            _addEvent($E("srcurl"), _this.setInputTips, "blur");
            _addEvent($E("item_type"), _this.setInputTips, "blur");

        },
        setInputTips : function(e){
            var el = e.target || e.srcElement;
            var value = _trim(el.value || "");
            var emptyText = el.getAttribute("placeholder");
            if (!value) {
                el.value = emptyText;
            }
        },
        setEmptyText : function(e){
            var el = e.target || e.srcElement;
            var value = _trim(el.value || "");
            var emptyText = el.getAttribute("placeholder");
            if (value && (emptyText == value)) {
                el.value = "";
            }
        },
        isPost : !1
    };
    _addEvent(btn, function(e){
        _this.onSubmit();
        return false;
    }, "click");

    Utils.limitLength($E("shop_name"), 60);
    _this.initEmptyText();
});
