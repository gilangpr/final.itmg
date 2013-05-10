<?php

class Application_Model_List extends MyIndo_Ext_Abstract
{
	protected $_name = 'LIST';
	protected $_id = 'LIST_ID';
	
	public function getListList($limit, $offset)
	{
		$q = $this->select()
		->setIntegrityCheck(false)
		->from($this->_name, array('*'))
		->join('DATE', 'DATE.DATE_ID = LIST.DATE_ID', array('*'))
		->join('SHAREPRICES_NAME', 'SHAREPRICES_NAME.SHAREPRICES_NAME_ID = LIST.SHAREPRICES_NAME_ID', array('*'))
		->limit($limit, $offset);
		
		return $q->query()->fetchAll();
	}
}