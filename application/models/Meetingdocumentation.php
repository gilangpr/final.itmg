<?php 

class Application_Model_Meetingdocumentation extends MyIndo_Ext_Abstract
{
	protected $_name = 'MEETING_DOCUMENTATION';
	protected $_id = 'MEETING_DOCUMENTATION_ID';
	
	/*public function getListMeetingdocumentationLimit($limit, $offset)
	{
		$q = $this->select()
		->setIntegrityCheck(false)
		->from($this->_name, array('*'))
		->join('MEETING_ACTIVITIE', 'MEETING_ACTIVITIE.MEETING_ACTIVITIE_ID = MEETING_DOCUMENTATION.MEETING_ACTIVITIE_ID', array('*'))
		->limit($limit, $offset);
		
		return $q->query()->fetchAll();
	}*/
}
