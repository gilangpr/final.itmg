<?php 

class Application_Model_Meetingparticipant extends MyIndo_Ext_Abstract
{
	protected $_name = 'MEETING_ACTIVITIE_ITM';
	protected $_id = 'MEETING_PARTICIPANT';
	
	public function getListMeetingparticipantLimit($limit, $offset, $MA_id)
	{
		$q = $this->select()
		->setIntegrityCheck(false)
		->from($this->_name, array('*'))
		->join('ITM_PARTICIPANTS', 'ITM_PARTICIPANTS.PARTICIPANT_ID = MEETING_ACTIVITIE_ITM.PARTICIPANT_ID', array('*'))
		->join('MEETING_ACTIVITIE','MEETING_ACTIVITIE.MEETING_ACTIVITIE_ID = MEETING_ACTIVITIE_ITM.MEETING_ACTIVITIE_ID',array('*'))
		->where('MEETING_ACTIVITIE.MEETING_ACTIVITIE_ID = ?', $MA_id)
		->limit($limit, $offset);
		
		return $q->query()->fetchAll();
	}
	/*
	public function getInitial($Meet_Id) {
        $q = $this->select()
        ->setIntegrityCheck(false)
        ->from($this->_name, array('*'))
        ->join('ITM_PARTICIPANTS', 'ITM_PARTICIPANTS.PARTICIPANT_ID = MEETING_ACTIVITIE_ITM.PARTICIPANT_ID', array('INITIAL_PART'))
        ->where('MEETING_ACTIVITIE_ITM.MEETING_ACTIVITIE_ID = ?', $Meet_Id);
        return $q->query()->fetchAll();
    }
	*/
	public function getInitial($metId) {
		$q = $this->select()
		->setIntegrityCheck(false)
		->from($this->_name, array('*'))
		->join('ITM_PARTICIPANTS', 'ITM_PARTICIPANTS.PARTICIPANT_ID = MEETING_ACTIVITIE_ITM.PARTICIPANT_ID', array('INITIAL_PART'))
		->where('MEETING_ACTIVITIE_ID = ?', $metId);
		return $q->query()->fetchAll();
	}
}
