<?php

header('Content-Type: text/plain; Charset=UTF-8');
function get_file($host, $file)
{

	$fp = fsockopen($host, 80, $errno, $errstr, 10);
	if (!$fp)
	{
		echo "SocketError: $errstr ($errno)\n";
		return false;
	}
	$get = "GET $file HTTP/1.1\r\n"
	."Host: $host\r\n"
	."Connection: Close\r\n\r\n";

	fwrite($fp, $get);
	fclose($fp);
}

$file_hash = array (
array (
'in_folder'=>'../tiezi/js/',
'out_folder'=>'../online/tiezi/js/',
'in_file'=>'conf/editor.dev.js',
'out_file'=>'editor.js',
),
array (
'in_folder'=>'../tiezi/js/',
'out_folder'=>'../online/tiezi/js/',
'in_file'=>'conf/editor_mini.dev.js',
'out_file'=>'editor_mini.js',
),
array (
'in_folder'=>'../tiezi/js/',
'out_folder'=>'../online/tiezi/js/',
'in_file'=>'conf/map.dev.js',
'out_file'=>'map.js',
),
array (
'in_folder'=>'../tiezi/js/',
'out_folder'=>'../online/tiezi/js/',
'in_file'=>'conf/banzhu_info.dev.js',
'out_file'=>'banzhu_info.js',
),
array (
'in_folder'=>'../tiezi/js/',
'out_folder'=>'../online/tiezi/js/',
'in_file'=>'conf/intro.dev.js',
'out_file'=>'intro.js',
),
array (
'in_folder'=>'../tiezi/js/',
'out_folder'=>'../online/tiezi/js/',
'in_file'=>'conf/quick_reply.dev.js',
'out_file'=>'quick_reply.js',
),
array (
'in_folder'=>'../tiezi/js/',
'out_folder'=>'../online/tiezi/js/',
'in_file'=>'conf/table_list.dev.js',
'out_file'=>'table_list.js',
),
array (
'in_folder'=>'../tiezi/js/',
'out_folder'=>'../online/tiezi/js/',
'in_file'=>'conf/notereceived.dev.js',
'out_file'=>'notereceived.js',
),
array (
'in_folder'=>'../tiezi/js/',
'out_folder'=>'../online/tiezi/js/',
'in_file'=>'conf/killuser.dev.js',
'out_file'=>'killuser.js',
),
array (
'in_folder'=>'../tiezi/js/',
'out_folder'=>'../online/tiezi/js/',
'in_file'=>'conf/article_addM_video.dev.js',
'out_file'=>'article_addM_video.js',
),
);
for ($i = 0, $len = count($file_hash); $i < $len; $i++)
{
	$action = '?in_folder='.$file_hash[$i]['in_folder']
	.'&'.'out_folder='.$file_hash[$i]['out_folder']
	.'&'.'in_file='.$file_hash[$i]['in_file']
	.'&'.'out_file='.$file_hash[$i]['out_file'];
	get_file($_SERVER['HTTP_HOST'], '/bind/compile.php'.$action);
}
