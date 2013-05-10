<?php 

class Peers_ExecutiveController extends MyIndo_Controller_Action
{
	public function init()
	{
		$this->getInit(new Application_Model_Peers());
		$this->_model = new Application_Model_Peers();
	}
	
	public function getListPeersAction()
	{
		if($this->isPost() && $this->isAjax()) {
			if(!isset($this->_posts['TYPE'])) {
				$data = $this->_model->getList();
				$this->_data['data']['items'] = $data;
			} else {
				// Search :
				$name = (isset($this->_posts['COMPANY_NAME'])) ? $this->_posts['COMPANY_NAME'] : '';
				if(!empty($name) && $name != '') {
					$list = $this->_model->getListByKey('PEER_NAME', $this->_posts['COMPANY_NAME']);
					$this->_data = array('data'=>array(
							'items' => $list,
							'totalCount' => count($list)
					));
				} else {
					$this->_data = array('data'=>array(
						'items' => $this->_model->getListLimit($this->_limit, $this->_start),
						'totalCount' => $this->_model->count()
						));
				}
// 				if(isset($this->_posts['COMPANY_NAME'])) {
// 					$q = $this->_model->select()
// 					->where('PEER_NAME LIKE ?', '%' . $this->_posts['COMPANY_NAME'] . '%');
// 					$this->_data['data']['items'] = $q->query()->fetchAll();
// 					$this->_data['data']['totalCount'] = $q->query()->rowCount();
// 				} else {
// 					$this->_data['data']['items'] = $this->_model->getListLimit($this->_posts['limit'], $this->_posts['start']);
// 					$this->_data['data']['totalCount'] = $this->_model->count();
// 				}
			}
		}
		MyIndo_Tools_Return::JSON($this->_data, $this->_error_code, $this->_error_message, $this->_success);
	}
	
	public function loadDetailAction()
	{
		if($this->isAjax() && $this->isPost() && isset($this->_posts['ID'])) {
			if($this->_model->isExistByKey('PEER_ID', $this->_posts['ID'])) {
				
				$where = $this->_model->getAdapter()->quoteInto('PEER_ID = ?', $this->_posts['ID']);
				
				/* ====================
				 * Stripping Ratio Year
				 * ==================== */
				
				$modelSRY = new Application_Model_StrippingRatioYear();
				$listSRY = $modelSRY->getListLimit(5, 0, 'CREATED_DATE DESC', $where);
				$listColSRY = $modelSRY->getListLimit(5, 0, 'CREATED_DATE DESC');
				$colSRY = array();
				foreach($listColSRY as $k=>$d) {
					$colSRY[] = $d['TITLE'];
				}
				$this->_data['data']['SRY']['items'] = $listSRY;
				$this->_data['data']['SRY']['cols'] = $colSRY;
				
				/* =============================
				 * End of : Stripping Ratio Year
				 * ============================= */
				
				/* ===============
				 * Stripping Ratio
				 * =============== */
				
				$modelSR = new Application_Model_StrippingRatio();
				$listSR = $modelSR->getListLimit(3, 0, 'CREATED_DATE DESC', $where);
				$listColSR = $modelSR->getListLimit(3, 0, 'CREATED_DATE DESC');
				$colSR = array();
				foreach($listColSR as $k=>$d) {
					$colSR[] = $d['TITLE'];
				}
				
				$this->_data['data']['SR']['items'] = $listSR;
				$this->_data['data']['SR']['cols'] = $colSR;
				
				/* ========================
				 * End of : Stripping Ratio
				 * ======================== */
				
				/* =====================
				 * Average Selling Price
				 * ===================== */
				
				$modelASP = new Application_Model_SellingPrice();
				$listASP = $modelASP->getListLimit(3, 0, 'CREATED_DATE DESC', $where);
				$listColASP = $modelASP->getListLimit(3, 0, 'CREATED_DATE DESC');
				$colASP = array();
				foreach($listColASP as $k=>$d) {
					$colASP[] = $d['TITLE'];
				}
				
				$this->_data['data']['ASP']['items'] = $listASP;
				$this->_data['data']['ASP']['cols'] = $colASP;
				
				/* ==============================
				 * End of : Average Selling Price
				 * ============================== */
				
				/* =====================
				 * Financial Performance
				 * ===================== */
				
				$modelFP = new Application_Model_FinancialPerform();
				$listFP = $modelFP->getListLimit(3, 0, 'CREATED_DATE DESC', $where);
				$listColFP = $modelFP->getListLimit(3, 0, 'CREATED_DATE DESC');
				$colFP = array();
				foreach($listColFP as $k=>$d) {
					$colFP[] = $d['TITLE'];
				}
				
				$this->_data['data']['FP']['items'] = $listFP;
				$this->_data['data']['FP']['cols'] = $colFP;
				
				/* ==============================
				 * End of : Financial Performance
				 * ============================== */
				
				/* ================================================================
				 * Composition of the Company`s Shareholders at the End of The Year
				 * ================================================================ */
				
				$modelCSY = new Application_Model_CompositionCompany();
				$listCSY = $modelCSY->getListLimit(2, 0, 'CREATED_DATE DESC', $where);
				$listColCSY = $modelCSY->getListLimit(2, 0, 'CREATED_DATE DESC');
				$colCSY = array();
				foreach($listColCSY as $k=>$d) {
					$colCSY[] = $d['TITLE'];
				}
				
				$this->_data['data']['CSY']['items'] = $listCSY;
				$this->_data['data']['CSY']['cols'] = $colCSY;
				
				/* =========================================================================
				 * End of : Composition of the Company`s Shareholders at the End of The Year
				 * ========================================================================= */
				
				/* =======================
				 * Coal Sales Distribution
				 * ======================= */
				
				$modelCSD = new Application_Model_Coalsales();
				$listCSD = array();
				$listColCSD = array();
// 				$listCSD = $modelCSD->getListLimit(1, 0, 'CREATED_DATE DESC', $where);
// 				$listColCSD = $modelCSD->getListLimit(1, 0, 'CREATED_DATE DESC');
				$x = $modelCSD->select()
				->setIntegrityCheck(false)
				->from('COAL_SALES_DISTRIBUTION', array('*'))
				->where('PEER_ID = ?', $this->_posts['ID'])
				->join('COAL_SALES_DISTRIBUTION_TITLE','COAL_SALES_DISTRIBUTION.TITLE = COAL_SALES_DISTRIBUTION_TITLE.TITLE', array('*'))
				->order('COAL_SALES_DISTRIBUTION_TITLE.CREATED_DATE DESC');
				if($x->query()->rowCount() > 0) {
					$j = $x->query()->fetch();
					$lastTitle = $j['TITLE'];
					
					$q = $modelCSD->select()
					->where('PEER_ID = ?', $this->_posts['ID'])
					->where('TITLE = ?', $lastTitle);
					
					$listCSD = $q->query()->fetchAll();

					$colCSD = array();
					foreach($listCSD as $k=>$d) {
						if($k==0) {
							$colCSD[] = $d['TITLE'];
						}
					}
				}
				
				$this->_data['data']['CSD']['items'] = $listCSD;
				$this->_data['data']['CSD']['cols'] = $colCSD;
				
				/* ================================
				 * End of : Coal Sales Distribution
				 * ================================ */
			}
		}
		
		MyIndo_Tools_Return::JSON($this->_data, $this->_error_code, $this->_error_message, $this->_success);
	}
}
