$import("lib/register.js");
/**
 * @fileoverview 文件说明
 *
 * @create ${date} ${time}
 * @author Qiangyee
 */
Lib.register("util.hideContainer", function(){
    var container = $C("div");
    container.style.display = "none";
	document.body.appendChild(container);
    return container;
});
