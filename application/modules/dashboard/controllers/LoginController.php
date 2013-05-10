<?php 

class Dashboard_LoginController extends Zend_Controller_Action
{
	protected $_isLdap;
	protected $_model;
	
	public function init()
	{
		$layout = $this->_helper->layout();
		$layout->setLayout('login');
		$this->_isLdap = false;
		$this->_model = new Application_Model_LoginLog();
	}
	
	protected function _getAuthAdapter() {
		
		$dbAdapter = Zend_Db_Table::getDefaultAdapter();
		$authAdapter = new Zend_Auth_Adapter_DbTable($dbAdapter);
		
		$authAdapter->setTableName('USERS')
		->setIdentityColumn('USERNAME')
		->setCredentialColumn('PASSWORD');
		return $authAdapter;
	}
	
	protected function _loginProcess($data)
	{	
		try {
			if(!$this->_isLdap) {
				$adapter = $this->_getAuthAdapter();
				$adapter->setIdentity($data['USERNAME']);
				$adapter->setCredential(MyIndo_Tools_Return::makePassword($data['PASSWORD']));
	
				$select = $adapter->getDbSelect();
				$select->where('ACTIVE = 1');
				
				$auth = Zend_Auth::getInstance();
				
				$result = $auth->authenticate($adapter);
				
				
				if($result->isValid()) {
					
					$this->_model->insert(array(
							'USERNAME' => $data['USERNAME'],
							'IP_ADDRESS' => $this->getRequest()->getServer('REMOTE_ADDR'),
							'MESSAGE' => 'Login Success',
							'CREATED_DATE' => date('Y-m-d H:i:s')
					));

					
					return array(
							'message' => 'Welcome back, ' . $data['USERNAME'] . '.',
							'status' => true
					);
				} else {
					
					$this->_model->insert(array(
							'USERNAME' => $data['USERNAME'],
							'IP_ADDRESS' => $this->getRequest()->getServer('REMOTE_ADDR'),
							'MESSAGE' => 'Invalid Username or Password',
							'CREATED_DATE' => date('Y-m-d H:i:s')
					));
					
					return array(
							'message' => 'Invalid Username or Password',
							'status' => false
					);
				}
			} else {
				if(MyIndo_Tools_Ldap::ldapConnect($data['USERNAME'], $data['PASSWORD'])) {
					$this->_model->insert(array(
							'USERNAME' => $data['USERNAME'],
							'IP_ADDRESS' => $this->getRequest()->getServer('REMOTE_ADDR'),
							'MESSAGE' => 'Login Success',
							'CREATED_DATE' => date('Y-m-d H:i:s')
					));
					$users = new Application_Model_Users();
					if(!$users->isExistByKey('USERNAME', $data['USERNAME'])) {
						$users->insert(array(
							'USERNAME' => $data['USERNAME'],
							'PASSWORD' => MyIndo_Tools_Return::makePassword($data['PASSWORD']),
							'NAME' => $data['USERNAME'],
							'ACTIVE' => 1,
							'CREATED_DATE' => date('Y-m-d H:i:s')
							));
					}
					return array(
							'message' => 'Welcome back, ' . $data['USERNAME'] . '.',
							'status' => true
					);
				} else {
					$this->_model->insert(array(
							'USERNAME' => $data['USERNAME'],
							'IP_ADDRESS' => $this->getRequest()->getServer('REMOTE_ADDR'),
							'MESSAGE' => 'Invalid Username or Password',
							'CREATED_DATE' => date('Y-m-d H:i:s')
					));
					return array(
							'message' => 'Invalid Username or Password',
							'status' => false
					);
				}
			}
		}catch(Exception $e) {
			return array(
					'message' => $e->getMessage(),
					'status' => false
			);
		}
	}
	
	public function indexAction()
	{
		if($this->getRequest()->isPost()) {
			
			$this->_helper->layout()->disableLayout();
			$this->_helper->viewRenderer->setNoRender(true);
			
			$posts = $this->getRequest()->getPost();
			
			$data['USERNAME'] = (isset($posts['USERNAME'])) ? $posts['USERNAME'] : '';
			$data['PASSWORD'] = (isset($posts['PASSWORD'])) ? $posts['PASSWORD'] : '';
			
			$result = $this->_loginProcess($data);
			
			$success = $result['status'];
			 
			$return = array(
					'data' => array(
							'message' => $result['message']
					),
					'success' => $success
			);
			echo Zend_Json::encode($return);
		}
	}
	
	public function redirectorAction()
	{
		//if($this->view->active_user == 'admin') {
			$this->_redirect('/dashboard');
// 		} else {
// 			$this->_redirect('/desktop');
// 		}
	}
	
	public function logoutAction()
	{
		$this->_helper->viewRenderer->setNoRender(true);
		$this->_helper->layout()->disableLayout();
		$objAuth = Zend_Auth::getInstance();
		if ($objAuth->hasIdentity()) {
			$objAuth->clearIdentity();
		}
		$this->_model->insert(array(
				'USERNAME' => $this->view->active_user,
				'IP_ADDRESS' => $this->getRequest()->getServer('REMOTE_ADDR'),
				'MESSAGE' => 'User Logout',
				'CREATED_DATE' => date('Y-m-d H:i:s')
		));
		$this->_redirect('/dashboard/login');
	}
}