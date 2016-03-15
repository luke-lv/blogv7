/**
 * @fileoverview 相册冲印模板
 * @author wujian|wujian@staff.sina.com.cn
 * 
 */

var PicTemplate={
	/**
	 * 正常
	 */	
	normal:['<div id="pic_@picId@" class="@clsName@" >',
				'<a href="#" onclick="addPic(\'@picId@\');return false;">',
					'<img  src="@picURL@">',
				'</a>',	
				'<span class="@ico@" onclick="addPic(\'@picId@\');return false;"></span>',
				'@smallSize@',				
			'</div>'						 		
		].join(""),	
	/**
	 * 删除
	 */	
	del:['<div class="error_pic" id="del_@picId@" onmouseover="showDel(\'@picId@\')" onmouseout="hideDel(\'@picId@\')">',
				'<a href="#" onclick="delEle(\'@picId@\');return false;"  >',
						'<img  src="@picURL@">',
				'</a>',
				'<span   id="span_@picId@" onclick="delEle(\'@picId@\');" title="取消"></span>',
						//'<a href="#" title="取消"  id="span_@picId@" onclick="delEle(\'@picId@\');return false" ></a>',
				'@smallSize@',
		'</div>'								
		].join(""),
		
	blank:['<div  >',
				'<a href="#" onclick="return false;" >',										
				'</a>',								
			'</div>'								
		].join("")
};