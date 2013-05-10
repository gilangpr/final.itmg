<?php 

use JShrink\Minifier;

class Dashboard_RequestController extends Zend_Controller_Action
{
	protected $_p;
	protected $_data;
	protected $_error_code;
	protected $_error_message;
	protected $_success;
	
	public function init()
	{
		$this->_helper->layout()->disableLayout();
		$this->_helper->viewRenderer->setNoRender(true);
		if($this->getRequest()->isPost()) {
			$this->_p = $this->getRequest()->getPost();
		} else {
			$this->_p = array();
		}
		$this->_data = array(
			'data' => array(
				'items' => array(),
				'store' => array(),
				'models' => array()
			)
		);
		$this->_error_code = 0;
		$this->_error_message = '';
		$this->_success = true;
	}
	
	public function getStoreAction()
	{
		if($this->getRequest()->isPost()) {
			try {
				$storeModel = new MyIndo_Ext_Stores();
				$detail = $storeModel->getDetailByKey('NAME', $this->_p['name']);
				$this->_data['data']['items'] = $detail;
				$this->_data['data']['store'] = $storeModel->parser($detail);
			} catch( Exception $e ) {
				$this->_error_code = $e->getCode();
				$this->_error_message = $e->getMessage();
				$this->_success = false;
			}
		}
		MyIndo_Tools_Return::JSON($this->_data);
	}
	
	public function getTreeAction()
	{
		if($this->getRequest()->isPost()) {
			try {
				$treeStoreModel = new MyIndo_Ext_TreeStores();
				$list = $treeStoreModel->getListByKey('NAME', $this->_p['name']);
				$this->_data['data']['items'] = $treeStoreModel->parser($list, $this->view->groups);
			} catch( Exception $e ) {
				$this->_error_code = $e->getCode();
				$this->_error_message = $e->getMessage();
				$this->_success = false;
			}
		}
		MyIndo_Tools_Return::JSON($this->_data, $this->_error_code, $this->_error_message, $this->_success);
	}
	
	public function getTbarListenersAction()
	{
		if($this->getRequest()->isPost()) {
			try {
				$ct = new MyIndo_Ext_ContentTbars();
				$ctl = new MyIndo_Ext_ContentTbarListeners();
				
				$id = $this->_p['id'];
				$this->view->container = $this->_p['container'];
				
				if($this->_p['container'] == 'Peer-List-tabchild') {
					$this->view->fpColumns = $this->getFpColumns(new Application_Model_FinancialPerform());
					$this->view->fpFields = $this->getFpFields(new Application_Model_FinancialPerform());
					$this->view->csdColumns = $this->getCsdColumns(new Application_Model_Coalsales());
					$this->view->csdFields = $this->getCsdFields(new Application_Model_Coalsales());
					$this->view->srColumns = $this->getSrColumns(new Application_Model_StrippingRatio());
					$this->view->srFields = $this->getSrFields(new Application_Model_StrippingRatio());
					$this->view->sryColumns = $this->getSryColumns(new Application_Model_StrippingRatioYear());
					$this->view->sryFields = $this->getSryFields(new Application_Model_StrippingRatioYear());
					$this->view->aspColumns = $this->getAspColumns(new Application_Model_SellingPrice());
					$this->view->aspFields = $this->getAspFields(new Application_Model_SellingPrice());
					$this->view->csyColumns = $this->getCsyColumns(new Application_Model_CompositionCompany());
					$this->view->csyFields = $this->getCsyFields(new Application_Model_CompositionCompany());
					$this->view->fobColumns = $this->getFobColumns(new Application_Model_TotalCashCost());
					$this->view->fobFields = $this->getFobFields(new Application_Model_TotalCashCost());
					$this->view->csd_bcColumns = $this->getCsd_bcColumns(new Application_Model_Coalsales());
					$this->view->csd_bcFields = $this->getCsd_bcFields(new Application_Model_Coalsales());
				}
				
				$this->_data['data']['items'] = $this->view->render($ctl->getValueByKey('CONTENT_TBAR_ID', $ct->getPkByKey('ID', $id), 'PATH'));
				$this->_data['data']['container'] = $this->_p['container'];
				$this->_data['data']['items'] = base64_encode(JShrink\Minifier::minify($this->_data['data']['items']));
				//include_once APPLICATION_PATH . '/../library/JShrink/Minifier.php';
				
			} catch( Exception $e ) {
				$this->_error_code = $e->getCode();
				$this->_error_message = $e->getMessage();
				$this->_success = false;
			}
		}
		MyIndo_Tools_Return::JSON($this->_data, $this->_error_code, $this->_error_message, $this->_success);
	}
	
