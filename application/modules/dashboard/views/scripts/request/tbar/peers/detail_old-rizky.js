var c = Ext.getCmp('<?php echo $this->container ?>');
var selected = c.getSelectionModel().getSelection();
var fpColumns = <?php echo $this->fpColumns?>;
var fpFields = <?php echo $this->fpFields?>;
var csdColumns = <?php echo $this->csdColumns?>;
var csdFields = <?php echo $this->csdFields?>;
var srColumns = <?php echo $this->srColumns?>;
var srFields = <?php echo $this->srFields?>;
var sryColumns = <?php echo $this->sryColumns?>;
var sryFields = <?php echo $this->sryFields?>;
var aspColumns = <?php echo $this->aspColumns?>;
var aspFields = <?php echo $this->aspFields?>;
var csyColumns = <?php echo $this->csyColumns?>;
var csyFields = <?php echo $this->csyFields?>;
var fobColumns = <?php echo $this->fobColumns?>;
var fobFields = <?php echo $this->fobFields?>;
var csd_bcColumns = <?php echo $this->csd_bcColumns?>;
var csd_bcFields = <?php echo $this->csd_bcFields?>;
//var nmbr = Ext.util.Format.number;
Ext.require(['Ext.form.field.Number']);

storePEERS = loadStore('Peers');

/* Composition */
csyColumns[1].columns[0].renderer = Ext.util.Format.numberRenderer('0.,00/i');
csyColumns[2].columns[0].renderer = Ext.util.Format.numberRenderer('0.,00/i');

/* Total Cash Cost (FOB) */
Ext.each(fobColumns,function(_e, _i) {
    if(_i > 0) {
        fobColumns[_i].renderer = Ext.util.Format.numberRenderer('0.,00/i');
    }
});

/* Finanction Performances */
Ext.each(fpColumns, function(_e, _i) {
    if(_i > 0) {
        fpColumns[_i].renderer = Ext.util.Format.numberRenderer('0.,00/i');
    }
});

/* Average Selling Price */
Ext.each(aspColumns, function(_e, _i) {
    if(_i > 0) {
        aspColumns[_i].renderer = Ext.util.Format.numberRenderer('0.,00/i');
    }
});

