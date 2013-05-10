<?php

class Application_Model_SharepricesName extends MyIndo_Ext_Abstract
{
	protected $_name = 'SHAREPRICES_NAME';
	protected $_id = 'SHAREPRICES_NAME_ID';
	
		
	public function getAll($limit, $offset)
	{		
		$q = $this->select()
		->from($this->_name, array('*'))
		//->join('CONTENT_COLUMNS', 'CONTENT_COLUMNS.DATAINDEX = SHAREPRICES_NAME.SHAREPRICES_NAME', array('*'))
		//->join('MODEL_FIELDS', 'MODEL_FIELDS.NAME = SHAREPRICES_NAME.SHAREPRICES_NAME', array('*'))
		->limit($limit, $offset);
		
		return $q->query()->fetchAll();
	}
	
	public function getShare()
	{
		$q = $this->select()
		->setIntegrityCheck(false)
		->from($this->_name, array('*'))
		->join('SHAREPRICES', 'SHAREPRICES.SHAREPRICES_NAME_ID = SHAREPRICES_NAME.SHAREPRICES_NAME_ID', array('*'));
		return $q->query()->fetchAll();
	}
	public function getSnid($nameId)
	{
		$q = $this->select()
		->setIntegrityCheck(false)
		->from($this->_name, array('*'))
		->where('SHAREPRICES_NAME_ID = ?' ,$nameId);
		return $q->query()->fetch();
	}
	
	public function getAllLike($query, $limit, $offset)
	{
		$q = $this->select()
		->setIntegrityCheck(false)
		->from($this->_name, array('*'))
		->where('SHAREPRICES_NAME LIKE ?', '%' .$query. '%')
		->limit($limit, $offset);
	
		return $q->query()->fetchAll();
	}
}