<?php 

class Meetingcontact_RequestController extends Zend_Controller_Action
{
	protected $_model;
	protected $_limit;
	protected $_start;
	protected $_posts;
	protected $_error_code;
	protected $_error_message;
	protected $_success;
	
	public function init()
	{
		$this->_helper->layout()->disableLayout();
		$this->_helper->viewRenderer->setNoRender(true);
		$this->_model = new Application_Model_Meetingcontact();
		if($this->getRequest()->isPost()) {
			$this->_posts = $this->getRequest()->getPost();
		} else {
			$this->_posts = array();
		}
		
		$this->_start = (isset($this->_posts['start'])) ? $this->_posts['start'] : 0;
		$this->_limit = (isset($this->_posts['limit'])) ? $this->_posts['limit'] : 25;
		
		$this->_error_code = 0;
		$this->_error_message = '';
		$this->_success = true;
	}
	
	public function createAction()
	{
		$data = array(
			'data' => array()
		);
		//Call Model Investor
		$maModel = new Application_Model_Meetingactivitie();
		$inModel = new Application_Model_Investors();
		$coModel = new Application_Model_Contacts();
		try {
			// Insert Data :
			//get id params
			$ma_id = $this->_getParam('id',0);
			if($maModel->isExistByKey('MEETING_ACTIVITIE_ID', $ma_id)) {
				if($coModel->isExistByKey('CONTACT_ID', $this->_posts['CONTACT_ID'])) {
					$q = $this->_model->select()
					->where('CONTACT_ID = ?', $this->_posts['CONTACT_ID'])
					->where('MEETING_ACTIVITIE_ID = ?', $ma_id);
					$c = $q->query()->fetchAll();
					if(count($c) == 0) {
		 				$this->_model->insert(array(
							'MEETING_ACTIVITIE_ID'=>$ma_id,
							'CONTACT_ID'=>$this->_posts['CONTACT_ID']
		 					));
		 				$inModel->update(array(
		 					'MODIFIED_DATE' => date('Y-m-d H:i:s')
		 				),$inModel->getAdapter()->quoteInto('INVESTOR_ID = ?', $this->_posts['INVESTOR_ID']));
		 			} else {
		 				$this->_error_code = 201;
		 				$this->_error_message = 'Data already exist.';
		 				$this->_success = false;
		 			}
		 		} else {
		 			$this->_error_code = 402;
		 			$this->_error_message = 'Illegal Name, Please select from list.';
		 			$this->_success = false;
		 		}
			} else {
				$this->_error_code = 404;
				$this->_error_message = 'MEETING_ACTIVITIE_ID NOT FOUND';
				$this->_success = false;
			}
		}catch(Exception $e) {
			$this->_error_code = $e->getCode();
			$this->_error_message = $e->getMessage();
			$this->_success = false;
		}
		
		MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}
	public function crAction(){
		$data = array(
			'data' => array()
		);
		//Call Model
		$maModel = new Application_Model_Meetingactivitie();
		$con = new Application_Model_Contacts();
		$participants = new Application_Model_Participant();
		$inModel = new Application_Model_Investors();
		try {
			// Insert Data :
			//get id params
			//$ma_id = $this->_getParam('id',0);
			//$key = $this->_posts['KEY_PERSON'];
			//$key_person = 'KEY_PERSON';
			$ma_id = $this->_posts['MEETING_ACTIVITIE_ID'];
			if($maModel->isExistByKey('MEETING_ACTIVITIE_ID', $ma_id)) {
	 			if(!empty($this->_posts['KEY_PERSON'])){
	 				if (!$con->isExistByKey('NAME',$this->_posts['NAME'])) {
	 					$con->insert(array(
	 					'INVESTOR_ID' => $this->_posts['INVESTOR_ID'],
	 					'NAME' => $this->_posts['NAME'],
	 					'PHONE_1' => $this->_posts['PHONE1_PARTICIPANT'],
	 					'PHONE_2' => $this->_posts['PHONE2_PARTICIPANT'],
	 					'EMAIL' => $this->_posts['EMAIL_PARTICIPANT'],
	 					'ADDRESS' => $this->_posts['ADDRESS_PARTICIPANT'],
	 					'SEX' => $this->_posts['SEX'],
	 					'POSITION' => $this->_posts['POSITION_PARTICIPANT'],
	 					'CREATED_DATE' => date('Y-m-d H:i:s')
	 					));
		 				$con_id = $con->getPkByKey('NAME', $this->_posts['NAME']);
		 				$this->_model->insert(array(
							'MEETING_ACTIVITIE_ID'=>$ma_id,
							'CONTACT_ID'=> $con_id
	 					));
	 				}
	 				else{
	 					$this->_error_message = 'Data already exist';
						$this->_success = false;
	 				}
	 				
	 			}
	 			else{
	 				$participants->insert(array(
	 					'MEETING_ACTIVITIE_ID' => $ma_id,
	 					'NAME' => $this->_posts['NAME'],
	 					'PHONE1_PARTICIPANT' => $this->_posts['PHONE1_PARTICIPANT'],
	 					'PHONE2_PARTICIPANT' => $this->_posts['PHONE2_PARTICIPANT'],
	 					'EMAIL_PARTICIPANT' => $this->_posts['EMAIL_PARTICIPANT'],
	 					'ADDRESS_PARTICIPANT' => $this->_posts['ADDRESS_PARTICIPANT'],
	 					'SEX' => $this->_posts['SEX'],
	 					'POSITION_PARTICIPANT' => $this->_posts['POSITION_PARTICIPANT'],
	 					'CREATED_DATE' => date('Y-m-d H:i:s')
	 					));
	 			}	
	 			
	 			$inModel->update(array(
	 					'MODIFIED_DATE' => date('Y-m-d H:i:s')
	 				),$inModel->getAdapter()->quoteInto('INVESTOR_ID = ?', $this->_posts['INVESTOR_ID']));
			}
			else {
				$this->_error_code = 404;
				$this->_error_message = 'MEETING_ACTIVITIE_ID NOT FOUND';
				$this->_success = false;
			}
		}catch(Exception $e) {
			$this->_error_code = $e->getCode();
			$this->_error_message = $e->getMessage();
			$this->_success = false;
		}
		
		MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}
	public function readAction()
	{
		$name = $this->_model->getName($this->_posts['id']);
		$modPart = new Application_Model_Participant();
		$namePart = $modPart->getName($this->_posts['id']);
		$_i = 0;
		$_temp = '';
		foreach ($name as $k=>$d) {
			//print_r($d);
			if($_temp == '') {
				$_temp = $d['CONTACT_ID'];
				$this->_data['data']['items'][$_i]['NAME'] = '';
			}
			if($_temp != $d['CONTACT_ID']) {
				$_i++;
				$_temp = $d['CONTACT_ID'];
				$this->_data['data']['items'][$_i]['NAME'] = '';
			}
			if(!isset($this->_data['data']['items'][$_i]['CONTACT_ID'])) {
				$this->_data['data']['items'][$_i]['CONTACT_ID'] = $d['CONTACT_ID'];
				$this->_data['data']['items'][$_i]['MEETING_ACTIVITIE_ID'] = $d['MEETING_ACTIVITIE_ID'];
				$this->_data['data']['items'][$_i]['NAME'] = $d['NAME'];
				$this->_data['data']['items'][$_i]['EMAIL'] = $d['EMAIL'];
				$this->_data['data']['items'][$_i]['POSITION'] = $d['POSITION'];
				$this->_data['data']['items'][$_i]['COMPANY_NAME'] = $d['COMPANY_NAME']; 	
								
			}
// 			print_r($_i);
			//print_r(count($_i));
			//$_j=$_i+2;
			$_j = $_i+1;
			$_temp2 = '';
			foreach ($namePart as $_k=>$_d) {
				if($_temp2 == '') {
					$_temp2 = $_d['PART_ID'];
				}
				if($_temp2 != $_d['PART_ID']) {
					$_j++;
					$_temp2 = $_d['PART_ID'];
				}
				if(!isset($this->_data['data']['items'][$_j]['PART_ID'])) {
					//$this->_data['data']['items'][$_j]['PART_ID'] = $_d['PART_ID'];
					$this->_data['data']['items'][$_j]['NAME'] = $_d['NAME'];
					$this->_data['data']['items'][$_j]['EMAIL'] = $_d['EMAIL_PARTICIPANT'];
					$this->_data['data']['items'][$_j]['POSITION'] = $_d['POSITION_PARTICIPANT'];
				}
// 				print_r($_temp2);
// 				/print_r($_d);
			}
		}
		
		$this->_data['data']['totalCount'] = $this->_model->count();
		MyIndo_Tools_Return::JSON($this->_data, $this->_error_code, $this->_error_message, $this->_success);

	}
	
