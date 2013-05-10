var c = Ext.getCmp('<?php echo $this->container ?>');
var selected = c.getSelectionModel().getSelection();
if(selected.length > 0) {
	document.location = sd.baseUrl + '/research/request/download/id/' + selected[0].data.RESEARCH_REPORT_ID;
	var store = loadStore('ResearchReports');
	setTimeout(function(){
		store.loadPage(store.currentPage);
	},800);
} else {
	Ext.Msg.alert('Message', 'You did not select any Research');
}