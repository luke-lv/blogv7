﻿/**
 * @desc	百合注册浮层模板
 * @auth	dcw1123 | chengwei1@staff.sina.com.cn
 */

$import("comps/baihe/_baihe.js");

Baihe.registTemplate = [
'<div class="bh_login" id="#{entity}">',
	'<h3 id="#{titleBar}"><span id="#{titleName}">立即注册</span><a href="#" class="close_pop" id="#{btnCls}" onclick="return false;">关闭</a></h3>',
	'<ul class="bh_login_form" id="#{content}">',
		'<li class="erro_message">',
			'<div class="bh_input" id="#{errTips}" style="line-height:20px; height:20px;"></div>',
		'</li>',
		'<li>',
			'<div class="bh_input">',
				'<label>手机号:</label>',
				'<input type="text" class="input_ouline beforehand" id="#{phoneNum}" value="用于联系您中奖的直接方式" _value="用于联系您中奖的直接方式" />',
			'</div>',
		'</li>',
		'<li>',
			'<div class="bh_input">',
				'<label>昵称:</label>',
				'<input type="text" class="input_ouline beforehand" id="#{nickName}" value="用于登录百合网的昵称" _value="用于登录百合网的昵称"/>',
			'</div>',
		'</li>',
		'<li>',
			'<div class="bh_input">',
				'<label>邮箱:</label>',
				'<input type="text" class="input_ouline beforehand" id="#{email}" value="用于通知您中奖的直接方式" _value="用于通知您中奖的直接方式"/>',
			'</div>',
		'</li>',
		'<li>',
			'<div class="bh_input">',
				'<label>密码:</label>',
				'<input type="text" class="input_ouline beforehand" id="#{password_faked}" value="用于登录百合网的密码" />',	// 假节点
				'<input type="password" class="input_ouline" id="#{password}" value="" style="display:none" />',				// 真节点
			'</div>',
		'</li>',
		'<li>',
			'<div class="bh_input">',
				'<label>婚姻:</label>',
				'<div class="input_ouline select" style="z-index:100;">',
					'<span id="#{marriageInput}">请选择</span>',
					'<ul id="#{marriageChoice}" class="marital_tatus">',
						'<li><a href="#" onclick="return false;">非单身</a></li>',
						'<li><a href="#" onclick="return false;">单身</a></li>',
					'</ul>',
					'<a href="#" class="drop_icon" id="#{marriageBtn}" onclick="return false;">选择</a>',
				'</div>',
			'</div>',
		'</li>',
		'<li>',
			'<div class="bh_input">',
				'<label>性别:</label>',
				'<div class="input_ouline select" style="">',
					'<span id="#{userSexInput}">请选择</span>',
					'<ul id="#{userSexChoice}">',
						'<li><a href="#" onclick="return false;">男</a></li>',
						'<li><a href="#" onclick="return false;">女</a></li>',
					'</ul>',
					'<a href="#" class="drop_icon" id="#{userSexBtn}" onclick="return false;">选择</a>',
				'</div>',
			'</div>',
		'</li>',
		'<li class="jionbh">',
			'<div class="bh_input">',
				'<input type="checkbox" checked="checked" id="#{agreement}"/> 同时注册百合网',
			'</div>',
		'</li>',
		'<li class="submit-field">',
			'<div class="bh_input">',
				'<input type="submit" value="我要提交" class="bh_submit" id="#{submitBtn}"/>',
			'</div>',
		'</li>',
	'</ul>',
'</div>'].join("");



