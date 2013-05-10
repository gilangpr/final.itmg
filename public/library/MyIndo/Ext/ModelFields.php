<?php 

class MyIndo_Ext_ModelFields extends MyIndo_Ext_Abstract
{
	protected $_name = 'MODEL_FIELDS';
	protected $_id = 'MODEL_FIELD_ID';
	
	public function parser($data)
	{
		$json = array();
		foreach($data as $k=>$d) {
			$json[$k]['name'] = $d['NAME'];
			$json[$k]['type'] = $d['TYPE'];
		}
		return $json;
	}
}