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
            	fieldLabel: 'Meeting Event <span style="color:red;">*</span>',
            	allowBlank: false,
                name: 'MEETING_EVENT'
            },{
             	xtype:'datefield',
                fieldLabel: 'Meeting Date <span style="color:red;">*</span>',
                allowBlank: false,
                name: 'MEETING_DATE',
                format:'Y-m-d'
            },{
             	xtype:'timefield',
                fieldLabel: 'Start Time <span style="color:red;">*</span>',
                allowBlank: false,
                name: 'START_TIME'
            },{
                xtype:'timefield',
                fieldLabel: 'End Time <span style="color:red;">*</span>',
                allowBlank: false,
                name: 'END_TIME'
            }]
        }],
        buttons: [{
            text: 'Save',
            listeners: {
	            click: function() {
		            var form = Ext.getCmp('add-meetingactivities-form').getForm();
		            if (form.isValid()) {
		                form.submit({
		                    url: sd.baseUrl + '/meetingactivitie/request/create',
		                    waitMsg: 'Saving data, please wait..',
		                    success: function(d, e) {
		                    	var json = Ext.decode(e.response.responseText);
		                    	form.reset();
			                    store.loadPage(1); // Refresh grid data
			                    Ext.Msg.alert('Success', 'Data has been saved');
			                    Ext.getCmp('MA').close();
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