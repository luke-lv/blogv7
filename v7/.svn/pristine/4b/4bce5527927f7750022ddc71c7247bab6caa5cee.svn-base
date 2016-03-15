<?php
error_reporting(E_ALL);
main();
function main()
{
	header('Content-Type: text/plain; Charset=UTF-8');


	$base_path = 'http://'.$_SERVER['HTTP_HOST'].'/';

	if ( isset ($_GET['in_folder']) == false
	|| isset ($_GET['out_folder']) == false
	|| isset ($_GET['in_file']) == false
	|| isset ($_GET['out_file']) == false)
	{
		echo '/*Error Get Args*/';
		exit ;
	}


	$in_folder = $_GET['in_folder'];
	$out_folder = $_GET['out_folder'];

	$in_file = $_GET['in_file'];
	$out_file = $_GET['out_file'];
	$url = $base_path.'bind/bind.php?dev_path='.$in_file.'&dev_prefix='.$in_folder.'&packed=0&unicode=true';


	$content = file_get_contents($url);

	makedir($out_folder);

	$fp = fopen($out_folder.$out_file, 'w');
	fwrite($fp, $content);
	fclose($fp);


	echo 1111;
}
// 建立目录夹
function makedir($dir, $mode = "0777")
{
	if (!$dir)
	{
		return 0;
	}
	$dir = str_replace("\\", "/", $dir);

	$mdir = "";
	foreach (explode("/", $dir) as $val)
	{
		$mdir .= $val."/";
		if ($val == ".." || $val == ".")
		{
			continue ;
		}

		if (!file_exists($mdir))
		{
			if (!@mkdir($mdir, $mode))
			{
				echo "创建目录 [".$mdir."]失败.";
				exit ;
			}
		}
	}
	return true;
}
