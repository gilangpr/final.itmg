var _idx = 0;
var c = Ext.getCmp('<?php echo $this->container ?>');
var _id = 'investors-detailed-search-results-' + Math.random();
var _data = _store.data.items;
var maxWidth = 221;
var data = _data[_idx].data;
var id = _id;
var selected = _data;
storeIT = loadStore('InvestorTypes');
storeLOCATIONS = loadStore('Locations');

/*
 * Contacts
 */

var storeCO = Ext.create("Ext.data.Store", {
	model: "Contact",
	storeId: "Contacts",
	proxy:{extraParams:{id:_data[_idx].data.INVESTOR_ID},"type":"ajax","api":{"read":"\/contacts\/request\/read","create":"\/contacts\/request\/create","update":"\/contacts\/request\/update","destroy":"\/contacts\/request\/destroy"},"actionMethods":{"create":"POST","destroy":"POST","read":"POST","update":"POST"},"reader":{"idProperty":"CONTACT_ID","type":"json","root":"data.items","totalProperty":"data.totalCount"},"writer":{"type":"json","root":"data","writeAllFields":true}},
	sorter: {"property":"CONTACT_ID","direction":"ASC"}});

storeCO.load();

/*
 * End of : Contacts

/*
 * Meeting Investors
 */

var storeMI = Ext.create("Ext.data.Store", {
	model: "Meetinginvestor",
	storeId: "Meetinginvestors",
	proxy:{extraParams:{id:_data[_idx].data.INVESTOR_ID},"type":"ajax","api":{"read":"\/meetinginvestor\/request\/read","create":"\/meetinginvestor\/request\/create","update":"\/meetinginvestor\/request\/update","destroy":"\/meetinginvestor\/request\/destroy"},"actionMethods":{"create":"POST","destroy":"POST","read":"POST","update":"POST"},"reader":{"idProperty":"MEETING_INVESTOR","type":"json","root":"data.items","totalProperty":"data.totalCount"},"writer":{"type":"json","root":"data","writeAllFields":true}},
	sorter: {"property":"MEETING_INVESTOR","direction":"ASC"}});

storeMI.load();

/*
 * End of : Meeting Investors
 */

/*
 * Sector Holdings
 */

