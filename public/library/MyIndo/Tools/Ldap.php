<?php 

class MyIndo_Tools_Ldap
{
	public function ldapConnect($username, $password)
	{
		$config = new Zend_Config_Ini(APPLICATION_PATH . '/configs/ldap.ini', 'production');
		$options2 = $config->toArray();

		$adapter = new Zend_Auth_Adapter_Ldap($options2, $username, $password);
		//$result = $adapter->authenticate($adapter);
		$auth = Zend_Auth::getInstance();
		$result = $auth->authenticate($adapter);
		return $result->isValid();
	}
}