function makeHead(pMark)
{
	pMark	= pMark ? pMark : "index,search,help";

	document.write('\
	<table width="750" border="0" align="center" cellpadding="0" cellspacing="0">\
	<tr>\
	<td>\
		<table width="750" border="0" cellpadding="0" cellspacing="0">\
		<tr>\
		<td width="125" valign="bottom">\
		<a href="http://blog.sina.com.cn/"><img src="http://www.sinaimg.cn/blog/08index/blog_mj_001.gif" width="135" height="32" border="0" align="absbottom"></a>\
		</td>\
		<td width="625" align="right" valign="bottom">\
			<table width="100%"  border="0" cellspacing="0" cellpadding="0">\
			<tr>\
			<td align="right" valign="bottom" style="font-size:12px;padding-top:10px;padding-right:4px;">\
	');
	
	document.write( selectHyperLink(pMark) );
	
	document.write('\
			</td>\
			</tr>\
			</table>\
		</td>\
		</tr>\
		</table>\
	</td>\
	</tr>\
	</table>\
	');
}
function selectHyperLink(pMark)
{
	var iMarkArray		= pMark.split(",");
	var iStrAdd		= new Array();
	var iHyperLink		= new Object();
	iHyperLink['index']	= '<a href="http://blog.sina.com.cn/" onmouseover="this.style.textDecoration=\'underline\';" onmouseout="this.style.textDecoration=\'none\';" style="text-decoration:none;color:#666666;" target="_blank">²©¿ÍÊ×Ò³</a>';
	iHyperLink['search']	= '<a href="http://search.blog.sina.com.cn/blog/search" onmouseover="this.style.textDecoration=\'underline\';" onmouseout="this.style.textDecoration=\'none\';" style="text-decoration:none;color:#666666;" target="search">ËÑË÷</a>';
	iHyperLink['help']	= '<a href="http://blog.sina.com.cn/lm/help/2008/" onmouseover="this.style.textDecoration=\'underline\';" onmouseout="this.style.textDecoration=\'none\';" style="text-decoration:none;color:#666666;" target="help">°ïÖú</a>';
	
	for (iKey in iMarkArray)
	{
		iStrAdd[iStrAdd.length]	= iHyperLink[iMarkArray[iKey]];
	}
	
	return iStrAdd.join("©®");
}
