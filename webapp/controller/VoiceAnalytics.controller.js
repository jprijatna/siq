sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
	"use strict";
	var AgentConController;
	return Controller.extend("com.deloitte.smartservice.SMARTSERVICE.controller.VoiceAnalytics", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.deloitte.smartservice.SMARTSERVICE.view.AgentConsole
		 */
		onInit: function() {
			// create model
			var oModel = new JSONModel();
			var oneWeekAgo = new Date();
				oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
			oModel.setData({
				dateValue: new Date(),
				prevDateValue: oneWeekAgo
			});
			this.getView().setModel(oModel);
			AgentConController = this;
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.attachRoutePatternMatched(this.onPatternMatch, this);
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
			if (oEvent.getParameter("name") === "VoiceAnalytics") {
				//var today = new Date();
				//AgentConController.getView().byId("dp_to").setDateValue(today);
				//var oneWeekAgo = new Date();
				//oneWeekAgo.setDate(oneWeekAgo.getDate() - 180);
				//AgentConController.getView().byId("dp_from").setDateValue(oneWeekAgo);
				
				/*var data = {
					openIssues: [{
						CustomerNo: "1001",
						CustomerName: "David Blinger",
						Agent: "Motilal Gandhi",
						Number: "+41-3888-456",
						Date: "08-27-2017",
						StartTime: "08:23:25",
						Duration: "00:11:34",
						Sentiment: "Positive",
						Priority: "3"
					}, {
						CustomerNo: "1002",
						CustomerName: "Rafel Nadal",
						Agent: "Premchand Gupta",
						Number: "+41-3888-456",
						Date: "08-26-2017",
						StartTime: "08-27-2017",
						Duration: "00:11:34",
						Sentiment: "Negative",
						Priority: "1"
					}, {
						CustomerNo: "1003",
						CustomerName: "Wong Hamilton",
						Agent: "Vinoda Bhabe",
						Number: "+41-3888-456",
						Date: "08-27-2017",
						StartTime: "08-26-2017",
						Duration: "00:11:34",
						Sentiment: "Neutral",
						Priority: "2"
					}, {
						CustomerNo: "1004",
						CustomerName: "Norman Lewis",
						Agent: "Menka Gandhi",
						Number: "+41-3888-456",
						Date: "08-27-2017",
						StartTime: "08-25-2017",
						Duration: "00:11:34",
						Sentiment: "Neutral",
						Priority: "2"
					}, {
						CustomerNo: "1005",
						CustomerName: "Heathrow Norton",
						Agent: "Albela Tiwari",
						Number: "+41-3888-456",
						Date: "08-27-2017",
						StartTime: "08-27-2017",
						Duration: "00:11:34",
						Sentiment: "Negative",
						Priority: "1"
					}]
				};*/
				
				var data = {
					openIssues: []
				};
				
				$.ajax({
					url: 'https://cors-anywhere.herokuapp.com/https://us-central1-leonardo-2a5dc.cloudfunctions.net/fetchCallLog',
					type: 'GET',
					success: function(response) {
						console.log(response);
						
						var array = [];
						var nameArray = ["Jenny","Jack","John","Jill"];
						var sentiment = ["Positive", "Negative", "Neutral"];
						var priority = ["1","2","3"];
						
						for(var i = 0; i < response.length; i++){
							var entry = {
								CustomerNo: "10011",
								CustomerName: "Kaushik Hegde",
								Agent: nameArray[Math.floor(Math.random() * nameArray.length)],
								Number: response[i].callerNumber,
								Date: response[i].callStart.substr(0,16),
								StartTime: response[i].callStart.slice(-14).substr(0,8),
								Duration: response[i].duration,
								AudioUrl: response[i].audioURL,
								RecordID: response[i].recordID,
								Sentiment: sentiment[Math.floor(Math.random() * sentiment.length)],
								Priority: priority[Math.floor(Math.random() * priority.length)]
							};
							array.push(entry);
						}
						
						data.openIssues = array;
						
						AgentConController.getOwnerComponent().setModel(new JSONModel(data), "openIssuesModel");
						AgentConController.getOwnerComponent().getModel("openIssuesModel").refresh();
					},
					error: function(e) {
						console.log("Error");
						console.log(e);
					}
				});
				
			
				
				AgentConController.getOwnerComponent().setModel(new JSONModel(data), "openIssuesModel");
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
			}
		},
		handleSelectionChange: function(oEvent) {
			var path = oEvent.getSource().getSelectedItem().oBindingContexts.openIssuesModel.getPath();
			var model = AgentConController.getOwnerComponent().getModel("openIssuesModel");
			var obj = model.getProperty(path);
			
			console.log(obj);
			
			this.getOwnerComponent().setModel(obj, "rowModel");

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var string = "STRING";
			oRouter.navTo("VoiceAnalyticsDetail" , obj);
		},
		onSetCallStatus:function(oEvent){
			var clickedbtn=oEvent.getSource();
			if(clickedbtn.hasStyleClass('availableBtn')){
				clickedbtn.removeStyleClass("availableBtn");
				clickedbtn.addStyleClass('offlineBtn');
				clickedbtn.setText("Offline");
			}
			else if(clickedbtn.hasStyleClass('offlineBtn')){
				clickedbtn.removeStyleClass("offlineBtn");
				clickedbtn.addStyleClass('availableBtn');
				clickedbtn.setText("Available");
			}
			
		}
	});

});