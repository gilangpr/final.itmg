<?php

class Coalsales_RequestController extends Zend_Controller_Action
{
	protected $_model;
	protected $_limit;
	protected $_start;
	protected $_posts;
	protected $_error_code;
	protected $_error_message;
	protected $_success;
	protected $_data;
	protected $_pk;

	public function init()
	{
		$this->_helper->layout()->disableLayout();
		$this->_helper->viewRenderer->setNoRender(true);
		$this->_model = new Application_Model_Coalsales();
		if($this->getRequest()->isPost()) {
			$this->_posts = $this->getRequest()->getPost();
		} else {
			$this->_posts = array();
		}

		$this->_start = (isset($this->_post['start'])) ? $this->_post['start'] : 0;
		$this->_limit = (isset($this->_post['limit'])) ? $this->_post['limit'] : 25;

		$this->_error_code = 0;
		$this->_error_message = '';
		$this->_success = true;

		$this->_data = array();
		$this->_pk = 'COAL_SALES_DISTRIBUTION_ID';
	}

	public function indexAction()
	{

	}

	public function getTitleAction()
	{
		$titleList = $this->_model->select();
		$titleList = $titleList->query()->fetchAll();
		$title = array(array('flex'=>1,'text'=>'', 'dataIndex'=>'NAME'));
		foreach ($titleList as $k => $d) {
			$title [$k+1]['text'] = $d['TITLE'];
			$title [$k+1]['dataIndex'] = $d['TITLE'];
			$title [$k+1]['align'] = 'center';
		}
		$data = array(
			'data' => array(
				'items' => $title
			)
		);
		MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}

	public function createAction()
	{
		$data = array(
				'data' => array()
		);
		$modelCS = new Application_Model_Coalsales();
		$modelTitle = new Application_Model_CoalSalesTitle();
		$modelPeers = new Application_Model_Peers();
		try {
			//Insert Data :
			$peer_id = $this->_getParam('id',0);
			if ($modelPeers->isExistByKey('PEER_ID', $peer_id)) {
				$this->_model->insert(array(
					'PEER_ID' => $peer_id,
					'TITLE' => $this->_posts['TITLE'],
					'TYPE' => $this->_posts['TYPE'],
					'COUNTRY' => $this->_posts['COUNTRY'],
					'VOLUME' => $this->_posts['VOLUME'],
					'CREATED_DATE' => date('Y-m-d H:i:s')
				));
				/* Check Title */
				if(!$modelTitle->isExistByKey('TITLE', $this->_posts['TITLE'])) {
					$modelTitle->insert(array(
							'TITLE' => $this->_posts['TITLE'],
							'CREATED_DATE' => date('Y-m-d H:i:s')
							));
				}
				/* End of : Check Title */
				
				/* Coal Sales */
				$q = $this->_model->select()
				->where('PEER_ID = ?', $peer_id)
				->where('COUNTRY = ?', $this->_posts['COUNTRY'])
				->where('TITLE = ?', $this->_posts['TITLE']);
				$x = $q->query()->fetch();
				
				if($q->query()->rowCount() == 0) {
					$this->_model->insert(array(
							'PEER_ID' => $peer_id,
							'TITLE' => $this->_posts['TITLE'],
							'TYPE' => $this->_posts['TYPE'],
							'COUNTRY' => $this->_posts['COUNTRY'],
							'VOLUME' => $this->_posts['VOLUME'],
							'CREATED_DATE' => date('Y-m-d H:i:s')
							));
				} else {
					$this->_model->update(array(
							'TYPE' => $this->_posts['TYPE'],
							'VOLUME' => $this->_posts['VOLUME'],
							'CREATED_DATE' => date('Y-m-d H:i:s')
							),$this->_model->getAdapter()->quoteInto('COAL_SALES_DISTRIBUTION_ID = ?', $x['COAL_SALES_DISTRIBUTION_ID']));
				}
				
			} else {
				$this->_error_code = 404;
				$this->_error_message = 'PEER_ID NOT FOUND';
				$this->_success = false;
			}
		}catch(Exception $e) {
			$this->_error_code = $e->getCode();
			$this->_error_message = $e->getMessage();
			$this->_success = false;
		}
		
		MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}

