var c = Ext.getCmp('<?php echo $this->container ?>');
var selected = c.getSelectionModel().getSelection();
Ext.require('Ext.chart.*');
Ext.require('Ext.layout.container.Fit');
if(selected.length > 0) {
	var id = 'investors-detail-' + selected[0].id;
	var cellEditing = Ext.create('Ext.grid.plugin.RowEditing', {
			clicksToMoveEditor: 1,
	        autoCancel: false
	    });
	var cellEditing2 = Ext.create('Ext.grid.plugin.RowEditing', {
			clicksToMoveEditor: 1,
	        autoCancel: false
	    });
	/*
	var storeSH = loadStore('Sectorholdings');
	storeSH.load({
	    params: {
		id: selected[0].data.INVESTOR_ID
	    }
	});
	var storePD = loadStore('Portfoliodistributions');
	storePD.load({
		params:{
		id:selected[0].data.INVESTOR_ID		
		}	
	});
	*/
	var storeMA = loadStore('Meetingactivities');
	storeMA.autoSync = true;
	storeMA.load({
		params:{
		id:selected[0].data.INVESTOR_ID		
		}	
	});
	var storeCO = loadStore('Contacts');
	storeCO.autoSync = true;
        storeCO.load({
            params: {
                id: selected[0].data.INVESTOR_ID
            }
        });
	if(!c.up().items.get(id)) {
		var data = selected[0].data;
		c.up().add(Ext.create('Ext.panel.Panel', {
			title: 'Detail : ' + data.COMPANY_NAME,
			layout: 'border',
			id: id,
			closable: true,
			autoScroll: true,
			items: [{
				region: 'north',
				border: false,
				title: 'Company Information',
				height: 168,
				bodyPadding: '5 5 5 5',
				collapsible: true,
				height: 140,
				bodyStyle: {
					'background-color': '#FFF'
				},
				html: '<div style="float:left;width: 50%;font-family: Arial;sans-serif">' + 
				'<div style="border-bottom: 1px solid #99bce8; color: #1b498b; padding: 4px;background-color: #deecfd;margin:-5px;margin-bottom: 4px;margin-right:0px;text-shadow: 0 1px 1px #aadffc;"><p style="font-size: 18px;font-weight: 800">Detail Investor : </p></div>' +
					'<table style="width: 100%">' +
						'<tr>' +
							'<td class="strong">Equity Asset (MM)</td><td style="width:10px;text-align:center">:</td><td>' + data.EQUITY_ASSETS + '</td>' +
						'</tr>' +
						'<tr>' + 
							'<td class="strong">Investor Type</td><td style="width:10px;text-align:center">:</td><td>' + data.INVESTOR_TYPE + '</td>' +
						'</tr>' +
						'<tr>' + 
							'<td class="strong">Style</td><td style="width:10px;text-align:center">:</td><td>' + data.STYLE + '</td>' +
						'</tr>' +
						'<tr>' + 
							'<td class="strong">Last Update</td><td style="width:10px;text-align:center">:</td><td>' + data.MODIFIED_DATE + '</td>' +
						'</tr>' +
					'</table>' +
				'</div>' + 
				'<div style="float:right;width:50%;font-family: Arial;sans-serif">' + 
					'<div style="border-bottom: 1px solid #99bce8; color: #1b498b; padding: 4px;background-color: #deecfd;margin:-5px;margin-bottom: 4px;text-shadow: 0 1px 1px #aadffc;"><p style="font-size: 18px;font-weight: 800">Company Address : </p></div>' +
					'<div style="float:left;width: 50%">' + 
						'<p style="text-align: justify">' + data.ADDRESS.replace('\n','<br/>') + '</p>' +
						'<p class="strong">' + data.LOCATION +'</p>' +
					'</div>' +
					'<div style="float:right;width: 50%">' +
						'<table style="width: 100%">' +
							'<tr>' +
								'<td style="width: 60px" class="strong">Phone 1</td><td style="width:10px;text-align:center">:</td><td>' + data.PHONE_1 + '</td>' +
							'</tr>' +
							'<tr>' +
								'<td class="strong">Phone 2</td><td style="width:10px;text-align:center">:</td><td>' + data.PHONE_2 + '</td>' +
							'</tr>' +
							'<tr>' +
								'<td class="strong">Fax</td><td style="width:10px;text-align:center">:</td><td>' + data.FAX + '</td>' +
							'</tr>' +
							'<tr>' +
								'<td class="strong">Website</td><td style="width:10px;text-align:center">:</td><td>' + data.WEBSITE + '</td>' +
							'</tr>' +
						'</table>' +
					'</div>' +
					'<br clear="all" />' +
				'</div>'
			},{
				title: 'Company Overview',
				region: 'north',
				bodyPadding: '5 5 5 5',
				collapsible: true,
				border: false,
				html: '<div style="min-height: 70px"><p style="text-align: justify">' + data.COMPANY_OVERVIEW.replace('\n','<br/><br/>') + '</p></div>'
			},{
				title: 'Investment Strategy',
				region: 'north',
				bodyPadding: '5 5 5 5',
				collapsible: true,
				border: false,
				html: '<div style="min-height: 70px"><p style="text-align: justify">' + data.INVESTMENT_STRATEGY.replace('\n','<br/>') + '</p></div>'
			},/*{	//chart Pie
				region: 'north',
				title: 'Sector Information',
				
				height: 300,
				bodyPadding: '5 5 5 5',
				items: [{
					    xtype: 'chart',
					    id: 'chartCmp',
					    animate: true,
					    width: 500,
					    //store: storeSH,
					    shadow: true,
					    legend: {
						position: 'right'
					    },
					    insetPadding: 60,
					    theme: 'Base:gradients',
					    series: [{
						type: 'pie',
						field: 'VALUE',
						showInLegend: true,
						donut: false,
						tips: {
						  trackMouse: true,
						  width: 140,
						  height: 28,
						   renderer: function(storeItem, item) {
						    //calculate percentage.
						    var total = 0;
						    storeSH.each(function(rec) {
							total += rec.get('VALUE');
						    });
						    this.setTitle(storeItem.get('TITLE') + ': ' + Math.round(storeItem.get('VALUE') / total * 100) + '%');
                  }
						},
						highlight: {
						  segment: {
						    margin: 20
						  }
						},
						label: {
						    field: 'TITLE',
						    display: 'rotate',
						    contrast: true,
						    font: '12px Arial'
						}
					    }]
				}]
				
			},//================END CHART PIE===================
			*/
				//Chart batang
				/*{
				region: 'north',
				title: 'Sector Information',
				height: 300,
				bodyPadding: '5 5 5 5',
				items: {
				    id: 'chartCmp',
				    xtype: 'chart',
				    style: 'background:#fff',
				    animate: true,
				    shadow: true,
				    store: storePD,
				    axes: [{
					type: 'Numeric',
					position: 'left',
					fields: ['VALUE'],
					label: {
					    renderer: Ext.util.Format.numberRenderer('0,0')
					},
					title: 'Number of Hits',
					grid: true,
					minimum: 0
				    }, {
					type: 'Category',
					position: 'bottom',
					fields: ['TITLE'],
					title: 'Sector Name'
				    }],
				    series: [{
					type: 'column',
					axis: 'left',
					highlight: true,
					tips: {
					  trackMouse: true,
					  width: 140,
					  height: 28,
					  renderer: function(storeItem, item) {
					    this.setTitle(storeItem.get('TITLE') + ': ' + storeItem.get('VALUE') + ' $');
					  }
					},
					label: {
					  display: 'insideEnd',
					  'text-anchor': 'middle',
					    field: 'VALUE',
					    renderer: Ext.util.Format.numberRenderer('0'),
					    orientation: 'vertical',
					    color: '#333'
					},
					xField: 'TITLE',
					yField: 'VALUE'
				    }]
				}
			}
			,*/
		    { //Key Person
		   //=========================================================
            title: 'Key Person',
            collapsible: true,
            border: false,
            xtype: 'gridpanel',
            store: storeCO,
		    id: 'contact-list-' + id,
		    plugins: [cellEditing],
		    region:'north',
            minHeight: 200,
            tbar: [{
                    xtype: 'button',
                    text: 'Add New Contacts',
                    iconCls: 'icon-accept',
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
														value: 'MAN',
														fieldLabel: 'Sex',
														boxLabel: 'Man'
                                            		},{
													 	xtype: 'radiofield',
													 	name: 'SEX',
													 	value: 'WOMAN',
													 	fieldLabel: '',
													 	labelSeparator: '',
													 	hideEmptyLabel: false,
													 	boxLabel: 'Woman'
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
                                                        var form = Ext.getCmp('add-new-contacts-form').getForm();
                                                        var store = loadStore ('Contacts');
                                                        
                                                        if (form.isValid()) {
                                                            form.submit({
                                                                url: sd.baseUrl + '/contacts/request/create/id/' + data.INVESTOR_ID,
                                                                success: function(d) {
                                                                    //console.log(data);
                                                                    var json = Ext.decode(d.responseText);
                                                                    form.reset();
                                                                    store.load({
                                                                        params: {
                                                                            id: data.INVESTOR_ID
                                                                        }
                                                                    }); // Refresh grid data
                                                                    Ext.Msg.alert('Success', 'Data has been saved');
                                                                    Ext.getCmp('CO').close();
                                                                },
                                                                failure: function(d) {
                                                                    //console.log(data);
                                                                    var json = Ext.decode(d.responseText);
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
		            },{//========Delete Contact
		                xtype: 'button',
		                text: 'Delete',
		                iconCls: 'icon-stop',
		                listeners: {
		                    click: function() {
								var c_contact = Ext.getCmp('contact-list-' + id);
								var contact_selected = c_contact.getSelectionModel().getSelection();
					
								if(contact_selected.length > 0) {
								var data2 = contact_selected[0].data;
								Ext.create('Ext.Window', {
									  html: 'Are you sure want do delete selected item(s) ?',
									  bodyPadding: '20 5 5 17',
									  title: 'Confirmation',
									  resizable: false,
									  modal: true,
									  closable: false,
									  draggable: false,
									  store:storeCO,
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
													id: data2.CONTACT_ID
													},
													success: function(d) {
													var json = Ext.decode(d.responseText); // Decode responsetext | Json to Javasript Object
													closeLoadingWindow();
													var storeCO = loadStore('Contacts');
													//store.loadPage(1);
													 storeCO.load({
                                                              params: {
                                                              id: data.INVESTOR_ID
                                                                        }
                                                                    });
													},
														failure: function(d) {
														var json = Ext.decode(d.responseText); // Decode responsetext | Json to Javasript Object
														closeLoadingWindow();
														}
													});
												    }
												}
						     			},		{
												text: 'No',
												listeners: {
												click: function() {
												this.up().up().close();
														}
													}
												}]
									}).show();
								} else {
								Ext.Msg.alert('Message', 'You did not select any Contact');
								}
		                    }
		                }
		            }],//Column Contacts
		            	columns: [{
					                flex: 1,
					                text: 'Name',
					                align: 'center',
					                dataIndex: 'NAME',
									index:0,
									editor: {
											//xtype: 'field',
											allowBlank: false,
											name:'NAME'
									}
					
		            			},{
					                flex: 1,
					                text: 'Position',
					                align: 'center',
					                dataIndex: 'POSITION',
									index:10,
									editor:{
											//xtype:'field',
											allowBlank:false,
											name:'POSITION'
									}
		            			},{
					                flex: 1,
					                text: 'Email',
					                align: 'center',
					                dataIndex: 'EMAIL',
									index:20,
									editor: {
											vtype: 'email',
											allowBlank: false,
											name:'EMAIL'
									}
		            			},{
					                flex: 1,
					                text: 'Phone',
					                align: 'right',
					                dataIndex: 'PHONE_1',
									index:30,
									editor:{
											//xtype:'field',
											allowBlank:false,
											name:'PHONE_1'
									}
		            			}]
            },
				//=============================================================
				//End Key Person
					
			{ //Meeting Activities
			//=============================================================
            title: 'Meeting Activities',
            collapsible: true,
            border: false,
            xtype: 'gridpanel',
            store: storeMA,
		    id: 'meetingactivitie-list-' + id,
		    plugins: [cellEditing2],
		    region:'north',
            minHeight: 200,
            tbar: [{//Add New Meeting Activities
                    xtype: 'button',
                    text: 'Add New Meeting Activities',
                    iconCls: 'icon-accept',
                    listeners: {
                            click: function() {
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
                               		buttons: [{//Save Meeting Activities
                            		    text: 'Save',
                              		    listeners: {
                                	   		click: function() {
												var form = Ext.getCmp('add-meetingactivities-form').getForm();
                                        		var store = loadStore ('Meetingactivities');
                                        
                                                if (form.isValid()) {
                                                    form.submit({
                                                      url: sd.baseUrl + '/meetingactivitie/request/create',
                                                        success: function(d) {
                                                            //console.log(data);
                                                            var json = Ext.decode(d.responseText);
                                                            form.reset();
                                                            store.load({
                                                                params: {
                                                                    id: data.INVESTOR_ID
                                                                }
                                                            }); // Refresh grid data
                                                            Ext.Msg.alert('Success', 'Data has been saved');
                                                            Ext.getCmp('MA').close();
                                                        },
                                                        failure: function(d) {
                                                            //console.log(data);
                                                            var json = Ext.decode(d.responseText);
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
                    },{//Detail Meeting
                        xtype: 'button',
                        text: 'Detail Meeting',
                        iconCls: 'icon-detail',
                        listeners: {
                            click: function() {
								<?php echo $this->render('/request/tbar/investors/detail-meeting.js');?>
                            }
                        }
			        },//===End Detail Meeting
			        {//Delete Button Meeting Act
                        xtype: 'button',
                        text: 'Delete',
                        iconCls: 'icon-stop',
                        listeners: {
                            click: function() {
								var d = Ext.getCmp('meetingactivitie-list-' + id);
								var selected = d.getSelectionModel().getSelection();
								var data3 = selected[0].data;
								if(selected.length > 0) {
									Ext.create('Ext.Window', {
										  html: 'Are you sure want do delete selected item(s) ?',
										  bodyPadding: '20 5 5 17',
										  title: 'Confirmation',
										  resizable: false,
										  modal: true,
										  closable: false,
										  draggable: false,
										  store:storeMA,
										  width: 300,
										  height: 120,
										  buttons: [{
													text: 'Yes',
													listeners: {
														click: function() {
															showLoadingWindow();
															this.up().up().close();
															Ext.Ajax.request({
																url: sd.baseUrl + '/meetingactivitie/request/destroy',
																params: {
																id: data3.MEETING_ACTIVITIE_ID
																},
															success: function(data) {
																var json = Ext.decode(data.responseText); // Decode responsetext | Json to Javasript Object
																closeLoadingWindow();
																var store = loadStore('Meetingactivities');
																//store.loadPage(1);
																 store.load({
								                                        params: {
								                                        id: data.INVESTOR_ID
								                                                                        }
								                                  });
															},
															failure: function(data) {
																var json = Ext.decode(data.responseText); // Decode responsetext | Json to Javasript Object
																closeLoadingWindow();
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
									Ext.Msg.alert('Message', 'You did not select any Meeting');
									}
                            }
                        }
                    }],
                    columns: [{
			              flex: 1,
			              text: 'Meeting Date',
						  dataIndex:'MEETING_DATE',
						  index:0,
						  editor:{
							  	xtype:'datefield',
							  	name:'MEETING_DATE',
							  	format:'Y-m-d',
							  	allowBlank: false
							}
                    	},{	
						  flex:1,
				          text: 'Meeting Event',
				          align: 'center',
						  dataIndex:'MEETING_EVENT',
						  index:10,
						  editor:{
							  	name:'MEETING_EVENT',
							  	allowBlank:false				
							}
                   		},{ 
						  flex:1,
		                  text: 'Start Time',
		                  align: 'center',
						  dataIndex:'START_TIME',
						  index:20,				
						  editor:{
						      	name:'START_TIME',
								xtype:'timefield',
								allowBlank:false
							}
						},{
						  flex:1,
					      text: 'End Time',
					      align: 'center',
						  dataIndex:'END_TIME',
						  index:30,
						  editor:{
								name:'END_TIME',
								xtype:'timefield',
								allowBlank:false				
							}
                    	}]
        }//===========================================================
		//End Meeting Activities
		]
		}));
	}
	c.up().setActiveTab(id);
} else {
	Ext.Msg.alert('Message', 'You did not select any Investor');
}

