<?php 

class Shareholdings_ExecutiveController extends MyIndo_Controller_Action
{	
	public function init()
	{
		$this->getInit(new Application_Model_Shareholdings());
		$this->_model = new Application_Model_Shareholdings();
	}
	
	public function searchAction()
	{
		if($this->isPost() && $this->isAjax()) {
			if(isset($this->_posts['SH_START_DATE']) && isset($this->_posts['SH_END_DATE']) && isset($this->_posts['SH_SORT_BY'])) {
				$start_date = explode('T',$this->_posts['SH_START_DATE']);
				$end_date = explode('T', $this->_posts['SH_END_DATE']);
				$sort = $this->_posts['SH_SORT_BY'];
				
				$q = $this->_model->select()
				->setIntegrityCheck(false)
				->from('SHAREHOLDINGS', array('*'))
				->join('SHAREHOLDING_AMOUNTS', 'SHAREHOLDING_AMOUNTS.SHAREHOLDING_ID = SHAREHOLDINGS.SHAREHOLDING_ID', array('*'))
				->where('SHAREHOLDING_AMOUNTS.DATE >= ?', $start_date[0])
				->where('SHAREHOLDING_AMOUNTS.DATE <= ?', $end_date[0])
				->order('DATE ASC');
				if($sort == 'Alphabetical') {
					$q->order('SHAREHOLDINGS.INVESTOR_NAME ASC');
				} else {
					$q->order('SHAREHOLDING_AMOUNTS.AMOUNT ASC');
				}
				$q->distinct(true);
				
				
				$data = $q->query()->fetchAll();
				
				
				$total = 0;
				foreach($data as $k=>$d) {
					$total += $d['AMOUNT'];
				}
				$totalCount = $q->query()->fetchAll();
				
				$q->limit($this->_limit, $this->_start);
				
				$data = $q->query()->fetchAll();
				
				foreach($data as $k=>$d) {
					$data[$k]['PERCENTAGE'] = ($d['AMOUNT'] / $total) * 100 . ' %';
				}
				
				$this->_data['data']['items'] = $data;
				$this->_data['data']['totalCount'] = count($totalCount);
			}
		}
		
		MyIndo_Tools_Return::JSON($this->_data, $this->_error_code, $this->_error_message, $this->_success);
	}
}