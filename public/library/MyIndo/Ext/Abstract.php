<?php 

class MyIndo_Ext_Abstract extends Zend_Db_Table_Abstract
{
	public function getList()
	{
		try {
			$q = $this->select();
			return $q->query()->fetchAll();
		} catch ( Exception $e ) {
			return array();
		}
	}
	
	public function getListLimit($limit, $offset, $order = null, $where = null)
	{
		try {
			$q = $this->select()
			->limit($limit, $offset);
			
			if($order != null) {
				$q->order($order);
			}
			
			if($where != null) {
				$q->where($where);
			}
			
			return $q->query()->fetchAll();
		} catch ( Exception $e ) {
			return array();
		}
	}
	
	public function count()
	{
		try {
			$q = $this->select();
			$c = $q->query()->fetchAll();
			return count($c);
		} catch ( Exception $e ) {
			return 0;
		}
	}
	
	public function countWhere($col,$name,$value)
	{
		try {
			$q = $this->select()->from($this->_name,array('COUNT(' . $col . ') as total'))
			->where($name . ' = ?', $value);
			$x = $q->query()->fetch();
			return $x['total'];
		}catch(Exception $e) {
			return 0;
		}
	}
	
	public function isExistByKey($name, $value)
	{
		try {
			return ( count( $this->getListByKey($name, $value) ) > 0 ) ? true : false;
		} catch ( Exception $e ) {
			return false;
		}
	}
	
	public function getPK()
	{
		try {
			return $this->_id;
		} catch ( Exception $e ) {
			$e->getMessage();
		}
	}
	
	public function getDetailByKey($name, $value)
	{
		try {
			$q = $this->select()
			->where($name . ' = ?', $value);
			$c = $q->query()->fetchAll();
			if(count($c) > 0) {
				return $q->query()->fetch();
			} else {
				return array();
			}
			
		} catch ( Exception $e ) {
			return array();
		}
	}
	
	public function getPkByKey($name, $value)
	{
		try {
			$data = $this->getDetailByKey($name, $value);
			return $data[$this->_id];
		} catch ( Exception $e ) {
			return 0;
		}
	}
	
	public function getValueByKey($name, $value, $what)
	{
		
	
		try {
			$x = $this->getDetailByKey($name, $value);
			return $x[$what];
		} catch ( Exception $e ) {
			return array();
		}
	}
	
	public function getListByKey($name, $value, $order = null)
	{
		try {
			$q = $this->select()
			->where($name . ' = ?', $value);
			
			if($order != null) {
				$q->order($order);
			}
			return $q->query()->fetchAll();
		} catch ( Exception $e ) {
			return array();
		}
	}
	
	public function getLastId()
	{
		try {
			$q = $this->select()->order($this->_id . ' DESC')->limit(1,0);
			$x = $q->query()->fetch();
			if(isset($x[$this->_id])) {
				return $x[$this->_id];
			} else {
				return -1;
			}
		} catch ( Exception $e ) {
			return -1;
		}
	}
}