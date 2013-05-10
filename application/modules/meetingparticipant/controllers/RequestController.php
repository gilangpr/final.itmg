<?php 

class Meetingparticipant_RequestController extends Zend_Controller_Action
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
		$this->_model = new Application_Model_Meetingparticipant();
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
		$meetingModel = new Application_Model_Meetingactivitie();
		$inModel = new Application_Model_Investors();
		$ItmPartModel = new Application_Model_Itmparticipants();
		try {
			// Insert Data :
			$meetingAcid = $this->_getParam('id',0);
			if($meetingModel->isExistByKey('MEETING_ACTIVITIE_ID', $meetingAcid)) {
				if($ItmPartModel->isExistByKey('PARTICIPANT_ID', $this->_posts['PARTICIPANT_ID'])) {
					$q = $this->_model->select()
					->where('PARTICIPANT_ID = ?', $this->_posts['PARTICIPANT_ID'])
					->where('MEETING_ACTIVITIE_ID = ?', $meetingAcid);
					$c = $q->query()->fetchAll();
					if(count($c) == 0) {
			 			$this->_model->insert(array(
								'MEETING_ACTIVITIE_ID'=>$meetingAcid,
								'PARTICIPANT_ID'=>$this->_posts['PARTICIPANT_ID']
			 					));
			 			$inModel->update(array(
			 					'MODIFIED_DATE' => date('Y-m-d H:i:s')
			 				),$inModel->getAdapter()->quoteInto('INVESTOR_ID = ?', $this->_posts['INVESTOR_ID']));
					} else {
						$this->_error_code = 202;
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
	public function readAction()
	{
		$MA_id = (isset($this->_posts['id'])) ? $this->_posts['id'] : 0;
		$data = array(
				'data' => array(
				'items' => $this->_model->getListMeetingParticipantLimit($this->_limit, $this->_start,$MA_id),
						'totalCount' => $this->_model->count()
				)
		);
		MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
		

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
		/*
		GET POST ID
		*/
		$in_id = (isset($this->_posts['INVESTOR_ID'])) ? $this->_posts['INVESTOR_ID'] : 0;
		$pa_id = (isset($this->_posts['PARTICIPANT_ID'])) ? $this->_posts['PARTICIPANT_ID'] : 0;
		$ma_id = (isset($this->_posts['MEETING_ACTIVITIE_ID'])) ? $this->_posts['MEETING_ACTIVITIE_ID'] : 0;
		$data = array(
				'data' => array()
				);
		$inModel = new Application_Model_Investors();
		try {
			 //Delete
			$where=array();
			$where[]= $this->_model->getAdapter()->quoteInto('PARTICIPANT_ID = ?', $pa_id);
			$where[]= $this->_model->getAdapter()->quoteInto('MEETING_ACTIVITIE_ID = ?', $ma_id);
			$this->_model->delete($where);

			$inModel->update(array(
 					'MODIFIED_DATE' => date('Y-m-d H:i:s')
 				),$inModel->getAdapter()->quoteInto('INVESTOR_ID = ?', $in_id));
		}catch(Exception $e) {
			$this->_error_code = $e->getCode();
			$this->_error_message = $e->getMessage();
			$this->_success = false;
		}
		MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}
}
