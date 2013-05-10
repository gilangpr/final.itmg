Date.prototype.customFormat = function(formatString){
    var YYYY,YY,MMMM,MMM,MM,M,DDDD,DDD,DD,D,hhh,hh,h,mm,m,ss,s,ampm,AMPM,dMod,th;
    var dateObject = this;
    YY = ((YYYY=dateObject.getFullYear())+"").slice(-2);
    MM = (M=dateObject.getMonth()+1)<10?('0'+M):M;
    MMM = (MMMM=["January","February","March","April","May","June","July","August","September","October","November","December"][M-1]).substring(0,3);
    DD = (D=dateObject.getDate())<10?('0'+D):D;
    DDD = (DDDD=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][dateObject.getDay()]).substring(0,3);
    th=(D>=10&&D<=20)?'th':((dMod=D%10)==1)?'st':(dMod==2)?'nd':(dMod==3)?'rd':'th';
    formatString = formatString.replace("#YYYY#",YYYY).replace("#YY#",YY).replace("#MMMM#",MMMM).replace("#MMM#",MMM).replace("#MM#",MM).replace("#M#",M).replace("#DDDD#",DDDD).replace("#DDD#",DDD).replace("#DD#",DD).replace("#D#",D).replace("#th#",th);

    h=(hhh=dateObject.getHours());
    if (h==0) h=24;
    if (h>12) h-=12;
    hh = h<10?('0'+h):h;
    AMPM=(ampm=hhh<12?'am':'pm').toUpperCase();
    mm=(m=dateObject.getMinutes())<10?('0'+m):m;
    ss=(s=dateObject.getSeconds())<10?('0'+s):s;
    return formatString.replace("#hhh#",hhh).replace("#hh#",hh).replace("#h#",h).replace("#mm#",mm).replace("#m#",m).replace("#ss#",ss).replace("#s#",s).replace("#ampm#",ampm).replace("#AMPM#",AMPM);
}

var SP_START_DATE = '1900-01-01';
var SP_END_DATE = '2013-12-12';
var SP_NAMES = new Array();

