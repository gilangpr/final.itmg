var storeNews = Ext.create("Ext.data.Store", {
	model: "News",
	storeId: "Newss",
	proxy:{"type":"ajax","api":{"read":"\/news\/request\/read","create":"\/news\/request\/create","update":"\/news\/request\/update","destroy":"\/news\/request\/destroy"},"actionMethods":{"create":"POST","destroy":"POST","read":"POST","update":"POST"},"reader":{"idProperty":"NEWS_ID","type":"json","root":"data.items","totalProperty":"data.totalCount"},"writer":{"type":"json","root":"data","writeAllFields":true}},
	sorter: {"property":"NEWS_ID","direction":"ASC"}});

var storeNC = Ext.create("Ext.data.Store", {
	model: "Company",
	storeId: "Companys__",
	proxy:{"type":"ajax","api":{"read":"\/company\/request\/read","create":"\/company\/request\/create","update":"\/company\/request\/update","destroy":"\/company\/request\/destroy"},"actionMethods":{"create":"POST","destroy":"POST","read":"POST","update":"POST"},"reader":{"idProperty":"COMPANY_ID","type":"json","root":"data.items","totalProperty":"data.totalCount"},"writer":{"type":"json","root":"data","writeAllFields":true}},
	sorter: {"property":"COMPANY_ID","direction":"ASC"}});

storeNC.load ({
	params: {
		all: 1
	}
});

var storeRC = loadStore('NewsCategorys');
storeRC.load({
	params: {
		all: 1
	}
});
Ext.create('Ext.Window', {
	title: 'Add News',
	id: 'add-news-window',
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
			id: 'news-add-new-form',
			border: false,
			bodyPadding: '5 5 5 5',
			defaultType: 'textfield',
			items: [{
				fieldLabel: 'Title',
				name: 'TITLE',
				emptyText: 'News Title',
				allowBlank: false
			},{
				xtype: 'combobox',
				name: 'CATEGORY',
				store: storeRC,
				displayField: 'NEWS_CATEGORY',
				typeAhead: false,
				editable: false,
				emptyText: 'Select Category',
				fieldLabel: 'Category',
				allowBlank: false
			},{
				xtype: 'combobox',
				name: 'COMPANY_NAME',
				store: storeNC,
				displayField: 'COMPANY_NAME',
				typeAhead: false,
				editable: true,
				emptyText: 'Select Company',
				fieldLabel: 'Company',
				allowBlank: false
			},{
				fieldLabel: 'Source',
				name: 'SOURCE',
				emptyText: 'News Source',
				allowBlank: false
			},{
				xtype: 'filefield',
				name: 'FILE_PATH',
				fieldLabel: 'File',
				emptyText: 'Please select a document',
				allowBlank: false
			}]
		}]
	}],
	buttons: [{
		text: 'Upload',
		listeners: {
			click: function() {
				var form = Ext.getCmp('news-add-new-form').getForm();
				var store = loadStore('Newss');
				if(form.isValid()) {
					form.submit({
						url: sd.baseUrl + '/news/request/create',
						waitMsg: 'Uploading document, please wait..',
						success: function(d, e) {
							var json = Ext.decode(e.response.responseText);
							Ext.Msg.show({
								title: 'Message',
								msg: 'File sucessfully uploaded',
								minWidth: 200,
								modal: true,
								icon: Ext.Msg.INFO,
								buttons: Ext.Msg.OK
							});
							form.reset();
							storeNews.loadPage(store.currentPage);
							Ext.getCmp('add-news-window').close();
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