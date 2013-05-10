Ext.create('Ext.Window', {
	title: 'New Category',
	modal: true,
	draggable: false,
	resizable: false,
	id: 'news-category-add-window',
	width: 330,
	items: [{
		xtype: 'form',
		layout: 'form',
		id: 'news-category-add-form',
		border: false,
		bodyPadding: '5 5 5 5',
		defaultType: 'textfield',
		items: [{
			fieldLabel: 'Category Name',
			name: 'NEWS_CATEGORY',
			allowBlank: false
		}]
	}],
	buttons: [{
		text: 'Save',
		listeners: {
			click: function() {
				var form = Ext.getCmp('news-category-add-form').getForm();
				var store = loadStore('NewsCategorys');
				if(form.isValid()) {
					form.submit({
						url: sd.baseUrl + '/newscategory/request/create',
						success: function(d, e) {
							var json = Ext.decode(e.response.responseText);
							form.reset();
							Ext.getCmp('news-category-add-window').close();
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