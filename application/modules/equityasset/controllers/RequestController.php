<?php 

class Equityasset_RequestController extends MyIndo_Controller_Action
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
		$this->getInit();
		$this->_model = new Application_Model_Equityasset();
	}
	
	public function createAction()
	{
		if($this->isPost() && $this->isAjax()) {
			try {
				// Insert Data :
	 			$this->_model->insert(array(
	 					'EQUITY_TYPE'=> $this->_posts['EQUITY_TYPE'],
						'MIN_VALUE'=> $this->_posts['MIN_VALUE'],
	 					'MAX_VALUE'=>$this->_posts['MAX_VALUE']
	 					));
			}catch(Exception $e) {
				$this->_error_code = $e->getCode();
				$this->_error_message = $e->getMessage();
				$this->_success = false;
			}
		} else {
			$this->error(901);
		}
		$this->json();
	}
	
	public function readAction()
	{
		if($this->isPost() && $this->isAjax()) {
			if(isset($this->_posts['sort']) || isset($this->_posts['query'])) {
				try {
					if(isset($this->_posts['sort'])) {
						// Decode sort JSON :
						$sort = Zend_Json::decode($this->_posts['sort']);
					}
					// Query data
					$q = $this->_model->select();
						
					if(isset($this->_posts['sort'])) {
						$q->order($sort[0]['property'] . ' ' . $sort[0]['direction']);
					}
						
					if(isset($this->_posts['query'])) {
						if(!empty($this->_posts['query']) && $this->_posts['query'] != '') {
							$q->where('EQUITY_TYPE LIKE ?', '%' . $this->_posts['query'] . '%');
						}
					}
						
					// Count all data
					$rTotal = $q->query()->fetchAll();
					$totalCount = count($rTotal);
						
					// Fetch sorted & limit data
					$q->limit($this->_limit, $this->_start);
					$list = $q->query()->fetchAll();
					
					/* Last Page Modifier */
					$totalPage = ceil($totalCount / $this->_limit);
					if($this->_page == $totalPage) {
						$k = (count($list) - ($totalCount % $this->_limit));
						$temp = $list;
						for($i = 0; $i < $k; $i++) {
							unset($list[$i]);
						}
						$temp = $list;
						$i = 0;
						unset($list);
						foreach($temp as $k=>$d) {
							$list[$i] = $d;
							$i++;
						}
					}
					/* End of : Last Page Modifier */

					$this->_data['data']['items'] = $list;
					$this->_data['data']['totalCount'] = $totalCount;
				} catch (Exception $e) {
					$this->_error_code = $e->getCode();
					$this->_error_message = $e->getMessage();
					$this->_success = false;
				}
			} else {
				$this->_data['data']['items'] = $this->_model->getListLimit($this->_limit, $this->_start, 'LOCATION ASC');
				$this->_data['data']['totalCount'] = $this->_model->count();
			}
		} else {
			$this->error(901);
		}
		$this->json();
// 		try{
// 			$data = array(
// 					'data' => array(
// 							'items' => $this->_model->getListLimit($this->_limit, $this->_start, 'MIN_VALUE ASC'),
// 							'totalCount' => $this->_model->count()
// 					)
// 			);
// 		}catch(Exception $e){
// 			$this->_error_code = $e->getCode();
// 			$this->_error_message = $e->getMessage();
// 			$this->_success = false;
// 		}
// 		MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}
	
	public function updateAction()
	{
		$data = array(
				'data' => array()
		);
		
		try {
			$posts = $this->getRequest()->getRawBody();
			$posts = Zend_Json::decode($posts);
			
			$this->_model->update(array(
					'MIN_VALUE' => $posts['data']['MIN_VALUE'],
					'MAX_VALUE' => $posts['data']['MAX_VALUE']
					),
					$this->_model->getAdapter()->quoteInto('EQUITY_ID = ?', $posts['data']['EQUITY_ID']));
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
			
			$this->_model->delete(
 					$this->_model->getAdapter()->quoteInto(
 				'EQUITY_ID = ?', $this->_posts['EQUITY_ID']
 							));
		}catch(Exception $e) {
			$this->_error_code = $e->getCode();
			$this->_error_message = $e->getMessage();
			$this->_success = false;
		}
		MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}
}
