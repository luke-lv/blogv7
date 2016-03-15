/*
 * @author shaomin | shaomin@staff.sina.com.cn
 * @description 平台1.0相册相关文案
 * 
 * 
 * 
 */
$import("lib/sysmsg.js");

/*个人资料组件的相关文案*/
var Profile ={
	"offline"    : {msg : "该用户不在线，暂不能聊天。",icon:"03"},
	"upgradding" : {msg : "升级中，敬请期待。",icon:"03"}
};

var CtgTpl= {
    moveOne : '<li>'+
                   '<input type="radio" class="CP_w_fm1" id="rid{0}" onclick="getCtg({0});" name="myopts"/>'+
                   '<label for="rid{0}">{1}({2})<img width="18" height="18" align="absmiddle" title="此专辑已经加密" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" class="SG_icon SG_icon104" style="display:{3}"/></label>'+
              '</li>',
    leftOutline : '<li class="{0}">'+
                   '<div class="menuCell_main">'+
                   '<div class="albumCell">'+
                   '<div class="ptpic_m">'+
                   '<a	href="{5}" target="_self" >'+
                    '<img id="category_cover_{4}" src="{1}" width="80" height="80" align="absmiddle" alt="{2}" title="{2}"/>'+
                  '</a>'+
                 '</div>'+
                 '<p>'+
                 '<a href="{5}" id="category_name_{4}" target="_self">{2}</a>'+
                  '<em class="SG_txtc">({3})</em>'+
                 '</p>'+
                 '<div class="clearit"></div>'+
               '</div>'+
                '</div>'+
              '<div class="menuCell_bot"></div>'+
              '</li>'
};



