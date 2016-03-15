<?php
header('Content-Type: text/plain; Charset=UTF-8');

$mode = @$_GET['mode'];

if ( isset ($mode) == false || $mode == "")
{
	echo "缺少参数: mode: (online|dev|delete)";
	exit ;
}
main();
function main()
{
	global $mode;

	$_CONFIG = array ();
	if (file_exists('mode.cfg.php') && is_file('mode.cfg.php'))
	{
		require 'mode.cfg.php';
	}
	// 本机的开发目录
	$wock_path = $_CONFIG['workpath'];


	switch(strtolower($mode))
	{
		case 'dev':
		default:
			$shell_cmd = 'junction.exe ../sjs.sinajs.cn "'.$wock_path.'"';
			break;
		case 'online':
			$shell_cmd = 'junction.exe ../sjs.sinajs.cn "'.$wock_path.'\online"';
			break;
		case 'delete':
			$shell_cmd = 'junction.exe ../sjs.sinajs.cn -d';
	}
	$output = shell_exec($shell_cmd);
	echo '/*' . $output . '*/';
}
