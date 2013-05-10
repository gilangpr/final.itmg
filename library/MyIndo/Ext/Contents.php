<?php 

class MyIndo_Ext_Contents extends MyIndo_Ext_Abstract
{
	protected $_name = 'CONTENTS';
	protected $_id = 'CONTENT_ID';
	
	public function parser($data, $groups = array())
	{
		$cc = new MyIndo_Ext_ContentColumns();
		$ct = new MyIndo_Ext_ContentTbars();
		
		$json = array();
		
		if(isset($data['XTYPE'])) {
			$json['xtype'] = $data['XTYPE'];
			$json['id'] = $data['ID'];
			$json['tbars'] = $ct->parser($ct->getListByKey('CONTENT_ID', $data['CONTENT_ID'], 'INDEX ASC'), $groups);
			$json['columns'] = $cc->parser($cc->getListByKey('CONTENT_ID', $data['CONTENT_ID'], 'INDEX ASC'));
		}
		
		return $json;
	}
}