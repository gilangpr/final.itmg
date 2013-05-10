{//Add New Meeting Activities
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
                                                                failure: function(data) {
                                                                    //console.log(data);
                                                                    var json = Ext.decode(data.responseText);
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
                    }
