<?php 

class Meetingdocumentation_RequestController extends Zend_Controller_Action
{
	protected $_model;
	protected $_limit;
	protected $_start;
	protected $_posts;
	protected $_error_code;
	protected $_error_message;
	protected $_success;
	protected $_data;
	
	public function init()
	{
		$this->_helper->layout()->disableLayout();
		$this->_helper->viewRenderer->setNoRender(true);
		$this->_model = new Application_Model_Meetingdocumentation();
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
		
		if($this->getRequest()->isPost()) {
				
			try {
	
				/* File upload process: */
				$adp = new Zend_File_Transfer_Adapter_Http();
				//$mimeModel = new Application_Model_Mime();
				$MDModel = new Application_Model_Meetingdocumentation();
				$MAmodel = new Application_Model_Meetingactivitie();
				$inModel = new Application_Model_Investors();
				$adp->setDestination(APPLICATION_PATH ."/../public/upload/meetings/");
				$adp->addValidator('Extension',false, array('doc','docx','xls','xlsx','pdf','txt','case'=>true));
				try {
						
					if($adp->isValid()) {
	
						$adp->receive();
						$fileInfo = $adp->getFileInfo();
						$this->_data['fileInfo'] = $fileInfo;
	
						/* Get file extension */
						$filExt = explode('.',$fileInfo['FILE_PATH']['name']);
						$filExt = '.' . strtolower($filExt[count($filExt)-1]);
						/* End of : Get file extension */
	
						/* Rename file */
						$new_name = 'ITMG_' . str_replace(array('!','@','#','$','%','^','&','*','{','}',']','[','|','?','<','>',' '), '_', $this->_posts['DOCUMENTATION_TITLE']) . '_' . date('Y_m_d_H_i_s') . $filExt;
						rename($adp->getDestination() . '/' . $fileInfo['FILE_PATH']['name'], $adp->getDestination() . '/' . $new_name);
						/* End of : Rename file */
	
						/* Get Research Report Category ID */
						$mdID=$this->_getParam('id',0);	
						//$rrcID = $rrcModel->getPkByKey('NEWS_CATEGORY', $this->_posts['CATEGORY']);
						/* End of : Get Research Report Category ID */
						$in_id = (isset($this->_posts['INVESTOR_ID'])) ? $this->_posts['INVESTOR_ID'] : 0;
						if($MAmodel->isExistByKey('MEETING_ACTIVITIE_ID',$mdID)){
						$this->_model->insert(array(
								'MEETING_ACTIVITIE_ID' => $mdID,
								'DOCUMENTATION_TITLE' => $this->_posts['DOCUMENTATION_TITLE'],
								'FILE_PATH' => '/upload/meetings/' . $new_name,
								'FILE_NAME' => $new_name,
								'FILE_SIZE' => (int)$fileInfo['FILE_PATH']['size'],
								//'FILE_TYPE' => $mimeModel->getValueByKey('EXTENSION', $filExt, 'MIME_TYPE'),
								'CREATED_DATE' => date('Y-m-d H:i:s')
						));
						$inModel->update(array(
								'MODIFIED_DATE'=> date('Y-m-d H:i:s')
							),$inModel->getAdapter()->quoteInto('INVESTOR_ID = ?',$in_id));
						}
						else{
							$this->_error_code=101;
							$this->_error_message= MyIndo_Tools_Error::getErrorMessage($this->_error_code);
							$this->_success=false;
						}
	
					} else {
						$this->_error_code = 902;
						$this->_error_message = MyIndo_Tools_Error::getErrorMessage($this->_error_code);
						$this->_success = false;
					}
						
				}catch(Zend_File_Transfer_Exception $e) {
					$this->_error_code = $e->getCode();
					$this->_error_message = $e->getMessage();
					$this->_success = false;
				}
	
			}catch(Exception $e) {
				$this->_error_code = $e->getCode();
				$this->_error_message = $e->getMessage();
				//$this->_error_message = MyIndo_Tools_Error::getErrorMessage($this->_error_code);
				$this->_success = false;
			}
		} else {
			$this->_error_code = 901;
			$this->_error_message = MyIndo_Tools_Error::getErrorMessage($this->_error_code);
			$this->_success = false;
		}
		MyIndo_Tools_Return::JSON($this->_data, $this->_error_code, $this->_error_message, $this->_success);
	}
	public function readAction()
	{
		$MAmodel = new Application_Model_Meetingactivitie();
		$MA_id = (isset($this->_posts['id'])) ? $this->_posts['id'] : 0;
		if($MAmodel->isExistByKey('MEETING_ACTIVITIE_ID', $MA_id)) {
			$list = $this->_model->select()->where('MEETING_ACTIVITIE_ID = ?', $MA_id);
			$list = $list->query()->fetchAll();
			/*			
			foreach($list as $k=>$d) {
				$list[$k]['FNAME'] = $d['FNAME'] . ' ' . $d['LNAME'];
			}
			*/
			$data = array(
				'data' => array(
					'items' => $list,
					'totalCount' => count($list)
					)
				);
		} else {
			$data = array(
					'data' => array(
							'items' => array(),
							'totalCount' => 0
					)
			);
		}
	MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}
	public function destroyAction(){
		if($this->getRequest()->isPost() && $this->getRequest()->isXmlHttpRequest() && isset($this->_posts[$this->_model->getPK()])) {
			if($this->_model->isExistByKey($this->_model->getPK(), $this->_posts[$this->_model->getPK()])) {
				try {
					
					$file_path = $this->_model->getValueByKey($this->_model->getPK(), $this->_posts[$this->_model->getPK()], 'FILE_PATH');
					
					/* Delete file */
					if(file_exists(APPLICATION_PATH . '/../public' . $file_path)) {
						unlink(APPLICATION_PATH . '/../public' . $file_path);
					}
					/* End of : Delete file */
					
					$this->_model->delete($this->_model->getAdapter()->quoteInto($this->_model->getPK() . ' = ?', $this->_posts[$this->_model->getPK()]));

					
					
				}catch(Exception $e) {
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
	public function downloadAction(){

		$id = $this->_getParam('id',0);
		if($this->_model->isExistByKey($this->_model->getPK(), $id)) {
			$this->getResponse()
			->setHeader('Content-Disposition', 'attachment; filename=' . $this->_model->getValueByKey($this->_model->getPK(), $id, 'FILE_NAME'));
			//->setHeader('Content-type', $this->_model->getValueByKey($this->_model->getPK(), $id, 'FILE_TYPE'));
			$this->_model->update(array(
					'TOTAL_HIT' => (int) $this->_model->getValueByKey($this->_model->getPK(), $id, 'TOTAL_HIT') + 1
			),$this->_model->getAdapter()->quoteInto($this->_model->getPK() . ' = ?', $id));
			echo file_get_contents(APPLICATION_PATH . '/../public' . $this->_model->getValueByKey($this->_model->getPK(), $id, 'FILE_PATH'));
		}
	}
	public function searchAction() 
	{
		$data = array(
				'data' => array(
						'items' => array(),
						'totalCount' => 0
						)
				);
		MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}
}
