Ext.create('Ext.Window', {
	title: 'Add New Investor Type',
	draggable: false,
	modal: true,
	width: 300,
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
			id: 'investortype-add-form',
			waitMsgTarget: true,
			items: [{
				fieldLabel: 'Investor Type <span style="color:red;">*</span>',
				allowBlank: false,
				name: 'INVESTOR_TYPE'
			}]
		}]
	}],
	buttons: [{
		text: 'Save',
		listeners: {
			click: function() {
				var form = this.up().up().items.items[0].items.items[0].getForm();
				var store = loadStore('InvestorTypes');
				if(form.isValid()) {
					form.submit({
						url: sd.baseUrl + '/investortype/request/create',
						waitMsg: 'Saving data, please wait..',
						success: function(d, e) {
							var json = Ext.decode(e.response.responseText);
							form.reset();
							store.loadPage(1); // Refresh grid data
							Ext.Msg.alert('Success', 'Data has been saved');
						},
						failure: function(d, e) {
							var json = Ext.decode(e.response.responseText);
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