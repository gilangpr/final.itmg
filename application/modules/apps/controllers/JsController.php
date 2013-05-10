<?php 

class Apps_JsController extends Zend_Controller_Action
{
	public function init()
	{
		$this->_helper->layout()->disableLayout();
		$this->_helper->viewRenderer->setNoRender(true);
		$this->getResponse()->setHeader('Content-type', 'application/x-javascript');
	}
	
	public function modelsAction()
	{
		$models = new MyIndo_Ext_Models();
		$data = $models->getList();
		
		foreach($data as $k=>$d) {
			$parsed = $models->parser($d);
			echo "Ext.define(\"" . $parsed['modelName'] . "\", { extend: \"Ext.data.Model\", fields: " . Zend_Json::encode($parsed['fields']) . " });\n";
		}
	}
	
	public function storesAction()
	{
		$stores = new MyIndo_Ext_Stores();
		$data = $stores->getList();
		
		foreach($data as $k=>$d) {
			$parsed = $stores->parser($d);
			$model = substr($parsed['storeName'], 0, strlen($parsed['storeName'])-1);
			echo "Ext.create(\"Ext.data.Store\", {\n\tmodel: \"" . $model . "\",\n\tstoreId: \"" . $parsed['storeName'] . "\",\n\tproxy:" . Zend_Json::encode($parsed['proxy']) . ",\n\tsorter: " . Zend_Json::encode($parsed['sorters']) . "});\n";
		}
	}
}