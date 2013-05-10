
var storeEQ = Ext.create("Ext.data.Store", {
	model: "Equityasset",
	storeId: "Equityassets___",
	proxy:{"type":"ajax","api":{"read":"\/equityasset\/request\/read","create":"\/equityasset\/request\/create","update":"\/equityasset\/request\/update","destroy":"\/equityasset\/request\/destroy"},"actionMethods":{"create":"POST","destroy":"POST","read":"POST","update":"POST"},"reader":{"idProperty":"EQUITY_ID","type":"json","root":"data.items","totalProperty":"data.totalCount"},"writer":{"type":"json","root":"data","writeAllFields":true}},
	sorter: {"property":"EQUITY_ID","direction":"ASC"}});
storeEQ.autoSync = true;
storeEQ.load();

 //var storeEQ = loadStore('Equityassets');
 var cellEditing = Ext.create('Ext.grid.plugin.RowEditing', {
	clicksToMoveEditor: 1,
	autoCancel: false
});

Ext.create('Ext.Window', {
	title: 'Equity Asset',
	resizabe: false,
	modal: true,
	draggable: false,
	resizable: false,
	items: [{
		xtype: 'gridpanel',
		minWidth: 300,
		minHeight: 100,
		border: false,
		store:storeEQ,
		plugins: [cellEditing],
		id: 'investors-equity-asset-data-grid',
		columns: [{
			text: 'Equity Type',
			flex: 1,
			dataIndex: 'EQUITY_TYPE'
		},{
			text: 'Min.Value',
			width: 120,
			flex:1,
			align: 'center',
			dataIndex: 'MIN_VALUE',
			editor:{
				name:'MIN_VALUE',
				xtype:'numberfield',
				allowBlank:false,
				minValue:0
			}
		},{
			text:'Max.Value',
			flex:1,
			dataIndex:'MAX_VALUE',
			editor:{
				name:'MAX_VALUE',
				xtype:'numberfield',
				allowBlank:false,
				minValue:0
			}
		}]
	}]
}).show();