var storeSH = Ext.create('Ext.data.Store', {
	model: 'SectorHolding',
	storeId: 'SectorHoldings',
	proxy: {
		extraParams:{id:_data[_idx].data.INVESTOR_ID},
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
		extraParams:{id:_data[_idx].data.INVESTOR_ID},
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

storePD.load();

/*
 * End of : Portfolio Distributions
 */

c.up().add({
	title: 'Investors Detailed Search Result : ' + _data[_idx].data.COMPANY_NAME,
	closable: true,
	id: _id,
	autoScroll: true,
	tbar: [{
		xtype: 'button',
		text: 'Prev',
		id: _id + '-btn-left',
		iconCls: 'icon-left',
		listeners: {
			click: function() {
				var r = Ext.getCmp(_id + '-btn-right');
				var p = Ext.getCmp(_id + '-panel');
				r.enable();
				_idx--;
				if(_idx == 0) {
					this.disable();
				}
				p.setTitle(_data[_idx].data.COMPANY_NAME);
				Ext.getCmp(_id).setTitle('Investors Detailed Search Result : ' + _data[_idx].data.COMPANY_NAME);
				
				/* Detail Investor */
				
				Ext.getCmp(_id + '-equity-assets').setValue(_data[_idx].data.EQUITY_ASSETS);
				Ext.getCmp(_id + '-investor-type').setValue(_data[_idx].data.INVESTOR_TYPE);
				Ext.getCmp(_id + '-style').setValue(_data[_idx].data.STYLE);
				
				/* End of : Detail Investor */
				
				/* Company Address */
				
				Ext.getCmp(_id + '-address').setValue(_data[_idx].data.ADDRESS);
				Ext.getCmp(_id + '-location').setValue(_data[_idx].data.LOCATION);
				Ext.getCmp(_id + '-phone-1').setValue(_data[_idx].data.PHONE_1);
				Ext.getCmp(_id + '-phone-2').setValue(_data[_idx].data.PHONE_2);
				Ext.getCmp(_id + '-email-1').setValue(_data[_idx].data.EMAIL_1);
				Ext.getCmp(_id + '-email-2').setValue(_data[_idx].data.EMAIL_2);
				Ext.getCmp(_id + '-fax').setValue(_data[_idx].data.FAX);
				Ext.getCmp(_id + '-website').setValue(_data[_idx].data.WEBSITE);
				
				/* End of : Company Address */
				
				/* Company Overview */
				
				Ext.getCmp(_id + '-company-overview').setValue(_data[_idx].data.COMPANY_OVERVIEW);
				
				/* End of : Company Overview */
				
				/* Investment Strategy */
				
				Ext.getCmp(_id + '-investment-strategy').setValue(_data[_idx].data.INVESTMENT_STRATEGY);
				
				/* End of : Investment Strategy */
				
				data = _data[_idx].data;
				id = _id;
				selected = _data;
				
				storeSH.load({
					params: {
						id: data.INVESTOR_ID
					}
				});
				
				storePD.load({
					params: {
						id: data.INVESTOR_ID
					}
				});
				
				storeCO.load({
					params: {
						id: data.INVESTOR_ID
					}
				});
				
				storeMI.load({
					params: {
						id: data.INVESTOR_ID
					},
					callback: function() {
						closeLoadingWindow();
					}
				});
				
				showLoadingWindow();
			}
		}
	},{
		xtype: 'button',
		text: 'Next',
		id: _id + '-btn-right',
		iconCls: 'icon-right',
		iconAlign: 'right',
		listeners: {
			click: function() {
				var l = Ext.getCmp(_id + '-btn-left');
				var p = Ext.getCmp(_id + '-panel');
				l.enable();
				_idx++;
				if(_idx == _store.data.items.length - 1) {
					this.disable();
				}
				p.setTitle(_data[_idx].data.COMPANY_NAME);
				Ext.getCmp(_id).setTitle('Investors Detailed Search Result : ' + _data[_idx].data.COMPANY_NAME);
				
				/* Detail Investor */
				
				Ext.getCmp(_id + '-equity-assets').setValue(_data[_idx].data.EQUITY_ASSETS);
				Ext.getCmp(_id + '-investor-type').setValue(_data[_idx].data.INVESTOR_TYPE);
				Ext.getCmp(_id + '-style').setValue(_data[_idx].data.STYLE);
				
				/* End of : Detail Investor */
				
				/* Company Address */
				
				Ext.getCmp(_id + '-address').setValue(_data[_idx].data.ADDRESS);
				Ext.getCmp(_id + '-location').setValue(_data[_idx].data.LOCATION);
				Ext.getCmp(_id + '-phone-1').setValue(_data[_idx].data.PHONE_1);
				Ext.getCmp(_id + '-phone-2').setValue(_data[_idx].data.PHONE_2);
				Ext.getCmp(_id + '-email-1').setValue(_data[_idx].data.EMAIL_1);
				Ext.getCmp(_id + '-email-2').setValue(_data[_idx].data.EMAIL_2);
				Ext.getCmp(_id + '-fax').setValue(_data[_idx].data.FAX);
				Ext.getCmp(_id + '-website').setValue(_data[_idx].data.WEBSITE);
				
				/* End of : Company Address */
				
				/* Company Overview */
				
				Ext.getCmp(_id + '-company-overview').setValue(_data[_idx].data.COMPANY_OVERVIEW);
				
				/* End of : Company Overview */
				
				/* Investment Strategy */
				
				Ext.getCmp(_id + '-investment-strategy').setValue(_data[_idx].data.INVESTMENT_STRATEGY);
				
				/* End of : Investment Strategy */
				
				data = _data[_idx].data;
				id = _id;
				selected = _data;
				
				storeSH.load({
					params: {
						id: data.INVESTOR_ID
					}
				});
				
				storePD.load({
					params: {
						id: data.INVESTOR_ID
					}
				});
				
				storeCO.load({
					params: {
						id: data.INVESTOR_ID
					}
				});
				
				storeMI.load({
					params: {
						id: data.INVESTOR_ID
					}
				});
				
				storeMI.load({
					params: {
						id: data.INVESTOR_ID
					},
					callback: function() {
						closeLoadingWindow();
					}
				});
				
				showLoadingWindow();
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
		xtype: 'panel',
		title: _data[_idx].data.COMPANY_NAME,
		border: false,
		id: _id + '-panel',
		autoScroll: true,
		waitMsgTarget: true,
		maxWidth: Ext.getBody().getViewSize().width - maxWidth,
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
					id: _id + '-investors-detail-investor-form',
					bodyPadding: '5 5 5 5',
					items: [{
						xtype: 'numberfield',
						name: 'EQUITY_ASSETS',
						fieldLabel: 'Equity Assets',
						minValue: 0,
						value: _data[_idx].data.EQUITY_ASSETS,
						allowBlank: false,
						id: _id + '-equity-assets'
					},{
						xtype: 'combobox',
						name: 'INVESTOR_TYPE',
						fieldLabel: 'Investor Type',
						allowBlank: false,
						store: storeIT,
						displayField: 'INVESTOR_TYPE',
						value: _data[_idx].data.INVESTOR_TYPE,
						id: _id + '-investor-type'
					},{
						xtype: 'textfield',
						name: 'STYLE',
						fieldLabel: 'Style',
						value: _data[_idx].data.STYLE,
						allowBlank: false,
						id: _id + '-style'
					}],
					buttons: [{
						text: 'Update',
						iconCls: 'icon-accept',
						listeners: {
							click: function() {
								var form = Ext.getCmp(_id + '-investors-detail-investor-form').getForm();
								if(form.isValid()) {
									form.submit({
										url: sd.baseUrl + '/investors/request/update-detail',
										params: {
											id: _data[_idx].data.INVESTOR_ID,
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
					}]
				}]
			},{
				title: 'Company Address',
				border: false,
				style: {
					float: 'rigth',
					width: '50%'
				},
				items: [{
					xtype: 'form',
					layout: 'form',
					id: _id + '-investors-detail-company-address-form',
					bodyPadding: '5 5 5 5',
					border: false,
					items: [{
						xtype: 'htmleditor',
						fieldLabel: 'Address',
						name: 'ADDRESS',
						allowBlank: false,
						height: 150,
						value: _data[_idx].data.ADDRESS,
						id: _id + '-address'
					},{
						xtype: 'combobox',
						fieldLabel: 'Location',
						name: 'LOCATION',
						displayField: 'LOCATION',
						allowBlank: false,
						store: storeLOCATIONS,
						value: _data[_idx].data.LOCATION,
						id: _id + '-location'
					},{
						xtype: 'textfield',
						name: 'PHONE_1',
						fieldLabel: 'Phone #1',
						allowBlank: false,
						value: _data[_idx].data.PHONE_1,
						id: _id + '-phone-1'
					},{
						xtype: 'textfield',
						name: 'PHONE_2',
						fieldLabel: 'Phone #2',
						allowBlank: true,
						value: _data[_idx].data.PHONE_2,
						id: _id + '-phone-2'
					},{
						xtype: 'textfield',
						name: 'EMAIL_1',
						fieldLabel: 'Email #1',
						allowBlank: false,
						value: _data[_idx].data.EMAIL_1,
						id: _id + '-email-1'
					},{
						xtype: 'textfield',
						name: 'EMAIL_2',
						fieldLabel: 'Email #2',
						allowBlank: true,
						value: _data[_idx].data.EMAIL_2,
						id: _id + '-email-2'
					},{
						xtype: 'textfield',
						name: 'FAX',
						fieldLabel: 'Fax',
						allowBlank: false,
						value: _data[_idx].data.FAX,
						id: _id + '-fax'
					},{
						xtype: 'textfield',
						name: 'WEBSITE',
						fieldLabel: 'Website',
						allowBlank: true,
						value: _data[_idx].data.WEBSITE,
						id: _id + '-website'
					}]
				}],
				buttons: [{
					text: 'Update',
					iconCls: 'icon-accept',
					listeners: {
						click: function() {
							var form = Ext.getCmp(_id + '-investors-detail-company-address-form').getForm();
							if(form.isValid()) {
								form.submit({
									url: sd.baseUrl + '/investors/request/update-detail',
									params: {
										id: _data[_idx].data.INVESTOR_ID,
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
				}]
			}]
		},{
			region: 'north',
			title: 'Company Overview',
			border: false,
			maxWidth: Ext.getBody().getViewSize().width - maxWidth,
			items: [{
				xtype: 'form',
				layout: 'form',
				border: false,
				bodyPadding: '5 5 5 5',
				id: _id + '- investors-detail-company-overview-form',
				items: [{
					xtype: 'htmleditor',
					name: 'COMPANY_OVERVIEW',
					value: _data[_idx].data.COMPANY_OVERVIEW,
					minHeight: 160,
					allowBlank: false,
					id: _id + '-company-overview'
				}],
				buttons: [{
					text: 'Update',
					iconCls: 'icon-accept',
					listeners: {
						click: function() {
							var form = Ext.getCmp(_id + '- investors-detail-company-overview-form').getForm();
							if(form.isValid()) {
								form.submit({
									url: sd.baseUrl + '/investors/request/update-detail',
									waitMsg: 'Updating data, please wait..',
									params: {
										id: _data[_idx].data.INVESTOR_ID,
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
				}]
			}]
		},{
			region: 'north',
			title: 'Investment Strategy',
			border: false,
			maxWidth: Ext.getBody().getViewSize().width - maxWidth,
			items: [{
				xtype: 'form',
				layout: 'form',
				border: false,
				bodyPadding: '5 5 5 5',
				id: _id + '-investors-detail-investment-strategy-form',
				items: [{
					xtype: 'htmleditor',
					name: 'INVESTMENT_STRATEGY',
					value: _data[_idx].data.INVESTMENT_STRATEGY,
					minHeight: 160,
					allowBlank: false,
					id: _id + '-investment-strategy'
				}],
				buttons: [{
					text: 'Update',
					iconCls: 'icon-accept',
					listeners: {
						click: function() {
							var form = Ext.getCmp(_id + 'investors-detail-investment-strategy-form').getForm();
							if(form.isValid()) {
								form.submit({
									url: sd.baseUrl + '/investors/request/update-detail',
									waitMsg: 'Updating data, please wait..',
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
				autoScroll: true,
				id: _id + '-investors-detail-key-persons-grid',
				store: storeCO,
				bbar: new Ext.PagingToolbar({
					store: storeCO,
					displayInfo: true,
					displayMsg: 'Displaying data {0} - {1} of {2}',
					emptyMsg: 'No data to display',
					items: [
					    '-',
					    'Records per page'
					]
				}),
				columns: [{
					text: 'Name',
					flex: 1,
					dataIndex: 'NAME'
				},{
					text: 'Position',
					width: 200,
					align: 'center',
					dataIndex: 'POSITION'
				},{
					text: 'Email',
					width: 200,
					align: 'center',
					dataIndex: 'EMAIL'
				},{
					text: 'Phone',
					width: 200,
					align: 'center',
					dataIndex: 'PHONE_1'
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
                                    id: _id + '-add-new-contacts-form',
                                    border: false,
                                    bodyPadding: '5 5 5 5',
                                    defaultType: 'textfield',
                                    waitMsgTarget: true,
                                    items: [{
                                        fieldLabel: 'Name',
                                        allowBlank: false,
                                        name: 'NAME'
                            		},{
                                        fieldLabel: 'Phone 1',
                                        allowBlank: false,
                                        name: 'PHONE_1',
                              		},{
                                        fieldLabel: 'Phone 2',
                                        allowBlank: true,
                                        name: 'PHONE_2',
                                
                           			},{
										fieldLabel:'Email',
										//allowBlank:false,
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
										value: 'Male',
										fieldLabel: 'Sex',
										boxLabel: 'Male',
										checked: true
                            		},{
									 	xtype: 'radiofield',
									 	name: 'SEX',
									 	value: 'Female',
									 	fieldLabel: '',
									 	labelSeparator: '',
									 	hideEmptyLabel: false,
									 	boxLabel: 'Female'
	  								},{
                                        fieldLabel: 'Position',
                                        allowBlank: false,
                                        name: 'POSITION'
                            		}]
                       			}],
                                buttons: [{//===Save Contacts
                                    text: 'Save',
                                    listeners: {
                                        click: function() {
                                            var form = Ext.getCmp(_id + '-add-new-contacts-form').getForm();
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
				text: 'Delete Contact',
				iconCls: 'icon-stop',
				listeners: {
					click: function() {
						var __c = Ext.getCmp(_id + '-investors-detail-key-persons-grid');
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
													id: __data.CONTACT_ID
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
				id: 'investors-detail-meeting-investor-grid-' + _id,
				columns: [{
					text: 'Meeting Date',
					align: 'center',
					width: 100,
					dataIndex: 'MEETING_DATE'
				},{
					text: 'Meeting Event',
					flex: 1,
					dataIndex: 'MEETING_EVENT'
				},{
					text: 'Start Time',
					align: 'center',
					width: 150,
					dataIndex: 'START_TIME'
				},{
					text: 'End Time',
					align: 'center',
					width: 150,
					dataIndex: 'END_TIME'
				}]
			}],
			tbar: [{
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
                            		id: _id + '-add-meetinginvestors-form',
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
                            				var form = Ext.getCmp(_id + '-add-meetinginvestors-form').getForm();
                            				if (form.isValid()) {
                            					form.submit({
                            						url: sd.baseUrl + '/meetinginvestor/request/create/id' + data.INVESTOR_ID,
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
						var __c = Ext.getCmp('investors-detail-meeting-investor-grid-' + _id);
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
			},{
				//create meeting
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
		                                id: _id + '-add-meetingactivities-form',
		                                border: false,
		                                bodyPadding: '5 5 5 5',
		                                defaultType: 'textfield',
		                                waitMsgTarget: true,
		                                items: [{
											fieldLabel: 'Meeting Event',
											allowBlank: false,
											name: 'MEETING_EVENT'
										},{
											xtype:'datefield',
											fieldLabel: 'Meeting Date',
											allowBlank: false,
											name: 'MEETING_DATE',
											format:'Y-m-d'
										},{
											xtype:'timefield',
											fieldLabel: 'Start Time',
											allowBlank: false,
											name: 'START_TIME'
										},{
											xtype:'timefield',
											fieldLabel: 'End Time',
											allowBlank: false,
											name: 'END_TIME'
										}]
		                            }],
		                            buttons: [{
		                                text: 'Save',
		                                listeners: {
		                                	click: function() {
			                                 	var form = Ext.getCmp(_id + '-add-meetingactivities-form').getForm();
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
			}]
		}]
	}]
});
Ext.getCmp(_id + '-btn-left').disable();
var p = Ext.getCmp(_id + '-panel');
c.up().setActiveTab(_id);
p.setTitle(_data[_idx].data.COMPANY_NAME);