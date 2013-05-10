var _storeInvestors = Ext.create("Ext.data.Store", {
	model: "Investor",
	storeId: "Investors_combobox",
	proxy:{"type":"ajax","api":{"read":"\/investors\/request\/read","create":"\/investors\/request\/create","update":"\/investors\/request\/update","destroy":"\/investors\/request\/destroy"},"actionMethods":{"create":"POST","destroy":"POST","read":"POST","update":"POST"},"reader":{"idProperty":"INVESTOR_ID","type":"json","root":"data.items","totalProperty":"data.totalCount"},"writer":{"type":"json","root":"data","writeAllFields":true}},
	sorter: {"property":"INVESTOR_ID","direction":"ASC"}});

Ext.create('Ext.Window', {
	title: 'Search Investor',
	xtype: 'panel',
	layout: 'border',
	id: 'search-investor-main',
	modal: true,
	closable: true,
	width: 800,
	height: 154,
	resizable: false,
	draggable: false,
	items: [{
		region: 'west',
		border: false,
		width: '50%',
		items: [{
			xtype: 'form',
			layout: 'form',
			border: false,
			id: 'search-investor-form-left',
			bodyPadding: '5 5 5 5',
			defaultType: 'combobox',
			items: [{
				fieldLabel: 'Company Name',
				emptyText: 'All',
				store: _storeInvestors,
                displayField: 'COMPANY_NAME',
                typeAhead: true,
				name: 'COMPANY_NAME',
				minChars: 3,
				allowBlank: true,
				flex:1,
				anchor:'100%',
				pageSize: 10
			},{
				fieldLabel: 'Contact Person',
				emptyText: 'All',
				store: Ext.data.StoreManager.lookup('Contacts'),
                displayField: 'NAME',
                typeAhead: true,
				name: 'CONTACT_PERSON',
				allowBlank: true,
				minChars:3,
				flex:1,
				allowBlank: true,
				pageSize: 10
			},{
				xtype: 'combobox',
                fieldLabel: 'Equity Assets',
                name: 'EQUITY_ASSETS',
                labelWidth: 130,
                store: Ext.data.StoreManager.lookup('Equityassets'),
                displayField: 'EQUITY_TYPE',
                valueField:'EQUITY_TYPE',
                typeAhead: true,
                allowBlank: true,
                minChars: 1,
                emptyText: 'All'
			}]
		}]
	},{
		region: 'east',
		border: false,
		width: '50%',
		items: [{
			xtype: 'form',
			layout: 'form',
			border: false,
			id: 'search-investor-form-right',
			bodyPadding: '5 5 5 5',
			defaultType: 'combobox',
			items: [{
				fieldLabel: 'Investor Type',
				emptyText: 'All',
				store: Ext.data.StoreManager.lookup('InvestorTypes'),
                displayField: 'INVESTOR_TYPE',
                valueField:'INVESTOR_TYPE',
                typeAhead: true,
				name: 'INVESTOR_TYPE',
				allowBlank: true,
				minChars:3,
				flex:1,
				editable: false,
				pageSize: 10
			},{
				fieldLabel: 'Location',
				emptyText: 'All',
				store: Ext.data.StoreManager.lookup('Locations'),
                displayField: 'LOCATION',
                valueField:'LOCATION',
                typeAhead: true,
				name: 'LOCATION',
				allowBlank: true,
				minChars:1,
				flex:1,
				editable: false,
				pageSize: 10
			},{
				fieldLabel: 'Format',
				emptyText: 'List',
				name: 'FORMAT',
				store: new Ext.data.ArrayStore({fields:['FR'],data:[['List'],['Detail']]}),
				allowBlank: false,
				value: 'List',
				displayField: 'FR',
				editable: false
			}]
		}]
	}]
}).show();