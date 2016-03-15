<?php
final class jr2_Configuration
{
	
	private static $mInstace;
	private $oCFG;
	private $mParams;



	private function __construct()
	{

		$_CONFIG = array ();
		$this->oCFG = array ();
		if (file_exists('bind.cfg.php') && is_file('bind.cfg.php'))
		{
			require 'bind.cfg.php';
		}
		$this->prepareArgs($_CONFIG);

		$this->prepareAllArgs($this->oCFG, $_CONFIG, "dev_path", '');
		$this->prepareAllArgs($this->oCFG, $_CONFIG, "dev_prefix", '');
		$this->prepareAllArgs($this->oCFG, $_CONFIG, "packed", -1, 'number');
		$this->prepareAllArgs($this->oCFG, $_CONFIG, "debug", true, 'boolean');
		$this->prepareAllArgs($this->oCFG, $_CONFIG, "unicode", false, 'boolean');
		$this->prepareAllArgs($this->oCFG, $_CONFIG, "import", true, 'boolean');
		$this->prepareAllArgs($this->oCFG, $_CONFIG, "out_charset", 'UTF-8');
		$this->prepareAllArgs($this->oCFG, $_CONFIG, "out_prefix", '');


		$this->prepareAnalyze();
	}


	private function prepareAnalyze()
	{
		if (!file_exists($this->oCFG['dev_prefix']) || !is_dir($this->oCFG['dev_prefix']))
		{
			$this->oCFG['dev_prefix'] = dirname( __FILE__ );
		}
		$this->oCFG['dev_prefix'] = realpath($this->oCFG['dev_prefix']);
	}

	private function prepareAllArgs( &$scfg, $ocfg, $name, $dval, $type = 'string')
	{
		
		@$val = $this->mParams['-'.$name];
		if ( isset ($val))
		{
			$rval = $val;
		}
		else
		{
			@$val = $_GET[$name];
			if ( isset ($val))
			{
				
				$rval = $val;
			}
			else
			{
				@$val = $ocfg[$name];
				if ( isset ($val))
				{
					
					$rval = $val;
				}
				else
				{
					$rval = $dval;
				}
			}
		}
		
		if ($type == 'string')
		{
			$scfg[$name] = $rval;
		}
		elseif ($type == 'boolean')
		{
			$scfg[$name] = $rval == 'true';
		}
		elseif ($type == 'number')
		{
			$scfg[$name] = intval($rval);
		}
	}


	private function isParam($string)
	{
		return substr($string, 0, 1) == "-"?true:false;
	}

	private function prepareArgs($config)
	{
		global $argv;
		global $argc;

		$i = 1;
		$params = array ();
		for ($i = 1; $i < $argc; $i++)
		{
			if ($this->isParam($argv[$i]))
			{
				$paramName = $argv[$i];
				$paramVal = (!$this->isParam($argv[$i+1]))?$argv[$i+1]:null;

				$params[$paramName] = $paramVal;
			}
		}
		$this->mParams = $params;
		return $this;
	}
	
	public function getArgs($argname)
	{
		return $this->oCFG[$argname];
	}
	
	static public function getInstance()
	{

		if (null === jr2_Configuration::$mInstace)
		{
			jr2_Configuration::$mInstace = new jr2_Configuration();
		}
		return jr2_Configuration::$mInstace;
	}
}
