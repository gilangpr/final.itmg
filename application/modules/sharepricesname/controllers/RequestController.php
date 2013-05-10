<?php

class Sharepricesname_RequestController extends MyIndo_Controller_Action
{
	protected $_name;
	
	public function init()
	{
		$this->getInit();
		$this->_model = new Application_Model_SharepricesName();
		$this->_name = 'SHAREPRICES_NAME';
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
							$q->where('SHAREPRICES_NAME LIKE ?', '%' . $this->_posts['query'] . '%');
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
				try {
					if(isset($this->_posts['all']) && $this->_posts['all'] == 1) {
						$this->_limit = $this->_model->count();
					}
					if(!isset($this->_posts['query']) || $this->_posts['query'] == '' || empty($this->_posts['query'])) {
						$list = $this->_model->getListLimit($this->_limit, $this->_start, $this->_name . ' ASC');
					} else {
						$where = $this->_model->getAdapter()->quoteInto($this->_name . ' LIKE ?', '%' . $this->_posts['query'] . '%');
						$list = $this->_model->getListLimit($this->_limit, $this->_start, $this->_name . ' ASC', $where);
					}
						
					$this->_data['data']['items'] = $list;
					$this->_data['data']['totalCount'] = $this->_model->count();
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
	
	public function createAction()
	{
		$this->_model2 = new MyIndo_Ext_ContentColumns();
		$this->_model3 = new MyIndo_Ext_ModelFields();
		$this->_modelSp = new Application_Model_Shareprices();
		$this->_modelLog = new Application_Model_SharepricesLog();
		
		$data = array(
				'data' => array()
		);
		
		$q = $this->_model->select()
		->where('SHAREPRICES_NAME = ?', $this->_posts['SHAREPRICES_NAME']);
		$c = $q->query()->fetchAll();

		if (count($c) > 0) {
			
			$this->_success = false;
			$this->_error_message = 'Shareprices name already exist';

		} else {

			try {
				$q = $this->_model3->select()
				->where('NAME = ?', $this->_posts['SHAREPRICES_NAME']);
				$c = $q->query()->fetchAll();
				if(count($c) == 0) {
					$this->_model3->insert(array(
							'MODEL_ID' => 6,
							'NAME' => $this->_posts['SHAREPRICES_NAME'],
							'TYPE' => 'float',
							'CREATED_DATE' => date('Y-m-d H:i:s')
					));
				}

				// Insert Data :
				$getSNid = $this->_model->insert(array(
						'SHAREPRICES_NAME'=> $this->_posts['SHAREPRICES_NAME'],
						'CREATED_DATE' => date('Y-m-d H:i:s')
				));

				/* Content Columns */

				$q = $this->_model2->select()
				->where('TEXT = ?', $this->_posts['SHAREPRICES_NAME']);
				$c = $q->query()->fetchAll();

				if(count($c) == 0) {
					$this->_model2->insert(array(
							'CONTENT_ID' => 6,
							'TEXT' => $this->_posts['SHAREPRICES_NAME'],
							'DATAINDEX' => $this->_posts['SHAREPRICES_NAME'],
							'DATATYPE' => 'float',
							'ALIGN' => 'center',
							'WIDTH' => '100',
							'EDITABLE' => 1,
							'FLEX' => 1,
							'INDEX' => 0,
							'CREATED_DATE' => date('Y-m-d H:i:s')
					));
				}

				/* Set Value */
				$_qSp = $this->_modelSp->select()
				->from('SHAREPRICES', array('DATE'))
				->distinct(true);
				$_result = $_qSp->query()->fetchAll();
				foreach($_result as $k=>$d) {

					$q = $this->_modelSp->select()
					->where('SHAREPRICES_NAME = ?', $this->_posts['SHAREPRICES_NAME']);
					$c = $q->query()->fetchAll();

					if(count($c) > 0) {

						$this->_modelSp->insert(array(
							'DATE'=> $d['DATE'],
							'SHAREPRICES_NAME' => $this->_posts['SHAREPRICES_NAME'],
							'VALUE' => 0,
							'CREATED_DATE' => date('Y-m-d H:i:s'),
							'SHAREPRICES_NAME_ID' => $getSNid
							));
						//insert shareprices log
						$this->_modelLog->insert(array(
								'DATE'=> $d['DATE'],
								'SHAREPRICES_NAME' => $this->_posts['SHAREPRICES_NAME'],
								'VALUE_BEFORE' => 0,
								'VALUE_AFTER' => 0,
								'CREATED_DATE' => date('Y-m-d H:i:s'),
								'SHAREPRICES_NAME_ID' => $getSNid
						));

					}
				}
				
			}catch(Exception $e) {
				$this->_error_code = $e->getCode();
				$this->_error_message = $e->getMessage();
				$this->_success = false;
			}
		}		

		MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}

	public function updateAction()
	{
		$this->_model2 = new MyIndo_Ext_ContentColumns();
		$this->_model3 = new MyIndo_Ext_ModelFields();
		$this->_model4 = new Application_Model_Shareprices();
		$this->_model5 = new Application_Model_SharepricesLog();
		$data = array(
				'data' => array()
		);

		try {
			$posts = $this->getRequest()->getRawBody();
			$posts = Zend_Json::decode($posts);
			if ($this->_model->isExistByKey('SHAREPRICES_NAME', $posts['data']['SHAREPRICES_NAME'])) {
				$this->_error_message = 'Edit failed';
				$this->_success = false;
			} else {
				$this->_model2->update(array(
						'TEXT' => $posts['data']['SHAREPRICES_NAME'],
						'DATAINDEX' => $posts['data']['SHAREPRICES_NAME']
				),
						$this->_model2
						->getAdapter()->quoteInto('CONTENT_COLUMN_ID = ?', $posts['data']['SHAREPRICES_NAME_ID']));
				
				$this->_model->update(array(
						'SHAREPRICES_NAME' => $posts['data']['SHAREPRICES_NAME']
				),
						$this->_model->getAdapter()->quoteInto('SHAREPRICES_NAME_ID = ?', $posts['data']['SHAREPRICES_NAME_ID']));
					
				$this->_model3->update(array(
						'NAME' => $posts['data']['SHAREPRICES_NAME']
				),
						$this->_model3->getAdapter()->quoteInto('MODEL_FIELD_ID = ?', $posts['data']['SHAREPRICES_NAME_ID']));
					
				$this->_model4->update(array(
						'SHAREPRICES_NAME' => $posts['data']['SHAREPRICES_NAME']
				),
						$this->_model->getAdapter()->quoteInto('SHAREPRICES_NAME_ID = ?', $posts['data']['SHAREPRICES_NAME_ID']));
					
				$this->_model4->update(array(
						'SHAREPRICES_NAME' => $posts['data']['SHAREPRICES_NAME']
				),
						$this->_model->getAdapter()->quoteInto('SHAREPRICES_NAME_ID = ?', $posts['data']['SHAREPRICES_NAME_ID']));
					
			}
			
		}catch(Exception $e) {
			$this->_error_code = $e->getCode();
			$this->_error_message = $e->getMessage();
			$this->_success = false;
		}
	
		MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}
	public function destroyAction()
	{
		$this->_model = new MyIndo_Ext_ContentColumns();
		$this->_model2 = new MyIndo_Ext_ModelFields();
		$this->_model3 = new Application_Model_SharepricesName();
		$this->_modelSp = new Application_Model_Shareprices();

		$data = array(
				'data' => array()
		);
		try {
			$_q = $this->_modelSp->select()
			->where('SHAREPRICES_NAME = ?', $this->_posts['SHAREPRICES_NAME']);
			$_x = $_q->query()->fetchAll();
			$total = 0;
			foreach($_x as $k=>$d) {
				$total += $d['VALUE'];
			}
			if($total == 0) {
				// Delete
				$this->_modelSp->delete(
						$this->_modelSp->getAdapter()->quoteInto('SHAREPRICES_NAME = ?', $this->_posts['SHAREPRICES_NAME']));
				
				$this->_model3->delete(
						$this->_model3->getAdapter()->quoteInto(
								'SHAREPRICES_NAME_ID = ?', $this->_posts['SHAREPRICES_NAME_ID']
						));
				$this->_model2->delete(
						$this->_model2->getAdapter()->quoteInto(
								'NAME = ?',$this->_posts['SHAREPRICES_NAME']
						));
				$this->_model->delete(
						$this->_model->getAdapter()->quoteInto(
								'DATAINDEX = ?',$this->_posts['SHAREPRICES_NAME']
						));
			}else {
				$this->_error_code = 102;
				$this->_error_message = 'Delete failed, data is being used.';
				$this->_success = false;
			}
		}catch(Exception $e) {
			$this->_error_code = $e->getCode();
			$this->_error_message = $e->getMessage();
			$this->_success = false;
		}
		MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}
}