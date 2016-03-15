<?php
require_once 'jr2_inc/jr2_Configuration.class.php';
require_once 'jr2_inc/jr2_Inheritance.class.php';
require_once 'jr2_inc/jr2_Import.class.php';
require_once 'jr2_inc/jr2_Using.class.php';

require_once 'packer/class.JavaScriptPacker.php';
require_once 'packer/class.CssPacker.php';
checkByteOrder();
jr2_main();
function jr2_main()
{
	error_reporting(E_ALL);
	ini_set('include_path', '.');


	$f_ts_beginning = microtime(true);

	$o_cfg = jr2_Configuration::getInstance();

	header('Content-Type: text/plain; Charset='.$o_cfg->getArgs('out_charset'));

	jr2_Inheritance::registerImportModel('jr2_Import');
	jr2_Inheritance::registerUsingModel('jr2_Using');

	$o_release = @ new jr2_Using(null, $o_cfg->getArgs('dev_path'), $o_cfg->getArgs('dev_prefix'));
	try
	{
		$s_blob = $o_release->parse()->export();
		$s_blob = @iconv(mb_detect_encoding($s_blob, "utf16, utf8, gbk"), $o_cfg->getArgs('out_charset'), $s_blob);

		if ($o_cfg->getArgs('unicode'))
		{
			$s_blob = escape($s_blob);
		}
	}
	catch(Exception $ex)
	{
		// FIXME
		if ($o_cfg->getArgs('debug'))
		{
			$s_blob = "// ".$ex->getMessage();
		}
		else
		{
			exit ();
		}
	}
	
	$s_elapsed = number_format(microtime(true)-$f_ts_beginning, 4);
	$s_action = 'Built';

	if ($o_cfg->getArgs('debug'))
	{
		echo "/* {$s_action}: {$s_elapsed} seconds costed. */\n";
		echo "/* byte_order: {$GLOBALS['BYTE_ORDER']} */\n";
	}
	echo $s_blob;
}

function escape($str)
{
	function _escape($matches)
	{
		$hex_str = bin2hex(iconv("UTF-8", "UCS-2", $matches[0]));

		if ($GLOBALS["BYTE_ORDER"] == "BIG")
		{
			$arr = str_split($hex_str, 4);
		}
		else
		{
			$arr = array ();
			$_arr = str_split($hex_str, 2);
			for ($i = 0; $i < count($_arr); $i += 2)
			{
				array_push($arr, $_arr[$i+1].$_arr[$i]);
			}
		}
		$str = implode("\u", $arr);
		return $str?"\u".$str:"";
	}
	return preg_replace_callback("/[\x01-\x08\x0b\x0c\x0e-\x1f\x7f-\xff^]+/", "_escape", $str);
}

function checkByteOrder()
{
	if (bin2hex(iconv("UTF-8", "UCS-2", "函")) == "51fd")
	{
		$GLOBALS["BYTE_ORDER"] = "BIG";
	}
	else
	{
		$GLOBALS["BYTE_ORDER"] = "LITTLE";
	}
}
