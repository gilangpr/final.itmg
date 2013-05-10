<?php 

class Shareholdings_RequestController extends MyIndo_Controller_Action
{
	protected $_model;
	protected $_limit;
	protected $_start;
	protected $_offset;
	protected $_posts;
	protected $_error_code;
	protected $_error_message;
	protected $_success;
	protected $_data;
	
	public function init()
	{
		$this->getInit();
		$this->_model = new Application_Model_Shareholdings();
	}
	
	public function createAction()
	{
		
		$data = array(
				'data' => array()
				);
		if($this->_model->isExistByKey('INVESTOR_NAME', $this->_posts['INVESTOR_NAME'])) {
			
			$this->_success = false;
			$this->_error_message = 'Investor Name already exist.';
		} else {
			try {
				$shareAmount = new Application_Model_ShareholdingAmounts();
				$status = new Application_Model_InvestorStatus();
				$SID = $status->getPkByKey('INVESTOR_STATUS', $this->_posts['INVESTOR_STATUS']); 					// Do insert query :
				$id = $this->_model->insert(array(
 					'INVESTOR_NAME'=> $this->_posts['INVESTOR_NAME'],
 					'INVESTOR_STATUS_ID'=> $SID,
 					'ACCOUNT_HOLDER'=> $this->_posts['ACCOUNT_HOLDER'],
 					'CREATED_DATE' => date('Y-m-d H:i:s')
 				));
				$shareAmount->insert(array(
						'SHAREHOLDING_ID'=> $id,
						'AMOUNT'=> 0,
						'CREATED_DATE' => date('Y-m-d H:i:s'),
						'DATE' => date('Y-m-d')
						));
 			}catch(Exception $e) {
 				$this->_error_code = $e->getCode();
 				$this->_error_message = $e->getMessage();
 				$this->_success = false;
 			}
		}

		MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}
	
	public function amountAction()
	{
		$data = array(
				'data' => array()
		);
		
		try {		
			$shareholder_id = $this->_model->getValueByKey('INVESTOR_NAME', $this->_posts['INVESTOR_NAME'], 'SHAREHOLDING_ID');
			$table = new Application_Model_ShareholdingAmounts();
			$Amount = $table->getValueByKey('SHAREHOLDING_ID', $shareholder_id, 'AMOUNT');
			if ($Amount != 0) {	
				$table->insert(array(
						'SHAREHOLDING_ID' => $shareholder_id,
						'AMOUNT' => $this->_posts['AMOUNT'],
						'CREATED_DATE' => date('Y-m-d H:i:s'),
						'DATE' => $this->_posts['DATE']
				));
			} else {
				$table->update(array(
						'AMOUNT' => $this->_posts['AMOUNT'],
						'DATE' => $this->_posts['DATE']
				),$table->getAdapter()->quoteInto('SHAREHOLDING_ID = ?', $shareholder_id));
			}
		}catch(Exception $e) {
			$this->_error_code = $e->getCode();
			$this->_error_message = $e->getMessage();
			$this->_success = false;
		}
		MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}
	
