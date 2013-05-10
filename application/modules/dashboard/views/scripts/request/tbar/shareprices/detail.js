
var c = Ext.getCmp('<?php echo $this->container ?>');
var storeSR = Ext.create('Ext.data.Store',{
    storeId: 'SharepricesNames',
    model: 'SharepricesName',
    proxy: {
        type: 'ajax',
        api: {
            read: '/sharepricesname/request/readauto'
        },
        actionMethods: {
            create: 'POST'
        },
        reader: {
            idProperty: 'SHAREPRICES_NAME',
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
        property: 'SHAREPRICES_NAME_ID',
        direction: 'ASC'
    },
    autoSync: true
});
Ext.require('Ext.chart.*');
Ext.require(['Ext.Window', 'Ext.fx.target.Sprite', 'Ext.layout.container.Fit', 'Ext.window.MessageBox']);
Ext.onReady(function() {
	
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
		},
		daterangeText: 'Start date must be less than end date',
	});
	
	Ext.create('Ext.Window', {
		title: 'Detail Shareprices',
		xtype: 'panel',
		layout: 'border',
		id: 'detail-shareprices-main',
		width: 345,
		height: 152,
		modal: true,
		closable: true,
		resizable: false,
		draggable: false,
		items: [{
			xtype: 'form',
			layout: 'anchor',
			//renderTo: 'dr',
			border: false,
			id: 'detail-shareprices-form',
			bodyPadding: '5 5 5 5',
			defaultType: 'textfield',
			width: 350,
			items: [{
				fieldLabel:'Start Date',
				xtype: 'datefield',
				id: 'start-date',
				format: 'Y-m-d',
				name: 'startdt',
		        itemId: 'startdt',
		        vtype: 'daterange',
		        endDateField: 'enddt',
		        emptyText: 'End Date',
				labelWidth: 120,
				width: 300,
				allowBlank: false
			},{
				fieldLabel:'End Date',
				xtype: 'datefield',
				id: 'end-date',
				format: 'Y-m-d',
				name: 'enddt',
	            itemId: 'enddt',
	            vtype: 'daterange',
	            startDateField: 'startdt',
	            emptyText: 'Start Date',
				labelWidth: 120,
				width: 300,
				allowBlank: false
			},{
				xtype: 'combobox',
				fieldLabel: 'Shareprices Name',
				id: 'shareprices-name',
				name: 'SHAREPRICES_NAME',
				displayField: 'SHAREPRICES_NAME',
				labelWidth: 120,
				width: 300,
				store: storeSR,
				minChars: 3,
				emptyText: 'Select shareprices name',
				typeAhead: true,
				allowBlank: false
			}]
		}],
		buttons: [{
			text: 'Search',
			listeners: {
				click: function() {
					var form = Ext.getCmp('detail-shareprices-form');
					var _id = 'shareprices-detail-result-' + Math.random();
					if(form.getForm().isValid()) {
						Ext.define('Shareprice__', {
	                        extend: 'Ext.data.Model',
	                        fields: [{
	                            name: 'SHAREPRICES_NAME',
	                            type: 'string'
	                        },{
	                            name: 'DATE',
	                            type: 'datefield'
	                        },{
	                            name: 'VALUE',
	                            type: 'float'
	                        }]
	                    });
						var _xxstore = Ext.create("Ext.data.Store", {
							model: "Shareprice__",
	                        storeId: "Shareprices__",
	                        proxy: {
	                            "type": "ajax",
	                            "api": {
	                                "read": sd.baseUrl + '/shareprices/request/detail'
	                            },
	                            "actionMethods": {
	                                "read": "POST"
	                            },
	                            "reader": {
	                                "idProperty": "SHAREPRICES_ID",
	                                "type": "json",
	                                "root": "data.items",
	                                "totalProperty": "data.totalCount"
	                            }
	                        },
	                        sorter: {
	                            "property": "SHAREPRICES_ID",
	                            "direction": "ASC"
	                        }
						});
						_xxstore.load({
							 params: {
		                            'SHAREPRICES_NAME':  (typeof(form.getForm()._fields.items[2].value) == 'undefined') ? '' : form.getForm()._fields.items[2].value,
		                            'START_DATE': form.getForm()._fields.items[0].value,
		                            'END_DATE': form.getForm()._fields.items[1].value
		                     }
	                   
	                    });
						c.up().add({
							title: 'Details Shareprices : ' + form.getForm()._fields.items[2].value,
							closable: true,
							id: _id,
							store: _xxstore,
							xtype: 'chart',
							animate: {
								easing: 'bounceOut',
								duration: 400
							},
							shadow: true,
							style: 'background: #FFF',
							theme: 'Base:gradients',
							axes: [{
				                type: 'Numeric',
				                minimum: 0,
				                position: 'left',
				                fields: ['VALUE'],
				                title: false,
				                grid: true,
				                label: {
				                    renderer: Ext.util.Format.numberRenderer('0,0'),
				                    font: '10px Arial'
				                }
				            }, {
				                type: 'Category',
				                position: 'bottom',
				                fields: ['DATE'],
				                title: false,
				                label: {
				                    font: '11px Arial',
//				                    renderer: function(name) {
//				                        return name.substr(0, 3) + ' 07';
//				                    }
				                }
				            }],
				            series: [{
				                type: 'line',
				                axis: 'left',
				                xField: 'DATE',
				                yField: 'VALUE',
				                listeners: {
				                  itemmouseup: function(item) {
				                      Ext.example.msg('Item Selected', item.value[1] + ' visits on ' + Ext.Date.monthNames[item.value[0]]);
				                  }  
				                },
				                tips: {
				                    trackMouse: true,
				                    width: 80,
				                    height: 40,
				                    renderer: function(storeItem, item) {
				                        this.setTitle(storeItem.get('SHAREPRICES_NAME'));
				                        this.update(storeItem.get('VALUE'));
				                    }
				                },
				                style: {
				                    fill: '#000',
				                    stroke: '#DDD',
				                    'stroke-width': 3
				                },
				                markerConfig: {
				                    type: 'circle',
				                    size: 4,
				                    radius: 4,
				                    'stroke-width': 0,
				                    fill: '#000',
				                    stroke: '#000'
				                }
				            }]	
						});
						c.up().setActiveTab(_id);
						form.up().close();
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
	
});