<?php 
/**
 * Stores the definition of USING inheritance model in 'js-release2'.
 *
 * $HeadURL: https://svn.intra.sina.com.cn/app/tech/trunk/js_dev/bind/js-release2/jr2_Using.class.php $
 *
 * @author    Snakevil, <yuyu1@staff.sina.com.cn>
 * @version   $Id: jr2_Using.class.php 3915 2008-09-03 06:30:43Z yuyu1 $
 * @copyright (c) 2008 app.space.sina.com.cn.
 */
 /**
 * Represents the business model for USING inheritance.
 *
 * @package    js_dev
 * @subpackage js-release2
 */
final class jr2_Using extends jr2_Inheritance
{

	/**
	 * Stores the paths of loaded inheritances in the subst environment.
	 *
	 * @var array
	 */
	private $mLoadedPaths;

	/**
	 * CONSTRUCTOR FUNCTION.
	 *
	 * @param  jr2_Inheritance $master
	 * @param  string          $path
	 * @param  string          $prefix
	 * @return void
	 */
	public function __construct($master, $path, $prefix = '')
	{
		parent::__construct($master, $path, $prefix);
		$this->mLoadedPaths = array ();
	}

	/**
	 * Parses the specified file and stores the result in property 'mLines'.
	 *
	 * @return jr2_Using
	 */
	public function parse()
	{
		$o_using = $this->getMaster();

		while (null !== $o_using)
		{
			if ($this->mRelatedPath == $o_using->getRelatedPath())
			{
				$this->mStatus = self::ST_SKIPPED;
				return $this;
			}
			$o_using = $o_using->getMaster();
		}
		return parent::parse();
	}

	/**
	 * Registers loaded inheritance.
	 *
	 * For more information, see {@link jr2_Inheritance::registerLoaded}.
	 *
	 * @param  string    $path
	 * @return jr2_Using
	 */
	public function registerLoaded($path)
	{
		if ($this->isLoaded($path))
		{
			throw new Exception('File has loaded in this subst environment.', 0x81010004);
		}
		$this->mLoadedPaths[] = $path;
		return $this;
	}

	/**
	 * Detects whether specified inheritance has been loaded.
	 *
	 * For more information, see {@link jr2_Inheritance::isLoaded}.
	 *
	 * @param  string $path
	 * @return bool
	 */
	public function isLoaded($path)
	{
		return in_array($path, $this->mLoadedPaths, true);
	}

	/**
	 * Exports the combined result blob.
	 *
	 * For more information, see {@link jr2_Inheritance::export}.
	 *
	 * @return string
	 */
	public function export()
	{
		/*
		 const TP_USING = 1;
		 const TP_IMPORT = 2;
		 const ST_NORMAL = 0;
		 const ST_SKIPPED = 1;
		 const ST_BLANK = 2;
		 */
		$s_blob = '';
		$a_map = $this->getParentageMap();
		if ($this->getCFG()->getArgs('debug'))
		{
			for ($ii = 0, $jj = count($a_map); $ii < $jj; $ii++)
			{
				if ($ii)
				{
					$s_blob .= ' * '.str_repeat(' | ', ($a_map[$ii][3]-1)).' +-';
				}
				else
				{
					$s_blob = "\n * ";
				}
				$s_blob .= '['.(self::TP_IMPORT == $a_map[$ii][1]?'I':'U').']'.' '.$a_map[$ii][0];
				if (self::ST_BLANK == $a_map[$ii][2])
				{
					$s_blob .= ' (blank)';
				}
				elseif (self::ST_SKIPPED == $a_map[$ii][2])
				{
					$s_blob .= ' (skipped)';
				}
				if ($ii+1 != $jj)
				{
					$s_blob .= "\n";
				}
			}
			$s_blob = "/**\n"." * DEBUG: using: {$this->mRelatedPath}\n"." * {$s_blob}\n"." */\n";
		}
		if($this->getSuffix() == 'js') {
			$s_blob .= "function \$import() {};\nfunction \$using(){};\n";
		}

		if ($this->getCFG()->getArgs('out_prefix') != '')
		{
			$t_arr = array ();
			$last_level = -1;

			$script_path = $this->getCFG()->getArgs('out_prefix');
			$script_charset = $this->getCFG()->getArgs('out_charset');

			$s_blob .= $this->getWriteScript(null, $a_map, $t_arr, $last_level, $script_charset, $script_path, $this->getSuffix());
		}
		else
		{
			$s_blob .= parent::export();
		}
		return $s_blob;
	}

	/**
	 * Retrieves the parentage map of inheritance.
	 *
	 * For more information, see {@link jr2_Inheritance::getParentageMap}.
	 *
	 * @return array
	 */
	public function getParentageMap()
	{
		$a_map = array_merge( array ( array ($this->mRelatedPath, self::TP_USING, $this->mStatus, 0)), parent::getParentageMap());
		return $a_map;
	}




	/**
	 * 输出排序后的JavaScript标签
	 */
	private function getWriteScript($index, $tmp_arr, & $t_arr, & $last_level, $charset, $scriptpath, $file_suffix = 'js')
	{
	// 保存当前生成的结果
	$result = array();
	// $deep 用来保存当前的树结构
	$deep = array();
	$list = $tmp_arr;
	foreach($list as $key => $value){
			// 如果不是根节点，就判断和上一树节点的关系来处理
			if($value[3] != 0){
				// 取得和上一节点深度的差值
				$diff = $value[3] - $lastLevel;
				
				if($diff == 1){
					// 比上一节点深度大，先查找父文件所在位置，把当前文件放在父文件之前
					$parent = $deep[count($deep) - 1];
					$pos = array_search($parent, $result);
					// 树结构调整
					$deep[$value[3]] = $value[0];
				}else if($diff == 0){					
					// 查找上一个同级文件的位置，放在上一个同级文件之后
					$parent = $deep[count($deep) - 2];
					$pos = array_search($parent, $result);
					// 树结构调整
					$deep[$value[3]] = $value[0];
				}else{
					// 返回上一级文件，放在该级文件之后
					$parent = $deep[count($deep) + $diff - 2];
					$pos = array_search($parent, $result);
					// 树结构调整
					array_splice($deep, $diff);
					$deep[count($deep) - 1] = $value[0];
				}
				// 如果不是被忽略的文件
				if($value[2] == 0){
					array_splice($result, $pos, 1, array($value[0], $parent));
				}
			}else{
				array_push($result, $value[0]);
				array_push($deep, $value[0]);	
			}
			// 保存上一个被处理的树节点深度
			$lastLevel = $value[3];
	}
	foreach($result as $item => $url){
		$result[$item] = $scriptpath.$url;
		if($file_suffix == 'js') {
			$result[$item] = "document.write('<script src=\"".$result[$item]."?".time()."\" charset=\"".$charset."\"><' + '\/script>');\n";	
		}
		elseif($file_suffix == 'css') {
			$result[$item] = "<link rel=\"stylesheet\" src=\"".$result[$item]."\" charset=\"".$charset."\" />\n";
		}
	}
	return implode("", $result);
	}
}
