var c = Ext.getCmp('<?php echo $this->container ?>');
var selected = c.getSelectionModel().getSelection();
if(selected.length > 0) {
	var xid = 'investors-detail-' + selected[0].id;
	var data = selected[0].data;
	<?php echo $this->render('/request/tbar/investors/detail-core.js'); ?>
} else {
	Ext.Msg.alert('Message', 'You did not select any Investor');
}