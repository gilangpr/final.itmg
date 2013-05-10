<?php
class Shareprices_RequestController extends MyIndo_Controller_Action
{
	public function init()
	{
		$this->getInit();
		$this->_model = new Application_Model_Shareprices();
		$this->_modelLog = new Application_Model_SharepricesLog();
	}
	
	// public function readAction()
	// {
	// 	if($this->isPost() && $this->isAjax()) {
	// 		$pivotModel = new Application_Model_PivotList();

	// 		$q = $pivotModel->select();
	// 		if(isset($this->_posts['sort'])) {
	// 			$sort = Zend_Json::decode($this->_posts['sort']);
	// 			$q->order($sort[0]['property'] . ' ' . $sort[0]['direction']);
	// 		}
	// 		$q->limit($this->_limit, $this->_start);
			
	// 		$list = $q->query()->fetchAll();
	// 		$count = $pivotModel->count();
	// 		$this->_data['data']['items'] = $list;
	// 		$this->_data['data']['totalCount'] = $count;
	// 	} else {
	// 		$this->error(901);
	// 	}
	// 	$this->json();
	// }

	public function readAction()
	{
		$spName = new Application_Model_SharepricesName();
		$spRes = $spName->getList();
		$spList = array();
		$this->_limit = $this->_limit * count($spRes);
		$this->_start = $this->_start * count($spRes);
		if(isset($this->_posts['sort'])) {
			$sort = Zend_Json::decode($this->_posts['sort']);
			$q = $this->_model->select();
			if($sort[0]['property'] == 'DATE') {
				$q->order($sort[0]['property'] . ' ' . $sort[0]['direction']);
			}
			$q->limit($this->_limit, $this->_start);
			$list = $q->query()->fetchAll();
		} else {
			$list = $this->_model->getListLimit($this->_limit, $this->_start, 'DATE DESC');
		}

		$_temp = '';
		$_temp2 = '';
		$_i = 0;
		foreach($list as $k=>$d) {
			if($_temp == '') {
				$_temp = $d['DATE'];
				$this->_data['data']['items'][$_i]['IDS'] = '';
			}
			if($_temp != $d['DATE']) {
				$_i++;
				$_temp = $d['DATE'];
				$this->_data['data']['items'][$_i]['IDS'] = '';
			}
			if(!isset($this->_data['data']['items'][$_i]['DATE'])) {
				$this->_data['data']['items'][$_i]['DATE'] = $d['DATE'];
			}
			$this->_data['data']['items'][$_i][$d['SHAREPRICES_NAME']] = $d['VALUE'];

			// Set Ids :
			if($this->_data['data']['items'][$_i]['IDS'] != '') {
				$this->_data['data']['items'][$_i]['IDS'] .= '|';
			}
			$this->_data['data']['items'][$_i]['IDS'] .= $d['SHAREPRICES_NAME'] . '_' . $d['SHAREPRICES_ID'];
		}
		$this->_data['data']['totalCount'] = (count($spRes) > 0) ? ($this->_model->count() / count($spRes)) : 0;
		MyIndo_Tools_Return::JSON($this->_data, $this->_error_code, $this->_error_message, $this->_success);
	}
	
