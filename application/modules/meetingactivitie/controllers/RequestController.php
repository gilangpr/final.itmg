<?php 

class Meetingactivitie_RequestController extends MyIndo_Controller_Action
{	
	public function init()
	{
		$this->getInit();
		$this->_model = new Application_Model_Meetingactivitie();		
	}
	
	public function createAction()
	{
		if($this->isPost() && $this->isAjax()) {
			try {
				$q = $this->_model->select()
				->where('MEETING_EVENT = ?', $this->_posts['MEETING_EVENT'])
				->where('MEETING_DATE = ?', $this->_posts['MEETING_DATE']);
				$c = $q->query()->fetchAll();
				if(count($c) == 0) {
					try {
						$this->_model->insert(array(
		 					'MEETING_EVENT' => $this->_posts['MEETING_EVENT'],
							'MEETING_DATE' => $this->_posts['MEETING_DATE'],
							'START_TIME' => $this->_posts['START_TIME'],
							'END_TIME' => $this->_posts['END_TIME'],
							'NOTES' => '',
		 					'CREATED_DATE' => date('Y-m-d H:i:s')
		 					));
					} catch(Exception $e) {
						$this->_error_code = $e->getCode();
						$this->_error_message = $e->getMessage();
						$this->_success = false;
					}
				} else {
					$this->error(201);
				}
			} catch(Exception $e) {
				$this->_error_code = $e->getCode();
				$this->_error_message = $e->getMessage();
				$this->_success = false;
			}
		} else {
			$this->error(901);
		}
		$this->json();
	}

	public function crAction()
	{
		if($this->isPost() && $this->isAjax()) {
			try {
				$in_id = $this->_getParam('id', 0);
				$mInvestors = new Application_Model_Investors();
				$mMeetingInvestor = new Application_Model_Meetinginvestor();
				$q = $mInvestors->select()->where($mInvestors->getPk() . ' = ?', $in_id);
				$c = $q->query()->fetchAll();
				if(count($c) > 0) {
					$q = $this->_model->select()
					->where('MEETING_EVENT = ?', $this->_posts['MEETING_EVENT'])
					->where('MEETING_DATE = ?', $this->_posts['MEETING_DATE']);
					$c = $q->query()->fetchAll();
					if(count($c) == 0) {
						try {

							$meeting_id = $this->_model->insert(array(
								'MEETING_EVENT' => $this->_posts['MEETING_EVENT'],
								'MEETING_DATE' => $this->_posts['MEETING_DATE'],
								'START_TIME' => $this->_posts['START_TIME'],
								'END_TIME' => $this->_posts['END_TIME'],
								'NOTES' => '',
								'CREATED_DATE' => $this->_date
								));

							$mMeetingInvestor->insert(array(
								'MEETING_ACTIVITIE_ID' => $meeting_id,
								'INVESTOR_ID' => $in_id
								));

							/* Update Investors */
							$mInvestors->update(array(
								'MODIFIED_DATE' => $this->_date
								),$mInvestors->getAdapter()->quoteInto($mInvestors->getPk() . ' = ?', $in_id));
							/* End of : Update Investors */
						} catch(Exception $e) {
							$this->_error_code = $e->getCode();
							$this->_error_message = $e->getMessage();
							$this->_success = false;
						}
					} else {
						//$this->error(201);
						$meeting_id = $c[0]['MEETING_ACTIVITIE_ID'];
						try {
							$q = $mMeetingInvestor->select()
							->where('MEETING_ACTIVITIE_ID = ?', $meeting_id)
							->where('INVESTOR_ID = ?', $in_id);
							$c = $q->query()->fetchAll();
							if(count($c) == 0) {
								$mMeetingInvestor->insert(array(
									'MEETING_ACTIVITIE_ID' => $meeting_id,
									'INVESTOR_ID' => $in_id
									));

								/* Update Investors */
								$mInvestors->update(array(
									'MODIFIED_DATE' => $this->_date
									),$mInvestors->getAdapter()->quoteInto($mInvestors->getPk() . ' = ?', $in_id));
								/* End of : Update Investors */
							} else {
								$this->error(201);
							}
						} catch(Exception $e) {
							$this->_error_code = $e->getCode();
							$this->_error_message = $e->getMessage();
							$this->_success = false;
						}
					}
				} else {
					$this->error(901);
				}
			} catch(Exception $e) {
				$this->_error_code = $e->getCode();
				$this->_error_message = $e->getMessage();
				$this->_success = false;
			}
		} else {
			$this->error(901);
		}
		$this->json();
	}
	