var PhotoDom = {
    rotate :   '<div class="CP_layercon2 roundPhotoItem">'+
		    '<table width="100%" cellpadding="0" cellspacing="0">'+
		     '<tr><td>'+
                       '<a href="javascript:rotateImage($E(\'image_{0}\'), -90, true);" class="left"></a>'+
                     '</td><td>'+
		       '<img id="image_{0}" src="{1}" />'+
		    '</td><td>'+
                      '<a href="javascript:rotateImage($E(\'image_{0}\'), 90, true);" class="right"></a>'+
                   '</td></tr>'+
		'</table>'+
		'<div class="btn">'+
                  '<a class="SG_aBtn SG_aBtnB" id="#{btn1}" href="javascript:;"><cite>保存</cite></a>&nbsp;&nbsp;'+
                  '<a class="SG_aBtn SG_aBtnB" href="javascript:void((function(){rDialog.hidden();})());"><cite>取消</cite></a>'  +                         '</div>'+
	'</div>',
    title : ' <p class="pt_list_title">'+
                     '<INPUT class="{0}"  isvalue="1" value="" class="{0}" onfocus="this.select();"/>'+
                 '</p>'+
                 '<p class="ErrTips" style="DISPLAY: none"></p>'+
                 '<p class="pt_list_btn">'+
                     '<A class="SG_aBtn SG_aBtnB" href="javascript:;"><CITE>保存</CITE></A>'+
                     '&nbsp;<A class="SG_aBtn SG_aBtnB" href="javascript:;"><CITE>取消</CITE></A>'+
                 '</p>',
    memo : ' <p class="pt_list_title"><textarea class="{0}" onfocus="this.select();"/></textarea></p>'+
              '<p class="ErrTips" style="DISPLAY: none"></p>'+
              '<p class="pt_list_btn">'+
                '<A class="SG_aBtn SG_aBtnB" href="javascript:;"><CITE>保存</CITE></A>&nbsp;'+
                '<A class="SG_aBtn SG_aBtnB" href="javascript:;"><CITE>取消</CITE></A>'+
              '</p>',
    createAlbum : '<form id="AlbumForm" onsubmit="return false;">'+
    			  '<table cellpadding="0" cellspacing="0" class="newPIC">'+
                	'<tr>'+
						'<th></th>'+
						'<td><span class="CP_w_star"><em>*</em>为必填项</span></td>'+
					'</tr>'+
					'<tr>'+
						'<th><span class="CP_w_star"><em>*</em></span><span>标题：</span></th>'+
						'<td>'+
					 '<input type="hidden" value="{0}" name="ctgId" class="fm1" />'+
                                   '<input type="hidden" value="{1}" name="picId" class="fm1" />'+
                                    '<input type="hidden" name="is_pw" value="0" />'+
	'<input type="text" value="{2}" class="fm1" name="albumtitle" onfocus="this.select();"/><div class="ErrTips" style="display:none;" id="title_err">错误提示</div></td>'+
					'</tr>'+
					'<tr>'+
						'<th><span>描述：</span></th>'+
						'<td><textarea class="fm2" name="albumdesc" onfocus="this.select();">{3}</textarea>'+
						'<div class="ErrTips" style="display:none;" id="content_err">错误提示</div></td>'+
					'</tr>'+
					'<tr><td colspan="2"><div class="SG_j_line"></div></td></tr>'+
					'<tr>'+
						'<th><span class="CP_w_star"><em>*</em></span><span>权限：</span></th>'+
						'<td><ul>'+
							 '<li>'+
	                           '<input type="radio" name="permission" id="rdo1" class="rdo" onclick="$E(\'encrypt_pwd\').style.display=\'none\';$E(\'AlbumForm\').is_pw.value=\'0\';$E(\'tip\').style.display=\'none\';$E(\'encrypt_err\').style.display=\'none\';" checked/>'+
                               '<label for="rdo1">公开访问</label>'+
                            '</li>'+
                            	'<li>'+
        '<input type="radio" name="permission" id="rdo2" class="rdo" onclick="$E(\'encrypt_pwd\').style.display=\'inline\';$E(\'AlbumForm\').is_pw.value=\'1\';$E(\'tip\').style.display=\'block\';" />'+
                               '<label for="rdo2">密码访问</label>'+
                            '<input value="{4}" id="encrypt_pwd"  type="password" onfocus="this.select();" class="fm3" style="display:none;" />'+
			'<div class="ErrTips01" id="tip" style="display:none;">请输入密码：6-16位（包括6、16），英文、数字、半角“.”、“-”、“?”和下划线，区分大小写</div>'+
			'<div class="ErrTips02" style="display:none;" id="encrypt_err">错误提示</div>'+
						'</li>'+
						'</li></ul>'+
						'</td>'+
					'</tr>'+
					'<tr>'+
						'<th>&nbsp;</th>'+
	'<td class="btn"><a class="SG_aBtn SG_aBtnB SG_aBtn_sub" href="#" onclick="createAlbum();return false;"><cite>确定</cite></a>&nbsp;&nbsp;<a class="SG_aBtn SG_aBtnB SG_aBtn_sub" href="#" onclick="moveDialog.close();return false;"><cite>取消</cite></a></td>'+
					'</tr>'+
				'</table>'+
	'</form>',
    
    moveAlbum : {
	content : '<div class="movePhotoItemContent">'+
			'<div class="CP_w_tag">'+
				'<ul>'+
					'<li class="cur" id="moveBtn"><div><em><a href="javascript:;">已有专辑</a></em></div></li>'+
					'<li id="newBtn"><div><em><a href="javascript:;">新建专辑</a></em></div></li>'+
				'</ul>'+
			'</div>'+
			'<div class="CP_w_info1" id="moveContent" style="display:;">'+
			'<div class="CP_w_Note SG_txtb">请选择你要加入的专辑：</div>'+
			'<ul class="CP_w_part" id="moveList">'+
				'<li>读取中...</li>'+
			'</ul>'+
			'<div class="CP_w_blank"></div>'+
			'<div class="fenyeCon">'+
				'<div class="SG_page" id="mPager">'+
			'</div>'+
			'</div>'+
			'<div class="SG_j_linedot"></div>'+
			'<p class="CP_w_btns" style="text-align:center">'+
                            '<a class="SG_aBtn SG_aBtnB SG_aBtn_dis" href="javascript:;" id="#{btn1}"><cite>确定</cite></a>'+
                           '&nbsp;&nbsp;<a class="SG_aBtn SG_aBtnB" href="javascript:void((function(){moveDialog.close();})());"><cite>取消</cite></a>'+
                        '</p>'+
			'</div>'+
                          '<div style="" class="CP_w_info2"  id="newContent" style="display:none;">'+
            '</div></div>',

	title:'转移到专辑'},
    
    impeach :  '<form id="reportForm"><div class="CP_layercon2 denounce">'+
        '<div class="ErrTips" style="display:none" >'+
       '<img class="SG_icon SG_icon47" src="http://simg.sinajs.cn/blog7style/images/common/sg_trans.gif" width="15" height="15" align="absmiddle" /><span class="SG_clewtxta" id="wrongInfo">请输入验证码。</span></div>'+
        '<ul class="denPicRow clearfix">'+
        '<li><span class="a">举报内容：</span><span class="b">{0}</span></li>'+
        '<li><span class="a">举报类型：</span><span class="b rlist">'+
        '<input name="impeachType" type="radio" id="ccb1" /><label for="ccb1">色情</label>'+
       '<input name="impeachType" type="radio" id="ccb2" /><label for="ccb2">反动</label>'+
       '<input name="impeachType" type="radio" id="ccb3" /><label for="ccb3">暴力</label>'+
       '<input name="impeachType" type="radio" id="ccb4" /><label for="ccb4">侵权</label>'+
       '<input name="impeachType" type="radio" id="ccb5" checked/><label for="ccb5">其他</label>'+
     '</span></li>'+
       '<li><span class="a">举报描述：</span>'+
        '<span class="b"><textarea class="SG_textarea fm_sele" name="desc"></textarea></span></li>'+
        '<li><span class="a">联系方式：</span><span class="b">'+
        '<input type="text" class="SG_input" style="width:135px;" name="contact" /></span></li>'+
        '<li><span class="a">验&nbsp;证&nbsp;码：</span>'+
       '<span class="b"><input name="authcode" type="text" class="SG_input" style="width:135px;" maxLength="4" />'+
'<img id="authImg" onclick="getAuthCode(\'authImg\');" style="cursor:pointer;" src="http://photo.blog.sina.com.cn/helpers/checkwd_image.php?' + Date.parse(new Date())+'" width="51" height="16"/>'+
      '<a href="javascript:void(getAuthCode(\'authImg\'));" id="changeAuthcode">看不清？</a></span></li>'+
        '</ul>'+
        '<div class="butt">'+
        '<a href="javascript:;" class="SG_aBtn SG_aBtnB " id="reportForm_post"><cite>举报</cite></a>&nbsp;&nbsp;'+
        '<a href="javascript:void((function(){reportDialog.hidden();})());" class="SG_aBtn SG_aBtnB "><cite>取消</cite></a></div>'+
        '<div class="clearit"></div>'+
		'</div></form>'
}

   
	var reportSucc = {
	    html: '举报成功。', 
	    opt: {
		subText:'我们将尽快处理。',
		title: "举报成功"
	    }
	};
	
