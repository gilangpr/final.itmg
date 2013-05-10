var storeRC = loadStore('ResearchReportCategorys');
storeRC.load({
	params: {
		all: 1
	}
});

var storeRC2 = loadStore('Companys');
storeRC2.load({
	params: {
		all: 1
	}
});

var store = Ext.create("Ext.data.Store", {
	model: "Company",
	storeId: "Companys",
	proxy:{"type":"ajax","api":{"read":"\/company\/request\/read","create":"\/company\/request\/create","update":"\/company\/request\/update","destroy":"\/company\/request\/destroy"},"actionMethods":{"create":"POST","destroy":"POST","read":"POST","update":"POST"},"reader":{"idProperty":"COMPANY_ID","type":"json","root":"data.items","totalProperty":"data.totalCount"},"writer":{"type":"json","root":"data","writeAllFields":true}},
	sorter: {"property":"COMPANY_ID","direction":"ASC"}});

Ext.create('Ext.Window', {
	title: 'Add New Research Report',
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
			id: 'research-add-new-form',
			border: false,
			bodyPadding: '5 5 5 5',
			defaultType: 'textfield',
			items: [{
				fieldLabel: 'Title',
				name: 'TITLE',
				emptyText: 'Research Report Title',
				allowBlank: false
			},{
				xtype: 'combobox',
				name: 'CATEGORY',
				store: storeRC,
				displayField: 'RESEARCH_REPORT_CATEGORY',
				typeAhead: false,
				editable: false,
				emptyText: 'Select Category',
				fieldLabel: 'Category',
				allowBlank: false
			},{
				xtype: 'combobox',
				name: 'COMPANY_NAME',
				store: storeRC2,
				displayField: 'COMPANY_NAME',
				typeAhead: false,
				editable: false,
				emptyText: 'Select Company',
				fieldLabel: 'Company',
				allowBlank: false
			},{
				fieldLabel: 'Analyst',
				name: 'ANALYST',
				emptyText: 'Research Report Analyst',
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
				var form = Ext.getCmp('research-add-new-form').getForm();
				var store = loadStore('ResearchReports');
				if(form.isValid()) {
					form.submit({
						url: sd.baseUrl + '/research/request/create',
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
							store.loadPage(store.currentPage);
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