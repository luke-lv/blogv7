<?php
error_reporting(E_ALL);
$DR = $_SERVER['DOCUMENT_ROOT'].'/';
main();
function main()
{
    global $DR;
	header('Content-Type: text/plain; Charset=UTF-8');
	header('Cache-Control: max-age=0');
    // max-age=86400
	$_CONFIG = array ();
	if (file_exists('mode.cfg.php') && is_file('mode.cfg.php'))
	{
		require 'mode.cfg.php';
	}

	// 产品名, 取值为各产品英文名
	$product = @strtolower($_GET["product"]);

	// 页面ID
	$pageid = @$_GET["pageid"];

	// 开发模式
	$mode = @$_GET["mode"];

	if (!$mode) {
		$mode = 3;
	}
//	if ( isset ($mode) == false || $mode == "")
//	{
//		echo "缺少参数 mode: (1, 2, 3, 4)";
//		exit ;
//	}
	if ( isset ($pageid) == false || $pageid == "")
	{
		echo "缺少参数 pageid: (页面的唯一ID,对应的是js/conf/ 'pageid' .dev.js)";
		exit ;
	}
	if ( isset ($product) == false || $product == "")
	{
		echo "缺少参数  product: ('blog', 'tiezi', 'space' ...)";
		exit ;
	}

	$mode = isset ($mode) == false ? $_CONFIG[$product]['boot_mode']: $mode;
	$mode = intval($mode);


	$base_path = 'http://'.$_SERVER['HTTP_HOST'].'/';
	switch($mode){
		case 1:
		default:
			$_GET['dev_path'] = 'conf/'.$pageid.'.dev.js';
			$_GET['dev_prefix'] = $DR.$product;
			$_GET['out_prefix'] = $base_path.$product.'/';
			$_GET['debug'] = 'true';
			break;
		case 2:
			$_GET['dev_path'] = 'conf/'.$pageid.'.dev.js';
			$_GET['dev_prefix'] = $DR.$product;
			$_GET['debug'] = 'true';
			$_GET['out_prefix'] = $base_path.'bind/index.php%3fdebug%3dtrue%26import%3dfalse%26packed%3d0%26dev_prefix%3d../'.$product.'%26dev_path=';
			break;
		case 3:
			$_GET['dev_path'] = 'conf/'.$pageid.'.dev.js';
			$_GET['dev_prefix'] = $DR.$product;
			$_GET['debug'] = 'true';
			break;
		case 4:
			$_GET['dev_path'] = 'conf/'.$pageid.'.dev.js';
			$_GET['dev_prefix'] = $DR.$product;
			$_GET['debug'] = 'true';
			$_GET['packed'] = 0;
			break;
	}
	$dev_prefix = $_GET['dev_prefix'];
	$dev_path = $_GET['dev_path'];
    // 更改配置文件路径，不一定为xxx.dev.js
	if(!file_exists($_GET['dev_prefix'].'/'.$_GET['dev_path']))
	{
		if(file_exists($dev_prefix.'/conf/'.$pageid.'.js'))
		{
			$_GET['dev_path'] = 'conf/'.$pageid.'.js';
		} 
		elseif(file_exists($dev_prefix.'/publish_mini/'.$dev_path))
		{
			$_GET['dev_prefix'] = $dev_prefix . '/publish_mini';
		}
		else
		{
			$_GET['dev_path'] = $pageid.'.js';
		}
	}

	require_once 'bind.php';
}
