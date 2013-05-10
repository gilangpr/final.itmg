var storeRR = loadStore('ResearchReports');
var storeRRC = loadStore('ResearchReportCategorys');
var storeRR_curpage = storeRR.currentPage;
storeRR.load({
	params: {
		all: 1
	}
});
storeRRC.load({
	params: {
		all: 1
	}
});

Ext.define('App.view.ResearchReport',{
	extend: 'Ext.Window',
	title: 'Search Research Report',
	width: 500,
	id: 'research-report-search-window',
	modal: true,
	draggable: false,
	resizable: false,
	items: [{
		xtype: 'form',
		layout: 'form',
		id: 'researchreports-search-form',
		bodyPadding: '5 5 5 5',
		waitMsgTarget: true,
		border: false,
		items: [{
			xtype: 'combobox',
			fieldLabel: 'Title',
			name: 'TITLE',
			id: 'research-report-title',
			store: storeRR,
			displayField: 'TITLE',
			typeAhead: true,
			allowBlank: true,
			minChars: 2,
			emptyText: 'All Research Report'
		},{
			xtype: 'combobox',
			fieldLabel: 'Category',
			name: 'RESEARCH_REPORT_CATEGORY',
			id: 'research-report-category',
			store: storeRRC,
			displayField: 'RESEARCH_REPORT_CATEGORY',
			typeAhead: true,
			allowBlank: true,
			minChars: 2,
			emptyText: 'All Category'
		}]
	}],
	buttons: [{
		text: 'Search',
		listeners: {
			click: function() {
				var rTitle = Ext.getCmp('research-report-title').getValue();
				var rCategory = Ext.getCmp('research-report-category').getValue();
				if(typeof(rTitle) === 'undefined') {
					rTitle = '';
				}
				if(typeof(rCategory) === 'undefined') {
					rCategory = '';
				}
				storeRR.load({
					params: {
						search: 1,
						title: rTitle,
						category: rCategory
					},
					callback: function(d, i, e) {
						Ext.getCmp('research-report-search-window').close();
						if(d.length == 0) {
							Ext.Msg.alert('Message', 'No data found.');
						} else {
							Ext.Msg.alert('Message', 'Result: ' + d.length + ' data(s) found.');
						}
					}
				});
			}
		}
	},{
		text: 'Cancel',
		listeners: {
			click: function() {
				this.up().up().close();
				storeRR.loadPage(storeRR_curpage);
			}
		}
	}]
});