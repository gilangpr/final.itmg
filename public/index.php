<?php
// Define path to application directory
defined('APPLICATION_PATH')
    || define('APPLICATION_PATH', realpath(dirname(__FILE__) . '/../application'));

// Define application environment
defined('APPLICATION_ENV')
    || define('APPLICATION_ENV', (getenv('APPLICATION_ENV') ? getenv('APPLICATION_ENV') : 'production'));

// Ensure library/ is on include_path
set_include_path(implode(PATH_SEPARATOR, array(
    realpath(APPLICATION_PATH . '/../library'),
    get_include_path(),
)));

date_default_timezone_set('Asia/Jakarta');

/** Zend_Application */
require_once 'Zend/Application.php';
require_once 'Zend/Registry.php';
require_once 'Zend/Config/Ini.php';

$default_conf = new Zend_Config_Ini(APPLICATION_PATH . '/configs/application.ini',APPLICATION_ENV, array('allowModifications' => true));

if (file_exists(APPLICATION_PATH . '/configs/local.ini')) {
	$local_config = new Zend_Config_Ini(APPLICATION_PATH . '/configs/local.ini',APPLICATION_ENV);
	$default_conf->merge($local_config);
}

// Create application, bootstrap, and run
$application = new Zend_Application(APPLICATION_ENV,$default_conf);
$application->bootstrap()->run();