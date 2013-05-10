<?php

class Application_Model_Coalsales extends MyIndo_Ext_Abstract
{
	protected $_name = 'COAL_SALES_DISTRIBUTION';
	protected $_id = 'COAL_SALES_DISTRIBUTION_ID';
	
	public function getLastTitle($peer_id)
	{
		try {
			$q = $this->select()
			->from($this->_name, array('TITLE'))
			->where('PEER_ID = ?', $peer_id)
			->order('CREATED_DATE DESC')
			->distinct();
			$x = $q->query()->fetchAll();
			if(count($x) > 0) {
				return $x[0]['TITLE'];
			} else {
				return "NULL";
			}
		}catch(Exception $e) {
			return 'NULL';
		}
	}
	
	public function getListCS($peer_id)
	{
		try {
			if($this->getLastTitle($peer_id) != 'NULL') {
				$q = $this->select()
				->from($this->_name, array('COUNTRY','SUM(VOLUME) as TOTAL'))
				->where('PEER_ID = ?', $peer_id)
				->where('TITLE = ?', $this->getLastTitle($peer_id));
				if($q->query()->rowCount() > 0) {
					return $q->query()->fetchAll();
				} else {
					return array('COUNTRY'=>'ERROR');
				}
			} else {
				return array('COUNTRY'=>'ERROR2');
			}
		}catch(Exception $e) {
			return array('COUNTRY'=>'ERROR3');
		}
	}
}