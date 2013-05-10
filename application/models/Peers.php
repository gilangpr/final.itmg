<?php 

class Application_Model_Peers extends MyIndo_Ext_Abstract
{
	protected $_name = 'PEERS';
	protected  $_id = 'PEER_ID';

	public function getListPeersLimit($limit, $offset)
	{
		$q = $this->select()
		->setIntegrityCheck(false)
		->from($this->_name, array('*'))
		->join('RESERVES_AND_RESOURCES', 'RESERVES_AND_RESOURCES.RESERVES_RESOURCES_ID = PEERS.PEER_ID', array('*'))
		->join('FINANCIAL_PERFORM', 'FINANCIAL_PERFORM.FINANCIAL_PERFORM_ID = PEERS.PEER_ID', array('*'))
		->join('COAL_SALES_DISTRIBUTION', 'COAL_SALES_DISTRIBUTION.COAL_SALES_DISTRIBUTION_ID = PEERS.PEER_ID', array('*'))
// 		->join('COALSALES_TITLE', 'COALSALES_TITLE.COALSALES_TITLE_ID = PEERS.PEER_ID', array('*'))
		->join('STRIPPING_RATIO', 'STRIPPING_RATIO.STRIPPING_RATIO_ID = PEERS.PEER_ID', array('*'))
		->join('STRIPPING_RATIO_YEAR', 'STRIPPING_RATIO_YEAR.STRIPPING_RATIO_YEAR_ID = PEERS.PEER_ID', array('*'))
		->join('COMPOSITION_COMPANY', 'COMPOSITION_COMPANY.COMPOSITION_COMPANY_ID = PEERS.PEER_ID', array('*'))
		->join('TOTAL_CASHCOST', 'TOTAL_CASHCOST.TOTAL_CASHCOST_ID = PEERS.PEER_ID', array('*'))
		->limit($limit, $offset);

		return $q->query()->fetchAll();
	}
	
	public function getListLimit($limit, $offset, $order = null)
	{
		try {
			$q = $this->select()
			->limit($limit, $offset);
				
			if($order != null) {
				$q->order($order);
			}
				
			return $q->query()->fetchAll();
		} catch ( Exception $e ) {
				
			return array();
				
		}
	}
	
	public function getAllLike($query, $limit, $offset)
	{
		$q = $this->select()
		->setIntegrityCheck(false)
		->from($this->_name, array('*'))
		->where('PEER_NAME LIKE ?', '%' . $query. '%')
		->limit($limit, $offset);
	
		return $q->query()->fetchAll();
	}
}
