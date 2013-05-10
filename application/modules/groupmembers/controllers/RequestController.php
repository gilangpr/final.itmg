<?php 

class GroupMembers_RequestController extends MyIndo_Controller_Action
{
	public function init()
	{	
		$this->getInit(new Application_Model_GroupMembers());
	}
	
	public function readAction()
	{
		if($this->getRequest()->isPost() && $this->getRequest()->isXmlHttpRequest() && isset($this->_posts['id'])) {
			if($this->_model->isExistByKey('GROUP_ID', $this->_posts['id'])) {
				$list = $this->_model->getListByKey('GROUP_ID', $this->_posts['id'], 'USERNAME ASC');
				$this->_data['data']['items'] = $list;
				$this->_data['data']['totalCount'] = count($list);
			} else {
				$this->_data['data']['items'] = array();
				$this->_data['data']['totalCount'] = 0;
			}
		} else {
			$this->_error_code = 901;
			$this->_error_message = MyIndo_Tools_Error::getErrorMessage($this->_error_code);
			$this->_success = false;
		}
		MyIndo_Tools_Return::JSON($this->_data, $this->_error_code, $this->_error_message, $this->_success);
	}
	
	public function createAction()
	{
		if($this->getRequest()->isPost() && $this->getRequest()->isXmlHttpRequest() && isset($this->_posts['id'])) {
			$groupsModel = new Application_Model_Groups();
			$groupMemberModel = new Application_Model_GroupMembers();
			
			if($groupsModel->isExistByKey('GROUP_ID', $this->_posts['id'])) {
				
				if(isset($this->_posts['USERNAME'])) {
					
					$q = $groupMemberModel->select()
					->where('USERNAME = ?', $this->_posts['USERNAME'])
					->where('GROUP_ID = ?', $this->_posts['id']);
					
					if($q->query()->rowCount() < 1) {
						
						try {
							
							$groupMemberModel->insert(array(
									'GROUP_ID' => $this->_posts['id'],
									'USERNAME' => $this->_posts['USERNAME'],
									'CREATED_DATE' => $this->_date
								));
							
						}catch(Exception $e) {
							$this->_error_code = $e->getCode();
							$this->_error_message = $e->getMessage();
							$this->_success = false;
						}
						
					} else {
						$this->_error_code = 201;
						$this->_error_message = MyIndo_Tools_Error::getErrorMessage($this->_error_code);
						$this->_success = false;
					}
					
				} else {
					$this->_error_code = 901;
					$this->_error_message = MyIndo_Tools_Error::getErrorMessage($this->_error_code);
					$this->_success = false;
				}
				
			} else {
				$this->_error_code = 101;
				$this->_error_message = MyIndo_Tools_Error::getErrorMessage($this->_error_code);
				$this->_success = false;
			}
			
		} else {
			$this->_error_code = 901;
			$this->_error_message = MyIndo_Tools_Error::getErrorMessage($this->_error_code);
			$this->_success = false;
		}
		MyIndo_Tools_Return::JSON($this->_data, $this->_error_code, $this->_error_message, $this->_success);
	}
	
	public function destroyAction()
	{
		if($this->getRequest()->isPost() && $this->getRequest()->isXmlHttpRequest() && isset($this->_posts['id']) && isset($this->_posts['username'])) {
			
			$groupMemberModel = new Application_Model_GroupMembers();
			
			$q = $groupMemberModel->select()
			->where('GROUP_ID = ?', $this->_posts['id'])
			->where('USERNAME = ?', $this->_posts['username']);
			
			if($q->query()->rowCount() > 0) {
				
				try {
					$groupMemberModel->delete(array(
							$groupMemberModel->getAdapter()->quoteInto('GROUP_ID = ?', $this->_posts['id']),
							$groupMemberModel->getAdapter()->quoteInto('USERNAME = ?', $this->_posts['username'])
							));
				} catch (Exception $e) {
					$this->_error_code = $e->getCode();
					$this->_error_message = $e->getMessage();
					$this->_success = false;
				}
				
			} else {
				$this->_error_code = 101;
				$this->_error_message = MyIndo_Tools_Error::getErrorMessage($this->_error_code);
				$this->_success = false;
			}
			
		} else {
			$this->_error_code = 901;
			$this->_error_message = MyIndo_Tools_Error::getErrorMessage($this->_error_code);
			$this->_success = false;
		}
		MyIndo_Tools_Return::JSON($this->_data, $this->_error_code, $this->_error_message, $this->_success);
	}
}