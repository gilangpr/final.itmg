var _storeInvestors = Ext.create("Ext.data.Store", {
	model: "Investor",
	storeId: "Investors_combobox",
	proxy:{"type":"ajax","api":{"read":"\/investors\/request\/read","create":"\/investors\/request\/create","update":"\/investors\/request\/update","destroy":"\/investors\/request\/destroy"},"actionMethods":{"create":"POST","destroy":"POST","read":"POST","update":"POST"},"reader":{"idProperty":"INVESTOR_ID","type":"json","root":"data.items","totalProperty":"data.totalCount"},"writer":{"type":"json","root":"data","writeAllFields":true}},
	sorter: {"property":"INVESTOR_ID","direction":"ASC"}});

var _storeLocations = Ext.create("Ext.data.Store", {
	model: "Location",
	storeId: "Locations_",
	proxy:{"type":"ajax","api":{"read":"\/locations\/request\/read","create":"\/locations\/request\/create","update":"\/locations\/request\/update","destroy":"\/locations\/request\/destroy"},"actionMethods":{"create":"POST","destroy":"POST","read":"POST","update":"POST"},"reader":{"idProperty":"LOCATION_ID","type":"json","root":"data.items","totalProperty":"data.totalCount"},"writer":{"type":"json","root":"data","writeAllFields":true}},
	sorter: {"property":"LOCATION_ID","direction":"ASC"}});

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
                emptyText: 'All',
                editable: false
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
				store: _storeLocations,
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
	}],
	buttons: [{
		text: 'Search',
		listeners: {
			click: function() {
				var form1 = Ext.getCmp('search-investor-form-left').getForm();
				var form2 = Ext.getCmp('search-investor-form-right').getForm();
				
				if(form1.isValid() && form2.isValid()) {
					var obj3 = {};
					var val1 = form1.getValues();
					var val2 = form2.getValues();
					var COMPANY_NAME = '';
					var CONTACT_PERSON = '';
					var EQUITY_ASSETS = '';
					var INVESTOR_TYPE = '';
					var LOCATION = '';
					var FORMAT = '';
					/* Form 1 */
					
					if(typeof(val1.COMPANY_NAME) !== 'undefined') {
						COMPANY_NAME = val1.COMPANY_NAME;
					}
					if(typeof(val1.CONTACT_PERSON) !== 'undefined') {
						CONTACT_PERSON = val1.CONTACT_PERSON;
					}
					EQUITY_ASSETS = val1.EQUITY_ASSETS;
					
					/* End of : Form 1*/
					
					/* Form 2 */
					
					if(typeof(val2.INVESTOR_TYPE) !== 'undefined') {
						INVESTOR_TYPE = val2.INVESTOR_TYPE;
					}
					
					if(typeof(val2.LOCATION) !== 'undefined') {
						LOCATION = val2.LOCATION;
					}
					
					FORMAT = val2.FORMAT;
					
					/* End of : Form 2 */
					
					var _store = Ext.create("Ext.data.Store", {
						model: "Investor",
						storeId: "Investors." + Math.random(),
						proxy:{
							extraParams: {
								TYPE: 'SEARCH',
								COMPANY_NAME: COMPANY_NAME,
								EQUITY_ASSETS: EQUITY_ASSETS,
								INVESTOR_TYPE: INVESTOR_TYPE,
								LOCATION: LOCATION,
								CONTACT_PERSON: val1.CONTACT_PERSON
							},
							"type":"ajax","api":{"read":"\/investors\/request\/search","create":"\/investors\/request\/create","update":"\/investors\/request\/update","destroy":"\/investors\/request\/destroy"},"actionMethods":{"create":"POST","destroy":"POST","read":"POST","update":"POST"},"reader":{"idProperty":"INVESTOR_ID","type":"json","root":"data.items","totalProperty":"data.totalCount"},"writer":{"type":"json","root":"data","writeAllFields":true}},
						sorter: {"property":"INVESTOR_ID","direction":"ASC"}});
					showLoadingWindow();
					_store.load({
						params: {
							TYPE: 'SEARCH',
							COMPANY_NAME: COMPANY_NAME,
							EQUITY_ASSETS: EQUITY_ASSETS,
							INVESTOR_TYPE: INVESTOR_TYPE,
							LOCATION: LOCATION,
							CONTACT_PERSON: val1.CONTACT_PERSON
						},
						callback: function() {
							if(_store.data.items.length > 0) {
								closeLoadingWindow();
								if(FORMAT == 'Detail') {
									Ext.getCmp('search-investor-main').close();
									<?php echo $this->render('/request/tbar/investors/search-detailed-new.js'); ?>
								} else {
									var c = Ext.getCmp('<?php echo $this->container ?>');
									var id = 'investors-search-result-' + Math.random();
									if(!c.up().items.get(id)) {
										c.up().add({
											xtype: 'gridpanel',
											title: 'Investor Search Result',
											id: id,
											closable: true,
											store: _store,
											tbar: [{
												xtype: 'button',
												text: 'Detail Investor',
												iconCls: 'icon-detail',
												listeners: {
													click: function() {
														var _objGrid = Ext.getCmp(id);
														var selected = _objGrid.getSelectionModel().getSelection();
														if(selected.length > 0) {
															var xid = 'investors-detail-' + selected[0].id;
															var data = selected[0].data;
															<?php echo $this->render('/request/tbar/investors/detail-core.js'); ?>
														} else {
															Ext.Msg.alert('Error', 'You did not select any investor.');
														}
													}
												}
											},{
												xtype: 'button',
												text: 'Delete Investor',
												iconCls: 'icon-stop',
												listeners: {
													click: function() {
														var _objGrid = Ext.getCmp(id);
														var _objSelected = _objGrid.getSelectionModel().getSelection();
														if(_objSelected.length > 0) {
															Ext.MessageBox.confirm('Confirmation','Are you sure want to delete this investor ?', function(btn) {
																if(btn == 'yes') {
																	showLoadingWindow();
																	Ext.Ajax.request({
																		url: sd.baseUrl + '/investors/request/destroy',
																		params: _objSelected[0].data,
																		success: function(data) {
																			var json = Ext.decode(data.responseText); // Decode responsetext | Json to Javasript Object
																			closeLoadingWindow();
																			_store.loadPage(1);
																			var s = loadStore('Investors');
																			s.loadPage(s.currentPage);
																		},
																		failure: function(data) {
																			var json = Ext.decode(data.responseText); // Decode responsetext | Json to Javasript Object
																			closeLoadingWindow();
																		}
																	});
																}
															});
														} else {
															Ext.Msg.alert('Error', 'You did not select any investor.');
														}
													}
												}
											}],
											columns: [{
												text: 'Company Name',
												flex: 1,
												dataIndex: 'COMPANY_NAME'
											},{
												text: 'Style',
												width: 110,
												align: 'center',
												dataIndex: 'STYLE'
											},{
												text: 'Investor Type',
												width: 244,
												dataIndex: 'INVESTOR_TYPE'
											},{
												text: 'Equity Asset',
												width: 120,
												align: 'center',
												dataIndex: 'EQUITY_ASSETS',
												renderer: Ext.util.Format.numberRenderer('0.00,/i')
											},{
												text: 'Office Location',
												width: 150,
												align: 'center',
												dataIndex: 'LOCATION'
											},{
												text: 'Last Update',
												width: 150,
												align: 'center',
												dataIndex: 'MODIFIED_DATE'
											}],
											bbar: new Ext.PagingToolbar({
										        store: _store,
										        displayInfo: true,
										        displayMsg: 'Displaying data {0} - {1} of {2}',
										        emptyMsg: 'No data to display',
										        items: [
										            '-',
										            'Records per page',
										            '-',
										            new Ext.form.ComboBox({
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
													  forceSelection: true,
													  listeners: {
													  	select: function(combo, _records) {
													  		_store.pageSize = parseInt(_records[0].get('id'), 10);
													  		_store.loadPage(1);
													  	}
													  }
													})
										        ]
											})
										});
									}
									c.up().setActiveTab(id);
									Ext.getCmp('search-investor-main').close();
								}
								Ext.Msg.alert('Message', _store.data.items.length + ' data(s) found.');
							} else {
								closeLoadingWindow();
								Ext.getCmp('search-investor-main').close();
								Ext.Msg.alert('Message', 'Sorry, no data found.');
							}
						}
					});
				}
			}
		}
	},{
		text: 'Cancel',
		listeners: {
			click: function() {
				Ext.getCmp('search-investor-main').close();
			}
		}
	}]
}).show();