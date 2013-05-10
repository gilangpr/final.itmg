var c = Ext.getCmp('<?php echo $this->container ?>');
var selected = c.getSelectionModel().getSelection();
if(selected.length > 0) {
	var id = 'group-manage-privilege-list-' + selected[0].id;
	var data = selected[0].data;
	
	var treeStore = Ext.create('Ext.data.TreeStore', {
		proxy: {
			type: 'ajax',
			url: sd.baseUrl + '/groups/request/read-tree',
			waitMsg: 'Loading data, please wait..',
			actionMethods: {
				read: 'POST'
			},
			extraParams: {
				id: data.GROUP_ID
			}
		}
	});
	
	treeStore.load();
	var menus = new Array();
	var sub_menus = new Array();
	var actions = new Array();
	
	if(!c.up().items.get(id)) {
		c.up().add({
			xtype: 'panel',
			id: id,
			title: 'Manage Privilege : ' + data.GROUP_NAME,
			closable: true,
			autoScroll: true,
			items: [{
				border: false,
				title: 'Access Right',
				xtype: 'treepanel',
				waitMsgTarget: true,
				id: 'treepanel-' + id,
				closable: true,
				mask: true,
				maskConfig: {
					msg: 'Loading tree, please wait..'
				},
				id: 'groups-access-right-tree-panel-' + id,
				rootVisible: false,
				useArrows: true,
				store: treeStore,
				closable: false
			}],
			tbar: [{
				xtype: 'button',
				text: 'Save',
				iconCls: 'icon-accept',
				listeners: {
					click: function() {
						var comp = Ext.getCmp('groups-access-right-tree-panel-' + id);
						var tst = comp.getChecked();
						var posts = new Array();
						Ext.each(tst, function(d) {
							posts[posts.length] = {'id' : d.raw.ids, 'type' : d.raw.type};
						});
						showLoadingWindow();
						Ext.Ajax.request({
							url: sd.baseUrl + '/groups/request/privileges',
							params: {
								id: data.GROUP_ID,
								data: Ext.encode(posts)
							},
							success: function(_d) {
								var json = Ext.decode(_d.responseText);
								closeLoadingWindow();
							},
							failure: function(_d) {
								var json = Ext.decode(_d.responseText);
								Ext.Msg.alert('Error', json.error_message);
								closeLoadingWindow();
							}
						});
					}
				}
			}]
		});
	}
	c.up().setActiveTab(id);
} else {
	Ext.Msg.alert('Message', 'You did not select any Group');
}