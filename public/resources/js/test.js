Ext.onReady(function(){
	Ext.define('TestModel', {
		extend: 'Ext.data.Model',
		fields: [{
			name: 'NAME',
			type: 'string'
		},{
			name: 'VALUE_FY10',
			type: 'float'
		},{
			name: 'VALUE_9M10',
			type: 'float'
		}]
	});
	var store = Ext.create("Ext.data.Store", {
	    model: "TestModel",
	    storeId: "TestModels",
	    proxy: {
	        "type": "ajax",
	        "api": {
	            "read": "\/financialperform\/request\/read",
	            "create": "\/financialperform\/request\/create",
	            "update": "\/financialperform\/request\/update",
	            "destroy": "\/financialperform\/request\/destroy"
	        },
	        "actionMethods": {
	            "create": "POST",
	            "destroy": "POST",
	            "read": "POST",
	            "update": "POST"
	        },
	        "reader": {
	            "idProperty": "FINANCIAL_PERFORM_ID",
	            "type": "json",
	            "root": "data.items",
	            "totalProperty": "data.totalCount"
	        },
	        "writer": {
	            "type": "json",
	            "root": "data",
	            "writeAllFields": true
	        }
	    },
	    sorter: {
	        "property": "FINANCIAL_PERFORM_ID",
	        "direction": "ASC"
	    }
	});
	store.load({
		params: {
			id: 1
		}
	});
	Ext.Ajax.request({
		url: sd.baseUrl + '/financialperform/request/get-title',
		success: function(data) {
			var json = Ext.decode(data.responseText);
			Ext.create('Ext.Window', {
				title: 'Test',
				width: 800,
				height: 400,
				closable: true,
				resizable: false,
				items: [{
					xtype: 'gridpanel',
					border: false,
					store: store,
					columns: json.data.items
				}]
			}).show();
		}
	});
});