	protected function getFpColumns($model)
	{
		$list = $model->select()->order('CREATED_DATE DESC')->limit(3,0);
		$list = $list->query()->fetchAll();
		$columns = array(array(
				'flex' => 1,
				'text' => '',
				'dataIndex' => 'NAME'
				));
		foreach($list as $k=>$d) {
			$columns[$k+1]['text'] = $d['TITLE'];
			$columns[$k+1]['dataIndex'] = 'VALUE_' . $d['TITLE'];
			$columns[$k+1]['align'] = 'center';
		}
		return Zend_Json::encode($columns);
	}
	
	protected function getFpFields($model)
	{
		$list = $model->select()->order('CREATED_DATE DESC')->limit(3,0);
		$list = $list->query()->fetchAll();
		$fields = array(array(
				'name' => 'NAME',
				'type' => 'string'
				));
		foreach($list as $k=>$d) {
			$fields[$k+1]['name'] = 'VALUE_' . $d['TITLE'];
			$fields[$k+1]['type'] = 'float';
		}
		$c = count($fields);
		$fields[$c]['name'] = 'TITLE';
		$fields[$c]['type'] = 'string';
		return Zend_Json::encode($fields);
	}

	protected function getCsdColumns($model)
	{
		$list = $model->select()->limit(1,0)->order('CREATED_DATE DESC');
		$list = $list->query()->fetchAll();
		if(count($list) > 0) {
			$columns = array(array(
				'flex' => 1,
				'text' => $list[0]['TITLE'],
				'align' => 'center',
				'dataIndex' => 'NAME'
			),array(
				'text' => 'Volume',
				'align' => 'center',
				'dataIndex' => 'VOLUME'
			),array(
				'text' => 'Percentage',
				'align' => 'center',
				'dataIndex' => 'PERCENTAGE'
			));
		} else {
			$columns = array(array(
				'flex' => 1,
				'text' => '',
				'align' => 'center',
				'dataIndex' => 'NAME'
			),array(
				'text' => 'Volume',
				'align' => 'center',
				'dataIndex' => 'VOLUME'
			),array(
				'text' => 'Percentage',
				'align' => 'center',
				'dataIndex' => 'PERCENTAGE'
			));
		}
// 		$columns = array(
// 				'editor' => array(
// 					'xtype'=> 'numberfield',
// 					'allowBlank' => false,
// 					'minValue' => 0
// 		));
		return Zend_Json::encode($columns);
	}

	protected function getCsdFields($model)
	{
		$list = $model->select()->order('CREATED_DATE DESC')->limit(1,0);
		$list = $list->query()->fetchAll();
		$fields = array(array(
			'name' => 'NAME',
			'type' => 'string'
			),
		array(
			'name' => 'VOLUME',
			'type' => 'float'	
		),array(
			'name' => 'PERCENTAGE',
			'type' => 'string'
		));
		return Zend_Json::encode($fields);
	}
	
