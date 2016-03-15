$import("lib/sysmsg.js");
$import("lib/dialogConfig.js");
$import("lib/msg/systemMSG.js");
/**
 * 
 * @param {String} code
 * @param {String} ico  "01":叹号；"02":错误；"03":正确；"04":问号；
 */
function showError(code, ico){
    var msg = $SYSMSG[code] || code;
    winDialog.alert(msg, {
        icon: ico || "01"
    });
}
