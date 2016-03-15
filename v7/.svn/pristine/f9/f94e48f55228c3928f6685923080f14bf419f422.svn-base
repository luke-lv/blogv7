/**
 * Copyright (c) 2012 - 2013, Sina Inc. All rights reserved.
 * @fileoverview Sina 猜你喜欢视频信息模板
 * @author liugang | liugang3@staff.sina.com.cn
 * @version 1.0 | 2015-03-20
 */
define('tpl/likeVideo', function(require, exports, module){
  module.exports = [
    '<#et tpl data>',
     	'<#list data as list>',
				'<div class="DC_imgitem_b" video-id="${list.videoid}" video-info="${list.module}|${list.algorithm}|${list.expirement}">',
						'<div class="thumb">',
								'<a data-action="log" href="${list.link}" title="${list.title}"><img src="${list.thumb}" alt="${list.title}"><span class="last">${list.playLength}</span><span class="play"><i class="DC_icon DC_icon_play"></i></span></a>',
						'</div>',
						'<div class="dtl">',
								'<div class="tl"><a data-action="log" href="${list.link}" title="${list.title}">${list.title}</a></div>',
						'</div>',
				'</div>',
			'</#list>',   
    '</#et>'
  ].join('');
});
