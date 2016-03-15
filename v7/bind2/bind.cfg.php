<?php
$_CONFIG = array (
	'dev_prefix'	=>'',// dev的起始目录
	'packed'		=>-1,// 是否压缩, 压缩的模式,支持-1(不压缩), 0, 10, 62, 95(慎用)
	'debug'			=>false,// 是否开启debug模式
	'unicode'		=>false,// 是否编码成unicode
	'out_prefix'	=>'',// 输出的文件基础路径, 如果设置,则自动输出为多文件引用方式
	'out_charset'	=>'UTF-8',// 输出的编码格式, 取值为GBK或者UTF-8,默认为UTF-8
	'import'		=>true// 是否分析import语法
);
