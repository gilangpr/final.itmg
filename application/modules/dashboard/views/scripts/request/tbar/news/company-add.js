Ext.create('Ext.Window', {
	title: 'New Company',
	modal: true,
	draggable: false,
	resizable: false,
	id: 'news-company-add-window',
	width: 330,
	items: [{
		xtype: 'form',
		layout: 'form',
		id: 'news-company-add-form',
		border: false,
		bodyPadding: '5 5 5 5',
		defaultType: 'textfield',
		items: [{
			fieldLabel: 'Company Name',
			name: 'COMPANY_NAME',
			allowBlank: false
		}]
	}],
	buttons: [{
		text: 'Save',
		listeners: {
			click: function() {
				var form = Ext.getCmp('news-company-add-form').getForm();
				var store = loadStore('Companys');
				if(form.isValid()) {
					form.submit({
						url: sd.baseUrl + '/company/request/create',
						success: function(d, e) {
							var json = Ext.decode(e.response.responseText);
							form.reset();
							Ext.getCmp('news-company-add-window').close();
							store.loadPage(store.currentPage);
						},
						failure: function(d, e) {
							var json = Ext.decode(e.response.responseText);
							Ext.Msg.alert('Error', json.error_message);
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