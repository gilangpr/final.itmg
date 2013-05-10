var c = Ext.getCmp('<?php echo $this->container ?>');
var id = 'peers-add-form';
if (!c.up().items.get(id)) {
	
	c.up().add({
		title: 'Add New Peer Company',
		id: id,
		closable: true,
		autoScroll: true,
		tbar: [{
			xtype: 'button',
			text: 'Save',
			iconCls: 'icon-accept',
			listeners: {
				click: function() {
					var form = Ext.getCmp('add-new-peers-form').getForm();
					var store = loadStore('Peers');
					if (form.isValid()) {
						form.submit({
							url: sd.baseUrl + '/peers/request/create',
							success: function(data, _e) {
								var json = Ext.decode(_e.response.responseText);
								console.log(json);
								form.reset();
								store.loadPage(1); // Refresh grid data
								Ext.Msg.alert('Success', 'Data has been saved');
								Ext.getCmp(id).close();
								Ext.Ajax.request({
									url: sd.baseUrl + '/request/tbar/peers/detail.js',
									params: {
										id: data.PEER_ID
									}
								});
							},
							failure: function(data, _e) {
								var json = Ext.decode(_e.response.responseText);
								Ext.Msg.alert('Error', json.error_message);
							}
						})
					}
				}
			} 
		},{
			xtype: 'button',
			text: 'Cancel',
			iconCls: 'icon-stop',
			listeners: {
				click: function() {
					this.up().up().close();
				}
			}
		}],
		items: [{
			xtype: 'panel',
			border: false,
			items: [{
				xtype: 'form',
				layout: 'form',
				border: false,
				bodyPadding: '5 5 5 5',
				id: 'add-new-peers-form',
				defaultType: 'textfield',
				items: [{
					fieldLabel: 'Company Name',
					name: 'COMPANY_NAME',
					allowBlank: false
				},{
					fieldLabel: 'Brief History',
					name: 'BRIEF_HISTORY',
					xtype: 'htmleditor',
					height: 150,
					allowBlank: false
				},{
					fieldLabel: 'Business Activity',
					name: 'BUSINESS_ACTIVITY',
					xtype: 'htmleditor',
					height: 150,
					allowBlank: false
				}]
			}]
		}]
	});
}
c.up().setActiveTab(id);