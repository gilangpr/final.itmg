var storeNews = loadStore('Newss');
storeNews.loadPage(1);

Ext.define('App.view.tabp.News', {
	extend: 'Ext.grid.Panel',
	title: 'News',
	closable: false,
	store: storeNews,
	bbar: new Ext.PagingToolbar({
		store: storeNews,
		id: 'news-paging-toolbar-' + Math.random(232323),
		displayInfo: true,
		displayMsg: 'Displaying data {0} - {1} of {2}',
		emptyMsg: 'No data to display'
	}),
	tbar: [{
		xtype: 'button',
		text: 'Search News',
		iconCls: 'icon-search',
		listeners: {
			click: function() {
				Ext.create('App.view.ResearchReport').show();
			}
		}
	}],
	id: 'news-grid',
	"columns": [{
        "text": "Title",
        "dataIndex": "TITLE",
        "align": "left",
        "width": 100,
        "flex": 1,
        "dataType": "string",
        "editor": {
            "allowBlank": false
        }
    }, {
        "text": "Category",
        "dataIndex": "NEWS_CATEGORY",
        "align": "center",
        "width": 150,
        "flex": 0,
        "dataType": "combobox"
    }, {
        "text": "File Size ( Byte )",
        "dataIndex": "FILE_SIZE",
        "align": "center",
        "width": 150,
        "flex": 0,
        "dataType": "int"
    }, {
        "text": "File Type",
        "dataIndex": "FILE_TYPE",
        "align": "center",
        "width": 130,
        "flex": 0,
        "dataType": "string"
    }, {
        "text": "Downloaded",
        "dataIndex": "TOTAL_HIT",
        "align": "center",
        "width": 100,
        "flex": 0,
        "dataType": "int"
    }, {
        "text": "Created Date",
        "dataIndex": "CREATED_DATE",
        "align": "center",
        "width": 150,
        "flex": 0,
        "dataType": "string"
    }, {
        "text": "Last Modified",
        "dataIndex": "MODIFIED_DATE",
        "align": "center",
        "width": 150,
        "flex": 0,
        "dataType": "string"
    }]
});