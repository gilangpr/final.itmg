Ext.create('Ext.Window', {
	title: 'Add New Group',
	width: 500,
	draggable: false,
	resizable: false,
	modal: true,
	items: [{
		xtype: 'panel',
		border: false,
		items: [{
			xtype: 'form',
			layout: 'form',
			id: 'groups-add-group-form',
			border: false,
			bodyPadding: '5 5 5 5',
			defaultType: 'textfield',
			items: [{
				fieldLabel: 'Name',
				name: 'GROUP_NAME',
				emptyText: 'Group Name',
				allowBlank: false
			}]
		}]
	}],
	buttons: [{
		text: 'Save',
		listeners: {
			click: function() {
				var form = Ext.getCmp('groups-add-group-form').getForm();
				var store = loadStore('Groups');
				if(form.isValid()) {
					form.submit({
						url: sd.baseUrl + '/groups/request/create',
						waitMsg: 'Creating new group, please wait..',
						success: function(d, e) {
							var json = Ext.decode(e.response.responseText);
							Ext.Msg.show({
								title: 'Message',
								msg: 'Group successfully created.',
								minWidth: 200,
								modal: true,
								icon: Ext.Msg.INFO,
								buttons: Ext.Msg.OK
							});
							form.reset();
							store.loadPage(store.currentPage);
						},
						failure: function(d, e) {
							var json = Ext.decode(e.response.responseText);
							Ext.Msg.show({
								title: 'Error',
								msg: json.error_message,
								minWidth: 200,
								modal: true,
								icon: Ext.Msg.INFO,
								buttons: Ext.Msg.OK
							});
						}
					});
				}
			}
		}
	},{
		text: 'Cancel',
		listeners: {
			click: function() {
				this.up().up().close();
			}
		}
	}]
}).show();