var c = Ext.getCmp('<?php echo $this->container ?>');
var selected = c.getSelectionModel().getSelection();

if(selected.length > 0) {
	Ext.create('Ext.Window', {
		html: 'Are you sure want do delete selected item(s) ?',
		bodyPadding: '20 5 5 17',
		title: 'Confirmation',
		resizable: false,
		modal: true,
		closable: false,
		draggable: false,
		width: 300,
		height: 120,
		buttons: [{
			text: 'Yes',
			listeners: {
				click: function() {
					showLoadingWindow();
					this.up().up().close();
					Ext.Ajax.request({
						url: sd.baseUrl + '/meetingactivitie/request/destroy',
						params: selected[0].data,
						success: function(data) {
							var json = Ext.decode(data.responseText); // Decode responsetext | Json to Javasript Object
							closeLoadingWindow();
							store.loadPage(1);
						},
						failure: function(data) {
							var json = Ext.decode(data.responseText); // Decode responsetext | Json to Javasript Object
							closeLoadingWindow();
						}
					});
				}
			}
		},{
			text: 'No',
			listeners: {
				click: function() {
					this.up().up().close();
				}
			}
		}]
	}).show();
} else {
	Ext.Msg.alert('Message', 'You did not select any Meeting');
}