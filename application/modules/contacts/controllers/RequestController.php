<?php 

class Contacts_RequestController extends MyIndo_Controller_Action
{
	protected $_model;
	protected $_limit;
	protected $_start;
	protected $_posts;
	protected $_error_code;
	protected $_error_message;
	protected $_success;
	protected $_data;
	
	public function init()
	{
		$this->_helper->layout()->disableLayout();
		$this->_helper->viewRenderer->setNoRender(true);
		$this->_model = new Application_Model_Contacts();
		if($this->getRequest()->isPost()) {
			$this->_posts = $this->getRequest()->getPost();
		} else {
			$this->_posts = array();
		}
		
		$this->_start = (isset($this->_posts['start'])) ? $this->_posts['start'] : 0;
		$this->_limit = (isset($this->_posts['limit'])) ? $this->_posts['limit'] : 25;
		
		$this->_error_code = 0;
		$this->_error_message = '';
		$this->_success = true;

		$this->_data = array(
			'data' => array(
				'items' => array(),
				'totalCount' => 0
				)
			);
	}
	public function createAction()
	{
		$data = array(
			'data' => array()
		);
		$modelInvestors = new Application_Model_Investors();
		try {
			// Insert Data :
			$investor_id = $this->_getParam('id',0);
			if($modelInvestors->isExistByKey('INVESTOR_ID', $investor_id)) {
 			$this->_model->insert(array(
					'INVESTOR_ID'=>$investor_id,
					'NAME'=>$this->_posts['NAME'],
					'PHONE_1'=>$this->_posts['PHONE_1'],
					'PHONE_2'=>$this->_posts['PHONE_2'],
					'EMAIL'=>$this->_posts['EMAIL'],
					'ADDRESS'=>$this->_posts['ADDRESS'],
					'SEX'=>$this->_posts['SEX'],
					'POSITION'=>$this->_posts['POSITION'],
 					'CREATED_DATE' => date('Y-m-d H:i:s')
 					));
 			$modelInvestors->update(array(
 					'MODIFIED_DATE' => date('Y-m-d H:i:s')
 				),$modelInvestors->getAdapter()->quoteInto('INVESTOR_ID = ?', $investor_id));
			}
			else {
				$this->_error_code = 404;
				$this->_error_message = 'INVESTOR_ID NOT FOUND';
				$this->_success = false;
			}
		}catch(Exception $e) {
			$this->_error_code = $e->getCode();
			$this->_error_message = $e->getMessage();
			$this->_success = false;
		}
		
		MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}
	public function readAction()
	{
		if($this->isPost() && $this->isAjax()) {
			$investor_id = (isset($this->_posts['id'])) ? $this->_posts['id'] : 0;
			if($investor_id > 0) {
				$mInvestors = new Application_Model_INvestors();
				if($mInvestors->isExistByKey('INVESTOR_ID', $investor_id)) {
					$q = $this->_model->select()->where('INVESTOR_ID = ?', $investor_id);
					$list = $q->query()->fetchAll();
				}
			} else {
				$q = $this->_model->select();
				if(isset($this->_posts['sort'])) {
					$q->order($this->_sort);
				}
				if(isset($this->_posts['query'])) {
					$q->where('NAME LIKE ?', '%' . $this->_posts['query'] . '%');
				}
				$list = $q->query()->fetchAll();
			}
			$this->_data['data']['items'] = $list;
			$this->_data['data']['totalCount'] = count($list);
		} else {
			$this->error(901);
		}
		$this->json();
		// $data = array(
		// 	'data' => array(
		// 		'items' => array(),
		// 		'totalCount' => 0
		// 	)
		// );
		// $modelInvestors = new Application_Model_Investors();
		// $investor_id = (isset($this->_posts['id'])) ? $this->_posts['id'] : 0;
		// if($investor_id > 0) {
		// if($modelInvestors->isExistByKey('INVESTOR_ID', $investor_id)) {
		// 	$list = $this->_model->select()->where('INVESTOR_ID = ?', $investor_id);
		// 	$list = $list->query()->fetchAll();
		// }} else {
		// 	$list = $this->_model->select();
		// 	$list = $list->query()->fetchAll();
		// }
		// $data = array(
		// 		'data' => array(
		// 				'items' => $list,
		// 				'totalCount' => count($list)
		// 		)
		// );
		// MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}

	public function updateAction()
	{	//update in Body
		$data = array(
				'data' => array()
		);

	   
		$data = $this->getRequest()->getRawBody();//mengambil data json
		$data = Zend_Json::decode($data);//merubah data json menjadi array
		$id = $data['data']['CONTACT_ID'];
		$modelInvestors = new Application_Model_Investors();
		try {
			
			$this->_model->update(array(
					'NAME' => $data['data']['NAME'],
					'POSITION' => $data['data']['POSITION'],
					'EMAIL'=>$data['data']['EMAIL'],
					'PHONE_1'=>$data['data']['PHONE_1']
			),$this->_model->getAdapter()->quoteInto('CONTACT_ID = ?', $id));
			$modelInvestors->update(array(
 					'MODIFIED_DATE' => date('Y-m-d H:i:s')
 				),$modelInvestors->getAdapter()->quoteInto('INVESTOR_ID = ?', $data['data']['INVESTOR_ID']));
			
		}catch(Exception $e) {
			$this->_error_code = $e->getCode();
			$this->_error_message = $e->getMessage();
			$this->_success = false;
		}
	
	MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}

	public function updatingAction()
	{	//update in form
		$data = array(
				'data' => array()
		);

	   
		//$data = $this->getRequest()->getRawBody();//mengambil data json
		//$data = Zend_Json::decode($data);//merubah data json menjadi array
		$id = $this->_posts['CONTACT_ID'];
		$modelInvestors = new Application_Model_Investors();
		try {
			
			$this->_model->update(array(
					//'INVESTOR_ID'=>$investor_id,
					'NAME'=>$this->_posts['NAME'],
					'PHONE_1'=>$this->_posts['PHONE_1'],
					'PHONE_2'=>$this->_posts['PHONE_2'],
					'EMAIL'=>$this->_posts['EMAIL'],
					'ADDRESS'=>$this->_posts['ADDRESS'],
					'SEX'=>$this->_posts['SEX'],
					'POSITION'=>$this->_posts['POSITION'],
			),$this->_model->getAdapter()->quoteInto('CONTACT_ID = ?', $id));
			$modelInvestors->update(array(
 					'MODIFIED_DATE' => date('Y-m-d H:i:s')
 				),$modelInvestors->getAdapter()->quoteInto('INVESTOR_ID = ?', $this->_posts['INVESTOR_ID']));
			
		}catch(Exception $e) {
			$this->_error_code = $e->getCode();
			$this->_error_message = $e->getMessage();
			$this->_success = false;
		}
	
	MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}

	public function destroyAction()
	{	$contact_id = (isset($this->_posts['id'])) ? $this->_posts['id'] : 0;
		$investor_id = (isset($this->_posts['INVESTOR_ID'])) ? $this->_posts['INVESTOR_ID'] : 0;
		$data = array(
				'data' => array()
				);
		$modelInvestors = new Application_Model_Investors();
		try {
			// Delete
 			 $this->_model->delete(
 			 		$this->_model->getAdapter()->quoteInto(
 					'CONTACT_ID = ?', $contact_id
 							));
 			$modelInvestors->update(array(
 					'MODIFIED_DATE' => date('Y-m-d H:i:s')
 				),$modelInvestors->getAdapter()->quoteInto('INVESTOR_ID = ?', $investor_id));
		}catch(Exception $e) {
			$this->_error_code = $e->getCode();
			$this->_error_message = $e->getMessage();
			$this->_success = false;
		}
		MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}
}
