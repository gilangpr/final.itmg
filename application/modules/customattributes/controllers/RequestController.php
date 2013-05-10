<?php 

class Customattributes_RequestController extends MyIndo_Controller_Action
{
	public function init()
	{
		$this->getInit(new Application_Model_InvestorCustomAttributes());
	}
	
	public function readAction()
	{
		MyIndo_Tools_Return::JSON($this->_data, $this->_error_code, $this->_error_message, $this->_success);
	}
}