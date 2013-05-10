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

var startdate = '1900-01-01';
var enddate = '2013-12-12';
var SP_NAMES = new Array();

var storeRR = loadStore('Newss');
var storeRRC = loadStore('NewsCategorys');
var storeNC = loadStore('Companys');
var c = Ext.getCmp('<?php echo $this->container ?>');
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
	daterangeText: 'Start Date must be less than End Date',
});

Ext.create('Ext.Window', {
	title: 'Search News',
	width: 500,
	id: 'news-search-window',
	modal: true,
	draggable: false,
	resizable: false,
	items: [{
		xtype: 'form',
		layout: 'form',
		id: 'news-search-form',
		bodyPadding: '5 5 5 5',
		waitMsgTarget: true,
		border: false,
		items: [{
			xtype: 'combobox',
			fieldLabel: 'Title',
			name: 'TITLE',
			id: 'news-title',
			store: storeRR,
			displayField: 'TITLE',
			typeAhead: true,
			allowBlank: true,
			minChars: 3,
			emptyText: 'Select News'
		},{
			xtype: 'combobox',
			fieldLabel: 'Category',
			name: 'NEWS_CATEGORY',
			id: 'news-category',
			store: storeRRC,
			displayField: 'NEWS_CATEGORY',
			typeAhead: true,
			allowBlank: true,
			minChars: 3,
			emptyText: 'Select Category'
		},{
			xtype: 'combobox',
			fieldLabel: 'Company',
			name: 'COMPANY_NAME',
			id: 'news-company',
			store: storeNC,
			displayField: 'COMPANY_NAME',
			typeAhead: true,
			editable: true,
			emptyText: 'Select Company',
			minChars: 3,
			allowBlank: true
		},{
			xtype: 'combobox',
			name: 'SOURCE',
			id: 'news-source',
			store: storeRR,
			displayField: 'SOURCE',
			typeAhead: true,
			editable: true,
			emptyText: 'Select Source',
			fieldLabel: 'Source',
			minChars: 3,
			allowBlank: true
		},{
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
		}]
	}],
	buttons: [{
		text: 'Search',
		listeners: {
			click: function() {
				var form = Ext.getCmp('news-search-form').getForm();
				var _id = 'news-search-result-' + Math.random();
				
				if(form.isValid()) {

					var rTitle = Ext.getCmp('news-title').getValue();
					var rCategory = Ext.getCmp('news-category').getValue();
					var rCompany = Ext.getCmp('news-company').getValue();
					var rSource = Ext.getCmp('news-source').getValue();
					var stDate = new Date(Date.parse(Ext.getCmp('start-date').getValue()));
					startdate = stDate.customFormat('#YYYY#-#MM#-#DD#');
					var endDate = new Date(Date.parse(Ext.getCmp('end-date').getValue()));
					enddate = endDate.customFormat('#YYYY#-#MM#-#DD#');
					
					var _storeNews = Ext.create("Ext.data.Store", {
						model: "News",
						storeId: "Newss__",
						proxy:{"type":"ajax","api":{"read":"\/news\/request\/read","create":"\/news\/request\/create","update":"\/news\/request\/update","destroy":"\/news\/request\/destroy"},"actionMethods":{"create":"POST","destroy":"POST","read":"POST","update":"POST"},"reader":{"idProperty":"DATE","type":"json","root":"data.items","totalProperty":"data.totalCount"},"writer":{"type":"json","root":"data","writeAllFields":true},
							extraParams: {
								search: 1,
								title: rTitle,
								category: rCategory,
								company: rCompany,
								source: rSource,
								startdate: startdate,
								enddate: enddate
							}}});
					//showLoadingWindow();					
					_storeNews.load({
						callback: function(d,i,e,f) {
							if(d.length == 0) {
								Ext.Msg.alert('Message', 'No data found.');
							} else {
								Ext.Msg.alert('Message', 'Result: ' + d.length + ' data(s) found.');
								c.up().add({
									title: 'Search Result',
									closable: true,
									id: _id,
									autoScroll: true,
									xtype: 'gridpanel',
									layout: 'border',
									store: _storeNews,
									tbar: [{
										xtype: 'button',
										text: 'Download',
										iconCls: 'icon-download',
										listeners: {
											click: function() {
												var c = Ext.getCmp(_id);
												var selected = c.getSelectionModel().getSelection();
												if(selected.length > 0) {
													document.location = sd.baseUrl + '/news/request/download/id/' + selected[0].data.NEWS_ID;
													var store = loadStore('Newss');
													setTimeout(function(){
														_storeNews.loadPage(_storeNews.currentPage);
													},800);
												} else {
													Ext.Msg.alert('Message', 'You did not select any News');
												}
											}
										}
									},{
										xtype: 'button',
										text: 'Delete',
										iconCls: 'icon-stop',
										listeners: {
											click: function() {
												var c = Ext.getCmp(_id);
												var selected = c.getSelectionModel().getSelection();
												if(selected.length > 0) {
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
																		url: sd.baseUrl + '/news/request/destroy',
																		params: selected[0].data,
																		success: function(data) {
																			var json = Ext.decode(data.responseText);
																			closeLoadingWindow();
																			var store = loadStore('Newss');
																			store.loadPage(store.currentPage);
																		},
																		failure: function() {
																			var json = Ext.decode(data.responseText);
																			closeLoadingWindow();
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
													Ext.Msg.alert('Message', 'You did not select any News');
												}
							        		}
							        	}
									}],
									"columns": [{
	                                    "text": "Title",
	                                    "dataIndex": "TITLE",
	                                    "align": "left",
	                                    "width": 100,
	                                    "flex": 1,
	                                    "dataType": "string",
	                                    "visible": false,
	                                    "editor": {
	                                    "allowBlank": false
	                                    }
	                                }, {
	                                    "text": "Category",
	                                    "dataIndex": "NEWS_CATEGORY",
	                                    "align": "center",
	                                    "width": 130,
	                                    "flex": 0,
	                                    "dataType": "combobox",
	                                    "visible": false
	                                }, {
	                                    "text": "Company",
	                                    "dataIndex": "COMPANY_NAME",
	                                    "align": "center",
	                                    "width": 130,
	                                    "flex": 0,
	                                    "dataType": "combobox",
	                                    "visible": false
	                                }, {
	                                    "text": "Source",
	                                    "dataIndex": "SOURCE",
	                                    "align": "center",
	                                    "width": 130,
	                                    "flex": 0,
	                                    "dataType": "string",
	                                    "visible": false,
	                                    "editor": {
	                                        "allowBlank": false
	                                    }
	                                }, {
	                                    "text": "File Size ( Byte )",
	                                    "dataIndex": "FILE_SIZE",
	                                    "align": "center",
	                                    "width": 130,
	                                    "flex": 0,
	                                    "dataType": "int",
	                                    "visible": false
	                                }, {
	                                    "text": "Downloaded",
	                                    "dataIndex": "TOTAL_HIT",
	                                    "align": "center",
	                                    "width": 100,
	                                    "flex": 0,
	                                    "dataType": "int",
	                                    "visible": false
	                                }, {
	                                    "text": "File Type",
	                                    "dataIndex": "FILE_TYPE",
	                                    "align": "center",
	                                    "width": 130,
	                                    "flex": 0,
	                                    "dataType": "string",
	                                    "visible": false
	                                }, {
	                                    "text": "Created Date",
	                                    "dataIndex": "CREATED_DATE",
	                                    "align": "center",
	                                    "width": 150,
	                                    "flex": 0,
	                                    "dataType": "string",
	                                    "visible": false
	                                }, {
	                                    "text": "Last Modified",
	                                    "dataIndex": "MODIFIED_DATE",
	                                    "align": "center",
	                                    "width": 130,
	                                    "flex": 0,
	                                    "dataType": "string",
	                                    "visible": false
	                                }],
	                                bbar: new Ext.PagingToolbar({
	                                	store: _storeNews,
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
											  		_storeNews.pageSize = parseInt(_records[0].get('id'), 10);
											  		_storeNews.loadPage(1);
											  	}
											  }
											})
								        ],
								        tbar: [{
								        	
								        }]
	                                })
								});
								c.up().setActiveTab(_id);
								//closeLoadingWindow();
							}
						}
					});
					this.up().up().close();
				}
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
}).show();