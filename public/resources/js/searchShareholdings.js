var shareholding_start_date = '1990-01-01';
var shareholding_end_date = '2015-01-01';
var sharehodling_short_by = 'Alphabetical';

function showShareholdingSearch() {
	Ext.create('Ext.Window', {
		title: 'Search Shareholders',
		modal: true,
		resizable: false,
		draggable: false,
		width: 400,
		id: 'shareholding-search-main',
		items: [{
			xtype: 'form',
			layout: 'form',
			border: false,
			id: 'shareholdings-search-form',
			bodyPadding: '5 5 5 5',
			items: [{
				fieldLabel: 'Start Date',
				xtype: 'datefield',
				name: 'START_DATE',
				allowBlank: false,
				id: 'sh-start-date',
				format: 'Y-m-d',
				typeAhead: false
			},{
				fieldLabel: 'End Date',
				xtype: 'datefield',
				name: 'END_DATE',
				id: 'sh-end-date',
				allowBlank: false,
				format: 'Y-m-d'
			},{
				fieldLabel: 'Sort By',
				xtype: 'combobox',
				name: 'SORT_BY',
				id: 'sh-sort-by',
				store: [
	                ['Alphabetical','Alphabetical'],
	                ['Higher_to_lower','Higher to lower'],
		        ],
		        value: 'Alphabetical',
				allowBlank: false
			}]
		}],
		buttons: [{
			text: 'Search',
			listeners: {
				click: function() {
					var form = Ext.getCmp('shareholdings-search-form').getForm();
					if(form.isValid()) {
						showLoadingWindow();
						shareholding_start_date = Ext.getCmp('sh-start-date').getValue();
						shareholding_end_date = Ext.getCmp('sh-end-date').getValue();
						shareholding_sort_by = Ext.getCmp('sh-sort-by').getValue();
						
						var _storeShareholdings = Ext.create("Ext.data.Store", {
							model: "Shareholding",
							storeId: "Shareholdings",
							proxy:{"type":"ajax","api":{"read":"\/shareholdings\/executive\/search","create":"\/shareholdings\/request\/create","update":"\/shareholdings\/request\/update","destroy":"\/shareholdings\/request\/destroy"},"actionMethods":{"create":"POST","destroy":"POST","read":"POST","update":"POST"},"reader":{"idProperty":"SHAREHOLDING_ID","type":"json","root":"data.items","totalProperty":"data.totalCount"},"writer":{"type":"json","root":"data","writeAllFields":true},
								extraParams: {
									SH_START_DATE: shareholding_start_date,
									SH_END_DATE: shareholding_end_date,
									SH_SORT_BY: shareholding_sort_by
								}},
							sorter: {"property":"SHAREHOLDING_ID","direction":"ASC"}});
						
						_storeShareholdings.load({
							callback: function() {
								var c = Ext.getCmp('main-content');
								var xyz = Math.random();
								if(!c.items.get('shareholdings-search-result-' + xyz)) {
									// Bottom Bar Panel Init :
									var comboBbar = new Ext.form.ComboBox({
									  name : 'perpage',
									  width: 50,
									  store: new Ext.data.ArrayStore({fields:['id'],data:[['25'],['50'],['75'],['100']]}),
									  mode : 'local',
									  value: '25',
									  listWidth     : 40,
									  triggerAction : 'all',
									  displayField  : 'id',
									  valueField    : 'id',
									  editable      : false,
									  forceSelection: true
									});
									
									var bbar = new Ext.PagingToolbar({
										store: _storeShareholdings,
										displayInfo: true,
										displayMsg: 'Displaying data {0} - {1} of {2}',
										emptyMsg: 'No data to display',
										items: [
										    '-',
										    'Records per page',
										    '-',
										    comboBbar
										]
									});
									
									comboBbar.on('select', function(combo, _records) {
										_storeShareholdings.pageSize = parseInt(_records[0].get('id'), 10);
										_storeShareholdings.loadPage(1);
									}, this);
									c.add({
										title: 'Shareholding Search Result',
										id: 'shareholdings-search-result-' + xyz,
										closable: true,
										autoScroll: true,
										bbar: bbar,
										items: [{
											xtype: 'gridpanel',
											border: false,
											autoScroll: true,
											store: _storeShareholdings,
											columns: [{
												text: 'Investor Name',
												dataIndex: 'INVESTOR_NAME',
												flex: 1
											},{
												text: 'Investor Status',
												width: 190,
												dataIndex: 'INVESTOR_STATUS'
											},{
												text: 'Account Holder',
												width: 290,
												dataIndex: 'ACCOUNT_HOLDER'
											},{
												text: 'Total',
												width: 120,
												dataIndex: 'AMOUNT',
												renderer: Ext.util.Format.numberRenderer('0.,/i')
											},{
												text: 'Percentage',
												width: 120,
												dataIndex: 'PERCENTAGE',
												align: 'center'
											}]
										}]
									});
								}
								c.setActiveTab('shareholdings-search-result-' + xyz);
								closeLoadingWindow();
							}
						});

						Ext.getCmp('shareholding-search-main').close();
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
}