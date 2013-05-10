var _idx = 0;
var c = Ext.getCmp('<?php echo $this->container ?>');
var xid = 'investors-detail-' + Math.random();
var data = _store.data.items[_idx].data;
var selected = _store.data.items;
var cellEditing = Ext.create('Ext.grid.plugin.RowEditing', {
		clicksToMoveEditor: 1,
        autoCancel: false
    });
var cellEditing2 = Ext.create('Ext.grid.plugin.RowEditing', {
		clicksToMoveEditor: 1,
        autoCancel: false
    });
var cellEditing3 = Ext.create('Ext.grid.plugin.RowEditing', {
		clicksToMoveEditor: 1,
        autoCancel: false
    });
var cellEditing4 = Ext.create('Ext.grid.plugin.RowEditing', {
		clicksToMoveEditor: 1,
        autoCancel: false
    });

storeINVESTORS = loadStore('Investors');
storeIT = loadStore('InvestorTypes');
storeLOCATIONS = loadStore('Locations');

/*
 * Meeting Activities
 */

var storeMA = Ext.create("Ext.data.Store", {
	model: "Meetingactivitie",
	storeId: "Meetingactivities",
	proxy:{extraParams:{id:selected[0].data.INVESTOR_ID},"type":"ajax","api":{"read":"\/meetingactivitie\/request\/read","create":"\/meetingactivitie\/request\/create","update":"\/meetingactivitie\/request\/update","destroy":"\/meetingactivitie\/request\/destroy"},"actionMethods":{"create":"POST","destroy":"POST","read":"POST","update":"POST"},"reader":{"idProperty":"MEETING_ACTIVITIE_ID","type":"json","root":"data.items","totalProperty":"data.totalCount"},"writer":{"type":"json","root":"data","writeAllFields":true}},
	sorter: {"property":"MEETING_ACTIVITIE_ID","direction":"ASC"}});

storeMA.load();

/*
 * End of : Meeting Activities
 */

/*
 * Meeting Investors
 */

var storeMI = Ext.create("Ext.data.Store", {
	model: "Meetinginvestor",
	storeId: "Meetinginvestors",
	proxy:{extraParams:{id:selected[0].data.INVESTOR_ID},"type":"ajax","api":{"read":"\/meetinginvestor\/request\/read","create":"\/meetinginvestor\/request\/create","update":"\/meetinginvestor\/request\/update","destroy":"\/meetinginvestor\/request\/destroy"},"actionMethods":{"create":"POST","destroy":"POST","read":"POST","update":"POST"},"reader":{"idProperty":"MEETING_INVESTOR","type":"json","root":"data.items","totalProperty":"data.totalCount"},"writer":{"type":"json","root":"data","writeAllFields":true}},
	sorter: {"property":"MEETING_INVESTOR","direction":"ASC"}});

storeMI.load();

/*
 * End of : Meeting Investors
 */

/*
 * Contacts
 */

var storeCO = Ext.create("Ext.data.Store", {
	model: "Contact",
	storeId: "Contacts",
	proxy:{extraParams:{id:selected[0].data.INVESTOR_ID},"type":"ajax","api":{"read":"\/contacts\/request\/read","create":"\/contacts\/request\/create","update":"\/contacts\/request\/update","destroy":"\/contacts\/request\/destroy"},"actionMethods":{"create":"POST","destroy":"POST","read":"POST","update":"POST"},"reader":{"idProperty":"CONTACT_ID","type":"json","root":"data.items","totalProperty":"data.totalCount"},"writer":{"type":"json","root":"data","writeAllFields":true}},
	sorter: {"property":"CONTACT_ID","direction":"ASC"}});
storeCO.autoSync = true;
storeCO.load();

/*
 * End of : Contacts
 */

/*
 * Sector Holdings
 */

