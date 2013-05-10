<?php 

class Apps_RequestController extends Zend_Controller_Action
{
	public function init()
	{
		$this->_helper->layout()->disableLayout();
		$this->_helper->viewRenderer->setNoRender(true);
	}
	
	protected function getList()
	{
		$menus = array(
				'Investors',
				'Shareholdings',
				'Peers',
				'Shareprices',
				'Research Report',
				'News',
				'User Management'
				);
		
		$data = array();
		
		foreach($menus as $k=>$d) {
			$data['menus'][$k] = array('name' => $d, 'submenus' => $this->getSubMenus($d));
		}
		
// 		$rsJsModel = new Application_Model_ResourcesJs();
		
// 		foreach($data['menus'] as $k=>$d) {
// 			foreach($d['submenus'] as $_k=>$_d) {
// 				foreach($_d['tbars'] as $__k=>$__d) {
					
// 					$q = $rsJsModel->select()
// 					->where('MENU_NAME = ?', $d['name'])
// 					->where('SUBMENU_NAME = ?', $_d['name'])
// 					->where('ACTION_NAME = ?', $__d);
					
// 					if($q->query()->rowCount() == 0) {
// 						try {
// 							$rsJsModel->insert(array(
// 									'MENU_NAME' => $d['name'],
// 									'SUBMENU_NAME' => $_d['name'],
// 									'ACTION_NAME' => $__d,
// 									'CREATED_DATE' => date('Y-m-d H:i:s')
// 									));
// 						}catch(Exception $e) {
// 							echo $e->getMessage() . '<br/>';
// 						}
// 					}
// 				}
// 			}
// 		}
		return $data;
	}
	
	public function lAction()
	{
		$menuModel = new MyIndo_Ext_Menus();
		$subMenuModel = new MyIndo_Ext_SubMenus();
		$subMenuActionModel = new MyIndo_Ext_SubMenuActions();
		$data = $this->getList();
		
		foreach($data['menus'] as $k=>$d) {
			
			if(!$menuModel->isExistByKey('NAME', $d['name'])) {
				$menuModel->insert(array(
						'NAME' => $d['name'],
						'CREATED_DATE' => date('Y-m-d H:i:s')
						));
			}
			
			foreach($d['submenus'] as $_k=>$_d) {
				
				$q = $subMenuModel->select()
				->where('MENU_ID = ?', $menuModel->getPkByKey('NAME', $d['name']))
				->where('NAME = ?', $_d['name']);
				
				if($q->query()->rowCount() == 0) {
					$subMenuModel->insert(array(
							'MENU_ID' => $menuModel->getPkByKey('NAME', $d['name']),
							'NAME' => $_d['name'],
							'CREATED_DATE' => date('Y-m-d H:i:s')
							));
				} else {
					$x = $q->query()->fetch();
					$subMenuModel->update(array(
							'NAME' => $_d['name']
							),$subMenuModel->getAdapter()->quoteInto('SUB_MENU_ID = ?', $x['SUB_MENU_ID']));
				}
				
				foreach($_d['tbars'] as $__k=>$__d) {
					
					$q = $subMenuActionModel->select()
					->where('SUB_MENU_ID = ?', $subMenuModel->getPkByKey('NAME', $_d['name']))
					->where('NAME = ?', $__d);
					
					if($q->query()->rowCount() == 0) {
						$subMenuActionModel->insert(array(
								'SUB_MENU_ID' => $subMenuModel->getPkByKey('NAME', $_d['name']),
								'NAME' => $__d,
								'CREATED_DATE' => date('Y-m-d H:i:s')
								));
					} else {
						$x = $q->query()->fetch();
						$subMenuActionModel->update(array(
								'NAME' => $__d
								),$subMenuActionModel->getAdapter()->quoteInto('SUB_MENU_ACTION_ID = ?', $x['SUB_MENU_ACTION_ID']));
					}
					
				}
			}
		}
	}
	
	protected function getSubMenus($name)
	{
		$tsModel = new MyIndo_Ext_TreeStores();
		if($tsModel->isExistByKey('NAME', $name)) {
			$list = $tsModel->getListByKey('NAME', $name, ' NAME ASC');
			$data = array();
			foreach($list as $k=>$d) {
				$data[$k] = array('name' => $d['TEXT'], 'tbars' => $this->getContent($d['TREE_STORE_ID']));
			}
			return $data;
		} else {
			return array();
		}
	}
	
	protected function getContent($tree_store_id)
	{
		$tscModel = new MyIndo_Ext_TreeStoreContent();
		$contentTbarModel = new MyIndo_Ext_ContentTbars();
		$data = array();
		$content_id = $tscModel->getValueByKey('TREE_STORE_ID', $tree_store_id, 'CONTENT_ID');
		$list = $contentTbarModel->getListByKey('CONTENT_ID', $content_id);
		foreach($list as $k=>$d) {
			$data[$k] = $d['TEXT'];
		}
		return $data;
	}
}