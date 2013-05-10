<?php 

class MyIndo_Controller_Action extends Zend_Controller_Action
{
	protected $_model;
	protected $_limit;
	protected $_start;
	protected $_posts;
	protected $_error_code;
	protected $_error_message;
	protected $_success;
	protected $_data;
	protected $_date;
	protected $_list;
	protected $_count;
	
	public function getInit($model)
	{
		$this->_helper->layout()->disableLayout();
		$this->_helper->viewRenderer->setNoRender(true);
		$this->_model = $model;
		
		if($this->getRequest()->isPost()) {
			$this->_posts = $this->getRequest()->getPost();
		} else {
			$this->_posts = array();
		}
		
		$this->_start = (isset($this->_posts['start'])) ? $this->_posts['start'] : 0;
		$this->_limit = (isset($this->_posts['limit'])) ? $this->_posts['limit'] : $this->view->default_limit;
		
		$this->_error_code = 0;
		$this->_error_message = '';
		$this->_success = true;
		
		$this->_date = date('Y-m-d H:i:s');
		$this->_list = array();
		$this->_count = 0;
		
		$this->_data = array(
				'data' => array(
						'items' => $this->_list,
						'totalCount' => $this->_count
				)
		);
	}
	
	protected function isPost()
	{
		return $this->getRequest()->isPost();
	}
	
	protected function isAjax()
	{
		return $this->getRequest()->isXmlHttpRequest();
	}
	
	protected function json()
	{
		MyIndo_Tools_Return::JSON($this->_data, $this->_error_code, $this->_error_message, $this->_success);
	}
	
	protected function error($code)
	{
		$this->_error_code = $code;
		$this->_error_message = MyIndo_Tools_Error::getErrorMessage($this->_error_code);
		$this->_success = false;
	}
}