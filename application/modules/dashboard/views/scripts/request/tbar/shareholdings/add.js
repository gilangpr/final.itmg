//	Ext.define('Shareholding', {
//		extend: 'Ext.data.Model',
//		fields: [{
//			name: 'SHAREHOLDING_ID',
//			type: 'string'
//		}]
//	});
var storeSR = Ext.create('Ext.data.Store',{
    storeId: 'InvestorStatus_',
    model: 'InvestorStatus',
    proxy: {
        type: 'ajax',
        api: {
            read: '/investorstatus/request/autocom'
        },
        actionMethods: {
            create: 'POST'
        },
        reader: {
            idProperty: 'INVESTOR_STATUS',
            type: 'json',
            root: 'data.items',
            totalProperty: 'data.totalCount'
        },
        writer: {
            type: 'json',
            root: 'data',
            writeAllFields: true
        }
    },
    sorter: {
        property: 'INVESTOR_STATUS_ID',
        direction: 'ASC'
    },
    autoSync: true
});

Ext.create('Ext.Window', {
	title: 'Add New Shareholder',
	width: 400,
	height: 146,
	closable: true,
	resizable: false,
	draggable: false,
	modal: true,
	buttons: [{
		text: 'Save',
		listeners: {
			click: function() {
				var form  = Ext.getCmp('shareholdings-add-new-form').getForm();
				if(form.isValid()) {
					form.submit({
						url: sd.baseUrl + '/shareholdings/request/create',
						success: function(data) {
							var json = Ext.decode(data.respnoseText);
							form.reset();
							Ext.Msg.alert('Message','Success adding new shareholder');
							var store = loadStore('Shareholdings');
							store.loadPage(1);
							var store = Ext.StoreManager.lookup('InvestorStatuss');
							store.load(1);
						},
						failure: function(data,res) {
							var json = Ext.decode(res.response.responseText);
							Ext.Msg.alert('Error',json.error_message);
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
		id: 'shareholdings-add-new-form',
		defaultType: 'textfield',
		bodyPadding: '5 5 5 5',
		items: [{
			fieldLabel: 'Investor Name',
			name: 'INVESTOR_NAME',
			allowBlank: false
		},{
			xtype: 'combobox',
			fieldLabel: 'Investor Type',
			//store: Ext.data.StoreManager.lookup('InvestorStatus'),
			id: 'investor-status',
			name: 'INVESTOR_STATUS',
			displayField: 'INVESTOR_STATUS',
			store: storeSR,
			minChars: 3,
			pageSize: 10,
			typeAhead: true,
			allowBlank: false,
			editable: false
		},{
			fieldLabel: 'Account Holder',
			name: 'ACCOUNT_HOLDER',
			allowBlank: false
		}/*,{
			fieldLabel: 'Amount',
			xtype: 'numberfield',
			allowBlank: false,
			minValue: 0,
			value: 0,
			name: 'AMOUNT'
		}*/]
	}]
}).show();