	//COAL SALES DISTRIBUTION BY COUNTRY COLUMNS
	protected function getCsd_bcColumns($model)
	{
		$list = $model->select()->limit(1,0)->order('CREATED_DATE DESC');
		$list = $list->query()->fetchAll();
		$columns = array(array(
				'flex' => 1,
				'text' => 'Country',
				'align' => 'center',
				'dataIndex' => 'COUNTRY'
		),array(
				'flex' => 1,
				'text' => 'Percentage',
				'align' => 'center',
				'dataIndex' => 'PERCENTAGE'
		));
		return Zend_Json::encode($columns);
	}
	
	//COAL SALES DISTRIBUTION BY COUNTRY FIELDS
	protected function getCsd_bcFields($model)
	{
		$list = $model->select()->order('CREATED_DATE DESC')->limit(1,0);
		$list = $list->query()->fetchAll();
		$fields = array(array(
				'name' => 'COUNTRY',
				'type' => 'string'
		),array(
				'name' => 'PERCENTAGE',
				'type' => 'string'
		));
		return Zend_Json::encode($fields);
	}
	
	protected function getSrColumns($model)
	{
		
		$list = $model->select()->order('CREATED_DATE DESC')->limit(3,0);
		$list = $list->query()->fetchAll();
		$columns = array(array(
				'flex' => 1,
				'text' => '',
				'dataIndex' => 'NAME'
		));
		foreach($list as $k=>$d) {
			$columns[$k+1]['text'] = $d['TITLE'];
			$columns[$k+1]['dataIndex'] = 'VALUE_' . $d['TITLE'];
			$columns[$k+1]['align'] = 'center';
		}
		return Zend_Json::encode($columns);
	}
	
	protected function getSrFields($model)
	{
		$list = $model->select()->order('CREATED_DATE DESC')->limit(3,0);
		$list = $list->query()->fetchAll();
		$fields = array(array(
				'name' => 'NAME',
				'type' => 'string'
		));
		foreach($list as $k=>$d) {
			$fields[$k+1]['name'] = 'VALUE_' . $d['TITLE'];
			$fields[$k+1]['type'] = 'float';
		}
		$c = count($fields);
		$fields[$c]['name'] = 'TITLE';
		$fields[$c]['type'] = 'string';
		return Zend_Json::encode($fields);
	}
	
	protected function getSryColumns($model)
	{
		$list = $model->select()->order('CREATED_DATE DESC')->limit(5,0);
		$list = $list->query()->fetchAll();
		$columns = array();
		foreach ($list as $k=>$d) {
			$columns[$k]['text'] = $d['TITLE'];
			$columns[$k]['dataIndex'] = 'VALUE_' . $d['TITLE'];
			$columns[$k]['align'] = 'center';
			$columns[$k]['flex'] = 1;
			$columns[$k]['editor'] = array(
					'xtype'=> 'numberfield',
					'allowBlank' => false,
					'minValue' => 0
					);
		}
		return Zend_Json::encode($columns);
	}
	
	protected function getSryFields($model)
	{
		$list = $model->select()->order('CREATED_DATE DESC')->limit(5,0);
		$list = $list->query()->fetchAll();
		$fields = array(array(
				'name' => 'NAME',
				'type' => 'string'
		));
		foreach($list as $k=>$d) {
			$fields[$k+1]['name'] = 'VALUE_' . $d['TITLE'];
			$fields[$k+1]['type'] = 'float';
		}
		return Zend_Json::encode($fields);
	}

	protected function getAspColumns($model)
	{
		$list = $model->select()->order('CREATED_DATE DESC')->limit(3,0);
		$list = $list->query()->fetchAll();
		$columns = array(array(
				'flex' => 1,
				'text' => '',
				'dataIndex' => 'NAME'
		));
		foreach($list as $k=>$d) {
			$columns[$k+1]['text'] = $d['TITLE'];
			$columns[$k+1]['dataIndex'] = 'VALUE_' . $d['TITLE'];
			$columns[$k+1]['align'] = 'center';
		}
		return Zend_Json::encode($columns);
	}

