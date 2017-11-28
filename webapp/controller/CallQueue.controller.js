sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/Dialog",
	"sap/ui/model/json/JSONModel"
], function(Controller, Dialog, JSONModel) {
	"use strict";

	var workspace;

	var array = [];

	return Controller.extend("com.deloitte.smartservice.SMARTSERVICE.controller.CallQueue", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.deloitte.smartservice.SMARTSERVICE.view.CallQueue
		 */
		onInit: function() {
			var that = this;
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			
			var workspaceToken = this.getOwnerComponent().getModel("workspaceToken");
			workspace = new Twilio.TaskRouter.Workspace(workspaceToken);
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.deloitte.smartservice.SMARTSERVICE.view.CallQueue
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.deloitte.smartservice.SMARTSERVICE.view.CallQueue
		 */
		onAfterRendering: function() {
			var that = this;
			setInterval(function() {
				workspace.tasks.fetch(
					function(error, taskList) {
						if (error) {
							console.log(error.code);
							console.log(error.message);
							return;
						}
						var data = taskList.data;
						array = [];
						for (var i = 0; i < data.length; i++) {
							array.push(data[i].attributes);
						}
						that.onPatternMatch();
					}
				);
			}, 3000);
		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.deloitte.smartservice.SMARTSERVICE.view.CallQueue
		 */
		//	onExit: function() {
		//
		//	}
		onPatternMatch: function(oEvent) {
			//if (oEvent.getParameter("name") === "CallQueue") {
			var oModel = new JSONModel({
				openIssues: [{
					custName: "Micheal",
					incNo: "+91 8787876212",
					custValue: "10"
				}]
			});

			var arr = [];

			for (var i = 0; i < array.length; i++) {

				var items = {
					custName: "Kaushik",
					callId: array[i].worker_call_sid,
					incNo: array[i].from,
					custValue: "High Priority"
				};
				arr.push(items);
			}

			oModel.oData.openIssues = arr;
			//var oModel = new JSONModel(oData);

			this.getOwnerComponent().setModel(oModel, "callQueueModel");
			this.getOwnerComponent().getModel("callQueueModel").refresh();
			//}
		},

		onGetRecording: function(oEvent) {
			var that = this;

			var recordID = "";

			var obj = oEvent.getSource().getBindingContext("callQueueModel").getObject();
			var callSid = obj.callId;

			var url2 =
				"https://api.twilio.com/2010-04-01/Accounts/AC26fd7a6c9a87881bcab5a4df4dbc7efc/Calls/" + callSid + "/Recordings";

			$.ajax({
				type: 'GET',
				url: url2,
				async: true,
				dataType: "xml",
				headers: {
					"Authorization": "Basic QUMyNmZkN2E2YzlhODc4ODFiY2FiNWE0ZGY0ZGJjN2VmYzowNTc2MmIxZjM5MDdjMmJhMzlhMDhlMTgxZDk4YTQwZA=="
				},
				success: function(result) {
					var test = result.children[0].textContent;
					test = test.substr(0, test.indexOf("AC"));
					//test = test.slice(0, -3);

					recordID = test;
				},
				complete: function() {
					var then = that;
					var url =
						"https://api.twilio.com/2010-04-01/Accounts/AC26fd7a6c9a87881bcab5a4df4dbc7efc/Recordings/" + recordID + ".mp3";

					$.ajax({
						type: 'GET',
						url: url,
						async: false,
						headers: {
							"Authorization": "Basic QUMyNmZkN2E2YzlhODc4ODFiY2FiNWE0ZGY0ZGJjN2VmYzowNTc2MmIxZjM5MDdjMmJhMzlhMDhlMTgxZDk4YTQwZA=="
						},
						success: function(result) {

							var hence = then;

							if (!then.fixedSizeDialog1) {
								then.fixedSizeDialog1 = new Dialog({
									title: 'Audio Record #' + recordID,
									contentWidth: "200px",
									contentHeight: "40px",
									content: new sap.ui.core.HTML({
										content: "<audio controls>" +
											"<source src='" + url + "' type='audio/mpeg'>" +
											"Your browser does not support the audio element." +
											"</audio>"
									})

								});
								then.getView().addDependent(then.fixedSizeDialog1);
							}
							then.fixedSizeDialog1.open();
							document.addEventListener("click",
								function closeDialog(oEvent) {
									if (oEvent.target.id === "sap-ui-blocklayer-popup") {
										hence.fixedSizeDialog1.close();
										document.removeEventListener("click", closeDialog);
									}
								});

						}
					});
				}
			});

		},

		onClickProductDet: function() {
			if (!this._oPopover) {
				this._oPopover = sap.ui.xmlfragment("com.deloitte.smartservice.SMARTSERVICE.fragments.productInfo", this);
				//this._oPopover.setModel(this.i18n, "i18n");
				this.getView().addDependent(this._Popover);
			}
			this._oPopover.open();
		},
		onClickCloseProductInfo: function() {
			this._oPopover.close();
		}
	});

});