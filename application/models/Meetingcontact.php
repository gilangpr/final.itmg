<?php 

class Application_Model_Meetingcontact extends MyIndo_Ext_Abstract
{
	protected $_name = 'MEETING_ACTIVITIE_CONTACT';
	protected $_id = 'MEETING_CONTACT';
	
	public function getListMeetingContactLimit($limit, $offset, $ma_id)
	{
		$q = $this->select()
		->setIntegrityCheck(false)
		->from($this->_name, array('*'))
		->join('MEETING_ACTIVITIE', 'MEETING_ACTIVITIE.MEETING_ACTIVITIE_ID = MEETING_ACTIVITIE_CONTACT.MEETING_ACTIVITIE_ID', array('*'))
		->join('CONTACTS','CONTACTS.CONTACT_ID = MEETING_ACTIVITIE_CONTACT.CONTACT_ID',array('*'))
		->join('INVESTORS','INVESTORS.INVESTOR_ID=CONTACTS.INVESTOR_ID',array('*'))
		->where('MEETING_ACTIVITIE.MEETING_ACTIVITIE_ID = ?', $ma_id)
		->limit($limit, $offset);
		
		return $q->query()->fetchAll();
	}
	public function getContactName($In_Id,$Meet_Id)
	{
		$q = $this->select()
        ->setIntegrityCheck(false)
        ->from($this->_name, array('*'))
        ->join('CONTACTS','CONTACTS.CONTACT_ID = MEETING_ACTIVITIE_CONTACT.CONTACT_ID',array('NAME'))
        ->where('CONTACTS.INVESTOR_ID = ?', $In_Id)
        ->where('MEETING_ACTIVITIE_CONTACT.MEETING_ACTIVITIE_ID = ?', $Meet_Id);
        return $q->query()->fetchAll();
	}
	public function getName($meetId)
	{
		$q = $this->select()
		->setIntegrityCheck(false)
		->from($this->_name, array('*'))
		->join('CONTACTS','CONTACTS.CONTACT_ID = MEETING_ACTIVITIE_CONTACT.CONTACT_ID',array('NAME','EMAIL','POSITION'))
		->joinLeft('INVESTORS','INVESTORS.INVESTOR_ID=CONTACTS.INVESTOR_ID',array('COMPANY_NAME'))
		->where('MEETING_ACTIVITIE_CONTACT.MEETING_ACTIVITIE_ID = ?', $meetId);
		return $q->query()->fetchAll();
	}
}