	protected function getAspFields($model)
	{
		$list = $model->select()->order('CREATED_DATE DESC')->limit(5,0);
		$list = $list->query()->fetchAll();
		$fields = array(array(
				'name' => 'NAME',
				'type' => 'string'
		));
		foreach($list as $k=>$d) {
			$fields[$k+1]['name'] = 'VALUE_' . $d['TITLE'];
			$fields[$k+1]['type'] = 'float';
		}
		$c = count($fields);
		$fields[$c]['name'] = 'TITLE';
		$fields[$c]['type'] = 'string';
		return Zend_Json::encode($fields);
	}

	protected function getCsyColumns($model)
	{
		$list = $model->select()->order('CREATED_DATE DESC')->limit(2,0);
		$list = $list->query()->fetchAll();
		$columns = array(array(
// 				'flex' => 1,
				'width' => 200,
				'text' => 'Ownership',
				'dataIndex' => 'NAME'
		));
		foreach($list as $k=>$d) {
			$columns[$k+1]['text'] = $d['TITLE'];
// 			$columns[$k+1]['dataIndex'] = 'VALUE_' . $d['TITLE'];
			$columns[$k+1]['align'] = 'center';
			$columns[$k+1]['flex'] = '1';
			$columns[$k+1]['columns'] = array(array(
// 					'flex' => 1,
					'text' => 'Value',
					'width'=> 90,
					'dataIndex' => 'VALUE_' . $d['TITLE'],
					'align' => 'center',
					'editor' => array(
							'xtype' => 'numberfield',
							'allowBlank' => false,
							'minValue' => 0
							)
					),array(
// 					'flex' => 1,
					'width'=> 90,
					'text' => 'Percentage',
					'dataIndex' => 'PERCENTAGE_' . $d['TITLE'],
					'align' => 'center'
					));
		}
		return Zend_Json::encode($columns);
	}

	protected function getCsyFields($model)
	{
		$list = $model->select()->order('CREATED_DATE DESC')->limit(2,0);
		$list = $list->query()->fetchAll();
		$fields = array(array(
				'name' => 'NAME',
				'type' => 'string'
		));
		foreach($list as $k=>$d) {
			$idx = count($fields);
			$fields[$idx]['name'] = 'VALUE_' . $d['TITLE'];
			$fields[$idx]['type'] = 'float';
			$fields[$idx+1]['name'] = 'PERCENTAGE_' . $d['TITLE'];
			$fields[$idx+1]['type'] = 'string';
		}
		$c = count($fields);
		$fields[$c]['name'] = 'TITLE';
		$fields[$c]['type'] = 'string';
		
		return Zend_Json::encode($fields);
	}
	
	protected function getFobColumns($model)
	{
		$list = $model->select()->order('CREATED_DATE DESC')->limit(3,0);
		$list = $list->query()->fetchAll();
		$columns = array(array(
				'flex' => 1,
				'text' => '',
				'dataIndex' => 'NAME'
		));
		foreach($list as $k=>$d) {
			$columns[$k+1]['text'] = $d['TITLE'];
			$columns[$k+1]['dataIndex'] = 'VALUE_' . $d['TITLE'];
			$columns[$k+1]['align'] = 'center';
			$columns[$k+1]['editor'] = array(
					'xtype'=> 'numberfield',
					'allowBlank' => false,
					'minValue' => 0
			);
		}
		return Zend_Json::encode($columns);
	}
	
	protected function getFobFields($model)
	{
		$list = $model->select()->order('CREATED_DATE DESC')->limit(5,0);
		$list = $list->query()->fetchAll();
		$fields = array(array(
				'name' => 'NAME',
				'type' => 'string'
		));
		foreach($list as $k=>$d) {
			$fields[$k+1]['name'] = 'VALUE_' . $d['TITLE'];
			$fields[$k+1]['type'] = 'float';
		}
		$c = count($fields);
		$fields[$c]['name'] = 'TITLE';
		$fields[$c]['type'] = 'string';
		return Zend_Json::encode($fields);
	}
}