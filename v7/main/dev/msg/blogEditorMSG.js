/**
 * @author {FlashSoft}
 */
 /*
	01: 标题
	02: 编辑器
	03: 标签
	04: 分类
	05: 设置
	06: 成功信息
	07: 错误信息
	08: 前端判断用信息
  */
$import("lib/sysmsg.js");
$SYSMSG.extend({
	"B01001": "标题必须是48个中文或96个字符以内，请重新输入。",
	"B02001": "请输入内容。",
	"B02002": "博文内容超过容量限制，请重新编辑。 <br/><span style='font-size: 12px; font-weight: normal;'>博文内容最多允许1万汉字，2万字符。</span>",
	"B02003": "是否要清除格式？粘帖的内容中含有冗余的格式，会影响在博客中的排版。",
	"B02004": "上次撰写的博文未进行保存，要恢复内容继续编辑吗？",
	"B02005":'您提交的内容中含有广告等不适当内容，"确认"后将被清除！',
	"B03001": "标签总字数必须是30个中文或60个字符以内，请重新输入。",
	"B03002": "标签个数必须是5个以内，请重新输入。",
	"B03003": "每个标签字数必须是7个中文或14个字符以内，请重新输入。",
	"B03105": "无法提取到有效标签，请手动输入些标签：如“体育、生活”。",
	"B03106": "博文内容必须大于20个中文或40个字符，才能提取有效标签。",
	"B03107": "博文内容必须大于20个中文或40个字符，才能提取有效标签。",
	
	"B04001": "发布时间不能超出当前时间，请重新输入。",
	"B04002": "抱歉,请选择“我记录”活动投稿类别。",
	"B04022": "标签总字数必须是30个中文或60个字符以内，请重新输入。",	
	
	"B06001": "博文已发布成功。",
	//"B06010": "博文已发布成功。",			// 世界杯的博文
	"B06011": "博文已发布成功。",
	"B06012": "博文已发布成功。",
	"B06002": "博文已发布，稍后显示，请耐心等待一下。",
	"B06003": "博文已成功保存到草稿箱。",
	"B06004" : "您的博文已经发表成功，目前已经进入后台审核中。审核时间为12小时，请耐心等候。",
	
	"B07001": "博文发布失败，请梢后再试。建议先将内容拷贝到本地硬盘备份。",
	"B07003": "博文保存失败，请梢后再试。建议先将内容拷贝到本地硬盘备份。",
	"B07004": "博文保存失败，请梢后再试。建议先将内容拷贝到本地硬盘备份。",
	"B07005": "您短时间发表文章过多，请稍后再试",
	
	"B08001": "不能一分钟内连续发博文，请稍后再试。",
	"B08002": "发布中，请稍候…",
	"B08003": "保存中，请稍候…",
	"B08004": "由于网络原因上传失败，请稍后再试。或者尝试使用<a href='http://photo.blog.sina.com.cn/upload/upload_html.php'>旧版网页上传</a>。",
	"B08005": "由于网络原因上传失败，请稍后再试。",
	"B36101" : "文章不存在",
	
	"B78001" : "选择已达相关博文上限！请删除一些再勾选",

	"B79001" : '音乐地址要求是mp3格式，请重新输入！或者直接去<a onclick="scope.musicOperate.showStore();return false;" href="#">新浪乐库</a>中搜索。',
	"B79002" : '音乐地址要求以http://开始，请重新输入！或者直接去<a onclick="scope.musicOperate.showStore();return false;" href="#">新浪乐库</a>中搜索。',
	"B79003" : "是否要删除背景音乐？",
	"B79004" : "是否要删除相关博文？",
	
	"B79005":"在模板中只能插入一张图片。",
	"B79006":"每次最多只能插入20张图片。<br/>请先完成图片添加，再插入新图片",

	
	"B79007":"<strong>此分类尚无博文，请选择其他分类</strong>",
	"B79008":"<strong>尚无博文</strong>",
	"B79009" : "是否要删除推荐活动？",
	
	"B89001" : "请输入文章内容。",
	"B89002" : "正文内空转码失败。",
	"B89003" : "服务分析出错。",
	"B89004" : "没有找到匹配的歌曲名。",
	"B89005" : "为了保证您的博文打开速度，每篇博文最多只能插入3个音乐播放器。",
	"B89006" : "每个播放器最多只能添加20首歌",
	"B89007" : "歌曲已成功添加！<br/>但添加至上一个播放器，仅在当本博文中已有播放器时适用。",
	"B89008" : "歌曲已成功添加！<br/>但插入歌词功能仅在插入单首歌曲时可用。" ,
	"B89009" : "请输入搜索内容",
	"B89011" : "抱歉，您还没有选择音乐，请至少选择一首。",
	"B89012" : "博文中无可识别的歌曲名。<br/><span style=\"color:#999\">帮助：此功能会根据您输入的博文内容，自动识别出您博文内容中出现的歌曲名，并为此歌曲名匹配相应试听链接，浏览者即可一键轻松试听您博文中的音乐。</span>",
	"B89013" : "已成功添加至上一个播放器中！",
	"B79010" : "请在图片上传完成后再进行添加。",
	
	"A00200" : "您输入的内容包含非法字符"

});

