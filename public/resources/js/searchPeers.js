function showPeerSearch() {
	showLoadingWindow();
	Ext.Ajax.request({
		url: sd.baseUrl + '/peers/executive/get-list-peers',
		success: function(data) {
			var json = Ext.decode(data.responseText);
			var peerStore = Ext.create("Ext.data.Store", {
				model: "Peer",
				storeId: "Peers",
				proxy:{"type":"ajax","api":{"read":"\/peers\/executive\/get-list-peers","create":"\/peers\/request\/create","update":"\/peers\/request\/update","destroy":"\/peers\/request\/destroy"},"actionMethods":{"create":"POST","destroy":"POST","read":"POST","update":"POST"},"reader":{"idProperty":"PEER_ID","type":"json","root":"data.items","totalProperty":"data.totalCount"},"writer":{"type":"json","root":"data","writeAllFields":true}},
				sorter: {"property":"PEER_ID","direction":"ASC"}});
			
			var storeSP = Ext.create('Ext.data.Store',{
			    storeId: 'Peers2',
			    model: 'Peer',
			    proxy: {
			        type: 'ajax',
			        api: {
			            read: '/peers/request/autocom'
			        },
			        actionMethods: {
			            create: 'POST'
			        },
			        reader: {
			            idProperty: 'PEER_NAME',
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
			        property: 'PEER_ID',
			        direction: 'ASC'
			    },
			    autoSync: true
			});
			
			/* --- */
			Ext.create('Ext.Window', {
				title: 'Search Peers',
				modal: true,
				draggable: false,
				resizable: false,
				id: 'peers-search-main',
				width: 400,
				items: [{
					xtype: 'form',
					layout: 'form',
					id: 'peers-search-form',
					border: false,
					bodyPadding: '5 5 5 5',
					items: [{
						xtype: 'combobox',
						fieldLabel: 'Company',
						store: storeSP,
						minChars: 3,
						name: 'COMPANY',
						displayField: 'PEER_NAME',
						emptyText: 'All'
					}]
				}],
				buttons: [{
					text: 'Search',
					listeners: {
						click: function() {
							showLoadingWindow();
							var f = Ext.getCmp('peers-search-form').getForm();
							peerStore.proxy.extraParams.COMPANY_NAME = f._fields.items[0].value;
							peerStore.proxy.extraParams.TYPE = 'SEARCH';
							this.up().up().close();
							peerStore.load({
								params: {
									COMPANY_NAME: f._fields.items[0].value,
									TYPE: 'SEARCH'
								},
								callback: function() {
									var c = Ext.getCmp('main-content');
									var xyz = Math.random();
									if(!c.items.get('peers-search-result-' + xyz)) {
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
											store: peerStore,
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
											peerStore.pageSize = parseInt(_records[0].get('id'), 10);
											peerStore.loadPage(1);
										}, this);
										
										c.add({
											title: 'Peers Search Result',
											closable: true,
											autoScroll: true,
											id: 'peers-search-result-' + xyz,
											bbar: bbar,
											items: [{
												xtype: 'gridpanel',
												store: peerStore,
												border: false,
												columns: [{
													text: 'Peer Name',
													dataIndex: 'PEER_NAME',
													flex: 1
												},{
													text: 'Created Date',
													align: 'center',
													dataIndex: 'CREATED_DATE',
													width: 150
												},{
													text : 'Modified Date',
													align: 'center',
													dataIndex: 'MODIFIED_DATE',
													width: 150
												}],
												listeners: {
													itemdblclick: function(dv, record, item, index, e) {
														showLoadingWindow();
														Ext.Ajax.request({
															url: sd.baseUrl + '/peers/executive/load-detail',
															params: {
																ID: record.data.PEER_ID
															},
															success: function(d, e) {
																var json = Ext.decode(d.responseText);
																loadPeerDetail(record, json.data);
																closeLoadingWindow();
															},
															failure: function(d, e) {
																var json = Ext.decode(d.responseText);
																closeLoadingWindow();
																Ext.Msg.alert('Error',json.error_message);
															}
														});
													}
												}
											}]
										});
									}
									c.setActiveTab('peers-search-result-' + xyz);
									closeLoadingWindow();
								}
							});
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
			/* 000 */
			
			closeLoadingWindow();
		}
	});
}

function loadPeerDetail(data, detail) {
	var data = data.data;
	var c = Ext.getCmp('main-content');
	var id = 'peers-detail-' + data.PEER_ID;
	
	/* ==================== *
	 * Stripping Ratio Year *
	 * ==================== */

	var colSRY = new Array();
	var fieldSRY = new Array();
	Ext.each(detail.SRY.cols, function(d, i) {
		colSRY[i] = {
			text: d,
			dataIndex: 'VALUE_' + d,
			flex: 1,
			align: 'center',
		}
		fieldSRY[i] = {
			name: 'VALUE_' + d,
			type: 'float'
		}
	});
	
	Ext.define('StrippingRatioYear', {
		extend: 'Ext.data.Model',
		fields: fieldSRY
	});
	var storeSRY = Ext.create("Ext.data.Store",{storeId:"StrippingRatioYears",model:"StrippingRatioYear",proxy:{type:"ajax",api:{read:"/strippingratioyear/request/read",create:"/strippingratioyear/request/create",update:"/strippingratioyear/request/update",destroy:"/strippingratioyear/request/destroy"},actionMethods:{create:"POST",destroy:"POST",read:"POST",update:"POST"},reader:{idProperty:"STRIPPING_RATIO_YEAR_ID",type:"json",root:"data.items",totalProperty:"data.totalCount"},writer:{type:"json",root:"data",writeAllFields:true}},sorter:{property:"STRIPPING_RATIO_YEAR_ID",direction:"ASC"},autoSync:true});
	storeSRY.load({params:{id:data.PEER_ID}});
	
	/* ============================= *
	 * End of : Stripping Ratio Year *
	 * ============================= */
	
	/* =============== *
	 * Stripping Ratio *
	 * =============== */
	
	var colSR = [{
		text: '',
		dataIndex: 'NAME',
		flex: 2
	}];
	var fieldSR = [{
		name: 'NAME',
		type: 'string'
	}];
	Ext.each(detail.SR.cols, function(d, i) {
		colSR[i+1] = {
			text: d,
			dataIndex: 'VALUE_' + d,
			flex: 1,
			align: 'center'
		}
		fieldSR[i+1] = {
			name: 'VALUE_' + d,
			type: 'float'
		}
	});
	Ext.define('StrippingRatio', {
	    extend: 'Ext.data.Model',
	    fields: fieldSR
	});
	var storeSR = Ext.create("Ext.data.Store",{storeId:"StrippingRatios",model:"StrippingRatio",proxy:{type:"ajax",api:{read:"/strippingratio/request/read",create:"/strippingratio/request/create",update:"/strippingratio/request/update",destroy:"/strippingratio/request/destroy"},actionMethods:{create:"POST",destroy:"POST",read:"POST",update:"POST"},reader:{idProperty:"STRIPPING_RATIO_ID",type:"json",root:"data.items",totalProperty:"data.totalCount"},writer:{type:"json",root:"data",writeAllFields:true},extraParams:{id:data.PEER_ID}},sorter:{property:"STRIPPING_RATIO_ID",direction:"ASC"},autoSync:true});
	storeSR.load({params:{id:data.PEER_ID}});
	
	/* ======================== *
	 * End of : Stripping Ratio *
	 * ======================== */
	
	/* ===================== *
	 * Average Selling Price *
	 * ===================== */
	
	var colASP =  [{
		text: '',
		dataIndex: 'NAME',
		flex: 2
	}];
	var fieldASP = [{
		name: 'NAME',
		type: 'string'
	}];
	Ext.each(detail.ASP.cols, function(d, i) {
		colASP[i+1] = {
			text: d,
			dataIndex: 'VALUE_' + d,
			flex: 1,
			align: 'center'
		}
		fieldASP[i+1] = {
			name: 'VALUE_' + d,
			type: 'float'
		}
	});
	Ext.define('SellingPrice', {
	    extend: 'Ext.data.Model',
	    fields: fieldASP
	});
	var storeASP = Ext.create("Ext.data.Store",{storeId:"SellingPrices",model:"SellingPrice",proxy:{type:"ajax",api:{read:"/sellingprice/request/read",create:"/sellingprice/request/create",update:"/sellingprice/request/update",destroy:"/sellingprice/request/destroy"},actionMethods:{create:"POST",destroy:"POST",read:"POST",update:"POST"},reader:{idProperty:"SELLING_PRICE_ID",type:"json",root:"data.items",totalProperty:"data.totalCount"},writer:{type:"json",root:"data",writeAllFields:true},extraParams:{id:data.PEER_ID}},sorter:{property:"SELLING_PRICE_ID",direction:"ASC"},autoSync:true});
	storeASP.load({params:{id:data.PEER_ID}});
	
	/* ============================== *
	 * End of : Average Selling Price *
	 * ============================== */
	
	/* ===================== *
	 * Financial Performance *
	 * ===================== */
	
	var colFP =  [{
		text: '',
		dataIndex: 'NAME',
		flex: 2
	}];
	var fieldFP = [{
		name: 'NAME',
		type: 'string'
	}];
	Ext.each(detail.FP.cols, function(d, i) {
		colFP[i+1] = {
			text: d,
			dataIndex: 'VALUE_' + d,
			flex: 1,
			align: 'center'
		}
		fieldFP[i+1] = {
			name: 'VALUE_' + d,
			type: 'float'
		}
	});
	
	Ext.define('FinancialPerformance', {
	    extend: 'Ext.data.Model',
	    fields: fieldFP
	});
	
	var storeFP=Ext.create("Ext.data.Store",{storeId:"FinancialPerformances",model:"FinancialPerformance",proxy:{type:"ajax",api:{read:"/financialperform/request/read",create:"/financialperform/request/create",update:"/financialperform/request/update",destroy:"/financialperform/request/destroy"},actionMethods:{create:"POST",destroy:"POST",read:"POST",update:"POST"},reader:{idProperty:"FINANCIAL_PERFORM_ID",type:"json",root:"data.items",totalProperty:"data.totalCount"},writer:{type:"json",root:"data",writeAllFields:true},extraParams:{id:data.PEER_ID}},sorter:{property:"FINANCIAL_PERFORM_ID",direction:"ASC"},autoSync:true});
	storeFP.load({params:{id:data.PEER_ID}});
	
	/* ============================== *
	 * End of : Financial Performance *
	 * ============================== */
	
	/* =================== *
	 * Composition Company *
	 * =================== */
	
	var colCSY =  [{
		text: 'Ownership',
		dataIndex: 'NAME',
		flex: 2
	}];
	var fieldCSY = [{
		name: 'NAME',
		type: 'string'
	}];
	Ext.each(detail.CSY.cols, function(d, i) {
		colCSY[i+1] = {
			text: d,
			align: 'center',
			flex: 1,
			columns: [{
				text: 'Value',
				width: 90,
				dataIndex: 'VALUE_' + d,
				align: 'center',
				flex: 1
			},{
				text: 'Percentage',
				width: 90,
				dataIndex: 'PERCENTAGE_' + d,
				align: 'center',
				flex: 1
			}]
		}
		fieldCSY[fieldCSY.length] = {
			name: 'VALUE_' + d,
			type: 'float'
		}
		fieldCSY[fieldCSY.length] = {
			name: 'PERCENTAGE_' + d,
			type: 'float'
		}
	});
	fieldCSY[fieldCSY.length] = {
		name: 'TITLE',
		type: 'string'
	}
	Ext.define('CompositionCompany', {
		extend: 'Ext.data.Model',
		fields: fieldCSY
	});
	var storeCSY = Ext.create("Ext.data.Store",{storeId:"CompositionCompanys",model:"CompositionCompany",proxy:{type:"ajax",api:{read:"/compositioncompany/request/read",create:"/compositioncompany/request/create",update:"/compositioncompany/request/update",destroy:"/compositioncompany/request/destroy"},actionMethods:{create:"POST",destroy:"POST",read:"POST",update:"POST"},reader:{idProperty:"COMPOSITION_COMPANY_ID",type:"json",root:"data.items",totalProperty:"data.totalCount"},writer:{type:"json",root:"data",writeAllFields:true},extraParams:{id:data.PEER_ID}},sorter:{property:"COMPOSITION_COMPANY_ID",direction:"ASC"},autoSync:true});
	storeCSY.load({params:{id:data.PEER_ID}});
	
	/* ============================ *
	 * End of : Composition Company *
	 * ============================ */

	/* ======================= *
	 * Coal Sales Distribution *
	 * ======================= */
	
	var colCSD = new Array();
	var fieldCSD = new Array();
	Ext.each(detail.CSD.cols, function(d, i) {
		colCSD = [{
			text: d,
			flex: 1,
			dataIndex: 'NAME',
			align: 'center'
		},{
			text: 'Volume',
			align: 'center',
			dataIndex: 'VOLUME'
		},{
			text: 'Percentage',
			align: 'center',
			dataIndex: 'PERCENTAGE'
		}];
		fieldCSD = [{
			name: 'NAME',
			type: 'string'
		},{
			name: 'VOLUME',
			type: 'float'
		},{
			name: 'PERCENTAGE',
			type: 'string'
		},{
			name: 'COUNTRY',
			type: 'string'
		}];
	});
	Ext.define('CoalSalesDistribution', {
	    extend: 'Ext.data.Model',
	    fields: fieldCSD
	});
	var storeCSD = Ext.create("Ext.data.Store",{storeId:"CoalSalesDistributions",model:"CoalSalesDistribution",proxy:{type:"ajax",api:{read:"/coalsales/request/read",create:"/coalsales/request/create",update:"/coalsales/request/update",destroy:"/coalsales/request/destroy"},actionMethods:{create:"POST",destroy:"POST",read:"POST",update:"POST"},reader:{idProperty:"COAL_SALES_DISTRIBUTION_ID",type:"json",root:"data.items",totalProperty:"data.totalCount"},writer:{type:"json",root:"data",writeAllFields:true}},sorter:{property:"COAL_SALES_DISTRIBUTION_ID",direction:"ASC"},autoSync:true});
	storeCSD.load({params:{id:data.PEER_ID}})
	var storeCSD2 = Ext.create("Ext.data.Store",{storeId:"CoalSalesDistributions",model:"CoalSalesDistribution",proxy:{type:"ajax",api:{read:"/coalsales/request/read3",create:"/coalsales/request/create",update:"/coalsales/request/update",destroy:"/coalsales/request/destroy"},actionMethods:{create:"POST",destroy:"POST",read:"POST",update:"POST"},reader:{idProperty:"COAL_SALES_DISTRIBUTION_ID",type:"json",root:"data.items",totalProperty:"data.totalCount"},writer:{type:"json",root:"data",writeAllFields:true}},sorter:{property:"COAL_SALES_DISTRIBUTION_ID",direction:"ASC"},autoSync:true});
	storeCSD2.load({params:{id:data.PEER_ID}});
	/* ================================ *
	 * End of : Coal Sales Distribution *
	 * ================================ */
	
	/* ==================== *
	 * Reserves & Resources *
	 * ==================== */
	
	var storeRR = loadStore('PeerResourceReserves');
	storeRR.load({
	    params: {
	        id: data.PEER_ID
	    }
	});
	
	/* ============================= *
	 * End of : Reserves & Resources *
	 * ============================= */
	
	if(!c.items.get(id)) {
		c.add({
			title: 'Detail: ' + data.PEER_NAME,
			closable: true,
			id: id,
			xtype: 'panel',
			layout: 'border',
			items: [{
				region: 'west',
				title: 'Peers Detail',
				collapsible: true,
				width: '38%',
				autoScroll: true,
				items: [{
					title: 'Brief History',
					bodyPadding: '5 5 5 5',
					autoScroll: true,
					border: false,
					minHeight: 207,
					collapsible: true,
					items: [{
						xtype: 'displayfield',
						value: data.BRIEF_HISTORY
					}]
				},{
					title: 'Business Activity',
					bodyPadding: '5 5 5 5',
					autoScroll: true,
					border: false,
					minHeight: 207,
					collapsible: true,
					items: [{
						xtype: 'displayfield',
						value: data.BUSINESS_ACTIVITY
					}]
				}]
			},{
				region: 'center',
				title: 'Peers Data',
				autoScroll: true,
				items: [{
					title: 'Stripping Ratio',
					border: false,
					collapsible: true,
					items: [{
						xtype: 'gridpanel',
						border: false,
						minHeight: 44,
						columns: colSRY,
						store: storeSRY
					},{
						xtype: 'gridpanel',
						border: false,
						minHeight: 44,
						columns: colSR,
						store: storeSR
					}]
				},{
					title: 'Average Selling Price',
					collapsible: true,
					border: false,
					items: [{
						xtype: 'gridpanel',
						border: false,
						minHeight: 44,
						columns: colASP,
						store: storeASP
					}]
				},{
					title: 'Financial Performance',
					collapsible: true,
					border: false,
					items: [{
						xtype: 'gridpanel',
						border: false,
						minHeight: 44,
						columns: colFP,
						store: storeFP
					}]
				},{
					title: 'Total Cash Cost (FOB)',
					collapsible: true,
					border: false
				},{
					title: 'Reserves & Resources',
					collapsible: true,
					border: false,
					items: [{
						xtype: 'gridpanel',
						border: false,
						minHeight: 44,
						store: storeRR,
						columns: [{
	                        flex: 1,
	                        text: 'Mine',
	                        align: 'center',
	                        dataIndex: 'MINE'
	                    },{
	                        flex: 1,
	                        text: 'Resources <br /> (Mil. Tons)',
	                        align: 'center',
	                        dataIndex: 'RESOURCES'
	                    },{
	                        flex: 1,
	                        text: 'Reserves <br /> (Mil. Tons)',
	                        align: 'center',
	                        dataIndex: 'RESERVES'
	                    },{
	                        flex: 1,
	                        text: 'Area (Ha)',
	                        align: 'center',
	                        dataIndex: 'AREA'
	                    },{
	                        flex: 1,
	                        text: 'CV (Kcal)',
	                        align: 'center',
	                        dataIndex: 'CV'
	                    },{
	                        flex: 1,
	                        text: 'Location',
	                        align: 'center',
	                        dataIndex: 'LOCATION'
	                    },{
	                        flex: 1,
	                        text: 'License',
	                        align: 'center',
	                        dataIndex: 'LICENSE'
	                    }]
					}]
				},{
					title: 'Composition of the Company`s Shareholders at the End of The Year',
					collapsible: true,
					border: false,
					items: [{
						xtype: 'gridpanel',
						border: false,
						minHeight: 44,
						columns: colCSY,
						store: storeCSY
					}]
				},{
					title: 'Coal Sales Distribution',
					collapsible: true,
					border: false,
					items: [{
						xtype: 'gridpanel',
						border: false,
						minHeight: 44,
						columns: colCSD,
						store: storeCSD
					}]
				},{
					title: 'Coal Sales Distribution by Country',
					collapsible: true,
					border: false,
					items: [{
						xtype: 'gridpanel',
						border: false,
						minHeight: 44,
						store: storeCSD2,
						columns: [{
							text: 'Country',
							flex: 3,
							dataIndex: 'COUNTRY',
						},{
							text: 'Percentage',
							flex: 1,
							dataIndex: 'PERCENTAGE',
							align: 'center'
						}]
					}]
				}]
			}]
		});
	}
	c.setActiveTab(id);
}
