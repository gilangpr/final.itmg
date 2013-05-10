{
    title: 'Reserves & Resources',
    collapsible: true,
    border: false,
    xtype: 'gridpanel',
    plugins: [new Ext.grid.plugin.RowEditing({clicksToMoveEditor: 1, autoCancel: false})],
    minHeight: grid_height,
    maxHeight: grid_height,
    autoScroll: true,
    store: storeRR,
    id: 'rr-grid-' + data.PEER_ID,
    bbar: new Ext.PagingToolbar({
        store: storeRR,
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
        text: 'Add New Reserves & Resources',
        iconCls: 'icon-accept',
        listeners: {
            click: function() {
                Ext.create('Ext.Window', {
                    title: 'Add New Reserves & Resources',
                    id: 'RR',
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
                            id: 'add-new-reserves-resources-form',
                            border: false,
                            bodyPadding: '5 5 5 5',
                            defaultType: 'textfield',
                            waitMsgTarget: true,
                            items: [{
                                fieldLabel: 'Mine',
                                allowBlank: false,
                                name: 'MINE'                                             
                            },{
                                fieldLabel: 'Resources',
                                allowBlank: false,
                                name: 'RESOURCES',
                                xtype: 'numberfield',
                                minValue: 0,
                                value: 0
                            },{
                                fieldLabel: 'Reserves',
                                allowBlank: false,
                                name: 'RESERVES',
                                xtype: 'numberfield',
                                minValue: 0,
                                value: 0
                            },{
                                fieldLabel: 'Area',
                                allowBlank: false,
                                name: 'AREA',
                                xtype: 'numberfield',
                                minValue: 0,
                                value: 0
                            },{
                                fieldLabel: 'CV',
                                allowBlank: false,
                                name: 'CV'
                            },{
                                fieldLabel: 'Location',
                                allowBlank: false,
                                name: 'LOCATION'
                            },{
                                fieldLabel: 'License',
                                allowBlank: false,
                                name: 'LICENSE'
                            }]
                        }],
                        buttons: [{
                                text: 'Save',
                                listeners: {
                                    click: function() {
                                        var form = Ext.getCmp('add-new-reserves-resources-form').getForm();
                                        //var store = loadStore ('PeerResourceReserves');
                                        
                                        if(form.isValid()) {
                                        form.submit({
                                        url: sd.baseUrl + '/peerrs/request/create/id/' + data.PEER_ID,
                                        success: function(_a, _b) {
                                            var json = Ext.decode(_b.response.responseText);
                                            storeRR.load();
                                            Ext.Msg.alert('Success', 'Data has been saved');
                                            Ext.getCmp('RR').close();
                                        },
                                        failure: function(_a, _b) {
                                                var json = Ext.decode(_b.response.responseText);
                                                Ext.Msg.alert('Error', json.error_code + ': ' + json.error_message);
                                                }
                                            });
                                        }
                                        // if (form.isValid()) {
                                        //     form.submit({
                                        //         url: sd.baseUrl + '/peerrs/request/create/id/' + data.PEER_ID,
                                        //         success: function(_a, _b) {
                                        //             //console.log(data);
                                        //             var json = Ext.decode(_a.response.responseText);
                                        //             form.reset();
                                        //             store.load(); // Refresh grid data
                                        //             Ext.Msg.alert('Success', 'Data has been saved');
                                        //             Ext.getCmp('RR').close();
                                        //         },
                                        //         failure: function(_a, _b) {
                                        //             //console.log(data);
                                        //             var json = Ext.decode(_a.response.responseText);
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
        text: 'Delete',
        iconCls: 'icon-stop',
        listeners: {
            click: function() {
            	var _c = Ext.getCmp('rr-grid-' + data.PEER_ID);
            	var _selected = _c.getSelectionModel().getSelection();
            	if(_selected.length > 0) {
            		var _data = _selected[0].data;
                    Ext.MessageBox.confirm('Confirm', 'Are you sure want to delete this data ?', function(btn) {
                        if(btn == 'yes') {
                            Ext.Ajax.request({
                                  url: sd.baseUrl + '/peerrs/request/destroy',
                                  params: {
                                        id: _data.RESERVES_RESOURCES_ID
                                  },
                                  success: function(_a, _b) {
                                        var json = Ext.decode(_a.responseText);
                                        storeRR.load();
                                        Ext.Msg.alert('Message', 'Data successfully deleted.');
                                  },
                                  failure: function(_a) {
                                        var json = Ext.decode(_a.responseText);
                                        Ext.Msg.alert('Error', json.error_code + ': ' + json.error_message);
                                  }
                            });
                        }
                    });
            	} else {
            		Ext.Msg.alert('Error', 'You did not select any Mine.');
            	}
            }
        }
    }],
    columns: [{
        flex: 1,
        text: 'Mine',
        align: 'center',
        dataIndex: 'MINE',
        editor: {
        	xtype: 'textfield',
        	allowBlank: false,
        	minValue: 0
        }
    },{
        flex: 1,
        text: 'Resources <br /> (Mil. Tons)',
        align: 'center',
        dataIndex: 'RESOURCES',
        renderer: Ext.util.Format.numberRenderer('0.,00/i'),
        editor: {
        	xtype: 'numberfield',
        	allowBlank: false,
        	minValue: 0
        }
    },{
        flex: 1,
        text: 'Reserves <br /> (Mil. Tons)',
        align: 'center',
        dataIndex: 'RESERVES',
        renderer: Ext.util.Format.numberRenderer('0.,00/i'),
        editor: {
        	xtype: 'numberfield',
        	allowBlank: false,
        	minValue: 0
        }
    },{
        flex: 1,
        text: 'Area (Ha)',
        align: 'center',
        dataIndex: 'AREA',
        renderer: Ext.util.Format.numberRenderer('0.,00/i'),
        editor: {
        	xtype: 'numberfield',
        	allowBlank: false,
        	minValue: 0
        }
    },{
        flex: 1,
        text: 'CV (Kcal)',
        align: 'center',
        dataIndex: 'CV',
        editor: {
        	xtype: 'textfield',
        	allowBlank: false,
        	minValue: 0
        }
    },{
        flex: 1,
        text: 'Location',
        align: 'center',
        dataIndex: 'LOCATION',
        editor: {
        	xtype: 'textfield',
        	allowBlank: false,
        	minValue: 0
        }
    },{
        flex: 1,
        text: 'License',
        align: 'center',
        dataIndex: 'LICENSE',
        editor: {
        	xtype: 'textfield',
        	allowBlank: false,
        	minValue: 0
        }
    }]
}