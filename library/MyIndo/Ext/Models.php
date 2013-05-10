<?php 

class MyIndo_Ext_Models extends MyIndo_Ext_Abstract
{
	protected $_name = 'MODELS';
	protected $_id = 'MODEL_ID';
	
	public function parser($data)
	{
		$mf = new MyIndo_Ext_ModelFields();
		$json = array();
		if(isset($data['NAME'])) {
			$json['modelName'] = $data['NAME'];
			$json['fields'] = $mf->parser($mf->getListByKey('MODEL_ID', $data['MODEL_ID']));
		}
		return $json;
	}
}