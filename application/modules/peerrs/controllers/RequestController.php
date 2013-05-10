<?php 

class Peerrs_RequestController extends Zend_Controller_Action
{
	protected $_model;
	protected $_limit;
	protected $_start;
	protected $_posts;
	protected $_error_code;
	protected $_error_message;
	protected $_success;
	
	public function init()
	{
		$this->_helper->layout()->disableLayout();
		$this->_helper->viewRenderer->setNoRender(true);
		$this->_model = new Application_Model_PeerResourceReserves();
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
	}
	public function indexAction()
	{
		
	}
	public function createAction()
	{
		$data = array(
			'data' => array()
		);
		$modelPeer = new Application_Model_Peers();
		try {
			//Insert Data :
			$peer_id = $this->_getParam('id',0);
			if($modelPeer->isExistByKey('PEER_ID', $peer_id)) {
				$this->_model->insert(array(
						'PEER_ID' => $peer_id,
						'MINE' => $this->_posts['MINE'],
						'RESOURCES' => $this->_posts['RESOURCES'],
						'RESERVES' => $this->_posts['RESERVES'],
						'AREA' => $this->_posts['AREA'],
						'CV' => $this->_posts['CV'],
						'LOCATION' => $this->_posts['LOCATION'],
						'LICENSE' => $this->_posts['LICENSE'],
						'CREATED_DATE' => date('Y-m-d H:i:s')
						));
			} else {
				$this->_error_code = 404;
				$this->_error_message = 'PEER_ID NOT FOUND';
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
		$modelPeer = new Application_Model_Peers();
		$peer_id = (isset($this->_posts['id'])) ? $this->_posts['id'] : 0;
		if($modelPeer->isExistByKey('PEER_ID', $peer_id)) {
			$list = $this->_model->select()->where('PEER_ID = ?', $peer_id);
			$list = $list->query()->fetchAll();
			
			/* Add total */
			/*
			$sum = array(
					'RESOURCES'=> 0,
					'RESERVES' => 0,
					'AREA' => 0
					);
			foreach($list as $k=>$d) {
				$sum['RESOURCES'] += $d['RESOURCES'];
				$sum['RESERVES'] += $d['RESERVES'];
				$sum['AREA'] += $d['AREA'];
			}
			
			$c = count($list);
			$list[$c]['MINE'] = 'TOTAL';
			$list[$c]['RESOURCES'] = $sum['RESOURCES'];
			$list[$c]['RESERVES'] = $sum['RESERVES'];
			$list[$c]['AREA'] = $sum['AREA'];
			*/
			/* End of : Add Total */
			
			$data = array(
				'data' => array(
					'items' => $list,
					'totalCount' => count($list)
					)
				);
		} else {
			$data = array(
					'data' => array(
							'items' => array(),
							'totalCount' => 0
					)
			);
		}
		MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}
	
	public function updateAction()
	{
	$data = array(
				'data' => array()
		);

		$data = $this->getRequest()->getRawBody();//mengambil data json
		$data = Zend_Json::decode($data);//merubah data json menjadi array
		$id = $data['data']['RESERVES_RESOURCES_ID'];
		
		try {
			$this->_model->update(array(
					'MINE' => $data['data']['MINE'],
					'RESOURCES' => $data['data']['RESOURCES'],
					'RESERVES' => $data['data']['RESERVES'],
					'AREA' => $data['data']['AREA'],
					'CV' => $data['data']['CV'],
					'LOCATION' => $data['data']['LOCATION'],
					'LICENSE' => $data['data']['LICENSE'],
					),$this->_model->getAdapter()->quoteInto('RESERVES_RESOURCES_ID = ?', $id));
			
		}catch(Exception $e) {
			$this->_error_code = $e->getCode();
			$this->_error_message = $e->getMessage();
			$this->_success = false;
		}
		
		MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}
	
	public function destroyAction()
	{
		$data = array(
				'data' => array()
		);
		try {
			/* Delete */
			$this->_model->delete(
					$this->_model->getAdapter()->quoteInto(
							'RESERVES_RESOURCES_ID = ?', $this->_posts['id']
					));
				
		}catch (Exception $e){
			$this->_error_code = $e->getCode();
			$this->_error_message = $e->getMessage();
			$this->_success = false;
		}
		
// 		$data = array(
// 				'data' => array()
// 				);
// 		try {
// 			/* Delete */
//  			$this->_model->delete(
//  					$this->_model->getAdapter()->quoteInto(
//  							'RESERVES_RESOURCES_ID = ?', $this->_posts['RESERVES_RESOURCES_ID']
//  							));
// 		}catch(Exception $e) {
// 			$this->_error_code = $e->getCode();
// 			$this->_error_message = $e->getMessage();
// 			$this->_success = false;
// 		}
		MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}
}