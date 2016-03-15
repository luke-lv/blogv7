<?php 
/**
 * Stores the definition of abstract inheritance model in 'js-release2'.
 *
 * $HeadURL: https://svn.intra.sina.com.cn/app/tech/trunk/js_dev/bind/js-release2/jr2_Inheritance.class.php $
 *
 * @author    Snakevil, <yuyu1@staff.sina.com.cn>
 * @version   $Id: jr2_Inheritance.class.php 7026 2008-11-12 09:57:05Z yuyu1 $
 * @copyright (c) 2008 app.space.sina.com.cn.
 */
 /**
 * Declares the basic behaviors for all code fragments inheritances.
 *
 * @package    js_dev
 * @subpackage js-release2
 */
abstract class jr2_Inheritance {
    /**
     * Declares inheritance type 'USING' for reporting.
     */
    const TP_USING = 1;
    
    /**
     * Declares inheritance type 'IMPORT' for reporting.
     */
    const TP_IMPORT = 2;
    
    /**
     * Declares file reading status 'NORMAL' for reporting.
     */
    const ST_NORMAL = 0;
    
    /**
     * Declares file reading status 'SKIPPED' for reporting.
     */
    const ST_SKIPPED = 1;
    
    /**
     * Declares file reading status 'BLANK' for reporting.
     */
    const ST_BLANK = 2;
    
    /**
     * Stores the parent 'jr2_Inheritance'.
     *
     * @var jr2_Inheritance
     */
    protected $mParent;
    
    /**
     * Stores the children 'jr2_Inheritance' as array.
     *
     * @var array
     */
    protected $mChildren;
    
    /**
     * Stores the lines of blob as array.
     *
     * @var array
     */
    protected $mLines;
    
    /**
     * Stores the path prefix of each inheritance.
     *
     * @var string
     */
    protected $mBasicPath;
    
    /**
     * Stores the real, related path of this inheritance.
     *
     * @var string
     */
    protected $mRelatedPath;
    
    /**
     * Stores the character encoding used for the content blob.
     *
     * @var const
     */
    //	protected $mEncoding;
    
    /**
     * Stores the parsing status of this inheritance.
     *
     * @var const
     */
    protected $mStatus;

    
    /**
     * 存储输入文件后缀
     *
     * @var $mFileSuffix
     */
    protected $mFileSuffix;
    
    /**
     * Stores the name of the inheritance model which processing reversed
     * keyword 'import'.
     *
     * @var string
     */
    protected static $mImport = '';
    
    /**
     * Stores the name of the inheritance model which processing reversed
     * keyword 'using'.
     *
     * @var string
     */
    protected static $mUsing = '';

    
    protected $mCFG;

    
    /**
     * CONSTRUCTOR FUNCTION.
     *
     * @param  jr2_Inheritance $master
     * @param  string          $path
     * @param  string          $prefix
     * @param  string          $keyword
     * @return void
     */
    public function __construct($master, $path, $prefix = '') {
    
        if (!is_string($path)) {
            $path = strval($path);
        }
        if (!is_string($prefix)) {
            $prefix = strval($prefix);
        }
        $this->mRelatedPath = $path;
        $this->mBasicPath = $prefix;
        $this->mChildren = array();
        $this->mLines = array();
        if ($master instanceof jr2_Inheritance) {
            $this->mParent = $master;
        }
        else {
            $this->mParent = null;
        }
        $this->mStatus = self::ST_NORMAL;
        
        $this->mCFG = jr2_Configuration::getInstance();
    }
    
    /**
     * Retrieves the related path of this inheritance.
     *
     * @return string
     */
    public function getRelatedPath() {
        return $this->mRelatedPath;
    }
    
    public function getCFG() {
        return $this->mCFG;
    }
    
    /**
     * Retrieves the parent inheritance which owning this one.
     *
     * @return jr2_Inheritance
     */
    public function getMaster() {
        return $this->mParent;
    }
    
    public function getSuffix() {
    
        return $this->mFileSuffix;
    }
    
    /**
     * Registers the inheritance model which processing reversed keyword
     * 'using'.
     *
     * @param  string $name
     * @return bool
     */
    static public function registerUsingModel($name) {
        if (!class_exists($name) || !is_subclass_of($name, 'jr2_Inheritance')) {
            throw new Exception("USING model '{$name}' does not obey the standard.", 0x81010001);
        }
        self::$mUsing = $name;
        return true;
    }
    
    /**
     * Registers the inheritance model which processing reversed keyword
     * 'import'.
     *
     * @param  string $name
     * @return bool
     */
    static public function registerImportModel($name) {
        if (!class_exists($name) || !is_subclass_of($name, 'jr2_Inheritance')) {
            throw new Exception("IMPORT model '{$name}' does not obey the standard.", 0x81010002);
        }
        self::$mImport = $name;
        return true;
    }
    
