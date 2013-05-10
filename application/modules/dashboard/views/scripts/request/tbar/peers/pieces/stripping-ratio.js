{
	title: 'Stripping Ratio',
	xtype: 'gridpanel',
	border: false,
	id: 'peers-detail-stripping-ratio-' + data.PEER_ID,
    plugins: [new Ext.grid.plugin.RowEditing({clicksToMoveEditor: 1, autoCancel: false})],
    minHeight: grid_height,
    maxHeight: grid_height,
    autoScroll: true,
    store: storeSR,
    columns: [{
    	text: 'Year',
    	width: 70,
    	align: 'center',
    	dataIndex: 'TITLE',
    	editor: {
    		xtype: 'textfield',
    		allowBlank: false
    	}
    },{
    	text: 'Sales Volume (Mil. Tons)',
    	flex: 1,
    	align: 'right',
    	dataIndex: 'SALES_VOLUME',
        renderer: Ext.util.Format.numberRenderer('0.,00/i'),
    	editor: {
    		xtype: 'numberfield',
    		minValue: 0,
    		allowBlank: false
    	}
    },{
    	text: 'Production Volume (Mil. Tons)',
    	flex: 1,
    	align: 'right',
    	dataIndex: 'PRODUCTION_VOLUME',
        renderer: Ext.util.Format.numberRenderer('0.,00/i'),
    	editor: {
    		xtype: 'numberfield',
    		minValue: 0,
    		allowBlank: false
    	}
    },{
    	text: 'Coal Transportation (Mil. Tons)',
    	flex: 1,
    	align: 'right',
    	dataIndex: 'COAL_TRANSPORT',
        renderer: Ext.util.Format.numberRenderer('0.,00/i'),
    	editor: {
    		xtype: 'numberfield',
    		minValue: 0,
    		allowBlank: false
    	}
    }],
    bbar: new Ext.PagingToolbar({
		store: storeSR,
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
		text: 'Add New Stripping Ratio',
		iconCls: 'icon-accept',
        listeners: {
            click: function() {
                Ext.create('Ext.Window', {
                    title: 'Add New Stripping Ratio',
                    id: 'SR',
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
                            id: 'add-stripping-ratio-form',
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
                                fieldLabel: 'Sales Volume',
                                allowBlank: false,
                                name: 'SALES_VOLUME',
                                xtype: 'numberfield',
                                minValue: 0,
                                value: 0
                            },{
                                fieldLabel: 'Production Volume',
                                allowBlank: false,
                                name: 'PRODUCTION_VOLUME',
                                xtype: 'numberfield',
                                minValue: 0,
                                value: 0
                            },{
                                fieldLabel: 'Coal Transportations',
                                allowBlank: false,
                                name: 'COAL_TRANSPORT',
                                xtype: 'numberfield',
                                minValue: 0,
                                value: 0
                            }]
                        }],
                        buttons: [{
                            text: 'Save',
                            listeners: {
                                click: function() {
                                    var form = Ext.getCmp('add-stripping-ratio-form').getForm();
                                    if(form.isValid()) {
                                        form.submit({
                                        url: sd.baseUrl + '/strippingratio/request/create/id/' + data.PEER_ID,
                                        success: function(_a, _b) {
                                            var json = Ext.decode(_b.response.responseText);
                                            storeSR.load();
                                            Ext.Msg.alert('Success', 'Data has been saved');
                                            Ext.getCmp('SR').close();
                                        },
                                        failure: function(_a, _b) {
                                                var json = Ext.decode(_b.response.responseText);
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
            }
        }
	},{
		xtype: 'button',
		text: 'Delete Stripping Ratio',
		iconCls: 'icon-stop',
		listeners: {
			click: function() {
				var _objGrid = Ext.getCmp('peers-detail-stripping-ratio-' + data.PEER_ID);
                var _objGridSelected = _objGrid.getSelectionModel().getSelection();
                if(_objGridSelected.length > 0) {
                    var _objData = _objGridSelected[0].data;
                    Ext.MessageBox.confirm('Confirm', 'Are you sure want to delete this data ?', function(btn) {
                        if(btn == 'yes') {
                            Ext.Ajax.request({
                                url: sd.baseUrl + storeSR.proxy.api.destroy,
                                params: {
                                    id: _objData.STRIPPING_RATIO_ID
                                },
                                success: function(_a, _b) {
                                    Ext.Msg.alert('Message','Data successfully deleted.');
                                    storeSR.load();
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