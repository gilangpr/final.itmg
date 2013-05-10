var c = Ext.getCmp('<?php echo $this->container ?>');
var id = 'investors-add-investor-form';

if(!c.up().items.get(id)) {
	
	Ext.define('InvestorType', {//model
		extend: 'Ext.data.Model',
		fields: [{
			name: 'INVESTOR_TYPE_ID',
			type: 'string'
		}]
	});
	
	c.up().add({
		title: 'Add New Investor',
		id: id,
		closable: true,
		autoScroll: true,
		tbar: [{
			xtype: 'button',
			text: 'Save',
			iconCls: 'icon-accept',
			listeners: {
				click: function() {
					var form = Ext.getCmp('add-new-investor-form').getForm();
					if(form.isValid()) {
						form.submit({
							url: sd.baseUrl + '/investors/request/create',
							success: function(data) {
								var json = Ext.decode(data.responseText);
								form.reset();
								store.loadPage(1); // Refresh grid data
								Ext.Msg.alert('Success', 'Data has been saved');
							},
							failure: function(data) {
								var json = Ext.decode(data.responseText);
								Ext.Msg.alert('Error', json.error_message);
							}
						})
					} else {
						Ext.Msg.alert('Error', 'Please complete mandatory field first.');
					}
				}
			}
		},{
			xtype: 'button',
			text: 'Cancel',
			iconCls: 'icon-stop',
			listeners: {
				click: function() {
					this.up().up().close();
				}
			}
		}],
		items: [{
			xtype: 'panel',
			border: false,
			items: [{
				xtype: 'form',
				layout: 'form',
				border: false,
				bodyPadding: '5 5 5 5',
				id: 'add-new-investor-form',
				defaultType: 'textfield',
				items: [{
					fieldLabel: 'Company Name <span style="color:red;">*</span>',
					name: 'COMPANY_NAME',
					allowBlank: false
				},{
					fieldLabel: 'Equity Asset <span style="color:red;">*</span>',
					name: 'EQUITY_ASSETS',
					xtype: 'numberfield',
					minValue: 0,
					allowBlank: false
				},{
					xtype: 'combobox',
					fieldLabel: 'Investor Type <span style="color:red;">*</span>',
					name: 'INVESTOR_TYPE_ID',
					labelWidth: 130,
					store: Ext.data.StoreManager.lookup('InvestorTypes'),
					displayField: 'INVESTOR_TYPE',
					valueField:'INVESTOR_TYPE_ID',
					typeAhead: true,
					allowBlank: false,
					minChars: 2,
					emptyText: 'Select Investor Type',
					pageSize: 10
				},{
					fieldLabel: 'Style <span style="color:red;">*</span>',
					name: 'STYLE',
					allowBlank: false
				},{
					fieldLabel: 'Company Address',
					name: 'ADDRESS',
					xtype: 'htmleditor',
					height: 150
				},{
					xtype: 'combobox',
					fieldLabel: 'Location <span style="color:red;">*</span>',
					name: 'LOCATION_ID',
					labelWidth: 130,
					store: Ext.data.StoreManager.lookup('Locations'),
					displayField: 'LOCATION',
					valueField:'LOCATION_ID',
					typeAhead: true,
					allowBlank: false,
					minChars: 2,
					emptyText: 'Select Location',
					pageSize: 10,
					listeners: {
						blur: function() {
							
						}
					}
				},{
					fieldLabel: 'Phone Number 1 <span style="color:red;">*</span>',
					name: 'PHONE_1',
					allowBlank:false,
					labelWidth: 130
				},{
					fieldLabel: 'Phone Number 2',
					name: 'PHONE_2',
					labelWidth: 130,
				},{
					fieldLabel: 'Fax',
					name: 'FAX'
				},{
					fieldLabel: 'Email 1 <span style="color:red;">*</span>',
					name: 'EMAIL_1',
					vtype:'email',
					allowBlank:false
				},{
					fieldLabel: 'Email 2',
					name: 'EMAIL_2'
				},{
					fieldLabel:'Website',
					name:'WEBSITE'
				},{
					fieldLabel: 'Company Overview',
					name: 'COMPANY_OVERVIEW',
					xtype: 'textarea',
					height: 150,
					msgTarget:'under',
					maxLength:1000
					//plugins:[myplugin]
				},{
					fieldLabel: 'Investment Strategy',
					name: 'INVESTMENT_STRATEGY',
					xtype: 'textarea',
					height: 150,
					msgTarget:'under',
					maxLength:1000
				}]
			}]
		}]
	});
}
c.up().setActiveTab(id);
