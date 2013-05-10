<?php 

class Application_Model_Portfoliodistribution extends MyIndo_Ext_Abstract
{
	protected $_name = 'PORTFOLIO_DISTRIBUTION';
	protected $_id = 'PORTFOLIO_DISTRIBUTION_ID';
	
	public function getListPortfoliodistributionLimit($limit, $offset)
	{
		$q = $this->select()
		->setIntegrityCheck(false)
		->from($this->_name, array('*'))
		->join('INVESTORS', 'INVESTORS.INVESTOR_ID = PORTFOLIO_DISTRIBUTION.INVESTOR_ID', array('*'))
		->limit($limit, $offset);
		
		return $q->query()->fetchAll();
	}
}
