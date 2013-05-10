Ext.create('Ext.Window', {
		title: 'Add New Equity Type',
		modal: true,
		draggable: true,
		resizable: false,
		items: [{
			xtype: 'form',
			id: 'investors-equity-asset-add-new-form',
			minWidth: 300,
			border: false,
			bodyPadding: '5 5 5 5',
			items: [{
				xtype: 'textfield',
				fieldLabel: 'Equity Type',
				name: 'EQUITY_TYPE',
				allowBlank: false
			},{
				xtype: 'numberfield',
				fieldLabel: 'Min.Value',
				name: 'MIN_VALUE',
				allowBlank: false,
				value: 0,
				minValue: 0
			},{
				xtype: 'numberfield',
				fieldLabel: 'Max.Value',
				name: 'MAX_VALUE',
				allowBlank: false,
				value: 0,
				minValue: 0
			}]
		}],
		buttons: [{
			text: 'Save',
			listeners: {
				click: function() {
					var form = Ext.getCmp('investors-equity-asset-add-new-form');
					if(form.getForm().isValid()) {
						form.getForm().submit({
							url: sd.baseUrl + '/equityasset/request/create',
							waitMsg: 'Saving data, please wait..',
							success: function(d, e) {
								var json = Ext.decode(e.response.responseText);
								Ext.Msg.alert('Message', 'Saving data success.');
								var store = loadStore('Equityassets');
								store.load(store.currentPage);
								form.getForm().reset();
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