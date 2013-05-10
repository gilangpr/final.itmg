var storeRR = loadStore('PeerResourceReserves');
storeRR.load({
    params: {
        id: data.PEER_ID
    }
});
var showSummary = true;

//Model Financial Performances
Ext.define('FinancialPerformance', {
    extend: 'Ext.data.Model',
    fields: fpFields
});
//Store Financial Performances
var storeFP = Ext.create('Ext.data.Store',{
    storeId: 'FinancialPerformances',
    model: 'FinancialPerformance',
    proxy: {
        type: 'ajax',
        api: {
            read: '/financialperform/request/read',
            create: '/financialperform/request/create',
            update: '/financialperform/request/update',
            destroy: '/financialperform/request/destroy'
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
storeFP.load({
    params: {
        id: data.PEER_ID
    }
});

//Model Financial Performances 2
Ext.define('FinancialPerformance', {
    extend: 'Ext.data.Model',
    fields: fpFields
});
//Store Financial Performances 2
var storeFP2 = Ext.create('Ext.data.Store',{
    storeId: 'FinancialPerformances',
    model: 'FinancialPerformance',
    proxy: {
        type: 'ajax',
        api: {
            read: '/financialperform/request/read',
            create: '/financialperform/request/create',
            update: '/financialperform/request/update',
            destroy: '/financialperform/request/destroy'
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
storeFP2.load({
    params: {
        id: data.PEER_ID
    }
});

//Model Coal Sales Distribution
Ext.define('CoalSalesDistribution', {
    extend: 'Ext.data.Model',
    fields: csdFields
});
//Store Coal Sales Distribution
var storeCSD = Ext.create('Ext.data.Store',{
    storeId: 'CoalSalesDistributions',
    model: 'CoalSalesDistribution',
    proxy: {
        type: 'ajax',
        api: {
            read: '/coalsales/request/read',
            create: '/coalsales/request/create',
            update: '/coalsales/request/update',
            destroy: '/coalsales/request/destroy'
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
        }
    },
    sorter: {
        property: 'COAL_SALES_DISTRIBUTION_ID',
        direction: 'ASC'
    },
    autoSync: true
});
storeCSD.load({
    params: {
        id: data.PEER_ID
    }
});
//Model Stripping Ratio
Ext.define('StrippingRatio', {
    extend: 'Ext.data.Model',
    fields: srFields
});
//Store Stripping Ratio
var storeSR = Ext.create('Ext.data.Store',{
    storeId: 'StrippingRatios',
    model: 'StrippingRatio',
    proxy: {
        type: 'ajax',
        api: {
            read: '/strippingratio/request/read',
            create: '/strippingratio/request/create',
            update: '/strippingratio/request/update',
            destroy: '/strippingratio/request/destroy'
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
storeSR.load({
    params: {
    	 id: data.PEER_ID
    }
});
//Model Stripping Ratio By Year
Ext.define('StrippingRatioYear', {
    extend: 'Ext.data.Model',
    fields: sryFields
});
//Store Stripping Ratio By Year
var storeSRY = Ext.create('Ext.data.Store',{
    storeId: 'StrippingRatioYears',
    model: 'StrippingRatioYear',
    proxy: {
        type: 'ajax',
        api: {
            read: '/strippingratioyear/request/read2',
            create: '/strippingratioyear/request/create',
            update: '/strippingratioyear/request/update',
            destroy: '/strippingratioyear/request/destroy'
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
        }
    },
    sorter: {
        property: 'STRIPPING_RATIO_YEAR_ID',
        direction: 'ASC'
    },
    autoSync: true
});
storeSRY.load({
    params: {
        id: data.PEER_ID
    }
});
//Model Selling Price
 Ext.define('SellingPrice', {
    extend: 'Ext.data.Model',
    fields: aspFields
});
//Store Selling Price
var storeASP = Ext.create('Ext.data.Store',{
    storeId: 'SellingPrices',
    model: 'SellingPrice',
    proxy: {
        type: 'ajax',
        api: {
            read: '/sellingprice/request/read',
            create: '/sellingprice/request/create',
            update: '/sellingprice/request/update',
            destroy: '/sellingprice/request/destroy'
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
storeASP.load({
    params: {
        id: data.PEER_ID
    }
});

//Model Composition Company
Ext.define('CompositionCompany', {
	extend: 'Ext.data.Model',
	fields: csyFields
});
//Store Composition Company
var storeCSY = Ext.create('Ext.data.Store',{
    storeId: 'CompositionCompanys',
    model: 'CompositionCompany',
    proxy: {
        type: 'ajax',
        api: {
            read	: '/compositioncompany/request/read',
            create	: '/compositioncompany/request/create',
            update	: '/compositioncompany/request/update',
            destroy	: '/compositioncompany/request/destroy'
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
storeCSY.load({
    params: {
        id: data.PEER_ID
    }
});

//Model Total Cash Cost
Ext.define('TotalCashCost', {
	extend: 'Ext.data.Model',
	fields: fobFields
});
//Store Total Cash Cost
var storeFOB = Ext.create('Ext.data.Store',{
    storeId: 'TotalCashCosts',
    model: 'TotalCashCost',
    proxy: {
        type: 'ajax',
        api: {
            read	: '/totalcashcost/request/read',
            create	: '/totalcashcost/request/create',
            update	: '/totalcashcost/request/update',
            destroy	: '/totalcashcost/request/destroy'
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
storeFOB.load({
    params: {
        id: data.PEER_ID
    }
});

//MODEL COAL SALES DISTRIBUTION BY COUNTRY
Ext.define('CoalSalesDistributionCountry', {
	extend: 'Ext.data.Model',
	fields: csd_bcFields
});
//STORE COAL SALES DISTRIBUTION BY COUNTRY
var storeCSD_BC = Ext.create('Ext.data.Store',{
    storeId: 'CoalSalesDistributionCountrys',
    model: 'CoalSalesDistributionCountry',
    proxy: {
        type: 'ajax',
        api: {
            read	: '/coalsales/request/read3',
            create	: '/coalsales/request/create',
            update	: '/coalsales/request/update',
            destroy	: '/coalsales/request/destroy'
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
        }
    },
    sorter: {
        property: 'COAL_SALES_DISTRIBUTION_ID',
        direction: 'ASC'
    },
    autoSync: true
});
storeCSD_BC.load({
    params: {
        id: data.PEER_ID
    }
});