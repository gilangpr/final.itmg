var c = Ext.getCmp('<?php echo $this->container ?>');
var selected = c.getSelectionModel().getSelection();
Ext.require([
    'Ext.window.MessageBox',
    'Ext.tip.*'
]);
var storePEERS = loadStore('Peers');

if(selected.length > 0) {
	var id = 'peers-detail-' + selected[0].data.PEER_ID;
    var data = selected[0].data;
    <?php echo $this->render('/request/tbar/peers/detail-core.js')?>
} else {
	Ext.Msg.alert('Error', 'You did not select any Company.');
}