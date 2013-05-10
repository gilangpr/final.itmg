<?php 

class Company_RequestController extends MyIndo_Controller_Action
{
	protected $_pk;
	protected $_name;
	
	public function init()
	{
		$this->getInit();
		$this->_model = new Application_Model_Company();
		$this->_pk = 'COMPANY_ID';
		$this->_name = 'COMPANY_NAME';
	}
	
	public function readAction()
	{
		if($this->isPost() && $this->isAjax()) {
			try {
				if(isset($this->_posts['all']) && $this->_posts['all'] == 1) {
					$this->_limit = $this->_model->count();
				}
				if(!isset($this->_posts['query']) || $this->_posts['query'] == '' || empty($this->_posts['query'])) {
					if(!isset($this->_posts['sort'])) {
						$list = $this->_model->getListLimit($this->_limit, $this->_start, $this->_name . ' ASC');
					} else {
						$sort = Zend_Json::decode($this->_posts['sort']);
						$q = $this->_model->select();
						if($sort[0]['property'] == 'COMPANY') {
							$sort[0]['property'] = 'COMPANY_NAME';
						}
						$q->order($sort[0]['property'] . ' ' . $sort[0]['direction']);
						$q->limit($this->_limit, $this->_start);
						$list = $q->query()->fetchAll();
					}
				} else {
					$where = $this->_model->getAdapter()->quoteInto($this->_name . ' LIKE ?', '%' . $this->_posts['query'] . '%');
					$list = $this->_model->getListLimit($this->_limit, $this->_start, $this->_name . ' ASC', $where);
				}
				/* Last Page Modifier */
				$totalCount = $this->_model->count();
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
					$list[$k]['COMPANY'] = $d['COMPANY_NAME'];
					$list[$k]['CREATED_DATE'] = date('d-m-Y H:i:s', strtotime($d['CREATED_DATE']));
					$list[$k]['MODIFIED_DATE'] = date('d-m-Y H:i:s', strtotime($d['MODIFIED_DATE']));
				}
				/* End of : Date Modifier */
				$this->_data['data']['items'] = $list;
				$this->_data['data']['totalCount'] = $totalCount;
				
			}catch(Exception $e) {
				$this->_error_code = $e->getCode();
				$this->_error_message = $e->getMessage();
				$this->_success = false;
			}
		} else {
			$this->_error_code = 901;
			$this->_error_message = MyIndo_Tools_Error::getErrorMessage($this->_error_code);
			$this->_success = false;
		}
		MyIndo_Tools_Return::JSON($this->_data, $this->_error_code, $this->_error_message, $this->_success);
	}
	
	public function updateAction()
	{
		if($this->getRequest()->isPost() && $this->getRequest()->isXmlHttpRequest()) {
				
			try {
				$data = $this->getRequest()->getRawBody();
				$data = Zend_Json::decode($data);
				if(isset($data['data'][$this->_pk])) {
					if($this->_model->isExistByKey($this->_pk, $data['data'][$this->_pk])) {
						$this->_model->update(array(
								$this->_name => $data['data']['COMPANY']
						),$this->_model->getAdapter()->quoteInto($this->_pk . ' = ?', $data['data'][$this->_pk]));
						$this->_data['data']['items'] = $this->_model->getDetailByKey($this->_pk, $data['data'][$this->_pk]);
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
			}catch (Exception $e) {
				$this->_error_code = $e->getCode();
				$this->_error_message = $e->getMessage();
				$this->_success = false;
			}
				
		} else {
			$this->_error_code = 901;
			$this->_error_message = MyIndo_Tools_Error::getErrorMessage($this->_error_code);
			$this->_success = false;
		}
		MyIndo_Tools_Return::JSON($this->_data, $this->_error_code, $this->_error_message, $this->_success);
	}
	
	public function createAction()
	{
		if($this->getRequest()->isPost() && $this->getRequest()->isXmlHttpRequest() && isset($this->_posts[$this->_name])) {
			if(!$this->_model->isExistByKey($this->_name, $this->_posts[$this->_name])) {
				
				try {
					$this->_model->insert(array(
							$this->_name => $this->_posts[$this->_name],
							'CREATED_DATE' => date('Y-m-d H:i:s')
							));
				}catch(Exception $e) {
					$this->_error_code = $e->getCode();
					$this->_error_message = $e->getMessage();
					$this->_success = false;
				}
				
			} else {
				$this->_error_code = 201;
				$this->_error_message = MyIndo_Tools_Error::getErrorMessage($this->_error_code);
				$this->_success = false;
			}
		} else {
			$this->_error_code = 901;
			$this->_error_message = MyIndo_Tools_Error::getErrorMessage($this->_error_code);
			$this->_success = false;
		}
		
		MyIndo_Tools_Return::JSON($this->_data, $this->_error_code, $this->_error_message, $this->_success);
	}
	
	public function destroyAction()
	{
		if($this->getRequest()->isPost() && $this->getRequest()->isXmlHttpRequest() && isset($this->_posts[$this->_pk])) {
			if($this->_model->isExistByKey($this->_pk, $this->_posts[$this->_pk])) {
				
				try {
					$researchModel = new Application_Model_ResearchReports();
					$q = $researchModel->select()
					->where('COMPANY_ID = ?', $this->_posts[$this->_pk]);
					$count = $q->query()->fetchAll();
					if(count($count) == 0) {
						$this->_model->delete($this->_model->getAdapter()->quoteInto($this->_pk . ' = ?', $this->_posts[$this->_pk]));
					} else {
						$this->_error_code = 202;
						$this->_error_message = MyIndo_Tools_Error::getErrorMessage($this->_error_code);
						$this->_success = false;
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
		MyIndo_Tools_Return::JSON($this->_data, $this->_error_code, $this->_error_message, $this->_success);
	}
}