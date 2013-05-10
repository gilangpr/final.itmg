<?php 

class Investorstatus_RequestController extends MyIndo_Controller_Action
{
	public function init()
	{
		$this->getInit();
		$this->_model = new Application_Model_InvestorStatus();
	}
	
	public function  readAction() 
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
							$q->where('INVESTOR_STATUS LIKE ?', '%' . $this->_posts['query'] . '%');
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
		} else {
			$this->error(901);
		}
		$this->json();
	}	
		
	public function createAction()
	{
		if($this->isPost() && $this->isAjax()) {
			if($this->_model->isExistByKey('INVESTOR_STATUS', $this->_posts['INVESTOR_STATUS'])) {
				$this->error(201);
			} else {
				try {
					// Do insert query :
					$this->_model->insert(array(
							'INVESTOR_STATUS'=> $this->_posts['INVESTOR_STATUS'],
							'CREATED_DATE' => date('Y-m-d H:i:s')
					));
				
				}catch(Exception $e) {
					$this->_error_code = $e->getCode();
					$this->_error_message = $e->getMessage();
					$this->_success = false;
				}
			}
		} else {
			$this->error(901);
		}
		$this->json();
	}
		
	public function updateAction()
	{
		if($this->isPost() && $this->isAjax()) {
			$data = $this->getRequest()->getRawBody();//mengambil data json
			$data = Zend_Json::decode($data);//merubah data json menjadi array
			$id = $data['data']['INVESTOR_STATUS_ID'];
		
			try {
				if(!$this->_model->isExistByKey('INVESTOR_STATUS', $data['data']['INVESTOR_STATUS'])){
					$this->_model->update(array(
						'INVESTOR_STATUS' => $data['data']['INVESTOR_STATUS'],
					),$this->_model->getAdapter()->quoteInto('INVESTOR_STATUS_ID = ?', $id));
				} else {
					$this->error(202);
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
		
	public function destroyAction()
	{
		if($this->isPost() && $this->isAjax()) {
			try {
				// Delete
				$share = new Application_Model_Shareholdings();
				$val = $this->_model->getValueByKey('INVESTOR_STATUS_ID', $this->_posts['INVESTOR_STATUS_ID'], 'INVESTOR_STATUS');
				$query = $share->select()
				->where('INVESTOR_STATUS_ID = ?', $this->_posts['INVESTOR_STATUS_ID']);
				
				$total = $query->query()->fetchAll();
				if (count($total) > 0) {
		        	$this->error(202);
		        } else {
		        	$this->_model->delete(
		            $this->_model->getAdapter()->quoteInto(
		            	'INVESTOR_STATUS_ID = ?', $this->_posts['INVESTOR_STATUS_ID']
		            ));
		        	$this->_error_message = 'Data successfully deleted.';
		        	$this->_success = false;
				}
			} catch(Exception $e) {
				$this->_error_code = $e->getCode();
				$this->_error_message = $e->getMessage();
				$this->_success = false;
			}
		} else {
			$this->error(901);
		}
		$this->json();
	}
		
	public function  autocomAction() 
	{
		if ($this->_posts['query'] == '') {
	 		$this->_data = array(
	 			'data' => array(
	 				'items' => $this->_model->getListLimit($this->_limit, $this->_start, 'INVESTOR_STATUS ASC'),
	 				'totalCount' => $this->_model->count()
	 			)
	 		);
 		} else {
			$this->_data = array(
				'data' => array(
					'items' => $this->_model->getAllLike($this->_posts['query'], $this->_limit, $this->_start),
					'totalCount' => $this->_model->count()
				)
			);
		}
		$this->json();
	}	
}