var c = Ext.getCmp('<?php echo $this->container ?>');
var storeSR = Ext.create('Ext.data.Store',{
    storeId: 'Shareholdings__x',
    model: 'Shareholding',
    proxy: {
        type: 'ajax',
        api: {
            read: '/shareholdings/request/autocom'
        },
        actionMethods: {
            create: 'POST'
        },
        reader: {
            idProperty: 'INVESTOR_NAME',
            type: 'json',
            root: 'data.items',
            totalProperty: 'data.totalCount'
        },
        writer: {
            type: 'json',
            root: 'data',
            writeAllFields: true
        }
    },
    sorter: {
        property: 'SHAREHOLDING_ID',
        direction: 'ASC'
    },
    autoSync: true
});

    // Add the additional 'advanced' VTypes
    Ext.apply(Ext.form.field.VTypes, {
        daterange: function(val, field) {
            var date = field.parseDate(val);

            if (!date) {
                return false;
            }
            if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
                var start = field.up('form').down('#' + field.startDateField);
                start.setMaxValue(date);
                start.validate();
                this.dateRangeMax = date;
            }
            else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
                var end = field.up('form').down('#' + field.endDateField);
                end.setMinValue(date);
                end.validate();
                this.dateRangeMin = date;
            }
            /*
             * Always return true since we're only using this vtype to set the
             * min/max allowed values (these are tested for after the vtype test)
             */
            return true;
        }
    });
Ext.create('Ext.Window', {
	title: 'Search Investor',
	xtype: 'panel',
	layout: 'anchor',
	id: 'search-investor-main',
	modal: true,
	closable: true,
	width: 400,
	height: 153,
	resizable: false,
	draggable: false,
	items: [{
		xtype: 'form',
		layout: 'form',
		border: false,
		id: 'search-shareholdings-form',
		bodyPadding: '5 5 5 5',
		defaultType: 'textfield',
		items: [{
			fieldLabel: 'Investor Name',
			xtype: 'combobox',
			pageSize: 10,
			anchor: '100%',
			width: 300,
			flex: 1,
			emptyText: 'All',
			id: 'investor-name',
			name: 'INVESTOR_NAME',
			store: storeSR,
			minChars: 3,
			displayField: 'INVESTOR_NAME',
			allowBlank: true
		},{
			fieldLabel:'Start Date',
			xtype: 'datefield',
			anchor: '100%',
			width: 300,
			name: 'START_DATE',
			id: 'start-date',
			vtype: 'daterange',
            endDateField: 'end-date', // id of the end date field
			format: 'Y-m-d',
			allowBlank: false
		},{
			fieldLabel:'End Date',
			xtype: 'datefield',
			anchor: '100%',
			width: 300,
			name: 'END_DATE',
			id: 'end-date',
			vtype: 'daterange',
	        startDateField: 'start-date', // id of the start date field
			format: 'Y-m-d',
			allowBlank: false
		}]
	}],
	buttons: [{
		text: 'Search',
		listeners: {
			click: function() {
				var form = Ext.getCmp('search-shareholdings-form');
				var _id = 'shareholdings-search-result-' + Math.random();
				if(form.getForm().isValid()) {
					Ext.define('Shareholding__', {
						extend: 'Ext.data.Model',
						fields: [{
							name: 'INVESTOR_NAME',
							type: 'string'
						},{
							name: 'AMOUNT',
							type: 'string'
						},{
							name: 'DATE',
							type: 'string'
						}]
					});
					var _xxstore = Ext.create("Ext.data.Store", {
					    model: "Shareholding__",
					    storeId: "Shareholdings__",
					    proxy: {
					        "type": "ajax",
					        "api": {
					            "read": sd.baseUrl + '/shareholdings/request/search'
					        },
					        "actionMethods": {
					            "read": "POST"
					        },
					        "reader": {
					            "idProperty": "SHAREHOLDING_AMOUNT_ID",
					            "type": "json",
					            "root": "data.items",
					            "totalProperty": "data.totalCount"
					        }
					    },
					    sorter: {
					        "property": "SHAREHOLDING_AMOUNT_ID",
					        "direction": "ASC"
					    }
					});
					//console.log(form.getForm()._fields.items);
					_xxstore.load({
						params: {
							'INVESTOR_NAME': (typeof(form.getForm()._fields.items[0].value) == 'all') ? '' : form.getForm()._fields.items[0].value,
							'START_DATE': form.getForm()._fields.items[1].value,
							'END_DATE': form.getForm()._fields.items[2].value
						}
					
					});
					c.up().add({
						title: 'Search Result',
						closable: true,
						id: _id,
						store: _xxstore,
						xtype: 'gridpanel',
						height: c.up().getHeight() - 56,
						columns: [{
							text: 'Date',
							dataIndex: 'DATE',
							align: 'center'
						},{
							text: 'Investor Name',
							dataIndex: 'INVESTOR_NAME',
							width: 200,
							flex: 1
						},{
							text: 'Amount',
							dataIndex: 'AMOUNT',
							renderer: Ext.util.Format.numberRenderer('0.,/i'),
							align: 'right'
						}
					],
					bbar: new Ext.PagingToolbar({
				        store: _xxstore,
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
							  		store.pageSize = parseInt(_records[0].get('id'), 10);
							  		store.loadPage(1);
							  	}
							  }
							})
				        ]
				    })
					});
					c.up().setActiveTab(_id);
					form.up().close();
				}
			}
		}
	}]
}).show();