<?php

class Application_Model_SharepricesLog extends MyIndo_Ext_Abstract
{
	protected $_name = 'SHAREPRICES_LOG';
	protected $_id = 'SHAREPRICES_LOG_ID';
	
	public function getCount($name,$date)
	{
		$select = $this->select();
		$select->from("SHAREPRICES_LOG", ('count(*) as count'));
		$select->where('SHAREPRICES_NAME = ? ',$name);
		$select->where('DATE = ? ',$date);
		return $select->query()->fetch();
	}
	
	public function getPksp($date, $k)
	{
		$q = $this->select()
		->where('DATE = ?', $date)
		->where('SHAREPRICES_NAME = ?', $k);
		if($q->query()->rowCount() > 0) {
			$x = $q->query()->fetch();
			return $x[$this->_id];
		} else {
			//return $this->getLastId() + 1;
			return -1;
		}
	}
	
	public function getDetailLog($d, $n)
	{
		try {
			$q = $this->select()
			->where('DATE = ?', $d)
			->where('SHAREPRICES_NAME = ?', $n);
	
			if($q->query()->rowCount() > 0) {
				return $q->query()->fetch();
			} else {
				return array();
			}
				
		} catch ( Exception $e ) {
			return array();
		}
	}
	
	public function getValueLog($d, $n, $what)
	{
		try {
			$x = $this->getDetailLog($d, $n);
			return $x[$what];
		} catch ( Exception $e ) {
			return array();
		}
	}
}