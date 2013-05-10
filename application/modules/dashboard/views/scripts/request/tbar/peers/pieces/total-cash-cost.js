{
	title: 'Total Cash Cost (FOB)',
	xtype: 'gridpanel',
	border: false,
	id: 'peers-detail-total-cash-cost-' + data.PEER_ID,
    plugins: [new Ext.grid.plugin.RowEditing({clicksToMoveEditor: 1, autoCancel: false})],
    minHeight: grid_height,
    maxHeight: grid_height,
    autoScroll: true,
    store: storeFOB,
    columns: [{
    	text: 'Year',
    	align: 'center',
    	width: 70,
    	dataIndex: 'TITLE',
    	editor: {
    		xtype: 'textfield',
    		allowBlank: false
    	}
    },{
    	text: 'Ex. Royalty (IDR)',
    	flex: 1,
    	align: 'right',
    	dataIndex: 'ROYALTY_IDR',
    	renderer: Ext.util.Format.numberRenderer('0.,/i'),
    	editor: {
    		xtype: 'numberfield',
    		allowBlank: false,
    		minValue: 0
    	}
    },{
    	text: 'Ex. Royalty (USD)',
    	flex: 1,
    	align: 'right',
    	dataIndex: 'ROYALTY_USD',
    	renderer: Ext.util.Format.numberRenderer('0.,/i'),
    	editor: {
    		xtype: 'numberfield',
    		allowBlank: false,
    		minValue: 0
    	}
    },{
    	text: 'Total (IDR)',
    	flex: 1,
    	align: 'right',
    	dataIndex: 'TOTAL_IDR',
    	renderer: Ext.util.Format.numberRenderer('0.,/i'),
    	editor: {
    		xtype: 'numberfield',
    		allowBlank: false,
    		minValue: 0
    	}
    },{
    	text: 'Total (USD)',
    	flex: 1,
    	align: 'right',
    	dataIndex: 'TOTAL_USD',
    	renderer: Ext.util.Format.numberRenderer('0.,00/i'),
    	editor: {
    		xtype: 'numberfield',
    		allowBlank: false,
    		minValue: 0
    	}
    },{
    	text: 'Currency (1 USD)',
    	flex: 1,
    	align: 'right',
    	dataIndex: 'CURRENCY',
    	renderer: Ext.util.Format.numberRenderer('0.,00/i'),
    	editor: {
    		xtype: 'numberfield',
    		allowBlank: false,
    		minValue: 0
    	}
    }],
    bbar: new Ext.PagingToolbar({
        store: storeFOB,
        displayInfo: true,
        displayMsg: 'Displaying data {0} - {1} of {2}',
        emptyMsg: 'No data to display',
        items: [
            '-',
            'Records per page'
        ]
    }),
    tbar: [{
    	xtype: 'button',
    	text: 'Add New Total Cash Cost',
    	iconCls: 'icon-accept',
    	listeners: {
    		click: function() {
    			Ext.create('Ext.Window', {
    				title: 'Add New Total Cash Cost',
    				id: 'FOB',
    				draggable: false,
    				modal: true,
    				width: 300,
    				align: 'center',
    				resizable: false,
    				items: [{
    					xtype: 'panel',
    					border: false,
    					items: [{
    						xtype: 'form',
    						layout: 'form',
    						id: 'add-new-total-cash-cost-form',
    						border: false,
    						bodyPadding: '5 5 5 5',
    						defaultType: 'textfield',
    						waitMsgTarget: true,
    						fieldDefaults: {
    				            labelAlign: 'left',
    				            labelWidth: 160,
    				            anchor: '100%'
    				        },
    						items: [{
    							fieldLabel: 'Title',
    							allowBlank: false,
    							name: 'TITLE'
    						},{
    							fieldLabel: 'Ex. Royalty (IDR)',
    							allowBlank: false,
    							xtype: 'numberfield',
    							minValue: 0,
    							value: 0,
    							name: 'ROYALTY_IDR'
    						},{
    							fieldLabel: 'Ex. Royalty (USD)',
    							allowBlank: false,
    							xtype: 'numberfield',
    							minValue: 0,
    							value: 0,
    							name: 'ROYALTY_USD'
    						},{
    							fieldLabel: 'Total (IDR)',
    							allowBlank: false,
    							xtype: 'numberfield',
    							minValue: 0,
    							value: 0,
    							name: 'TOTAL_IDR'
    						},{
    							fieldLabel: 'Total (USD)',
    							allowBlank: false,
    							xtype: 'numberfield',
    							minValue: 0,
    							value: 0,
    							name: 'TOTAL_USD'
    						},{
    							fieldLabel: 'Currency 1 USD',
    							allowBlank: false,
    							xtype: 'numberfield',
    							minValue: 0,
    							value: 0,
    							name: 'CURRENCY'
    						}]
    					}],
    						buttons: [{
    							text: 'Save',
    							listeners: {
    								click: function() {
    									var form = Ext.getCmp('add-new-total-cash-cost-form').getForm();
    									var store = loadStore('TotalCashCosts');
    									
    									if(form.isValid()) {
    										form.submit({
                                                url: sd.baseUrl + '/totalcashcost/request/create/id/' + data.PEER_ID,
                                                success: function(_a, _b) {
                                                    //console.log(data);
                                                    var json = Ext.decode(_b.response.responseText);
                                                    form.reset();
                                                    store.load({
                                                        params: {
                                                            id: data.PEER_ID
                                                        }
                                                    }); // Refresh grid data
                                                    Ext.Msg.alert('Success', 'Data has been saved');
                                                    Ext.getCmp('FOB').close();
                                                },
                                                failure: function(_a, _b) {
                                                    //console.log(data);
                                                    var json = Ext.decode(_b.response.responseText);
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
    	text: 'Delete Total Cash Cost',
    	iconCls: 'icon-stop',
    	listeners: {
    		click: function() {
    			var _objGrid = Ext.getCmp('peers-detail-total-cash-cost-' + data.PEER_ID);
                var _objGridSelected = _objGrid.getSelectionModel().getSelection();
                if(_objGridSelected.length > 0) {
                	var _objData = _objGridSelected[0].data;
                    Ext.MessageBox.confirm('Confirm', 'Are you sure want to delete this data ?', function(btn) {
                        if(btn == 'yes') {
                            Ext.Ajax.request({
                                url: sd.baseUrl + storeFOB.proxy.api.destroy,
                                params: {
                                    id: _objData.TOTAL_CASHCOST_ID
                                },
                                success: function(_a, _b) {
                                    Ext.Msg.alert('Message','Data successfully deleted.');
                                    storeFOB.load();
                                },
                                failure: function(_a, _b) {
                                    var json = Ext.decode(_a.responseText);
                                    Ext.Msg.alert('Error', json.error_code + ': ' + json.error_message);
                                }
                            });
                        }
                    });
                } else {
                	Ext.Msg.alert('Error', 'You did not select any data.');
                }
    		}
    	}
    }]
}