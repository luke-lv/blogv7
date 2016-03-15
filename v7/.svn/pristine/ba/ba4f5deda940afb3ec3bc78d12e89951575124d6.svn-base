<?php

/**
 * Stores the definition of IMPORT inheritance model in 'js-release2'.
 *
 * $HeadURL: https://svn.intra.sina.com.cn/app/tech/trunk/js_dev/bind/js-release2/jr2_Import.class.php $
 *
 * @author    Snakevil, <yuyu1@staff.sina.com.cn>
 * @version   $Id: jr2_Import.class.php 9195 2009-01-23 05:33:59Z fangchao $
 * @copyright (c) 2008 app.space.sina.com.cn.
 */
 /**
 * Represents the business model for IMPORT inheritance.
 *
 * @package    js_dev
 * @subpackage js-release2
 */
final class jr2_Import extends jr2_Inheritance
{
	/**
	 * Parses the specified file and stores the result in property 'mLines'.
	 *
	 * @return jr2_Import
	 */
	public function parse()
	{
		try
		{
			$this->registerLoaded($this->mRelatedPath);
			parent::parse();
		}
		catch(Exception $ex)
		{
			$this->mStatus = self::ST_SKIPPED;
			if (4 != 0xFFFF & $ex->getCode())
			{
				throw $ex;
			}
		}
	}

	/**
	 * Registers loaded inheritance.
	 *
	 * For more information, see {@link jr2_Inheritance::registerLoaded}.
	 *
	 * @param  string     $path
	 * @return jr2_Import
	 */
	public function registerLoaded($path)
	{
		$this->mParent->registerLoaded($path);
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
		return $this->mParent->isLoaded($path);
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
		$s_blob = '';
		
		if (jr2_Configuration::getInstance()->getArgs('debug') && $this->mStatus == 0)
		{
			$s_blob = "/********************************* DEBUG *******************************************\n";
			$s_blob .= " * \$import: {$this->mRelatedPath}\n";
			$s_blob .= " **********************************************************************************/\n";
		}
		$s_blob .= parent::export();
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
		$a_map = array_merge( array ( array ($this->mRelatedPath, self::TP_IMPORT, $this->mStatus, 0)), parent::getParentageMap());
		return $a_map;
	}
}