	public function updateAction()
	{

		$data = array(
				'data' => array()
		);

		$data = $this->getRequest()->getRawBody();
		$data = Zend_Json::decode($data);
		$id = $data['data']['SHAREHOLDING_ID'];
 		
		try {
			$status = new Application_Model_InvestorStatus();
			if(!$this->_model->isExistByKey('INVESTOR_NAME', $data['data']['INVESTOR_NAME'])){
				$val = $status->getPkByKey('INVESTOR_STATUS', $data['data']['INVESTOR_STATUS']);
				$this->_model->update(array(
						'INVESTOR_NAME' => $data['data']['INVESTOR_NAME'],
						'INVESTOR_STATUS_ID' => $val,
						'ACCOUNT_HOLDER' => $data['data']['ACCOUNT_HOLDER'],
				),$this->_model->getAdapter()->quoteInto('SHAREHOLDING_ID = ?', $id));
			} else {
				
				$this->_error_message = 'Data Being Used';
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
		if($this->isPost() && $this->isAjax()) {
			$mShareholdingAmounts = new Application_Model_ShareholdingAmounts();
			
			/* Get Max Date */
			$q = $mShareholdingAmounts->select()
			->from('SHAREHOLDING_AMOUNTS', array('MAX(DATE) AS DATE'));
			$r = $q->query()->fetch();
			$max_date = (isset($r['DATE'])) ? $r['DATE'] : '';
			/* End of : Get Max Date */

			if($max_date != '' && !empty($max_date)) {
				
				try {
					$q = $mShareholdingAmounts->select()
					->setIntegrityCheck(false)
					->from('SHAREHOLDING_AMOUNTS', array('DATE','AMOUNT'))
					->join('SHAREHOLDINGS', 'SHAREHOLDINGS.SHAREHOLDING_ID = SHAREHOLDING_AMOUNTS.SHAREHOLDING_ID', array('SHAREHOLDING_ID','INVESTOR_NAME','INVESTOR_STATUS_ID','ACCOUNT_HOLDER','CREATED_DATE','MODIFIED_DATE'))
					->join('INVESTOR_STATUS', 'SHAREHOLDINGS.INVESTOR_STATUS_ID = INVESTOR_STATUS.INVESTOR_STATUS_ID',array('INVESTOR_STATUS'))
					->where('SHAREHOLDING_AMOUNTS.DATE = ?', $max_date);

					$resTotal = $q->query()->fetchAll();

					/* Get total */
					$sum = 0;
					foreach($resTotal as $k=>$d) {
						$sum += $d['AMOUNT'];
					}
					$totalCount = count($resTotal);

					if(isset($this->_posts['sort'])) {
						$sort = Zend_Json::decode($this->_posts['sort']);
						if($sort[0]['property'] != 'PERCENTAGE') {
							$q->order($sort[0]['property'] . ' ' . $sort[0]['direction']);
						}
					}
					$q->limit($this->_limit, $this->_start);
					$list = $q->query()->fetchAll();

					foreach($list as $k=>$d) {
						$list[$k]['PERCENTAGE'] = number_format(($d['AMOUNT'] / $sum) * 100,2);
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

					$idx = count($list);
					$list[$idx]['ACCOUNT_HOLDER'] = '<strong>TOTAL</strong>';
					$list[$idx]['AMOUNT'] = $sum;
					$list[$idx]['PERCENTAGE'] = 100;

					$this->_data['data']['items'] = $list;
					$this->_data['data']['totalCount'] = $totalCount;

				} catch(Exception $e) {
					$this->_error_code = $e->getCode();
					$this->_error_message = $e->getMessage();
					$this->_success = false;
				}

			}
		} else {

			$this->error(901);

		}
		$this->json();
	}
	
	public function destroyAction()
	{
		$data = array(
				'data' => array()
		);
		try {
			$delAmount = new Application_Model_ShareholdingAmounts();
			
			$id = $this->_posts['SHAREHOLDING_ID'];
			$where = $delAmount->getAdapter()->quoteInto('SHAREHOLDING_ID = ?', $id);
			$delAmount->delete($where);
			 			$this->_model->delete(
			 					$this->_model->getAdapter()->quoteInto(
			 							'SHAREHOLDING_ID = ?', $this->_posts['SHAREHOLDING_ID']
		 							));
			}
			catch(Exception $e) {
			$this->_error_code = $e->getCode();
			$this->_error_message = $e->getMessage();
			$this->_success = false;
		}
		MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}
	
	public function getListAmountAction()
	{

		$modelSA = new Application_Model_ShareholdingAmounts();
		$list = $modelSA->getListByKey('SHAREHOLDING_ID', $this->_posts['id']);
		
		$data = array(
				'data' => array(
						'items' => $list,
						'totalCount' => count($list)
				)
		);
		MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}
	
	public function desAction()
	{
		$data = array(
				'data' => array()
		);
		
		try {				
			$modelSA = new Application_Model_ShareholdingAmounts();
		    $id = $this->_posts['id'];
			$where = $modelSA->getAdapter()->quoteInto(
							'SHAREHOLDING_AMOUNT_ID = ?', $id
					);
			$modelSA->delete($where);
			
		} catch (Exception $e) {
			
			$this->_error_code = $e->getCode();
			$this->_error_message = $e->getMessage();
			$this->_success = false;
		}
		MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}
	
	public function upamountAction()
	{
		$data = array(
				'data' => array()
		);

	    $models = new Application_Model_ShareholdingAmounts();
		$data = $this->getRequest()->getRawBody();
		$data = Zend_Json::decode($data);
		$id = $data['data']['SHAREHOLDING_AMOUNT_ID'];
	
		try {
			
			$models->update(array(
					'AMOUNT' => $data['data']['AMOUNT']
			),$models->getAdapter()->quoteInto('SHAREHOLDING_AMOUNT_ID = ?', $id));
			
		}catch(Exception $e) {
			$this->_error_code = $e->getCode();
			$this->_error_message = $e->getMessage();
			$this->_success = false;
		}
	
		MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}
	
	public function uploadAction()
	{
	
		$data = array(
				'data' => array()
		);
		try{
			$upload = new Zend_File_Transfer_Adapter_Http();
			$upload->setDestination(APPLICATION_PATH . '/../public/upload');
			$upload->addValidator('Extension',false,'xls,xlsx');
	
			if ($upload->isValid()) {
				$upload->receive();
				$fileInfo = $upload->getFileInfo();
				$filExt = explode('.', $fileInfo['FILE']['name']);
				$filExt = explode('_', $fileInfo['FILE']['name']);
				$date = explode('.', $filExt[2]);

				/* Get file extension */
				$filExt = explode('.',$fileInfo['FILE']['name']);
				$filExt = '.' . strtolower($filExt[count($filExt)-1]);
				/* End of : Get file extension */
	
				/* Rename file */
				$new_name = microtime() . $filExt ;
				rename($upload->getDestination() . '/' . $fileInfo['FILE']['name'], $upload->getDestination() . '/' . $new_name);
				/* End of : Rename file */
				//}
	
				try
				{
					$inputFileName = $upload->getDestination() . '/' . $new_name;
					$inputFileType = PHPExcel_IOFactory::identify($inputFileName);
					$objReader = PHPExcel_IOFactory::createReader($inputFileType);
					$objReader->setReadDataOnly(true);
					$objPHPExcel = $objReader->load($inputFileName);
					$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, $inputFileType);
					$objWriter->setPreCalculateFormulas(false);
					$sum = 0;
					foreach ($objPHPExcel->getWorksheetIterator() as $worksheet) {
						$worksheetTitle = $worksheet->getTitle();
						$highestRow = $objPHPExcel->setActiveSheetIndex(0)->getHighestRow();
						$highestColumn = $objPHPExcel->setActiveSheetIndex(0)->getHighestColumn();
						$nrColumns = ord($highestColumn) - 64;
	
						$highestColumn++;
						for ($row = 2; $row < $highestRow + 1; $row++) {
	
							$val=array();
							for ($col = 'B'; $col != $highestColumn; $col++) {
								$val[] = $objPHPExcel->setActiveSheetIndex(0)->getCell($col . $row)->getValue();
								
							};
							error_log(print_r($val,1),3,'/tmp/test.log');
							/* START STATUS TABEL INPUT */
							$status = new Application_Model_InvestorStatus();
							//if(!is_null($val[0])){
							if(!empty($val[0]) && $val[0] != '') {
								if (!$status->isExistByKey('INVESTOR_STATUS', $val[1])) {
									$Sid = $status->insert(array (
											'INVESTOR_STATUS' => $val[1],
											'CREATED_DATE' => date('Y-m-d H:i:s')
									));
								} else {
									$Sid = $status->getPkByKey('INVESTOR_STATUS', $val[1]);
									$status->update(array(
											'INVESTOR_STATUS' => $val[1]
									),$status->getAdapter()->quoteInto('INVESTOR_STATUS_ID = ?', $Sid));
								}
							}
							/* END EXECUTE */
							if(!empty($val[0]) && $val[0] != '') {
								// $query = $status->select()
								// ->where('INVESTOR_STATUS = ?', $val[1]);
								$bad_symbols = array("├");
								$val[0] = str_replace($bad_symbols, "", $val[0]);
								if(!$this->_model->isExistByKey('INVESTOR_NAME', strtoupper($val[0]))) {
									//if ($query->query()->rowCount() > 0) {
									$id = $this->_model->insert(array(
											'INVESTOR_NAME' => $val[0],
											'INVESTOR_STATUS_ID' => $Sid,
											'ACCOUNT_HOLDER' => $val[2],
											'CREATED_DATE' => date('Y-m-d H:i:s')
									));
								} else {
									$Uid = $status->getPkByKey('INVESTOR_STATUS', $val[1]);
									$id = $this->_model->getPkByKey('INVESTOR_NAME', $val[0]);
									$this->_model->update(array(
											'INVESTOR_STATUS_ID' => $Uid,
											'ACCOUNT_HOLDER' => $val[2]
									),$this->_model->getAdapter()->quoteInto('SHAREHOLDING_ID = ?', $id));
									//}
								}
							}
	
							$modelAmount = new Application_Model_ShareholdingAmounts();
	
							if(!empty($val[0]) && $val[0] != '') {
								$id = $this->_model->getPkByKey('INVESTOR_NAME', $val[0]);
								/*--Search And Update from Two Table--*/
								$query = $modelAmount->select()
								->where('SHAREHOLDING_ID = ?', $id)
								->where('DATE = ?', $date[0]);
								$_x = $query->query()->fetchAll();
								if (count($_x) > 0) {
									$bad_symbols = array(",", ".");
                                    $val[3] = str_replace($bad_symbols, "", $val[3]);
									$modelAmount->update(array(
											'AMOUNT' => $val[3]
									), array(
											$modelAmount->getAdapter()->quoteInto('SHAREHOLDING_ID = ?', $id),
											$modelAmount->getAdapter()->quoteInto('DATE = ?', $date[0])
									));
								} else {
									$modelAmount->insert(array(
											'SHAREHOLDING_ID' => $id,
											'AMOUNT' => $val[3],
											'CREATED_DATE' => date('Y-m-d H:i:s'),
											'DATE' => $date[0]
									));
								}
								$sum += $val[3];
							}
						}
					}
					/* End of : Insert data from excel to database */
					unlink($inputFileName);
					$this->_error_message = 'Data successfully uploaded. Total data = ' . number_format($sum);
				} catch (Exception $e) {
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
	
		MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}
	
 	public function searchAction()
 	{		
 		$modelSearch = new Application_Model_ShareholdingAmounts();
 		$start_date = explode('T',$this->_posts['START_DATE']);
 		$end_date = explode('T',$this->_posts['END_DATE']);
        
        
 		if(isset($this->_posts['INVESTOR_NAME'])) {
 			if($this->_model->isExistByKey('INVESTOR_NAME', $this->_posts['INVESTOR_NAME'])) {
 				$ID = $this->_model->getPkByKey('INVESTOR_NAME', $this->_posts['INVESTOR_NAME']);
 				
 		         $list = $modelSearch->select()
 		         ->setIntegrityCheck(false)
 		         ->from('SHAREHOLDING_AMOUNTS', array('*'))		         
 		         ->where('SHAREHOLDINGS.SHAREHOLDING_ID = ?', $ID)
 		         ->where('DATE >= ?',  $start_date[0])
 		         ->where('DATE <= ?',  $end_date[0])
 		         ->join('SHAREHOLDINGS','SHAREHOLDINGS.SHAREHOLDING_ID = SHAREHOLDING_AMOUNTS.SHAREHOLDING_ID', array('*'));
 		         
 			} else {
 				$list = $modelSearch->select()
 				->setIntegrityCheck(false)
 				->from('SHAREHOLDING_AMOUNTS', array('*'))
 				->where('DATE >= ?',  $start_date[0])
 				->where('DATE <= ?',  $end_date[0])
 		        ->join('SHAREHOLDINGS','SHAREHOLDINGS.SHAREHOLDING_ID = SHAREHOLDING_AMOUNTS.SHAREHOLDING_ID', array('*'));
 			}
 		}
 		         $list = $list->query()->fetchAll();
 		         $data = array(
 		         		'data' => array(
 		         				'items' => $list,
 		         				'totalCount' => count($list)
 		         		)
 		         );
 		         
 		         MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
 	}
 	
 	public function autocomAction() 
 	{
 		if ($this->_posts['query'] == '') {
 			
 			$data = array(
 					'data' => array(
 							'items' => $this->_model->getListLimit($this->_limit, $this->_start, 'INVESTOR_NAME ASC'),
 							'totalCount' => $this->_model->count()
 							)
 					);
 		} else {
 			$data = array(
 					'data' => array(
 							'items' => $this->_model->getAllLike($this->_posts['query'], $this->_limit, $this->_start),
 							'totalCount' => $this->_model->count()
 					)
 			);
 		}
 		
 		MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
 	}
}
