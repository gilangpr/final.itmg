<?php 

class Application_Model_Investors extends MyIndo_Ext_Abstract
{
	protected $_name = 'INVESTORS';
	protected $_name2 = 'SECTOR_HOLDINGS';
	protected $_id = 'INVESTOR_ID';
	
	public function getListInvestorsLimit($limit, $offset)
	{
		$q = $this->select()
		->setIntegrityCheck(false)
		->from($this->_name, array('*'))
		->join('INVESTOR_TYPE', 'INVESTOR_TYPE.INVESTOR_TYPE_ID = INVESTORS.INVESTOR_TYPE_ID', array('INVESTOR_TYPE'))
		->join('LOCATIONS', 'LOCATIONS.LOCATION_ID = INVESTORS.LOCATION_ID', array('LOCATION'))
		->limit($limit, $offset);
		
		return $q->query()->fetchAll();

		/*		
		$r = $this->select()
		->setIntegrityCheck(false)
		->from($this->_name2, array('*'))
		->join('INVESTORS', 'INVESTORS.INVESTOR_ID = SECTOR_HOLDINGS.INVESTOR_ID', array('*'))
		->limit($limit, $offset);
		
		return $r->query()->fetchAll();
		*/
	}
}
