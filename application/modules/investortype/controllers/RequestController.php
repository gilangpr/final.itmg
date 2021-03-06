<?php 

class Investortype_RequestController extends MyIndo_Controller_Action
{
	public function init()
	{
		$this->getInit();
		$this->_model = new Application_Model_InvestorType();
	}
	
	public function createAction()
	{
		if($this->isPost() && $this->isAjax()) {
			try {
				if(!$this->_model->isExistByKey('INVESTOR_TYPE', $this->_posts['INVESTOR_TYPE'])) {
					//Insert Data :
					$this->_model->insert(array(
							'INVESTOR_TYPE'=> $this->_posts['INVESTOR_TYPE'],
							'CREATED_DATE' => date('Y-m-d H:i:s')
							));
				} else {
					$this->error(201);
				}
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
							$q->where('INVESTOR_TYPE LIKE ?', '%' . $this->_posts['query'] . '%');
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
				$this->_data['data']['items'] = $this->_model->getListLimit($this->_limit, $this->_start, 'LOCATION ASC');
				$this->_data['data']['totalCount'] = $this->_model->count();
			}
		} else {
			$this->error(901);
		}
		$this->json();
	}
	
	public function updateAction()
	{
		try {
			$posts = $this->getRequest()->getRawBody();
			$posts = Zend_Json::decode($posts);
			
			$this->_model->update(array(
					'INVESTOR_TYPE' => $posts['data']['INVESTOR_TYPE']
					),
					$this->_model->getAdapter()->quoteInto('INVESTOR_TYPE_ID = ?', $posts['data']['INVESTOR_TYPE_ID']));
		}catch(Exception $e) {
			$this->_error_code = $e->getCode();
			$this->_error_message = $e->getMessage();
			$this->_success = false;
		}
		$this->json();
	}
	
	public function destroyAction()
	{
		try {
			$modelInvestors = new Application_Model_Investors();
			if(!$modelInvestors->isExistByKey('INVESTOR_TYPE_ID', $this->_posts['INVESTOR_TYPE_ID'])) {
	 			$this->_model->delete(
	 					$this->_model->getAdapter()->quoteInto(
	 							'INVESTOR_TYPE_ID = ?', $this->_posts['INVESTOR_TYPE_ID']
	 							));
			} else {
				$this->error(202);
			}
		}catch(Exception $e) {
			$this->_error_code = $e->getCode();
			$this->_error_message = $e->getMessage();
			$this->_success = false;
		}
		$this->json();
	}
}
