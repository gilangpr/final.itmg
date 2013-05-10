<?php

class Peers_RequestController extends MyIndo_Controller_Action
{
	public function init()
	{	
		$this->getInit();
		$this->_model = new Application_Model_Peers();
	}
	
	public function readAction()
	{
		if($this->isPost() && $this->isAjax()) {
			if(isset($this->_posts['type'])) {
				$name = (isset($this->_posts['name'])) ? $this->_posts['name'] : '';
				if(!empty($name) && $name != '') {
					$list = $this->_model->getListByKey('PEER_NAME', $this->_posts['name']);
					$this->_data = array('data'=>array(
							'items' => $list,
							'totalCount' => count($list)
					));
				} else {
					$this->_data = array('data'=>array(
						'items' => $this->_model->getListLimit($this->_limit, $this->_start),
						'totalCount' => $this->_model->count()
						));

				}
				
			} else {
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
								$q->where('PEER_NAME LIKE ?', '%' . $this->_posts['query'] . '%');
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

						/* Date Modifier */
						foreach($list as $k => $d) {
							$list[$k]['CREATED_DATE'] = date('d-m-Y H:i:s', strtotime($d['CREATED_DATE']));
							$list[$k]['MODIFIED_DATE'] = date('d-m-Y H:i:s', strtotime($d['MODIFIED_DATE']));
						}
						/* End of : Date Modifier */
						
						$this->_data['data']['items'] = $list;
						$this->_data['data']['totalCount'] = $totalCount;
						
					} catch (Exception $e) {
						$this->_error_code = $e->getCode();
						$this->_error_message = $e->getMessage();
						$this->_success = false;
					}
				} else {
					$this->_data['data']['items'] = $this->_model->getListLimit($this->_limit, $this->_start);
					$this->_data['data']['totalCount'] = $this->_model->count();
				}
			}
		} else {
			$this->error(901);
		}
		$this->json();
	}
	
	public function createAction()
	{
		$data = array(
				'data' => array()
		);
			
		try {
			$ID = $this->_model->insert(array(
					'PEER_NAME' => $this->_posts['COMPANY_NAME'],
					'BRIEF_HISTORY' => $this->_posts['BRIEF_HISTORY'],
					'BUSINESS_ACTIVITY' => $this->_posts['BUSINESS_ACTIVITY'],
					'CREATED_DATE' => date('Y-m-d H:i:s')	
			));
			
			$data = array(
					'data' => array(
							'ID' => $ID
					)
			);
			
		}catch (Exception $e){
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
			//delete
			$this->_model->delete(
					$this->_model->getAdapter()->quoteInto(
							'PEER_ID = ?', $this->_posts['PEER_ID']
					));
			
		}catch (Exception $e){
			$this->_error_code = $e->getCode();
			$this->_error_message = $e->getMessage();
			$this->_success = false;
		}
		
		MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
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
					'PEER_NAME' => $posts['data']['PEER_NAME']
			),
					$this->_model->getAdapter()->quoteInto('PEER_ID = ?', $posts['data']['PEER_ID']));
		}catch(Exception $e) {
			$this->_error_code = $e->getCode();
			$this->_error_message = $e->getMessage();
			$this->_success = false;
		}
		
		MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}
	
	public function updateDetailAction()
	{
		$data = array();
		if($this->getRequest()->isPost() && $this->getRequest()->isXmlHttpRequest()&& isset($this->_posts['id']) && isset($this->_posts['type'])) {
			if($this->_model->isExistByKey('PEER_ID', $this->_posts['id'])) {
				try {
					if(isset($this->_posts['batch']) && $this->_posts['batch'] == 1) {
					
						$this->_model->update($_dt, $this->_model->getAdapter()->quoteInto('PEER_ID = ?', $this->_posts['id']));
					} else {
						$this->_model->update(array(
								$this->_posts['type'] => $this->_posts[$this->_posts['type']]
						),$this->_model->getAdapter()->quoteInto('PEER_ID = ?', $this->_posts['id']));
					}
				}catch(Exception $e) {
					$this->_error_code = $e->getCode();
					$this->_error_message = $e->getMessage();
					$this->_success = false;
				}
			} else {
				$this->_error_code = 101;
				$this->_error_message = MyIndo_Tools_Error::getErrorMessage($this->_error_code);
				$this->_success = false;
			}
		} else {
			$this->_error_code = 901;
			$this->_error_message = MyIndo_Tools_Error::getErrorMessage($this->_error_code);
			$this->_success = false;
		}
		MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}
	
	public function searchAction()
	{
		$data = array(
				'data' => array(
						'items' => array(),
						'totalCount' => 0
				)
		);
		
		MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}
	
	public function autocomAction()
	{
		if ($this->_posts['query'] == '') {
	
			$data = array(
					'data' => array(
							'items' => $this->_model->getListLimit($this->_limit, $this->_start, 'PEER_NAME ASC'),
							'totalCount' => $this->_model->count()
					)
			);
		} else {
			$data = array(
					'data' => array(
							'items' => $this->_model->getAllLike($this->_posts['query'], $this->_limit, $this->_start),
							'totalCount' => $this->_model->count()
					)
			);
		}
			
		MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}
}
