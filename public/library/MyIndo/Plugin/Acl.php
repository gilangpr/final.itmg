<?php 

class MyIndo_Plugin_Acl extends Zend_Controller_Plugin_Abstract
{
	protected $_objAuth;
	
	public function preDispatch(Zend_Controller_Request_Abstract $request)
	{
		$this->_objAuth = Zend_Auth::getInstance();
		$layout = Zend_Layout::getMvcInstance ();
		$view = $layout->getView();
		
		$view->default_limit = 25;

		
		if(!$this->_objAuth->hasIdentity()) {
			$request->setModuleName('dashboard');
			$request->setControllerName('login');
			$request->setActionName('index');
		} else {
			$modelGM = new Application_Model_GroupMembers();
			$groups = array();
			
			$usr = explode('\\', $this->_objAuth->getIdentity());

			if(isset($usr[1])) {
				$usr2 = explode('_', $usr[1]);
				$name = '';
				foreach($usr2 as $k=>$d) {
					if($k>0) {
						$name .= ' ';
					}
					$name .= ucfirst($d);
				}
				$view->active_user = $name;
				$view->username = $usr[1];
				$list = $modelGM->getListByKey('USERNAME', $usr[1]);
			} else {
				$view->active_user = ucfirst($this->_objAuth->getIdentity());
				$view->username = $view->active_user;
				$list = $modelGM->getListByKey('USERNAME', $view->username);
			}
			foreach($list as $k=>$d) {
				$groups[] = (int)$d['GROUP_ID'];
			}
			$view->groups = $groups;
		}
		
	}
}