{
	title: 'Coal Sales Distribution',
	xtype: 'gridpanel',
	border: false,
	id: 'peers-detail-coal-sales-distribution-' + data.PEER_ID,
    plugins: [new Ext.grid.plugin.RowEditing({clicksToMoveEditor: 1, autoCancel: false})],
    minHeight: grid_height,
    maxHeight: grid_height,
    autoScroll: true,
    store: storeCSD,
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
    	text: 'Country',
    	align: 'center',
    	flex: 1,
    	dataIndex: 'COUNTRY',
    	editor: {
    		xtype: 'textfield',
    		allowBlank: false
    	}
    },{
    	text: 'Type',
    	align: 'center',
    	flex: 1,
    	dataIndex: 'TYPE',
    	editor: {
    		xtype: 'textfield',
    		allowBlank: false
    	}
    },{
    	text: 'Volume',
    	align: 'right',
    	flex: 1,
    	dataIndex: 'VOLUME',
    	renderer: Ext.util.Format.numberRenderer('0.,/i'),
    	editor: {
    		xtype: 'numberfield',
    		allowBlank: false,
    		minValue: 0
    	}
    }],
    bbar: new Ext.PagingToolbar({
        store: storeCSD,
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
    	text: 'Add New Coal Sales',
    	iconCls: 'icon-accept',
    	listeners: {
    		click: function() {
    			Ext.create('Ext.Window', {
                    title: 'Add New Coal Sales Distribution',
                    id: 'CSD_BC',
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
                            id: 'add-new-coal-sales-country-form',
                            border: false,
                            bodyPadding: '5 5 5 5',
                            defaultType: 'textfield',
                            waitMsgTarget: true,
                            items: [{
                            	fieldLabel: 'Title',
                            	allowBlank: false,
                            	name: 'TITLE'
                            },{	
                            	fieldLabel: 'Country',
                                allowBlank: false,
                                name: 'COUNTRY'
                            },{
                            	fieldLabel: 'Type',
                            	allowBlank: false,
                            	xtype: 'combobox',
                            	store: new Ext.data.ArrayStore({fields:['type'],data:[['Export'],['Domestic']]}),
                            	mode : 'local',
                            	value: 'Domestic',
                            	listWidth : 40,
                            	triggerAction : 'all',
                            	displayField  : 'type',
                            	valueField    : 'type',
                            	editable      : false,
                            	forceSelection: true,
                            	name: 'TYPE'
                            },{
                                fieldLabel: 'Volume',
                                allowBlank: false,
                                name: 'VOLUME',
                                xtype: 'numberfield',
                                minValue: 0,
                                value: 0
                            }]
                        }],
                        buttons: [{
                            text: 'Save',
                            listeners: {
                                click: function() {
                                	var form = Ext.getCmp('add-new-coal-sales-country-form').getForm();
                                    var store = loadStore('CoalSalesDistributions');

                                    if (form.isValid()) {
                                        form.submit({
                                            url: sd.baseUrl + '/coalsales/request/create/id/' + data.PEER_ID,
                                            success: function (d, e) {
                                                var json = Ext.decode(e.response.responseText);
                                                form.reset();
                                                store.load();
                                                Ext.Msg.alert('Success', 'Data has been saved');
                                                Ext.getCmp('CSD_BC').close();
                                            },
                                            failure: function(d, e) {
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
    	text: 'Delete Coal Sales',
    	iconCls: 'icon-stop',
    	listeners: {
    		click: function() {
    			var _objGrid = Ext.getCmp('peers-detail-coal-sales-distribution-' + data.PEER_ID);
                var _objGridSelected = _objGrid.getSelectionModel().getSelection();
                if(_objGridSelected.length > 0) {
                    var _objData = _objGridSelected[0].data;
                    Ext.MessageBox.confirm('Confirm', 'Are you sure want to delete this data ?', function(btn) {
                        if(btn == 'yes') {
                            Ext.Ajax.request({
                                url: sd.baseUrl + storeCSD.proxy.api.destroy,
                                params: {
                                    id: _objData.COAL_SALES_DISTRIBUTION_ID
                                },
                                success: function(_a, _b) {
                                    Ext.Msg.alert('Message','Data successfully deleted.');
                                    storeCSD.load();
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