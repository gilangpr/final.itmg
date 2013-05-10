/* Models : */

	/* Stripping Ratio Year */
	Ext.define('StrippingRatioYear', {
		extend: 'Ext.data.Model',
		fields: [{
			name: 'STRIPPING_RATIO_YEAR_ID',
			type: 'int'
		},{
			name: 'TITLE',
			type: 'string'
		},{
			name: 'VALUE',
			type: 'float'
		}]
	});
	/* End of : Stripping Ratio Year */

	/* Stripping Ratio */
	Ext.define('StrippingRatio', {
		extend: 'Ext.data.Model',
		fields: [{
			name: 'STRIPPING_RATIO_ID',
			type: 'int'
		},{
			name: 'TITLE',
			type: 'string'
		},{
			name: 'SALES_VOLUME',
			type: 'float'
		},{
			name: 'PRODUCTION_VOLUME',
			type: 'float'
		},{
			name: 'COAL_TRANSPORT',
			type: 'float'
		}]
	});
	/* End of : Stripping Ratio */

	/* Average Selling Price */
	Ext.define('SellingPrice', {
		extend: 'Ext.data.Model',
		fields: [{
			name: 'SELLING_PRICE_ID',
			type: 'int'
		},{
			name: 'TITLE',
			type: 'string'
		},{
			name: 'TYPE',
			type: 'string'
		},{
			name: 'VALUE_IDR',
			type: 'float'
		},{
			name: 'VALUE_USD',
			type: 'float'
		}]
	});
	/* End of : Average Selling Price */

	/* Financial Performance */
	Ext.define('FinancialPerformance', {
		extend: 'Ext.data.Model',
		fields: [{
			name: 'FINANCIAL_PERFORM_ID',
			type: 'int'
		},{
			name: 'TITLE',
			type: 'string'
		},{
			name: 'REVENUE',
			type: 'float'
		},{
			name: 'GROSS_PROFIT',
			type: 'float'
		},{
			name: 'EBIT',
			type: 'float'
		},{
			name: 'EBITDA',
			type: 'float'
		},{
			name: 'NET_PROFIT',
			type: 'float'
		},{
			name: 'TOTAL_ASSETS',
			type: 'float'
		},{
			name: 'CASH',
			type: 'float'
		},{
			name: 'GROSS_PROFIT_MARGIN',
			type: 'float'
		},{
			name: 'EBIT_MARGIN',
			type: 'float'
		},{
			name: 'NET_PROFIT_MARGIN',
			type: 'float'
		},{
			name: 'RETURN_ASSET',
			type: 'float'
		},{
			name: 'RETURN_EQUITY',
			type: 'float'
		},{
			name: 'RETURN_INVESTMENT',
			type: 'float'
		}]
	});
	/* End of : Financial Performance */

	/* Total Cash Cost */
	Ext.define('TotalCashCost', {
		extend: 'Ext.data.Model',
		fields: [{
			name: 'TOTAL_CASHCOST_ID',
			type: 'int'
		},{
			name: 'TITLE',
			type: 'string'
		},{
			name: 'ROYALTY_IDR',
			type: 'float'
		},{
			name: 'ROYALTY_USD',
			type: 'float'
		},{
			name: 'TOTAL_IDR',
			type: 'float'
		},{
			name: 'TOTAL_USD',
			type: 'float'
		},{
			name: 'CURRENCY',
			type: 'float'
		}]
	});
	/* End of : Total Cash Cost */

	/* Composition Company */
	Ext.define('CompositionCompany', {
		extend: 'Ext.data.Model',
		fields: [{
			name: 'COMPOSITION_COMPANY_ID',
			type: 'int'
		},{
			name: 'TITLE',
			type: 'string'
		},{
			name: 'REPUBLIC_OF_INDONESIA',
			type: 'float'
		},{
			name: 'DOMESTIC_INVESTOR',
			type: 'float'
		},{
			name: 'FOREIGN_INVESTOR',
			type: 'float'
		}]
	});
	/* End of : Composition Company */

	/* Coal Sales Distribution */
	Ext.define('CoalSalesDistribution', {
		extend: 'Ext.data.Model',
		fields: [{
			name: 'COAL_SALES_DISTRIBUTION_ID',
			type: 'int'
		},{
			name: 'TITLE',
			type: 'string'
		},{
			name: 'TYPE',
			type: 'string'
		},{
			name: 'COUNTRY',
			type: 'string'
		},{
			name: 'VOLUME',
			type: 'float'
		}]
	});
	/* End of : Coal Sales Distribution */

/* End of : Models */