	public function createAction()
	{
		if($this->isPost() && $this->isAjax()) {
			if(isset($this->_posts['SHAREPRICES_NAME']) && isset($this->_posts['DATE'])) {

				$name = $this->_posts['SHAREPRICES_NAME'];
				$date = $this->_posts['DATE'];
				$rows = $this->_model->getCount($name, $date);

				$spName = new Application_Model_SharepricesName();

				if($rows['count'] == 0) {

					try {

						$getSNid = $spName->getPkByKey('SHAREPRICES_NAME', $name);

						//insert shareprices
						$this->_model->insert(array(
								'DATE'=> $this->_posts['DATE'],
								'SHAREPRICES_NAME' => $this->_posts['SHAREPRICES_NAME'],
								'VALUE' => $this->_posts['VALUE'],
								'CREATED_DATE' => date('Y-m-d H:i:s'),
								'SHAREPRICES_NAME_ID' => $getSNid
						));
						//insert shareprices log
						$this->_modelLog->insert(array(
								'DATE'=> $this->_posts['DATE'],
								'SHAREPRICES_NAME' => $this->_posts['SHAREPRICES_NAME'],
								'VALUE_BEFORE' => 0,
								'VALUE_AFTER' => $this->_posts['VALUE'],
								'CREATED_DATE' => date('Y-m-d H:i:s'),
								'SHAREPRICES_NAME_ID' => $getSNid
						));

						// Update for empty value
						$spList = $spName->getList();
						foreach($spList as $k=>$d) {
							$q = $this->_model->select()
							->where('DATE = ?', $date)
							->where('SHAREPRICES_NAME = ?', $d['SHAREPRICES_NAME']);
							$_x = $q->query()->fetchAll();
							if(count($_x) == 0) {

								$_gSid = $spName->getPkByKey('SHAREPRICES_NAME', $d['SHAREPRICES_NAME']);

								$this->_model->insert(array(
									'DATE'=> $this->_posts['DATE'],
									'SHAREPRICES_NAME' => $d['SHAREPRICES_NAME'],
									'VALUE' => 0,
									'CREATED_DATE' => date('Y-m-d H:i:s'),
									'SHAREPRICES_NAME_ID' => $_gSid
									));

								$this->_modelLog->insert(array(
									'DATE'=> $this->_posts['DATE'],
									'SHAREPRICES_NAME' => $d['SHAREPRICES_NAME'],
									'VALUE_BEFORE' => 0,
									'VALUE_AFTER' => 0,
									'CREATED_DATE' => date('Y-m-d H:i:s'),
									'SHAREPRICES_NAME_ID' => $_gSid
								));

							}
						}
						// End of : Update for empty value

					}catch(Exception $e) {
						$this->_error_code = $e->getCode();
						$this->_error_message = $e->getMessage();
						$this->_success = false;
					}

				} else {
					// get value before log
					$_q = $this->_modelLog->select()
					->where('SHAREPRICES_NAME = ?', $this->_posts['SHAREPRICES_NAME'])
					->order('CREATED_DATE DESC')
					->limit(1, 0);
					$_qRes = $_q->query()->fetch();

					$valbef = $_qRes['VALUE_AFTER'];
					
					$_gSid = $spName->getPkByKey('SHAREPRICES_NAME', $this->_posts['SHAREPRICES_NAME']);

					try {

						$this->_modelLog->insert(array(
							'DATE'=> $this->_posts['DATE'],
							'SHAREPRICES_NAME' => $this->_posts['SHAREPRICES_NAME'],
							'VALUE_BEFORE' => $valbef,
							'VALUE_AFTER' => $this->_posts['VALUE'],
							'CREATED_DATE' => date('Y-m-d H:i:s'),
							'SHAREPRICES_NAME_ID' => $_gSid
						));
							
						// update value
						$spid = $this->_model->getPksp($date, $name);
						$this->_model->update(array(
								'VALUE' => $this->_posts['VALUE'],
						),$this->_model->getAdapter()->quoteInto('SHAREPRICES_ID = ?', $spid));

						// Update for empty value
						$spList = $spName->getList();
						foreach($spList as $k=>$d) {
							$q = $this->_model->select()
							->where('DATE = ?', $date)
							->where('SHAREPRICES_NAME = ?', $d['SHAREPRICES_NAME']);
							$_x = $q->query()->fetchAll();
							if(count($_x) == 0) {
								$_gSid = $spName->getPkByKey('SHAREPRICES_NAME', $d['SHAREPRICES_NAME']);
								$this->_model->insert(array(
									'DATE'=> $this->_posts['DATE'],
									'SHAREPRICES_NAME' => $d['SHAREPRICES_NAME'],
									'VALUE' => 0,
									'CREATED_DATE' => date('Y-m-d H:i:s'),
									'SHAREPRICES_NAME_ID' => $_gSid
									));
								$this->_modelLog->insert(array(
									'DATE'=> $this->_posts['DATE'],
									'SHAREPRICES_NAME' => $d['SHAREPRICES_NAME'],
									'VALUE_BEFORE' => 0,
									'VALUE_AFTER' => 0,
									'CREATED_DATE' => date('Y-m-d H:i:s'),
									'SHAREPRICES_NAME_ID' => $_gSid
								));
							}
						}
						// End of : Update for empty value

					}catch(Exception $e) {
						$this->_error_code = $e->getCode();
						$this->_error_message = $e->getMessage();
						$this->_success = false;
					}
				}
			}
		}
		MyIndo_Tools_Return::JSON($this->_data, $this->_error_code, $this->_error_message, $this->_success);
	}
	
