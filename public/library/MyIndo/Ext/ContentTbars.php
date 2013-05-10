<?php 

class MyIndo_Ext_ContentTbars extends MyIndo_Ext_Abstract
{
	protected $_name = 'CONTENT_TBARS';
	protected $_id = 'CONTENT_TBAR_ID';
	
	public function parser($data, $groups = array())
	{
		$json = array();
		$privModel = new MyIndo_Ext_Privileges();
		$subMenuActionModel = new MyIndo_Ext_SubMenuActions();
		$menus = array();
		$i = 0;
		/* Privileges */
		foreach($groups as $_k=>$_d) {
			$q = $privModel->select()
			->where('GROUP_ID = ?', $_d)
			->where('TYPE = ?', 'actions');
			$x = $q->query()->fetchAll();
			foreach($x as $__k=>$__d) {
				//$name = $subMenuActionModel->getValueByKey('SUB_MENU_ACTION_ID', $__d['ID'], 'NAME');
				// $name = $subMenuModel->getValueByKey('SUB_MENU_ID', $__d['ID'], 'NAME');
				// echo "ID : " . $__d['ID'] . "\n";
				$q = $subMenuActionModel->select()
				->where('SUB_MENU_ACTION_ID = ?', $__d['ID']);
				$_xdata = $q->query()->fetch();

				$name = (isset($_xdata['NAME'])) ? $_xdata['NAME'] : 'xxx---000---xxx';
				if(!in_array($name, $menus)) {
					$menus[] = $name;
				}
			}
		}
		/* End of : Privileges */
		foreach($data as $k=>$d) {
			
			if(in_array($d['TEXT'], $menus)) {
				$json[$i] = array(
						'xtype' => $d['XTYPE'],
						'id' => $d['ID'],
						'text' => $d['TEXT']
						);
				if($d['ICONCLS'] != '' && !empty($d['ICONCLS'])) {
					$json[$i]['iconCls'] = $d['ICONCLS'];
				}
				$i++;
			}
		}
		return $json;
	}
}