<?php 

class Investors_RequestController extends MyIndo_Controller_Action
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
		$this->getInit();
		$this->_model = new Application_Model_Investors();
	}

	public function createAction()
	{
		$data = array(
			'data' => array()
		);
		
		try {
			// Insert Data :
 			$this->_model->insert(array(
					'INVESTOR_TYPE_ID'=>$this->_posts['INVESTOR_TYPE_ID'],
					'LOCATION_ID'=>$this->_posts['LOCATION_ID'],
 					'COMPANY_NAME'=> $this->_posts['COMPANY_NAME'],
					'STYLE'=> $this->_posts['STYLE'],
					'EQUITY_ASSETS'=>$this->_posts['EQUITY_ASSETS'],
					'PHONE_1'=>$this->_posts['PHONE_1'],
					'PHONE_2'=>$this->_posts['PHONE_2'],
					'FAX'=>$this->_posts['FAX'],
					'EMAIL_1'=>$this->_posts['EMAIL_1'],
					'EMAIL_2'=>$this->_posts['EMAIL_2'],
					'WEBSITE'=>$this->_posts['WEBSITE'],
					'ADDRESS'=>$this->_posts['ADDRESS'],
					'COMPANY_OVERVIEW'=>$this->_posts['COMPANY_OVERVIEW'],
					'INVESTMENT_STRATEGY'=>$this->_posts['INVESTMENT_STRATEGY'],
 					'CREATED_DATE' => date('Y-m-d H:i:s')
 					));
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
		
		$data = $this->getRequest()->getRawBody();//mengambil data json
		$data = Zend_Json::decode($data);//merubah data json menjadi array
		$id = $data['data']['INVESTOR_ID'];
		
		try {
			$ITmodel = new Application_Model_InvestorType();//memanggil model Investor type
			$LOmodel = new Application_Model_Locations();//memanggil model Locations
			$IT_id = $ITmodel->getPkByKey('INVESTOR_TYPE', $data['data']['INVESTOR_TYPE']);//mengambi PK Investor Type
			$LO_id = $LOmodel->getPkByKey('LOCATION', $data['data']['LOCATION']);//mengambil PK Locations
			$this->_model->update(array(
					'COMPANY_NAME' => $data['data']['COMPANY_NAME'],
					'INVESTOR_TYPE_ID' => $IT_id,
					'LOCATION_ID' => $LO_id,
					'EQUITY_ASSETS' => $data['data']['EQUITY_ASSETS'],
					'STYLE' => $data['data']['STYLE']
					),$this->_model->getAdapter()->quoteInto('INVESTOR_ID = ?', $id));
			//$this->_model->update(array(
			//		'MODIFIED_DATE' =>date('Y-m-d H:i:s')
			//	));
			
		}catch(Exception $e) {
			$this->_error_code = $e->getCode();
			$this->_error_message = $e->getMessage();
			$this->_success = false;
		}
		
		MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}
	public function readAction()
	{
		$data = array(
				'data' => array(
						'items' => array(),
						'totalCount' => 0
						)
				);
		
		if(!isset($this->_posts['TYPE'])) {
			if(!isset($this->_posts['sort'])) {
				if(!isset($this->_posts['query'])) {
					$list = $this->_model->getListInvestorsLimit($this->_limit, $this->_start);
					$count = $this->_model->count();
				} else {
					$q = $this->_model->select()
					->from('INVESTORS', array('INVESTOR_ID','COMPANY_NAME'))
					->where('COMPANY_NAME LIKE ?', '%' . $this->_posts['query'] . '%');
					$count = count($q->query()->fetchAll());

					$q->limit($this->_limit, $this->_start);
					$list = $q->query()->fetchAll();
					foreach($list as $k=>$d) {
						//$list[$k]['COMPANY_OVERVIEW'] = utf8_encode($d['COMPANY_OVERVIEW']);
						//$list[$k]['INVESTMENT_STRATEGY'] = utf8_encode($d['INVESTMENT_STRATEGY']);
					}
				}
				$data = array(
					'data' => array(
						'items' => $list,
						'totalCount' => $this->_model->count()
					)
				);
			} else {
				try {
					$sort = Zend_Json::decode($this->_posts['sort']);
					$q = $this->_model->select()
					->setIntegrityCheck(false)
					->from('INVESTORS', array('*'))
					->join('INVESTOR_TYPE', 'INVESTOR_TYPE.INVESTOR_TYPE_ID = INVESTORS.INVESTOR_TYPE_ID', array('INVESTOR_TYPE'))
					->join('LOCATIONS', 'LOCATIONS.LOCATION_ID = INVESTORS.LOCATION_ID', array('LOCATION'))
					->limit($this->_limit, $this->_start);
					if($sort[0]['property'] == 'INVESTOR_TYPE') {
						$q->order('INVESTOR_TYPE.' . $sort[0]['property'] . ' ' . $sort[0]['direction']);
					} else if($sort[0]['property'] == 'LOCATION') {
						$q->order('LOCATIONS.' . $sort[0]['property'] . ' ' . $sort[0]['direction']);
					} else {
						$q->order('INVESTORS.' . $sort[0]['property'] . ' ' .$sort[0]['direction']);
					}
					//echo $q;die;
					$list = $q->query()->fetchAll();
					foreach($list as $k=>$d) {
						$list[$k]['COMPANY_OVERVIEW'] = utf8_encode($d['COMPANY_OVERVIEW']);
						$list[$k]['INVESTMENT_STRATEGY'] = utf8_encode($d['INVESTMENT_STRATEGY']);
					}
					$data['data']['items'] = $list;
					$data['data']['totalCount'] = $this->_model->count();
				}catch(Exception $e) {
					echo $e->getMessage();
				}
			}
		} else {
			
			// Search :
			$TYPE = 'List';
			
			$q = $this->_model->select()->setIntegrityCheck(false)
			->from('INVESTORS', array('*'));
			
			if(isset($this->_posts['COMPANY_NAME'])) {
				$q->where('COMPANY_NAME LIKE ?', '%' . $this->_posts['COMPANY_NAME'] . '%');
			}
			
			if(isset($this->_posts['CONTACT_PERSON'])) {
				$modelCT = new Application_Model_Contacts();
				
				if($this->_posts['CONTACT_PERSON'] != '') {
					$q->join('CONTACTS', 'CONTACTS.INVESTOR_ID = INVESTORS.INVESTOR_ID', array('*'));
					$q->where('CONTACTS.NAME LIKE ?', '%' . $this->_posts['CONTACT_PERSON'] . '%');
				}
			}
			
			if(isset($this->_posts['EQUITY_ASSETS'])) {
				$EQUITY_ASSETS = $this->_posts['EQUITY_ASSETS'];
				$EQmodel = new Application_Model_Equityasset();
				if($EQUITY_ASSETS != '' && !empty($EQUITY_ASSETS) && $EQUITY_ASSETS != 'All') {
					$min = $EQmodel->getValueByKey('EQUITY_TYPE', $EQUITY_ASSETS, 'MIN_VALUE');
					$max = $EQmodel->getValueByKey('EQUITY_TYPE', $EQUITY_ASSETS, 'MAX_VALUE');
				} else {
					$min = 0;
					// max cari dari investor yang equity asset paling gede brapa;
					$max = 999999999;
				}
				if(strtolower($EQUITY_ASSETS) == 'small') {
					$q->where("EQUITY_ASSETS >= $min AND EQUITY_ASSETS <= $max");
				}else if(strtolower($EQUITY_ASSETS) == 'medium') {
					$q->where("EQUITY_ASSETS >= $min AND EQUITY_ASSETS <= $max");
				} else if(strtolower($EQUITY_ASSETS) == 'large'){
					$q->where("EQUITY_ASSETS >= $min AND EQUITY_ASSETS <= $max");
				} else {
					$q->where('EQUITY_ASSETS >= 0');
				}
				
				/*
				if(strtolower($EQUITY_ASSETS) == 'small') {
					$q->where('EQUITY_ASSETS >= 0 AND EQUITY_ASSETS <= 20');
				}else if(strtolower($EQUITY_ASSETS) == 'medium') {
					$q->where('EQUITY_ASSETS >= 21 AND EQUITY_ASSETS <= 40');
				} else if(strtolower($EQUITY_ASSETS) == 'large'){
					$q->where('EQUITY_ASSETS >= 41');
				} else {
					$q->where('EQUITY_ASSETS >= 0');
				}
				//*/
			}
			
			if(isset($this->_posts['INVESTOR_TYPE'])) {
				$modelIT = new Application_Model_InvestorType();
				if($modelIT->isExistByKey('INVESTOR_TYPE', $this->_posts['INVESTOR_TYPE'])) {
					$id = $modelIT->getPkByKey('INVESTOR_TYPE', $this->_posts['INVESTOR_TYPE']);
					$q->where('INVESTORS.INVESTOR_TYPE_ID = ?', $id);
					$q->join('INVESTOR_TYPE', 'INVESTOR_TYPE.INVESTOR_TYPE_ID = INVESTORS.INVESTOR_TYPE_ID', array('*'));
				} else {
					$q->join('INVESTOR_TYPE', 'INVESTOR_TYPE.INVESTOR_TYPE_ID = INVESTORS.INVESTOR_TYPE_ID', array('*'));
				}
			}
			
			if(isset($this->_posts['LOCATION'])) {
				$modelLC = new Application_Model_Locations();
				if($modelLC->isExistByKey('LOCATION', $this->_posts['LOCATION'])) {
					$id = $modelLC->getPkByKey('LOCATION', $this->_posts['LOCATION']);
					$q->where('INVESTORS.LOCATION_ID = ?', $id);
					$q->join('LOCATIONS', 'INVESTORS.LOCATION_ID = LOCATIONS.LOCATION_ID', array('*'));
				} else {
					$q->join('LOCATIONS', 'INVESTORS.LOCATION_ID = LOCATIONS.LOCATION_ID', array('*'));
				}
			}
			
			/* Model */
			
			/* End of : Models */
			$x = $q->query()->fetchAll();
			
			$data['data']['items'] = $x;
			$data['data']['totalCount'] = count($x);
			$data['data']['CONTACT_PERSON'] = $this->_posts['CONTACT_PERSON'];
			
		}
	
		MyIndo_Tools_Return::JSON($data);
	}
	
	public function destroyAction(){
		$data = array(
				'data' => array()
				);
		try {
 			$this->_model->delete(
 					$this->_model->getAdapter()->quoteInto(
 							'INVESTOR_ID = ?', $this->_posts['INVESTOR_ID']
 							));
		}catch(Exception $e) {
			$this->_error_code = $e->getCode();
			$this->_error_message = $e->getMessage();
			$this->_success = false;
		}
		MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}
	public function updateDetailAction()
	{
		$data = array();
		if($this->getRequest()->isPost() && $this->getRequest()->isXmlHttpRequest()&& isset($this->_posts['id']) && isset($this->_posts['type'])) {
			if($this->_model->isExistByKey('INVESTOR_ID', $this->_posts['id'])) {
				try {
					if(isset($this->_posts['batch']) && $this->_posts['batch'] == 1) {
						if($this->_posts['btype'] == 'detail-investor') {
							$modelInvestorType = new Application_Model_InvestorType();
							$_dt = array(
									'INVESTOR_TYPE_ID' => $modelInvestorType->getPkByKey('INVESTOR_TYPE', $this->_posts['INVESTOR_TYPE']),
									'EQUITY_ASSETS' => $this->_posts['EQUITY_ASSETS'],
									'STYLE' => $this->_posts['STYLE']
							);
						} else if($this->_posts['btype'] == 'company-address') {
							$modelLocation = new Application_Model_Locations();
							$_dt = array(
									'ADDRESS' => $this->_posts['ADDRESS'],
									'FAX' => $this->_posts['FAX'],
									'LOCATION_ID' => $modelLocation->getPkByKey('LOCATION', $this->_posts['LOCATION']),
									'PHONE_1' => $this->_posts['PHONE_1'],
									'PHONE_2' => $this->_posts['PHONE_2'],
									'EMAIL_1' => $this->_posts['EMAIL_1'],
									'EMAIL_2' => $this->_posts['EMAIL_2'],
									'WEBSITE' => $this->_posts['WEBSITE']
									);
						}
						$this->_model->update($_dt, $this->_model->getAdapter()->quoteInto('INVESTOR_ID = ?', $this->_posts['id']));
					} else {
						$this->_model->update(array(
								$this->_posts['type'] => $this->_posts[$this->_posts['type']],
								'MODIFIED_DATE' => date('Y-m-d H:i:s')
						),$this->_model->getAdapter()->quoteInto('INVESTOR_ID = ?', $this->_posts['id']));
					}
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
		MyIndo_Tools_Return::JSON($data, $this->_error_code, $this->_error_message, $this->_success);
	}
	public function printAction()
	{	
		$id = $this->_getParam('id',0);
		if($this->_model->isExistByKey('INVESTOR_ID', $id)) {
			$this->_helper->viewRenderer->setNoRender(false);
			//$details = $this->_model->getDetailByKey('INVESTOR_ID', $id);
			$conModel = new Application_Model_Contacts();
			$miModel = new Application_Model_Meetinginvestor();
			$q = $this->_model->select()
				->from('INVESTORS',array('*'))
				->setIntegrityCheck(false)
				->where('INVESTORS.INVESTOR_ID = ?', $id)
				->join('INVESTOR_TYPE', 'INVESTOR_TYPE.INVESTOR_TYPE_ID = INVESTORS.INVESTOR_TYPE_ID', array('INVESTOR_TYPE'))
				->join('LOCATIONS', 'LOCATIONS.LOCATION_ID = INVESTORS.LOCATION_ID', array('LOCATION'));
				//->join('SECTOR_HOLDINGS','SECTOR_HOLDINGS.INVESTOR_ID = INVESTORS.INVESTOR_ID',array('*'));
			$details = $q->query()->fetch();
			$d = $conModel->select()
				->from('CONTACTS',array('*'))
				->setIntegrityCheck(false)
				->where('INVESTOR_ID = ?',$id);
			$con = $d->query()->fetchAll();

			$a = $miModel->select()
				->from('MEETING_ACTIVITIE_INVESTOR',array('*'))
				->setIntegrityCheck(false)
				//->join('INVESTORS','MEETING_ACTIVITIE_INVESTOR.INVESTOR_ID = INVESTORS.INVESTOR_ID',array('*'))
				->join('MEETING_ACTIVITIE', 'MEETING_ACTIVITIE.MEETING_ACTIVITIE_ID = MEETING_ACTIVITIE_INVESTOR.MEETING_ACTIVITIE_ID',array('*'))
				->join('MEETING_ACTIVITIE_CONTACT','MEETING_ACTIVITIE_CONTACT.MEETING_ACTIVITIE_ID = MEETING_ACTIVITIE.MEETING_ACTIVITIE_ID',array('*'))
				->join('CONTACTS','MEETING_ACTIVITIE_CONTACT.CONTACT_ID = CONTACTS.CONTACT_ID',array('*'))
				->join('MEETING_ACTIVITIE_ITM','MEETING_ACTIVITIE_ITM.MEETING_ACTIVITIE_ID = MEETING_ACTIVITIE_INVESTOR.MEETING_ACTIVITIE_ID',array('*'))
				->join('ITM_PARTICIPANTS','MEETING_ACTIVITIE_ITM.PARTICIPANT_ID = ITM_PARTICIPANTS.PARTICIPANT_ID',array('*'))
				->where('MEETING_ACTIVITIE_INVESTOR.INVESTOR_ID= ?', $id)
				->where('CONTACTS.INVESTOR_ID= ?',$id);
			$ma = $a->query()->fetchAll();	


			$this->view->ma = $ma;
			$this->view->con = $con;
			$this->view->details = $details;
			
		} else {
			$this->_helper->viewRenderer->setNoRender(true);
			echo "no data found";
		}
	
		
	}
	
	public function uploadAction()
	{
		$ITModel = new Application_Model_InvestorType();
		$LOModel = new Application_Model_Locations();
		try {
			$upload = new Zend_File_Transfer_Adapter_Http();
			$upload->setDestination(APPLICATION_PATH ."/../public/upload/investors/");
			$upload->addValidator('Extension',false, array('xls','xlsx','case' => true));
			if($upload->isValid()) {
				$upload->receive();
				$fileInfo = $upload->getFileInfo();
				
				$tmp = explode('.', $fileInfo['FILE']['name']);
				$fileName = MyIndo_Tools_Return::makePassword(microtime());
				$fileExt = $tmp[count($tmp)-1];
				$newName = $fileName . '.' . $fileExt;
				
				rename($upload->getDestination() . '/' . $fileInfo['FILE']['name'], $upload->getDestination() . '/' . $newName);
				
				try {
					$inputFileName = $upload->getDestination() . '/' . $newName;
					$inputFileType = PHPExcel_IOFactory::identify($inputFileName);
					$objReader = PHPExcel_IOFactory::createReader($inputFileType);
					$objReader->setReadDataOnly(true);
					$objPHPExcel = $objReader->load($inputFileName);
					$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, $inputFileType);
					$objWriter->setPreCalculateFormulas(false);
					$total = 0;
					$err = array();
					foreach ($objPHPExcel->getWorksheetIterator() as $worksheet) {
						$highestRow         =  $objPHPExcel->setActiveSheetIndex(0)->getHighestRow();
						$highestColumn      =  $objPHPExcel->setActiveSheetIndex(0)->getHighestColumn();
						$nrColumns = ord($highestColumn) - 64;
						$highestColumn++;
						for ($row = 2; $row < $highestRow + 1; $row++) {
							$val = array();
							for ($col = 'A'; $col < $highestColumn; $col++) {
								$val[] = $objPHPExcel->setActiveSheetIndex(0)->getCell($col . $row)->getValue();
							};
							
							/*
							 * 0 - Company Name
							 * 1 - Investor Type
							 * 2 - Style
							 * 3 - Equity Assets
							 * 4 - Phone 1
							 * 5 - Phone 2
							 * 6 - Fax
							 * 7 - Email 1
							 * 8 - Email 2
							 * 9 - Website
							 * 10 - Address
							 * 11 - Country
							 * 12 - Company Overview
							 * 13 - Investment Strategy
							 */
							
							if(!empty($val[0]) && $val[0] != '') {
								if(!$this->_model->isExistByKey('COMPANY_NAME', $val[0])) {
									if(!$ITModel->isExistByKey('INVESTOR_TYPE', $val[1])) {
										$investorType = $ITModel->insert(array(
												'INVESTOR_TYPE' => $val[1],
												'CREATED_DATE' => $this->_date
												));
									} else {
										$investorType = $ITModel->getPkByKey('INVESTOR_TYPE', $val[1]);
									}
									$style = (!empty($val[2]) && $val[2] != '' ) ? $val[2] : '-';
									$equityAssets = (is_numeric($val[3])) ? $val[3] : 0;
									$phone1 = (!empty($val[4]) && $val[4] != '' ) ? $val[4] : '-';
									$phone2 = (!empty($val[5]) && $val[5] != '' ) ? $val[5] : '-';
									$fax = (!empty($val[6]) && $val[6] != '' ) ? $val[6] : '-';
									$email1 = (!empty($val[7]) && $val[7] != '' ) ? $val[7] : '-';
									$email2 = (!empty($val[8]) && $val[8] != '' ) ? $val[8] : '-';
									$website = (!empty($val[9]) && $val[9] != '' ) ? $val[9] : '-';
									$address = (!empty($val[10]) && $val[10] != '' ) ? $val[10] : '-';
									if(!$LOModel->isExistByKey('LOCATION', $val[11])) {
										$country = $LOModel->insert(array(
												'LOCATION' => $val[11],
												'CREATED_DATE' => $this->_date
												));
									} else {
										$country = $LOModel->getPkByKey('LOCATION', $val[11]);
									}
									$companyOverview = (!empty($val[12]) && $val[12] != '' ) ? utf8_encode($val[12]) : '-';
									$investmentStrategy = (!empty($val[13]) && $val[13] != '' ) ? utf8_encode($val[13]) : '-';
									
									try {
										$this->_model->insert(array(
												'INVESTOR_TYPE_ID' => $investorType,
												'LOCATION_ID' => $country,
												'COMPANY_NAME' => $val[0],
												'STYLE' => $style,
												'EQUITY_ASSETS' => $equityAssets,
												'PHONE_1' => $phone1,
												'PHONE_2' => $phone2,
												'FAX' => $fax,
												'EMAIL_1' => $email1,
												'EMAIL_2' => $email2,
												'WEBSITE' => $website,
												'ADDRESS' => $address,
												'COMPANY_OVERVIEW' => $companyOverview,
												'INVESTMENT_STRATEGY' => $investmentStrategy,
							 					'CREATED_DATE' => $this->_date
												));
										$total++;
									}catch(Exception $e) {
										$this->_success = false;
										$this->_error_code = $e->getCode();
										$this->_error_message = $e->getMessage();
										$err[] = $e->getMessage();
									}
								}
							}
						}
					}
					$this->_error_message = $total . ' data successfully inserted.';
					if(file_exists($upload->getDestination() . '/' . $newName)) {
						unlink($upload->getDestination() . '/' . $newName);
					}
				}catch(Exception $e) {
					$this->_error_code = $e->getCode();
					$this->_error_message = $e->getMessage();
					$this->_success = false;
				}
			} else {
				$this->error(902);
			}
		}catch(Exception $e) {
			$this->_error_code = $e->getMessage();
			$this->_error_message = $e->getMessage();
			$this->_success = false;
		}
		$this->json();
	}
	
	public function searchAction()
	{
		if($this->isPost() && $this->isAjax()) {

			$mContacts 		= new Application_Model_Contacts();
			$mEquityAsset 	= new Application_Model_Equityasset();
			$mInvestorType 	= new Application_Model_InvestorType();
			$mLocations 	= new Application_Model_Locations();

			$companyName 	= (!empty($this->_posts['COMPANY_NAME'])) 	? $this->_posts['COMPANY_NAME'] 	: '*';
			$contactPerson 	= (!empty($this->_posts['CONTACT_PERSON'])) ? $this->_posts['CONTACT_PERSON'] 	: '*';
			$equityAssets 	= (!empty($this->_posts['EQUITY_ASSETS'])) 	? $this->_posts['EQUITY_ASSETS'] 	: '*';
			$investorType 	= (!empty($this->_posts['INVESTOR_TYPE'])) 	? $this->_posts['INVESTOR_TYPE'] 	: '*';
			$location 		= (!empty($this->_posts['LOCATION'])) 		? $this->_posts['LOCATION'] 		: '*';

			$sSelectInvestors = array(
				'INVESTOR_ID',
				'INVESTOR_TYPE_ID',
				'LOCATION_ID',
				'COMPANY_NAME',
				'STYLE',
				'EQUITY_ASSETS',
				'PHONE_1',
				'PHONE_2',
				'FAX',
				'EMAIL_1',
				'EMAIL_2',
				'WEBSITE',
				'ADDRESS',
				'COMPANY_OVERVIEW',
				'INVESTMENT_STRATEGY',
				'CREATED_DATE',
				'MODIFIED_DATE'
				);

			$max_id = 0;

			$q = $this->_model->select()->setIntegrityCheck(false)->from('INVESTORS', $sSelectInvestors);

			/* Sort data */
			if(isset($this->_posts['sort'])) {
				$q->order($this->_sort);
			} else {
				$q->order('INVESTOR_ID ASC');
			}
			/* End of : Sort data */

			$res2 = $q->query()->fetchAll();
			$totalCount = count($res2);

			/* GET MAX ID */
			if($this->_page > 1) {
				$q2 = $q;
				$q2->limit($this->_limit, ($this->_page - 2 > 0) ? $this->_start / ($this->_page - 2) : 0);
				$res = $q2->query()->fetchAll();
				$max_id = $res[count($res)-1]['INVESTOR_ID'];
			}
			/* END OF : GET MAX ID */

			$q->join('LOCATIONS', 'INVESTORS.LOCATION_ID = LOCATIONS.LOCATION_ID', array('LOCATION'));
			$q->join('INVESTOR_TYPE', 'INVESTOR_TYPE.INVESTOR_TYPE_ID = INVESTORS.INVESTOR_TYPE_ID', 'INVESTOR_TYPE');
			
			if($max_id > 0) {
				$q->where('INVESTORS.INVESTOR_ID > ?', $max_id);
			}

			if($this->_page > 1) {
				$this->_start = 0;
			}

			$q->limit($this->_limit, $this->_start);
			
			$list = $q->query()->fetchAll();

			$this->_data['data']['items'] 		= $list;
			$this->_data['data']['totalCount'] 	= $totalCount;

		} else {

			$this->error(901);

		}

		$this->json();

	}

	// public function searchAction()
	// {
	// 	if($this->isPost() && $this->isAjax()) {
			

			 
	// 		/* Models : */
	// 		$contactModel = new Application_Model_Contacts();
	// 		$equityAssetsModel = new Application_Model_Equityasset();
	// 		$investorTypeModel = new Application_Model_InvestorType();
	// 		$locationModel = new Application_Model_Locations();
	// 		/* End of : Model */
			
	// 		$companyName = (!empty($this->_posts['COMPANY_NAME'])) ? $this->_posts['COMPANY_NAME'] : '*';
	// 		$contactPerson = (!empty($this->_posts['CONTACT_PERSON'])) ? $this->_posts['CONTACT_PERSON'] : '*';
	// 		$equityAssets = (!empty($this->_posts['EQUITY_ASSETS'])) ? $this->_posts['EQUITY_ASSETS'] : '*';
	// 		$investorType = (!empty($this->_posts['INVESTOR_TYPE'])) ? $this->_posts['INVESTOR_TYPE'] : '*';
	// 		$location = (!empty($this->_posts['LOCATION'])) ? $this->_posts['LOCATION'] : '*';
			


	// 		/////////////


 //    $db = Zend_Db_Table::getDefaultAdapter();

 //    $query = 'SELECT TOP 25 "INVESTORS".*, "LOCATIONS"."LOCATION", "INVESTOR_TYPE"."INVESTOR_TYPE" FROM "INVESTORS" INNER JOIN "LOCATIONS" ON LOCATIONS.LOCATION_ID = INVESTORS.LOCATION_ID INNER JOIN "INVESTOR_TYPE" ON INVESTOR_TYPE.INVESTOR_TYPE_ID = INVESTORS.INVESTOR_TYPE_ID';

 //    /* total count */
 //    $q2 = 'SELECT "INVESTORS".*, "LOCATIONS"."LOCATION", "INVESTOR_TYPE"."INVESTOR_TYPE" FROM "INVESTORS" INNER JOIN "LOCATIONS" ON LOCATIONS.LOCATION_ID = INVESTORS.LOCATION_ID INNER JOIN "INVESTOR_TYPE" ON INVESTOR_TYPE.INVESTOR_TYPE_ID = INVESTORS.INVESTOR_TYPE_ID';
 //    $totalCount = $db->query($q2)->fetchAll();
 //    $totalCount = count($totalCount);

 // 	$res = $db->query($query)->fetchAll();
 // 	$max_id = $res[count($res)-1]['INVESTOR_ID'];
 // 	if(isset($this->_posts['page'])) {
	// 	if($this->_posts['page'] > 1) {
	// 		$query .= " WHERE INVESTORS.INVESTOR_ID > $max_id";
	// 	}
	// }
 //    $stmt = $db->query($query);
 //    $rows = $stmt->fetchAll();

	// 		/////////////

	// 		// $q = $this->_model->select()->setIntegrityCheck(false);
	// 		// $q->from('INVESTORS', array('*'));
			
	// 		// if($companyName != '*') {
	// 		// 	$q->where('COMPANY_NAME LIKE ?', '%' . $companyName . '%');
	// 		// }
			
	// 		// if($investorType != '*') {
	// 		// 	if($investorTypeModel->isExistByKey('INVESTOR_TYPE', $investorType)) {
	// 		// 		$investorTypeId = $investorTypeModel->getPkByKey('INVESTOR_TYPE', $investorType);
	// 		// 		$q->where('INVESTORS.INVESTOR_TYPE_ID = ?', $investorTypeId);
	// 		// 	}
	// 		// }
			
	// 		// if($location != '*') {
	// 		// 	if($locationModel->isExistByKey('LOCATION', $location)) {
	// 		// 		$locationId = $locationModel->getPkByKey('LOCATION', $location);
	// 		// 		$q->where('INVESTORS.LOCATION_ID = ?', $locationId);
	// 		// 	}
	// 		// }
			
	// 		// if($equityAssets != '*') {
	// 		// 	if($equityAssetsModel->isExistByKey('EQUITY_TYPE', $equityAssets)) {
	// 		// 		$qEquity = $equityAssetsModel->select()
	// 		// 		->where('EQUITY_TYPE = ?', $equityAssets);
	// 		// 		$resEquity = $qEquity->query()->fetch();
	// 		// 		$q->where('EQUITY_ASSETS >= ?', $resEquity['MIN_VALUE'])
	// 		// 		->where('EQUITY_ASSETS <= ?', $resEquity['MAX_VALUE']);
	// 		// 	}
	// 		// }
			
	// 		// if($contactPerson != '*') {
	// 		// 	$qContact = $contactModel->select()
	// 		// 	->where('NAME LIKE ?', '%' . $contactPerson . '%');
	// 		// 	$resContact = $qContact->query()->fetchAll();
	// 		// 	if(count($resContact) > 0) {
	// 		// 		$q->where('CONTACTS.NAME LIKE ?', '%' . $contactPerson . '%');
	// 		// 		$q->join('CONTACTS', 'CONTACTS.INVESTOR_ID = INVESTORS.INVESTOR_ID', array('NAME'));
	// 		// 	}
	// 		// }
	// 		// $totalCount = $q->query()->fetchAll();
			
			
			
	// 		// $q->join('LOCATIONS', 'LOCATIONS.LOCATION_ID = INVESTORS.LOCATION_ID', array('LOCATION'));
	// 		// $q->join('INVESTOR_TYPE', 'INVESTOR_TYPE.INVESTOR_TYPE_ID = INVESTORS.INVESTOR_TYPE_ID', array('INVESTOR_TYPE'));
	// 		// //$q->order('INVESTORS.COMPANY_NAME ASC');
	// 		// if(isset($this->_posts['page'])) {
	// 		// 	if($this->_posts['page'] > 1) {
	// 		// 		$q2 = $q;
	// 		// 		$q2->limit($this->_limit, $this->_start);
	// 		// 		$q2->order('COMPANY_NAME ASC');
	// 		// 		$x = $q2->query()->fetchAll();
	// 		// 		$q->where('INVESTORS.INVESTOR_ID > ?', $x[count($x)-1]['INVESTOR_ID']);
	// 		// 	}
	// 		// }
	// 		// $q->order('INVESTORS.COMPANY_NAME ASC');

	// 		// if( $this->_start >= 25) {

	// 		// 	 $this->_start = 0;
	// 		// }
	// 		// //echo $this->_start . ' - ' . $this->_limit . "\n";
	// 		// $q->limit($this->_limit, $this->_start);
	// 		//die($q);

	// 		//$result = $q->query()->fetchAll();
	// 		$this->_data['data']['items'] = $rows;
	// 		$this->_data['data']['totalCount'] = $totalCount;
			
	// 	} else {
	// 		$this->error(901);
	// 	}
	// 	$this->json();
	// }
}
