<?php

class Application_Model_Participant extends MyIndo_Ext_Abstract
{
	protected $_name = 'PARTICIPANTS';
	protected $_id = 'PART_ID';
	
	public function getName($metId) {
		$q = $this->select()
		->setIntegrityCheck(false)
		->from($this->_name, array('*'))
		->join('MEETING_ACTIVITIE','MEETING_ACTIVITIE.MEETING_ACTIVITIE_ID = PARTICIPANTS.MEETING_ACTIVITIE_ID',array('MEETING_ACTIVITIE_ID'))
		->where('PARTICIPANTS.MEETING_ACTIVITIE_ID = ?', $metId);
		return $q->query()->fetchAll();
	}
}