	public function readAction()
	{
		if($this->isPost() && $this->isAjax()) {
			if(isset($this->_posts['sort']) || isset($this->_posts['query'])) {
				if(isset($this->_posts['sort'])) {
					// Decode sort JSON :
					$sort = Zend_Json::decode($this->_posts['sort']);
				}
				// Query data
				$q = $this->_model->select();
				if(isset($this->_posts['sort'])) {
					if($sort[0]['property'] == 'MEETING_EVENT' || $sort[0]['property'] == 'MEETING_DATE') {
						$q->order($sort[0]['property'] . ' ' . $sort[0]['direction']);
					}
				}
				if(isset($this->_posts['query'])) {
					if(!empty($this->_posts['query']) && $this->_posts['query'] != '') {
						$q->where('MEETING_EVENT LIKE ?', '%' . $this->_posts['query'] . '%');
					}
				}
				// Count all data
				$rTotal = $q->query()->fetchAll();
				$totalCount = count($rTotal);
				
				// Fetch sorted & limit data
				$q->limit($this->_limit, $this->_start);
				$list = $q->query()->fetchAll();
				foreach($list as $k=>$d) {
					$list[$k]['MEETING_DATE'] = date("d-m-Y", strtotime($d['MEETING_DATE']));
				}
				
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

			} else {
				$list = $this->_model->getListLimit($this->_limit, $this->_start, 'MEETING_DATE DESC');
				$totalCount = $this->_model->count();
			}

			
			$modelInvestors = new Application_Model_Investors();
			$modelContacts = new Application_Model_Contacts();
			$modelParticipants = new Application_Model_Participant();
			$modelItmPart = new Application_Model_Itmparticipants();
			$modelActInv = new Application_Model_Meetinginvestor();
			$modelCntInv = new Application_Model_Meetingcontact();
			$modelItmInv = new Application_Model_Meetingparticipant();
			foreach($list as $k=>$d) {
				/* Get List Company */
				$qActInv = $modelActInv->select()->where('MEETING_ACTIVITIE_ID = ?', $d['MEETING_ACTIVITIE_ID']);
				$resActInv = $qActInv->query()->fetchAll();
				foreach($resActInv as $_k=>$_d) {
					$investors = $modelInvestors->getDetailByKey('INVESTOR_ID', $_d['INVESTOR_ID']);
					if($_k > 0) {
						$list[$k]['COMPANY_NAME'] .= ', ' . $investors['COMPANY_NAME'];
					} else {
						$list[$k]['COMPANY_NAME'] = $investors['COMPANY_NAME'];
					}
				}
				/* End of : Get List Company */
				
				/* Get List Contact */
				$qCntInv = $modelCntInv->select()->where('MEETING_ACTIVITIE_ID = ?', $d['MEETING_ACTIVITIE_ID']);
				$resCntInv = $qCntInv->query()->fetchAll();
				foreach($resCntInv as $_k=>$_d) {
					$contacts = $modelContacts->getDetailByKey('CONTACT_ID', $_d['CONTACT_ID']);
					if($_k > 0) {
						$list[$k]['NAME'] .= ', ' . $contacts['NAME'];
					} else {
						$list[$k]['NAME'] = $contacts['NAME'];
					}
				}
				/* End of : Get List Contact */

				/* Get List Participant */
				$qPart = $modelParticipants->select()->where('MEETING_ACTIVITIE_ID = ?', $d['MEETING_ACTIVITIE_ID']);
				$resPart = $qPart->query()->fetchAll();
				foreach($resPart as $_k=>$_d) {
					if($_k > 0) {
						$list[$k]['NAME'] .= ', ' . $_d['NAME'];
					} else {
						if(isset($list[$k]['NAME'])) {
							$list[$k]['NAME'] .= ', ' . $_d['NAME'];
						} else {
							$list[$k]['NAME'] = $_d['NAME'];
						}
					}
				}
				/* End of : Get List Participant */

				/* Get List ITM Participant */
				$qItmPart = $modelItmInv->select()->where('MEETING_ACTIVITIE_ID = ?', $d['MEETING_ACTIVITIE_ID']);
				$resItmPart = $qItmPart->query()->fetchAll();
				foreach($resItmPart as $_k=>$_d) {
					$itmParticipants = $modelItmPart->getDetailByKey('PARTICIPANT_ID', $_d['PARTICIPANT_ID']);
					if($_k > 0) {
						$list[$k]['INITIAL_PART'] .= ', ' . $itmParticipants['INITIAL_PART'];
					} else {
						$list[$k]['INITIAL_PART'] = $itmParticipants['INITIAL_PART'];
					}
				}
				/* End of : ITM Participant */
			}

			$this->_data['data']['items'] = $list;
			$this->_data['data']['totalCount'] = $totalCount;
		} else {
			$this->error(901);
		}
		$this->json();
	}