	public function updateAction()
	{
		$data = array(
				'data' => array()
		);
		$data = $this->getRequest()->getRawBody();
		$data = Zend_Json::decode($data);
		$id = $data['data']['MEETING_ACTIVITIE_ID'];
		try {
			
			
			$this->_model->update(array(
					'MEETING_EVENT' => $data['data']['MEETING_EVENT'],
					'MEETING_DATE'=>$data['data']['MEETING_DATE'],
					'START_TIME'=>$data['data']['START_TIME'],
					'END_TIME'=>$data['data']['END_TIME']
					),
					$this->_model->getAdapter()->quoteInto('MEETING_ACTIVITIE_ID = ?', $id));
		}catch(Exception $e) {
			$this->_error_code = $e->getCode();
			$this->_error_message = $e->getMessage();
			$this->_success = false;
		}
		
		MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}
	
	public function destroyAction()
	{	
		$in_id = (isset($this->_posts['INVESTOR_ID'])) ? $this->_posts['INVESTOR_ID'] : 0;
		$co_id = (isset($this->_posts['CONTACT_ID'])) ? $this->_posts['CONTACT_ID'] : 0;
		$ma_id = (isset($this->_posts['MEETING_ACTIVITIE_ID'])) ? $this->_posts['MEETING_ACTIVITIE_ID'] : 0;
		//$part_id = (isset($this->_posts['NAME'])) ? $this->_posts['NAME'] : 0;
		$data = array(
				'data' => array()
				);
		$modelInvestors = new Application_Model_Investors();
		$modelParticipant = new Application_Model_Participant();
		try {
			if ($modelParticipant->isExistByKey('NAME', $this->_posts['NAME'])) {
				$idPart = $modelParticipant->getPkByKey('NAME', $this->_posts['NAME']);
				$modelParticipant->delete(
					$modelParticipant->getAdapter()->quoteInto('PART_ID = ?', $idPart));
				
				$modelInvestors->update(array(
 					'MODIFIED_DATE' => date('Y-m-d H:i:s')
	 				),$modelInvestors->getAdapter()->quoteInto('INVESTOR_ID = ?', $in_id));
			} else {
				$where=array();
				$where[]= $this->_model->getAdapter()->quoteInto('CONTACT_ID = ?', $co_id);
				$where[]= $this->_model->getAdapter()->quoteInto('MEETING_ACTIVITIE_ID = ?', $ma_id);
				$this->_model->delete($where);			
				
				$modelInvestors->update(array(
 					'MODIFIED_DATE' => date('Y-m-d H:i:s')
	 				),$modelInvestors->getAdapter()->quoteInto('INVESTOR_ID = ?', $in_id));
			}
		}catch(Exception $e) {
			$this->_error_code = $e->getCode();
			$this->_error_message = $e->getMessage();
			$this->_success = false;
		}
		MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}
}