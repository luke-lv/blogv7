<?php
error_reporting(E_ALL);
main();
function main()
{
	header('Content-Type: text/plain; Charset=UTF-8');

	$_CONFIG = array ();
	if (file_exists('mode.cfg.php') && is_file('mode.cfg.php'))
	{
		require 'mode.cfg.php';
	}
	if ( isset ($_GET["action"]) == false || isset ($_GET["product"]) == false)
	{
		echo '/*Error Get Args*/';
		exit ;
	}

	// 读写动作,取值 get | set
	$action = @strtolower($_GET["action"]);
	// 产品名, 取值为各产品英文名
	$product = @strtolower($_GET["product"]);

	// 支持传入参数
	$varname = @$_GET["varname"];

	// debug模式,取值为1-4
	$mode = @intval(strtolower($_GET["mode"]));
	$mode = $mode == 0?1:$mode;



	if ($action == 'get')
	{
		echo getVal($_CONFIG, $product, $varname, $mode);
	}
	elseif ($action == 'set')
	{
		@file_put_contents("mode.cfg.php", setVal($_CONFIG, $product, $varname, $mode)."\r\n");
		echo getVal($_CONFIG, $product, $varname, $mode);
	}
	modifyBootJS($mode, $_CONFIG, $product);

}

function getVal( & $_CONFIG, $product, $varname, $mode)
{
	if (array_key_exists($product, $_CONFIG))
	{
		$val = "{'boot_mode': ".$_CONFIG[$product]['boot_mode'].", 'boot_path': '".$_CONFIG[$product]['boot_path']."', 'product': '".$product."'}";
	}
	else
	{
		$val = '{}';
	}
	if ( isset ($varname))
	{
		$val = $varname.' = '.$val.';';
	}
	return $val;
}


function setVal( & $_CONFIG, $product, $varname, $mode)
{
	if (array_key_exists($product, $_CONFIG))
	{
		$_CONFIG[$product]['boot_mode'] = $mode;
	}
	return "<?php\n\$_CONFIG = ".var_export($_CONFIG, true).';';
}

function modifyBootJS($mode, $_CONFIG, $product)
{
	$filepath = $_SERVER['DOCUMENT_ROOT'].$_CONFIG[$product]['boot_path'];
	$content = file_get_contents($filepath);

	$mode = $mode < 5?'true':'false';

	echo "\n/*DebugMode: ".$mode."*/";

	$pattern = "@(.*_debug_mode\s*=\s*)(\w+)(;*)@";
	$replacement = "\${1}".$mode."\${3}";

	$content = preg_replace($pattern, $replacement, $content);

	file_put_contents($filepath, $content);
}