	public function updateAction()
	{
		if($this->isPost() && $this->isAjax()) {
			$data = $this->getRequest()->getRawBody();
			$data = Zend_Json::decode($data);
			$id = $data['data']['MEETING_ACTIVITIE_ID'];
			$date = $data['data']['MEETING_DATE'];
			$newDate = date("Y-m-d", strtotime($date));
			try {
				
				$this->_model->update(array(
						'MEETING_EVENT' => $data['data']['MEETING_EVENT'],
						'MEETING_DATE'=>$newDate
						),
						$this->_model->getAdapter()->quoteInto('MEETING_ACTIVITIE_ID = ?', $id));
			}catch(Exception $e) {
				$this->_error_code = $e->getCode();
				$this->_error_message = $e->getMessage();
				$this->_success = false;
			}
		} else {
			$this->error(901);
		}
		$this->json();
	}
	
	public function updatenotesAction()
	{
		
		$data = array(
			'data' => array()
		);
		//Call Model Investor
		$modelInvestors = new Application_Model_Investors();
		$maModel = new Application_Model_Meetingactivitie();
		try {
			// Insert Data :
			//get id params
			$ma_id = $this->_posts['id'];
			$in_id = $this->_posts['INVESTOR_ID'];
			if($maModel->isExistByKey('MEETING_ACTIVITIE_ID', $ma_id)) {
 				$this->_model->update(array(
					'NOTES' => $this->_posts['NOTES']),
 				$this->_model->getAdapter()->quoteInto('MEETING_ACTIVITIE_ID = ?', $ma_id));
 				$modelInvestors->update(array(
 					'MODIFIED_DATE' => date('Y-m-d H:i:s')
 				),$modelInvestors->getAdapter()->quoteInto('INVESTOR_ID = ?', $in_id));
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
	public function destroyAction()
	{	
		//$meetingAc_id = (isset($this->_posts['id'])) ? $this->_posts['id'] : 0;
		$data = array(
				'data' => array()
				);
		try {
			 //Delete
			$this->_model->delete(
 					$this->_model->getAdapter()->quoteInto(
 				'MEETING_ACTIVITIE_ID = ?', $this->_posts['MEETING_ACTIVITIE_ID']
 							));
		}catch(Exception $e) {
			$this->_error_code = $e->getCode();
			$this->_error_message = $e->getMessage();
			$this->_success = false;
		}
		MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}
}
