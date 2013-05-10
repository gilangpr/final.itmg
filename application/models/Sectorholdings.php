<?php 

class Application_Model_Sectorholdings extends MyIndo_Ext_Abstract
{
	protected $_name = 'SECTOR_HOLDINGS';
	protected $_id = 'SECTOR_HOLDING_ID';
	
	public function getListSectorholdingsLimit($limit, $offset)
	{
		$q = $this->select()
		->setIntegrityCheck(false)
		->from($this->_name, array('*'))
		->join('INVESTORS', 'INVESTORS.INVESTOR_ID = SECTOR_HOLDINGS.INVESTOR_ID', array('*'))
		->limit($limit, $offset);
		
		return $q->query()->fetchAll();
	}
}
