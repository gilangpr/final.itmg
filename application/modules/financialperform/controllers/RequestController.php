<?php 

class Financialperform_RequestController extends Zend_Controller_Action
{
	protected $_model;
	protected $_limit;
	protected $_start;
	protected $_posts;
	protected $_error_code;
	protected $_error_message;
	protected $_success;
	
	public function init()
	{
		$this->_helper->layout()->disableLayout();
		$this->_helper->viewRenderer->setNoRender(true);
		$this->_model = new Application_Model_FinancialPerform();
		if($this->getRequest()->isPost()) {
			$this->_posts = $this->getRequest()->getPost();
		} else {
			$this->_posts = array();
		}
		
		$this->_start = (isset($this->_posts['start'])) ? $this->_posts['start'] : 0;
		$this->_limit = (isset($this->_posts['limit'])) ? $this->_posts['limit'] : 25;
		
		$this->_error_code = 0;
		$this->_error_message = '';
		$this->_success = true;
	}
	public function indexAction()
	{
		
	}
	
	public function getTitleAction()
	{
		$titleList = $this->_model->select();
		$titleList = $titleList->query()->fetchAll();
		$title = array(array('flex'=>1,'text'=>'','dataIndex'=>'NAME'));
		foreach($titleList as $k=>$d) {
			$title[$k+1]['text'] = $d['TITLE'];
			$title[$k+1]['dataIndex'] = 'VALUE_' . $d['TITLE'];
			$title[$k+1]['align'] = 'center';
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
		$modelPeer = new Application_Model_Peers();
		try {
			/* INSERT FINANCIAL PERFORMANCE DATA */
			$peer_id = $this->_getParam('id',0);
			if($modelPeer->isExistByKey('PEER_ID', $peer_id)) {
				
				$_q = $this->_model->select()
				->where('TITLE = ?', $this->_posts['TITLE'])
				->where('PEER_ID = ?', $peer_id);
				$_res = $_q->query()->fetchAll();
				
				if(count($_res) == 0) {
				$this->_model->insert(array(
						'PEER_ID' => $peer_id,
						'TITLE' => $this->_posts['TITLE'],
						'REVENUE' => $this->_posts['REVENUE'],
						'GROSS_PROFIT' => $this->_posts['GROSS_PROFIT'],
						'EBIT' => $this->_posts['EBIT'],
						'EBITDA' => $this->_posts['EBITDA'],
						'NET_PROFIT' => $this->_posts['NET_PROFIT'],
						'TOTAL_ASSETS' => $this->_posts['TOTAL_ASSETS'],
						'CASH' => $this->_posts['CASH'],
						'GROSS_PROFIT_MARGIN' => $this->_posts['GROSS_PROFIT_MARGIN'],
						'EBIT_MARGIN' => $this->_posts['EBIT_MARGIN'],
						'NET_PROFIT_MARGIN' => $this->_posts['NET_PROFIT_MARGIN'],
						'RETURN_ASSET' => $this->_posts['RETURN_ASSET'],
						'RETURN_EQUITY' => $this->_posts['RETURN_EQUITY'],
						'RETURN_INVESTMENT' => $this->_posts['RETURN_INVESTMENT'],
						'CREATED_DATE' => date('Y-m-d H:i:s')
					));
				} else {
					$this->_model->update(array(
						'REVENUE' => $this->_posts['REVENUE'],
						'GROSS_PROFIT' => $this->_posts['GROSS_PROFIT'],
						'EBIT' => $this->_posts['EBIT'],
						'EBITDA' => $this->_posts['EBITDA'],
						'NET_PROFIT' => $this->_posts['NET_PROFIT'],
						'TOTAL_ASSETS' => $this->_posts['TOTAL_ASSETS'],
						'CASH' => $this->_posts['CASH'],
						'GROSS_PROFIT_MARGIN' => $this->_posts['GROSS_PROFIT_MARGIN'],
						'EBIT_MARGIN' => $this->_posts['EBIT_MARGIN'],
						'NET_PROFIT_MARGIN' => $this->_posts['NET_PROFIT_MARGIN'],
						'RETURN_ASSET' => $this->_posts['RETURN_ASSET'],
						'RETURN_EQUITY' => $this->_posts['RETURN_EQUITY'],
						'RETURN_INVESTMENT' => $this->_posts['RETURN_INVESTMENT']
					),$this->_model->getAdapter()->quoteInto('FINANCIAL_PERFORM_ID = ?',
						$this->_model->getPkByKey('TITLE', $this->_posts['TITLE'])
					));
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
		$modelPeer = new Application_Model_FinancialPerform();
		$peer_id = (isset($this->_posts['id'])) ? $this->_posts['id'] : 0;
		if($modelPeer->isExistByKey('PEER_ID', $peer_id)) {
			$list = $this->_model->select()->where('PEER_ID = ?', $peer_id);
			$list = $list->query()->fetchAll();
			
			$attr = array(
					'REVENUE' => array('title' => 'Revenue'),
					'GROSS_PROFIT' => array('title' => 'Gross Profit'),
					'EBIT' => array('title' => 'EBIT'),
					'EBITDA' => array('title' => 'EBITDA'),
					'NET_PROFIT' => array('title' => 'Net Profit'),
					'TOTAL_ASSETS' => array('title' => 'Total Assets'),
					'CASH' => array('title' => 'Cash'),
					'GROSS_PROFIT_MARGIN' => array('title' => 'Gross Profit Margin (%)'),
					'EBIT_MARGIN' => array('title' => 'EBIT Margin (%)'),
					'NET_PROFIT_MARGIN' => array('title' => 'Net Profit Margin (%)'),
					'RETURN_ASSET' => array('title' => 'Return On Assets (%)'),
					'RETURN_EQUITY' => array('title' => 'Return On Equity (%)'),
					'RETURN_INVESTMENT' => array('title' => 'Return On Investment (%)')
			);
			$content = array();
			$i = 0;
			$j = 0;
			foreach($list as $k=>$d) {
				if($j!=$k) {
					$i=0;
					$j=$k;
				}
				foreach($attr as $_k=>$_d) {
						$content[$i]['NAME'] = $_d['title'];
						$content[$i]['VALUE_' . $d['TITLE']] = $d[$_k];
						$i++;
				}
				$content[$k]['TITLE'] = $d['TITLE'];
			}
			$data = array(
				'data' => array(
					'items' => $content,
					'totalCount' => count($list)
					)
				);
		} else {
			$data = array(
					'data' => array(
							'items' => array(),
							'totalCount' => 0
					)
			);
		}
		MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}
	
	public function updateAction()
	{
		$this->_model = new Application_Model_FinancialPerform();
		$data = array(
				'data' => array()
				);
		
		try {
			$peer_id = $this->_getParam('id', 0);
			if($modelPeer->isExistByKey(PEER_ID, $peer_id)) {
				$this->_model->update(array(
						'REVENUE' => $this->_posts['REVENUE'],
						'GROSS_PROFIT' => $this->_posts['GROSS_PROFIT'],
						'EBIT' => $this->_posts['EBIT'],
						'EBITDA' => $this->_posts['EBITDA'],
						'NET_PROFIT' => $this->_posts['NET_PROFIT'],
						'TOTAL_ASSETS' => $this->_posts['TOTAL_ASSETS'],
						'CASH' => $this->_posts['CASH'],
						'GROSS_PROFIT_MARGIN' => $this->_posts['GROSS_PROFIT_MARGIN'],
						'EBIT_MARGIN' => $this->_posts['EBIT_MARGIN'],
						'NET_PROFIT_MARGIN' => $this->_posts['NET_PROFIT_MARGIN'],
						'RETURN_ASSET' => $this->_posts['RETURN_ASSET'],
						'RETURN_EQUITY' => $this->_posts['RETURN_EQUITY'],
						'RETURN_INVESTMENT' => $this->_posts['RETURN_INVESTMENT']
				),$this->_model->getAdapter()->quoteInto('FINANCIAL_PERFORM_ID = ?',
						$this->_model->getPkByKey('TITLE', $this->_posts['TITLE'])
				));
			} else {
				$this->_error_code = 404;
				$this->_error_message = 'PEER_ID NOT FOUND';
				$this->_success = false;
			}
		}
		catch (Exception $e) {
			$this->_error_code = $e->getCode();
			$this->_error_message = $e->getMessage();
			$this->_success = false;
		}
		
		MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}
	
	public function destroyAction()
	{
		$data = array(
				'data' => array()
				);
		try {
			// Delete
 			// $this->_model->delete(
 			// 		$this->_model->getAdapter()->quoteInto(
 			// 				'INVESTOR_TYPE_ID = ?', $this->_posts['INVESTOR_TYPE_ID']
 			// 				));
		}catch(Exception $e) {
			$this->_error_code = $e->getCode();
			$this->_error_message = $e->getMessage();
			$this->_success = false;
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
		if(isset($data['data']['FINANCIAL_PERFORM_ID'])) {
			$id = $data['data']['FINANCIAL_PERFORM_ID'];
			if($this->_model->isExistByKey('FINANCIAL_PERFORM_ID', $id)) {
				try {
					$this->_model->update(array(
						'TITLE' => $data['data']['TITLE']
						), $this->_model->getAdapter()->quoteInto('FINANCIAL_PERFORM_ID = ?', $id));
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
			if($this->_model->isExistByKey('FINANCIAL_PERFORM_ID', $id)) {
				try {
					$this->_model->delete($this->_model->getAdapter()->quoteInto('FINANCIAL_PERFORM_ID = ?', $id));
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