	public function updateAction()
	{
		try {
			$posts = $this->getRequest()->getRawBody();
			$posts = Zend_Json::decode($posts);
			$spName = new Application_Model_SharepricesName();
			$getId = explode('|',$posts['data']['IDS']);
			$ids = array();
			foreach($getId as $k=>$d) {
				$temp = explode('_', $d);
				if($temp[1] > 0) {

					// get value before log
					$_q = $this->_modelLog->select()
					->where('SHAREPRICES_NAME = ?', $temp[0])
					->order('CREATED_DATE DESC')
					->limit(1, 0);
					$_qRes = $_q->query()->fetch();

					$valbef = $_qRes['VALUE_AFTER'];
					$_gSid = $spName->getPkByKey('SHAREPRICES_NAME', $temp[0]);

					$this->_model->update(array(
							'VALUE' => $posts['data'][$temp[0]]
					), $this->_model->getAdapter()->quoteInto('SHAREPRICES_ID = ?', $temp[1]));
					
					$this->_modelLog->insert(array(
						'DATE'=> $posts['data']['DATE'],
						'SHAREPRICES_NAME' => $d['SHAREPRICES_NAME'],
						'VALUE_BEFORE' => $valbef,
						'VALUE_AFTER' => $posts['data'][$temp[0]],
						'CREATED_DATE' => date('Y-m-d H:i:s'),
						'SHAREPRICES_NAME_ID' => $_gSid
					));

				} else {

					$snId = new Application_Model_SharepricesName();
					$getSNid = $snId->getPkByKey('SHAREPRICES_NAME', $temp[0]);
					
					//insert shareprices
					$this->_model->insert(array(
							'DATE'=> $posts['data']['DATE'],
							'SHAREPRICES_NAME' => $temp[0],
							'VALUE' => $posts['data'][$temp[0]],
							'CREATED_DATE' => date('Y-m-d H:i:s'),
							'SHAREPRICES_NAME_ID' => $getSNid
					));
					
					//insert shareprices log
					$this->_modelLog->insert(array(
							'DATE'=> $posts['data']['DATE'],
							'SHAREPRICES_NAME' => $temp[0],
							'VALUE_BEFORE' => 0,
							'VALUE_AFTER' => $posts['data'][$temp[0]],
							'CREATED_DATE' => date('Y-m-d H:i:s'),
							'SHAREPRICES_NAME_ID' => $getSNid
					));
				}
			}
		}
		catch (Exception $e) {
			$this->_error_code = $e->getCode();
			$this->_error_message = $e->getMessage();
			$this->_success = false;
		}
		MyIndo_Tools_Return::JSON($this->_data, $this->_error_code, $this->_error_message, $this->_success);
	}
	
	public function detailAction ()
	{
		
		$searchModel = new Application_Model_Shareprices();
		$getSdate = explode('T', $this->_posts['START_DATE']);
		$getEdate = explode('T', $this->_posts['END_DATE']);
		
		if ($searchModel->isExistByKey('SHAREPRICES_NAME', $this->_posts['SHAREPRICES_NAME'])){
			$listSearch = $searchModel->select()
			->where('SHAREPRICES_NAME = ?' ,$this->_posts['SHAREPRICES_NAME'])
			->where('DATE >= ?' ,$getSdate[0])
			->where('DATE <= ?' ,$getEdate[0]);
			
			$list = $listSearch->query()->fetchall();
		} 
		
		$data = array(
				'data' => array(
						'items' => $list,
						'totalCount' => count($list)
				)
		);
		MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}
	
