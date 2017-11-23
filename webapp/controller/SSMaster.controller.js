sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("com.deloitte.smartservice.SMARTSERVICE.controller.SSMaster", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.deloitte.smartservice.SMARTSERVICE.view.SSMaster
		 */
		// onInit: function() {

		// },

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.deloitte.smartservice.SMARTSERVICE.view.SSMaster
		 */
		onBeforeRendering: function() {
			var that = this;

			/*$.ajax({
				url: 'https://cors-anywhere.herokuapp.com/https://us-central1-leonardo-2a5dc.cloudfunctions.net/twilioTaskqueueToken',
				type: 'GET',
				success: function(response) {
					that.getOwnerComponent().setModel(response.token, "taskqueueToken");
				}
			});

			$.ajax({
				url: 'https://cors-anywhere.herokuapp.com/https://us-central1-leonardo-2a5dc.cloudfunctions.net/twilioWorkerToken',
				type: 'GET',
				success: function(response) {
					that.getOwnerComponent().setModel(response.token, "workerToken");
				}
			});

			$.ajax({
				url: 'https://cors-anywhere.herokuapp.com/https://us-central1-leonardo-2a5dc.cloudfunctions.net/twilioWorkspaceToken',
				type: 'GET',
				success: function(response) {
					that.getOwnerComponent().setModel(response.token, "workspaceToken");
				}
			});*/  
			
			$.ajax({
				url: 'https://cors-anywhere.herokuapp.com/https://us-central1-leonardo-2a5dc.cloudfunctions.net/twilioCombinedTokens',
				type: 'GET',
				success: function(response) {
					that.getOwnerComponent().setModel(response.workerToken, "workerToken");
					that.getOwnerComponent().setModel(response.taskqueueToken, "taskqueueToken");
					that.getOwnerComponent().setModel(response.workspaceToken, "workspaceToken");
				}
			});
		},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.deloitte.smartservice.SMARTSERVICE.view.SSMaster
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.deloitte.smartservice.SMARTSERVICE.view.SSMaster
		 */
		//	onExit: function() {
		//
		//	}
		onClickNavigationListItem: function(oEvent) {
			var id = oEvent.getSource().getId();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			if (id.indexOf('nli_agentConsole') > -1) {
				//this.getView().getParent().getParent().toDetail(this.getView().getParent().getParent().getDetailPages()[0].sId);	
				oRouter.navTo("AgentConsole");
			} else if (id.indexOf('nli_callQueue') > -1) {
				//this.getView().getParent().getParent().toDetail(this.getView().getParent().getParent().getDetailPages()[0].sId);	
				oRouter.navTo("CallQueue");
			} else if (id.indexOf('nli_voiceAnalytics') > -1) {
				//this.getView().getParent().getParent().toDetail(this.getView().getParent().getParent().getDetailPages()[0].sId);	
				oRouter.navTo("VoiceAnalytics");
			} else if (id.indexOf('nli_smsAnalytics') > -1) {
				//this.getView().getParent().getParent().toDetail(this.getView().getParent().getParent().getDetailPages()[0].sId);	
				oRouter.navTo("SmsAnalytics");
			} else if (id.indexOf('nli_callLog') > -1) {
				//this.getView().getParent().getParent().toDetail(this.getView().getParent().getParent().getDetailPages()[0].sId);	
				oRouter.navTo("CallLog");
			}
		}

	});

});