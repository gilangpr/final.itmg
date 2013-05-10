{
	title: 'Sector Holdings',
	style: {
		float: 'left',
		width: '50%'
	},
	minHeight: 300,
	items: [{
		xtype: 'chart',
		store: storeSH,
		id:'chartCmp',
		width: 570,
		height: 300,
		animate: true,
		legend: {
			position: 'right'
		},
		series: [{
			type: 'pie',
			field: 'VALUE',
			showInLegend: true,
			highlight: {
				segment: {
					margin: 20
				}
			},
			label: {
				display: 'rotate',
                  'text-anchor': 'middle',
                field: 'TITLE',
                orientation: 'horizontal',
                fill: '#FFF',
                font: '14px Arial',
                renderer: function (label){
		            // this will change the text displayed on the pie
		            var cmp = Ext.getCmp('chartCmp'); // id of the chart
		            var index = cmp.store.findExact('TITLE', label); // the field containing the current label
		            var data = cmp.store.getAt(index).data;
		            //calculate percentage.
                    var total = 0;
                    storeSH.each(function(rec) {
                        total += rec.get('VALUE');
                    });
		            return Math.round((data.VALUE / total) * 100) + '%'; // the field containing the label to display on the chart
          		}
			},
			tips: {
                  trackMouse: false,
                  width: 140,
                  height: 35,
                  renderer: function(storeItem, item) {
                    //calculate percentage.
                    var total = 0;
                    storeSH.each(function(rec) {
                        total += rec.get('VALUE');
                    });
                    this.setTitle(storeItem.get('TITLE') + ': ' + Math.round(storeItem.get('VALUE') / total * 100) + '%');
                  }
            }
		}]
	}],
	tbar: [{
		xtype: 'button',
		text: 'Manage Data',
		iconCls: 'icon-detail',
		listeners: {
			click: function() {
				Ext.create('Ext.Window', {
					title: 'Sector Holding Data',
					resizabe: false,
					modal: true,
					draggable: false,
					resizable: false,
					items: [{
						xtype: 'gridpanel',
						minWidth: 500,
						minHeight: 200,
						border: false,
						plugins:[cellEditing3],
						store: storeSH,
						id: 'investors-detail-sector-holding-data-grid-' + data.INVESTOR_ID,
						tbar: [{
							xtype: 'button',
							text: 'Add New Sector Holding Data',
							iconCls: 'icon-go',
							listeners: {
								click: function() {
									Ext.create('Ext.Window', {
										title: 'Add New Sector Holding Data',
										modal: true,
										draggable: false,
										resizable: false,
										items: [{
											xtype: 'form',
											id: 'investors-detail-sector-holding-add-new-form-' + data.INVESTOR_ID,
											minWidth: 300,
											border: false,
											bodyPadding: '5 5 5 5',
											items: [{
												xtype: 'textfield',
												fieldLabel: 'Title <span style="color:red;">*</span>',
												name: 'TITLE',
												allowBlank: false
											},{
												xtype: 'numberfield',
												fieldLabel: 'Value',
												name: 'VALUE',
												allowBlank: false,
												value: 0,
												minValue: 0
											}]
										}],
										buttons: [{
											text: 'Save',
											listeners: {
												click: function() {
													var form = Ext.getCmp('investors-detail-sector-holding-add-new-form-' + data.INVESTOR_ID);
													if(form.getForm().isValid()) {
														Ext.MessageBox.confirm('Confirmation', 'Are you sure want to save this data ?', function(btn) {
															if(btn == 'yes') {
																form.getForm().submit({
																	url: sd.baseUrl + '/sectorholdings/request/create/id/' + data.INVESTOR_ID,
																	waitMsg: 'Saving data, please wait..',
																	params: {
																		id: data.INVESTOR_ID
																	},
																	success: function(d, e) {
																		var json = Ext.decode(e.response.responseText);
																		Ext.Msg.alert('Message', 'Saving data success.');
																		storeSH.load({
																			params: {
																				id: data.INVESTOR_ID
																			}
																		});
																		form.getForm().reset();
																	},
																	failure: function(d, e) {
																		var json = Ext.decode(e.response.responseText);
																		Ext.Msg.alert('Error', '[' + json.error_code + '] : ' + json.error_message);
																	}
																});
															}
														});
													} else {
														Ext.Msg.alert('Error', manr);
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
							xtype: 'button',
							text: 'Delete',
							iconCls: 'icon-stop',
							listeners: {
								click: function() {
									var __c = Ext.getCmp('investors-detail-sector-holding-data-grid-' + data.INVESTOR_ID);
									var __selected = __c.getSelectionModel().getSelection();
									if(__selected.length > 0) {
										var __data = __selected[0].data;
										Ext.MessageBox.confirm('Delete Confirmation', 'Are you sure want to delete selected data(s) ?', function(btn) {
											if(btn == 'yes') {
												showLoadingWindow();
												Ext.Ajax.request({
													url: sd.baseUrl + '/sectorholdings/request/destroy',
													params: {
														SECTOR_HOLDING_ID: __data.SECTOR_HOLDING_ID,
														INVESTOR_ID:data.INVESTOR_ID
													},
													success: function(d) {
														var json = Ext.decode(d.responseText); // Decode responsetext | Json to Javasript Object
														closeLoadingWindow();
														storeSH.load({
															params: {
																id: data.INVESTOR_ID
															}
														});
													},
													failure: function(d) {
														var json = Ext.decode(d.responseText); // Decode responsetext | Json to Javasript Object
														closeLoadingWindow();
														Ext.Msg.alert('Error', '[' + json.error_code + '] : ' + json.error_message);
													}
												});
											}
										});
									} else {
										Ext.Msg.alert('Message', 'You did not select any data(s).');
									}
								}
							}
						}],
						columns: [{
							text: 'Title',
							flex: 1,
							dataIndex: 'TITLE',
							editor:{
								name:'TITLE'
							}
						},{
							text: 'Value',
							width: 120,
							align: 'center',
							dataIndex: 'VALUE',
							editor:{
								name:'VALUE',
								xtype:'numberfield'
							}
						}]
					}]
				}).show();
			}
		}
	}]
}