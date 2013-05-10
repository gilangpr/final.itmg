{
	title: 'Financial Performance',
	xtype: 'gridpanel',
	border: false,
	id: 'peers-detail-financial-performance-' + data.PEER_ID,
    plugins: [new Ext.grid.plugin.RowEditing({clicksToMoveEditor: 1, autoCancel: false})],
    minHeight: grid_height,
    maxHeight: grid_height,
    autoScroll: true,
    store: storeFP,
    columns: [{
    	text: 'Year',
    	align: 'center',
    	flex: 1,
    	dataIndex: 'TITLE',
    	editor: {
    		xtype: 'textfield',
    		allowBlank: false
    	}
    }],
    bbar: new Ext.PagingToolbar({
        store: storeFP,
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
    	text: 'Add New Financial Performance',
    	iconCls: 'icon-accept',
    	listeners: {
    		click: function() {
    			Ext.create('Ext.Window', {
                    title: 'Add New Financial Performance',
                    id: 'FP',
                    draggable: false,
                    modal: true,
                    width: 360,
                    align: 'center',
                    resizable: false,
                    items: [{
                        xtype: 'panel',
                        border: false,
                        items: [{
                            xtype: 'form',
                            layout: 'form',
                            id: 'add-financial-performance-form',
                            border: false,
                            bodyPadding: '5 5 5 5',
                            defaultType: 'numberfield',
                            waitMsgTarget: true,
                            fieldDefaults: {
    				            labelAlign: 'left',
    				            labelWidth: 168,
    				            anchor: '100%',
    				        },
                            items: [{
                                xtype: 'textfield',
                                fieldLabel: 'Title',
                                allowBlank: false,
                                name: 'TITLE'
                            },{
                                fieldLabel: 'Revenues',
                                allowBlank: false,
                                xtype: 'numberfield',
                                minValue: 0,
                                name: 'REVENUE'
                            },{
                                fieldLabel: 'Gross Profit',
                                allowBlank: false,
                                xtype: 'numberfield',
                                minValue: 0,
                                name: 'GROSS_PROFIT'
                            },{
                                fieldLabel: 'EBIT',
                                allowBlank: false,
                                xtype: 'numberfield',
                                minValue: 0,
                                name: 'EBIT'
                            },{
                                fieldLabel: 'EBITDA',
                                allowBlank: false,
                                xtype: 'numberfield',
                                minValue: 0,
                                name: 'EBITDA'
                            },{
                                fieldLabel: 'Net Profit',
                                allowBlank: false,
                                xtype: 'numberfield',
                                minValue: 0,
                                name: 'NET_PROFIT'
                            },{
                                fieldLabel: 'Total Assets',
                                allowBlank: false,
                                xtype: 'numberfield',
                                minValue: 0,
                                name: 'TOTAL_ASSETS'
                            },{
                                fieldLabel: 'Cash',
                                allowBlank: false,
                                xtype: 'numberfield',
                                minValue: 0,
                                name: 'CASH'
                            },{
                                fieldLabel: 'Gross Profit Margin',
                                allowBlank: false,
                                minValue: 0,
                                name: 'GROSS_PROFIT_MARGIN'
                            },{
                                fieldLabel: 'EBIT Margin',
                                allowBlank: false,
                                xtype: 'numberfield',
                                minValue: 0,
                                name: 'EBIT_MARGIN'
                            },{
                                fieldLabel: 'Net Profit Margin',
                                allowBlank: false,
                                xtype: 'numberfield',
                                minValue: 0,
                                name: 'NET_PROFIT_MARGIN'
                            },{
                                fieldLabel: 'Return On Asset',
                                allowBlank: false,
                                xtype: 'numberfield',
                                minValue: 0,
                                name: 'RETURN_ASSET'
                            },{
                                fieldLabel: 'Return On Equity',
                                allowBlank: false,
                                xtype: 'numberfield',
                                minValue: 0,
                                name: 'RETURN_EQUITY'
                            },{
                                fieldLabel: 'Return On Investment',
                                allowBlank: false,
                                xtype: 'numberfield',
                                minValue: 0,
                                name: 'RETURN_INVESTMENT'
                            }]
                        }],
                        buttons: [{
                            text: 'Save',
                            listeners: {
                                click: function() {
                                    var form = Ext.getCmp('add-financial-performance-form').getForm();
                                    //var store = loadStore ('FinancialPerformances');
                                    if(form.isValid()) {
                                        form.submit({
                                        url: sd.baseUrl + '/financialperform/request/create/id/' + data.PEER_ID,
                                        success: function(_a, _b) {
                                            var json = Ext.decode(_b.response.responseText);
                                            storeFP.load();
                                            Ext.Msg.alert('Success', 'Data has been saved');
                                            Ext.getCmp('FP').close();
                                        },
                                        failure: function(_a, _b) {
                                                var json = Ext.decode(_b.response.responseText);
                                                Ext.Msg.alert('Error', json.error_code + ': ' + json.error_message);
                                            }
                                        });
                                    }    
                                    // if (form.isValid()) {
                                    //     form.submit({
                                    //     url: sd.baseUrl + '/financialperform/request/create/id/' + data.PEER_ID,
                                    //     success: function(d) {
                                    //         //console.log(data);
                                    //         var json = Ext.decode(d.responseText);
                                    //         form.reset();
                                    //         store.load({
                                    //                 params: {
                                    //                     id: data.PEER_ID
                                    //                 }
                                    //         }); // Refresh grid data
                                    //         Ext.Msg.alert('Success', 'Data has been saved');
                                    //         Ext.getCmp('FP').close();
                                    //     },
                                    //     failure: function(data) {
                                    //             //console.log(data);
                                    //             var json = Ext.decode(data.responseText);
                                    //             Ext.Msg.alert('Error', json.error_message);
                                    //         }
                                    //     }); 
                                    // }
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
    	text: 'Edit Financial Performance',
    	iconCls: 'icon-detail',
    	listeners: {
    		click: function() {
    			var _objGrid = Ext.getCmp('peers-detail-financial-performance-' + data.PEER_ID);
                var _objGridSelected = _objGrid.getSelectionModel().getSelection();
                if(_objGridSelected.length > 0) {
                	var _objData = _objGridSelected[0].data;
                	Ext.create('Ext.Window', {
	                    title: 'Edit Financial Performance',
	                    id: 'FP_EDIT',
	                    draggable: false,
	                    modal: true,
	                    width: 360,
	                    align: 'center',
	                    resizable: false,
	                    items: [{
	                        xtype: 'panel',
	                        border: false,
	                        items: [{
	                            xtype: 'form',
	                            layout: 'form',
	                            id: 'edit-financial-performance-form',
	                            border: false,
	                            bodyPadding: '5 5 5 5',
	                            defaultType: 'textfield',
	                            waitMsgTarget: true,
	                            fieldDefaults: {
	    				            labelAlign: 'left',
	    				            labelWidth: 168,
	    				            anchor: '100%'
	    				        },
	                            items: [{
	                                fieldLabel: 'Title',
	                                allowBlank: false,
	                                name: 'TITLE',
	                                value: _objData.TITLE,
	                                hidden: true
	                            },{
	                                fieldLabel: 'Revenues',
	                                allowBlank: false,
	                                xtype: 'numberfield',
	                                minValue: 0,
	                                name: 'REVENUE',
	                                value: _objData.REVENUE
	                            },{
	                                fieldLabel: 'Gross Profit',
	                                allowBlank: false,
	                                xtype: 'numberfield',
	                                minValue: 0,
	                                name: 'GROSS_PROFIT',
	                                value: _objData.GROSS_PROFIT
	                            },{
	                                fieldLabel: 'EBIT',
	                                allowBlank: false,
	                                xtype: 'numberfield',
	                                minValue: 0,
	                                name: 'EBIT',
	                                value: _objData.EBIT
	                            },{
	                                fieldLabel: 'EBITDA',
	                                allowBlank: false,
	                                xtype: 'numberfield',
	                                minValue: 0,
	                                name: 'EBITDA',
	                                value: _objData.EBITDA
	                            },{
	                                fieldLabel: 'Net Profit',
	                                allowBlank: false,
	                                xtype: 'numberfield',
	                                minValue: 0,
	                                name: 'NET_PROFIT',
	                                value: _objData.NET_PROFIT
	                            },{
	                                fieldLabel: 'Total Assets',
	                                allowBlank: false,
	                                xtype: 'numberfield',
	                                minValue: 0,
	                                name: 'TOTAL_ASSETS',
	                                value: _objData.TOTAL_ASSETS
	                            },{
	                                fieldLabel: 'Cash',
	                                allowBlank: false,
	                                xtype: 'numberfield',
	                                minValue: 0,
	                                name: 'CASH',
	                                value: _objData.CASH
	                            },{
	                                fieldLabel: 'Gross Profit Margin',
	                                allowBlank: false,
	                                xtype: 'numberfield',
	                                minValue: 0,
	                                name: 'GROSS_PROFIT_MARGIN',
	                                value: _objData.GROSS_PROFIT_MARGIN
	                            },{
	                                fieldLabel: 'EBIT Margin',
	                                allowBlank: false,
	                                xtype: 'numberfield',
	                                minValue: 0,
	                                name: 'EBIT_MARGIN',
	                                value: _objData.EBIT_MARGIN
	                            },{
	                                fieldLabel: 'Net Profit Margin',
	                                allowBlank: false,
	                                xtype: 'numberfield',
	                                minValue: 0,
	                                name: 'NET_PROFIT_MARGIN',
	                                value: _objData.NET_PROFIT_MARGIN
	                            },{
	                                fieldLabel: 'Return On Asset',
	                                allowBlank: false,
	                                xtype: 'numberfield',
	                                minValue: 0,
	                                name: 'RETURN_ASSET',
	                                value: _objData.RETURN_ASSET
	                            },{
	                                fieldLabel: 'Return On Equity',
	                                allowBlank: false,
	                                xtype: 'numberfield',
	                                minValue: 0,
	                                name: 'RETURN_EQUITY',
	                                value: _objData.RETURN_EQUITY
	                            },{
	                                fieldLabel: 'Return On Investment',
	                                allowBlank: false,
	                                xtype: 'numberfield',
	                                minValue: 0,
	                                name: 'RETURN_INVESTMENT',
	                                value: _objData.RETURN_INVESTMENT
	                            }]
	                        }],
	                        buttons: [{
	                            text: 'Save',
	                            listeners: {
	                                click: function() {
	                                    var form = Ext.getCmp('edit-financial-performance-form').getForm();
	                                    var store = loadStore ('FinancialPerformances');
	                                        
	                                    if (form.isValid()) {
	                                        form.submit({
	                                        	url: sd.baseUrl + '/financialperform/request/create/id/' + data.PEER_ID,
	                                        	success: function(d, e) {
		                                            //console.log(data);
		                                            var json = Ext.decode(e.response.responseText);
		                                            store.load(); // Refresh grid data
		                                            Ext.Msg.alert('Success', 'Data has been saved');
		                                            Ext.getCmp('FP_EDIT').close();
		                                        },
		                                        failure: function(d, e) {
		                                        	var json = Ext.decode(e.response.responseText);
		                                            Ext.Msg.alert('Error', json.error_code + ': ' + json.error_message);
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
                    Ext.Msg.alert('Error', 'You did not select any data.');
                }
    		}
    	}
    },{
    	xtype: 'button',
    	text: 'Delete Financial Performance',
    	iconCls: 'icon-stop',
    	listeners: {
    		click: function() {
    			var _objGrid = Ext.getCmp('peers-detail-financial-performance-' + data.PEER_ID);
                var _objGridSelected = _objGrid.getSelectionModel().getSelection();
                if(_objGridSelected.length > 0) {
                	var _objData = _objGridSelected[0].data;
                    Ext.MessageBox.confirm('Confirm', 'Are you sure want to delete this data ?', function(btn) {
                        if(btn == 'yes') {
                            Ext.Ajax.request({
                                url: sd.baseUrl + storeFP.proxy.api.destroy,
                                params: {
                                    id: _objData.FINANCIAL_PERFORM_ID
                                },
                                success: function(_a, _b) {
                                    Ext.Msg.alert('Message','Data successfully deleted.');
                                    storeFP.load();
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