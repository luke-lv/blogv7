<?php
class CssPacker
{

	public function __construct($_css)
	{
		//去掉注释
		$_css = preg_replace('/\/\*[\d\D]+?\*\//i', '', $_css);
		//去掉换行符
		$_css = preg_replace('/[\n\r]*/i', '', $_css);
		//去掉{}内最后一个分号
		$_css = preg_replace('/;\s*?}/i', '', $_css);
		//去页面内编码格式
		$_css = preg_replace('/@charset "gb2312";/i', '', $_css);
		$_css = preg_replace('/@charset "utf-8";/i', '', $_css);
		$this->_css = $_css;
	}

	public function pack()
	{
		return $this->_css;
	}
}
?>
