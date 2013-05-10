<?php 

class Application_Model_Shareholdings extends MyIndo_Ext_Abstract
{
	protected $_name = 'SHAREHOLDINGS';
	protected $_id = 'SHAREHOLDING_ID';
	
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
	
	public function joinHolding($limit, $offset, $order = null)
	{
		try {

			$q = $this->select();
			$q->setIntegrityCheck(false);
			$q->from($this->_name, array('*'));
			$q->join('SHAREHOLDING_AMOUNTS', 'SHAREHOLDING_AMOUNTS.SHAREHOLDING_ID = SHAREHOLDINGS.SHAREHOLDING_ID', array('*'));
			$q->limit($limit, $offset);
			
			if($order != null) {
				$q->order($order);
			}
			return $q->query()->fetchAll();
			
		} catch ( Exception $e ) {
			
			$this->_error_code = $e->getCode();
 			$this->_error_message = $e->getMessage();
 			$this->_success = false;
		}
	
	}
	
	public function getCount($name)
	{
		
			$select = $this->select();
			$select->from('SHAREHOLDINGS',('count(SHAREHOLDING_ID) as count'));
			$select->where('INVESTOR_NAME = ? ',$name);
            return $select->query()->fetchAll();
	}
	
	public function getListInvestorsLimit($limit, $offset)
	{
		
		$q = $this->select()
		->setIntegrityCheck(false)
		->from($this->_name, array('*'))
		->join('INVESTOR_STATUS', 'INVESTOR_STATUS.INVESTOR_STATUS_ID = SHAREHOLDINGS.INVESTOR_STATUS_ID', array('*'))
		->join('SHAREHOLDING_AMOUNTS', 'SHAREHOLDING_AMOUNTS.SHAREHOLDING_ID = SHAREHOLDINGS.SHAREHOLDING_ID', array('AMOUNT'))
		->limit($limit, $offset);
		return $q->query()->fetchAll();
	}
	
	
	public function updateInvestorName($data,$where) {
		
		try {
		$table = new Application_Model_Shareholdings();
		$wherenya = $table->getAdapter()->quoteInto('INVESTOR_NAME = ? ',$where['INVESTOR_NAME']); 
		$table->update($data,$wherenya);
		exit();
		} catch (Exception $e) {
			$this->_error_code = $e->getCode();
 						$this->_error_message = $e->getMessage();
 						$this->_success = false;
		}
		die;
	}
	
	
	public function getUpdate($data,$where) {
	
	try {
		$table = new Application_Model_Shareholdings();
		$wherenya = $table->getAdapter()->quoteInto('SHAREHOLDING_ID = ? ',$where['INVESTOR_NAME']);
		$table->update($data,$wherenya);
		} catch (Exception $err) {
			echo $err->getMessage();
		}
		die;
	
	}
	
	public function getName() {
		
		$select = $this->select();
		$select->from(array($this->_name),array());//declare $_name => nama tabel
		$select->columns('INVESTOR_NAME');
		return $select->query()->fetchAll();
		
	}
	
	public function getAllLike($query, $limit, $offset)
	{
		$q = $this->select()
		->setIntegrityCheck(false)
		->from($this->_name, array('*'))
		->where('INVESTOR_NAME LIKE ?','%' .$query. '%')
		->limit($limit, $offset);
		
		return $q->query()->fetchAll();
	}
	
}