	public function uploadAction()
	{
		try {
			/* File upload process */
			$upload = new Zend_File_Transfer_Adapter_Http();
			$upload->setDestination(APPLICATION_PATH . '/../public/upload/shareprices');
			$upload->addValidator('Extension', false, 'xls,xlsx');

			if($upload->isValid()) {

				$upload->receive();
				$fileInfo = $upload->getFileInfo();

				/* Get file extension */
				$filExt = explode('.',$fileInfo['FILE']['name']);
				$filExt = '.' . strtolower($filExt[count($filExt)-1]);
				/* End of : Get file extension */
				
				/* Rename file */
				$new_name = microtime() . $filExt ;
				rename($upload->getDestination() . '/' . $fileInfo['FILE']['name'], $upload->getDestination() . '/' . $new_name);
				/* End of : Rename file */

				/* Read File */
				try {

					$inputFileName = $upload->getDestination() . '/' . $new_name;
					$inputFileType = PHPExcel_IOFactory::identify($inputFileName);
					$objReader = PHPExcel_IOFactory::createReader($inputFileType);
					$objReader->setReadDataOnly(true);
					$objPHPExcel = $objReader->load($inputFileName);

					$objWorksheet = $objPHPExcel->getActiveSheet();

					$highestRow = $objWorksheet->getHighestRow();
					$highestColumn = $objWorksheet->getHighestColumn();
					$highestColumnIndex = PHPExcel_Cell::columnIndexFromString($highestColumn);

					$headingsArray = $objWorksheet->rangeToArray('A1:'.$highestColumn.'1',null, true, true, true);
					$heads = array();
					foreach($headingsArray[1] as $k=>$d) {
						$heads[] = $d;
					}

					$_dtFromExcel = array();
					$_dtIdx = 0;

					for($row = 2; $row <= $highestRow; ++$row) {
						
						for($col = 0; $col < $highestColumnIndex; ++$col) {
							$cell = $objWorksheet->getCellByColumnAndRow($col, $row);
							if($col == 0) {
								$ts = mktime(0,0,0,1,$cell->getValue()-1,1900);
								$_tempts = date("Y-m-d",$ts);
								$_dtFromExcel[$_tempts] = array();
							} else {
								$_dtFromExcel[$_tempts][$heads[$col]] = $cell->getValue();
							}
						}

						$_dtIdx++;

					}
					//print_r($_dtFromExcel);die;

					/* Add Shareprices Name */
					$spName = new Application_Model_SharepricesName();
					$this->_model2 = new MyIndo_Ext_ContentColumns();
					$this->_model3 = new MyIndo_Ext_ModelFields();
					$changed = false;
					foreach($heads as $k=>$d) {
						if(strtolower($d) != 'date') {
							if(!$spName->isExistByKey('SHAREPRICES_NAME', $d)) {
								$changed = true;
								$id = $this->_model3->insert(array(
									'MODEL_ID' => 6,
									'NAME' => $d,
									'TYPE' => 'float',
									'CREATED_DATE' => $this->_date
								));
								$spName->insert(array(
									'SHAREPRICES_NAME_ID' => $id,
									'SHAREPRICES_NAME'=> $d,
									'CREATED_DATE' => $this->_date
									));
								$this->_model2->insert(array(
									'CONTENT_COLUMN_ID' => $id,
									'CONTENT_ID' => 6,
									'TEXT' => $d,
									'DATAINDEX' => $d,
									'DATATYPE' => 'float',
									'ALIGN' => 'center',
									'WIDTH' => '100',
									'EDITABLE' => 1,
									'FLEX' => 1,
									'INDEX' => 0,
									'CREATED_DATE' => $this->_date
								));
							}
						}
					}
					/* End of : Add Shareprices Name */

					/* Update for empty value */
					$spNameList = $spName->getList();
					$spList = $this->_model->getList();
					$spListArr = array();
					$_temp = '';
					foreach($spList as $k=>$d) {
						if($_temp == '') {
							$_temp = $d['DATE'];
						}
						if($_temp != $d['DATE']) {
							$_temp = $d['DATE'];
						}
						$spListArr[$_temp][$d['SHAREPRICES_NAME']] = $d['VALUE'];
					}
					//print_r($spListArr);die;
					$spNameArr = array();
					foreach($spNameList as $k=>$d) {
						/* SpName Array */
						if(!isset($spNameArr[$d['SHAREPRICES_NAME']])) {
							$spNameArr[$d['SHAREPRICES_NAME']] = $d['SHAREPRICES_NAME_ID'];
						}
						/* End of : SpName Array */
					}
					if($changed) {
						foreach($spList as $_k=>$_d) {
							foreach($spNameList as $k=>$d) {

								$q = $this->_model->select()
								->where('DATE = ?', $_d['DATE'])
								->where('SHAREPRICES_NAME = ?', $d['SHAREPRICES_NAME']);
								$_x = $q->query()->fetchAll();
								if(count($_x) == 0) {

									$_gSid = $spName->getPkByKey('SHAREPRICES_NAME', $d['SHAREPRICES_NAME']);

									$this->_model->insert(array(
										'DATE'=> $_d['DATE'],
										'SHAREPRICES_NAME' => $d['SHAREPRICES_NAME'],
										'VALUE' => 0,
										'CREATED_DATE' => date('Y-m-d H:i:s'),
										'SHAREPRICES_NAME_ID' => $_gSid
										));

									$this->_modelLog->insert(array(
										'DATE'=> $_d['DATE'],
										'SHAREPRICES_NAME' => $d['SHAREPRICES_NAME'],
										'VALUE_BEFORE' => 0,
										'VALUE_AFTER' => 0,
										'CREATED_DATE' => date('Y-m-d H:i:s'),
										'SHAREPRICES_NAME_ID' => $_gSid
									));

								}
							}
						}
					}
					/* End of : Update for empty value */
					
					/* Insert data from excel to database */
					foreach($_dtFromExcel as $k=>$d) {
						if(!$this->_model->isExistByKey('DATE', $k)) {
							foreach($_dtFromExcel[$k] as $_k=>$_d) {
								$getSNid = $spNameArr[$_k];

								//insert shareprices
								$this->_model->insert(array(
										'DATE'=> $k,
										'SHAREPRICES_NAME' => $_k,
										'VALUE' => $_d,
										'CREATED_DATE' => $this->_date,
										'SHAREPRICES_NAME_ID' => $getSNid
								));
								//insert shareprices log
								$this->_modelLog->insert(array(
										'DATE'=> $k,
										'SHAREPRICES_NAME' => $_k,
										'VALUE_BEFORE' => 0,
										'VALUE_AFTER' => $_d,
										'CREATED_DATE' => $this->_date,
										'SHAREPRICES_NAME_ID' => $getSNid
								));
							}
						} else {
							foreach($_dtFromExcel[$k] as $_k=>$_d) {
								
								if($spListArr[$k][$_k] != $_d) {
									// get value before log
									$_q = $this->_modelLog->select()
									->where('SHAREPRICES_NAME = ?', $_k)
									->order('CREATED_DATE DESC')
									->limit(1, 0);
									$_qRes = $_q->query()->fetch();

									$valbef = $_qRes['VALUE_AFTER'];
									$_gSid = $spNameArr[$_k];

									$_qSp = $this->_model->select()
									->where('DATE = ?', $k)
									->where('SHAREPRICES_NAME = ?', $_k)
									->limit(1,0);
									$_resQsp = $_qSp->query()->fetch();

									$this->_model->update(array(
											'VALUE' => $_d
									), $this->_model->getAdapter()->quoteInto('SHAREPRICES_ID = ?', $_resQsp['SHAREPRICES_ID']));
									
									$this->_modelLog->insert(array(
										'DATE'=> $k,
										'SHAREPRICES_NAME' => $_k,
										'VALUE_BEFORE' => $valbef,
										'VALUE_AFTER' => $_d,
										'CREATED_DATE' => date('Y-m-d H:i:s'),
										'SHAREPRICES_NAME_ID' => $_gSid
									));
								}
							}
						}
					}
					
					/* End of : Insert data from excel to database */
					unlink($inputFileName);
				}catch(Exception $e) {
					$this->_error_code = $e->getCode();
					$this->_error_message = $e->getMessage();
					$this->_success = false;
				}

			} else {
				$this->_error_code = 902;
				$this->_error_message = MyIndo_Tools_Error::getErrorMessage($this->_error_code);
				$this->_success = false;
			}
		}catch(Exception $e) {
			$this->_error_code = $e->getCode();
			$this->_error_message = $e->getMessage();
			$this->_success = false;
		}

		MyIndo_Tools_Return::JSON($this->_data, $this->_error_code, $this->_error_message, $this->_success);
	}
	
