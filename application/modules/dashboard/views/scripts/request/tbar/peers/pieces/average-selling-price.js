{
	title: 'Average Selling Price',
	xtype: 'gridpanel',
	border: false,
	id: 'peers-detail-average-selling-price-' + data.PEER_ID,
    plugins: [new Ext.grid.plugin.RowEditing({clicksToMoveEditor: 1, autoCancel: false})],
    minHeight: grid_height,
    maxHeight: grid_height,
    autoScroll: true,
    store: storeASP,
    columns: [{
    	text: 'Year',
    	width: 80,
    	align: 'center',
        dataIndex: 'TITLE',
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
    	text: 'Value (IDR)',
    	align: 'right',
    	flex: 1,
        dataIndex: 'VALUE_IDR',
        renderer: Ext.util.Format.numberRenderer('0.,00/i'),
        editor: {
            xtype: 'numberfield',
            allowBlank: false,
            minValue: 0
        }
    },{
    	text: 'Value (USD)',
    	align: 'right',
    	flex: 1,
        dataIndex: 'VALUE_USD',
        renderer: Ext.util.Format.numberRenderer('0.,00/i'),
        editor: {
            xtype: 'numberfield',
            allowBlank: false,
            minValue: 0
        }
    }],
    bbar: new Ext.PagingToolbar({
        store: storeASP,
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
        text: 'Add New Average Selling Price',
        iconCls: 'icon-accept',
        listeners: {
            click: function() {
                Ext.create('Ext.Window', {
                    title: 'Add New Average Selling Price',
                    id: 'ASP',
                    draggable: false,
                    modal: true,
                    width: 300,
                    align: 'center',
                    resizable: false,
                    items: [{
                        xtype: 'panel',
                        border: false,
                        items: [{
                            xtype : 'form',
                            layout: 'form',
                            id    : 'add-average-selling-price-form',
                            border: false,
                            bodyPadding: '5 5 5 5',
                            defaultType: 'textfield',
                            waitMsgTarget: true,
                            items: [{
                                fieldLabel: 'Title',
                                allowBlank: false,
                                name: 'TITLE',
                            },{
                                fieldLabel: 'Type',
                                allowBlank: false,
                                xtype: 'combobox',
                                name: 'TYPE',
                                store: new Ext.data.ArrayStore({fields:['type'],data:[['Export'],['Domestic']]}),
                                mode : 'local',
                                value: 'Export',
                                listWidth : 40,
                                triggerAction : 'all',
                                displayField  : 'type',
                                valueField    : 'type',
                                editable      : false,
                                forceSelection: true
                            },{
                                fieldLabel: 'Value(IDR)',
                                allowBlank: false,
                                xtype: 'numberfield',
                                name: 'VALUE_IDR',
                                minValue: 0,
                                value: 0
                            },{
                                fieldLabel: 'Value(USD)',
                                allowBlank: false,
                                xtype: 'numberfield',
                                name: 'VALUE_USD',
                                minValue: 0,
                                value: 0
                            }]
                        }],
                        buttons: [{
                            text: 'Save',
                            listeners: {
                                click: function() {
                                    var form = Ext.getCmp('add-average-selling-price-form').getForm();
                                    var store = loadStore('SellingPrices');
                                    
                                    if(form.isValid()) {
                                        form.submit({
                                        url: sd.baseUrl + '/sellingprice/request/create/id/' + data.PEER_ID,
                                        success: function (_a, _b) {
                                            var json = Ext.decode(_b.response.responseText);
                                            form.reset();
                                            store.load();
                                            Ext.Msg.alert('Success', 'Data has been saved');
                                            Ext.getCmp('ASP').close();
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
                                click: function(){
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
        text: 'Delete Average Selling Price',
        iconCls: 'icon-stop',
        listeners: {
            click: function() {
                var _objGrid = Ext.getCmp('peers-detail-average-selling-price-' + data.PEER_ID);
                var _objGridSelected = _objGrid.getSelectionModel().getSelection();
                if(_objGridSelected.length > 0) {
                    var _objData = _objGridSelected[0].data;
                    Ext.MessageBox.confirm('Confirm', 'Are you sure want to delete this data ?', function(btn) {
                        if(btn == 'yes') {
                            Ext.Ajax.request({
                                url: sd.baseUrl + storeASP.proxy.api.destroy,
                                params: {
                                    id: _objData.SELLING_PRICE_ID
                                },
                                success: function(_a, _b) {
                                    Ext.Msg.alert('Message','Data successfully deleted.');
                                    storeASP.load();
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