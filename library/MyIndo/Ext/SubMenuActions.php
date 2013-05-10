<?php 

class MyIndo_Ext_SubMenuActions extends MyIndo_Ext_Abstract
{
	protected $_name = 'SUB_MENU_ACTIONS';
	protected $_id = 'SUB_MENU_ACTION_ID';
	
	public function getIdEdit($sub_menu_id)
	{
		$q = $this->select()
		->where('SUB_MENU_ID = ?', $sub_menu_id)
		->where('NAME LIKE ?', '%Edit%');
		$_c = $q->query()->fetchAll();
		if(count($_c) > 0) {
			$x = $q->query()->fetch();
			return $x['SUB_MENU_ACTION_ID'];
		} else {
			return 0;
		}
	}
}