	public function readAction()
	{
		
		$modelCoalsales = new Application_Model_Coalsales();
		$modelCoalSalesTitle = new Application_Model_CoalSalesTitle();
		$peer_id = (isset($this->_posts['id'])) ? $this->_posts['id'] : 0;
		$data = array('data'=>array());
		if ($modelCoalsales->isExistByKey('PEER_ID', $peer_id)) {
			$q = $this->_model->select()
			->setIntegrityCheck(false)
			->from('COAL_SALES_DISTRIBUTION', array('*'))
			->where('PEER_ID = ?', $peer_id)
			->join('COAL_SALES_DISTRIBUTION_TITLE','COAL_SALES_DISTRIBUTION.TITLE = COAL_SALES_DISTRIBUTION_TITLE.TITLE', array('*'))
			->order('COAL_SALES_DISTRIBUTION_TITLE.CREATED_DATE DESC');
			
			if($q->query()->rowCount() > 0) {
				$list = $q->query()->fetchAll();
				$lastTitle = $list[0]['TITLE'];
				
				$list = $this->_model->select()
				->where('PEER_ID = ?', $peer_id)
				->where('TITLE = ?', $lastTitle);
				
				$list = $list->query()->fetchAll();
				
				$data = array(
					'data' => array(
						'items' => $list,
						'totalCount' => $this->_model->count()
						)
					);
	
				$domestic = 0;
				$export = 0;
				foreach($list as $k=>$d) {
					if(strtolower($d['TYPE']) == 'domestic') {
						$domestic += $d['VOLUME'];
					} else {
						$export += $d['VOLUME'];
					}
				}
				$sum = $domestic + $export;
				$data = array(
					'data' => array(
					'items' => array(
						array(
							'NAME' => 'Domestic',
							'VOLUME' => $domestic,
							'PERCENTAGE' => number_format(($domestic / $sum) * 100, 2) . '%'
							),
						array(
							'NAME' => 'Export',
							'VOLUME' => $export,
							'PERCENTAGE' => number_format(($export / $sum) * 100, 2) . '%'
							)
						)
				));
			
			}

		}

		MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}
	
	/* ACTION READ FOR COAL SALES DISTRIBUTION BY COUNTRY */
	public function read2Action()
	{
		$modelCoalsales = new Application_Model_Coalsales();
		$peer_id = (isset($this->_posts['id'])) ? $this->_posts['id'] : 0;
		if ($modelCoalsales->isExistByKey('PEER_ID', $peer_id)) {
			
			$list = $this->_model->getListCS($peer_id);
			
// 			$list = $this->_model->select()->where('PEER_ID = ?', $peer_id);
// 			$list = $list->query()->fetchAll();
		
			$data = array(
					'data' => array(
							'items' => $list,
							'totalCount' => count($list)
					)
				);
// 			$sum = 0;
// 			foreach($list as $k=>$d) {
// 				$sum += $d['VOLUME'];
// 			}
			
// 			$data = array(
// 					'data' => array(
// 						'items' => array(
// 							'NAME' => $d['COUNTRY'],
// 							'VOLUME' => $d['VOLUME'],
// 							'PERCENTAGE' => number_format(($d['VOLUME'] / $sum) * 100,2) . '%'
// 						)
// 					)	
// 				);
		}
		MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}
	
