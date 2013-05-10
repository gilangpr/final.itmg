<?php 

class Groups_RequestController extends MyIndo_Controller_Action
{
	protected $_aclEnabled;

	public function init()
	{	
		$this->getInit(new Application_Model_Groups());
		$this->_aclEnabled = true;
	}
	
	public function readAction()
	{
		if($this->getRequest()->isPost() && $this->getRequest()->isXmlHttpRequest()) {
			$gmModel = new Application_Model_GroupMembers();
			if(!isset($this->_posts['sort'])) {
				$list = $this->_model->getListLimit($this->_limit, $this->_start, 'GROUP_NAME ASC');
			} else {
				$sort = Zend_Json::decode($this->_posts['sort']);
				$q = $this->_model->select();
				if($sort[0]['property'] != 'TOTAL_MEMBER') {
					$q->order($sort[0]['property'] . ' ' . $sort[0]['direction']);
				}
				$q->limit($this->_limit, $this->_start);
				$list = $q->query()->fetchAll();
			}
			
			foreach($list as $k=>$d) {
				$list[$k]['TOTAL_MEMBER'] = $gmModel->countWhere('GROUP_ID','GROUP_ID', $d['GROUP_ID']);
			}
			$totalCount = $this->_model->count();
			/* Last Page Modifier */
			$totalPage = ceil($totalCount / $this->_limit);
			if($this->_page == $totalPage) {
				$k = (count($list) - ($totalCount % $this->_limit));
				$temp = $list;
				for($i = 0; $i < $k; $i++) {
					unset($list[$i]);
				}
				$temp = $list;
				$i = 0;
				unset($list);
				foreach($temp as $k=>$d) {
					$list[$i] = $d;
					$i++;
				}
			}
			/* End of : Last Page Modifier */

			/* Date Modifier */
			foreach($list as $k => $d) {
				$list[$k]['CREATED_DATE'] = date('d-m-Y H:i:s', strtotime($d['CREATED_DATE']));
				$list[$k]['MODIFIED_DATE'] = date('d-m-Y H:i:s', strtotime($d['MODIFIED_DATE']));
			}
			/* End of : Date Modifier */
			
			$this->_list = $list;
			$this->_count = $totalCount;
		
			$this->_data['data']['items'] = $this->_list;
			$this->_data['data']['totalCount'] = $this->_count;
			
		} else {
			$this->error(901);
		}
		
		$this->json();
	}
	
	public function createAction()
	{
		if($this->getRequest()->isPost() && $this->getRequest()->isXmlHttpRequest() && isset($this->_posts['GROUP_NAME'])) {
			if(!$this->_model->isExistByKey('GROUP_NAME',$this->_posts['GROUP_NAME'])) {
				try {
					$this->_model->insert(array(
							'GROUP_NAME' => $this->_posts['GROUP_NAME'],
							'CREATED_DATE' => $this->_date
							));
				}catch(Exception $e) {
					$this->_error_code = $e->getCode();
					$this->_error_message = $e->getMessage();
					$this->_success = false;
				}
			} else {
				$this->_error_code = 201;
				$this->_error_message = MyIndo_Tools_Error::getErrorMessage($this->_error_code);
				$this->_success = false;
			}
		} else {
			$this->_error_code = 901;
			$this->_error_message = MyIndo_Tools_Error::getErrorMessage($this->_error_code);
			$this->_success = false;
		}
		
		MyIndo_Tools_Return::JSON($this->_data, $this->_error_code, $this->_error_message, $this->_success);
	}

	public function updateAction()
	{
		MyIndo_Tools_Return::JSON($this->_data, $this->_error_code, $this->_error_message, $this->_success);
	}
	
	public function privilegesAction()
	{
// 		$modelPrivileges = new Application_Model_Privileges();
		
		if($this->getRequest()->isPost() && 
				$this->getRequest()->isXmlHttpRequest() && 
				isset($this->_posts['data']) && 
				!empty($this->_posts['data']) && 
				isset($this->_posts['id']) && !empty($this->_posts['id'])) {
			
			$groupModel = new Application_Model_Groups();
			$privModel = new MyIndo_Ext_Privileges();
			
			if($groupModel->isExistByKey('GROUP_ID', $this->_posts['id'])) {
			
				try {
					
					$privModel->delete($privModel->getAdapter()->quoteInto('GROUP_ID = ?', $this->_posts['id']));

					$data = Zend_Json::decode($this->_posts['data']);
					
					foreach($data as $k=>$d) {
						$privModel->insert(array(
								'GROUP_ID' => $this->_posts['id'],
								'ID' => $d['id'],
								'TYPE' => $d['type'],
								'CREATED_DATE' => $this->_date
								));
					}
					
				}catch(Exception $e) {
					$this->_error_code = $e->getCode();
					$this->_error_message = $e->getMessage();
					$this->_success = false;
				}
			
			} else {
				$this->_error_code = 101;
				$this->_error_message = MyIndo_Tools_Error::getErrorMessage($this->_error_code);
				$this->_success = false;
			}
			
		} else {
			$this->_error_code = 901;
			$this->_error_message = MyIndo_Tools_Error::getErrorMessage($this->_error_code);
			$this->_success = false;
		}
		
		MyIndo_Tools_Return::JSON($this->_data, $this->_error_code, $this->_error_message, $this->_success);
	}
	
	/* Group Privilege */
	/* ===================================================================================================== */
	
