<?php
/**
 * 合并JS文件
 * @author Qiangyee
 * @date   2013-3-18
 */
error_reporting(E_ALL);
main();
function main()
{
	header('Content-Type:text/plain;charset=UTF-8');
	
	$base_path = 'http://'.$_SERVER['HTTP_HOST'].'/';

	if ( isset ($_GET['root']) == false )
	{
		echo '/*Error Get Args*/';
		echo 'alert("指定工程路径！");';
		exit ;
	}

	// 读取文件路径
	$root = $_GET['root'];
	
	// build.xml文件路径
	$xmlfile = '../' . $root . '/build.xml';
	
	// 获取build.xml文件内容
	$feed = file_get_contents($xmlfile);
	
	// 读取build XML concat文件的值
	$xml = new SimpleXMLElement($feed);
	// 读取path
	$pathes = $xml -> xpath('/project/target/concat/path');
	
	// 
	$content  = "// ===============================\r\n"
				. "// 合并文件:\r\n";
	$filepath = "";
	$filetxt  = "";
	
	foreach ($pathes as $path)
	{
		$filepath = str_replace("\${src.dir}", $root . "/src", $path["path"]);
		$content .= "// " . $filepath . "\r\n";
		// 按path配置顺序合并
		$file_content = file_get_contents("../" . $filepath);
		$filetxt = $filetxt . $file_content . "\r\n";
	}
	$content .= "// ===============================\r\n";
	// 
	echo $content . $filetxt;
}

