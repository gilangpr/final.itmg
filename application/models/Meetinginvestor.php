<?php 

class Application_Model_Meetinginvestor extends MyIndo_Ext_Abstract
{
	protected $_name = 'MEETING_ACTIVITIE_INVESTOR';
	protected $_id = 'MEETING_INVESTOR';
	
	public function getCompanyName($metId) {
		$q = $this->select()
		->setIntegrityCheck(false)
		->from($this->_name, array('*'))
		->join('INVESTORS','INVESTORS.INVESTOR_ID = MEETING_ACTIVITIE_INVESTOR.INVESTOR_ID',array('COMPANY_NAME'))
		//->join('CONTACTS', 'CONTACTS.INVESTOR_ID = INVESTORS.INVESTOR_ID', array('NAME','INVESTOR_ID'))
		->where('MEETING_ACTIVITIE_ID = ?', $metId);
		return $q->query()->fetchAll();
	}
	
	public function getName($metId) {
		$q = $this->select()
		->setIntegrityCheck(false)
		->from($this->_name, array('*'))
		->join('INVESTORS','INVESTORS.INVESTOR_ID = MEETING_ACTIVITIE_INVESTOR.INVESTOR_ID',array('COMPANY_NAME'))
		->join('CONTACTS', 'CONTACTS.INVESTOR_ID = INVESTORS.INVESTOR_ID', array('NAME'))
		->where('MEETING_ACTIVITIE_ID = ?', $metId);
		return $q->query()->fetchAll();
	}
	
	public function getListMeetinginvestorLimit($limit, $offset, $in_id)
	{
		$q = $this->select()
		->setIntegrityCheck(false)
		->from($this->_name, array('*'))
		->joinLeft('MEETING_ACTIVITIE', 'MEETING_ACTIVITIE.MEETING_ACTIVITIE_ID = MEETING_ACTIVITIE_INVESTOR.MEETING_ACTIVITIE_ID', array('*'))
		->joinLeft('INVESTORS','INVESTORS.INVESTOR_ID = MEETING_ACTIVITIE_INVESTOR.INVESTOR_ID',array('*'))
		//->joinLeft('MEETING_ACTIVITIE_CONTACT','MEETING_ACTIVITIE_INVESTOR.MEETING_ACTIVITIE_ID = MEETING_ACTIVITIE_CONTACT.MEETING_ACTIVITIE_ID',array('*'))
		//->joinLeft('CONTACTS', 'MEETING_ACTIVITIE_CONTACT.CONTACT_ID = CONTACTS.CONTACT_ID',array('NAME'))
		->where('MEETING_ACTIVITIE_INVESTOR.INVESTOR_ID = ?', $in_id)
		//->where('CONTACTS.INVESTOR_ID = ?', $in_id)
		->limit($limit, $offset);
		
		return $q->query()->fetchAll();
	}
	
}
