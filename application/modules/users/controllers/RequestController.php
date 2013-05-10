<?php 

class Users_RequestController extends MyIndo_Controller_Action
{
	public function init()
	{
		$this->getInit(new Application_Model_Users());
	}
	
	public function readAction()
	{
		if($this->getRequest()->isPost() && $this->getRequest()->isXmlHttpRequest()) {
			if(isset($this->_posts['all']) && $this->_posts['all'] == 1) {
				$this->_list = $this->_model->getListLimit($this->_model->count(), $this->_start, 'USERNAME ASC');
			} else {
				if(!isset($this->_posts['sort'])) {
					$list = $this->_model->getListLimit($this->_limit, $this->_start, 'USERNAME ASC');
				} else {
					$sort = Zend_Json::decode($this->_posts['sort']);
					$q = $this->_model->select();
					if($sort[0]['property'] != 'RESEARCH_REPORT_CATEGORY' && $sort[0]['property'] != 'COMPANY_NAME') {
						$q->order($sort[0]['property'] . ' ' . $sort[0]['direction']);
					}
					$q->limit($this->_limit, $this->_start);
					$list = $q->query()->fetchAll();
				}
			}
			$totalCount = $this->_model->count();
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
			$this->_list = $list;
			$this->_data['data']['items'] = $this->_list;
			$this->_data['data']['totalCount'] = $this->_model->count();
		} else {
			$this->_error_code = 901;
			$this->_error_message = MyIndo_Tools_Error::getErrorMessage($this->_error_code);
			$this->_success = false;
		}
		MyIndo_Tools_Return::JSON($this->_data, $this->_error_code, $this->_error_message, $this->_success);
	}
}