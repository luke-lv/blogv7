$import("lib/register.js");
$import("sina/core/string/byteLength.js");
$import("sina/core/string/leftB.js");
/**
 * @fileoverview 访客组件与好友组件获取用户昵称
 *
 * @create 2012-11-30
 * @author Qiangyee
 */
Lib.register("util.cutNickName", function () {
    return function(nickName, wtype, len){
        var byteLength = Core.String.byteLength;
        var leftB = Core.String.leftB;
        len = len || 6
        if (0 <= wtype && 8 > wtype) {
            return byteLength(nickName) > len
                            ? leftB(nickName, len-2) + '…'
                            : leftB(nickName, len);
        } else {
            return byteLength(nickName) > len+2
                            ? leftB(nickName, len) + '…'
                            : leftB(nickName, len+2);
        }
    };
});
