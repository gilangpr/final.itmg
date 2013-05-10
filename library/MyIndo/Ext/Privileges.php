<?php 

class MyIndo_Ext_Privileges extends MyIndo_Ext_Abstract
{
	protected $_name = 'PRIVILEGES';
	protected $_id = 'PRIVILEGE_ID';
	
	public function hasAccessEditor($group_id, $sub_menu_action_id)
	{
		$q = $this->select()
		->where('GROUP_ID = ?', $group_id)
		->where('TYPE = ?', 'actions')
		->where('ID = ?', $sub_menu_action_id);
		$_c = $q->query()->fetchAll();
		if(count($_c) > 0) {
			return true;
		} else {
			return false;
		}
	}
}