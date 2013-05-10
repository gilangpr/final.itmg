{
    title: 'Stripping Ratio Year',
	xtype: 'gridpanel',
	border: false,
	id: 'peers-detail-stripping-ratio-year-' + data.PEER_ID,
    plugins: [new Ext.grid.plugin.RowEditing({clicksToMoveEditor: 1, autoCancel: false})],
    minHeight: grid_height,
    maxHeight: grid_height,
    autoScroll: true,
    store: storeSRY,
    columns: [{
    	text: 'Year',
    	flex: 1,
    	align: 'center',
    	dataIndex: 'TITLE',
    	editor: {
    		xtype: 'textfield',
    		allowBlank: false
    	}
    },{
    	text: 'Value',
    	flex: 1,
    	align: 'right',
    	dataIndex: 'VALUE',
        renderer: Ext.util.Format.numberRenderer('0.,00/i'),
    	editor: {
    		xtype: 'numberfield',
    		allowBlank: false,
    		minValue: 0
    	}
    }],
    bbar: new Ext.PagingToolbar({
		store: storeSRY,
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
		text: 'Add New Stripping Ratio Year',
		iconCls: 'icon-accept',
        listeners: {
            click: function() {
                Ext.create('Ext.Window', {
                    title: 'Add New Stripping Ratio Year',
                    id: 'SRY',
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
                            id: 'add-stripping-ratio-year-form',
                            border: false,
                            bodyPadding: '5 5 5 5',
                            defaultType: 'textfield',
                            waitMsgTarget: true,
                            items: [{
                                fieldLabel: 'Title',
                                allowBlank: false,
                                name      : 'TITLE'
                            },{
                                fieldLabel: 'Value',
                                allowBlank: false,
                                name      : 'VALUE',
                                xtype     : 'numberfield',
                                minValue  : 0,
                                value     : 0
                            }]
                        }],
                        buttons: [{
                            text: 'Save',
                            listeners: {
                                click: function() {
                                    var form = Ext.getCmp('add-stripping-ratio-year-form').getForm();
                                    var store = loadStore('StrippingRatioYears');
                                    
                                    if(form.isValid()) {
                                        form.submit({
                                        url: sd.baseUrl + '/strippingratioyear/request/create/id/' + data.PEER_ID,
                                        success: function(_a, _b) {
                                            var json = Ext.decode(_b.response.responseText);
                                            form.reset();
                                            storeSRY.load();
                                            Ext.Msg.alert('Success', 'Data has been saved');
                                            Ext.getCmp('SRY').close();
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
		text: 'Delete Stripping Ratio Year',
		iconCls: 'icon-stop',
        listeners: {
            click: function() {
                var _objGrid = Ext.getCmp('peers-detail-stripping-ratio-year-' + data.PEER_ID);
                var _objGridSelected = _objGrid.getSelectionModel().getSelection();
                if(_objGridSelected.length > 0) {
                    var _objData = _objGridSelected[0].data;
                    Ext.MessageBox.confirm('Confirm', 'Are you sure want to delete this data ?', function(btn) {
                        if(btn == 'yes') {
                            Ext.Ajax.request({
                                url: sd.baseUrl + storeSRY.proxy.api.destroy,
                                params: {
                                    id: _objData.STRIPPING_RATIO_YEAR_ID
                                },
                                success: function(_a, _b) {
                                    Ext.Msg.alert('Message','Data successfully deleted.');
                                    storeSRY.load();
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