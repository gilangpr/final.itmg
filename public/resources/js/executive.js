var investorStore = new Array();
var locationStore = new Array();
var investorTypeStore = new Array();
var contactStore = new Array();
var newsContent;
var tabRrContent;
var tabPeersContent;

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

function loadStore(name) {
	var store = Ext.data.StoreManager.lookup(name);
	return store;
}

function closeLoadingWindow() {
	var loading = Ext.getCmp('loading-window');
	loading.close();
}

function loadContent(content) {
	var id = content.text;
	var tabp = Ext.getCmp('main-content');
	
	if(id == 'Investors') {
		showInvestorSearch2();
	} else if(id == 'Shareholdings') {
		showShareholdingSearch();
	} else if(id == 'Peers') {
		showPeerSearch();
	}else if(id == 'Research Reports') {
		showRrSearch();
	} else if(id == 'News') {
		showNewsSearch();
	} else if(id == 'Shareprices') {
		showSharepricesSearch();
	}
}

function convert(obj) {
	console.log(obj);
	obj.bbar = new Ext.PagingToolbar({
		id: 'news-paging-toolbar-' + Math.random(232323),
		displayInfo: true,
		displayMsg: 'Displaying data {0} - {1} of {2}',
		emptyMsg: 'No data to display'
	});
	console.log(obj);
	return obj;
}