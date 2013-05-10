Ext.create('Ext.Window', {
	title: 'Upload Excel',
	width: 400,
	height: 98,
	resizable: false,
	draggable: false,
	closable: true,
	modal: true,
	buttons: [{
		text: 'Save',
		listeners: {
			click: function() {
				var form = Ext.getCmp('sharehodlings-upload-form').getForm();
				if(form.isValid()) {
					form.submit({
						url: sd.baseUrl + '/shareholdings/request/upload',
						waitMsg: 'Uploading file, please wait..',
						success: function(data,e) {
							var json = Ext.decode(e.response.responseText);
							form.reset();
							Ext.Msg.alert('Message', json.error_message);
							var store = loadStore('Shareholdings');
							store.loadPage(1);	
							var store = Ext.StoreManager.lookup('InvestorStatuss');
							store.load(1);
						},
						failure: function(data,e) {
							var json = Ext.decode(e.response.responseText);
							Ext.Msg.alert('Message',json.error_message);
						}
					});
				}
			}
		}
	},{
		text: 'Cancel',
		listeners: {
			click: function() {
				{
					this.up().up().close();
				}
			}
		}
	}],
	items: [{
		xtype: 'form',
		layout: 'form',
		border: false,
		bodyPadding: '5 5 5 5',
		id: 'sharehodlings-upload-form',
		items: [{
			xtype: 'fileuploadfield',
			name: 'FILE',
			fieldLabel: 'Select file',
			allowBlank: false
		}]
	}]
}).show();
