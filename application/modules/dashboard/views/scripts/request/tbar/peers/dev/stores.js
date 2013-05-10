/* Stores : */
	
	/* Stripping Ratio Year */
	var storeSRY = Ext.create('Ext.data.Store',{
	    storeId: 'StrippingRatioYears',
	    model: 'StrippingRatioYear',
	    proxy: {
	        type: 'ajax',
	        api: {
	            read: '/strippingratioyear/request/read-dev',
	            create: '/strippingratioyear/request/create-dev',
	            update: '/strippingratioyear/request/update-dev',
	            destroy: '/strippingratioyear/request/destroy-dev'
	        },
	        actionMethods: {
	            create: 'POST',
	            destroy: 'POST',
	            read: 'POST',
	            update: 'POST'
	        },
	        reader: {
	            idProperty: 'STRIPPING_RATIO_YEAR_ID',
	            type: 'json',
	            root: 'data.items',
	            totalProperty: 'data.totalCount'
	        },
	        writer: {
	            type: 'json',
	            root: 'data',
	            writeAllFields: true
	        },
	        extraParams: {
	        	id: data.PEER_ID
	        }
	    },
	    sorter: {
	        property: 'STRIPPING_RATIO_YEAR_ID',
	        direction: 'ASC'
	    },
	    autoSync: true
	});
	storeSRY.load();
	/* End of : Stripping Ratio Year */

	/* Stripping Ratio */
	var storeSR = Ext.create('Ext.data.Store',{
	    storeId: 'StrippingRatios',
	    model: 'StrippingRatio',
	    proxy: {
	        type: 'ajax',
	        api: {
	            read: '/strippingratio/request/read-dev',
	            create: '/strippingratio/request/create-dev',
	            update: '/strippingratio/request/update-dev',
	            destroy: '/strippingratio/request/destroy-dev'
	        },
	        actionMethods: {
	            create: 'POST',
	            destroy: 'POST',
	            read: 'POST',
	            update: 'POST'
	        },
	        reader: {
	            idProperty: 'STRIPPING_RATIO_ID',
	            type: 'json',
	            root: 'data.items',
	            totalProperty: 'data.totalCount'
	        },
	        writer: {
	            type: 'json',
	            root: 'data',
	            writeAllFields: true
	        },
	        extraParams: {
	        	id: data.PEER_ID
	        }
	    },
	    sorter: {
	        property: 'STRIPPING_RATIO_ID',
	        direction: 'ASC'
	    },
	    autoSync: true
	});
	storeSR.load();
	/* End of : Stripping Ratio */

	/* Average Selling Price */
	var storeASP = Ext.create('Ext.data.Store',{
	    storeId: 'SellingPrices',
	    model: 'SellingPrice',
	    proxy: {
	        type: 'ajax',
	        api: {
	            read: '/sellingprice/request/read-dev',
	            create: '/sellingprice/request/create-dev',
	            update: '/sellingprice/request/update-dev',
	            destroy: '/sellingprice/request/destroy-dev'
	        },
	        actionMethods: {
	            create: 'POST',
	            destroy: 'POST',
	            read: 'POST',
	            update: 'POST'
	        },
	        reader: {
	            idProperty: 'SELLING_PRICE_ID',
	            type: 'json',
	            root: 'data.items',
	            totalProperty: 'data.totalCount'
	        },
	        writer: {
	            type: 'json',
	            root: 'data',
	            writeAllFields: true
	        },
	        extraParams: {
	        	id: data.PEER_ID
	        }
	    },
	    sorter: {
	        property: 'SELLING_PRICE_ID',
	        direction: 'ASC'
	    },
	    autoSync: true
	});
	storeASP.load();
	/* End of : Average Selling Price */

	/* Financial Performance */
	var storeFP = Ext.create('Ext.data.Store',{
	    storeId: 'FinancialPerformances',
	    model: 'FinancialPerformance',
	    proxy: {
	        type: 'ajax',
	        api: {
	            read: '/financialperform/request/read-dev',
	            create: '/financialperform/request/create-dev',
	            update: '/financialperform/request/update-dev',
	            destroy: '/financialperform/request/destroy-dev'
	        },
	        actionMethods: {
	            create: 'POST',
	            destroy: 'POST',
	            read: 'POST',
	            update: 'POST'
	        },
	        reader: {
	            idProperty: 'FINANCIAL_PERFORM_ID',
	            type: 'json',
	            root: 'data.items',
	            totalProperty: 'data.totalCount'
	        },
	        writer: {
	            type: 'json',
	            root: 'data',
	            writeAllFields: true
	        },
	        extraParams: {
	        	id: data.PEER_ID
	        }
	    },
	    sorter: {
	        property: 'FINANCIAL_PERFORM_ID',
	        direction: 'ASC'
	    },
	    autoSync: true
	});
	storeFP.load();
	/* End of : Financial Performance */

	/* Total Cash Cost */
	var storeFOB = Ext.create('Ext.data.Store',{
	    storeId: 'TotalCashCosts',
	    model: 'TotalCashCost',
	    proxy: {
	        type: 'ajax',
	        api: {
	            read	: '/totalcashcost/request/read-dev',
	            create	: '/totalcashcost/request/create-dev',
	            update	: '/totalcashcost/request/update-dev',
	            destroy	: '/totalcashcost/request/destroy-dev'
	        },
	        actionMethods: {
	            create: 'POST',
	            destroy: 'POST',
	            read: 'POST',
	            update: 'POST'
	        },
	        reader: {
	            idProperty: 'TOTAL_CASHCOST_ID',
	            type: 'json',
	            root: 'data.items',
	            totalProperty: 'data.totalCount'
	        },
	        writer: {
	            type: 'json',
	            root: 'data',
	            writeAllFields: true
	        },
	        extraParams: {
	        	id: data.PEER_ID
	        }
	    },
	    sorter: {
	        property: 'TOTAL_CASHCOST_ID',
	        direction: 'ASC'
	    },
	    autoSync: true
	});
	storeFOB.load();
	/* End of : Total Cash Cost */

	/* Reserves & Resources */
	var storeRR = Ext.create("Ext.data.Store", {
		model: "PeerResourceReserve",
		storeId: "PeerResourceReserves",
		proxy:{
			extraParams: {
				id: data.PEER_ID
			},
			"type":"ajax","api":{"read":"\/peerrs\/request\/read","create":"\/peerrs\/request\/create","update":"\/peerrs\/request\/update","destroy":"\/peerrs\/request\/destroy"},"actionMethods":{"create":"POST","destroy":"POST","read":"POST","update":"POST"},"reader":{"idProperty":"RESERVES_RESOURCES_ID","type":"json","root":"data.items","totalProperty":"data.totalCount"},"writer":{"type":"json","root":"data","writeAllFields":true}},
		sorter: {"property":"RESERVES_RESOURCES_ID","direction":"ASC"},
		autoSync: true
	});
	storeRR.load();
	/* End of : Reserves & Resources */

	/* Composition Company */
	var storeCSY = Ext.create('Ext.data.Store',{
	    storeId: 'CompositionCompanys',
	    model: 'CompositionCompany',
	    proxy: {
	        type: 'ajax',
	        api: {
	            read	: '/compositioncompany/request/read-dev',
	            create	: '/compositioncompany/request/create-dev',
	            update	: '/compositioncompany/request/update-dev',
	            destroy	: '/compositioncompany/request/destroy-dev'
	        },
	        actionMethods: {
	            create: 'POST',
	            destroy: 'POST',
	            read: 'POST',
	            update: 'POST'
	        },
	        reader: {
	            idProperty: 'COMPOSITION_COMPANY_ID',
	            type: 'json',
	            root: 'data.items',
	            totalProperty: 'data.totalCount'
	        },
	        writer: {
	            type: 'json',
	            root: 'data',
	            writeAllFields: true
	        },
	        extraParams: {
	        	id: data.PEER_ID
	        }
	    },
	    sorter: {
	        property: 'COMPOSITION_COMPANY_ID',
	        direction: 'ASC'
	    },
	    autoSync: true
	});
	storeCSY.load();
	/* End of : Composition Company */

	/* Coal Sales Distribution */
	var storeCSD = Ext.create('Ext.data.Store',{
	    storeId: 'CoalSalesDistributions',
	    model: 'CoalSalesDistribution',
	    proxy: {
	        type: 'ajax',
	        api: {
	            read: '/coalsales/request/read-dev',
	            create: '/coalsales/request/create-dev',
	            update: '/coalsales/request/update-dev',
	            destroy: '/coalsales/request/destroy-dev'
	        },
	        actionMethods: {
	            create: 'POST',
	            destroy: 'POST',
	            read: 'POST',
	            update: 'POST'
	        },
	        reader: {
	            idProperty: 'COAL_SALES_DISTRIBUTION_ID',
	            type: 'json',
	            root: 'data.items',
	            totalProperty: 'data.totalCount'
	        },
	        writer: {
	            type: 'json',
	            root: 'data',
	            writeAllFields: true
	        },
	        extraParams: {
	        	id: data.PEER_ID
	        }
	    },
	    sorter: {
	        property: 'COAL_SALES_DISTRIBUTION_ID',
	        direction: 'ASC'
	    },
	    autoSync: true
	});
	storeCSD.load();
	/* End of : Coal Sales Distribution */

/* End of : Stores */