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
	protected $_sort;
	protected $_page;
	
	public function getInit($model = null)
	{
		$this->_helper->layout()->disableLayout();
		$this->_helper->viewRenderer->setNoRender(true);
		if($model != null) {
			$this->_model = $model;
		}
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
		if(isset($this->_posts['sort'])) {
			$sort = Zend_Json::decode($this->_posts['sort']);
			$this->_sort = $sort[0]['property'] . ' ' . $sort[0]['direction'];
		}

		$this->_page = 1;
		if(isset($this->_posts['page']) && is_numeric($this->_posts['page'])) {
			$this->_page = (int)$this->_posts['page'];
			if($this->_page == 0) {
				$this->_page = 1;
			}
		}
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