if(selected.length > 0) {
    var id = 'peers-detail' + selected[0].id;
    if(!c.up().items.get(id)){
        var data = selected[0].data;
        var maxWidth = 221;
        
        <?php echo $this->render('/request/tbar/peers/ref/stores.js') ?>
        
        c.up().add({
            xtype: 'panel',
            layout: 'border',
            title: data.PEER_NAME,
            id: id,
            closable: true,
            autoScroll: true,
            border: false,
            items: [{
                title: 'Peers Detail',
                region: 'west',
                width: '50%',
                autoScroll: true,
                items: [{
                    title: 'Brief History',
                    collapsible: true,
                    border: false,
                    maxWidth: Ext.getBody().getViewSize().width - maxWidth,
                    items: [{
                    	xtype: 'form',
                    	layout: 'form',
                    	border: false,
                    	bodyPadding: '5 5 5 5',
                    	id: 'brief-history-form' + data.PEER_ID,
                    	items: [{
                    		xtype: 'htmleditor',
                    		name: 'BRIEF_HISTORY',
                    		value: data.BRIEF_HISTORY,
                    		minHeight: 220,
                    		allowBlank: false
                    	}],
                    	buttons: [{
                    		text: 'Update',
                    		iconCls: 'icon-accept',
                    		listeners: {
                    			click: function() {
                    				var form = Ext.getCmp('brief-history-form' + data.PEER_ID).getForm();
    								if(form.isValid()) {
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
    									})
    								}
                    			}
                    		}
                    	}]
                    }]
                },{
                    title: 'Business Activity',
//                    bodyPadding: '5 5 5 5',
//                    html: '<p style="text-align: justify">' + data.BUSINESS_ACTIVITY.replace('\n','<br/>') + '</p>',
                    collapsible: true,
                    border: false,
                    maxWidth: Ext.getBody().getViewSize().width - maxWidth,
                    items: [{
                    	xtype: 'form',
                    	layout: 'form',
                    	border: false,
                    	bodyPadding: '5 5 5 5',
                    	id: 'business-activity-form' + data.PEER_ID,
                    	items: [{
                    		xtype: 'htmleditor',
                    		name: 'BUSINESS_ACTIVITY',
                    		value: data.BUSINESS_ACTIVITY,
                    		minHeight: 220,
                    		allowBlank: false
                    	}],
                    	buttons: [{
                    		text: 'Update',
                    		iconCls: 'icon-accept',
                    		listeners: {
                    			click: function() {
                    				var form = Ext.getCmp('business-activity-form' + data.PEER_ID).getForm();
    								if(form.isValid()) {
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
    									})
    								}
                    			}
                    		}
                    	}]
                    }]
                }]
            },{ //Peers Data
                title: 'Peers Data',
                region: 'center',
                autoScroll: true,
                items: [{
                    title: 'Striping Ratio',
                    border: false,
                    collapsible: true,
                    items: [{
                        xtype: 'gridpanel',
                        border: false,
                        plugins: [new Ext.grid.plugin.RowEditing({clicksToMoveEditor: 1, autoCancel: false})],
                        minHeight: 120,
                        store: storeSRY,
                        columns: sryColumns,
                        tbar: [{
                            xtype: 'button',
                            text: 'Add New Stripping Ratio Year',
                            iconCls: 'icon-accept',
                            listeners: {
                                click: function() {
                                    Ext.create('Ext.Window', {
                                        title: 'Add New Stripping Ratio By Year',
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
                                                            success: function(d) {
                                                                var json = Ext.decode(d.responseText);
                                                                form.reset();
                                                                storeSRY.load({
                                                                    params: {
                                                                        id: data.PEER_ID
                                                                    }
                                                                });
                                                                Ext.Msg.alert('Success', 'Data has been saved');
                                                                Ext.getCmp('SRY').close();
                                                            },
                                                            failure: function(data) {
                                                                    var json = Ext.decode(data.responseText);
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
                        }]
                    },{
                        xtype: 'gridpanel',
                        border: false,
                        minHeight: 120,
//                        plugins: [new Ext.grid.plugin.RowEditing({clicksToMoveEditor: 1, autoCancel: false})],
                        store: storeSR,
                        id: 'sr-grid',
                        columns: srColumns,
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
                                                        var store = loadStore('StrippingRatios');
                                                        
                                                        if(form.isValid()) {
                                                            form.submit({
                                                            url: sd.baseUrl + '/strippingratio/request/create/id/' + data.PEER_ID,
                                                            success: function(d) {
                                                                var json = Ext.decode(d.responseText);
                                                                form.reset();
                                                                store.load({
                                                                    params: {
                                                                        id: data.PEER_ID
                                                                    }
                                                                });
                                                                Ext.Msg.alert('Success', 'Data has been saved');
                                                                Ext.getCmp('SR').close();
                                                            },
                                                            failure: function(data) {
                                                                    var json = Ext.decode(data.responseText);
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
                        	text: 'Edit Stripping Ratio',
                        	iconCls: 'icon-accept',
                        	listeners: {
                        		click: function() {
                        			Ext.create('Ext.Window', {
                        				title: 'Edit Stripping Ratio',
                        				id: 'edit-stripping-ratio',
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
                        						id: 'edit-stripping-ratio-form',
                        						border: false,
                        						bodyPadding: '5 5 5 5',
                        						defaultType: 'combobox',
                        						waitMsgTarget: true,
                        						fieldDefaults: {
                        				            labelAlign: 'left',
                        				            labelWidth: 150,
                        				            anchor: '100%'
                        				        },
                        						items: [{
                        							fieldLabel: 'Title',
                                                    allowBlank: false,
                                                    xtype: 'combobox',
                                                    name: 'TITLE',
                                                    store: storeSR,
                                                    mode : 'local',
                                                    id: 'sr-title',
                                                    value: 'All',
                                                    listWidth : 40,
                                                    triggerAction : 'all',
                                                    displayField  : 'TITLE',
                                                    editable      : false,
                                                    forceSelection: true,
                                                    listeners: {
                                                    	change: function() {
                                                    		var _p = this.value;
                                                    		if(this.value != 'null' && this.value != '') {
                                                    			var _f = Ext.getCmp('edit-stripping-ratio-form');
                                                    			if(typeof(_f) != 'undefined') {
                                                    				var _g = Ext.getCmp('sr-grid');
                                                    				Ext.each(_g.store.data.items, function(_v) {
                                                    					/* Sales Volume */
                                                    					if(_v.data.NAME == 'Sales Volume (Mil.Tons)') {
                                                    						var x = eval('_v.data.VALUE_' + _p);
                                                    						Ext.getCmp('sr-sales-volume').setValue(x);
                                                    					}
                                                    					/* Sales Volume */
                                                    					
                                                    					/* Production Volume */
                                                    					if(_v.data.NAME == 'Production Volume (Mil.Tons)') {
                                                    						var x = eval('_v.data.VALUE_' + _p);
                                                    						Ext.getCmp('sr-production-volume').setValue(x);
                                                    					}
                                                    					/* Production Volume */
                                                    					
                                                    					/* Coal Transportation */
                                                    					if(_v.data.NAME == 'Coal Transportation (Mil.Tons)') {
                                                    						var x = eval('_v.data.VALUE_' + _p);
                                                    						Ext.getCmp('sr-coal-transport').setValue(x);
                                                    					}
                                                    					/* Coal Transportation */
                                                    				});
                                                    			}
                                                    		}
                                                    	}
                                                    }
                        						},{
                        							fieldLabel: 'Sales Volume',
                        							xtype: 'numberfield',
                        							allowBlank: false,
                        							id: 'sr-sales-volume',
                        							name: 'SALES_VOLUME',
                        							minValue: 0,
                        							value: 0
                        						},{
                        							fieldLabel: 'Production Volume',
                        							xtype: 'numberfield',
                        							allowBlank: false,
                        							id: 'sr-production-volume',
                        							name: 'PRODUCTION_VOLUME',
                        							minValue: 0,
                        							value: 0
                        						},{
                        							fieldLabel: 'Coal Transport',
                        							xtype: 'numberfield',
                        							allowBlank: false,
                        							id: 'sr-coal-transport',
                        							name: 'COAL_TRANSPORT',
                        							minValue: 0,
                        							value: 0
                        						}]
                        					}],
                        					buttons: [{
                        						text: 'Save',
                        						listeners: {
                        							 click: function() {
                                                         var form = Ext.getCmp('edit-stripping-ratio-form').getForm();
                                                         var store = loadStore('StrippingRatios');
                                                         
                                                         if(form.isValid()) {
                                                             form.submit({
                                                             url: sd.baseUrl + '/strippingratio/request/create/id/' + data.PEER_ID,
                                                             success: function(d) {
                                                                 var json = Ext.decode(d.responseText);
                                                                 form.reset();
                                                                 store.load({
                                                                     params: {
                                                                         id: data.PEER_ID
                                                                     }
                                                                 });
                                                                 Ext.Msg.alert('Success', 'Data has been saved');
                                                                 Ext.getCmp('edit-stripping-ratio').close();
                                                             },
                                                             failure: function(data) {
                                                                     var json = Ext.decode(data.responseText);
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
                        								Ext.getCmp('edit-stripping-ratio').close();
                        							}
                        						}
                        					}]
                        				}]
                        			}).show();
                        		}
                        	}
                        }]
                    }]
                },{
                    title: 'Average Selling Price',
                    border: false,
                    collapsible: true,
                    items: [{
                        xtype: 'gridpanel',
                        border: false,
                        //plugins: [new Ext.grid.plugin.RowEditing({clicksToMoveEditor: 1, autoCancel: false})],
                        minHeight: 120,
                        store: storeASP,
                        id: 'asp-grid',
                        columns: aspColumns,
                        tbar: [{
                            xtype: 'button',
                            text : 'Add New Average Selling Price',
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
                                                            success: function (d, e) {
                                                                var json = Ext.decode(e.response.responseText);
                                                                form.reset();
                                                                store.load({
                                                                    params: {
                                                                        id: data.PEER_ID
                                                                    }
                                                                });
                                                                Ext.Msg.alert('Success', 'Data has been saved');
                                                                Ext.getCmp('ASP').close();
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
                        	text: 'Edit Average Selling Price',
                        	iconCls: 'icon-accept',
                        	listeners: {
                        		click: function(){
                        			Ext.create('Ext.Window', {
                        				title: 'Edit Average Selling Price',
                        				id: 'edit-average-selling-price',
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
                        						id: 'edit-average-selling-price-form',
                        						border: false,
                        						bodyPadding: '5 5 5 5',
                        						defaultType: 'combobox',
                        						waitMsgTarget: true,
                        						items: [{
                        							fieldLabel: 'Title',
                        							allowBlank: false,
                        							xtype: 'combobox',
                        							name: 'TITLE',
                        							store: storeASP,
                        							mode: 'local',
                        							id: 'asp-title',
                        							emptyText: ' - Select - ',
                        							listWidth: 40,
                        							triggerAction: 'all',
                        							displayField: 'TITLE',
                        							editable: false,
                        							forceSelection: true,
                        							listeners: {
                        								change: function() {
                        									var _p = this.value;
                        									if(this.value !='null' && this.value !='') {
                        										var _f = Ext.getCmp('edit-average-selling-price-form');
                        										if(typeof(_f) !='undefined') {
                        											var _g = Ext.getCmp('asp-grid');
                        											Ext.each(_g.store.data.items, function(_v) {
                        												/* Value IDR */
                        												if(_v.data.NAME == 'Domestic (IDR)') {
                        													var x = eval('_v.data.VALUE_' + _p);
                        													Ext.getCmp('asp-value-idr').setValue(x);
                        												}
                        												/* Value IDR */
                        												
                        												/* Value USD */
                        												if(_v.data.NAME == 'Export (USD)') {
                        													var x = eval('_v.data.VALUE_' + _p);
                        													Ext.getCmp('asp-value-usd').setValue(x);
                        												}
                        												/* Value USD */
                        											});
                        										}
                        									}
                        								}
                        							}
                        						},{
                        							fieldLabel: 'Type',
                                                    allowBlank: false,
                                                    id: 'asp-type',
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
                        							fieldLabel: 'Value IDR',
                        							xtype: 'numberfield',
                        							allowBlank: false,
                        							id: 'asp-value-idr',
                        							name: 'VALUE_IDR',
                        							minValue: 0,
                        							value: 0
                        						},{
                        							fieldLabel: 'Value USD',
                        							xtype: 'numberfield',
                        							allowBlank: false,
                        							id: 'asp-value-usd',
                        							name: 'VALUE_USD',
                        							minValue: 0,
                        							value: 0
                        						}]
                        					}],
                        					buttons: [{
                        						text: 'Save',
                        						listeners: {
                        							click: function() {
                        								var form = Ext.getCmp('edit-average-selling-price-form').getForm();
                        								var store = loadStore('SellingPrices');
                        								
                        								if(form.isValid()) {
                        									form.submit({
                        									url: sd.baseUrl + '/sellingprice/request/create/id/' + data.PEER_ID,
                        									success: function(d) {
                        										var json = Ext.decode(d.responseText);
                        										form.reset();
                        										store.load({
                        											params: {
                        												id: data.PEER_NAME_ID
                        											}
                        										});
                        										Ext.Msg.alert('Success', 'Data has been saved');
                        										Ext.getCmp('edit-average-selling-price').close();
                        									},
                        									failure: function(data) {
                        										var json = Ext.decode(data.responseText);
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
                        								Ext.getCmp('edit-average-selling-price').close();
                        							}
                        						}
                        					}]
                        				}]
                        			}).show();
                        		}
                        	}
                        }]
                    }]
                },{
                    title: 'Financial Performance',
                    collapsible: true,
                    border: false,
                    //plugins: [new Ext.grid.plugin.RowEditing({clicksToMoveEditor: 1, autoCancel: false})],
                    xtype: 'gridpanel',
                    id: 'fp-grid',
                    minHeight: 240,
                    store: storeFP,
                    columns: fpColumns,
                    tbar: [{
                        xtype: 'button',
                        text: 'Add New Financial Performance',
                        iconCls: 'icon-accept',
                        listeners: {
                            click: function() {
                                Ext.create('Ext.Window', {
                                    title: 'Add New Financial Performance',
                                    id: 'FP',
                                    draggable: false,
                                    modal: true,
                                    width: 360,
                                    align: 'center',
                                    resizable: false,
                                    items: [{
                                        xtype: 'panel',
                                        border: false,
                                        items: [{
                                            xtype: 'form',
                                            layout: 'form',
                                            id: 'add-financial-performance-form',
                                            border: false,
                                            bodyPadding: '5 5 5 5',
                                            defaultType: 'textfield',
                                            waitMsgTarget: true,
                                            fieldDefaults: {
                    				            labelAlign: 'left',
                    				            labelWidth: 168,
                    				            anchor: '100%'
                    				        },
                                            items: [{
                                                fieldLabel: 'Title',
                                                allowBlank: false,
                                                name: 'TITLE'
                                            },{
                                                fieldLabel: 'Revenues',
                                                allowBlank: false,
                                                xtype: 'numberfield',
                                                minValue: 0,
                                                name: 'REVENUE'
                                            },{
                                                fieldLabel: 'Gross Profit',
                                                allowBlank: false,
                                                xtype: 'numberfield',
                                                minValue: 0,
                                                name: 'GROSS_PROFIT'
                                            },{
                                                fieldLabel: 'EBIT',
                                                allowBlank: false,
                                                xtype: 'numberfield',
                                                minValue: 0,
                                                name: 'EBIT'
                                            },{
                                                fieldLabel: 'EBITDA',
                                                allowBlank: false,
                                                xtype: 'numberfield',
                                                minValue: 0,
                                                name: 'EBITDA'
                                            },{
                                                fieldLabel: 'Net Profit',
                                                allowBlank: false,
                                                xtype: 'numberfield',
                                                minValue: 0,
                                                name: 'NET_PROFIT'
                                            },{
                                                fieldLabel: 'Total Assets',
                                                allowBlank: false,
                                                xtype: 'numberfield',
                                                minValue: 0,
                                                name: 'TOTAL_ASSETS'
                                            },{
                                                fieldLabel: 'Cash',
                                                allowBlank: false,
                                                xtype: 'numberfield',
                                                minValue: 0,
                                                name: 'CASH'
                                            },{
                                                fieldLabel: 'Gross Profit Margin',
                                                allowBlank: false,
                                                name: 'GROSS_PROFIT_MARGIN'
                                            },{
                                                fieldLabel: 'EBIT Margin',
                                                allowBlank: false,
                                                name: 'EBIT_MARGIN'
                                            },{
                                                fieldLabel: 'Net Profit Margin',
                                                allowBlank: false,
                                                name: 'NET_PROFIT_MARGIN'
                                            },{
                                                fieldLabel: 'Return On Asset',
                                                allowBlank: false,
                                                name: 'RETURN_ASSET'
                                            },{
                                                fieldLabel: 'Return On Equity',
                                                allowBlank: false,
                                                name: 'RETURN_EQUITY'
                                            },{
                                                fieldLabel: 'Return On Investment',
                                                allowBlank: false,
                                                name: 'RETURN_INVESTMENT'
                                            }]
                                        }],
                                        buttons: [{
                                            text: 'Save',
                                            listeners: {
                                                click: function() {
                                                    var form = Ext.getCmp('add-financial-performance-form').getForm();
                                                    var store = loadStore ('FinancialPerformances');
                                                        
                                                    if (form.isValid()) {
                                                        form.submit({
                                                        url: sd.baseUrl + '/financialperform/request/create/id/' + data.PEER_ID,
                                                        success: function(d) {
                                                            //console.log(data);
                                                            var json = Ext.decode(d.responseText);
                                                            form.reset();
                                                            store.load({
                                                                    params: {
                                                                        id: data.PEER_ID
                                                                    }
                                                            }); // Refresh grid data
                                                            Ext.Msg.alert('Success', 'Data has been saved');
                                                            Ext.getCmp('FP').close();
                                                        },
                                                        failure: function(data) {
                                                                //console.log(data);
                                                                var json = Ext.decode(data.responseText);
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
                    	text: 'Edit Financial Performance',
                    	iconCls: 'icon-accept',
                    	listeners: {
                    		click: function() {
                    			Ext.create ('Ext.Window', {
                    				title: 'Edit Financial Performance',
                    				 id:  'edit-financial-performance',
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
                    						 id: 'edit-financial-performance-form',
                    						 border: false,
                    						 bodyPadding: '5 5 5 5',
                    						 defaultType: 'textfield',
                    						 waitMsgTarget: true,
                    						 fieldDefaults: {
                    							 labelAlign: 'left',
                    							 labelWidth: '150',
                    							 anchor: '100%'
                    						 },
                    						 items: [{
                    							 fieldLabel: 'Title',
                                                 allowBlank: false,
                                                 xtype: 'combobox',
                                                 name: 'TITLE',
                                                 store: storeFP2,
                                                 mode : 'local',
                                                 id: 'fp-title',
                                                 emptyText: ' - Select - ',
                                                 listWidth : 40,
                                                 //triggerAction : 'all',
                                                 displayField  : 'TITLE',
                                                 editable      : false,
                                                 forceSelection: true,
                                                 listeners: {
                                                	 change: function() {
                                                		 var _p = this.value;
                                                		 if(this.value != 'null' && this.value !='') {
                                                			 
                                                			 var _f = Ext.getCmp('edit-financial-performance-form');
                                                			 if(typeof(_f) !='undefined') {
                                                				 var _g = Ext.getCmp('fp-grid');
                                                				 console.log(_g);
                                                				 Ext.each(_g.store.data.items, function(_v) {
                                                					/* Revenues*/
                                                					 if(_v.data.NAME == 'Revenue') {
                                                						 var x = eval('_v.data.VALUE_' + _p);
                                                						 Ext.getCmp('fp-revenue').setValue(x);
                                                					 }
                                                					
                                                					 /* Gross Profit */
                                                					 if(_v.data.NAME == 'Gross Profit') {
                                                						 var x = eval('_v.data.VALUE_' + _p);
                                                						 Ext.getCmp('fp-gross-profit').setValue(x);
                                                					 }
                                                					 
                                                					 /* EBIT */
                                                					 if(_v.data.NAME == 'EBIT') {
                                                						 var x = eval('_v.data.VALUE_' + _p);
                                                						 Ext.getCmp('fp-ebit').setValue(x);
                                                					 }
                                                					 
                                                					 /* EBITDA */
                                                					 if(_v.data.NAME == 'EBITDA') {
                                                						 var x = eval('_v.data.VALUE_' + _p);
                                                						 Ext.getCmp('fp-ebitda').setValue(x);
                                                					 }
                                                					 
                                                					 /* Net Profit */
                                                					 if(_v.data.NAME == 'Net Profit') {
                                                						 var x = eval('_v.data.VALUE_' + _p);
                                                						 Ext.getCmp('fp-net-profit').setValue(x);
                                                					 }
                                                					 
                                                					 /* Total Assets */
                                                					 if(_v.data.NAME == 'Total Assets') {
                                                						 var x = eval('_v.data.VALUE_' + _p);
                                                						 Ext.getCmp('fp-total-assets').setValue(x);
                                                					 }
                                                					 
                                                					 /* Cash */
                                                					 if(_v.data.NAME == 'Cash') {
                                                						 var x = eval('_v.data.VALUE_' + _p);
                                                						 Ext.getCmp('fp-cash').setValue(x);
                                                					 }
                                                					 
                                                					 /* Gross Profit Margin */
                                                					 if(_v.data.NAME == 'Gross Profit Margin (%)'){
                                                						 var x = eval('_v.data.VALUE_' + _p);
                                                						 Ext.getCmp('fp-gross-profit-margin').setValue(x);
                                                					 }
                                                					 
                                                					 /* EBIT Margin */
                                                					 if(_v.data.NAME == 'EBIT Margin (%)'){
                                                						 var x = eval('_v.data.VALUE_' + _p);
                                                						 Ext.getCmp('fp-ebit-margin').setValue(x);
                                                					 }
                                                					 
                                                					 /* Net Profit Margin */
                                                					 if(_v.data.NAME == 'Net Profit Margin (%)') {
                                                						 var x = eval('_v.data.VALUE_' + _p);
                                                						 Ext.getCmp('fp-net-profit-margin').setValue(x);
                                                					 }
                                                					 
                                                					 /* Return On Assets */
                                                					 if(_v.data.NAME == 'Return On Assets (%)'){
                                                						 var x = eval('_v.data.VALUE_' +_p);
                                                						 Ext.getCmp('fp-return-assets').setValue(x);
                                                					 }
                                                					 
                                                					 /* Return On Equity */
                                                					 if(_v.data.NAME == 'Return On Equity (%)'){
                                                						 var x = eval('_v.data.VALUE_' + _p);
                                                						 Ext.getCmp('fp-return-equity').setValue(x);
                                                					 }
                                                					 
                                                					 /* Return On Investment */
                                                					 if(_v.data.NAME == 'Return On Investment (%)') {
                                                						 var x = eval('_v.data.VALUE_' + _p);
                                                						 Ext.getCmp('fp-return-investment').setValue(x);
                                                					 }
                                                				 });
                                                			 }
                                                		 }
                                                	 }
                                                 }
                    						 },{
                    							 fieldLabel: 'Revenue',
                    							 id: 'fp-revenue',
                    							 allowBlank: false,
                    							 xtype: 'numberfield',
                    							 minValue: 0,
                    							 value: 0,
                    							 name: 'REVENUE'
                    						 },{
                    							 fieldLabel: 'Gross Profit',
                    							 id: 'fp-gross-profit',
                    							 allowBlank: false,
                    							 xtype: 'numberfield',
                    							 minValue: 0,
                    							 value: 0,
                    							 name: 'GROSS_PROFIT'
                    						 },{
                    							 fieldLabel: 'EBIT',
                    							 id: 'fp-ebit',
                    							 allowBlank: false,
                    							 xtype: 'numberfield',
                    							 minValue: 0,
                    							 value: 0,
                    							 name: 'EBIT'
                    						 },{
                    							 fieldLabel: 'EBITDA',
                    							 id: 'fp-ebitda',
                    							 allowBlank: false,
                    							 xtype: 'numberfield',
                    							 minValue: 0,
                    							 value: 0,
                    							 name: 'EBITDA'
                    						 },{
                    							 fieldLabel: 'Net Profit',
                    							 id: 'fp-net-profit',
                    							 allowBlank: false,
                    							 xtype: 'numbe });rfield',
                    							 minValue: 0,
                    							 value: 0,
                    							 name: 'NET_PROFIT'
                    						 },{
                    							 fieldLabel: 'Total Assets',
                    							 id: 'fp-total-assets',
                    							 allowBlank: false,
                    							 xtype: 'numberfield',
                    							 minValue: 0,
                    							 value: 0,
                    							 name: 'TOTAL_ASSETS'
                    						 },{
                    							 fieldLabel: 'Cash',
                    							 id: 'fp-cash',
                    							 allowBlank: false,
                    							 xtype: 'numberfield',
                    							 minValue: 0,
                    							 value: 0,
                    							 name: 'CASH'
                    						 },{
                    							 fieldLabel: 'Gross Profit Margin (%)',
                    							 id: 'fp-gross-profit-margin',
                    							 allowBlank: false,
                    							 name: 'GROSS_PROFIT_MARGIN'
                    						 },{
                    							 fieldLabel: 'EBIT Margin (%)',
                    							 id: 'fp-ebit-margin',
                    							 allowBlank: false,
                    							 name: 'EBIT_MARGIN'
                    						 },{
                    							 fieldLabel: 'Net Profit Margin (%)',
                    							 id: 'fp-net-profit-margin',
                    							 allowBlank: false,
                    							 name: 'NET_PROFIT_MARGIN'
                    						 },{
                    							 fieldLabel: 'Return On Assets (%)',
                    							 id: 'fp-return-assets',
                    							 allowBlank: false,
                    							 name: 'RETURN_ASSET'
                    						 },{
                    							 fieldLabel: 'Return On Equity (%)',
                    							 id: 'fp-return-equity',
                    							 allowBlank: false,
                    							 name: 'RETURN_EQUITY'
                    						 },{
                    							 fieldLabel: 'Return On Investment (%)',
                    							 id: 'fp-return-investment',
                    							 allowBlank: false,
                    							 name: 'RETURN_INVESTMENT'
                    						 }]
                    					 }],
                    					 buttons: [{
                    						 text: 'Save',
                    						 listeners: {
                    							 click: function() {
                    								var form = Ext.getCmp('edit-financial-performance-form').getForm();
                    								var store = loadStore('FinancialPerformances');
                    								 
                    								if(form.isValid()) {
                    									form.submit ({
                    									url: sd.baseUrl	+ '/financialperform/request/create/id/' + data.PEER_ID,
                    									success: function(d) {
                    										var json = Ext.decode(d.responseText);
                    										form.reset();
                    										store.load({
                    											params: {
                    												id: data.PEER_ID
                    											}
                    										});
                    										Ext.Msg.alert('Success', 'Data has been saved');
                    										Ext.getCmp('edit-financial-performance').close();
                    									},
                    									failure: function(data) {
                    										var json = Ext.decode(data.responseText);
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
                    								 Ext.getCmp('edit-financial-performance').close();
                    							 }
                    						 }
                    					 }]
                    				 }]
                    			}).show();
                    		}
                    	}
                    }]
                },{
                    title: 'Total Cash Cost (FOB)',
                    collapsible: true,
                    border: false,
                    xtype: 'gridpanel',
                    id: 'fob-grid',
                    //plugins: [new Ext.grid.plugin.RowEditing({clicksToMoveEditor: 1, autoCancel: false})],
                	store: storeFOB,
                    columns: fobColumns,
                    minHeight: 150,
                    tbar: [{
                    	xtype: 'button',
                    	text: 'Add New Total Cash Cost',
                    	iconCls: 'icon-accept',
                    	listeners: {
                    		click: function() {
                    			Ext.create('Ext.Window', {
                    				title: 'Add New Total Cash Cost',
                    				id: 'FOB',
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
                    						id: 'add-new-total-cash-cost-form',
                    						border: false,
                    						bodyPadding: '5 5 5 5',
                    						defaultType: 'textfield',
                    						waitMsgTarget: true,
                    						fieldDefaults: {
                    				            labelAlign: 'left',
                    				            labelWidth: 160,
                    				            anchor: '100%'
                    				        },
                    						items: [{
                    							fieldLabel: 'Title',
                    							allowBlank: false,
                    							name: 'TITLE'
                    						},{
                    							fieldLabel: 'Ex. Royalty (IDR)',
                    							allowBlank: false,
                    							xtype: 'numberfield',
                    							minValue: 0,
                    							value: 0,
                    							name: 'ROYALTY_IDR'
                    						},{
                    							fieldLabel: 'Ex. Royalty (USD)',
                    							allowBlank: false,
                    							xtype: 'numberfield',
                    							minValue: 0,
                    							value: 0,
                    							name: 'ROYALTY_USD'
                    						},{
                    							fieldLabel: 'Total (IDR)',
                    							allowBlank: false,
                    							xtype: 'numberfield',
                    							minValue: 0,
                    							value: 0,
                    							name: 'TOTAL_IDR'
                    						},{
                    							fieldLabel: 'Total (USD)',
                    							allowBlank: false,
                    							xtype: 'numberfield',
                    							minValue: 0,
                    							value: 0,
                    							name: 'TOTAL_USD'
                    						},{
                    							fieldLabel: 'Currency 1 USD',
                    							allowBlank: false,
                    							xtype: 'numberfield',
                    							minValue: 0,
                    							value: 0,
                    							name: 'CURRENCY'
                    						}]
                    					}],
                    						buttons: [{
                    							text: 'Save',
                    							listeners: {
                    								click: function() {
                    									var form = Ext.getCmp('add-new-total-cash-cost-form').getForm();
                    									var store = loadStore('TotalCashCosts');
                    									
                    									if(form.isValid()) {
                    										form.submit({
                                                                url: sd.baseUrl + '/totalcashcost/request/create/id/' + data.PEER_ID,
                                                                success: function(d) {
                                                                    //console.log(data);
                                                                    var json = Ext.decode(d.responseText);
                                                                    form.reset();
                                                                    store.load({
                                                                        params: {
                                                                            id: data.PEER_ID
                                                                        }
                                                                    }); // Refresh grid data
                                                                    Ext.Msg.alert('Success', 'Data has been saved');
                                                                    Ext.getCmp('FOB').close();
                                                                },
                                                                failure: function(data) {
                                                                    //console.log(data);
                                                                    var json = Ext.decode(data.responseText);
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
                    	text: 'Edit Total Cash Cost',
                    	iconCls: 'icon-accept',
                    	listeners: {
                    		click: function() {
                    			Ext.create('Ext.Window', {
                    				title: 'Edit Total Cash Cost',
                    				id: 'edit-total-cash-cost',
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
                    						id: 'edit-total-cash-cost-form',
                    						border: false,
                    						bodyPadding: '5 5 5 5',
                    						waitMsgTarget: true,
                    						fieldDefaults: {
                    							labelAlign: 'left',
                    							labelWidth: 160,
                    							anchor: '100%'
                    						},
                    						items: [{
                    							fieldLabel: 'Title',
                    							allowBlank: false,
                                                xtype: 'combobox',
                                                name: 'TITLE',
                                                store: storeFOB,
                                                mode : 'local',
                                                id: 'fob-title',
                                                emptyText: ' - Select - ',
                                                listWidth : 40,
                                                triggerAction : 'all',
                                                displayField  : 'TITLE',
                                                editable      : false,
                                                forceSelection: true,
                                                listeners: {
                                                	change: function () {
	                                                	var _p = this.value;
	                                                	if(this.value !='null' && this.value !=''){
	                                                		var _f = Ext.getCmp('edit-total-cash-cost-form');
	                                                		if(typeof(_f) !='undefined') {
	                                                			var _g = Ext.getCmp('fob-grid');
	                                                			Ext.each(_g.store.data.items, function(_v) {
	                                                				/* Royalty IDR */
	                                                				 if(_v.data.NAME == 'Ex. Royalty (IDR)') {
	                                                					 var x = eval('_v.data.VALUE_' + _p);
	                                                					 Ext.getCmp('fob-royalty-idr').setValue(x);
	                                                				 }
	                                                				 
	                                                				 /* Royalty USD */
	                                                				 if(_v.data.NAME == 'Ex. Royalty (USD)') {
	                                                					 var x = eval('_v.data.VALUE_' + _p);
	                                                					 Ext.getCmp('fob-royalty-usd').setValue(x);
	                                                				 }
	                                                				 
	                                                				 /* Total IDR */
	                                                				 if(_v.data.NAME == 'Total (IDR)') {
	                                                					 var x = eval('_v.data.VALUE_' + _p);
	                                                					 Ext.getCmp('fob-total-idr').setValue(x);
	                                                				 }
	                                                				 
	                                                				 /* Total USD */
	                                                				 if(_v.data.NAME == 'Total (USD)') {
	                                                					 var x = eval('_v.data.VALUE_' + _p);
	                                                					 Ext.getCmp('fob-total-usd').setValue(x);
	                                                				 }
	                                                				 
	                                                				 /* Currency */
	                                                				 if(_v.data.NAME == 'Currency 1 USD =') {
	                                                					 var x = eval('_v.data.VALUE_' + _p);
	                                                					 Ext.getCmp('fob-currency').setValue(x);
	                                                				 }
	                                                			}) ;
	                                                		}
	                                                	}
                                                	}
                                                }
                    						},{  
                    							fieldLabel: 'Ex. Royalty (IDR)',
                    							id: 'fob-royalty-idr',
                    							allowBlank: false,
                    							xtype: 'numberfield',
                    							minValue: 0,
                    							value: 0,
                    							name: 'ROYALTY_IDR'
                    						},{
                    							fieldLabel: 'Ex. Royalty (USD)',
                    							id: 'fob-royalty-usd',
                    							allowBlank: false,
                    							xtype: 'numberfield',
                    							minValue: 0,
                    							value: 0,
                    							name: 'ROYALTY_USD'
                    						},{
                    							fieldLabel: 'Total (IDR)',
                    							id: 'fob-total-idr',
                    							allowBlank: false,
                    							xtype: 'numberfield',
                    							minValue: 0,
                    							value: 0,
                    							name: 'TOTAL_IDR'
                    						},{
                    							fieldLabel: 'Total (USD)',
                    							id: 'fob-total-usd',
                    							allowBlank: false,
                    							xtype: 'numberfield',
                    							minValue: 0,
                    							value: 0,
                    							name: 'TOTAL_USD'
                    						},{
                    							fieldLabel: 'Currency 1 USD',
                    							id: 'fob-currency',
                    							allowBlank: false,
                    							xtype: 'numberfield',
                    							minValue: 0,
                    							value: 0,
                    							name: 'CURRENCY'
                    						}]
                    					}],
                    					buttons : [{
                    						text: 'Save',
                    						listeners: {
                    							click: function() {
                    								var form = Ext.getCmp('edit-total-cash-cost-form').getForm();
                    								var store = loadStore('TotalCashCosts');
                    								
                    								if(form.isValid()) {
                    									form.submit ({
                    										url: sd.baseUrl + '/totalcashcost/request/create/id/' + data.PEER_ID,
                    										success: function(d) {
                    											var json = Ext.decode(d.responseText);
                                                                form.reset();
                                                                store.load({
                                                                    params: {
                                                                        id: data.PEER_ID
                                                                    }
                                                                }); // Refresh grid data
                                                                Ext.Msg.alert('Success', 'Data has been saved');
                                                                Ext.getCmp('edit-total-cash-cost').close();
                    										},
                    										failure: function(){
                    											var json = Ext.decode(data.responseText);
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
                									Ext.getCmp('edit-total-cash-cost').close();
                								}
                							}
                    					}]
                    				}]
                    			}).show();
                    		}
                    	}
                    }]
                },{ //Reserves & Resources
                    title: 'Reserves & Resources',
                    collapsible: true,
                    border: false,
                    xtype: 'gridpanel',
                    plugins: [new Ext.grid.plugin.RowEditing({clicksToMoveEditor: 1, autoCancel: false})],
                    store: storeRR,
                    id: 'rr-grid',
                    minHeight: 130,
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
                                                        var store = loadStore ('PeerResourceReserves');
                                                        
                                                        if (form.isValid()) {
                                                            form.submit({
                                                                url: sd.baseUrl + '/peerrs/request/create/id/' + data.PEER_ID,
                                                                success: function(d) {
                                                                    //console.log(data);
                                                                    var json = Ext.decode(d.responseText);
                                                                    form.reset();
                                                                    store.load({
                                                                        params: {
                                                                            id: data.PEER_ID
                                                                        }
                                                                    }); // Refresh grid data
                                                                    Ext.Msg.alert('Success', 'Data has been saved');
                                                                    Ext.getCmp('RR').close();
                                                                },
                                                                failure: function(data) {
                                                                    //console.log(data);
                                                                    var json = Ext.decode(data.responseText);
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
                        text: 'Delete',
                        iconCls: 'icon-stop',
                        listeners: {
                            click: function() {
                            	var _c = Ext.getCmp('rr-grid');
                            	var _selected = _c.getSelectionModel().getSelection();
                            	if(_selected.length > 0) {
                            		var _data = _selected[0].data;
                            		Ext.create('Ext.Window', {
                            			html: 'Are you sure want do delete selected item(s) ?',
                            			bodyPadding: '5 5 5 5',
                            			modal: true,
                            			id: 'delete-reserves-resource-window',
                            			title: 'Confirmation',
                            			resizable: false,
                            			closable: false,
                            			draggabel: false,
                            			width: 300,
                            			height: 120,
                            			buttons: [{
                            				text: 'Yes',
                            				listeners: {
                            					click: function() {
                            						showLoadingWindow();
                                                    this.up().up().close();
                                                    Ext.Ajax.request({
                                                          url: sd.baseUrl + '/peerrs/request/destroy',
                                                          params: {
                                                                id: _data.RESERVES_RESOURCES_ID
                                                          },
                                                          success: function(d) {
                                                                var json = Ext.decode(d.responseText);
                                                                closeLoadingWindow();
                                                                storeRR.load({
                                                                      params: {
                                                                            id: data.PEER_ID
                                                                      }
                                                                });
                                                                Ext.Msg.alert('Message', 'Data successfully deleted.');
                                                          },
                                                          failure: function(d) {
                                                                var json = Ext.decode(d.responseText);
                                                                closeLoadingWindow();
                                                                Ext.Msg.alert('Error', json.error_message);
                                                          }
                                                    });
                            					}
                            				}
                            			},{
                            				text: 'No',
                            				listeners: {
                            					click: function() {
                            						Ext.getCmp ('delete-reserves-resource-window').close();
                            					}
                            				}
                            			}]
                            		}).show();
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
                },{
                    title: 'Composition of the Company\'s Shareholders at the End of the Year',
                    collapsible: true,
                    id: 'csy-grid',
                    border: false,
                    xtype: 'gridpanel',
                    minHeight: 150,
                    columns: csyColumns,
                    store: storeCSY,
                    tbar: [{
                        xtype: 'button',
                        text: 'Add New Composition',
                        iconCls: 'icon-accept',
                        listeners: {
                            click: function() {
                                Ext.create('Ext.Window', {
                                    title: 'Add New Composition Company at the End of the Year',
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
                                                    var store = loadStore('CompositionCompanys');

                                                    if (form.isValid()) {
                                                        form.submit({
                                                            url: sd.baseUrl + '/compositioncompany/request/create/id/' + data.PEER_ID,
                                                            success: function(d) {
                                                                var json = Ext.decode(d.responseText);
                                                                form.reset();
                                                                store.load({
                                                                    params: {
                                                                        id: data.PEER_ID
                                                                    }
                                                                }); // Refresh grid data
                                                                Ext.Msg.alert('Success', 'Data has been saved');
                                                                Ext.getCmp('CSY').close();
                                                            },
                                                            failure: function(data) {
                                                                var json = Ext.decode(data.responseText);
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
                    	text: 'Edit Company Composition',
                    	iconCls: 'icon-accept',
                    	listeners: {
                    		click: function() {
                    			Ext.create('Ext.Window', {
                    				title: 'Edit Company Composition',
                    				id: 'edit-company-composition',
                    				draggable: false,
                    				modal: true,
                    				width: 360,
                    				align: 'center',
                    				resizable: false,
                    				items: [{
                    					xtype: 'panel',
                    					border: false,
                    					items: [{
                    						xtype: 'form',
                    						layout: 'form',
                    						id: 'edit-company-composition-form',
                    						border: false,
                    						bodyPadding: '5 5 5 5',
                    						defaultType: 'textfield',
                    						waitMsgTarget: true,
                    						fieldDefaults: {
                    							labelAlign: 'left',
                    							labelWidth: '150',
                    							anchor: '100%'
                    						},
                    						items: [{
                    							fieldLabel: 'Title',
                    							xtype: 'combobox',
                    							allowBlank: false,
                    							name: 'TITLE',
                    							store: storeCSY,
                    							mode: 'local',
                    							id: 'csy-title',
                    							emptyText: ' - Select - ',
                    							listWidth: 40,
                    							triggerAction: 'all',
                    							displayField: 'TITLE',
                    							editable: false,
                    							forceSelection: true,
                    							listeners: {
                    								change: function() {
                    									var _p = this.value;
                    									if(this.value !='null' && this.value !=''){
                    										var _f = Ext.getCmp('edit-company-composition-form');
                    										if(typeof(_f) !='undefined') {
                    											var _g = Ext.getCmp('csy-grid');
                    											Ext.each(_g.store.data.items, function(_v) {
                    												
                    												/* Republic Of Indonesia */
                    												if(_v.data.NAME == 'Republic Of Indonesia') {
                    													var x = eval('_v.data.VALUE_' + _p);
                    					                            	Ext.getCmp('csy-republic-indonesia').setValue(x);
                    					                            }
                    												
                    												/* Domestic Investor */
                    												if(_v.data.NAME == 'Domestic Investor') {
                    													var x = eval('_v.data.VALUE_' + _p);
                    					                            	Ext.getCmp('csy-domestic-investor').setValue(x);
                    					                            }
                    												
                    												/* Foreign Investor */
                    												if(_v.data.NAME == 'Foreign Investor') {
                    													var x = eval('_v.data.VALUE_' + _p);
                    					                            	Ext.getCmp('csy-foreign-investor').setValue(x);
                    					                            }
                    											});
                    										}
                    									}
                    								}
                    							}
                    						},{
                    							fieldLabel: 'Republic Of Indonesia',
                    							id: 'csy-republic-indonesia',
                    							allowBlank: false,
                    							xtype: 'numberfield',
                    							minValue: 0,
                    							value: 0,
                    							name: 'REPUBLIC_OF_INDONESIA'
                    						},{
                    							fieldLabel: 'Domestic Investor',
                    							id: 'csy-domestic-investor',
                    							allowBlank: false,
                    							xtype: 'numberfield',
                    							minValue: 0,
                    							value: 0,
                    							name: 'DOMESTIC_INVESTOR'
                    						},{
                    							fieldLabel: 'Foreign Investor',
                    							id: 'csy-foreign-investor',
                    							allowBlank: false,
                    							xtype: 'numberfield',
                    							minValue: 0,
                    							value: 0,
                    							name: 'FOREIGN_INVESTOR'
                    						}]
                    					}],
                    					buttons: [{
                    						text: 'Save',
                    						listeners: {
                    							click: function() {
                    								var form = Ext.getCmp('edit-company-composition-form').getForm();
                    								var store = loadStore('CompositionCompanys');
                    								
                    								if(form.isValid()) {
                    									form.submit({
                    										url: sd.baseUrl + '/compositioncompany/request/create/id/' + data.PEER_ID,
                    										success: function(d) {
                    											var json = Ext.decode(d.responseText);
                    											form.reset();
                    											store.load({
                    												params: {
                    													id: data.PEER_ID
                    												}
                    											});
                    											Ext.Msg.alert('Success', 'Data has been saved');
                    											Ext.getCmp('edit-company-composition').close();
                    										},
                    										failure: function(data) {
                    											var json = Ext.decode(data.responseText);
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
                    								Ext.getCmp('edit-company-composition').close();
                    							}
                    						}
                    					}]
                    				}]
                    			}).show();
                    		}
                    	}
                    }]
                },{
                    title: 'Coal Sales Distribution',
                    collapsible: true,
                    border: false,
                    xtype: 'gridpanel',
                    minHeight: 130,
                    columns: csdColumns,
                    store: storeCSD
                },{
                    title: 'Coal Sales Distribution By Country',
                    collapsible: true,
                    border: false,
                    xtype: 'gridpanel',
                    store: storeCSD_BC,
                    columns: csd_bcColumns,
                    minHeight: 200,
                    tbar: [{
                        xtype: 'button',
                        text: 'Add New Coal Sales Distribution',
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
                                                                store.load({
                                                                    params: {
                                                                        id: data.PEER_ID
                                                                    }
                                                                });
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
                    }]
                }]
            }]
        });
    }
    c.up().setActiveTab(id);
    $('body').css('overflow','hidden');
} else {
    Ext.Msg.alert('Message', 'You did not select any Company');
}