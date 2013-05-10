Ext.create('Ext.Window', {
	title: 'Add New Company Name',
	draggable: false,
	modal: true,
	width: 350,
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
			id: 'shareprices-add-form',
			waitMsgTarget: true,
			items: [{
				fieldLabel: 'Company Name',
				allowBlank: false,
				name: 'SHAREPRICES_NAME',
				emptyText: 'Insert company name',
			}]
		}]
	}],
	buttons: [{
		text: 'Save',
		listeners: {
			click: function() {
				var form = this.up().up().items.items[0].items.items[0].getForm();
				var store = loadStore('SharepricesNames');
				if(form.isValid()) {
					form.submit({
						url: sd.baseUrl + '/sharepricesname/request/create',
						waitMsg: 'Saving data, please wait..',
						success: function(data) {
							var json = Ext.decode(data.responseText);
							form.reset();
							store.loadPage(1); // Refresh grid data
							Ext.Msg.alert('Success', 'Data has been saved');
						},
						failure: function(data) {
							var json = Ext.decode(data.responseText);
							Ext.Msg.alert('Error', 'Data already exist');
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