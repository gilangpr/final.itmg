{
	title: 'Composition of the Company\'s Shareholders at the End of the Year',
	xtype: 'gridpanel',
	border: false,
	id: 'peers-detail-composition-company-' + data.PEER_ID,
    plugins: [new Ext.grid.plugin.RowEditing({clicksToMoveEditor: 1, autoCancel: false})],
    minHeight: grid_height,
    maxHeight: grid_height,
    autoScroll: true,
    store: storeCSY,
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
    	text: 'Republic of Indonesia',
    	flex: 1,
    	align: 'right',
    	dataIndex: 'REPUBLIC_OF_INDONESIA',
    	renderer: Ext.util.Format.numberRenderer('0.,/i'),
    	editor: {
    		xtype: 'numberfield',
    		allowBlank: false,
    		minValue: 0
    	}
    },{
    	text: 'Domestic Investor',
    	flex: 1,
    	align: 'right',
    	dataIndex: 'DOMESTIC_INVESTOR',
    	renderer: Ext.util.Format.numberRenderer('0.,/i'),
    	editor: {
    		xtype: 'numberfield',
    		allowBlank: false,
    		minValue: 0
    	}
    },{
    	text: 'Foreign Investor',
    	flex: 1,
    	align: 'right',
    	dataIndex: 'FOREIGN_INVESTOR',
    	renderer: Ext.util.Format.numberRenderer('0.,/i'),
    	editor: {
    		xtype: 'numberfield',
    		allowBlank: false,
    		minValue: 0
    	}
    }],
    bbar: new Ext.PagingToolbar({
        store: storeCSY,
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
    	text: 'Add New Composition Company',
    	iconCls: 'icon-accept',
    	listeners: {
    		click: function() {
    			Ext.create('Ext.Window', {
                    title: 'Add New Composition Company',
                    id: 'CSY',
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
                            id: 'add-new-composition-form',
                            border: false,
                            bodyPadding: '5 5 5 5',
                            defaultType: 'textfield',
                            waitMsgTarget: true,
                            fieldDefaults: {
    				            labelAlign: 'left',
    				            labelWidth: 150,
    				            anchor: '100%'
    				        },
                            items: [{
                                fieldLabel: 'Title',
                                allowBlank: false,
                                name: 'TITLE'
                            },{
                                fieldLabel: 'Republic Of Indonesia',
                                allowBlank: false,
                                name: 'REPUBLIC_OF_INDONESIA',
                                xtype: 'numberfield',
                                minValue: 0,
                                value: 0
                            },{
                                fieldLabel: 'Domestic Investors',
                                allowBlank: false,
                                name: 'DOMESTIC_INVESTOR',
                                xtype: 'numberfield',
                                minValue: 0,
                                value: 0
                            },{
                                fieldLabel: 'Foreign Investors',
                                allowBlank: false,
                                name: 'FOREIGN_INVESTOR',
                                xtype: 'numberfield',
                                minValue: 0,
                                value: 0
                            }]
                        }],
                        buttons: [{
                            text: 'Save',
                            listeners: {
                                click: function() {
                                    var form = Ext.getCmp('add-new-composition-form').getForm();

                                    if (form.isValid()) {
                                        form.submit({
                                            url: sd.baseUrl + '/compositioncompany/request/create/id/' + data.PEER_ID,
                                            success: function(_a, _b) {
                                                var json = Ext.decode(_b.response.responseText);
                                                form.reset();
                                                storeCSY.load(); // Refresh grid data
                                                Ext.Msg.alert('Success', 'Data has been saved');
                                                Ext.getCmp('CSY').close();
                                            },
                                            failure: function(_a, _b) {
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
    	text: 'Delete Composition Company',
    	iconCls: 'icon-stop',
    	listeners: {
    		click: function() {
    			var _objGrid = Ext.getCmp('peers-detail-composition-company-' + data.PEER_ID);
                var _objGridSelected = _objGrid.getSelectionModel().getSelection();
                if(_objGridSelected.length > 0) {
                    var _objData = _objGridSelected[0].data;
                    Ext.MessageBox.confirm('Confirm', 'Are you sure want to delete this data ?', function(btn) {
                        if(btn == 'yes') {
                            Ext.Ajax.request({
                                url: sd.baseUrl + storeCSY.proxy.api.destroy,
                                params: {
                                    id: _objData.COMPOSITION_COMPANY_ID
                                },
                                success: function(_a, _b) {
                                    Ext.Msg.alert('Message','Data successfully deleted.');
                                    storeCSY.load();
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