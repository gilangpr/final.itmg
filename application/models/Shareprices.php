<?php

class Application_Model_Shareprices extends MyIndo_Ext_Abstract
{
	protected $_name = 'SHAREPRICES';
	protected $_id = 'SHAREPRICES_ID';
	
	public function getCount($name,$date)
	{		
		$select = $this->select();
		$select->from("SHAREPRICES", ('count(*) as count'));
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
	
	public function getId($date, $k)
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
	
	public function getName($date)
	{
		$q = $this->select()
		->where('DATE = ?', $date);
		return $q->query()->fetchAll();
	}
	
	public function distinctDate()
	{
		$q = $this->select()
		->from($this->_name, array('*'))
		->group(array('DATE'));
		$rowset = $q->query()->fetchAll();
		return count($rowset);
	}
	
	public function limitShareprices($limit, $offset)
	{
		$q = $this->select()
		->from($this->_name, array('*'))
		->group(array('DATE'))
		->limit($limit, $offset);
		return $q->query()->fetchAll();
	}
	
	public function searchDate($date, $name)
	{
		$q = $this->select()
		->where('DATE = ?', $date)
		->where('SHAREPRICES_NAME = ?', $name);
		if($q->query()->rowCount() > 0) {
			return $q->query()->fetchAll();
		} else {
			//return $this->getLastId() + 1;
			return NULL;
		}
	}
	
	public function searchVal($nameSearch, $dates, $daten)
	{
		$q = $this->select()
		->from($this->_name, array('*'))
		->where('SHAREPRICES_NAME = ?', $nameSearch)
		->where('DATE = >=', $dates)
		->where('DATE = <=', $daten);
		return $q->query()->fetchAll();
	}
	
	public function getAllLike($query, $limit, $offset)
	{
		$q = $this->select()
		->setIntegrityCheck(false)
		->from($this->_name, array('*'))
		->where('SHAREPRICES_NAME LIKE ?', $query. '%')
		->limit($limit, $offset);
	
		return $q->query()->fetchAll();
	}
}