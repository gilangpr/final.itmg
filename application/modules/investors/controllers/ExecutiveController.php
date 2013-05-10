<?php 

class Investors_ExecutiveController extends Zend_Controller_Action
{
	protected $_investors;
	protected $_locations;
	protected $_investortype;
	protected $_contacts;
	protected $_error_code;
	protected $_error_message;
	protected $_success;
	protected $_arr;
    
    public function init()
    {
        $this->_helper->viewRenderer->setNoRender(true);
        $this->_helper->layout()->disableLayout();
        $this->_investors = new Application_Model_Investors();
        $this->_locations = new Application_Model_Locations();
        $this->_investortype = new Application_Model_InvestorType();
        $this->_contacts = new Application_Model_Contacts();
        
        $this->_error_code = 0;
        $this->_error_message = '';
        $this->_success = true;
        
        $this->_arr = array(
        	0 => array(
        		0 => 'All',
        		1 => 'All'
        	)
        );
    }
    
    public function getListInvestorsAction()
    {
        $data = array(
        		'data' => array(
        				'items' => array()
        				)
        		);
        
        $list = $this->_investors->getList();
        
        foreach($list as $k => $d) {
        	$this->_arr[$k+1][0] = $d['COMPANY_NAME'];
        	$this->_arr[$k+1][1] = $d['COMPANY_NAME'];
        }

        $data['data']['items'] = $this->_arr;
        
        MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
    }
    
    public function getListLocationsAction() {
    	$data = array(
    			'data' => array(
    					'items' => array()
    			)
    	);
    	
    	$list = $this->_locations->getList();
    	
    	foreach($list as $k=>$d) {
    		$this->_arr[$k+1][0] = $d['LOCATION'];
    		$this->_arr[$k+1][1] = $d['LOCATION'];
    	}
    	
    	$data['data']['items'] = $this->_arr;
    	
    	MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
    }
    
    public function getListInvestortypeAction()
    {
    	$data = array(
    			'data' => array(
    					'items' => array()
    			)
    	);
    	 
    	$list = $this->_investortype->getList();
    	 
    	foreach($list as $k=>$d) {
    		$this->_arr[$k+1][0] = $d['INVESTOR_TYPE'];
    		$this->_arr[$k+1][1] = $d['INVESTOR_TYPE'];
    	}
    	 
    	$data['data']['items'] = $this->_arr;
    	 
    	MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
    }
    
    public function getListContactsAction()
    {
    	$data = array(
    			'data' => array(
    					'items' => array()
    			)
    	);
    	
    	$list = $this->_contacts->getList();
    	
    	foreach($list as $k=>$d) {
    		$this->_arr[$k+1][0] = $d['NAME'];
    		$this->_arr[$k+1][1] = $d['NAME'];
    	}
    	
    	$data['data']['items'] = $this->_arr;
    	
    	MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
    }
    
    public function indexAction()
    {
        
    }
}