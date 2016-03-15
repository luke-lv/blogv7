<?php
/**
 * Stores the definition of UNICODE converter in 'js-release2'.
 *
 * $HeadURL: https://svn.intra.sina.com.cn/app/tech/trunk/js_dev/bind/js-release2/jr2_UniCoder.class.php $
 *
 * @author    Snakevil, <yuyu1@staff.sina.com.cn>
 * @version   $Id: jr2_UniCoder.class.php 5133 2008-09-11 09:43:26Z yuyu1 $
 * @copyright (c) 2008 app.space.sina.com.cn.
 */
 /**
 * Represents a converter utility to transform Chinese characters to
 * UNICODEs.
 *
 * @package    js_dev
 * @subpackage js-release2
 */
final class jr2_UniCoder
{
	/**
	 * Stores the original input text blob.
	 *
	 * @var string
	 */
	private $mInput;

	/**
	 * Stores the encoding used for input text.
	 *
	 * @var string
	 */
	private $mInputEncoding;

	/**
	 * Stores the built output text blob.
	 *
	 * @var string
	 */
	private $mOutput;

	/**
	 * CONSTRUCTOR FUNCTION.
	 *
	 * @param  string $blob
	 * @param  string $inputEncoding
	 * @return void
	 */
	public function __construct($blob, $inputEncoding = 'UTF-8')
	{
		$this->mInput = $blob;
		$this->mInputEncoding = $inputEncoding;
		$this->mOutput = '';
	}

	/**
	 * Converts the input text blob and returns the result.
	 *
	 * @return string
	 */
	public function convert()
	{
		for ($ii = 0, $jj = mb_strlen($this->mInput, 'UTF-8'); $ii < $jj; $ii++)
		{
			$s_char = mb_substr($this->mInput, $ii, 1, 'UTF-8');
			if (1 != strlen($s_char))
			{
				$s_char = $this->convertWildCharacter($s_char);
			}
			$this->mOutput .= $s_char;
		}
		return $this->mOutput;
	}

	/**
	 * Converts one wild character and returns the result.
	 *
	 * @param  string $char
	 * @return string
	 */
	private function convertWildCharacter($char)
	{
		$char = base_convert(bin2hex($char), 16, 2);
		$char = substr($char, 4, 4).substr($char, 10, 6).substr($char, 18);
		$char = '\u'.strtoupper(base_convert($char, 2, 16));
		return $char;
	}
}
