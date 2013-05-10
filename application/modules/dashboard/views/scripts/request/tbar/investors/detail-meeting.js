var c_meeting = Ext.getCmp('meetingactivitie-list-' + id);
var meeting_sel = c_meeting.getSelectionModel().getSelection();

    
if(meeting_sel.length > 0) {
	var meeting_data = meeting_sel[0].data;

    var storeMD = loadStore('Meetingdocumentations');
    storeMD.autoSync = true;
    storeMD.load({
        params:{
        id:meeting_data.MEETING_ACTIVITIE_ID     
        }   
    });
    var storeMP = loadStore('Meetingparticipants');
    storeMP.autoSync = true;
    storeMP.load({
        params:{
        id:meeting_data.MEETING_ACTIVITIE_ID     
        }   
    });
    var storeCO = loadStore('Contacts');
   
	var meeting_id = 'investors-meeting-detail-' + meeting_data.MEETING_ACTIVITIE_ID;
	if(!c.up().items.get(meeting_id)) {
        
        
		c.up().add({
			title: 'Meeting Detail : ' + meeting_data.MEETING_EVENT,
			closable: true,
			id: meeting_id,
			xtype: 'panel',
            layout: 'border',
            autoScroll: true,
            border: false,
            items:[{
            		title: 'Meeting Contacts',
                    collapsible: true,
                    border: false,
                    region:'north',
                    xtype: 'gridpanel',
                    //store: storeCO,
                    id: 'contact-meeting-list-' + id,
                    autoScroll:true,
                    minHeight: 200,
                    tbar:[{
                    	xtype:'button',
                    	text:'Add New Meeting Contacts',
                    	iconCls:'icon-accept',
                    	listeners:{
                    		click:function(){
                                Ext.create('Ext.Window', {
                                    title: 'Add New Meeting Contacts',
                                    id: 'CO',
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
                                            id: 'add-new-meeting-contacts-form',
                                            border: false,
                                            bodyPadding: '5 5 5 5',
                                            defaultType: 'textfield',
                                            waitMsgTarget: true,
                                            items: [{
                                                xtype: 'combobox',
                                                fieldLabel: 'Contacts',
                                                name: 'CONTACT_ID',
                                                labelWidth: 130,
                                                store: Ext.data.StoreManager.lookup('Contacts'),
                                                displayField: 'NAME',
                                                valueField:'CONTACT_ID',
                                                typeAhead: true,
                                                allowBlank: false,
                                                minChars: 1,
                                                emptyText: 'Select Contact'
                                            }]
                                        }],
                                        buttons: [{//===Save Contacts
                                                text: 'Save',
                                                listeners: {
                                                    click: function() {
                                                        var form = Ext.getCmp('add-new-meeting-contacts-form-contacts-form').getForm();
                                                        var store = loadStore ('Meetingcontacts');
                                                        
                                                        if (form.isValid()) {
                                                            form.submit({
                                                                url: sd.baseUrl + '/contacts/request/create/id/' + data.INVESTOR_ID,
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
                                                                    Ext.getCmp('CO').close();
                                                                },
                                                                failure: function(d) {
                                                                    //console.log(data);
                                                                    var json = Ext.decode(d.responseText);
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
                    	xtype:'button',
                    	text:'Delete Meeting Contacts',
                    	iconCls:'icon-stop',
                    	listeners:{
                    		click:function(){

                    		}
                    	}
                    }],
                    columns:[{
                    	text:'Meeting Event'

                    },{
                    	text:'Contacts'
                    },{
                    	text:'Created Date'
                    }]
            },{
            	title:'ITM Participants Meeting : '+meeting_data.MEETING_EVENT,
            	collapsible:true,
            	border:false,
            	region:'north',
            	xtype:'gridpanel',
                store:storeMP,
                id: 'meeting-participant-list-' + id,
            	autoScroll:true,
            	minHeight:200,
            	tbar:[{
            		xtype:'button',
            		text:'Add New ITM Participants Meeting',
            		iconCls:'icon-accept',
            		listeners:{
            			click:function(){
                            Ext.create('Ext.Window', {
                                    title: 'Add New ITM Participants Meeting',
                                    id: 'MP',
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
                                            id: 'add-new-itmparticipant-form',
                                            border: false,
                                            bodyPadding: '5 5 5 5',
                                            defaultType: 'textfield',
                                            waitMsgTarget: true,
                                            items: [{
                                                        xtype: 'combobox',
                                                        fieldLabel: 'ITM Participants',
                                                        name: 'PARTICIPANT_ID',
                                                        labelWidth: 130,
                                                        store: Ext.data.StoreManager.lookup('Itmparticipants'),
                                                        displayField: 'NAME_PART',
                                                        valueField:'PARTICIPANT_ID',
                                                        typeAhead: true,
                                                        allowBlank: false,
                                                        minChars: 1,
                                                        emptyText: 'Select ITM Participants'
                                                    }]
                                                }],
                                        buttons: [{//===Save Contacts
                                                text: 'Save',
                                                listeners: {
                                                    click: function() {
                                                        var form = Ext.getCmp('add-new-itmparticipant-form').getForm();
                                                       // var store = loadStore ('Contacts');
                                                        
                                                        if (form.isValid()) {
                                                            form.submit({
                                                                url: sd.baseUrl + '/meetingparticipant/request/create/id/' + meeting_data.MEETING_ACTIVITIE_ID,
                                                                success: function(d) {
                                                                    //console.log(data);
                                                                    var json = Ext.decode(d.responseText);
                                                                    form.reset();
                                                                    var store = loadStore('Meetingparticipants');
                                                                    store.load({
                                                                        params: {
                                                                            id: meeting_data.MEETING_ACTIVITIE_ID
                                                                        }
                                                                    }); // Refresh grid data
                                                                    Ext.Msg.alert('Success', 'Data has been saved');
                                                                    Ext.getCmp('MP').close();
                                                                },
                                                                failure: function(d) {
                                                                    //console.log(data);
                                                                    var json = Ext.decode(d.responseText);
                                                                    Ext.Msg.alert('Error','Sorry, data already exist');
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
            		xtype:'button',
            		text:'Delete ITM Participants Meeting',
            		iconCls:'icon-stop',
            		listeners:{
            			click:function(){
                            var mmp = Ext.getCmp('meeting-participant-list-' + id);
                            var mmp_selected = mmp.getSelectionModel().getSelection();
                    
                                if(mmp_selected.length > 0) {
                                var mmp = mmp_selected[0].data;
                                Ext.create('Ext.Window', {
                                      html: 'Are you sure want do delete selected item(s) ?',
                                      bodyPadding: '20 5 5 17',
                                      title: 'Confirmation',
                                      resizable: false,
                                      modal: true,
                                      closable: false,
                                      draggable: false,
                                      store:storeMP,
                                      width: 300,
                                      height: 120,
                                      buttons: [{
                                                text: 'Yes',
                                                listeners: {
                                                    click: function() {
                                                    showLoadingWindow();
                                                    this.up().up().close();
                                                    Ext.Ajax.request({
                                                        url: sd.baseUrl + '/meetingparticipant/request/destroy',
                                                        params: mmd_file,
                                                        success: function(dat) {
                                                            var json = Ext.decode(dat.responseText);
                                                            closeLoadingWindow();
                                                            var store = loadStore('Meetingparticipants');
                                                            store.load({
                                                                params: {
                                                                id: meeting_data.MEETING_ACTIVITIE_ID
                                                            }
                                                             });
                                                        },
                                                        failure: function(dat) {
                                                            var json = Ext.decode(dat.responseText);
                                                            closeLoadingWindow();
                                                        }
                                                    });
                                                    }
                                                }
                                        },{
                                                text: 'No',
                                                listeners: {
                                                click: function() {
                                                this.up().up().close();
                                                        }
                                                    }
                                                }]
                                    }).show();
                                } else {
                                Ext.Msg.alert('Message', 'You did not select any Participants');
                                }
            			}
            		}
            	}],
            	columns:[{
                    flex:1,
            		text:'Name Participants',
                    dataIndex:'NAME_PART'
            	},{
                    flex:1,
            		text:'Email',
                    dataIndex:'EMAIL_PART'
            	}]
            },{
            	title:'Meeting Documents',
            	collapsible:true,
            	border:false,
            	region:'north',
            	xtype:'gridpanel',
                id: 'meetingdocumentation-list-' + id,
                store:storeMD,
            	autoScroll:true,
            	minHeight:200,
            	tbar:[{
            		xtype:'button',
            		text:'Upload Documents',
            		iconCls:'icon-attachment',
            		listeners:{
            			click:function(){
                            Ext.create('Ext.Window', {
                                    title: 'Add New Contacts',
                                    id: 'MD',
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
                                            id: 'upload-new-document-form',
                                            border: false,
                                            bodyPadding: '5 5 5 5',
                                            defaultType: 'textfield',
                                            waitMsgTarget: true,
                                            items: [{
                                                        fieldLabel: 'Documentation Title',
                                                        name: 'DOCUMENTATION_TITLE',
                                                        allowBlank:false
                                                    },{
                                                        xtype: 'filefield',
                                                        name: 'FILE_PATH',
                                                        fieldLabel: 'File upload',
                                                        allowBlank:false,
                                                        emptyText:'Please select a document'
                                                    }]
                                            }]
                                    }],
                                    buttons: [{//===Save Contacts
                                                text: 'Upload',
                                                listeners: {
                                                    click: function() {
                                                        var form = Ext.getCmp('upload-new-document-form').getForm();
                                                        var store = loadStore ('Meetingdocumentations');
                                                        
                                                        if (form.isValid()) {
                                                            form.submit({
                                                                url: sd.baseUrl + '/meetingdocumentation/request/create/id/' + meeting_data.MEETING_ACTIVITIE_ID,
                                                                waitMsg: 'Uploading document, please wait..',
                                                                success: function(de, ef) {
                                                                var json = Ext.decode(ef.response.responseText);
                                                                Ext.Msg.show({
                                                                    title: 'Message',
                                                                    msg: 'File sucessfully uploaded',
                                                                    minWidth: 200,
                                                                    modal: true,
                                                                    icon: Ext.Msg.INFO,
                                                                    buttons: Ext.Msg.OK
                                                                });
                                                                form.reset();
                                                                store.load({
                                                                        params: {
                                                                            id: meeting_data.MEETING_ACTIVITIE_ID
                                                                        }
                                                                    });
                                                                },
                                                                failure: function(de, ef) {
                                                                var json = Ext.decode(ef.response.responseText);
                                                                Ext.Msg.show({
                                                                    title: 'Error',
                                                                    msg: json.error_message,
                                                                    minWidth: 200,
                                                                    modal: true,
                                                                    icon: Ext.Msg.INFO,
                                                                    buttons: Ext.Msg.OK
                                                                });
                                                            }
                                                            });
                                                        }
                                                    }
                                                }
                                            },{
                                                text: 'Cancel',
                                                listeners: {
                                                    click: function() {
                                                       this.up().up().close();
                                                            }
                                                }
                                         }]
                                    }).show();                                                
            			}
            		}
            	},{
            		xtype:'button',
            		text:'Delete Documents',
            		iconCls:'icon-stop',
            		listeners:{
            			click:function(){
                            var mmd = Ext.getCmp('meetingdocumentation-list-' + id);
                            var mmd_selected = mmd.getSelectionModel().getSelection();
                    
                                if(mmd_selected.length > 0) {
                                var mmd_file = mmd_selected[0].data;
                                Ext.create('Ext.Window', {
                                      html: 'Are you sure want do delete selected item(s) ?',
                                      bodyPadding: '20 5 5 17',
                                      title: 'Confirmation',
                                      resizable: false,
                                      modal: true,
                                      closable: false,
                                      draggable: false,
                                      store:storeCO,
                                      width: 300,
                                      height: 120,
                                      buttons: [{
                                                text: 'Yes',
                                                listeners: {
                                                    click: function() {
                                                    showLoadingWindow();
                                                    this.up().up().close();
                                                    Ext.Ajax.request({
                                                        url: sd.baseUrl + '/meetingdocumentation/request/destroy',
                                                        params: mmd_file,
                                                        success: function(dat) {
                                                            var json = Ext.decode(dat.responseText);
                                                            closeLoadingWindow();
                                                            var store = loadStore('Meetingdocumentations');
                                                            store.load({
                                                                params: {
                                                                id: meeting_data.MEETING_ACTIVITIE_ID
                                                            }
                                                             });
                                                        },
                                                        failure: function(dat) {
                                                            var json = Ext.decode(dat.responseText);
                                                            closeLoadingWindow();
                                                        }
                                                    });
                                                    }
                                                }
                                        },{
                                                text: 'No',
                                                listeners: {
                                                click: function() {
                                                this.up().up().close();
                                                        }
                                                    }
                                                }]
                                    }).show();
                                } else {
                                Ext.Msg.alert('Message', 'You did not select any Documents');
                                }
            			}
            		}
            	},{
            		xtype:'button',
            		text:'Downloads Documents',
            		iconCls:'icon-download',
            		listeners:{
            			click:function(){
                            var  md= Ext.getCmp('meetingdocumentation-list-'+id);
                            var md_selected = md.getSelectionModel().getSelection();
                            if(md_selected.length > 0) {
                                var md_data=md_selected[0].data;
                                document.location = sd.baseUrl + '/meetingdocumentation/request/download/id/' + md_data.MEETING_DOCUMENTATION_ID;
                                var store = loadStore('Meetingdocumentations');
                                setTimeout(function(){
                                   store.load({
                                            params: {
                                            id: meeting_data.MEETING_ACTIVITIE_ID
                                        }
                                    });
                                },800);
                            } else {
                                Ext.Msg.alert('Message', 'You did not select any File Documents');
                            }
            			}
            		}
            	}],
            	columns:[{
                    flex:1,
            		text:'Documents Title',
                    dataIndex:'DOCUMENTATION_TITLE'
            	},{
                    flex:1,
                    text:'File Name',
                    dataIndex:'FILE_NAME'
                },{
                    flex:1,
            		text:'Upload Date',
                    dataIndex:'CREATED_DATE'
            	}]
            },{
            	title:'Meeting Notes',
            	collapsible:true,
            	border:false,
            	region:'north',
            	xtype:'gridpanel',
            	autoScroll:true,
            	minHeight:200,
            	columns:[{
            		text:'Notes'
            	}]
            }]
			
		});
	}
	c.up().setActiveTab(meeting_id);
} else {
	Ext.Msg.alert('Message', 'You did not select any Meeting');
}
