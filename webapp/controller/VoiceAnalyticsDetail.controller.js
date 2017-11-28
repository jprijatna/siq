sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function(Controller, JSONModel, MessageToast) {
	"use strict";
	var AgentConController;
	return Controller.extend("com.deloitte.smartservice.SMARTSERVICE.controller.VoiceAnalyticsDetail", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.deloitte.smartservice.SMARTSERVICE.view.AgentConsole
		 */
		onInit: function() {
			AgentConController = this;
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.attachRoutePatternMatched(this.onPatternMatch, this);
		},
		onNavBack: function() {
			//this.oRouter.navTo("Page2");
			sap.ui.core.UIComponent.getRouterFor(this).navTo("VoiceAnalytics");
		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.deloitte.smartservice.SMARTSERVICE.view.AgentConsole
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.deloitte.smartservice.SMARTSERVICE.view.AgentConsole
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.deloitte.smartservice.SMARTSERVICE.view.AgentConsole
		 */
		//	onExit: function() {
		//
		//	}
		onPatternMatch: function(oEvent) {
			if (oEvent.getParameter("name") === "VoiceAnalyticsDetail") {
				//var today = new Date();
				//AgentConController.getView().byId("dp_to").setDateValue(today);
				//var oneWeekAgo = new Date();
				//oneWeekAgo.setDate(oneWeekAgo.getDate() - 180);
				//AgentConController.getView().byId("dp_from").setDateValue(oneWeekAgo);
				console.log("Event: " + oEvent);
				var a = this.getOwnerComponent().getModel("rowModel");

				AgentConController.initialized = true;
				var oModelExcepForCrate = new JSONModel({
					"histories": {
						"labels": ['March 2017', 'April 2017', 'May 2017', 'June 2017', 'July 2017', 'August 2017'],
						"datasets": [{
							"label": "Low",
							"backgroundColor": '#ADD8E6',
							"data": [10, 10, 9, 8, 5, 2]
						}, {
							"label": "Medium",
							"backgroundColor": '#98FB98',
							"data": [8, 16, 7, 5, 5, 7]
						}, {
							"label": "High",
							"backgroundColor": '#FFA07A',
							"data": [2, 3, 1, 5, 3, 5]
						}]
					},
					options: {
						scales: {
							yAxes: [{
								ticks: {
									beginAtZero: true
								}
							}]
						}
					}
				});
				//AgentConController.getView().byId("map_canvas").setVisible(false);
				//AgentConController.getView().byId("map_canvas").setVisible(true);
				//AgentConController.getView().byId("map_canvas").onAfterRendering = function() {
				//	AgentConController.getOwnerComponent().setModel(oModelExcepForCrate, "custHistory");
				//	AgentConController.geocoder = new google.maps.Geocoder();
				//	window.mapOptions = {
				//		center: new google.maps.LatLng(37.687878, -122.471780),
				//		zoom: 16,
				//		mapTypeId: google.maps.MapTypeId.ROADMAP
				//	};
				//	AgentConController.map = new google.maps.Map(AgentConController.getView().byId("map_canvas").getDomRef(), mapOptions);

				//}
				var html1 = new sap.ui.core.HTML({
					content: "<audio controls width='10000px' height='100px'><source src='" + a.AudioUrl + "'" +
						"type='audio/wav' >" +
						"Your browser does not support the audio tag. </audio>"
				});
				var audioBox = this.getView().byId("audioBox");
				audioBox.removeAllItems();
				audioBox.addItem(html1);

				var agentText = this.getView().byId("agentText");
				agentText.setText(a.Agent);

				var customerText = this.getView().byId("customerText");
				customerText.setText(a.CustomerName);

				var dateText = this.getView().byId("dateText");
				dateText.setText(a.Date + " - " + a.StartTime);

				var sentimentText = this.getView().byId("sentimentText");
				sentimentText.setText(" - ");

				var that = this;

				$.ajax({
					url: 'https://cors-anywhere.herokuapp.com/https://us-central1-gold-order-178001.cloudfunctions.net/SIQ-Live-fetchCallAnalysis?recordID=' +
						a.RecordID,
					type: 'GET',
					success: function(response) {
						console.log(response);
						var transcriptText = that.getView().byId("transcriptText");
						transcriptText.setEnabled(true);
						transcriptText.setValue(response[0].transcription);

						that.getView().byId("supervisorNotes").setValue(response[0].notes);

						var entityData = {
							entities: []
						};

						var arr = [];

						for (var i = 0; i < response[0].sentiment.entities.length; i++) {
							var tokenArr = {
								token: response[0].sentiment.entities[i].name,
								salience: response[0].sentiment.entities[i].salience.toFixed(2)
							};
							arr.push(tokenArr);
						}

						entityData.entities = arr;

						AgentConController.getOwnerComponent().setModel(new JSONModel(entityData), "entityModel");
						AgentConController.getOwnerComponent().getModel("entityModel").refresh();

						var sentimentScore = response[0].sentiment.documentSentiment.score.toFixed(2);
						var sentimentMagnitude = response[0].sentiment.documentSentiment.magnitude.toFixed(2);
						var sentiment = "";

						if (sentimentScore === 0.00 && sentimentMagnitude >= 0.00) {
							sentiment = "Mixed";
						} else if (sentimentScore >= 0.00 && sentimentMagnitude === 0.00) {
							sentiment = "Neutral";
						} else if (sentimentScore >= 0.00 && sentimentMagnitude >= 0.00) {
							sentiment = "Positive";
						} else if (sentimentScore < 0.00 && sentimentMagnitude >= 0.00) {
							sentiment = "Negative";
						}

						var sentimentLabel = that.getView().byId("sentimentText");
						sentimentLabel.setText(sentiment);
					},
					error: function(e) {
						console.log("Error");
						console.log(e);
					}
				});
			}
		},
		saveSupervisorNotes: function() {
			var a = this.getOwnerComponent().getModel("rowModel");
			var recordID = a.RecordID;

			var notes = this.getView().byId("supervisorNotes").getValue();

			var data = {
				RecordID: recordID,
				Notes: notes
			};

			$.ajax({
				url: 'https://cors-anywhere.herokuapp.com/https://us-central1-gold-order-178001.cloudfunctions.net/SIQ-Live-saveSupervisorNotes',
				type: 'POST',
				dataType: 'json',
				data: data,
				success: function(response) {
					MessageToast.show('Notes Saved.');
				},
				error: function(e) {
					if (e.status === 200) {
						MessageToast.show('Notes Saved.');
					} else {
						console.log("Error");
						console.log(e);
					}
				}
			});

		},
		handleSelectionChange: function(oEvent) {

		},
		onSetCallStatus: function(oEvent) {
			var clickedbtn = oEvent.getSource();
			if (clickedbtn.hasStyleClass('availableBtn')) {
				clickedbtn.removeStyleClass("availableBtn");
				clickedbtn.addStyleClass('offlineBtn');
				clickedbtn.setText("Offline");
			} else if (clickedbtn.hasStyleClass('offlineBtn')) {
				clickedbtn.removeStyleClass("offlineBtn");
				clickedbtn.addStyleClass('availableBtn');
				clickedbtn.setText("Available");
			}

		}
	});

});