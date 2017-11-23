sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function() {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		fetchCustomerDetails:function(vComponent) {
			var data={results:[
				{CustomerName:"Joey",Number:"+91 8878787879"},
				{CustomerName:"Ross",Number:"+91 8878787880"},
				{CustomerName:"Chandler",Number:"+91 8878787877"},
				{CustomerName:"Racheal",Number:"+91 8878787876"},
				{CustomerName:"Monical",Number:"+91 8878787875"}
				
				]};
			vComponent.setModel(new JSONModel(data), "custCallModel");
		}

	};
});