var storeRR = loadStore('ResearchReports');
storeRR.loadPage(1);

Ext.define('App.view.tabp.ResearchReport', {
	extend: 'Ext.grid.Panel',
	id: 'research-report-grid',
	title: 'Research Report',
	closable: false,
	bbar: new Ext.PagingToolbar({
		store: storeRR,
		displayInfo: true,
		displayMsg: 'Displaying data {0} - {1} of {2}',
		emptyMsg: 'No data to display',
		items: [
		    '-',
		    'Records per page',
		    '-',
		    new Ext.form.ComboBox({
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
		    	  forceSelection: true,
		    	  listeners: {
		    		  select: function(combo, _records) {
		    			  storeRR.pageSize = parseInt(_records[0].get('id'), 10);
		    			  storeRR.loadPage(1);
		    		  }
		    	  }
		    	})
		]
	}),
	store: storeRR,
	"columns": [{
        "text": "Title",
        "dataIndex": "TITLE",
        "align": "left",
        "width": 190,
        "flex": 1,
        "dataType": "string",
        "editor": {
            "allowBlank": false
        }
    }, {
        "text": "Category",
        "dataIndex": "RESEARCH_REPORT_CATEGORY",
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
    },{
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
    }],
	tbar: [{
		xtype: 'button',
		text: 'Search Research Report',
		iconCls: 'icon-search',
		listeners: {
			click: function() {
				Ext.create('App.view.ResearchReport').show();
			}
		}
	}]
});