	public function searchAction ()
	{		
		if($this->isAjax() && $this->isPost()) {
			if(isset($this->_posts['SP_START_DATE']) && isset($this->_posts['SP_END_DATE']) && isset($this->_posts['SP_NAMES'])) {
				$s_date = $this->_posts['SP_START_DATE'];
				$e_date = $this->_posts['SP_END_DATE'];
				$names = Zend_Json::decode($this->_posts['SP_NAMES']);
				
				$q = $this->_model->select()
				->where('DATE >= ?', $s_date)
				->where('DATE <= ?', $e_date);
				
				$data = $q->query()->fetchAll();
				
				$list = array();
				$t = '';
				$i = -1;
				foreach($data as $k=>$d) {
					if($t != $d['DATE']) {
						$i++;
						$t = $d['DATE'];
					}
					$list[$i]['DATE'] = $d['DATE'];
					foreach($names as $_k=>$_d) {
						if($d['SHAREPRICES_NAME'] == $_d) {
							$list[$i][$d['SHAREPRICES_NAME']] = $d['VALUE'];
						}
					}
					foreach($names as $_k=>$_d) {
						if(!isset($list[$i][$_d])) {
							$list[$i][$_d] = 0;
						}
					}
				}
				$this->_data['data']['items'] = $list;
				$this->_data['data']['names'] = $names;
				$this->_data['data']['totalCount'] = $i+1;
			}
		}
		MyIndo_Tools_Return::JSON($this->_data, $this->_error_code, $this->_error_message, $this->_success);
	}
	
	
}