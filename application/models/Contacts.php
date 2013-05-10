<?php 

class Application_Model_Contacts extends MyIndo_Ext_Abstract
{
	protected $_name = 'CONTACTS';
	protected $_id = 'CONTACT_ID';
	
		
	public function getListContactsLimit($limit, $offset)
	{
		$q = $this->select()
		->setIntegrityCheck(false)
		->from($this->_name, array('*'))
		->join('INVESTORS', 'INVESTORS.INVESTOR_ID = CONTACTS.INVESTOR_ID', array('*'))
		->limit($limit, $offset);
		
		return $q->query()->fetchAll();

		
	}
}
