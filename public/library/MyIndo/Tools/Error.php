<?php 

class MyIndo_Tools_Error
{
	
	public static function getErrorMessage($error_no)
	{
		$errors = array(
				'101' => 'ID not found.',
				'201' => 'Data already exist.',
				'202' => 'Data is being used.',
				'901' => 'Invalid Request.',
				'902' => 'File type not allowed'
		);
		
		if(isset($errors[$error_no])) {
			return $errors[$error_no];
		} else {
			return 'Unhandled exception.';
		}
	}
}