var c = Ext.getCmp('<?php echo $this->container ?>');
var storeSP = loadStore('SharepricesNames');
Ext.require('Ext.chart.*');
Ext.require(['Ext.Window', 'Ext.fx.target.Sprite', 'Ext.layout.container.Fit', 'Ext.window.MessageBox',  'Ext.form.field.Number']);
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
		title: 'Search Shareprices',
		xtype: 'panel',
		layout: 'border',
		id: 'search-shareprices-main',
		width: 395,
		height: 150,
		modal: true,
		closable: true,
		resizable: false,
		draggable: false,
		items: [{
			xtype: 'form',
			layout: 'anchor',
			border: false,
			id: 'search-shareprices-form',
			bodyPadding: '5 5 5 5',
			defaultType: 'textfield',
			width: 400,
			items: [{
				fieldLabel:'Start Date',
				xtype: 'datefield',
				id: 'start-date',
				format: 'Y-m-d',
				name: 'startdt',
		        itemId: 'startdt',
		        vtype: 'daterange',
		        endDateField: 'enddt',
		        emptyText: 'Start Date',
				labelWidth: 140,
				width: 320,
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
	            emptyText: 'End Date',
				labelWidth: 140,
				width: 320,
				allowBlank: false
			},{
				xtype: 'combobox',
				fieldLabel: 'Company Name',
				id: 'shareprices-name',
				name: 'SHAREPRICES_NAME',
				displayField: 'SHAREPRICES_NAME',
				labelWidth: 140,
				width: 320,
				store: storeSP,
				multiSelect: true,
				minChars: 3,
				emptyText: 'Select company name',
				multiSelect: true,
				typeAhead: false,
				editable: false,
				allowBlank: false
			}]
		}],
		buttons: [{
			text: 'Search',
			listeners: {
				click: function() {
					var f = Ext.getCmp('search-shareprices-form');
					var _id = 'shareprices-search-result-' + Math.random();
					if(f.getForm().isValid()) {
						Ext.each(f.getForm()._fields.items, function(d, i) {
							if(i == 0) {
								var l = new Date(Date.parse(d.getValue()));
								SP_START_DATE = l.customFormat('#YYYY#-#MM#-#DD#');
							} else if(i == 1) {
								var l = new Date(Date.parse(d.getValue()));
								SP_END_DATE = l.customFormat('#YYYY#-#MM#-#DD#');
							} else {
								SP_NAMES = d.getValue();
							}
						});
						var _storeShareprices = Ext.create("Ext.data.Store", {
							model: "Shareprice",
							storeId: "Shareprices",
							proxy:{"type":"ajax","api":{"read":"\/shareprices\/request\/search","create":"\/shareprices\/request\/create","update":"\/shareprices\/request\/update","destroy":"\/shareprices\/request\/destroy"},"actionMethods":{"create":"POST","destroy":"POST","read":"POST","update":"POST"},"reader":{"idProperty":"DATE","type":"json","root":"data.items","totalProperty":"data.totalCount"},"writer":{"type":"json","root":"data","writeAllFields":true},
								extraParams: {
									SP_START_DATE: SP_START_DATE,
									SP_END_DATE: SP_END_DATE,
									SP_NAMES: Ext.encode(SP_NAMES)
								}},
							sorter: {"property":"SHAREPRICES_ID","direction":"ASC"}});
						showLoadingWindow();
						_storeShareprices.load({
							callback: function(d,i,e,f) {
								if(d.length == 0) {
									Ext.Msg.alert('Message', 'No data found.');
									closeLoadingWindow();
								} else {
									Ext.Msg.alert('Message', 'Result: ' + d.length + ' data(s) found.');
									var json = Ext.decode(i.response.responseText);
									var cols = [{
										text: 'DATE',
										dataIndex: 'DATE',
										flex: 1
									}];
									var series = new Array();
									for(var i=0;i<json.data.names.length;i++) {
										cols[i+1] = {
												flex: 1,
												dataIndex: json.data.names[i],
												text: json.data.names[i],
												renderer: Ext.util.Format.numberRenderer('0.,/i')
										};
										series[i] = {
											type: 'line',
											highlight: {
												size: 2,
												radius: 2
											},
											axis: 'left',
											xField: 'DATE',
											yField: json.data.names[i],
							                markerConfig: {
							                    type: 'circle',
							                    size: 2,
							                    radius: 2,
							                    'stroke-width': 1
							                }
										};
									}
									c.up().add({
										title: 'Shareprices Search Result',
										closable: true,
										id: _id,
										autoScroll: true,
										xtype: 'panel',
										layout: 'border',
										items: [{
											region: 'north',
											minHeight: 154,
											maxHeight: 154,
											autoScroll: true,
											xtype: 'gridpanel',
											border: false,
											store: _storeShareprices,
											columns: cols
										},{
											region: 'north',
											title: 'Chart',
											minHeight: 260,
											maxHeight: 260,
											width: 500,
											border: false,
											xtype: 'chart',
											style: 'background: #fff',
											animate: true,
											store: _storeShareprices,
											shadow: true,
											theme: 'Category1',
											legend: {
												position: 'right'
											},
											axes: [{
												type: 'Numeric',
												minimum: 0,
												position: 'left',
												fields: json.data.names,
												title: 'Shareprices',
												minorTickSteps: 1,
												grid: {
													odd: {
														opacity: 1,
														fill: '#ddd',
														stroke: '#bbb',
														'stroke-width': 0.5
													}
												}
											},{
												type: 'Category',
												position: 'bottom',
												fields: ['DATE'],
												title: 'Date'
											}],
											series: series
										}]
									});
									// c.up().add({
									// 	title: 'Shareprices Search Result',
									// 	closable: true,
				     //                    id: _id,
				     //                    autoScroll: true,
									// 	xtype: 'gridpanel',
									// 	border: false,
									// 	store: _storeShareprices,
									// 	columns: cols
									// });
									c.up().setActiveTab(_id);
									closeLoadingWindow();
								}								
							}
						});						
						f.up().close();
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
