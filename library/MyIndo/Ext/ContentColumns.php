<?php 

class MyIndo_Ext_ContentColumns extends MyIndo_Ext_Abstract
{
	protected $_name = 'CONTENT_COLUMNS';
	protected $_id = 'CONTENT_COLUMN_ID';
	
	public function parser($data)
	{
		$json = array();
		foreach($data as $k=>$d) {
			if(isset($d['CONTENT_COLUMN_ID'])) {
				$json[$k]['text'] = $d['TEXT'];
				$json[$k]['dataIndex'] = $d['DATAINDEX'];
				$json[$k]['align'] = $d['ALIGN'];
				$json[$k]['width'] = (int)$d['WIDTH'];
				$json[$k]['flex'] = (int)$d['FLEX'];
				$json[$k]['dataType'] = $d['DATATYPE'];
				$json[$k]['visible'] = ($d['VISIBLE'] == 0) ? false : true;
				if($d['EDITABLE'] == 1) {
					if($d['DATATYPE'] == 'string') {
						$json[$k]['editor'] = array(
								'allowBlank' => false
								);
					} else if($d['DATATYPE'] == 'int' || $d['DATATYPE'] == 'float') {
						$json[$k]['editor'] = array(
								'xtype' => 'numberfield',
								'allowBlank' => false,
								'minValue' => 0
								);
					}
				}
			}
		}
		return $json;
	}
}