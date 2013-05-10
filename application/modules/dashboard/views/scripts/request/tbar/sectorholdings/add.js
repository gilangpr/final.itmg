
Ext.create('Ext.Window', {
	title: 'Add New Sector Holdings',
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
			id: 'sectorjoldings-add-form',
			waitMsgTarget: true,
			items: [{
					xtype: 'combobox',
					fieldLabel: 'Company Name',
					name: 'INVESTOR_ID',
					labelWidth: 130,
					store: Ext.data.StoreManager.lookup('Investors'),
					displayField: 'INVESTOR_ID',
					typeAhead: true,
					allowBlank: false,
					minChars: 2,
					emptyText: 'Select Investors'
				},{
					fieldLabel: 'Sector Name',
					name: 'TITLE'
				},{
					fieldLabel: 'Percentage %',
					name: 'VALUE',
					xtype: 'numberfield',
					minValue: 0,
					allowBlank: false
				}]
		}]
	}],
	buttons: [{
		text: 'Save',
		listeners: {
			click: function() {
				var form = this.up().up().items.items[0].items.items[0].getForm();
				var store = loadStore('Sectorholdings');
				if(form.isValid()) {
					form.submit({
						url: sd.baseUrl + '/sectorholdings/request/create',
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
