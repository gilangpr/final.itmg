	Ext.define('Investors', {
		extend: 'Ext.data.Model',
		fields: [{
			name: 'INVESTOR_ID',
			type: 'string'
		}]
	});
Ext.create('Ext.Window', {
	title: 'Upload Excel',
	width: 400,
	height: 98,	
	resizable: false,
	draggable: false,
	closable: false,
	modal: true,
	buttons: [{
		text: 'Upload',
		listeners: {
			click: function() {
				var form = Ext.getCmp('Investors-upload-form').getForm();	
				//var form = this.up().up().items.items[0].items.items[0].getForm();			
				if(form.isValid()) {
					form.submit({
						url: sd.baseUrl + '/investors/request/upload',
						waitMsg: 'Uploading file, please wait..',
						success: function(d, e) {
							var json = Ext.decode(e.response.responseText);
							Ext.Msg.show({
								title: 'Message',
								msg: json.error_message,
								//msg: json.message,
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
								title: 'Message',
								msg: json.error_message,
								minWidth: 200,
								modal: true,
								icon: Ext.Msg.INFO,
								buttons: Ext.Msg.OK
							});
							form.reset();
							store.loadPage(store.currentPage);
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
	}],
	items: [{
		xtype: 'form',
		layout: 'form',
		border: false,
		bodyPadding: '5 5 5 5',
		id: 'Investors-upload-form',
		items: [{			
			xtype: 'filefield',
			name: 'FILE',
			fieldLabel: 'Select file',
			allowBlank: false,
			emptyText: 'Please select a document',
			id:'xlsUpload',
		}]
	}]
}).show();