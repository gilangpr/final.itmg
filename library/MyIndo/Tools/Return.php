<?php 

class MyIndo_Tools_Return
{
	public static function makePassword($input)
	{
		return sha1(md5(sha1($input).md5($input).$input).$input);
	}
	
	public static function JSON($data, $error_code = 0, $error_message = "", $success = true)
	{
		$has_access = true;
		
		$data['error_code'] = $error_code;
		$data['error_message'] = $error_message;
		$data['has_access'] = $has_access;
		$data['success'] = $success;
		echo Zend_Json::encode($data);
	}
}