var storeSH = Ext.create('Ext.data.Store', {
	model: 'SectorHolding',
	storeId: 'SectorHoldings',
	proxy: {
		extraParams:{id:selected[0].data.INVESTOR_ID},
        "type": "ajax",
        "api": {
            "read": "\/sectorholdings\/request\/read",
            "create": "\/sectorholdings\/request\/create",
            "update": "\/sectorholdings\/request\/update",
            "destroy": "\/sectorholdings\/request\/destroy"
        },
        "actionMethods": {
            "create": "POST",
            "destroy": "POST",
            "read": "POST",
            "update": "POST"
        },
        "reader": {
            "idProperty": "TITLE",
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
        "property": "TITLE",
        "direction": "ASC"
    },
});
storeSH.autoSync= true;
storeSH.load();

/*
 * End of : Sector Holdings
 */

/*
 * Portfolio Distributions
 */

var storePD = Ext.create('Ext.data.Store', {
	model: 'PortfolioDistribution',
	storeId: 'PortfolioDistributions',
	proxy: {
		extraParams:{id:selected[0].data.INVESTOR_ID},
        "type": "ajax",
        "api": {
            "read": "\/portfoliodistribution\/request\/read",
            "create": "\/portfoliodistribution\/request\/create",
            "update": "\/portfoliodistribution\/request\/update",
            "destroy": "\/portfoliodistribution\/request\/destroy"
        },
        "actionMethods": {
            "create": "POST",
            "destroy": "POST",
            "read": "POST",
            "update": "POST"
        },
        "reader": {
            "idProperty": "TITLE",
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
        "property": "TITLE",
        "direction": "ASC"
    },
});
storePD.autoSync=true;
storePD.load();

/*
 * End of : Portfolio Distributions
 */

/*
 * Custom Attributes
 */

var storeCA = Ext.create('Ext.data.Store', {
	model: 'CustomAttribute',
	storeId: 'CustomAttributes',
	proxy: {
        "type": "ajax",
        "api": {
            "read": "\/customattributes\/request\/read",
            "create": "\/customattributes\/request\/create",
            "update": "\/customattributes\/request\/update",
            "destroy": "\/customattributes\/request\/destroy"
        },
        "actionMethods": {
            "create": "POST",
            "destroy": "POST",
            "read": "POST",
            "update": "POST"
        },
        "reader": {
            "idProperty": "TITLE",
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
        "property": "TITLE",
        "direction": "ASC"
    },
});

storeCA.load();

/*
 * End of : Custom Attributes
 */

if(!c.up().items.get(xid)) {
	var maxWidth = 221;
	c.up().add(Ext.create('Ext.panel.Panel', {
		title: 'Investors Detailed Search Result : ' + data.COMPANY_NAME,
		layout: 'border',
		id: xid,
		closable: true,
		autoScroll: true,
		waitMsgTarget: true,
		listeners: {
			render: function() {
				if(selected.length > 1) {
					Ext.getCmp(xid + '-btn-right').enable();
				}
			}
		},
		tbar:[{
			xtype: 'button',
			text: 'Prev',
			iconCls: 'icon-left',
			id: xid + '-btn-left',
			disabled: true,
			listeners: {
				click: function() {
					showLoadingWindow();
					var btn = Ext.getCmp(xid + '-btn-right');
					_idx--;
					btn.enable();
					if(_idx == 0) {
						this.disable();
					}
					data = selected[_idx].data;
					Ext.getCmp(xid).setTitle('Investors Detailed Search Result : ' + selected[_idx].data.COMPANY_NAME);
					
					/* Detail Investor */
					Ext.getCmp(xid + '-equity-asset').setValue(data.EQUITY_ASSETS);
					Ext.getCmp(xid + '-investor-type').setValue(data.INVESTOR_TYPE);
					Ext.getCmp(xid + '-style').setValue(data.STYLE);
					/* End of : Detail Investor */
					
					/* Company Address */
					
					Ext.getCmp(xid + '-address').setValue(data.ADDRESS);
					Ext.getCmp(xid + '-location').setValue(data.LOCATION);
					Ext.getCmp(xid + '-phone1').setValue(data.PHONE_1);
					Ext.getCmp(xid + '-phone2').setValue(data.PHONE_2);
					Ext.getCmp(xid + '-email1').setValue(data.EMAIL_1);
					Ext.getCmp(xid + '-email2').setValue(data.EMAIL_2);
					Ext.getCmp(xid + '-fax').setValue(data.FAX);
					Ext.getCmp(xid + '-website').setValue(data.WEBSITE);
					
					/* End of : Company Address */
					
					/* Company Overview */
					
					Ext.getCmp(xid + '-company-overview').setValue(data.COMPANY_OVERVIEW);
					
					/* End of : Company Overview */
					
					/* Investment Strategy */
					
					Ext.getCmp(xid + '-investment-strategy').setValue(data.INVESTMENT_STRATEGY);
					
					/* End of : Investment Strategy */
					storeMA.proxy.extraParams = {
						id: data.INVESTOR_ID	
					};
					storeMA.load({
						params: {
							id: data.INVESTOR_ID
						}
					});
					storeMI.proxy.extraParams = {
							id: data.INVESTOR_ID	
						};
					storeMI.load({
						params: {
							id: data.INVESTOR_ID
						}
					});
					storeCO.proxy.extraParams = {
							id: data.INVESTOR_ID	
						};
					storeCO.load({
						params: {
							id: data.INVESTOR_ID
						}
					});
					storeSH.proxy.extraParams = {
							id: data.INVESTOR_ID	
						};
					storeSH.load({
						params: {
							id: data.INVESTOR_ID
						}
					});
					storePD.proxy.extraParams = {
							id: data.INVESTOR_ID	
						};
					storePD.load({
						params: {
							id: data.INVESTOR_ID
						}
					});
					storeCA.proxy.extraParams = {
							id: data.INVESTOR_ID	
						};
					storeCA.load({
						params: {
							id: data.INVESTOR_ID
						},
						callback: function() {
							closeLoadingWindow();
						}
					});
				}
			}
		},{
			xtype: 'button',
			text: 'Next',
			iconCls: 'icon-right',
			iconAlign: 'right',
			id: xid + '-btn-right',
			listeners: {
				click: function() {
					showLoadingWindow();
					var btn = Ext.getCmp(xid + '-btn-left');
					_idx++;
					btn.enable();
					if(_idx == _store.data.items.length - 1) {
						this.disable();
					}
					data = selected[_idx].data;
					Ext.getCmp(xid).setTitle('Investors Detailed Search Result : ' + selected[_idx].data.COMPANY_NAME);
					
					/* Detail Investor */
					Ext.getCmp(xid + '-equity-asset').setValue(data.EQUITY_ASSETS);
					Ext.getCmp(xid + '-investor-type').setValue(data.INVESTOR_TYPE);
					Ext.getCmp(xid + '-style').setValue(data.STYLE);
					/* End of : Detail Investor */
					
					/* Company Address */
					
					Ext.getCmp(xid + '-address').setValue(data.ADDRESS);
					Ext.getCmp(xid + '-location').setValue(data.LOCATION);
					Ext.getCmp(xid + '-phone1').setValue(data.PHONE_1);
					Ext.getCmp(xid + '-phone2').setValue(data.PHONE_2);
					Ext.getCmp(xid + '-email1').setValue(data.EMAIL_1);
					Ext.getCmp(xid + '-email2').setValue(data.EMAIL_2);
					Ext.getCmp(xid + '-fax').setValue(data.FAX);
					Ext.getCmp(xid + '-website').setValue(data.WEBSITE);
					
					/* End of : Company Address */
					
					/* Company Overview */
					
					Ext.getCmp(xid + '-company-overview').setValue(data.COMPANY_OVERVIEW);
					
					/* End of : Company Overview */
					
					/* Investment Strategy */
					
					Ext.getCmp(xid + '-investment-strategy').setValue(data.INVESTMENT_STRATEGY);
					
					/* End of : Investment Strategy */
					
					storeMA.proxy.extraParams = {
							id: data.INVESTOR_ID	
						};
						storeMA.load({
							params: {
								id: data.INVESTOR_ID
							}
						});
						storeMI.proxy.extraParams = {
								id: data.INVESTOR_ID	
							};
						storeMI.load({
							params: {
								id: data.INVESTOR_ID
							}
						});
						storeCO.proxy.extraParams = {
								id: data.INVESTOR_ID	
							};
						storeCO.load({
							params: {
								id: data.INVESTOR_ID
							}
						});
						storeSH.proxy.extraParams = {
								id: data.INVESTOR_ID	
							};
						storeSH.load({
							params: {
								id: data.INVESTOR_ID
							}
						});
						storePD.proxy.extraParams = {
								id: data.INVESTOR_ID	
							};
						storePD.load({
							params: {
								id: data.INVESTOR_ID
							}
						});
						storeCA.proxy.extraParams = {
								id: data.INVESTOR_ID	
							};
						storeCA.load({
							params: {
								id: data.INVESTOR_ID
							},
							callback: function() {
								closeLoadingWindow();
							}
						});
				}
			}
		},{
			xtype: 'button',
			text: 'Print Page',
			iconCls: 'icon-print',
			listeners: {
				click: function() {
					//var myWindow = window.open('', '', 'width=900,height=900');
					window.open(sd.baseUrl + '/investors/request/print/id/' + data.INVESTOR_ID, '_blank');
				   
				}
			}
		}],
		items: [{
			region: 'north',
			maxWidth: Ext.getBody().getViewSize().width - maxWidth,
			border: false,
			items: [{
				title: 'Detail Investor',
				border: false,
				style: {
					float: 'left',
					width: '50%'
				},
				items: [{
					xtype: 'form',
					layout: 'form',
					border: false,
					id: 'investors-detail-investor-form-' + data.INVESTOR_ID,
					bodyPadding: '5 5 5 5',
					tbar: [{
						xtype: 'button',
						text: 'Update Detail Investor',
						iconCls: 'icon-accept',
						listeners: {
							click: function() {
								var form = Ext.getCmp('investors-detail-investor-form-' + data.INVESTOR_ID).getForm();
								if(form.isValid()) {
									form.submit({
										url: sd.baseUrl + '/investors/request/update-detail',
										params: {
											id: data.INVESTOR_ID,
											batch: 1,
											btype: 'detail-investor',
											type: 'batch'
										},
										waitMsg: 'Updating data, please wait..',
										success: function(d, e) {
											var json = Ext.decode(e.response.responseText);
											Ext.Msg.alert('Message', 'Update success.');
											storeINVESTORS.loadPage(storeINVESTORS.currentPage);
										},
										failure: function(d, e) {
											var json = Ext.decode(e.response.responseText);
											Ext.Msg.alert('Error', json.error_message);
										}
									});
								}
							}
						}
					}],
					items: [{
						xtype: 'numberfield',
						name: 'EQUITY_ASSETS',
						fieldLabel: 'Equity Assets <span style="color:red;">*</span>',
						minValue: 0,
						id: xid + '-equity-asset',
						value: data.EQUITY_ASSETS,
						allowBlank: false
					},{
						xtype: 'combobox',
						name: 'INVESTOR_TYPE',
						fieldLabel: 'Investor Type <span style="color:red;">*</span>',
						allowBlank: false,
						store: storeIT,
						id: xid + '-investor-type',
						displayField: 'INVESTOR_TYPE',
						value: data.INVESTOR_TYPE
					},{
						xtype: 'textfield',
						name: 'STYLE',
						id: xid + '-style',
						fieldLabel: 'Style <span style="color:red;">*</span>',
						value: data.STYLE,
						allowBlank: false
					}]
				}]
			},{
				title: 'Company Address',
				style: {
					float: 'rigth',
					width: '50%'
				},
				border: false,
				items: [{
					xtype: 'form',
					layout: 'form',
					id: 'investors-detail-company-address-form-' + data.INVESTOR_ID,
					bodyPadding: '5 5 5 5',
					border: false,
					tbar: [{
						xtype: 'button',
						text: 'Update Company Address',
						iconCls: 'icon-accept',
						listeners: {
							click: function() {
								var form = Ext.getCmp('investors-detail-company-address-form-' + data.INVESTOR_ID).getForm();
								if(form.isValid()) {
									form.submit({
										url: sd.baseUrl + '/investors/request/update-detail',
										params: {
											id: data.INVESTOR_ID,
											batch: 1,
											btype: 'company-address',
											type: 'batch'
										},
										waitMsg: 'Updating data, please wait..',
										success: function(d, e) {
											var json = Ext.decode(e.response.responseText);
											Ext.Msg.alert('Message', 'Update success.');
											storeINVESTORS.loadPage(storeINVESTORS.currentPage);
										},
										failure: function(d, e) {
											var json = Ext.decode(e.response.responseText);
											Ext.Msg.alert('Error', json.error_message);
										}
									});
								}
							}
						}
					}],
					items: [{
						xtype: 'htmleditor',
						fieldLabel: 'Address',
						name: 'ADDRESS',
						id: xid + '-address',
						allowBlank: false,
						height: 150,
						value: data.ADDRESS
					},{
						xtype: 'combobox',
						fieldLabel: 'Location <span style="color:red;">*</span>',
						name: 'LOCATION',
						id: xid + '-location',
						displayField: 'LOCATION',
						allowBlank: false,
						store: storeLOCATIONS,
						value: data.LOCATION
					},{
						xtype: 'textfield',
						name: 'PHONE_1',
						id: xid + '-phone1',
						fieldLabel: 'Phone 1 <span style="color:red;">*</span>',
						allowBlank: false,
						value: data.PHONE_1
					},{
						xtype: 'textfield',
						name: 'PHONE_2',
						id: xid + '-phone2',
						fieldLabel: 'Phone 2',
						allowBlank: true,
						value: data.PHONE_2
					},{
						xtype: 'textfield',
						name: 'EMAIL_1',
						id: xid + '-email1',
						fieldLabel: 'Email 1 <span style="color:red;">*</span>',
						allowBlank: false,
						value: data.EMAIL_1
					},{
						xtype: 'textfield',
						name: 'EMAIL_2',
						id: xid + '-email2',
						fieldLabel: 'Email 2',
						allowBlank: true,
						value: data.EMAIL_2
					},{
						xtype: 'textfield',
						name: 'FAX',
						id: xid + '-fax',
						fieldLabel: 'Fax',
						allowBlank: true,
						value: data.FAX
					},{
						xtype: 'textfield',
						name: 'WEBSITE',
						id: xid + '-website',
						fieldLabel: 'Website',
						allowBlank: true,
						value: data.WEBSITE
					}]
				}]
			}]
		},{
			region: 'north',
			title: 'Company Overview',
			border: false,
			maxWidth: Ext.getBody().getViewSize().width - maxWidth,
			tbar: [{
				xtype: 'button',
				text: 'Update Company Overview',
				iconCls: 'icon-accept',
				listeners: {
					click: function() {
						var form = Ext.getCmp('investors-detail-company-overview-form-' + data.INVESTOR_ID).getForm();
						if(form.isValid()) {
							form.submit({
								url: sd.baseUrl + '/investors/request/update-detail',
								waitMsg: 'Updateing data, please wait..',
								params: {
									id: data.INVESTOR_ID,
									type: 'COMPANY_OVERVIEW'
								},
								success: function(d, e) {
									var json = Ext.decode(e.response.responseText);
									Ext.Msg.alert('Message', 'Update success.');
									storeINVESTORS.loadPage(storeINVESTORS.currentPage);
								},
								failure: function(d, e) {
									var json = Ext.decode(e.response.responseText);
									Ext.Msg.alert('Error', json.error_message);
								}
							})
						}
					}
				}
			}],
			items: [{
				xtype: 'form',
				layout: 'form',
				border: false,
				bodyPadding: '5 5 5 5',
				id: 'investors-detail-company-overview-form-' + data.INVESTOR_ID,
				items: [{
					xtype: 'textarea',
					name: 'COMPANY_OVERVIEW',
					id: xid + '-company-overview',
					value: data.COMPANY_OVERVIEW,
					minHeight: 160,
					allowBlank: false,
					msgTarget:'under',
					maxLength:2000
				}]
			}]
		},{
			region: 'north',
			title: 'Investment Strategy',
			border: false,
			maxWidth: Ext.getBody().getViewSize().width - maxWidth,
			tbar: [{
				xtype: 'button',
				text: 'Update Investment Strategy',
				iconCls: 'icon-accept',
				listeners: {
					click: function() {
						var form = Ext.getCmp('investors-detail-investment-strategy-form-' + data.INVESTOR_ID).getForm();
						if(form.isValid()) {
							form.submit({
								url: sd.baseUrl + '/investors/request/update-detail',
								waitMsg: 'Updateing data, please wait..',
								params: {
									id: data.INVESTOR_ID,
									type: 'INVESTMENT_STRATEGY'
								},
								success: function(d, e) {
									var json = Ext.decode(e.response.responseText);
									Ext.Msg.alert('Message', 'Update success.');
									storeINVESTORS.loadPage(storeINVESTORS.currentPage);
								},
								failure: function(d, e) {
									var json = Ext.decode(e.response.responseText);
									Ext.Msg.alert('Error', json.error_message);
								}
							})
						}
					}
				}
			}],
			items: [{
				xtype: 'form',
				layout: 'form',
				border: false,
				bodyPadding: '5 5 5 5',
				id: 'investors-detail-investment-strategy-form-' + data.INVESTOR_ID,
				items: [{
					xtype: 'textarea',
					name: 'INVESTMENT_STRATEGY',
					id: xid + '-investment-strategy',
					value: data.INVESTMENT_STRATEGY,
					minHeight: 160,
					allowBlank: false,
					msgTarget:'under',
					maxLength:2000
				}]
			}]
		},{
			region: 'north',
			border: false,
			maxWidth: Ext.getBody().getViewSize().width - maxWidth,
			items: [
			<?php echo $this->render('/request/tbar/investors/chart-pie.js')?>,
			<?php echo $this->render('/request/tbar/investors/chart-line.js')?>]
		},{
			region: 'north',
			title: 'Key Persons',
			border: false,
			maxWidth: Ext.getBody().getViewSize().width - maxWidth,
			items: [{
				xtype: 'gridpanel',
				border: false,
				minHeight: 150,
				maxHeight: 150,
				plugins:[cellEditing2],
				autoScroll: true,
				id: 'investors-detail-key-persons-grid-' + data.INVESTOR_ID,
				store: storeCO,
				bbar: new Ext.PagingToolbar({
					store: storeCO,
					displayInfo: true,
					displayMsg: 'Displaying data {0} - {1} of {2}',
					emptyMsg: 'No data to display'
				}),
				columns: [{
					text: 'Name',
					flex: 1,
					dataIndex: 'NAME',
					editor:{
						name:'NAME'
					}
				},{
					text: 'Position',
					width: 200,
					align: 'center',
					dataIndex: 'POSITION',
					editor:{
						name:'POSITION'
					}
				},{
					text: 'Email',
					width: 200,
					align: 'center',
					dataIndex: 'EMAIL',
					editor:{
						name:'EMAIL',
						vtype:'email'
					}
				},{
					text: 'Phone',
					width: 200,
					align: 'center',
					dataIndex: 'PHONE_1',
					editor:{
						name:'PHONE_1'
					}
				}]
			}],
			tbar: [{
				xtype: 'button',
				text: 'Add New Contact',
				iconCls: 'icon-go',
				listeners: {
					click: function() {
						Ext.create('Ext.Window', {
                            title: 'Add New Contacts',
                            id: 'CO',
                            draggable: false,
                            modal: true,
                            width: 400,
                            align: 'center',
                            resizable: false,
                            items: [{
                                xtype: 'panel',
                                border: false,
                                items: [{
                                    xtype: 'form',
                                    layout: 'form',
                                    id: 'add-new-contacts-form',
                                    border: false,
                                    bodyPadding: '5 5 5 5',
                                    defaultType: 'textfield',
                                    waitMsgTarget: true,
                                    items: [{
                                        fieldLabel: 'Name <span style="color:red;">*</span>',
                                        allowBlank: false,
                                        name: 'NAME'
                            		},{
                                        fieldLabel: 'Phone 1 &nbsp<span style="color:red;">*</span>',
                                        allowBlank: false,
                                        name: 'PHONE_1',
                              		},{
                                        fieldLabel: 'Phone 2',
                                        allowBlank: true,
                                        name: 'PHONE_2',
                                
                           			},{
										fieldLabel:'Email <span style="color:red;">*</span>',
										allowBlank:false,
										name:'EMAIL',
										vtype:'email'					
									},{
				                        fieldLabel: 'Address',
										name: 'ADDRESS',
										xtype: 'htmleditor',
										height: 150
                       
                           			},{
                                        xtype: 'radiofield',
										name: 'SEX',
										inputValue: 'Male',
										fieldLabel: 'Sex',
										boxLabel: 'Male',
										//checked: true
                            		},{
									 	xtype: 'radiofield',
									 	name: 'SEX',
									 	inputValue: 'Female',
									 	fieldLabel: '',
									 	labelSeparator: '',
									 	hideEmptyLabel: false,
									 	boxLabel: 'Female'
	  								},{
                                        fieldLabel: 'Position <span style="color:red;">*</span>',
                                        allowBlank: false,
                                        name: 'POSITION'
                            		}]
                       			}],
                                buttons: [{//===Save Contacts
                                    text: 'Save',
                                    listeners: {
                                        click: function() {
                                            var form = Ext.getCmp('add-new-contacts-form').getForm();
                                            var store = loadStore ('Contacts');
                                            
                                            if (form.isValid()) {
                                                form.submit({
                                                    url: sd.baseUrl + '/contacts/request/create/id/' + data.INVESTOR_ID,
                                                    waitMsg: 'Saving new Key Person, please wait..',
                                                    success: function(d, e) {
                                                        var json = Ext.decode(e.response.responseText);
                                                        form.reset();
                                                        store.load({
                                                            params: {
                                                                id: data.INVESTOR_ID
                                                            }
                                                        });
                                                        Ext.Msg.alert('Success', 'Data has been saved');
                                                        Ext.getCmp('CO').close();
                                                    },
                                                    failure: function(d, e) {
                                                        //console.log(data);
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
                                            this.up().up().up().close();
                                        }
                                    }
                                }] 
                            }]
                        }).show();
					}
				}
			},{
				xtype: 'button',
				text: 'Edit Contact',
				iconCls: 'icon-accept',
				listeners: {
					click: function() {
						var __c = Ext.getCmp('investors-detail-key-persons-grid-' + data.INVESTOR_ID);
						var __selected = __c.getSelectionModel().getSelection();
						if(__selected.length > 0) {
							var __data = __selected[0].data;
							Ext.create('Ext.Window', {
	                            title: 'Edit Contacts',
	                            id: 'UCO',
	                            draggable: false,
	                            modal: true,
	                            width: 400,
	                            align: 'center',
	                            resizable: false,
	                            items: [{
	                                xtype: 'panel',
	                                border: false,
	                                items: [{
	                                    xtype: 'form',
	                                    layout: 'form',
	                                    id: 'edit-contacts-form',
	                                    border: false,
	                                    bodyPadding: '5 5 5 5',
	                                    defaultType: 'textfield',
	                                    waitMsgTarget: true,
	                                    items: [{
	                                        fieldLabel: 'Name <span style="color:red;">*</span>',
	                                        allowBlank: false,
	                                        name: 'NAME',
	                                        value:__data.NAME
	                            		},{
	                                        fieldLabel: 'Phone 1 &nbsp<span style="color:red;">*</span>',
	                                        allowBlank: false,
	                                        name: 'PHONE_1',
	                                        value:__data.PHONE_1
	                              		},{
	                                        fieldLabel: 'Phone 2',
	                                        allowBlank: true,
	                                        name: 'PHONE_2',
	                                		value:__data.PHONE_2
	                           			},{
											fieldLabel:'Email <span style="color:red;">*</span>',
											allowBlank:false,
											name:'EMAIL',
											vtype:'email',
											value:__data.EMAIL					
										},{
					                        fieldLabel: 'Address',
											name: 'ADDRESS',
											xtype: 'htmleditor',
											height: 150,
											value:__data.ADDRESS	                       
	                           			},{
	                                        xtype: 'radiofield',
											name: 'SEX',
											inputValue: 'Male',
											fieldLabel: 'Sex',
											boxLabel: 'Male',
											checked: true
	                            		},{
										 	xtype: 'radiofield',
										 	name: 'SEX',
										 	inputValue: 'Female',
										 	fieldLabel: '',
										 	labelSeparator: '',
										 	hideEmptyLabel: false,
										 	boxLabel: 'Female'
		  								},{
	                                        fieldLabel: 'Position <span style="color:red;">*</span>',
	                                        allowBlank: false,
	                                        name: 'POSITION',
	                                        value:__data.POSITION
	                            		}]
	                       			}],
	                                buttons: [{//===Save Contacts
	                                    text: 'Save',
	                                    listeners: {
	                                        click: function() {
	                                            var form = Ext.getCmp('edit-contacts-form').getForm();
	                                            var store = loadStore ('Contacts');
	                                            
	                                            if (form.isValid()) {
	                                                form.submit({
	                                                    url: sd.baseUrl + '/contacts/request/updating/',
	                                                    params:{
	                                                    	CONTACT_ID:__data.CONTACT_ID,
	                                                    	INVESTOR_ID:data.INVESTOR_ID
	                                                    },
	                                                    waitMsg: 'Saving Update Key Person, please wait..',
	                                                    success: function(d, e) {
	                                                        var json = Ext.decode(e.response.responseText);
	                                                        form.reset();
	                                                        store.load({
	                                                            params: {
	                                                                id: data.INVESTOR_ID
	                                                            }
	                                                        });
	                                                        Ext.Msg.alert('Success', 'Data has been saved');
	                                                        Ext.getCmp('UCO').close();
	                                                    },
	                                                    failure: function(d, e) {
	                                                        //console.log(data);
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
	                                            this.up().up().up().close();
	                                        }
	                                    }
	                                }] 
	                            }]
                        }).show();
						} else {
							Ext.Msg.alert('Error', 'You did not select any contact.');
						}
					}
				}
			},{
				xtype: 'button',
				text: 'Delete Contact',
				iconCls: 'icon-stop',
				listeners: {
					click: function() {
						var __c = Ext.getCmp('investors-detail-key-persons-grid-' + data.INVESTOR_ID);
						var __selected = __c.getSelectionModel().getSelection();
						if(__selected.length > 0) {
							var __data = __selected[0].data;
							Ext.create('Ext.Window', {
								html: 'Are you sure want do delete selected item(s) ?',
								bodyPadding: '20 5 5 17',
								title: 'Confirmation',
								resizable: false,
								modal: true,
								closable: false,
								draggable: false,
								width: 300,
								height: 120,
								buttons: [{
									text: 'Yes',
									listeners: {
										click: function() {
											showLoadingWindow();
											this.up().up().close();
											Ext.Ajax.request({
												url: sd.baseUrl + '/contacts/request/destroy',
												params: {
													id: __data.CONTACT_ID,
													INVESTOR_ID:data.INVESTOR_ID
												},
												success: function(d) {
													var json = Ext.decode(d.responseText); // Decode responsetext | Json to Javasript Object
													closeLoadingWindow();
													storeCO.load({
														params: {
															id: data.INVESTOR_ID
														}
													});
													Ext.Msg.alert('Message', 'Data successfully deleted.');
												},
												failure: function(d) {
													var json = Ext.decode(d.responseText); // Decode responsetext | Json to Javasript Object
													closeLoadingWindow();
													Ext.Msg.alert('Error', json.error_message);
												}
											});
										}
									}
								},{
									text: 'No',
									listeners: {
										click: function() {
											this.up().up().close();
										}
									}
								}]
							}).show();
						} else {
							Ext.Msg.alert('Error', 'You did not select any contact.');
						}
					}
				}
			}]
		},{
			region: 'north',
			title: 'Meeting Investor',
			border: false,
			maxWidth: Ext.getBody().getViewSize().width - maxWidth,
			items: [{
				xtype: 'gridpanel',
				border: false,
				minHeight: 150,
				maxHeight: 150,
				autoScroll: true,
				store: storeMI,
				id: 'investors-detail-meeting-investor-grid-' + xid,
				bbar: new Ext.PagingToolbar({
					store: storeMI,
					displayInfo: true,
					displayMsg: 'Displaying data {0} - {1} of {2}',
					emptyMsg: 'No data to display'
				}),
				columns: [{
					text: 'Meeting Date',
					align: 'center',
					width: 100,
					dataIndex: 'MEETING_DATE',
					renderer : Ext.util.Format.dateRenderer('d-m-Y'),
				},{
					text: 'Meeting Event',
					flex: 1,
					dataIndex: 'MEETING_EVENT'
				}/*,{
					text: 'Start Time',
					align: 'center',
					width: 150,
					dataIndex: 'START_TIME'
				},{
					text: 'End Time',
					align: 'center',
					width: 150,
					dataIndex: 'END_TIME'
				}*/,{
					text:'Name',
					flex:1,
					dataIndex:'NAME'
				},{
					text:'Initials',
					flex:1,
					dataIndex:'INITIAL_PART'
				}]
			}],
			tbar: [/*{
				xtype: 'button',
				text: 'Add New Meeting Investors',
				iconCls: 'icon-go',
				listeners: {
					click: function() {
						Ext.create('Ext.Window', {
							title: 'Add New Meeting Investors',
                            draggable: false,
		    				id: 'MI',
                            modal: true,
                            width: 400,
                            align: 'center',
                            resizable: false,
                            items: [{
                            	xtype: 'panel',
                            	border: false,
                            	items: [{
                            		xtype: 'form',
                            		layout: 'form',
                            		id: 'add-meetinginvestors-form',
                            		border: false,
                            		bodyPadding: '5 5 5 5',
                            		defaultType: 'textfield',
                            		waitMsgTarget: true,
                            		items: [{
                            			xtype: 'combobox',
                                        fieldLabel: 'Meeting Event',
                                        name: 'MEETING_ACTIVITIE_ID',
                                        labelWidth: 130,
                                        store: Ext.data.StoreManager.lookup('Meetingactivities'),
                                        displayField: 'MEETING_EVENT',
                                        valueField:'MEETING_ACTIVITIE_ID',
                                        typeAhead: true,
                                        allowBlank: false,
                                        minChars: 1,
                                        emptyText: 'Select Meeting Event'
                            		}]
                            	}],
                            	buttons: [{
                            		text: 'Save',
                            		listeners: {
                            			click: function() {
                            				var form = Ext.getCmp('add-meetinginvestors-form').getForm();
                            				if (form.isValid()) {
                            					form.submit({
                            						url: sd.baseUrl + '/meetinginvestor/request/create/id'+data.INVESTOR_ID,
                            						waitMsg: 'Saving data, please wait..',
                            						params: {
                            							id: data.INVESTOR_ID
                            						},
                            						success: function(d, e) {
                            							var json = Ext.decode(e.response.responseText);
                            							form.reset();
                            							var store = loadStore('Meetinginvestors');
                            							store.load({
                            								params: {
                            									id: data.INVESTOR_ID
                            								}
                            							});
                            							Ext.Msg.alert('Success', 'Data has been saved');
                            							Ext.getCmp('MI').close();
                            						},
                            						failure: function(d, e) {
                            							var json = Ext.decode(e.response.responseText);
                            							Ext.Msg.alert('Error','Sorry, data already exist');
                            						}
                            					});
                            				}
                            			}
                            		}
                            	},{
                            		text: 'Cancel',
                            		listeners: {
                            			click: function() {
                            				this.up().up().up().close();
                            			}
                            		}
                            	}]
                            }]
                        }).show();
					}
				}
			},*/
			{//create meeting
				xtype:'button',
				iconCls:'icon-go',
				text:'Create Meeting',
				listeners:{
					click:function(){
						Ext.create('Ext.Window', {
							title: 'Add New Meeting Activities',
							draggable: false,
							id: 'MA',
	                        modal: true,
	                        width: 400,
	                        align: 'center',
	                        resizable: false,
	                        items: [{
	                            xtype: 'panel',
	                            border: false,
	                            items: [{
	                                xtype: 'form',
	                                layout: 'form',
	                                id: 'add-meetingactivities-form',
	                                border: false,
	                                bodyPadding: '5 5 5 5',
	                                defaultType: 'textfield',
	                                waitMsgTarget: true,
	                                items: [{
										fieldLabel: 'Meeting Event <span style="color:red;">*</span>',
										allowBlank: false,
										name: 'MEETING_EVENT'
									},{
										xtype:'datefield',
										fieldLabel: 'Meeting Date <span style="color:red;">*</span>',
										allowBlank: false,
										name: 'MEETING_DATE',
										format:'Y-m-d'
									},{
										xtype:'timefield',
										fieldLabel: 'Start Time <span style="color:red;">*</span>',
										allowBlank: false,
										name: 'START_TIME'
									},{
										xtype:'timefield',
										fieldLabel: 'End Time <span style="color:red;">*</span>',
										allowBlank: false,
										name: 'END_TIME'
									}]
	                            }],
	                            buttons: [{
	                                text: 'Save',
	                                listeners: {
	                                	click: function() {
		                                 	var form = Ext.getCmp('add-meetingactivities-form').getForm();
			                                if (form.isValid()) {
			                                 	form.submit({
					                                 url: sd.baseUrl + '/meetingactivitie/request/cr',
					                                 waitMsg: 'Saving data, please wait..',
					                                 params: {
					                                 	id: data.INVESTOR_ID
			                                		 },
				                                	success: function(d, e) {
				                                 		var json = Ext.decode(e.response.responseText);
					                                 	form.reset();
					                                	var store = loadStore('Meetinginvestors');
					                                 	store.load({
						                                 	params: {
						                                		 id: data.INVESTOR_ID
						                                 	}
					                                	 });
					                                	Ext.Msg.alert('Success', 'Data has been saved');
					                                 	Ext.getCmp('MA').close();
				                                 	},
				                                	failure: function(d, e) {
				                                 	var json = Ext.decode(e.response.responseText);
				                                	 Ext.Msg.alert('Error','Sorry, data already exist');
				                                	}
			                                	});
			                                }
		                                }
		                            }
		                        },{
		                            text: 'Cancel',
		                            listeners: {
		                                click: function() {
		                            	    this.up().up().up().close();
		                                 }
		                            }
	                            }]
	                        }]
	                    }).show();
					}
				}

				//end create
			},{
				xtype: 'button',
				text: 'Detail Meeting',
				iconCls: 'icon-detail',
				listeners: {
					click: function() {
						<?php echo $this->render('/request/tbar/investors/meeting-gilang.js')?>
					}
				}
			},{
				xtype: 'button',
				text: 'Delete Meeting Investors',
				iconCls: 'icon-stop',
				listeners: {
					click: function() {
						var __c = Ext.getCmp('investors-detail-meeting-investor-grid-' + xid);
						var __sel = __c.getSelectionModel().getSelection();
						if(__sel.length > 0) {
							var __data = __sel[0].data;
							Ext.create('Ext.Window', {
								html: 'Are you sure want do delete selected item(s) ?',
								bodyPadding: '20 5 5 17',
								title: 'Confirmation',
								resizable: false,
								modal: true,
								closable: false,
								draggable: false,
								width: 300,
								height: 120,
								buttons: [{
									text: 'Yes',
									listeners: {
										click: function() {
											showLoadingWindow();
											this.up().up().close();
											Ext.Ajax.request({
												url: sd.baseUrl + '/meetinginvestor/request/destroy',
												params: {
													INVESTOR_ID: __data.INVESTOR_ID,
            										MEETING_ACTIVITIE_ID: __data.MEETING_ACTIVITIE_ID
												},
												success: function(d) {
													var json = Ext.decode(d.responseText); // Decode responsetext | Json to Javasript Object
													closeLoadingWindow();
													var store = loadStore('Meetinginvestors');
													store.load({
														params: {
															id: data.INVESTOR_ID
														}
													});
												},
												failure: function(d) {
													var json = Ext.decode(d.responseText); // Decode responsetext | Json to Javasript Object
													closeLoadingWindow();
													Ext.Msg.alert('Error', d.error_message);
												}
											});
										}
									}
								},{
									text: 'No',
									listeners: {
										click: function() {
											this.up().up().close();
										}
									}
								}]
							}).show();
						} else {
							Ext.Msg.alert('Error', 'You did not select any Meeting Investors.');
						}
					}
				}
			}]
		}]
	}));
}
c.up().setActiveTab(xid);
$('body').css('overflow','hidden');


/* Investment Strategy */

var hx = $('#investors-detail-investment-strategy-form-' + data.INVESTOR_ID).append('');