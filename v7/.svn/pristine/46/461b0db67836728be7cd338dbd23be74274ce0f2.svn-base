$import("sina/core/events/addEvent.js");
$import("sina/utils/io/jsload.js");
/**
 * @fileoverview 取消导入认证
 *
 * @create 2012-11-27
 * @author Qiangyee
 */
$registJob("cancelImportV", function (){

    var cancelBtn = $E("cancel-import-v");
    var apiURL = "http://control.blog.sina.com.cn/blog_rebuild/riaapi/vblog/";
    if (!cancelBtn || -1 === cancelBtn.innerHTML.indexOf("取消")) {
        return;
    }
    cancelBtn = cancelBtn.parentNode;
    var _addEvent = Core.Events.addEvent;

    var _this = {
        onCancelImportV : function(e){
            winDialog.confirm('点击确认取消身份导入。',{
                width:300,
                funcOk : function(){
                    _this.cancel();
                },
                icon : "01"
            }, "___importV");
        },
        cancel : function(){
            var url = apiURL + "del_vfinfo.php";
            Utils.Io.JsLoad.request(url, {
              onComplete  : function(result){
                
                if ("A00006" === result.code) {
                    var successFunc = function(){
                        location.reload(true);
                    };
                    winDialog.alert("取消成功！", {
                        funcOk : successFunc,
                        funcClose : successFunc,
                        icon : "03"
                    }, "___cancelImportV");
                }
              },
              onException : function(data){
              },
              timeout : 30000
            });
        }
    };
    _addEvent(cancelBtn, _this.onCancelImportV, "click");
});