    /**
     * Parses the specified file and stores the result in property 'mLines'.
     *
     * @return jr2_Inheritance
     */
    public function parse() {
        // FIXME Worse idea, worse implementation.
        if ('.js' != substr($this->mRelatedPath, -3) && '.css' != substr($this->mRelatedPath, -4)) {
            throw new Exception("File '{$this->mRelatedPath}' cannot be read.", 0x81010003);
        }
        else {
            if ('.js' == substr($this->mRelatedPath, -3)) {
            
                $this->mFileSuffix = "js";
            }
            if ('.css' == substr($this->mRelatedPath, -4)) {
            
                $this->mFileSuffix = "css";
            }
        }
        
        $a_lines = @file($this->mBasicPath.'/'.$this->mRelatedPath);
        if (false === $a_lines) {
            throw new Exception("File '{$this->mRelatedPath}' cannot be read.", 0x81010003);
        }
        if (1 == count($a_lines) && '' == $a_lines[0]) {
            $this->mStatus = self::ST_BLANK;
            return $this;
        }
        for ($ii = 0, $jj = count($a_lines); $ii < $jj; $ii++) {
            $a_lines[$ii] = rtrim($a_lines[$ii]);
            if ('' == $a_lines[$ii]) {
                continue;
            }
            $kk = array();
            if ($this->mCFG->getArgs('import')) {
                if ((preg_match('@^\s*\$(import|using)\(\s*(\'|")(.+)\2\s*\)\s*;?\s*$@', $a_lines[$ii], $kk) && 'js' == $this->mFileSuffix) || (preg_match('@^\s*\@(import|using)\s*(\'|")(.+)\2\s*\s*;?\s*$@', $a_lines[$ii], $kk) && 'css' == $this->mFileSuffix)) {
                    if ('import' == $kk[1] && self::$mImport) {

                    
//                        $gets = $_GET['skip'];
//                        if (!preg_match('/^'.$gets.'/', $kk[3])) {
	                        $a_lines[$ii] = new self::$mImport($this, $kk[3], $this->mBasicPath);
	                        $this->mChildren[] = $a_lines[$ii];
//                        }
                    }
                    elseif ('using' == $kk[1] && self::$mUsing) {
                    
                        $a_lines[$ii] = new self::$mUsing($this, $kk[3], $this->mBasicPath);
                        $this->mChildren[] = $a_lines[$ii];
                    }
                }
            }
            $this->mLines[] = $a_lines[$ii];
        }
        
        if (!count($this->mLines)) {
            $this->mStatus = self::ST_BLANK;
            return $this;
        }
        for ($ii = 0, $jj = count($this->mChildren); $ii < $jj; $ii++) {
            $this->mChildren[$ii]->parse();
            
        }
        return $this;
    }
    
    /**
     * Exports the combined result blob.
     *
     * @return string
     */
    public function export() {
        $s_blob = '';
        $packed = $this->mCFG->getArgs('packed');
        $out_charset = $this->mCFG->getArgs('out_charset');
        $s_tmp = '';
        for ($ii = 0, $jj = count($this->mLines); $ii < $jj; $ii++) {
            $kk = $this->mLines[$ii];
            if ($kk instanceof jr2_Inheritance) {
                if ($s_tmp) {
                    if ($packed >= 0) {
                        if ('js' == $this->mFileSuffix) {
                            $o_packer = new JavaScriptPacker($s_tmp, $packed);
                            $s_blob .= $o_packer->pack();
                        }
                        if ('css' == $this->mFileSuffix) {
                            $o_packer = new CssPacker($s_tmp);
                            $s_blob .= $o_packer->pack();
                        }
                    }
                    else {
                        $s_blob .= $s_tmp;
                    }
                }
                $s_blob .= $kk->export();
            }
            else {
                $s_tmp .= $kk."\n";
            }
            
        }
        if ($s_tmp) {
            if ($packed >= 0) {
                if ('js' == $this->mFileSuffix) {
                    $o_packer = new JavaScriptPacker($s_tmp, $packed);
                    $s_blob .= $o_packer->pack()."\n";
                }
                if ('css' == $this->mFileSuffix) {
                    $o_packer = new CssPacker($s_tmp);
                    $s_blob .= $o_packer->pack()."\n";
                    
                }
            }
            else {
                $s_blob .= $s_tmp;
            }
        }
        
        if (!$this->mParent instanceof jr2_Inheritance && 'css' == $this->mFileSuffix) {
            $s_blob = "@charset \"".$out_charset."\";\n".$s_blob;
            
        }
        return $s_blob;
    }
    
    /**
     * Retrieves the parentage map of inheritance.
     *
     * The return value should match the following syntax:
     * <PRE>
     * array(0 => array(0 => "Inherited File Related Path",
     *                  1 => "Inheritance Type",
     *                  2 => "File Reading Status",
     *                  3 => "Sub-Level Depth"),
     *       .
     *       .
     *       .
     *      );
     * </PRE>
     *
     * @return array
     */
    public function getParentageMap() {
        $a_map = array();
        for ($ii = 0, $jj = count($this->mChildren); $ii < $jj; $ii++) {
            $a_map = array_merge($a_map, $this->mChildren[$ii]->getParentageMap());
        }
        for ($ii = 0, $jj = count($a_map); $ii < $jj; $ii++) {
            $a_map[$ii][3]++;
        }
        return $a_map;
    }
    
    //	public function getEncoding ()
    //	{
    //		return $this->mEncoding;
    //	}
    
    /**
     * Registers loaded inheritance.
     *
     * @param  string          $path
     * @return jr2_Inheritance
     */
    abstract public function registerLoaded($path);
    
    /**
     * Detects whether specified inheritance has been loaded.
     *
     * @param  string $path
     * @return bool
     */
    abstract public function isLoaded($path);
}
