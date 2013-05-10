<?php
class Application_Model_InvestorStatus extends MyIndo_Ext_Abstract
{
	protected $_name = 'INVESTOR_STATUS';
	protected $_id = 'INVESTOR_STATUS_ID';

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
		->where('INVESTOR_STATUS LIKE ?','%' .$query. '%')
		->limit($limit, $offset);
	
		return $q->query()->fetchAll();
	}
	
	public function getName($id) {
	
		$select = $this->select();
		$select->from(array($this->_name),array());//declare $_name => nama tabel
		$select->columns('INVESTOR_STATUS');
		return $select->query()->fetchAll();
	
	}
	
	public function getStatus() {
	
		$select = $this->select();
		$select->from(array($this->_name),array());//declare $_name => nama tabel
		$select->columns('INVESTOR_STATUS');
		return $select->query()->fetchAll();
	
	}
	
	public function  getIdstatus($valStatus) {
		
		$select = $this->select()
		->from('INVESTOR_STATUS',array())
		->columns('INVESTOR_STATUS')
	    ->where('INVESTOR_STATUS = ?', $valStatus);
		return  $select->query()->fetch();
	}
}