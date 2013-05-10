<?php 

class News_RequestController extends MyIndo_Controller_Action
{	
	public function init()
	{
		$this->getInit();
		$this->_model = new Application_Model_News();
	}
	
	public function readAction()
	{
		if($this->getRequest()->isPost() && $this->getRequest()->isXmlHttpRequest()) {
			$ncatModel = new Application_Model_NewsCategory();
			$ncomModel = new Application_Model_Company();
			
			if(!isset($this->_posts['search'])) {
	
				/* Not search query */
	
				if(isset($this->_posts['all']) && $this->_posts['all'] == 1) {
					$this->_limit = $this->_model->count();
				}
	
				if(!isset($this->_posts['query']) || $this->_posts['query'] == '' || empty($this->_posts['query'])) {
					if(!isset($this->_posts['sort'])) {
						$list = $this->_model->getListLimit($this->_limit, $this->_start, 'CREATED_DATE DESC');
					} else {
						$sort = Zend_Json::decode($this->_posts['sort']);
						$q = $this->_model->select();
						if($sort[0]['property'] != 'NEWS_CATEGORY' && $sort[0]['property'] != 'COMPANY_NAME') {
							$q->order($sort[0]['property'] . ' ' . $sort[0]['direction']);
						}
						$q->limit($this->_limit, $this->_start);
						$list = $q->query()->fetchAll();
					}
				} else {
					$where = $this->_model->getAdapter()->quoteInto('TITLE LIKE ?', '%' . $this->_posts['query'] . '%');
					$list = $this->_model->getListLimit($this->_limit, $this->_start, 'CREATED_DATE DESC', $where);
				}
	
				foreach($list as $k=>$d) {
					$list[$k]['NEWS_CATEGORY'] = $ncatModel->getValueByKey('NEWS_CATEGORY_ID', $d['NEWS_CATEGORY_ID'], 'NEWS_CATEGORY');
					
					$list[$k]['COMPANY_NAME'] = $ncomModel->getValueByKey('COMPANY_ID', $d['COMPANY_ID'], 'COMPANY_NAME');
				}
				
				$totalCount = $this->_model->count();

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

				$this->_data['data']['items'] = $list;
				$this->_data['data']['totalCount'] = $totalCount;
	
			} else {
	
				/* Search query */
				if($this->_posts['search'] == 1) {
						
					$where = array();
						
					/* Title */
					if(isset($this->_posts['title'])) {
						$where[] = $this->_model->getAdapter()->quoteInto('TITLE LIKE ?', '%' . $this->_posts['title'] . '%');
					} else {
						$where[] = $this->_model->getAdapter()->quoteInto('TITLE LIKE ?', '%%');
					}
						
					/* Category */
					if(isset($this->_posts['category'])) {
						if($ncatModel->isExistByKey('NEWS_CATEGORY', $this->_posts['category'])) {
							$catID = $ncatModel->getPkByKey('NEWS_CATEGORY', $this->_posts['category']);
							$where[] = $this->_model->getAdapter()->quoteInto('NEWS_CATEGORY_ID = ?', $catID);
						} else {
							$where[] = $this->_model->getAdapter()->quoteInto('NEWS_CATEGORY_ID LIKE ?', '%%');
						}
					} else {
						$where[] = $this->_model->getAdapter()->quoteInto('NEWS_CATEGORY_ID LIKE ?', '%' . $this->_posts['category'] . '%');
					}
					/* Category*/

					/* Company */
					if (isset($this->_posts['company'])) {
						
						if ($ncomModel->isExistByKey('COMPANY_NAME', $this->_posts['company'])) {
							$comID = $ncomModel->getPkByKey('COMPANY_NAME', $this->_posts['company']);
							//print_r($comID);	
							$where[] = $this->_model->getAdapter()->quoteInto('COMPANY_ID = ?', $comID);
						} else {
							$where[] = $this->_model->getAdapter()->quoteInto('COMPANY_ID LIKE ?', '%%');
						}
					} else {
						$where[] = $this->_model->getAdapter()->quoteInto('COMPANY_ID LIKE ?', '%' . $this->_posts['company'] . '%');
					}
					/* Company */
					
					/* Source */
					if(isset($this->_posts['source'])) {
						$where[] = $this->_model->getAdapter()->quoteInto('SOURCE LIKE ?', '%' . $this->_posts['source'] . '%');
					} else {
						$where[] = $this->_model->getAdapter()->quoteInto('SOURCE LIKE ?', '%%');
					}
					/* Source */
					
					if (isset($this->_posts['startdate']) && isset($this->_posts['enddate'])) {
						$where[] = $this->_model->getAdapter()->quoteInto('CREATED_DATE >= ?', $this->_posts['startdate']);
						$where[] = $this->_model->getAdapter()->quoteInto('CREATED_DATE <= ?', $this->_posts['enddate']);
					}
					
					$query = $this->_model->select()
					->where($where[0])
					->where($where[1])
					->where($where[2])
					->where($where[3])
					->where($where[4])
					->where($where[5])
					->limit($this->_model->count(), $this->_start);

					$list = $query->query()->fetchAll();
					
					foreach($list as $k=>$d) {
						$list[$k]['NEWS_CATEGORY'] = $ncatModel->getValueByKey('NEWS_CATEGORY_ID', $d['NEWS_CATEGORY_ID'], 'NEWS_CATEGORY');
						//$lisk[$k]['COMPANY_NAME'] = $ncomModel->getValueByKey('COMPANY_ID', $d['COMPANY_ID'], 'COMPANY_NAME');
						$comName = $ncomModel->getValueByKey('COMPANY_ID', $d['COMPANY_ID'], 'COMPANY_NAME');
						$list[$k]['COMPANY_NAME'] = $comName;
					}

				} else if ($this->_posts['search'] == 2) {
					$where = array();
					
					/* Title */
					if(isset($this->_posts['title'])) {
						$where[] = $this->_model->getAdapter()->quoteInto('TITLE LIKE ?', '%' . $this->_posts['title'] . '%');
					} else {
						$where[] = $this->_model->getAdapter()->quoteInto('TITLE LIKE ?', '%%');
					}
					
					/* Category */
					if(isset($this->_posts['category'])) {
						if($ncatModel->isExistByKey('NEWS_CATEGORY', $this->_posts['category'])) {
							$catID = $ncatModel->getPkByKey('NEWS_CATEGORY', $this->_posts['category']);
							$where[] = $this->_model->getAdapter()->quoteInto('NEWS_CATEGORY_ID = ?', $catID);
						} else {
							$where[] = $this->_model->getAdapter()->quoteInto('NEWS_CATEGORY_ID LIKE ?', '%%');
						}
					} else {
						$where[] = $this->_model->getAdapter()->quoteInto('NEWS_CATEGORY_ID LIKE ?', '%' . $this->_posts['category'] . '%');
					}
					/* Category*/
					
					$query = $this->_model->select()
					->where($where[0])
					->where($where[1])
					->limit($this->_model->count(), $this->_start);
					
					//print_r($where[3]);
					$list = $query->query()->fetchAll();
						
					foreach($list as $k=>$d) {
						$list[$k]['NEWS_CATEGORY'] = $ncatModel->getValueByKey('NEWS_CATEGORY_ID', $d['NEWS_CATEGORY_ID'], 'NEWS_CATEGORY');
						//$lisk[$k]['COMPANY_NAME'] = $ncomModel->getValueByKey('COMPANY_ID', $d['COMPANY_ID'], 'COMPANY_NAME');
						$comName = $ncomModel->getValueByKey('COMPANY_ID', $d['COMPANY_ID'], 'COMPANY_NAME');
						$list[$k]['COMPANY_NAME'] = $comName;
					}
				} else {
					$list = array();
				}
				$this->_data['data']['items'] = $list;
				$this->_data['data']['totalCount'] = count($list);
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
		if($this->getRequest()->isPost()) {
				
			try {
	
				/* File upload process: */
				$adp = new Zend_File_Transfer_Adapter_Http();
				$mimeModel = new Application_Model_Mime();
				$ncatModel = new Application_Model_NewsCategory();
				$ncomModel = new Application_Model_Company();
	
				$adp->setDestination(APPLICATION_PATH . '/../public/upload/news/');
				$adp->addValidator('Extension',false,'doc,docx,xls,xlsx,pdf,txt');
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
						$new_name = 'ITMG_' . str_replace(array('!','@','#','$','%','^','&','*','{','}',']','[','|','?','<','>',' '), '_', $this->_posts['TITLE']) . '_' . date('Y_m_d_H_i_s') . $filExt;
						rename($adp->getDestination() . '/' . $fileInfo['FILE_PATH']['name'], $adp->getDestination() . '/' . $new_name);
						/* End of : Rename file */
	
						/* Get News Category ID */
						$ncatID = $ncatModel->getPkByKey('NEWS_CATEGORY', $this->_posts['CATEGORY']);
						/* End of : Get News Category ID */
						
						/* Get News Company ID */
						$ncomID = $ncomModel->getPkByKey('COMPANY_NAME', $this->_posts['COMPANY_NAME']);
						/* End of : Get News Company ID */
	
						$this->_model->insert(array(
								'NEWS_CATEGORY_ID' => $ncatID,
								'COMPANY_ID' => $ncomID,
								'TITLE' => $this->_posts['TITLE'],
								'SOURCE' => $this->_posts['SOURCE'],
								'DESCRIPTION' => '',
								'FILE_NAME' => $new_name,
								'FILE_SIZE' => (int)$fileInfo['FILE_PATH']['size'],
								'FILE_PATH' => '/upload/news/' . $new_name,
								'FILE_TYPE' => $mimeModel->getValueByKey('EXTENSION', $filExt, 'MIME_TYPE'),
								'CREATED_DATE' => date('Y-m-d H:i:s')
						));
						
						
	
	
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
				$this->_success = false;
			}
		} else {
			$this->_error_code = 901;
			$this->_error_message = MyIndo_Tools_Error::getErrorMessage($this->_error_code);
			$this->_success = false;
		}
		MyIndo_Tools_Return::JSON($this->_data, $this->_error_code, $this->_error_message, $this->_success);
	}
	
	public function updateAction()
	{
		if($this->getRequest()->isPost() && $this->getRequest()->isXmlHttpRequest()) {
			$ncatModel = new Application_Model_NewsCategory();
			$ncomModel = new Application_Model_Company();
			try {
	
				$data = $this->getRequest()->getRawBody();
				$data = Zend_Json::decode($data);
	
				if($this->_model->isExistByKey($this->_model->getPK(), $data['data'][$this->_model->getPK()])) {
						
					try {
						$where = $this->_model->getAdapter()->quoteInto($this->_model->getPK() . ' = ?', $data['data'][$this->_model->getPK()]);
						$validCat = false;
						$catID = 0;
						/* Check for valid category */
						if(isset($data['data']['NEWS_CATEGORY'])) {
							if($ncatModel->isExistByKey('NEWS_CATEGORY', $data['data']['NEWS_CATEGORY'])) {
								try {
									$ncatID = $ncatModel->getPkByKey('NEWS_CATEGORY', $data['data']['NEWS_CATEGORY']);
									$validCat = true;
								} catch(Exception $e) {
									$validCat = false;
								}
							}
						}
						
						if(isset($data['data']['COMPANY_NAME'])) {
							if ($ncomModel->isExistByKey('COMPANY_NAME', $data['data']['COMPANY_NAME'])) {
								try {
									$ncomID = $ncomModel->getPkByKey('COMPANY_NAME', $data['data']['COMPANY_NAME']); 
									$validCom = true;
								} catch (Exception $e) {
									$validCom = false;
								}
							}
						}
	
						if(!$validCat . $validCom) {
							$this->_model->update(array(
									'TITLE' => $data['data']['TITLE']
							),$where);
						} else {
							$this->_model->update(array(
									'TITLE' => $data['data']['TITLE'],
									'NEWS_CATEGORY_ID' => $ncatID
							),$where);
						}
	
						$this->_data['data']['items'] = $this->_model->getDetailByKey($this->_model->getPK(), $data['data'][$this->_model->getPK()]);
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
	
			}catch(Exception $e) {
				$this->_error_code = $e->getCode();
				$this->_error_message = $e->getMessage();
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
	
	public function downloadAction()
	{
		$id = $this->_getParam('id',0);
		if($this->_model->isExistByKey($this->_model->getPK(), $id)) {
			$this->getResponse()
			->setHeader('Content-Disposition', 'attachment; filename=' . $this->_model->getValueByKey($this->_model->getPK(), $id, 'FILE_NAME'))
			->setHeader('Content-type', $this->_model->getValueByKey($this->_model->getPK(), $id, 'FILE_TYPE'));
			$this->_model->update(array(
					'TOTAL_HIT' => (int) $this->_model->getValueByKey($this->_model->getPK(), $id, 'TOTAL_HIT') + 1
			),$this->_model->getAdapter()->quoteInto($this->_model->getPK() . ' = ?', $id));
			echo file_get_contents(APPLICATION_PATH . '/../public' . $this->_model->getValueByKey($this->_model->getPK(), $id, 'FILE_PATH'));
		}
	}
}