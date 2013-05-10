var __c = Ext.getCmp('investors-detail-meeting-investor-grid-' + xid);
var __selected = __c.getSelectionModel().getSelection();
if(__selected.length > 0) {
    var __id = 'investor-details-meetings-tabs-' + __selected[0].data.MEETING_ACTIVITIE_ID;
    var meeting__id = __selected[0].data;
    if(!c.up().items.get(__id)) {
        var maxWidth = 221;

        /*
         *Call Meeting Participant
         */
        var storeMP = Ext.create("Ext.data.Store", {
            model: "Meetingparticipant",
            storeId: "Meetingparticipants_x",
            proxy:{
                extraParams:{
                    id:meeting__id.MEETING_ACTIVITIE_ID   
                },
                "type":"ajax","api":{"read":"\/meetingparticipant\/request\/read","create":"\/meetingparticipant\/request\/create","update":"\/meetingparticipant\/request\/update","destroy":"\/meetingparticipant\/request\/destroy"},"actionMethods":{"create":"POST","destroy":"POST","read":"POST","update":"POST"},"reader":{"idProperty":"MEETING_PARTICIPANT","type":"json","root":"data.items","totalProperty":"data.totalCount"},"writer":{"type":"json","root":"data","writeAllFields":true}},
            sorter: {"property":"MEETING_PARTICIPANT","direction":"ASC"}});
        storeMP.autoSync = true;
        storeMP.load({
            params:{
            id:meeting__id.MEETING_ACTIVITIE_ID     
            }   
        });
        /*
         *End call Meeting Participant
         */
          /*
         *Call Meeting Contacts
         */
        var storeCON = Ext.create("Ext.data.Store", {
            model: "Meetingcontact",
            storeId: "Meetingcontacts",
            proxy:{
                extraParams:{
                    id: meeting__id.MEETING_ACTIVITIE_ID
                },
                "type":"ajax","api":{"read":"\/meetingcontact\/request\/read","create":"\/meetingcontact\/request\/create","update":"\/meetingcontact\/request\/update","destroy":"\/meetingcontact\/request\/destroy"},"actionMethods":{"create":"POST","destroy":"POST","read":"POST","update":"POST"},"reader":{"idProperty":"MEETING_CONTACT","type":"json","root":"data.items","totalProperty":"data.totalCount"},"writer":{"type":"json","root":"data","writeAllFields":true}},
            sorter: {"property":"MEETING_CONTACT","direction":"ASC"}});
        storeCON.autoSync = true;
        storeCON.load({
            params:{
            id:meeting__id.MEETING_ACTIVITIE_ID     
            }   
        });
        /*
         *End call Meeting Contacts
         */

         var storeMD = Ext.create("Ext.data.Store", {
            model: "Meetingdocumentation",
            storeId: "Meetingdocumentations",
            proxy:{extraParams: {
                id:meeting__id.MEETING_ACTIVITIE_ID
            },"type":"ajax","api":{"read":"\/meetingdocumentation\/request\/read","create":"\/meetingdocumentation\/request\/create","update":"\/meetingdocumention\/request\/update","destroy":"\/meetingdocumentation\/request\/destroy"},"actionMethods":{"create":"POST","destroy":"POST","read":"POST","update":"POST"},"reader":{"idProperty":"MEETING_DOCUMENTATION_ID","type":"json","root":"data.items","totalProperty":"data.totalCount"},"writer":{"type":"json","root":"data","writeAllFields":true}},
            sorter: {"property":"MEETING_DOCUMENTATION_ID","direction":"ASC"}});
            storeMD.autoSync = true;
            storeMD.load({
                params:{
                id:meeting__id.MEETING_ACTIVITIE_ID     
                }   
            });
         var storeMA = loadStore('Meetingactivities');
            storeMA.autoSync = true;
            storeMA.load({
                params:{
                id:meeting__id.MEETING_ACTIVITIE_ID     
                }   
            });    
        var storeCO = Ext.create("Ext.data.Store", {
        model: "Contact",
        storeId: "Contacts",
        proxy:{extraParams:{id:selected[0].data.INVESTOR_ID},"type":"ajax","api":{"read":"\/contacts\/request\/read","create":"\/contacts\/request\/create","update":"\/contacts\/request\/update","destroy":"\/contacts\/request\/destroy"},"actionMethods":{"create":"POST","destroy":"POST","read":"POST","update":"POST"},"reader":{"idProperty":"CONTACT_ID","type":"json","root":"data.items","totalProperty":"data.totalCount"},"writer":{"type":"json","root":"data","writeAllFields":true}},
        sorter: {"property":"CONTACT_ID","direction":"ASC"}});
    
        storeCO.load();
        c.up().add({
            title: 'Meeting: ' + meeting__id.MEETING_EVENT,
            closable: true,
            id: __id,
            xtype: 'panel',
            layout: 'border',
            autoScroll: true,
            border: false,
            items:[{
                title: 'Meeting Contacts',
                border: false,
                region:'north',
                xtype: 'gridpanel',
                id:'meeting-contact-list-' + xid,
                store:storeCON,
                //store:storeCO,
                autoScroll:true,
                minHeight: 200,
                maxWidth: Ext.getBody().getViewSize().width - maxWidth,
                bbar: new Ext.PagingToolbar({
                    store: storeCON,
                    displayInfo: true,
                    displayMsg: 'Displaying data {0} - {1} of {2}',
                    emptyMsg: 'No data to display'
                }),
                tbar:[{ 
                    xtype:'button',
                    text:'Add New Meeting Contacts',
                    iconCls:'icon-accept',
                    listeners:{
                        click:function(){
                            var _sCO = Ext.create("Ext.data.Store", {
                                model: "Contact",
                                storeId: "Contacts",
                                proxy:{extraParams:{id: meeting__id.INVESTOR_ID},"type":"ajax","api":{"read":"\/contacts\/request\/read","create":"\/contacts\/request\/create","update":"\/contacts\/request\/update","destroy":"\/contacts\/request\/destroy"},"actionMethods":{"create":"POST","destroy":"POST","read":"POST","update":"POST"},"reader":{"idProperty":"CONTACT_ID","type":"json","root":"data.items","totalProperty":"data.totalCount"},"writer":{"type":"json","root":"data","writeAllFields":true}},
                                sorter: {"property":"CONTACT_ID","direction":"ASC"}});
                            
                            _sCO.load({
                                params: {
                                    id: meeting__id.INVESTOR_ID
                                }
                            });
                            
                            Ext.create('Ext.Window', {
                                title: 'Add Meeting Contact',
                                width: 400,
                                modal: true,
                                resizable: false,
                                draggable: false,
                                items: [{
                                    xtype: 'form',
                                    layout: 'form',
                                    id: 'investors-detail-meeting-contacts-add-' + meeting__id.MEETING_ACTIVITIE_ID,
                                    border: false,
                                    bodyPadding: '5 5 5 5',
                                    items: [{
                                        xtype: 'combobox',
                                        store: _sCO,
                                        fieldLabel: 'Contact Name',
                                        name: 'CONTACT_ID',
                                        displayField: 'NAME',
                                        valueField:'CONTACT_ID',
                                        emptyText :'Select a Contacts',
                                        allowBlank: false,
                                        pageSize: 10
                                    }]
                                }],
                                buttons: [{
                                    text: 'Save',
                                    iconCls: 'icon-accept',
                                    listeners: {
                                        click: function() {
                                            var form = Ext.getCmp('investors-detail-meeting-contacts-add-' + meeting__id.MEETING_ACTIVITIE_ID);
                                            if(form.getForm().isValid()) {
                                                form.getForm().submit({
                                                    url: sd.baseUrl + '/meetingcontact/request/create/id/'+meeting__id.MEETING_ACTIVITIE_ID,
                                                    params:{
                                                        INVESTOR_ID:meeting__id.INVESTOR_ID
                                                    },
                                                    success: function(d, e) {
                                                        var json = Ext.decode(e.response.responseText);
                                                        storeCON.load();
                                                        Ext.Msg.alert('Message', 'Data successfully saved.');
                                                        form.up().close();
                                                    },
                                                    failure: function(d, e) {
                                                        var json = Ext.decode(e.response.responseText);
                                                        Ext.Msg.alert('Error', '[' + json.error_code + '] : ' + json.error_message);
                                                    }
                                                });
                                            }
                                        }
                                    }
                                }]
                            }).show();
                        }
                    }
                },{
                    xtype: 'button',
                    text: 'Add New Participants',
                    iconCls: 'icon-go',
                    listeners: {
                        click: function() {
                            Ext.create('Ext.Window', {
                                title: 'Add New Participants',
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
                                        id: 'add-new-participants-form',
                                        border: false,
                                        bodyPadding: '5 5 5 5',
                                        defaultType: 'textfield',
                                        waitMsgTarget: true,
                                        items: [{
                                            fieldLabel: 'Name <span style="color:red;">*</span>',
                                            allowBlank: false,
                                            name: 'NAME'
                                        },{
                                            fieldLabel: 'Phone 1 &nbsp<span style="color:red;">*</span>',
                                            allowBlank: false,
                                            name: 'PHONE1_PARTICIPANT',
                                        },{
                                            fieldLabel: 'Phone 2',
                                            allowBlank: true,
                                            name: 'PHONE2_PARTICIPANT',
                                    
                                        },{
                                            fieldLabel:'Email <span style="color:red;">*</span>',
                                            allowBlank:false,
                                            name:'EMAIL_PARTICIPANT',
                                            vtype:'email'                   
                                        },{
                                            fieldLabel: 'Address',
                                            name: 'ADDRESS_PARTICIPANT',
                                            xtype: 'htmleditor',
                                            height: 150
                           
                                        },{
                                            xtype: 'radiofield',
                                            name: 'SEX',
                                            inputValue: 'Male',
                                            fieldLabel: 'Sex',
                                            boxLabel: 'Male',
                                            checked: true
                                        },{
                                            xtype: 'radiofield',
                                            name: 'SEX',
                                            inputValue: 'Female',
                                            fieldLabel: '',
                                            labelSeparator: '',
                                            hideEmptyLabel: false,
                                            boxLabel: 'Female'
                                        },{
                                            fieldLabel: 'Position <span style="color:red;">*</span>',
                                            allowBlank: false,
                                            name: 'POSITION_PARTICIPANT'
                                        },{
                                            xtype: 'checkboxfield',
                                            name: 'KEY_PERSON',
                                            fieldLabel: 'Key Person'                                            
                                        }]
                                    }],
                                    buttons: [{//===Save Contacts
                                        text: 'Save',
                                        listeners: {
                                            click: function() {
                                                var form = Ext.getCmp('add-new-participants-form').getForm();
                                                var store = loadStore ('Meetingcontacts');
                                                
                                                if (form.isValid()) {
                                                    form.submit({
                                                        url: sd.baseUrl + '/meetingcontact/request/cr',
                                                        params:{
                                                            INVESTOR_ID:meeting__id.INVESTOR_ID,
                                                            MEETING_ACTIVITIE_ID:meeting__id.MEETING_ACTIVITIE_ID
                                                        },
                                                        success: function(d, e) {
                                                            var json = Ext.decode(e.response.responseText);
                                                            var store = loadStore('Meetingcontacts');
                                                                store.load({
                                                                    params: {
                                                                    id: meeting__id.MEETING_ACTIVITIE_ID
                                                                    }
                                                                }); // Refresh grid data,
                                                            Ext.Msg.alert('Message', 'Data successfully saved.');
                                                            Ext.getCmp('CO').close();
                                                        },
                                                        failure: function(d, e) {
                                                            var json = Ext.decode(e.response.responseText);
                                                            Ext.Msg.alert('Error', '[' + json.error_code + '] : ' + json.error_message);
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
                            var mmc = Ext.getCmp('meeting-contact-list-' + xid);
                            var mmc_selected = mmc.getSelectionModel().getSelection();
                    
                                if(mmc_selected.length > 0) {
                                var mmc = mmc_selected[0].data;
                                Ext.create('Ext.Window', {
                                      html: 'Are you sure want do delete selected item(s) ?',
                                      bodyPadding: '20 5 5 17',
                                      title: 'Confirmation',
                                      resizable: false,
                                      modal: true,
                                      closable: false,
                                      draggable: false,
                                      store:storeCON,
                                      width: 300,
                                      height: 120,
                                      buttons: [{
                                                text: 'Yes',
                                                listeners: {
                                                    click: function() {
                                                    showLoadingWindow();
                                                    this.up().up().close();
                                                    Ext.Ajax.request({
                                                        url: sd.baseUrl + '/meetingcontact/request/destroy',
                                                        params: {
                                                            CONTACT_ID: mmc.CONTACT_ID,
                                                            MEETING_ACTIVITIE_ID: mmc.MEETING_ACTIVITIE_ID,

                                                            INVESTOR_ID:meeting__id.INVESTOR_ID,

                                                            INVESTOR_ID:meeting__id.INVESTOR_ID,
                                                            NAME:mmc.NAME
                                                        },
                                                        success: function(dat) {
                                                            var json = Ext.decode(dat.responseText);
                                                            closeLoadingWindow();
                                                            var store = loadStore('Meetingcontacts');
                                                            storeCON.load();
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
                                Ext.Msg.alert('Message', 'You did not select any Contacts');
                                }
                        }
                    }
                }],
                columns:[/*{
                    text:'Company name',
                    dataIndex:'COMPANY_NAME',
                    width:200,
                    flex: 1
                },*/{
                    text:'Name',
                    dataIndex:'NAME',
                    width:200,
                    flex: 1
                },{
                    text:'Email',
                    dataIndex:'EMAIL',
                    width:200,
                    flex: 1
                },{
                    text:'Position',
                    dataIndex:'POSITION',
                    width:200
                }]
            },
            {
                title:'Meeting Participants',
                border:false,
                region:'north',
                xtype:'gridpanel',
                store:storeMP,
                id:'meetingparticipant-list-'+ xid,
                autoScroll:true,
                minHeight:200,
                maxWidth: Ext.getBody().getViewSize().width - maxWidth,
                bbar: new Ext.PagingToolbar({
                    store: storeMP,
                    displayInfo: true,
                    displayMsg: 'Displaying data {0} - {1} of {2}',
                    emptyMsg: 'No data to display'
                }),
                columns:[{
                    text:'Name Participants',
                    dataIndex:'NAME_PART',
                    width:200,
                    flex: 1
                },{
                    text:'Email',
                    dataIndex:'EMAIL_PART',
                    width:200,
                    flex: 1
                },{
                    text:'Initials',
                    dataIndex:'INITIAL_PART',
                    width:100,
                    align: 'center'
                }],
                tbar:[{
                    xtype:'button',
                    text:'Add New ITM Participants',
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
                                                        fieldLabel: 'ITM Participants <span style="color:red;">*</span>',
                                                        name: 'PARTICIPANT_ID',
                                                        labelWidth: 130,
                                                        store: Ext.data.StoreManager.lookup('Itmparticipants'),
                                                        displayField: 'NAME_PART',
                                                        valueField:'PARTICIPANT_ID',
                                                        typeAhead: true,
                                                        allowBlank: false,
                                                        minChars: 1,
                                                        emptyText: 'Select ITM Participants',
                                                        pageSize: 10
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
                                                                url: sd.baseUrl + '/meetingparticipant/request/create/id/' + meeting__id.MEETING_ACTIVITIE_ID,
                                                                params:{
                                                                    INVESTOR_ID:meeting__id.INVESTOR_ID
                                                                },
                                                                success: function(d) {
                                                                    //console.log(data);
                                                                    var json = Ext.decode(d.responseText);
                                                                    form.reset();
                                                                    storeMP.load();
                                                                    Ext.Msg.alert('Success', 'Data has been saved');
                                                                    Ext.getCmp('MP').close();
                                                                },
                                                                failure: function(d,e) {
                                                                    //console.log(data);
                                                                    var json = Ext.decode(e.response.responseText);
                                                                    Ext.Msg.alert('Error','[' + json.error_code + '] : ' + json.error_message);
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
                    text:'Delete ITM Participants',
                    iconCls:'icon-stop',
                    listeners:{
                        click:function(){
                            var mmp = Ext.getCmp('meetingparticipant-list-' + xid);
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
                                                        params: {
                                                            PARTICIPANT_ID: mmp.PARTICIPANT_ID,
                                                            MEETING_ACTIVITIE_ID: mmp.MEETING_ACTIVITIE_ID,
                                                            INVESTOR_ID:meeting__id.INVESTOR_ID
                                                        },
                                                        success: function(dat) {
                                                            var json = Ext.decode(dat.responseText);
                                                            closeLoadingWindow();
                                                            storeMP.load();
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
                }]
                
            },{
                title:'Meeting Documents',
                collapsible:true,
                border:false,
                region:'north',
                xtype:'gridpanel',
                id: 'meetingdocumentation-list-' + xid,
                store:storeMD,
                autoScroll:true,
                minHeight:200,
                maxWidth: Ext.getBody().getViewSize().width - maxWidth,
                bbar: new Ext.PagingToolbar({
                    store: storeMD,
                    displayInfo: true,
                    displayMsg: 'Displaying data {0} - {1} of {2}',
                    emptyMsg: 'No data to display'
                }),
                tbar:[{
                    xtype:'button',
                    text:'Upload Documents',
                    iconCls:'icon-attachment',
                    listeners:{
                        click:function(){
                            Ext.create('Ext.Window', {
                                    title: 'Add New Documents',
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
                                                        fieldLabel: 'Documentation Title <span style="color:red;">*</span>',
                                                        name: 'DOCUMENTATION_TITLE',
                                                        allowBlank:false
                                                    },{
                                                        xtype: 'filefield',
                                                        name: 'FILE_PATH',
                                                        fieldLabel: 'File upload <span style="color:red;">*</span>',
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
                                                                url: sd.baseUrl + '/meetingdocumentation/request/create/id/' + meeting__id.MEETING_ACTIVITIE_ID,
                                                                params:{
                                                                    INVESTOR_ID:meeting__id.INVESTOR_ID
                                                                },
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
                                                                    storeMD.load();
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
                            var mmd = Ext.getCmp('meetingdocumentation-list-' + xid);
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
                                                                id: meeting__id.MEETING_ACTIVITIE_ID
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
                            var  md= Ext.getCmp('meetingdocumentation-list-'+ xid);
                            var md_selected = md.getSelectionModel().getSelection();
                            if(md_selected.length > 0) {
                                var md_data=md_selected[0].data;
                                document.location = sd.baseUrl + '/meetingdocumentation/request/download/id/' + md_data.MEETING_DOCUMENTATION_ID;
                                var store = loadStore('Meetingdocumentations');
                                setTimeout(function(){
                                   store.load({
                                            params: {
                                            id: meeting__id.MEETING_ACTIVITIE_ID
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
                    text:'Documents Title',
                    dataIndex:'DOCUMENTATION_TITLE',
                    width:200,
                    flex: 1
                },{
                    text:'File Name',
                    dataIndex:'FILE_NAME',
                    width:300
                },{
                    text:'Upload Date',
                    dataIndex:'CREATED_DATE',
                    width:200
                }]
            },{
                region: 'north',
                title: 'Meeting Notes',
                //store:storeMA,
                border: false,
                maxWidth: Ext.getBody().getViewSize().width - maxWidth,
                tbar: [{
                    xtype: 'button',
                    text: 'Update',
                    iconCls: 'icon-accept',
                    listeners: {
                        click: function() {
                           
                            var form = Ext.getCmp('meeting-detail-notes-form-' + xid).getForm();
                            if(form.isValid()) {
                                form.submit({

                                    url: sd.baseUrl + '/meetingactivitie/request/updatenotes/id/'+meeting__id.MEETING_ACTIVITIE_ID,
                                    waitMsg: 'Updateing data, please wait..',
                                     //var store=loadStore('Meetingactivities'),
                                    params: {
                                        id: meeting__id.MEETING_ACTIVITIE_ID,
                                        INVESTOR_ID:meeting__id.INVESTOR_ID
                                        //type: 'NOTES'
                                    },
                                    success: function(d, e) {
                                        var json = Ext.decode(e.response.responseText);
                                        Ext.Msg.alert('Message', 'Update success.');
                                        storeMA.loadPage(storeMA.currentPage);
                                        storeMI.loadPage(storeMI.currentPage);
                                    },
                                    failure: function(d, e) {
                                        var json = Ext.decode(e.response.responseText);
                                        Ext.Msg.alert('Error', json.error_message);
                                    }
                                })
                            }
                        }
                    }
                }],
                items: [{
                    xtype: 'form',
                    layout: 'form',
                    border: false,
                    bodyPadding: '5 5 5 5',
                    id: 'meeting-detail-notes-form-' + xid,
                    items: [{
                        xtype: 'textarea',
                        name: 'NOTES',
                        value: meeting__id.NOTES,
                        emptyText:'Notes is null',
                        minHeight: 160
                        //allowBlank: false
                    }]
                }]
            }]
        });
        
    }
    c.up().setActiveTab(__id);
} else {
    Ext.Msg.alert('Message', 'You did not select any Meetings.');
}
