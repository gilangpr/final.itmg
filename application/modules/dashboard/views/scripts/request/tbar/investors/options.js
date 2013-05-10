Ext.create('Ext.Window', {
	title: 'Investor Options',
	width: 400,
	draggable: false,
	resizable: false,
	modal: true,
	items: [{
		xtype: 'gridpanel',
		border: false,
		minHeight: 200,
		columns: [{
			text: 'Type',
			flex: 1
		},{
			text: 'Value Min'
		},{
			text: 'Value Max'
		}]
	}]
}).show();