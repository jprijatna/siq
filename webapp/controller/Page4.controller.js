sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	'sap/ui/model/json/JSONModel'
], function(BaseController, MessageBox, Utilities, History, JSONModel) {
	"use strict";

	return BaseController.extend("deloitte.ui.reimagine.controller.Page4", {
		handleRouteMatched: function(oEvent) {
			var oSelectedAppModel = this.getOwnerComponent().getModel('oSelectedAppModel');
			this.getView().setModel(oSelectedAppModel, "oSelectedAppModel");
			var videoURL = oSelectedAppModel.getData().TakeAction.video['Video-URL'];
			var videoDescription = oSelectedAppModel.getData().TakeAction.video.Description;
			var html1 = new sap.ui.core.HTML({
				content: "<video controls autoplay id='videoPlyr' width='100%' height='100%'>" +
					"<source src='" + videoURL + "' type='video/mp4'>" +
					"Your browser does not support the video tag." +
					"</video>"
			});
			var gridPanel = this.getView().byId("videoBox");
			gridPanel.removeAllItems();
			// var videoName =  new sap.m.Text({text: 'Check out the video'}).addStyleClass("fontMedium sapUiTinyMarginBottom sapUiTinyMarginTop sapUiTinyMarginBegin");
			var videoName = new sap.m.Text({
				text: oSelectedAppModel.getData().Title
			}).addStyleClass("fontMedium sapUiTinyMarginBottom sapUiTinyMarginTop sapUiTinyMarginBegin");
			//var videoDesc =  new sap.m.Text({text: videoDescription}).addStyleClass("descText sapUiTinyMarginBottom sapUiTinyMarginBegin");
			var videoBoxContent = new sap.m.VBox({
				//items: [html1, videoName, videoDesc],
				items: [html1, videoName],
				fitContainer: true
			}).addStyleClass("");
			var videoBox = new sap.m.HBox({
				items: [videoBoxContent],
				justifyContent: "Center",
				alignItems: "Center"
			}).addStyleClass("videoHBox");
			gridPanel.addItem(videoBox);
		},
		onInit: function() {
			var oSelectedAppModel = this.getOwnerComponent().getModel('oSelectedAppModel');
			this.getView().setModel(oSelectedAppModel, "oSelectedAppModel");
			var oProductModel = new sap.ui.model.json.JSONModel("json/smartTap.json");
			this.getView().setModel(oProductModel, "oProductModel");

			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			this.oRouter.getRoute("Page4").attachPatternMatched(this.handleRouteMatched, this);
		},
		handleImagePress: function(oEvent) {
			this.pauseVideo();
			this.oRouter.navTo("Page3");
		},
		_onButtonDiscover: function(oEvent) {
			this.pauseVideo();
			this.oRouter.navTo("Page2", {
				type: "cre"
			});
		},
		_onButtonBookmarks: function(oEvent) {
			this.pauseVideo();
			this.oRouter.navTo("Bookmarks");
		},
		_onButtonHome: function(oEvent) {
			this.pauseVideo();
			this.oRouter.navTo("Page1");
		},

		pauseVideo: function() {
			// var plyr = document.getElementById("videoPlyr");
			// plyr.pause();
			var gridPanel = this.getView().byId("videoBox");
			gridPanel.removeAllItems();
		},

		onNavBack: function() {
			// sap.ui.core.UIComponent.getRouterFor(this).navTo("Page3");
			this.pauseVideo();
			var oSelectedAppModel = this.getOwnerComponent().getModel('oSelectedAppModel');
			var title = oSelectedAppModel.getData().Title;
			var Id = oSelectedAppModel.getData().Id;

			if (title === "Maintenance Assistant") {
				this.oRouter.navTo("Page3", {
					sPath: 0
				});
			} else if (title === "D-Wine") {
				this.oRouter.navTo("Page3", {
					sPath: 1
				});

			} else if (title === "Customer Segmentation") {
				this.oRouter.navTo("Page3", {
					sPath: 2
				});
			} else if (Id === "PRDT TRENDS") {
				this.oRouter.navTo("Page3", {
					sPath: 3
				});
			} else if (Id === "SMT ANALYSIS") {
				this.oRouter.navTo("Page3", {
					sPath: 4
				});
			} else if (Id === "PREDTVE MAINT") {
				this.oRouter.navTo("Page3", {
					sPath: 5
				});
			} else if (title === "Smart Warehouse") {
				this.oRouter.navTo("Page3", {
					sPath: 6
				});
			} else if (title === "Smart Tap") {
				this.oRouter.navTo("Page3", {
					sPath: 7
				});
			} else if (title === "Cold Chain Logistics") {
				this.oRouter.navTo("Page3", {
					sPath: 8
				});
			} else if (title === "D.Property+") {
				this.oRouter.navTo("Page3", {
					sPath: 9
				});
			} else if (title === "Smart Retail") {
				this.oRouter.navTo("Page3", {
					sPath: 10
				});
			} else if (title === "ML4H - Product Recommendations") {
				this.oRouter.navTo("Page3", {
					sPath: 11
				});
			} else if (title === "ML4H - Predictive Segmentation") {
				this.oRouter.navTo("Page3", {
					sPath: 12
				});
			} else if (title === "Smart Shop Floor") {
				this.oRouter.navTo("Page3", {
					sPath: 13
				});
			} else if (title === "SAP Connected Goods") {
				this.oRouter.navTo("Page3", {
					sPath: 14
				});
			} else if (title === "SAP Artificial Intelligence Network") {
				this.oRouter.navTo("Page3", {
					sPath: 15
				});
			} else if (title === "SAP Vehicle Insights") {
				this.oRouter.navTo("Page3", {
					sPath: 16
				});
			} else if (title === "SAP PdMS") {
				this.oRouter.navTo("Page3", {
					sPath: 17
				});
			}
		},

		onAfterRendering: function() {

		}
	});
}, /* bExport= */ true);