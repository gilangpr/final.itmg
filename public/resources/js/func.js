function loadMenus() {
	showLoadingWindow();
	Ext.Ajax.request({
		url : sd.baseUrl + '/groups/request/has-access',
		params: {
			type: 'menus',
			groups: Ext.encode(sd.groups)
		},
		success: function(d) {
			var json = Ext.decode(d.responseText);
			Ext.each(json.data.items.data, function(_e, _i){
				json.data.items.data[_i].height = sd.nav.height;
				json.data.items.data[_i].width = sd.nav.width;
				json.data.items.data[_i].listeners =  {
					click: function() {
						loadContent(this, json.data.items.data[_i].editor);
					}
				};
			});
			Ext.create('Ext.panel.Panel', {
				renderTo: document.getElementById('nav'),
				border: false,
				tbar: json.data.items.data,
				id: 'big-panel',
				listeners: {
					render: function() {
						closeLoadingWindow();
					}
				}
			});
		},
		failure: function(d) {
			var json = Ext.decode(d.responseText);
			closeLoadingWindow();
		}
	});
}
function showLoadingWindow() {
	Ext.create('Ext.Window', {
		id: 'loading-window',
		title: 'Loading',
		width: 200,
		resizable: false,
		draggable: false,
		modal: true,
		closable: false,
		html: '<div style="padding: 10px;text-align: center"><img width="40" height="40" src="' + sd.baseUrl + '/images/350.gif"/><br/>Loading data, please wait..</div>'
	}).show();
}
function closeLoadingWindow() {
	var loading = Ext.getCmp('loading-window');
	loading.close();
}
function loadContent(param1, editor) {
	var tabp = Ext.getCmp('main-content');
	if(!tabp.items.get(param1.text + '-tabs')) {
		showLoadingWindow();
		Ext.Ajax.request({
			url: sd.baseUrl + '/dashboard/request/get-tree',
			params: {
				name: param1.text
			},
			success: function(data) {
				var json = Ext.decode(data.responseText);
				var treeStore = Ext.create('Ext.data.TreeStore', json.data.items);
				var _gilangId = param1.text + '-tabs';
				tabp.add({
					xtype: 'panel',
					layout: 'border',
					title: param1.text,
					id: _gilangId,
					closable: true,
					items: [{
						xtype: 'treepanel',
						title: param1.text + ' - Sub Menu',
						region: 'west',
						collapsible: true,
						store: treeStore,
						rootVisible: false,
						width: 200,
						padding: '1 1 1 1',
						listeners: {
							itemClick: function(view, records, item, index, eventObj) {
								if(records.isLeaf()) {
									var tp = Ext.getCmp(param1.text + '-tabpanel');
									var replacer = param1.text + '-' + records.data.text.replace(' ','-') + '-tabchild';
									
									if(!tp.items.get(replacer)) {
										
										defineModel(records.raw.models);
										
										var store = getStore(records.raw);
										
										// Bottom Bar Panel Init :
										var comboBbar = new Ext.form.ComboBox({
										  name : 'perpage',
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
											store: store,
											displayInfo: true,
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
											store.pageSize = parseInt(_records[0].get('id'), 10);
											store.loadPage(1);
										}, this);
										
										// Add tbar Listeners :
										Ext.each(records.raw.contents.tbars, function(d, i) {
											records.raw.contents.tbars[i].listeners = {
												click: function(a, b) {
													showLoadingWindow();
													Ext.Ajax.request({
														url: sd.baseUrl + '/dashboard/request/get-tbar-listeners',
														params: {
															id: a.id,
															container: replacer
														},
														success: function(data) {
															var json = Ext.decode(data.responseText);
															eval(Base64.decode(json.data.items));
															closeLoadingWindow();
														},
														failure: function(a,b,c) {
															Ext.Msg.alert('Message', 'Error ' + a.status + ' : The source that you are looking for are ' + a.statusText);
															closeLoadingWindow();
														}
													});
												}
											}
										});
										
										var tabcontent = {
											xtype: records.raw.contents.xtype,
											tbar: records.raw.contents.tbars,
											title: records.data.text,
											id: replacer,
											closable: true,
											store: store,
											autoScroll: true
										};
										
										var cellEditing = Ext.create('Ext.grid.plugin.RowEditing', {
											clicksToMoveEditor: 1,
									        autoCancel: false,
									    });
										
										Ext.each(records.raw.contents.columns, function(e, i) {
											if(e.dataType == 'combobox') {
												
												var temp = e.dataIndex.split('_');
												var st = '';
												for(var j=0;j<temp.length;j++) {
													st += temp[j].substring(0,1) + temp[j].substring(1,temp[j].length).toLowerCase();
												}
												st += 's';
												
												records.raw.contents.columns[i].editor = new Ext.form.field.ComboBox({
													displayField: e.dataIndex,
												    width: 500,
												    labelWidth: 130,
												    pageSize: 10,
												    store: Ext.data.StoreManager.lookup(st),
												    typeAhead: true,
												    editable: false
												});
											} else {
												if(param1.text == 'Shareprices' || param1.text == 'Share Price') {
													if(e.text == 'JKSE') {
														if(e.dataType == 'int') {
															records.raw.contents.columns[i].renderer = Ext.util.Format.numberRenderer('0.,/i');
														} else if(e.dataType == 'float'){
															records.raw.contents.columns[i].renderer = Ext.util.Format.numberRenderer('0.00,/i');
														}
													}
												} else {
													if(e.dataType == 'int') {
														records.raw.contents.columns[i].renderer = Ext.util.Format.numberRenderer('0.,/i');
													} else if(e.dataType == 'float'){
														records.raw.contents.columns[i].renderer = Ext.util.Format.numberRenderer('0.00,/i');
													}
												}
											}
										});
									
										if(records.raw.contents.xtype == 'gridpanel') {
											tabcontent.columns = records.raw.contents.columns;
											tabcontent.bbar = bbar;
											if(editor) {
												tabcontent.plugins = [cellEditing];
											}
										}
										
										store.loadPage(1);
										store.on('datachanged', function(d, i ,e) {
											var _tdata = d.proxy.reader.jsonData;
											if(!_tdata.success) {
												Ext.Msg.alert('Error !', _tdata.error_message);
											}
										});
										tp.add(tabcontent);
										
									}
									tp.setActiveTab(replacer);
								}
							}
						}
					},{
						xtype: 'tabpanel',
						id: param1.text + '-tabpanel',
						region: 'center',
						padding: '1 1 1 0'
					}]
				});
				
				closeLoadingWindow();
				
				tabp.setActiveTab(param1.text + '-tabs');
			}
		});
	}
	tabp.setActiveTab(param1.text + '-tabs');
}
function getStore(data) {
	var store = Ext.create('Ext.data.Store', {
		model: data.models.modelName,
		storeId: data.stores.storeName,
		proxy: data.stores.proxy,
		sorters: data.stores.sorters,
		autoSync: true,
		remoteSort: true
	});
	return store;
}
function defineModel(data) {

	Ext.define(data.modelName, {
		extend: 'Ext.data.Model',
		fields: data.fields
	});
	
}
function loadStore(name) {
	var store = Ext.data.StoreManager.lookup(name);
	return store;
}