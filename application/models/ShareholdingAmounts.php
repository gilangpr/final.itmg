<?php
class Application_Model_ShareholdingAmounts extends MyIndo_Ext_Abstract
{
	protected $_name = 'SHAREHOLDING_AMOUNTS';
	protected $_id = 'SHAREHOLDING_AMOUNT_ID';

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
	
	public function getId($id)
	{
		try {
			$wherenya = $this->select()->where('SHAREHOLDING_AMOUNT_ID = ?', $id);
				$this->_name->delete($wherenya);
				
				} catch ( Exception $e ) {
					$this->_error_code = $e->getCode();
					$this->_error_message = $e->getMessage();
					$this->_success = false;
					return array();
				
				}
	
	}
	
	public function getAmount($shareholding_id,$maxDate)
	{
		if($this->isExistByKey('SHAREHOLDING_ID', $shareholding_id)) {
			
		   $select = $this->select();
		   $select->from('SHAREHOLDING_AMOUNTS',ARRAY('MAX(DATE) as MAX_DATE'));
		   $select->where('SHAREHOLDING_ID = ?',$shareholding_id);
		   $maxTanggal =  $select->query()->fetch();
		   //print_r($maxTanggal);die;			
// 		    $select = $this->select();
// 			$select->from('SHAREHOLDING_AMOUNTS',ARRAY('MAX(SHAREHOLDING_AMOUNT_ID) AS MAX_ID'));
// 		    $select->where('SHAREHOLDING_ID = ?',$shareholding_id);
// 			$maxId =  $select->query()->fetch();
			//print_r($maxTanggal);print_r($maxId);die;
						
			$select = $this->select();
			$select->from('SHAREHOLDING_AMOUNTS',array('*'));
			$select->where('SHAREHOLDING_ID =?',$shareholding_id);
			$select->where('DATE = ?', $maxDate);
			//$select->where('DATE = ?',$maxTanggal['MAX_DATE']);
			//$select->where('SHAREHOLDING_AMOUNT_ID = ?',$maxId['MAX_ID']);
			$list = $select->query()->fetch();
			//echo $select->__toString();die;
			//return $res['AMOUNT'] = $select->query()->fetch();
			return $list['AMOUNT'];
			
		} else {
			
			return 0;
		}
	}
	
	public function getDate($shareholding_id,$maxDate)
	{
		if($this->isExistByKey('SHAREHOLDING_ID', $shareholding_id)) {
			$select = $this->select();
			$select->from('SHAREHOLDING_AMOUNTS',ARRAY('MAX(DATE) as MAX_DATE'));
			$select->where('SHAREHOLDING_ID = ?',$shareholding_id);
			$maxTanggal =  $select->query()->fetch();
			
// 			$select = $this->select();
// 			$select->from('SHAREHOLDING_AMOUNTS',ARRAY('MAX(SHAREHOLDING_AMOUNT_ID) AS MAX_ID'));
// 			$select->where('SHAREHOLDING_ID = ?',$shareholding_id);
// 			$maxId =  $select->query()->fetch();
			
			$select = $this->select();
			$select->from('SHAREHOLDING_AMOUNTS');
			$select->where('SHAREHOLDING_ID =?',$shareholding_id);
			$select->where('DATE = ?', $maxDate);
			//$select->where('SHAREHOLDING_AMOUNT_ID = ?',$maxId['MAX_ID']);
			$c = $select->query()->fetch();
			return $c['DATE'];
				
		} else {
				
			return 0;
		}
	}
	
	public function getCount($date)
	{
		$select = $this->select();
		$select->from('SHAREHOLDING_AMOUNTS',('count(SHAREHOLDING_AMOUNT_ID) as count'));
		$select->where('DATE = ? ',$date);
		return $select->query()->fetch();
	}
	
	public function updateAmountDate($data,$where) {
	
		try {
			$table = new Application_Model_ShareholdingAmounts();
			$wherenya = $table->getAdapter()->quoteInto('DATE = ? ',$where['DATE']);
			$table->update($data,$wherenya);

		} catch (Exception $e) {
			$this->_error_code = $e->getCode();
			$this->_error_message = $e->getMessage();
			$this->_success = false;
		}

	}
	
	public function getNamaById($sid) 
	{
		$select = $this->select()
		->where('SHAREHOLDING_AMOUNT_ID = ?', $sid);
		return $select->query()->fetch();
	}
	
   public function getTotal($maxDate)
	{

		$select = $this->select();
		$select->from('SHAREHOLDING_AMOUNTS',array('*'));
		//$select->columns('SHAREHOLDING_ID');	
		$select->where('SHAREHOLDING_ID');
		$select->where('DATE = ?', $maxDate);	
		$select->group('SHAREHOLDING_ID');
		return $select->query()->fetchAll();
	}
	
	public function getMaxdate()
	{
	
		$select = $this->select();
		$select->from('SHAREHOLDING_AMOUNTS', array(new Zend_Db_Expr("MAX(DATE) AS maxDATE")));
		return $select->query()->fetchAll();
	}
	
    public function getIdamount($shareholdingid)
	{
		$select = $this->select();
		$select->from('SHAREHOLDING_AMOUNTS', array(new Zend_Db_Expr("MAX(DATE) AS maxID")));
		$select->where('SHAREHOLDING_ID = ?', $shareholdingid);
		return $select->query()->fetch();
	}
	
	public function getSum()
	{
		try {

			$q = $this->select()
			->from($this->_name, array('sum(AMOUNT) as TOTAL'))
			->distinct('SHAREHOLDING_ID')
			->limit(1,0);
			$x = $q->query()->fetch();
			return $x['TOTAL'];
		} catch(Exception $e) {
			return 0;
		}
	}
	
	public function getMaxAmounth($l,$shareholdingid)
	{
// 		$select = $this->select();
// 		$select->from('SHAREHOLDING_AMOUNTS',ARRAY('MAX(SHAREHOLDING_AMOUNT_ID) AS MAX_ID'));
// 		$select->where('SHAREHOLDING_ID = ?',$shareholdingid);
// 		$maxId =  $select->query()->fetch();
		
		$select = $this->select();
		$select->from('SHAREHOLDING_AMOUNTS',ARRAY('MAX(SHAREHOLDING_AMOUNT_ID) AS MAX_ID'));
		$select->where('SHAREHOLDING_ID = ?',$shareholdingid);
		$maxId =  $select->query()->fetch();

		$select = $this->select();
		$select->from('SHAREHOLDING_AMOUNTS','AMOUNT');
		$select->where('DATE = ? ',$l);
		$select->where('SHAREHOLDING_ID = ? ',$shareholdingid);
		
		//$select->where('SHAREHOLDING_AMOUNT_ID = ? ',$maxId);
		
		
		//echo $select->__toString();
		return $res['AMOUNT'] = $select->query()->fetch();
		
		
	}
}
