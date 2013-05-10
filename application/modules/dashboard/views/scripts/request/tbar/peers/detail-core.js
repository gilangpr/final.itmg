if(!c.up().items.get(id)){
    var maxWidth = 221;
    var max_length_title = 15;
    var grid_height = 180;
    var TITLE = (data.PEER_NAME.length > max_length_title) ? data.PEER_NAME.substring(0,max_length_title) + '...' : data.PEER_NAME
    
    /* Rendering Files */

    <?php echo $this->render('/request/tbar/peers/dev/models.js')?>
    <?php echo $this->render('/request/tbar/peers/dev/stores.js')?>

    /* End of : Rendering Files */

    c.up().add({
        xtype: 'panel',
        layout: 'border',
        title: TITLE,
        id: id,
        closable: true,
        autoScroll: true,
        border: false,
        items: [{
            title: 'Peers Detail',
            collapsible: true,
            region: 'west',
            width: '50%',
            autoScroll: true,
            id: 'peers-detail-left-' + data.PEER_ID,
            items: [{
                title: 'Brief History',
                border: false,
                maxWidth: Ext.getBody().getViewSize().width - maxWidth,
                items: [{
                    xtype: 'form',
                    layout: 'form',
                    border: false,
                    bodyPadding: '5 5 5 5',
                    id: 'brief-history-form' + data.PEER_ID,
                    items: [{
                        xtype: 'textarea',
                        name: 'BRIEF_HISTORY',
                        value: data.BRIEF_HISTORY,
                        minHeight: 220,
                        allowBlank: false
                    }],
                    tbar: [{
                    	xtype: 'button',
                    	text: 'Update',
                        iconCls: 'icon-accept',
                        listeners: {
                            click: function() {
                                var form = Ext.getCmp('brief-history-form' + data.PEER_ID).getForm();
                                if(form.isValid()) {
                                    Ext.MessageBox.confirm('Confirm', 'Are you sure want to update this data ?', function(a) {
                                        if(a == 'yes') {
                                            form.submit({
                                                url: sd.baseUrl + '/peers/request/update-detail',
                                                waitMsg: 'Updating data, please wait..',
                                                params: {
                                                    id: data.PEER_ID,
                                                    type: 'BRIEF_HISTORY'
                                                },
                                                success: function(d, e) {
                                                    var json = Ext.decode(e.response.responseText);
                                                    Ext.Msg.alert('Message', 'Update success.');
                                                    storePEERS.loadPage(storePEERS.currentPage);
                                                },
                                                failure: function(d, e) {
                                                    var json = Ext.decode(e.response.responseText);
                                                    Ext.Msg.alert('Error', json.error_message);
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        }
                    }]
                }]
            },{
                title: 'Business Activity',
                border: false,
                maxWidth: Ext.getBody().getViewSize().width - maxWidth,
                items: [{
                    xtype: 'form',
                    layout: 'form',
                    border: false,
                    bodyPadding: '5 5 5 5',
                    id: 'business-activity-form' + data.PEER_ID,
                    items: [{
                        xtype: 'textarea',
                        name: 'BUSINESS_ACTIVITY',
                        value: data.BUSINESS_ACTIVITY,
                        minHeight: 220,
                        allowBlank: false
                    }],
                    tbar: [{
                    	xtype: 'button',
                    	text: 'Update',
                        iconCls: 'icon-accept',
                        listeners: {
                            click: function() {
                                var form = Ext.getCmp('business-activity-form' + data.PEER_ID).getForm();
                                if(form.isValid()) {
                                    Ext.MessageBox.confirm('Confirm', 'Are you sure want to update this data ?', function(a) {
                                        if(a == 'yes') {
                                            form.submit({
                                                url: sd.baseUrl + '/peers/request/update-detail',
                                                waitMsg: 'Updating data, please wait..',
                                                params: {
                                                    id: data.PEER_ID,
                                                    type: 'BUSINESS_ACTIVITY'
                                                },
                                                success: function(d, e) {
                                                    var json = Ext.decode(e.response.responseText);
                                                    Ext.Msg.alert('Message', 'Update success.');
                                                    storePEERS.loadPage(storePEERS.currentPage);
                                                },
                                                failure: function(d, e) {
                                                    var json = Ext.decode(e.response.responseText);
                                                    Ext.Msg.alert('Error', json.error_message);
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        }
                    }]
                }]
            }]
        },{ /* Peers Data */
            region: 'center',
            autoScroll: true,
            items: [{
                border: false,
                autoScroll: true,
                items: [
                <?php echo $this->render('/request/tbar/peers/pieces/stripping-ratio-year.js')?>,
                <?php echo $this->render('/request/tbar/peers/pieces/stripping-ratio.js')?>,
                <?php echo $this->render('/request/tbar/peers/pieces/average-selling-price.js')?>,
                <?php echo $this->render('/request/tbar/peers/pieces/financial-performance.js')?>,
                <?php echo $this->render('/request/tbar/peers/pieces/total-cash-cost.js')?>,
                <?php echo $this->render('/request/tbar/peers/pieces/reserves-and-resources.js')?>,
                <?php echo $this->render('/request/tbar/peers/pieces/composition-company.js')?>,
                <?php echo $this->render('/request/tbar/peers/pieces/coal-sales-distribution.js')?>
                ]
            }]
        }]
    });
}
c.up().setActiveTab(id);
$('body').css('overflow','hidden');