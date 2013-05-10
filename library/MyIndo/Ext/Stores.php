<?php 

class MyIndo_Ext_Stores extends MyIndo_Ext_Abstract
{
	protected $_name = 'STORES';
	protected $_id = 'STORE_ID';
	
	public function parser($detail)
	{
		$json = array();
		if(isset($detail['STORE_ID'])) {
			$json = array(
					'storeName' => $detail['NAME'],
					'proxy' => array(
							'type' => $detail['PROXY_TYPE'],
							'api' => array(
									'read' => $detail['PROXY_API_READ'],
									'create' => $detail['PROXY_API_CREATE'],
									'update' => $detail['PROXY_API_UPDATE'],
									'destroy' => $detail['PROXY_API_DESTROY']
							),
							'actionMethods' => array(
									'create' => 'POST',
									'destroy' => 'POST',
									'read' => 'POST',
									'update' => 'POST'
							),
							'reader' => array(
									'idProperty' => $detail['PROXY_READER_IDPROPERTY'],
									'type' => $detail['PROXY_READER_TYPE'],
									'root' => $detail['PROXY_READER_ROOT'],
									'totalProperty' => $detail['PROXY_READER_TOTALPROPERTY']
							),
							'writer' => array(
									'type' => $detail['PROXY_WRITER_TYPE'],
									'root' => $detail['PROXY_WRITER_ROOT'],
									'writeAllFields' => ($detail['PROXY_WRITER_WRITEALLFIELDS'] == 0) ? false : true
							)
					),
					'sorters' => array(
							'property' => $detail['SORTERS_PROPERTY'],
							'direction' => $detail['SORTERS_DIRECTION']
					),
					'autoSync' => true
			);
		}
		return $json;
	}
}