
Ext.create('Ext.Window', {
	title: 'Add New Meeting',
	draggable: false,
	modal: true,
	width: 500,
	resizable: false,
	items: [{
		xtype: 'panel',
		border: false,
		items: [{
			xtype: 'form',
			layout: 'form',
			border: false,
			bodyPadding: '5 5 5 5',
			defaultType: 'textfield',
			id: 'meetingdocument-add-form',
			waitMsgTarget: true,
			items: [{
					xtype: 'combobox',
					fieldLabel: 'Meeting Event',
					name: 'MEETING_ACTIVITIES_ID',
					labelWidth: 130,
					store: Ext.data.StoreManager.lookup('Meetingactivities'),
					displayField: 'MEETING_ACTIVITIES_ID',
					typeAhead: true,
					allowBlank: false,
					minChars: 2,
					emptyText: 'Select Meeting Event'
				},{
					fieldLabel: 'Documentation Title',
					name: 'DOCUMENTATION_TITLE'
				},{
					xtype: 'filefield',
				    name: 'FILE_PATH',
					fieldLabel: 'File upload'
				}]
		}]
	}],
	buttons: [{
		text: 'Save',
		listeners: {
			click: function() {
				var form = this.up().up().items.items[0].items.items[0].getForm();
				var store = loadStore('Meetingdocumentation');
				if(form.isValid()) {
					form.submit({
						url: sd.baseUrl + '/meetingdocumentation/request/create',
						waitMsg: 'Saving data, please wait..',
						success: function(data) {
							var json = Ext.decode(data.responseText);
							form.reset();
							store.loadPage(1); // Refresh grid data
							Ext.Msg.alert('Success', 'Data has been saved');
						},
						failure: function(data) {
							var json = Ext.decode(data.responseText);
							Ext.Msg.alert('Error', json.error_message);
						}
					})
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
