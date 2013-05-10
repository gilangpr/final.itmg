var c = Ext.getCmp('<?php echo $this->container ?>');
var selected = c.getSelectionModel().getSelection();
if(selected.length > 0) {
	var id = 'group-detail-' + selected[0].id;
	if(!c.up().items.get(id)) {
		var data = selected[0].data;
		var storeGM = loadStore('GroupMembers');
		storeGM.load({
			params: {
				id: data.GROUP_ID
			}
		});
		var storeUSERS = loadStore('Users');
		storeUSERS.load({
			params: {
				all: 1
			}
		});
		
		var comboBbar = new Ext.form.ComboBox({
		  name : 'perpage',
		  id: 'groupmembers-bbar-' + data.GROUP_ID,
		  width: 50,
		  store: new Ext.data.ArrayStore({fields:['id'],data:[['25'],['50'],['75'],['100']]}),
		  mode : 'local',
		  value: '25',
		  listWidth     : 40,
		  triggerAction : 'all',
		  displayField  : 'id',
		  valueField    : 'id',
		  editable      : false,
		  forceSelection: true
		});
			
		var bbar = new Ext.PagingToolbar({
			store: storeGM,
			displayInfo: true,
			id: 'groupmember-bbar2-' + data.GROUP_ID,
			displayMsg: 'Displaying data {0} - {1} of {2}',
			emptyMsg: 'No data to display',
			items: [
			    '-',
			    'Records per page',
			    '-',
			    comboBbar
			]
		});
		
		comboBbar.on('select', function(combo, _records) {
			storeGM.pageSize = parseInt(_records[0].get('id'), 10);
			storeGM.load({
				params: {
					id: data.GROUP_ID,
					limit: parseInt(_records[0].get('id', 10))
				}
			});
		}, this);
			
		c.up().add(Ext.create('Ext.panel.Panel', {
			title: 'Manage Group - ' + data.GROUP_NAME,
			closable: true,
			id: id,
			items: [{
				xtype: 'gridpanel',
				border: false,
				store: storeGM,
				id: 'groupmember-list-' + data.GROUP_ID,
				bbar: bbar,
				height: c.up().getHeight() - 56,
				waitMsgTarget: true,
				columns: [{
					text: 'Username',
					flex: 1,
					dataIndex: 'USERNAME'
				},{
					text: 'Created Date',
					align: 'center',
					width: 150,
					dataIndex: 'CREATED_DATE'
				}]
			}],
			tbar: [{
				xtype: 'button',
				text: 'Add User',
				iconCls: 'icon-go',
				listeners: {
					click: function() {
						Ext.create('Ext.Window', {
							title: 'Add User',
							id: 'groupmember-list-add-user-window',
							draggable: false,
							width: 300,
							resizable: false,
							modal: true,
							waitMsgTarget: true,
							items: [{
								xtype: 'form',
								layout: 'form',
								border: false,
								id: 'groupmember-detail-add-user-form-' + data.GROUP_ID,
								bodyPadding: '5 5 5 5',
								items: [{
									xtype: 'combobox',
									fieldLabel: 'Username',
									store: storeUSERS,
									displayField: 'USERNAME',
									name: 'USERNAME',
									typeAhead: false,
									editable: false,
									emptyText: 'Select Username',
									allowBlank: false
								}]
							}],
							buttons: [{
								text: 'Save',
								listeners: {
									click: function() {
										var form = Ext.getCmp('groupmember-detail-add-user-form-' + data.GROUP_ID).getForm();
										if(form.isValid()) {
											form.submit({
												url: sd.baseUrl + '/groupmembers/request/create',
												waitMsg: 'Saving data, please wait..',
												params: {
													id: data.GROUP_ID
												},
												success: function(d, e) {
													var json = Ext.decode(e.response.responseText);
													Ext.Msg.alert('Message', 'User successfully added.');
													storeGM.load({
														params: {
															id: data.GROUP_ID
														}
													});
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
										this.up().up().close();
									}
								}
							}]
						}).show();
					}
				}
			},{
				xtype: 'button',
				text: 'Delete User',
				iconCls: 'icon-stop',
				listeners: {
					click: function() {
						var c_x = Ext.getCmp('groupmember-list-' + data.GROUP_ID);
						var c_sel = c_x.getSelectionModel().getSelection();
						if(c_sel.length > 0) {
							Ext.create ('Ext.Window', {
								html: 'Are you sure want do delete selected item(s) ?',
								bodyPadding: '20 5 5 17',
								title: 'Confirmation',
								resizable: false,
								modal: true,
								closable: false,
								draggable: false,
								width: 300,
								height: 120,
								buttons: [{
									text: 'Yes',
									listeners: {
										click: function() {
											showLoadingWindow();
											this.up().up().close();
											Ext.Ajax.request({
												url: sd.baseUrl + '/groupmembers/request/destroy',
												params: {
													id: data.GROUP_ID,
													username: c_sel[0].data.USERNAME
												},
												success: function(d) {
													var json = Ext.decode(d.responseText);
													closeLoadingWindow();
													storeGM.load({
														params: {
															id: data.GROUP_ID
														}
													});
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
											this.up().up().close();
										}
									}
								}]
							}).show();
						} else {
							Ext.Msg.alert('Message', 'You did not select any User');
						}
					}
				}
			}]
		}));
	}
	c.up().setActiveTab(id);
} else {
	Ext.Msg.alert('Message', 'You did not select any Group');
}