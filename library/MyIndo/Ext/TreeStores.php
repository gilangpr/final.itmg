<?php 

class MyIndo_Ext_TreeStores extends MyIndo_Ext_Abstract
{
	protected $_name = 'TREE_STORES';
	protected $_id = 'TREE_STORE_ID';
	
	public function parser($data, $groups = array())
	{
		$model = new MyIndo_Ext_Models();
		$store = new MyIndo_Ext_Stores();
		$content = new MyIndo_Ext_Contents();
		$tsc = new MyIndo_Ext_TreeStoreContent();
		$privModel = new MyIndo_Ext_Privileges();
		$subMenuModel = new MyIndo_Ext_SubMenus();
		
		$json = array(
				'root' => array(
						'children' => array()
						)
				);
		
		$menus = array();
		$lists = array();
		$i = 0;
		/* Privileges */
		foreach($groups as $_k=>$_d) {
			$q = $privModel->select()
			->where('GROUP_ID = ?', $_d)
			->where('TYPE = ?', 'submenus');
			$x = $q->query()->fetchAll();
			foreach($x as $__k=>$__d) {
				// $name = $subMenuModel->getValueByKey('SUB_MENU_ID', $__d['ID'], 'NAME');
				// echo "ID : " . $__d['ID'] . "\n";
				$q = $subMenuModel->select()
				->where('SUB_MENU_ID = ?', $__d['ID']);
				$_xdata = $q->query()->fetch();

				$name = (isset($_xdata['NAME'])) ? $_xdata['NAME'] : 'xxx---000---xxx';
				if(!in_array($name, $menus)) {
					$menus[] = $name;
				}
			}
		}
		/* End of : Privileges */
		foreach($data as $k=>$d) {
			
			
			/* Privileges */
			foreach($groups as $_k=>$_d) {
				$q = $privModel->select()
				->where('GROUP_ID = ?', $_d)
				->where('TYPE = ?', 'submenus');
				$x = $q->query()->fetchAll();
				foreach($x as $__k=>$__d) {
					// $name = $subMenuModel->getValueByKey('SUB_MENU_ID', $__d['ID'], 'NAME');
					// echo "ID : " . $__d['ID'] . "\n";
					$q = $subMenuModel->select()
					->where('SUB_MENU_ID = ?', $__d['ID']);
					$_xdata = $q->query()->fetch();

					$name = (isset($_xdata['NAME'])) ? $_xdata['NAME'] : 'xxx---000---xxx';
					if(!in_array($name, $menus)) {
						$menus[] = $name;
					}
				}
			}
			/* End of : Privileges */
			if(in_array($d['TEXT'], $menus)) {
				$json['root']['children'][$i]['text'] = $d['TEXT'];
				$json['root']['children'][$i]['id'] = $d['NAME'] . '-' . strtolower(str_replace(" ","-", $d['TEXT']));
				$json['root']['children'][$i]['models'] = $model->parser($model->getDetailByKey('NAME', $d['MODEL']));
				$json['root']['children'][$i]['stores'] = $store->parser($store->getDetailByKey('NAME', $d['STORE']));
				$json['root']['children'][$i]['leaf'] = true;
				
				// Get contents :
				$tscDetail = $tsc->getDetailByKey('TREE_STORE_ID', $d['TREE_STORE_ID']);
				$content_id = (isset($tscDetail['CONTENT_ID'])) ? $tscDetail['CONTENT_ID'] : 0;
				
				$json['root']['children'][$i]['contents'] = $content->parser($content->getDetailByKey($content->getPK(), $content_id), $groups);
				$i++;
			}
		}
		
		return $json;
	}
}