	public function readTreeAction()
	{
		$menuModel = new MyIndo_Ext_Menus();
		$subMenuModel = new MyIndo_Ext_SubMenus();
		$subMenuActionModel = new MyIndo_Ext_SubMenuActions();
		$privModel = new MyIndo_Ext_Privileges();
		
		$data = $menuModel->getList();
		$tree = array();
		$id = 0;
		if(isset($this->_posts['id']) && is_numeric($this->_posts['id']) && !empty($this->_posts['id'])) {
			$id = $this->_posts['id'];
		}
		
		foreach($data as $k=>$d) {
			
			$qMenu = $privModel->select()
			->where('GROUP_ID = ?', $id)
			->where('TYPE = ?', 'menus')
			->where('ID = ?', $d['MENU_ID']);
			
			$_c = $qMenu->query()->fetchAll();

			$checkedMenu = (count($_c) > 0) ? true : false;
			
			$tree[$k] = array(
					'text' => $d['NAME'],
					'cls' => 'folder',
					'checked' => $checkedMenu,
					'expanded' => true,
					'type' => 'menus',
					'ids' => $d['MENU_ID']
					);
			
			//$data2 = $subMenuModel->getListByKey('MENU_ID', $d['MENU_ID']);
			$_q = $subMenuModel->select()
			->where('MENU_ID = ?', $d['MENU_ID']);
			$data2 = $_q->query()->fetchAll();

			foreach($data2 as $_k=>$_d) {
				
				$qSubMenu = $privModel->select()
				->where('GROUP_ID = ?', $id)
				->where('TYPE = ?', 'submenus')
				->where('ID = ?', $_d['SUB_MENU_ID']);

				$_c2 = $qSubMenu->query()->fetchAll();
				
				$checkedSubMenu = (count($_c2) > 0) ? true : false;
				
				$tree[$k]['children'][] = array(
						'text' => $_d['NAME'],
						'checked' => $checkedSubMenu,
						'expanded' => true,
						'type' => 'submenus',
						'ids' => $_d['SUB_MENU_ID']
						);
				
				//$data3 = $subMenuActionModel->getListByKey('SUB_MENU_ID', $_d['SUB_MENU_ID']);
				$_q2 = $subMenuActionModel->select()
				->where('SUB_MENU_ID = ?', $_d['SUB_MENU_ID']);
				$data3 = $_q2->query()->fetchAll();

				foreach($data3 as $__k=>$__d) {
					
					$qSubMenuAction = $privModel->select()
					->where('GROUP_ID = ?', $id)
					->where('TYPE = ?', 'actions')
					->where('ID = ?', $__d['SUB_MENU_ACTION_ID']);

					$_c3 = $qSubMenuAction->query()->fetchAll();
					
					$checkedActions = (count($_c3) > 0) ? true : false;
					
					$tree[$k]['children'][$_k]['children'][] = array(
							'text' => $__d['NAME'],
							'leaf' => true,
							'checked' => $checkedActions,
							'type' => 'actions',
							'ids' => $__d['SUB_MENU_ACTION_ID']
							);
				}
			}
		}
		
		echo Zend_Json::encode($tree);
	}
	
	public function hasAccessAction()
	{
		if($this->isPost() && $this->isAjax() && isset($this->_posts['type']) && isset($this->_posts['groups']) &&
				!empty($this->_posts['type']) && !empty($this->_posts['groups'])) {
			
			$groups = Zend_Json::decode($this->_posts['groups']);
			
			$privModel = new MyIndo_Ext_Privileges();
			$subMenuModel = new MyIndo_Ext_SubMenus();
			$subMenuActionModel = new MyIndo_Ext_SubMenuActions();
			
			/* Menus */
			$modelMenus = new MyIndo_Ext_Menus();
			$listMenus = $modelMenus->getList();
			$menusAccess = array('data'=>array());
			foreach($listMenus as $_k=>$_d) {
				$menusAccess['data'][$_k] = array(
						'xtype' => 'button',
						'text' => $modelMenus->getValueByKey('MENU_ID', $_d['MENU_ID'], 'NAME'),
						'menu_id' => $_d['MENU_ID'],
						'id' => 'main-menu-' . $_d['MENU_ID'],
						'hidden' => $this->_aclEnabled,
						'editor' => ($this->_aclEnabled) ? false : true
						);
			}
			$menus = array();
			/* End of : Menus */
			
			foreach($groups as $k=>$d) {
				if($this->_posts['type'] == 'menus') {
					$q = $privModel->select()
					->where('GROUP_ID = ?', $d)
					->where('TYPE = ?', 'menus')
					->order('ID ASC');
					$x = $q->query()->fetchAll();
					
					foreach($x as $_k=>$_d) {
						foreach($menusAccess['data'] as $__k=>$__d) {
							if($__d['menu_id'] == $_d['ID']) {
								$menusAccess['data'][$__k]['hidden'] = false;
							}
							$sub_menu_id = $subMenuModel->getPkByKey('MENU_ID', $__d['menu_id']);
							$sub_menu_action_id = $subMenuActionModel->getIdEdit($sub_menu_id);
							if($sub_menu_action_id > 0 && !$menusAccess['data'][$__k]['editor']) {
								$menusAccess['data'][$__k]['editor'] = $privModel->hasAccessEditor($d, $sub_menu_action_id);
							}
						}
					}
					
					$this->_data['data']['items'] = $menusAccess;
				}
			}
			
		} else {
			$this->_error_code = 901;
			$this->_error_message = MyIndo_Tools_Error::getErrorMessage($this->_error_code);
			$this->_success = false;
		}
		
		MyIndo_Tools_Return::JSON($this->_data, $this->_error_code, $this->_error_message, $this->_success);
	}
}