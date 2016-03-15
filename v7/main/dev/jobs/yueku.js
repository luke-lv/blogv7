/**
 * @fileInfo	新版乐库 链接
 * @author		meichun1@staff.sina.com.cn
 * @update		18:20 2010/11/2
 */
$import("lib/jobs.js");


$registJob("yueku", function() {
		if (!$isAdmin) {
				return;
		}
		var foreach = Core.Array.foreach,

		sinablogb = $E("sinablogb");

		foreach($T(sinablogb, 'div'), function(elem) {
				if (! (elem.id || "").indexOf('e_div_player')) {
						var embed = $T(elem.parentNode, 'embed')[0];
						var flashvars = embed.getAttribute('flashvars');
						
						var height = embed.getAttribute('height');
						var id = elem.id.slice(13);

						$T(elem, 'a')[0].href = "http://music.sina.com.cn/box/?" + flashvars + "&height=" + height + "&mid=" + id;
						$T(elem, 'a')[0].target = "_blank";
						elem.style.display = "block";

				}

		});

});