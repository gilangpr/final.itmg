<?php 

class Shareprices_ExecutiveController extends MyIndo_Controller_Action
{
	public function init()
	{
		$this->getInit(new Application_Model_Shareprices());
	}
	
	public function readAction()
	{
		if($this->isAjax() && $this->isPost()) {
			if(isset($this->_posts['SP_START_DATE']) && isset($this->_posts['SP_END_DATE']) && isset($this->_posts['SP_NAMES'])) {
				$s_date = $this->_posts['SP_START_DATE'];
				$e_date = $this->_posts['SP_END_DATE'];
				$names = Zend_Json::decode($this->_posts['SP_NAMES']);
				
				$q = $this->_model->select()
				->where('DATE >= ?', $s_date)
				->where('DATE <= ?', $e_date);
				
				$data = $q->query()->fetchAll();
				
				$list = array();
				$t = '';
				$i = -1;
				foreach($data as $k=>$d) {
					if($t != $d['DATE']) {
						$i++;
						$t = $d['DATE'];
					}
					$list[$i]['DATE'] = $d['DATE'];
					foreach($names as $_k=>$_d) {
						if($d['SHAREPRICES_NAME'] == $_d) {
							$list[$i][$d['SHAREPRICES_NAME']] = $d['VALUE'];
						}
					}
					foreach($names as $_k=>$_d) {
						if(!isset($list[$i][$_d])) {
							$list[$i][$_d] = 0;
						}
					}
				}
				$this->_data['data']['items'] = $list;
				$this->_data['data']['names'] = $names;
				$this->_data['data']['totalCount'] = $i+1;
			}
		}
		MyIndo_Tools_Return::JSON($this->_data, $this->_error_code, $this->_error_message, $this->_success);
	}
}