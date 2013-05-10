var COMPANY_NAME = '';
var CONTACT_PERSON = '';
var EQUITY_ASSETS = '';
var INVESTOR_TYPE = '';
var LOCATION = '';
var FORMAT = '';

function showInvestorSearch2() {
	var _storeInvestors = Ext.create("Ext.data.Store", {
		model: "Investor",
		storeId: "Investors_combobox",
		proxy:{"type":"ajax","api":{"read":"\/investors\/request\/read","create":"\/investors\/request\/create","update":"\/investors\/request\/update","destroy":"\/investors\/request\/destroy"},"actionMethods":{"create":"POST","destroy":"POST","read":"POST","update":"POST"},"reader":{"idProperty":"INVESTOR_ID","type":"json","root":"data.items","totalProperty":"data.totalCount"},"writer":{"type":"json","root":"data","writeAllFields":true}},
		sorter: {"property":"INVESTOR_ID","direction":"ASC"}});
	
	Ext.create('Ext.Window', {
		title: 'Search Investor',
		xtype: 'panel',
		layout: 'border',
		id: 'search-investor-main',
		modal: true,
		closable: true,
		width: 800,
		height: 154,
		resizable: false,
		draggable: false,
		buttons: [{
			text: 'Search',
			listeners: {
				click: function() {
					showLoadingWindow();
					var form1 = Ext.getCmp('search-investor-form-left').getForm();
					var form2 = Ext.getCmp('search-investor-form-right').getForm();
					
					if(form1.isValid() && form2.isValid()) {
						var obj3 = {};
						var val1 = form1.getValues();
						var val2 = form2.getValues();
						/* Form 1 */
						
						if(typeof(val1.COMPANY_NAME) !== 'undefined') {
							COMPANY_NAME = val1.COMPANY_NAME;
						} else {
							COMPANY_NAME = '';
						}
						
						if(typeof(val1.CONTACT_PERSON) !== 'undefined') {
							CONTACT_PERSON = val1.CONTACT_PERSON;
						} else {
							CONTACT_PERSON = '';
						}
						
						EQUITY_ASSETS = val1.EQUITY_ASSETS;
						
						/* End of : Form 1*/
						
						/* Form 2 */
						
						if(typeof(val2.INVESTOR_TYPE) !== 'undefined') {
							INVESTOR_TYPE = val2.INVESTOR_TYPE;
						} else {
							INVESTOR_TYPE = '';
						}
						
						if(typeof(val2.LOCATION) !== 'undefined') {
							LOCATION = val2.LOCATION;
						}
						
						FORMAT = val2.FORMAT;

						/* End of : Form 2 */
						var _storeSearchInvestors = Ext.create("Ext.data.Store", {
							model: "Investor",
							storeId: "InvestorsSearch",
							proxy:{"type":"ajax","api":{"read":"\/investors\/request\/read","create":"\/investors\/request\/create","update":"\/investors\/request\/update","destroy":"\/investors\/request\/destroy"},"actionMethods":{"create":"POST","destroy":"POST","read":"POST","update":"POST"},"reader":{"idProperty":"INVESTOR_ID","type":"json","root":"data.items","totalProperty":"data.totalCount"},"writer":{"type":"json","root":"data","writeAllFields":true},
								extraParams: {
									TYPE: 'SEARCH',
									COMPANY_NAME: COMPANY_NAME,
									EQUITY_ASSETS: EQUITY_ASSETS,
									INVESTOR_TYPE: INVESTOR_TYPE,
									LOCATION: LOCATION,
									CONTACT_PERSON: CONTACT_PERSON
								}},
							sorter: {"property":"INVESTOR_ID","direction":"ASC"}});
						this.up().up().close();
						_storeSearchInvestors.load({
							params: {
								TYPE: 'SEARCH',
								COMPANY_NAME: COMPANY_NAME,
								EQUITY_ASSETS: EQUITY_ASSETS,
								INVESTOR_TYPE: INVESTOR_TYPE,
								LOCATION: LOCATION,
								CONTACT_PERSON: CONTACT_PERSON
							},
							callback: function() {
								if(FORMAT == 'Detail') {
									var _idx = 0;
									var c = Ext.getCmp('main-content');
									var _id = 'investors-detailed-search-results-' + Math.random();
									var _data = _storeSearchInvestors.data.items;
									var maxWidth = 221;
									var data = _data[_idx].data;
									var id = _id;
									var selected = _data;
									storeIT = loadStore('InvestorTypes');
									storeLOCATIONS = loadStore('Locations');

									/*
									 * Contacts
									 */

									var storeCO = Ext.create("Ext.data.Store", {
										model: "Contact",
										storeId: "Contacts",
										proxy:{extraParams:{id:_data[_idx].data.INVESTOR_ID},"type":"ajax","api":{"read":"\/contacts\/request\/read","create":"\/contacts\/request\/create","update":"\/contacts\/request\/update","destroy":"\/contacts\/request\/destroy"},"actionMethods":{"create":"POST","destroy":"POST","read":"POST","update":"POST"},"reader":{"idProperty":"CONTACT_ID","type":"json","root":"data.items","totalProperty":"data.totalCount"},"writer":{"type":"json","root":"data","writeAllFields":true}},
										sorter: {"property":"CONTACT_ID","direction":"ASC"}});

									storeCO.load();

									/*
									 * End of : Contacts

									/*
									 * Meeting Investors
									 */

									var storeMI = Ext.create("Ext.data.Store", {
										model: "Meetinginvestor",
										storeId: "Meetinginvestors",
										proxy:{extraParams:{id:_data[_idx].data.INVESTOR_ID},"type":"ajax","api":{"read":"\/meetinginvestor\/request\/read","create":"\/meetinginvestor\/request\/create","update":"\/meetinginvestor\/request\/update","destroy":"\/meetinginvestor\/request\/destroy"},"actionMethods":{"create":"POST","destroy":"POST","read":"POST","update":"POST"},"reader":{"idProperty":"MEETING_INVESTOR","type":"json","root":"data.items","totalProperty":"data.totalCount"},"writer":{"type":"json","root":"data","writeAllFields":true}},
										sorter: {"property":"MEETING_INVESTOR","direction":"ASC"}});

									storeMI.load();

									/*
									 * End of : Meeting Investors
									 */

									/*
									 * Sector Holdings
									 */

									var storeSH = Ext.create('Ext.data.Store', {
										model: 'SectorHolding',
										storeId: 'SectorHoldings',
										proxy: {
											extraParams:{id:_data[_idx].data.INVESTOR_ID},
									        "type": "ajax",
									        "api": {
									            "read": "\/sectorholdings\/request\/read",
									            "create": "\/sectorholdings\/request\/create",
									            "update": "\/sectorholdings\/request\/update",
									            "destroy": "\/sectorholdings\/request\/destroy"
									        },
									        "actionMethods": {
									            "create": "POST",
									            "destroy": "POST",
									            "read": "POST",
									            "update": "POST"
									        },
									        "reader": {
									            "idProperty": "TITLE",
									            "type": "json",
									            "root": "data.items",
									            "totalProperty": "data.totalCount"
									        },
									        "writer": {
									            "type": "json",
									            "root": "data",
									            "writeAllFields": true
									        }
									    },
									    sorter: {
									        "property": "TITLE",
									        "direction": "ASC"
									    },
									});

									storeSH.load();

									/*
									 * End of : Sector Holdings
									 */

									/*
									 * Portfolio Distributions
									 */

									var storePD = Ext.create('Ext.data.Store', {
										model: 'PortfolioDistribution',
										storeId: 'PortfolioDistributions',
										proxy: {
											extraParams:{id:_data[_idx].data.INVESTOR_ID},
									        "type": "ajax",
									        "api": {
									            "read": "\/portfoliodistribution\/request\/read",
									            "create": "\/portfoliodistribution\/request\/create",
									            "update": "\/portfoliodistribution\/request\/update",
									            "destroy": "\/portfoliodistribution\/request\/destroy"
									        },
									        "actionMethods": {
									            "create": "POST",
									            "destroy": "POST",
									            "read": "POST",
									            "update": "POST"
									        },
									        "reader": {
									            "idProperty": "TITLE",
									            "type": "json",
									            "root": "data.items",
									            "totalProperty": "data.totalCount"
									        },
									        "writer": {
									            "type": "json",
									            "root": "data",
									            "writeAllFields": true
									        }
									    },
									    sorter: {
									        "property": "TITLE",
									        "direction": "ASC"
									    },
									});

									storePD.load();

									/*
									 * End of : Portfolio Distributions
									 */

									c.add({
										title: 'Investors Detailed Search Result : ' + _data[_idx].data.COMPANY_NAME,
										closable: true,
										id: _id,
										autoScroll: true,
										tbar: [{
											xtype: 'button',
											text: 'Prev',
											id: _id + '-btn-left',
											iconCls: 'icon-left',
											listeners: {
												click: function() {
													
													showLoadingWindow();
													
													var r = Ext.getCmp(_id + '-btn-right');
													var p = Ext.getCmp(_id + '-panel');
													r.enable();
													_idx--;
													if(_idx == 0) {
														this.disable();
													}
													p.setTitle(_data[_idx].data.COMPANY_NAME);
													Ext.getCmp(_id).setTitle('Investors Detailed Search Result : ' + _data[_idx].data.COMPANY_NAME);
													
													/* Detail Investor */
													
													Ext.getCmp(_id + '-equity-assets').setValue(_data[_idx].data.EQUITY_ASSETS);
													Ext.getCmp(_id + '-investor-type').setValue(_data[_idx].data.INVESTOR_TYPE);
													Ext.getCmp(_id + '-style').setValue(_data[_idx].data.STYLE);
													
													/* End of : Detail Investor */
													
													/* Company Address */
													
													Ext.getCmp(_id + '-address').setValue(_data[_idx].data.ADDRESS);
													Ext.getCmp(_id + '-location').setValue(_data[_idx].data.LOCATION);
													Ext.getCmp(_id + '-phone-1').setValue(_data[_idx].data.PHONE_1);
													Ext.getCmp(_id + '-phone-2').setValue(_data[_idx].data.PHONE_2);
													Ext.getCmp(_id + '-email-1').setValue(_data[_idx].data.EMAIL_1);
													Ext.getCmp(_id + '-email-2').setValue(_data[_idx].data.EMAIL_2);
													Ext.getCmp(_id + '-fax').setValue(_data[_idx].data.FAX);
													Ext.getCmp(_id + '-website').setValue(_data[_idx].data.WEBSITE);
													
													/* End of : Company Address */
													
													/* Company Overview */
													
													Ext.getCmp(_id + '-company-overview').setValue(_data[_idx].data.COMPANY_OVERVIEW);
													
													/* End of : Company Overview */
													
													/* Investment Strategy */
													
													Ext.getCmp(_id + '-investment-strategy').setValue(_data[_idx].data.INVESTMENT_STRATEGY);
													
													/* End of : Investment Strategy */
													
													data = _data[_idx].data;
													id = _id;
													selected = _data;
													
													storeSH.load({
														params: {
															id: data.INVESTOR_ID
														}
													});
													
													storePD.load({
														params: {
															id: data.INVESTOR_ID
														}
													});
													
													storeCO.load({
														params: {
															id: data.INVESTOR_ID
														}
													});
													
													storeMI.load({
														params: {
															id: data.INVESTOR_ID
														},
														callback: function() {
															closeLoadingWindow();
														}
													});
												}
											}
										},{
											xtype: 'button',
											text: 'Next',
											id: _id + '-btn-right',
											iconCls: 'icon-right',
											iconAlign: 'right',
											listeners: {
												click: function() {
													
													showLoadingWindow();
													var l = Ext.getCmp(_id + '-btn-left');
													var p = Ext.getCmp(_id + '-panel');
													l.enable();
													_idx++;
													if(_idx == _storeSearchInvestors.data.items.length - 1) {
														this.disable();
													}
													p.setTitle(_data[_idx].data.COMPANY_NAME);
													Ext.getCmp(_id).setTitle('Investors Detailed Search Result : ' + _data[_idx].data.COMPANY_NAME);
													
													/* Detail Investor */
													
													Ext.getCmp(_id + '-equity-assets').setValue(_data[_idx].data.EQUITY_ASSETS);
													Ext.getCmp(_id + '-investor-type').setValue(_data[_idx].data.INVESTOR_TYPE);
													Ext.getCmp(_id + '-style').setValue(_data[_idx].data.STYLE);
													
													/* End of : Detail Investor */
													
													/* Company Address */
													
													Ext.getCmp(_id + '-address').setValue(_data[_idx].data.ADDRESS);
													Ext.getCmp(_id + '-location').setValue(_data[_idx].data.LOCATION);
													Ext.getCmp(_id + '-phone-1').setValue(_data[_idx].data.PHONE_1);
													Ext.getCmp(_id + '-phone-2').setValue(_data[_idx].data.PHONE_2);
													Ext.getCmp(_id + '-email-1').setValue(_data[_idx].data.EMAIL_1);
													Ext.getCmp(_id + '-email-2').setValue(_data[_idx].data.EMAIL_2);
													Ext.getCmp(_id + '-fax').setValue(_data[_idx].data.FAX);
													Ext.getCmp(_id + '-website').setValue(_data[_idx].data.WEBSITE);
													
													/* End of : Company Address */
													
													/* Company Overview */
													
													Ext.getCmp(_id + '-company-overview').setValue(_data[_idx].data.COMPANY_OVERVIEW);
													
													/* End of : Company Overview */
													
													/* Investment Strategy */
													
													Ext.getCmp(_id + '-investment-strategy').setValue(_data[_idx].data.INVESTMENT_STRATEGY);
													
													/* End of : Investment Strategy */
													
													data = _data[_idx].data;
													id = _id;
													selected = _data;
													
													storeSH.load({
														params: {
															id: data.INVESTOR_ID
														}
													});
													
													storePD.load({
														params: {
															id: data.INVESTOR_ID
														}
													});
													
													storeCO.proxy.extraParams.id = data.INVESTOR_ID;
													storeCO.load();
													
													storeMI.proxy.extraParams.id = data.INVESTOR_ID;
													storeMI.load({
														params: {
															id: data.INVESTOR_ID
														},
														callback: function() {
															closeLoadingWindow();
														}
													});
												}
											}
										},{
											xtype: 'button',
											text: 'Print Page',
											iconCls: 'icon-print',
											listeners: {
												click: function() {
													window.open(sd.baseUrl + '/investors/request/print/id/' + data.INVESTOR_ID, '_blank');
												}
											}
										}],
										items: [{
											xtype: 'panel',
											title: _data[_idx].data.COMPANY_NAME,
											border: false,
											id: _id + '-panel',
											autoScroll: true,
											waitMsgTarget: true,
											maxWidth: Ext.getBody().getViewSize().width,
											items: [{
												region: 'north',
												maxWidth: Ext.getBody().getViewSize().width,
												border: false,
												items: [{
													title: 'Detail Investor',
													border: false,
													style: {
														float: 'left',
														width: '50%'
													},
													items: [{
														xtype: 'form',
														layout: 'form',
														border: false,
														id: _id + '-investors-detail-investor-form',
														bodyPadding: '5 5 5 5',
														items: [{
															xtype: 'displayfield',
															fieldLabel: 'Equity Assets',
															value: _data[_idx].data.EQUITY_ASSETS,
															id: _id + '-equity-assets'
														},{
															xtype: 'displayfield',
															fieldLabel: 'Investor Type',
															value: _data[_idx].data.INVESTOR_TYPE,
															id: _id + '-investor-type'
														},{
															xtype: 'displayfield',
															fieldLabel: 'Style',
															value: _data[_idx].data.STYLE,
															id: _id + '-style'
														}]
													}]
												},{
													title: 'Company Address',
													border: false,
													style: {
														float: 'rigth',
														width: '50%'
													},
													items: [{
														xtype: 'form',
														layout: 'form',
														id: _id + '-investors-detail-company-address-form',
														bodyPadding: '5 5 5 5',
														border: false,
														items: [{
															xtype: 'displayfield',
															fieldLabel: 'Address',
															allowBlank: false,
															value: _data[_idx].data.ADDRESS,
															id: _id + '-address'
														},{
															xtype: 'displayfield',
															fieldLabel: 'Location',
															displayField: 'LOCATION',
															value: _data[_idx].data.LOCATION,
															id: _id + '-location'
														},{
															xtype: 'displayfield',
															fieldLabel: 'Phone #1',
															value: _data[_idx].data.PHONE_1,
															id: _id + '-phone-1'
														},{
															xtype: 'displayfield',
															fieldLabel: 'Phone #2',
															value: _data[_idx].data.PHONE_2,
															id: _id + '-phone-2'
														},{
															xtype: 'displayfield',
															fieldLabel: 'Email #1',
															value: _data[_idx].data.EMAIL_1,
															id: _id + '-email-1'
														},{
															xtype: 'displayfield',
															fieldLabel: 'Email #2',
															value: _data[_idx].data.EMAIL_2,
															id: _id + '-email-2'
														},{
															xtype: 'displayfield',
															fieldLabel: 'Fax',
															value: _data[_idx].data.FAX,
															id: _id + '-fax'
														},{
															xtype: 'displayfield',
															fieldLabel: 'Website',
															value: _data[_idx].data.WEBSITE,
															id: _id + '-website'
														}]
													}]
												}]
											},{
												region: 'north',
												title: 'Company Overview',
												border: false,
												maxWidth: Ext.getBody().getViewSize().width,
												items: [{
													xtype: 'form',
													layout: 'form',
													border: false,
													bodyPadding: '5 5 5 5',
													id: _id + '- investors-detail-company-overview-form',
													items: [{
														xtype: 'displayfield',
														value: _data[_idx].data.COMPANY_OVERVIEW,
														id: _id + '-company-overview',
														minHeight: 100
													}]
												}]
											},{
												region: 'north',
												title: 'Investment Strategy',
												border: false,
												maxWidth: Ext.getBody().getViewSize().width,
												items: [{
													xtype: 'form',
													layout: 'form',
													border: false,
													bodyPadding: '5 5 5 5',
													id: _id + '-investors-detail-investment-strategy-form',
													items: [{
														xtype: 'displayfield',
														value: _data[_idx].data.INVESTMENT_STRATEGY,
														id: _id + '-investment-strategy',
														minHeight: 100
													}]
												}]
											},{
												region: 'north',
												border: false,
												maxWidth: Ext.getBody().getViewSize().width,
												items: [{
													title: 'Sector Holdings',
													style: {
														float: 'left',
														width: '50%'
													},
													minHeight: 300,
													items: [{
														xtype: 'chart',
														store: storeSH,
														width: 570,
														height: 300,
														animate: true,
														legend: {
															position: 'right'
														},
														series: [{
															type: 'pie',
															field: 'VALUE',
															showInLegend: true,
															highlight: {
																segment: {
																	margin: 20
																}
															},
															label: {
																field: 'TITLE',
																contrast: true,
																display: 'none',
																font: '12px Arial'
															}
														}]
													}]
												},{
													title: 'Portfolio Distributions',
													style: {
														float: 'right',
														width: '50%'
													},
													minHeight: 300,
													items: [{
														xtype: 'chart',
														animate: {
															easing: 'bounceOut',
															duration: 400
														},
														store: storePD,
														shadow: true,
														width: 670,
														height: 300,
														style: 'background: #FFF',
														theme: 'Base:gradients',
														axes: [{
															type: 'Numeric',
															position: 'left',
															fields: ['VALUE'],
															label: {
																renderer: Ext.util.Format.numberRenderer('0,0')
															},
															grid: true,
															minimum: 0
														},{
															type: 'Category',
															position: 'bottom',
															fields: ['TITLE'],
														}],
														series: [{
															type: 'column',
															axis: 'left',
															highlight: true,
															label: {
																display: 'insideEnd',
												                  'text-anchor': 'middle',
												                   field: 'VALUE',
												                   orientation: 'horizontal',
												                   fill: '#FFF',
												                   font: '14px Arial'
															},
															xField: 'TITLE',
												            yField: 'VALUE'
														}]
													}]
												}]
											},{
												region: 'north',
												title: 'Key Persons',
												border: false,
												maxWidth: Ext.getBody().getViewSize().width,
												items: [{
													xtype: 'gridpanel',
													border: false,
													minHeight: 150,
													maxHeight: 150,
													autoScroll: true,
													id: _id + '-investors-detail-key-persons-grid',
													store: storeCO,
													bbar: new Ext.PagingToolbar({
														store: storeCO,
														displayInfo: true,
														displayMsg: 'Displaying data {0} - {1} of {2}',
														emptyMsg: 'No data to display',
														items: [
														    '-',
														    'Records per page'
														]
													}),
													columns: [{
														text: 'Name',
														flex: 1,
														dataIndex: 'NAME'
													},{
														text: 'Position',
														width: 200,
														align: 'center',
														dataIndex: 'POSITION'
													},{
														text: 'Email',
														width: 200,
														align: 'center',
														dataIndex: 'EMAIL'
													},{
														text: 'Phone',
														width: 200,
														align: 'center',
														dataIndex: 'PHONE_1'
													}]
												}]
											},{
												region: 'north',
												title: 'Meeting Investor',
												border: false,
												maxWidth: Ext.getBody().getViewSize().width,
												items: [{
													xtype: 'gridpanel',
													border: false,
													minHeight: 150,
													maxHeight: 150,
													autoScroll: true,
													store: storeMI,
													id: 'investors-detail-meeting-investor-grid-' + _id,
													columns: [{
														text: 'Meeting Date',
														align: 'center',
														width: 100,
														dataIndex: 'MEETING_DATE'
													},{
														text: 'Meeting Event',
														flex: 1,
														dataIndex: 'MEETING_EVENT'
													},{
														text: 'Name',
														align: 'center',
														width: 150,
														dataIndex: 'NAME'
													},{
														text: 'Initials',
														align: 'center',
														width: 150,
														dataIndex: 'INITIAL_PART'
													}]
												}],
												tbar: [{
													xtype: 'button',
													text: 'Detail Meeting',
													iconCls: 'icon-detail',
													listeners: {
														click: function() {
															var __c = Ext.getCmp('investors-detail-meeting-investor-grid-' + id);
															var __selected = __c.getSelectionModel().getSelection();
															if(__selected.length > 0) {
																var __id = 'investor-details-meetings-tabs-' + __selected[0].data.MEETING_ACTIVITIE_ID;
															    var meeting__id = __selected[0].data;
																if(!c.items.get(__id)) {
																	var maxWidth = 221;

															        /*
															         *Call Meeting Participant
															         */
															        var storeMP = loadStore('Meetingparticipants');
															        storeMP.load({
															            params:{
															            id:meeting__id.MEETING_ACTIVITIE_ID     
															            }   
															        });
															        /*
															         *End call Meeting Participant
															         */
															          /*
															         *Call Meeting Contacts
															         */
															        var storeCON = loadStore('Meetingcontacts');
															        storeCON.autoSync = true;
															        storeCON.load({
															            params:{
															            id:meeting__id.MEETING_ACTIVITIE_ID     
															            }   
															        });
															        /*
															         *End call Meeting Contacts
															         */

															         var storeMD = loadStore('Meetingdocumentations');
															            storeMD.autoSync = true;
															            storeMD.load({
															                params:{
															                id:meeting__id.MEETING_ACTIVITIE_ID     
															                }   
															            });
															         var storeMA = loadStore('Meetingactivities');
															            storeMA.autoSync = true;
															            storeMA.load({
															                params:{
															                id:meeting__id.MEETING_ACTIVITIE_ID     
															                }   
															            });    
															        var storeCO = Ext.create("Ext.data.Store", {
															        model: "Contact",
															        storeId: "Contacts",
															        proxy:{extraParams:{id:selected[0].data.INVESTOR_ID},"type":"ajax","api":{"read":"\/contacts\/request\/read","create":"\/contacts\/request\/create","update":"\/contacts\/request\/update","destroy":"\/contacts\/request\/destroy"},"actionMethods":{"create":"POST","destroy":"POST","read":"POST","update":"POST"},"reader":{"idProperty":"CONTACT_ID","type":"json","root":"data.items","totalProperty":"data.totalCount"},"writer":{"type":"json","root":"data","writeAllFields":true}},
															        sorter: {"property":"CONTACT_ID","direction":"ASC"}});
															    
															        storeCO.load();
																	c.add({
																		title: 'Meeting: ' + meeting__id.MEETING_EVENT,
																		closable: true,
																		id: __id,
																		xtype: 'panel',
															            layout: 'border',
															            autoScroll: true,
															            border: false,
															            items:[{
															            	title: 'Meeting Contacts',
															                border: false,
															                region:'north',
															                xtype: 'gridpanel',
															                id:'meeting-contact-list-' + id,
															                store:storeCON,
															                //store:storeCO,
															                autoScroll:true,
															                minHeight: 200,
															                maxWidth: Ext.getBody().getViewSize().width,
															                columns:[{
															                	text:'Company name',
															                    dataIndex:'COMPANY_NAME',
															                    width:200,
															                    flex: 1
															                },{
															                	text:'Name',
															                    dataIndex:'NAME',
															                    width:200,
															                    flex: 1
															                },{
															                	text:'Email',
															                    dataIndex:'EMAIL',
															                    width:200
															                },{
															                    text:'Position',
															                    dataIndex:'POSITION',
															                    width:200
															                }]
															            },{
															            	title:'ITM Participants',
															            	border:false,
															            	region:'north',
															            	xtype:'gridpanel',
															                store:storeMP,
															                id:'meetingparticipant-list-'+id,
															            	autoScroll:true,
															            	minHeight:200,
															            	maxWidth: Ext.getBody().getViewSize().width,
															                columns:[{
															                    text: 'Name',
															                    dataIndex:'NAME_PART',
															                    width:200,
															                    flex: 1
															                },{
															                    text:'Email',
															                    dataIndex:'EMAIL_PART',
															                    width:200,
															                    flex: 1
															                },{
															                	text: 'Position',
															                	dataIndex: 'POSITION_PART',
															                	width: 200,
															                	align: 'center'
															                }]
															            },{
															            	title:'Meeting Documents',
															            	border:false,
															            	region:'north',
															            	xtype:'gridpanel',
															                id: 'meetingdocumentation-list-' + id,
															                store:storeMD,
															            	autoScroll:true,
															            	minHeight:200,
															            	maxWidth: Ext.getBody().getViewSize().width,
															            	tbar:[{
															            		xtype:'button',
															            		text:'Downloads Documents',
															            		iconCls:'icon-download',
															            		listeners:{
															            			click:function(){
															                            var  md= Ext.getCmp('meetingdocumentation-list-'+id);
															                            var md_selected = md.getSelectionModel().getSelection();
															                            if(md_selected.length > 0) {
															                                var md_data=md_selected[0].data;
															                                document.location = sd.baseUrl + '/meetingdocumentation/request/download/id/' + md_data.MEETING_DOCUMENTATION_ID;
															                                var store = loadStore('Meetingdocumentations');
															                                setTimeout(function(){
															                                   store.load({
															                                            params: {
															                                            id: meeting__id.MEETING_ACTIVITIE_ID
															                                        }
															                                    });
															                                },800);
															                            } else {
															                                Ext.Msg.alert('Message', 'You did not select any File Documents');
															                            }
															            			}
															            		}
															            	}],
															            	columns:[{
															            		text:'Documents Title',
															                    dataIndex:'DOCUMENTATION_TITLE',
															                    width:200,
															                    flex: 1
															            	},{
															                    text:'File Name',
															                    dataIndex:'FILE_NAME',
															            		width:300
															            	},{
															                    text:'Upload Date',
															                    dataIndex:'CREATED_DATE',
															                    width:200
															                }]
															            },{
															                region: 'north',
															                title: 'Meeting Notes',
															                //store:storeMA,
															                border: false,
															                maxWidth: Ext.getBody().getViewSize().width,
															                items: [{
															                    xtype: 'form',
															                    layout: 'form',
															                    border: false,
															                    bodyPadding: '5 5 5 5',
															                    id: 'meeting-detail-notes-form-' + id,
															                    items: [{
															                        xtype: 'displayfield',
															                        value: meeting__id.NOTES,
															                        emptyText:'Notes is null',
															                        minHeight: 100
															                        //allowBlank: false
															                    }]
															                }]
															            }]
																	});
																	
																}
																c.setActiveTab(__id);
															} else {
																Ext.Msg.alert('Message', 'You did not select any Meetings.');
															}
														}
													}
												}]
											}]
										}]
									});
									Ext.getCmp(_id + '-btn-left').disable();
									var p = Ext.getCmp(_id + '-panel');
									c.setActiveTab(_id);
									p.setTitle(_data[_idx].data.COMPANY_NAME);
								} else {
									var c = Ext.getCmp('main-content');
									var xyz = Math.random();
									if(!c.items.get('investors-search-result-' + xyz)) {
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
											store: _storeSearchInvestors,
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
											_storeSearchInvestors.pageSize = parseInt(_records[0].get('id'), 10);
											_storeSearchInvestors.loadPage(1);
										}, this);
										
										c.add({
											title: 'Investors Search Result',
											id: 'investors-search-result-' + xyz,
											closable: true,
											bbar: bbar,
											items: [{
												xtype: 'gridpanel',
												store: _storeSearchInvestors,
												border: false,
												id: 'investors-search-grid-' + xyz,
												columns: [{
													text: 'Company Name',
													flex: 1,
													dataIndex: 'COMPANY_NAME'
												},{
													text: 'Style',
													align: 'center',
													width: 100,
													dataIndex: 'STYLE'
												},{
													text: 'Investor Type',
													width: 190,
													dataIndex: 'INVESTOR_TYPE'
												},{
													text: 'Equity Assets',
													width: 100,
													align: 'center',
													dataIndex: 'EQUITY_ASSETS'
												},{
													text: 'Office Location',
													width: 160,
													align: 'center',
													dataIndex: 'LOCATION'
												},{
													text: 'Last Update',
													width: 150,
													align: 'center',
													dataIndex: 'MODIFIED_DATE'
												}],
												listeners: {
													itemdblclick: function(dv, record, item, index, e) {
														var _idx = 0;
														var c = Ext.getCmp('main-content');
														var _id = 'investors-detailed-search-results-' + Math.random();
														var _data = [{data:record.data}];
														var maxWidth = 221;
														var data = _data;
														var id = _id;
														var selected = _data;
														storeIT = loadStore('InvestorTypes');
														storeLOCATIONS = loadStore('Locations');

														/*
														 * Contacts
														 */

														var storeCO = Ext.create("Ext.data.Store", {
															model: "Contact",
															storeId: "Contacts",
															proxy:{extraParams:{id:_data[_idx].data.INVESTOR_ID},"type":"ajax","api":{"read":"\/contacts\/request\/read","create":"\/contacts\/request\/create","update":"\/contacts\/request\/update","destroy":"\/contacts\/request\/destroy"},"actionMethods":{"create":"POST","destroy":"POST","read":"POST","update":"POST"},"reader":{"idProperty":"CONTACT_ID","type":"json","root":"data.items","totalProperty":"data.totalCount"},"writer":{"type":"json","root":"data","writeAllFields":true}},
															sorter: {"property":"CONTACT_ID","direction":"ASC"}});

														storeCO.load();

														/*
														 * End of : Contacts

														/*
														 * Meeting Investors
														 */

														var storeMI = Ext.create("Ext.data.Store", {
															model: "Meetinginvestor",
															storeId: "Meetinginvestors",
															proxy:{extraParams:{id:_data[_idx].data.INVESTOR_ID},"type":"ajax","api":{"read":"\/meetinginvestor\/request\/read","create":"\/meetinginvestor\/request\/create","update":"\/meetinginvestor\/request\/update","destroy":"\/meetinginvestor\/request\/destroy"},"actionMethods":{"create":"POST","destroy":"POST","read":"POST","update":"POST"},"reader":{"idProperty":"MEETING_INVESTOR","type":"json","root":"data.items","totalProperty":"data.totalCount"},"writer":{"type":"json","root":"data","writeAllFields":true}},
															sorter: {"property":"MEETING_INVESTOR","direction":"ASC"}});

														storeMI.load();

														/*
														 * End of : Meeting Investors
														 */

														/*
														 * Sector Holdings
														 */

														var storeSH = Ext.create('Ext.data.Store', {
															model: 'SectorHolding',
															storeId: 'SectorHoldings',
															proxy: {
																extraParams:{id:_data[_idx].data.INVESTOR_ID},
														        "type": "ajax",
														        "api": {
														            "read": "\/sectorholdings\/request\/read",
														            "create": "\/sectorholdings\/request\/create",
														            "update": "\/sectorholdings\/request\/update",
														            "destroy": "\/sectorholdings\/request\/destroy"
														        },
														        "actionMethods": {
														            "create": "POST",
														            "destroy": "POST",
														            "read": "POST",
														            "update": "POST"
														        },
														        "reader": {
														            "idProperty": "TITLE",
														            "type": "json",
														            "root": "data.items",
														            "totalProperty": "data.totalCount"
														        },
														        "writer": {
														            "type": "json",
														            "root": "data",
														            "writeAllFields": true
														        }
														    },
														    sorter: {
														        "property": "TITLE",
														        "direction": "ASC"
														    },
														});

														storeSH.load();

														/*
														 * End of : Sector Holdings
														 */

														/*
														 * Portfolio Distributions
														 */

														var storePD = Ext.create('Ext.data.Store', {
															model: 'PortfolioDistribution',
															storeId: 'PortfolioDistributions',
															proxy: {
																extraParams:{id:_data[_idx].data.INVESTOR_ID},
														        "type": "ajax",
														        "api": {
														            "read": "\/portfoliodistribution\/request\/read",
														            "create": "\/portfoliodistribution\/request\/create",
														            "update": "\/portfoliodistribution\/request\/update",
														            "destroy": "\/portfoliodistribution\/request\/destroy"
														        },
														        "actionMethods": {
														            "create": "POST",
														            "destroy": "POST",
														            "read": "POST",
														            "update": "POST"
														        },
														        "reader": {
														            "idProperty": "TITLE",
														            "type": "json",
														            "root": "data.items",
														            "totalProperty": "data.totalCount"
														        },
														        "writer": {
														            "type": "json",
														            "root": "data",
														            "writeAllFields": true
														        }
														    },
														    sorter: {
														        "property": "TITLE",
														        "direction": "ASC"
														    },
														});

														storePD.load();

														/*
														 * End of : Portfolio Distributions
														 */

														c.add({
															title: 'Investors Detailed Search Result : ' + _data[_idx].data.COMPANY_NAME,
															closable: true,
															id: _id,
															autoScroll: true,
															tbar: [{
																xtype: 'button',
																text: 'Print Page',
																iconCls: 'icon-print',
																listeners: {
																	click: function() {
																		window.open(sd.baseUrl + '/investors/request/print/id/' + _data[_idx].data.INVESTOR_ID, '_blank');
																	}
																}
															}],
															items: [{
																xtype: 'panel',
																title: _data[_idx].data.COMPANY_NAME,
																border: false,
																id: _id + '-panel',
																autoScroll: true,
																waitMsgTarget: true,
																maxWidth: Ext.getBody().getViewSize().width,
																items: [{
																	region: 'north',
																	maxWidth: Ext.getBody().getViewSize().width,
																	border: false,
																	items: [{
																		title: 'Detail Investor',
																		border: false,
																		style: {
																			float: 'left',
																			width: '50%'
																		},
																		items: [{
																			xtype: 'form',
																			layout: 'form',
																			border: false,
																			id: _id + '-investors-detail-investor-form',
																			bodyPadding: '5 5 5 5',
																			items: [{
																				xtype: 'displayfield',
																				fieldLabel: 'Equity Assets',
																				value: _data[_idx].data.EQUITY_ASSETS,
																				id: _id + '-equity-assets'
																			},{
																				xtype: 'displayfield',
																				fieldLabel: 'Investor Type',
																				value: _data[_idx].data.INVESTOR_TYPE,
																				id: _id + '-investor-type'
																			},{
																				xtype: 'displayfield',
																				fieldLabel: 'Style',
																				value: _data[_idx].data.STYLE,
																				id: _id + '-style'
																			}]
																		}]
																	},{
																		title: 'Company Address',
																		border: false,
																		style: {
																			float: 'rigth',
																			width: '50%'
																		},
																		items: [{
																			xtype: 'form',
																			layout: 'form',
																			id: _id + '-investors-detail-company-address-form',
																			bodyPadding: '5 5 5 5',
																			border: false,
																			items: [{
																				xtype: 'displayfield',
																				fieldLabel: 'Address',
																				allowBlank: false,
																				value: _data[_idx].data.ADDRESS,
																				id: _id + '-address'
																			},{
																				xtype: 'displayfield',
																				fieldLabel: 'Location',
																				displayField: 'LOCATION',
																				value: _data[_idx].data.LOCATION,
																				id: _id + '-location'
																			},{
																				xtype: 'displayfield',
																				fieldLabel: 'Phone #1',
																				value: _data[_idx].data.PHONE_1,
																				id: _id + '-phone-1'
																			},{
																				xtype: 'displayfield',
																				fieldLabel: 'Phone #2',
																				value: _data[_idx].data.PHONE_2,
																				id: _id + '-phone-2'
																			},{
																				xtype: 'displayfield',
																				fieldLabel: 'Email #1',
																				value: _data[_idx].data.EMAIL_1,
																				id: _id + '-email-1'
																			},{
																				xtype: 'displayfield',
																				fieldLabel: 'Email #2',
																				value: _data[_idx].data.EMAIL_2,
																				id: _id + '-email-2'
																			},{
																				xtype: 'displayfield',
																				fieldLabel: 'Fax',
																				value: _data[_idx].data.FAX,
																				id: _id + '-fax'
																			},{
																				xtype: 'displayfield',
																				fieldLabel: 'Website',
																				value: _data[_idx].data.WEBSITE,
																				id: _id + '-website'
																			}]
																		}]
																	}]
																},{
																	region: 'north',
																	title: 'Company Overview',
																	border: false,
																	maxWidth: Ext.getBody().getViewSize().width,
																	items: [{
																		xtype: 'form',
																		layout: 'form',
																		border: false,
																		bodyPadding: '5 5 5 5',
																		id: _id + '- investors-detail-company-overview-form',
																		items: [{
																			xtype: 'displayfield',
																			value: _data[_idx].data.COMPANY_OVERVIEW,
																			id: _id + '-company-overview',
																			minHeight: 100
																		}]
																	}]
																},{
																	region: 'north',
																	title: 'Investment Strategy',
																	border: false,
																	maxWidth: Ext.getBody().getViewSize().width,
																	items: [{
																		xtype: 'form',
																		layout: 'form',
																		border: false,
																		bodyPadding: '5 5 5 5',
																		id: _id + '-investors-detail-investment-strategy-form',
																		items: [{
																			xtype: 'displayfield',
																			value: _data[_idx].data.INVESTMENT_STRATEGY,
																			id: _id + '-investment-strategy',
																			minHeight: 100
																		}]
																	}]
																},{
																	region: 'north',
																	border: false,
																	maxWidth: Ext.getBody().getViewSize().width,
																	items: [{
																		title: 'Sector Holdings',
																		style: {
																			float: 'left',
																			width: '50%'
																		},
																		minHeight: 300,
																		items: [{
																			xtype: 'chart',
																			store: storeSH,
																			width: 570,
																			height: 300,
																			animate: true,
																			legend: {
																				position: 'right'
																			},
																			series: [{
																				type: 'pie',
																				field: 'VALUE',
																				showInLegend: true,
																				highlight: {
																					segment: {
																						margin: 20
																					}
																				},
																				label: {
																					field: 'TITLE',
																					contrast: true,
																					display: 'none',
																					font: '12px Arial'
																				}
																			}]
																		}]
																	},{
																		title: 'Portfolio Distributions',
																		style: {
																			float: 'right',
																			width: '50%'
																		},
																		minHeight: 300,
																		items: [{
																			xtype: 'chart',
																			animate: {
																				easing: 'bounceOut',
																				duration: 400
																			},
																			store: storePD,
																			shadow: true,
																			width: 670,
																			height: 300,
																			style: 'background: #FFF',
																			theme: 'Base:gradients',
																			axes: [{
																				type: 'Numeric',
																				position: 'left',
																				fields: ['VALUE'],
																				label: {
																					renderer: Ext.util.Format.numberRenderer('0,0')
																				},
																				grid: true,
																				minimum: 0
																			},{
																				type: 'Category',
																				position: 'bottom',
																				fields: ['TITLE'],
																			}],
																			series: [{
																				type: 'column',
																				axis: 'left',
																				highlight: true,
																				label: {
																					display: 'insideEnd',
																	                  'text-anchor': 'middle',
																	                   field: 'VALUE',
																	                   orientation: 'horizontal',
																	                   fill: '#FFF',
																	                   font: '14px Arial'
																				},
																				xField: 'TITLE',
																	            yField: 'VALUE'
																			}]
																		}]
																	}]
																},{
																	region: 'north',
																	title: 'Key Persons',
																	border: false,
																	maxWidth: Ext.getBody().getViewSize().width,
																	items: [{
																		xtype: 'gridpanel',
																		border: false,
																		minHeight: 150,
																		maxHeight: 150,
																		autoScroll: true,
																		id: _id + '-investors-detail-key-persons-grid',
																		store: storeCO,
																		bbar: new Ext.PagingToolbar({
																			store: storeCO,
																			displayInfo: true,
																			displayMsg: 'Displaying data {0} - {1} of {2}',
																			emptyMsg: 'No data to display',
																			items: [
																			    '-',
																			    'Records per page'
																			]
																		}),
																		columns: [{
																			text: 'Name',
																			flex: 1,
																			dataIndex: 'NAME'
																		},{
																			text: 'Position',
																			width: 200,
																			align: 'center',
																			dataIndex: 'POSITION'
																		},{
																			text: 'Email',
																			width: 200,
																			align: 'center',
																			dataIndex: 'EMAIL'
																		},{
																			text: 'Phone',
																			width: 200,
																			align: 'center',
																			dataIndex: 'PHONE_1'
																		}]
																	}]
																},{
																	region: 'north',
																	title: 'Meeting Investor',
																	border: false,
																	maxWidth: Ext.getBody().getViewSize().width,
																	items: [{
																		xtype: 'gridpanel',
																		border: false,
																		minHeight: 150,
																		maxHeight: 150,
																		autoScroll: true,
																		store: storeMI,
																		id: 'investors-detail-meeting-investor-grid-' + _id,
																		columns: [{
																			text: 'Meeting Date',
																			align: 'center',
																			width: 100,
																			dataIndex: 'MEETING_DATE'
																		},{
																			text: 'Meeting Event',
																			flex: 1,
																			dataIndex: 'MEETING_EVENT'
																		},{
																			text: 'Name',
																			align: 'center',
																			width: 150,
																			dataIndex: 'NAME'
																		},{
																			text: 'Initials',
																			align: 'center',
																			width: 150,
																			dataIndex: 'INITIAL_PART'
																		}]
																	}],
																	tbar: [{
																		xtype: 'button',
																		text: 'Detail Meeting',
																		iconCls: 'icon-detail',
																		listeners: {
																			click: function() {
																				var __c = Ext.getCmp('investors-detail-meeting-investor-grid-' + id);
																				var __selected = __c.getSelectionModel().getSelection();
																				if(__selected.length > 0) {
																					var __id = 'investor-details-meetings-tabs-' + __selected[0].data.MEETING_ACTIVITIE_ID;
																				    var meeting__id = __selected[0].data;
																					if(!c.items.get(__id)) {
																						var maxWidth = 221;

																				        /*
																				         *Call Meeting Participant
																				         */
																				        var storeMP = loadStore('Meetingparticipants');
																				        storeMP.load({
																				            params:{
																				            id:meeting__id.MEETING_ACTIVITIE_ID     
																				            }   
																				        });
																				        /*
																				         *End call Meeting Participant
																				         */
																				          /*
																				         *Call Meeting Contacts
																				         */
																				        var storeCON = loadStore('Meetingcontacts');
																				        storeCON.autoSync = true;
																				        storeCON.load({
																				            params:{
																				            id:meeting__id.MEETING_ACTIVITIE_ID     
																				            }   
																				        });
																				        /*
																				         *End call Meeting Contacts
																				         */

																				         var storeMD = loadStore('Meetingdocumentations');
																				            storeMD.autoSync = true;
																				            storeMD.load({
																				                params:{
																				                id:meeting__id.MEETING_ACTIVITIE_ID     
																				                }   
																				            });
																				         var storeMA = loadStore('Meetingactivities');
																				            storeMA.autoSync = true;
																				            storeMA.load({
																				                params:{
																				                id:meeting__id.MEETING_ACTIVITIE_ID     
																				                }   
																				            });    
																				        var storeCO = Ext.create("Ext.data.Store", {
																				        model: "Contact",
																				        storeId: "Contacts",
																				        proxy:{extraParams:{id:selected[0].data.INVESTOR_ID},"type":"ajax","api":{"read":"\/contacts\/request\/read","create":"\/contacts\/request\/create","update":"\/contacts\/request\/update","destroy":"\/contacts\/request\/destroy"},"actionMethods":{"create":"POST","destroy":"POST","read":"POST","update":"POST"},"reader":{"idProperty":"CONTACT_ID","type":"json","root":"data.items","totalProperty":"data.totalCount"},"writer":{"type":"json","root":"data","writeAllFields":true}},
																				        sorter: {"property":"CONTACT_ID","direction":"ASC"}});
																				    
																				        storeCO.load();
																						c.add({
																							title: 'Meeting: ' + meeting__id.MEETING_EVENT,
																							closable: true,
																							id: __id,
																							xtype: 'panel',
																				            layout: 'border',
																				            autoScroll: true,
																				            border: false,
																				            items:[{
																				            	title: 'Meeting Contacts',
																				                border: false,
																				                region:'north',
																				                xtype: 'gridpanel',
																				                id:'meeting-contact-list-' + id,
																				                store:storeCON,
																				                //store:storeCO,
																				                autoScroll:true,
																				                minHeight: 200,
																				                maxWidth: Ext.getBody().getViewSize().width,
																				                columns:[{
																				                	text:'Company name',
																				                    dataIndex:'COMPANY_NAME',
																				                    width:200,
																				                    flex: 1
																				                },{
																				                	text:'Name',
																				                    dataIndex:'NAME',
																				                    width:200,
																				                    flex: 1
																				                },{
																				                	text:'Email',
																				                    dataIndex:'EMAIL',
																				                    width:200
																				                },{
																				                    text:'Position',
																				                    dataIndex:'POSITION',
																				                    width:200
																				                }]
																				            },{
																				            	title:'ITM Participants',
																				            	border:false,
																				            	region:'north',
																				            	xtype:'gridpanel',
																				                store:storeMP,
																				                id:'meetingparticipant-list-'+id,
																				            	autoScroll:true,
																				            	minHeight:200,
																				            	maxWidth: Ext.getBody().getViewSize().width,
																				                columns:[{
																				                    text: 'Name',
																				                    dataIndex:'NAME_PART',
																				                    width:200,
																				                    flex: 1
																				                },{
																				                    text:'Email',
																				                    dataIndex:'EMAIL_PART',
																				                    width:200,
																				                    flex: 1
																				                },{
																				                	text: 'Position',
																				                	dataIndex: 'POSITION_PART',
																				                	width: 200,
																				                	align: 'center'
																				                }]
																				            },{
																				            	title:'Meeting Documents',
																				            	border:false,
																				            	region:'north',
																				            	xtype:'gridpanel',
																				                id: 'meetingdocumentation-list-' + id,
																				                store:storeMD,
																				            	autoScroll:true,
																				            	minHeight:200,
																				            	maxWidth: Ext.getBody().getViewSize().width,
																				            	tbar:[{
																				            		xtype:'button',
																				            		text:'Downloads Documents',
																				            		iconCls:'icon-download',
																				            		listeners:{
																				            			click:function(){
																				                            var  md= Ext.getCmp('meetingdocumentation-list-'+id);
																				                            var md_selected = md.getSelectionModel().getSelection();
																				                            if(md_selected.length > 0) {
																				                                var md_data=md_selected[0].data;
																				                                document.location = sd.baseUrl + '/meetingdocumentation/request/download/id/' + md_data.MEETING_DOCUMENTATION_ID;
																				                                var store = loadStore('Meetingdocumentations');
																				                                setTimeout(function(){
																				                                   store.load({
																				                                            params: {
																				                                            id: meeting__id.MEETING_ACTIVITIE_ID
																				                                        }
																				                                    });
																				                                },800);
																				                            } else {
																				                                Ext.Msg.alert('Message', 'You did not select any File Documents');
																				                            }
																				            			}
																				            		}
																				            	}],
																				            	columns:[{
																				            		text:'Documents Title',
																				                    dataIndex:'DOCUMENTATION_TITLE',
																				                    width:200,
																				                    flex: 1
																				            	},{
																				                    text:'File Name',
																				                    dataIndex:'FILE_NAME',
																				            		width:300
																				            	},{
																				                    text:'Upload Date',
																				                    dataIndex:'CREATED_DATE',
																				                    width:200
																				                }]
																				            },{
																				                region: 'north',
																				                title: 'Meeting Notes',
																				                //store:storeMA,
																				                border: false,
																				                maxWidth: Ext.getBody().getViewSize().width,
																				                items: [{
																				                    xtype: 'form',
																				                    layout: 'form',
																				                    border: false,
																				                    bodyPadding: '5 5 5 5',
																				                    id: 'meeting-detail-notes-form-' + id,
																				                    items: [{
																				                        xtype: 'displayfield',
																				                        value: meeting__id.NOTES,
																				                        emptyText:'Notes is null',
																				                        minHeight: 100
																				                        //allowBlank: false
																				                    }]
																				                }]
																				            }]
																						});
																						
																					}
																					c.setActiveTab(__id);
																				} else {
																					Ext.Msg.alert('Message', 'You did not select any Meetings.');
																				}
																			}
																		}
																	}]
																}]
															}]
														});
														var p = Ext.getCmp(_id + '-panel');
														c.setActiveTab(_id);
														p.setTitle(_data[_idx].data.COMPANY_NAME);
												    }
												}
											}]
										});
									}
									c.setActiveTab('investors-search-result-' + xyz);
								}
								closeLoadingWindow();
							}
						});
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
		}],
		items: [{
			region: 'west',
			border: false,
			width: '50%',
			items: [{
				xtype: 'form',
				layout: 'form',
				border: false,
				id: 'search-investor-form-left',
				bodyPadding: '5 5 5 5',
				defaultType: 'combobox',
				items: [{
					fieldLabel: 'Company Name',
					emptyText: 'All',
					store: _storeInvestors,
	                displayField: 'COMPANY_NAME',
	                typeAhead: true,
					name: 'COMPANY_NAME',
					allowBlank: true,
					pageSize: 10,
					minChar: 3
				},{
					fieldLabel: 'Contact Person',
					emptyText: 'All',
					store: Ext.data.StoreManager.lookup('Contacts'),
	                displayField: 'NAME',
	                typeAhead: true,
					name: 'CONTACT_PERSON',
					allowBlank: true,
					pageSize: 10,
					minChar: 3
				},{
					fieldLabel: 'Equity Assets',
					emptyText: 'All',
					store: new Ext.data.ArrayStore({fields:['EA'],data:[['All'],['Small'],['Medium'],['Large']]}),
	                displayField: 'EA',
	                value: 'All',
	                typeAhead: true,
	                editable: false,
					name: 'EQUITY_ASSETS',
					allowBlank: false
				}]
			}]
		},{
			region: 'east',
			border: false,
			width: '50%',
			items: [{
				xtype: 'form',
				layout: 'form',
				border: false,
				id: 'search-investor-form-right',
				bodyPadding: '5 5 5 5',
				defaultType: 'combobox',
				items: [{
					fieldLabel: 'Investor Type',
					emptyText: 'All',
					store: Ext.data.StoreManager.lookup('InvestorTypes'),
	                displayField: 'INVESTOR_TYPE',
	                valueField:'INVESTOR_TYPE',
	                typeAhead: true,
					name: 'INVESTOR_TYPE',
					allowBlank: true,
					editable: false,
					pageSize: 10
				},{
					fieldLabel: 'Location',
					emptyText: 'All',
					store: Ext.data.StoreManager.lookup('Locations'),
	                displayField: 'LOCATION',
	                valueField:'LOCATION',
	                typeAhead: true,
					name: 'LOCATION',
					allowBlank: true,
					editable: false,
					pageSize: 10
				},{
					fieldLabel: 'Format',
					emptyText: 'List',
					name: 'FORMAT',
					store: new Ext.data.ArrayStore({fields:['FR'],data:[['List'],['Detail']]}),
					allowBlank: false,
					value: 'List',
					displayField: 'FR',
					editable: false
				}]
			}]
		}]
	}).show();
}