	public function read3Action()
	{
		$modelCS = new Application_Model_Coalsales();
		$modelCST = new Application_Model_CoalSalesTitle();
		$data = array(
				'data' => array(
						'items' => array(),
						'totalCount' => 0
						)
				);
		if($this->getRequest()->isPost() && $this->getRequest()->isXmlHttpRequest()) {
			if(isset($this->_posts['id'])) {
				if($modelCS->isExistByKey('PEER_ID', $this->_posts['id'])) {
					
					$peer_id = $this->_posts['id'];
					$q = $this->_model->select()
					->setIntegrityCheck(false)
					->from('COAL_SALES_DISTRIBUTION', array('*'))
					->where('PEER_ID = ?', $peer_id)
					->join('COAL_SALES_DISTRIBUTION_TITLE','COAL_SALES_DISTRIBUTION.TITLE = COAL_SALES_DISTRIBUTION_TITLE.TITLE', array('*'))
					->order('COAL_SALES_DISTRIBUTION_TITLE.CREATED_DATE DESC');
					
					if($q->query()->rowCount() > 0) {
						$list = $q->query()->fetch();
						$lastTitle = $list['TITLE'];
						
						$list = $modelCS->select()
						//->from('COAL_SALES_DISTRIBUTION', array('COUNTRY','VOLUME','sum(VOLUME) as TOTAL'))
						->where('PEER_ID = ?', $peer_id)
						->where('TITLE = ?', $lastTitle);
						//->group(array('COUNTRY'));
						
						$list = $list->query()->fetchAll();
						$total = 0;
						foreach($list as $k=>$d) {
							$total += $d['VOLUME'];
						}
						foreach($list as $k=>$d) {
							$list[$k]['PERCENTAGE'] = number_format(($d['VOLUME'] / $total) * 100,2) . '%';
						}
						
						$data = array(
								'data' => array(
										'items' => $list,
										'totalCount' => count($list)
								)
						);
					}
					
				}
			}
		}
		
		MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}

	/* New function - Dev ( Gilang ) */

	public function readDevAction()
	{
		$modelPeer = new Application_Model_Peers();
		$id = (isset($this->_posts['id'])) ? $this->_posts['id'] : 0;
		if($modelPeer->isExistByKey('PEER_ID', $id)) {
				
				$q = $this->_model->select()
				->where('PEER_ID = ?', $id)
				->order('TITLE DESC')
				->order('COUNTRY ASC')
				->limit($this->_posts['limit'], $this->_posts['start']);
				$list = $q->query()->fetchAll();
				
				$q = $this->_model->select()
				->where('PEER_ID = ?', $id);
				$listAll = $q->query()->fetchAll();
				
				$this->_data = array(
					'data' => array(
						'items' => $list,
						'totalCount' => count($listAll)
						)
					);

		}
		MyIndo_Tools_Return::JSON($this->_data, $this->_error_code, $this->_error_message, $this->_success);
	}

	public function updateDevAction()
	{
		$data = Zend_Json::decode($this->getRequest()->getRawBody());
		if(isset($data['data'][$this->_pk])) {
			$id = $data['data'][$this->_pk];
			if($this->_model->isExistByKey($this->_pk, $id)) {
				try {
					$this->_model->update(array(
						'TITLE' => $data['data']['TITLE'],
						'TYPE' => $data['data']['TYPE'],
						'COUNTRY' => $data['data']['COUNTRY'],
						'VOLUME' => $data['data']['VOLUME']
						), $this->_model->getAdapter()->quoteInto($this->_pk . ' = ?', $id));
					$this->_data = $data;
				}catch(Exception $e) {
					$this->_error_code = $e->getCode();
					$this->_error_message = $e->getMessage();
					$this->_success = false;
				}
			} else {
				$this->_error_code = 101;
				$this->_error_message = MyIndo_Tools_Error::getErrorMessage($this->_error_code);
				$this->_success = false;
			}
		} else {
			$this->_error_code = '901';
			$this->_error_message = MyIndo_Tools_Error::getErrorMessage($this->_error_code);
			$this->_success = false;
		}
		MyIndo_Tools_Return::JSON($this->_data, $this->_error_code, $this->_error_message, $this->_success);
	}

	public function destroyDevAction()
	{
		if(isset($this->_posts['id'])) {
			$id = $this->_posts['id'];
			if($this->_model->isExistByKey($this->_pk, $id)) {
				try {
					$this->_model->delete($this->_model->getAdapter()->quoteInto($this->_pk . ' = ?', $id));
				}catch(Exception $e) {
					$this->_error_code = $e->getCode();
					$this->_error_message = $e->getMessage();
					$this->_success = false;
				}
			} else {
				$this->_error_code = 101;
				$this->_error_message = MyIndo_Tools_Error::getErrorMessage($this->_error_code);
				$this->_success = false;
			}
		} else {
			$this->_error_code = '901';
			$this->_error_message = MyIndo_Tools_Error::getErrorMessage($this->_error_code);
			$this->_success = false;
		}
		MyIndo_Tools_Return::JSON($this->_data, $this->_error_code, $this->_error_message, $this->_success);
	}
	
}
