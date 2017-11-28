sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"com/deloitte/smartservice/SMARTSERVICE/model/models"
], function(Controller, JSONModel, models) {
	"use strict";
	var AgentConController;
	var worker;

	var taskQueue;

	var marker;

	var workspace;
	return Controller.extend("com.deloitte.smartservice.SMARTSERVICE.controller.AgentConsole", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.deloitte.smartservice.SMARTSERVICE.view.AgentConsole
		 */
		onInit: function() {
			AgentConController = this;
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.attachRoutePatternMatched(this.onPatternMatch, this);

			/*Twilio Stuffs*/
			var workerToken = this.getOwnerComponent().getModel("workerToken");
			worker = new Twilio.TaskRouter.Worker(workerToken);

			var taskqueueToken = this.getOwnerComponent().getModel("taskqueueToken");
			taskQueue = new Twilio.TaskRouter.TaskQueue(taskqueueToken
				
				/*'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2ZXJzaW9uIjoidjEiLCJmcmllbmRseV9uYW1lIjoiV1E1MzFhNTAxYzE3YmJ' + 
			'mM2E1ZTUyNTJjZmI4ZjQxM2NhYyIsImlzcyI6IkFDNTI4NDhjMmJmNDZhYjU2NmQ3NDM5ZDA2MTc4NzRiMmYiLCJleHAiOjE1MTE' + 
			'4NjY2NDEsImFjY291bnRfc2lkIjoiQUM1Mjg0OGMyYmY0NmFiNTY2ZDc0MzlkMDYxNzg3NGIyZiIsImNoYW5uZWwiOiJXUTUzMWE' + 
			'1MDFjMTdiYmYzYTVlNTI1MmNmYjhmNDEzY2FjIiwid29ya3NwYWNlX3NpZCI6IldTNTQzNDhkNjhkMzNlZDZkNjZhNjVlYWJiNWF' + 
			'hYmU5ZTIiLCJ0YXNrcXVldWVfc2lkIjoiV1E1MzFhNTAxYzE3YmJmM2E1ZTUyNTJjZmI4ZjQxM2NhYyIsInBvbGljaWVzIjpbeyJ' + 
			'1cmwiOiJodHRwczpcL1wvZXZlbnQtYnJpZGdlLnR3aWxpby5jb21cL3YxXC93c2NoYW5uZWxzXC9BQzUyODQ4YzJiZjQ2YWI1NjZ' + 
			'kNzQzOWQwNjE3ODc0YjJmXC9XUTUzMWE1MDFjMTdiYmYzYTVlNTI1MmNmYjhmNDEzY2FjIiwibWV0aG9kIjoiR0VUIiwiYWxsb3c' + 
			'iOnRydWV9LHsidXJsIjoiaHR0cHM6XC9cL2V2ZW50LWJyaWRnZS50d2lsaW8uY29tXC92MVwvd3NjaGFubmVsc1wvQUM1Mjg0OGM' + 
			'yYmY0NmFiNTY2ZDc0MzlkMDYxNzg3NGIyZlwvV1E1MzFhNTAxYzE3YmJmM2E1ZTUyNTJjZmI4ZjQxM2NhYyIsIm1ldGhvZCI6IlB' + 
			'PU1QiLCJhbGxvdyI6dHJ1ZX0seyJ1cmwiOiJodHRwczpcL1wvdGFza3JvdXRlci50d2lsaW8uY29tXC92MVwvV29ya3NwYWNlc1w' + 
			'vV1M1NDM0OGQ2OGQzM2VkNmQ2NmE2NWVhYmI1YWFiZTllMlwvVGFza1F1ZXVlc1wvV1E1MzFhNTAxYzE3YmJmM2E1ZTUyNTJjZmI' + 
			'4ZjQxM2NhYyIsIm1ldGhvZCI6IkdFVCIsImFsbG93Ijp0cnVlfSx7InVybCI6Imh0dHBzOlwvXC90YXNrcm91dGVyLnR3aWxpby5' + 
			'jb21cL3YxXC9Xb3Jrc3BhY2VzXC9XUzU0MzQ4ZDY4ZDMzZWQ2ZDY2YTY1ZWFiYjVhYWJlOWUyXC9UYXNrUXVldWVzXC9XUTUzMWE' + 
			'1MDFjMTdiYmYzYTVlNTI1MmNmYjhmNDEzY2FjXC8qKiIsIm1ldGhvZCI6IkdFVCIsImFsbG93Ijp0cnVlLCJxdWVyeV9maWx0ZXI' + 
			'iOnt9LCJwb3N0X2ZpbHRlciI6e319LHsidXJsIjoiaHR0cHM6XC9cL3Rhc2tyb3V0ZXIudHdpbGlvLmNvbVwvdjFcL1dvcmtzcGF' + 
			'jZXNcL1dTNTQzNDhkNjhkMzNlZDZkNjZhNjVlYWJiNWFhYmU5ZTJcL1Rhc2tRdWV1ZXNcL1dRNTMxYTUwMWMxN2JiZjNhNWU1MjU' +
			'yY2ZiOGY0MTNjYWMiLCJtZXRob2QiOiJQT1NUIiwiYWxsb3ciOnRydWUsInF1ZXJ5X2ZpbHRlciI6e30sInBvc3RfZmlsdGVyIjp' +
			'7fX1dfQ.MHsSyWYNh-ZvMabdNxSNwpLMqGMPB-BC5WSFS2X4R7w'*/);
			console.log("TTOKEN:" + taskqueueToken);

			worker.on('ready', function(worker) {
				console.log("Successfully registered as: " + worker.friendlyName);
				console.log("Current activity is: " + worker.activityName);
			});
			this.registerTaskRouterCallbacks();
			this.bindAgentActivityButtons();

			var queryParams = {
				"Minutes": "240"
			}; // 4 hours
			/*taskQueue.realtimeStats.fetch(
				function(error, statistics) {
					if (error) {
						console.log(error.code);
						console.log(error.message);
						return;
					}
					console.log("fetched taskQueue statistics: " + JSON.stringify(statistics));
					console.log("total available workers: " + statistics.totalAvailableWorkers);
					console.log("total eligible workers: " + statistics.totalEligibleWorkers);
				}
			);*/

			var workspaceToken = this.getOwnerComponent().getModel("workspaceToken");
			workspace = new Twilio.TaskRouter.Workspace(workspaceToken);
			console.log(workspaceToken);

			workspace.tasks.fetch(
				function(error, taskList) {
					if (error) {
						console.log(error.code);
						console.log(error.message);
						console.log("ERROR IN TASK");
						return;
					}
					console.log("Parsing response");
					var data = taskList.data;
					for (var i = 0; i < data.length; i++) {
						console.log(JSON.stringify(data[i].attributes));
					}
				}
			);
		},

		/*Twilio Functions*/
		registerTaskRouterCallbacks: function() {
			var that = this;
			worker.on('ready', function(worker) {
				that.agentActivityChanged(worker.activityName);
				console.log("Successfully registered as: " + worker.friendlyName);
				console.log("Current activity is: " + worker.activityName);
				var status = that.getView().byId("agentStatus");
				status.setText(worker.activityName);
			});

			worker.on('activity.update', function(worker) {
				that.agentActivityChanged(worker.activityName);
				console.log("Worker activity changed to: " + worker.activityName);
				var status = that.getView().byId("agentStatus");
				status.setText(worker.activityName);

				if (worker.activityName === 'Idle') {
					var phoneName = that.getView().byId("phoneName");
					phoneName.setText("");
					var phoneNo = that.getView().byId("phoneNo");
					phoneNo.setText("");
					AgentConController.getView().byId("inp_accName").setValue("");
					marker.setMap(null);
					AgentConController.map.setZoom(16);

					var oModelExcepForCrate = new JSONModel({
						"histories": {},
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

					AgentConController.getOwnerComponent().setModel(oModelExcepForCrate, "custHistory");
					AgentConController.getOwnerComponent().getModel("custHistory").refresh();

					var data = {
						openIssues: []
					};
					AgentConController.getOwnerComponent().setModel(new JSONModel(data), "openIssuesModel");
					AgentConController.getOwnerComponent().getModel("openIssuesModel").refresh();
				}

			});

			worker.on("reservation.created", function(reservation) {
				console.log("-----");
				console.log("You have been reserved to handle a call!");
				console.log("Call from: " + reservation.task.attributes.from);
				var phoneName = that.getView().byId("phoneName");
				//phoneName.setText("Hegde, Kaushik");

				var phoneNo = that.getView().byId("phoneNo");
				phoneNo.setText(reservation.task.attributes.from);

				var number = reservation.task.attributes.from;
				number = number.replace('+61', '');

				$.ajax({
					url: "https://cors-anywhere.herokuapp.com/https://my302956.crm.ondemand.com/sap/c4c/odata/v1/c4codata/ContactCollection?$filter=endswith(Phone,'" +
						number + "')&$format=json",
					type: 'GET',
					headers: {
						"Authorization": "Basic QURNSU5JU1RSQVRJT04wMTpXZWxjb21lMQ=="
					},
					success: function(response) {
						phoneName.setText(response.d.results[0].ContactName);

						var accountId = response.d.results[0].AccountID;

						$.ajax({
							url: "https://cors-anywhere.herokuapp.com/https://my302956.crm.ondemand.com/sap/c4c/odata/v1/c4codata/AccountCollection?$filter=endswith(AccountID,'" +
								accountId + "')&$format=json",
							type: 'GET',
							headers: {
								"Authorization": "Basic QURNSU5JU1RSQVRJT04wMTpXZWxjb21lMQ=="
							},
							success: function(res) {
								AgentConController.getView().byId("inp_accName").setValue(res.d.results[0].AccountName + "(" + res.d.results[0].AccountID +
									")");

								if (res.d.results[0].AccountName === 'Deloitte') {
									AgentConController.map.panTo(new google.maps.LatLng(-33.862995, 151.207193));
									AgentConController.map.setZoom(18);

									marker = new google.maps.Marker({
										// The below line is equivalent to writing:
										// position: new google.maps.LatLng(-34.397, 150.644)
										animation: google.maps.Animation.DROP,
										position: {
											lat: -33.862995,
											lng: 151.207193
										},
										map: AgentConController.map
									});
								}
							}
						});
					}
				});

				console.log("Selected language: " + reservation.task.attributes.selected_language);
				console.log("-----");

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

				AgentConController.getOwnerComponent().setModel(oModelExcepForCrate, "custHistory");
				AgentConController.getOwnerComponent().getModel("custHistory").refresh();

				var data = {
					openIssues: [{
						TicketNo: "1001",
						TicketDesc: "Device Damaged",
						Status: "Open",
						Priority: "1",
						StartTime: "08-27-2017"
					}, {
						TicketNo: "1002",
						TicketDesc: "Device making noise",
						Status: "In Progress",
						Priority: "2",
						StartTime: "08-26-2017"
					}, {
						TicketNo: "1003",
						TicketDesc: "Wrong Product Delivered",
						Status: "Open",
						Priority: "2",
						StartTime: "08-26-2017"
					}, {
						TicketNo: "1004",
						TicketDesc: "No Manual provided",
						Status: "In Progress",
						Priority: "3",
						StartTime: "08-25-2017"
					}, {
						TicketNo: "1005",
						TicketDesc: "Heating issue",
						Status: "Open",
						Priority: "1",
						StartTime: "08-27-2017"
					}]
				};
				AgentConController.getOwnerComponent().setModel(new JSONModel(data), "openIssuesModel");
				AgentConController.getOwnerComponent().getModel("openIssuesModel").refresh();

			});

			worker.on("reservation.accepted", function(reservation) {
				that.logger("Reservation " + reservation.sid + " accepted!");
				//twiml.record({transcribe: true, maxLength: 30});
			});

			worker.on("reservation.rejected", function(reservation) {
				that.logger("Reservation " + reservation.sid + " rejected!");
			});

			worker.on("reservation.timeout", function(reservation) {
				that.logger("Reservation " + reservation.sid + " timed out!");
			});

			worker.on("reservation.canceled", function(reservation) {
				that.logger("Reservation " + reservation.sid + " canceled!");
			});
		},

		/* Hook up the agent Activity buttons to Worker.js */

		bindAgentActivityButtons: function() {
			// Fetch the full list of available Activities from TaskRouter. Store each
			// ActivitySid against the matching Friendly Name
			var activitySids = {};
			worker.activities.fetch(function(error, activityList) {
				var activities = activityList.data;
				var i = activities.length;
				while (i--) {
					activitySids[activities[i].friendlyName] = activities[i].sid;
				}
			});

			/* For each button of class 'change-activity' in our Agent UI, look up the
			ActivitySid corresponding to the Friendly Name in the button’s next-activity
			data attribute. Use Worker.js to transition the agent to that ActivitySid
			when the button is clicked.*/
			var elements = document.getElementsByClassName('change-activity');
			var i = elements.length;
			while (i--) {
				elements[i].onclick = function() {
					var nextActivity = this.dataset.nextActivity;
					var nextActivitySid = activitySids[nextActivity];
					worker.update("ActivitySid", nextActivitySid);
				}
			}
		},

		onSetBusy: function() {
			worker.update("ActivitySid", "WA9dae4784b2317a747d2a71cc7a4a1466");
		},

		onSetIdle: function() {
			worker.update("ActivitySid", "WA8f25e4d7b5024db83aef8843b30a670a");
		},

		onBase64: function() {
			var reader = new FileReader();

			reader.onload = function(readerEvt) {
				var binaryString = readerEvt.target.result;
				console.log(btoa(binaryString));
			};
			reader.readAsBinaryString("model/sample.flac")
		},

		/* Update the UI to reflect a change in Activity */

		agentActivityChanged: function(activity) {
			this.hideAgentActivities();
			this.showAgentActivity(activity);
		},

		hideAgentActivities: function() {
			var elements = document.getElementsByClassName('agent-activity');
			var i = elements.length;
			while (i--) {
				//elements[i].style.display = 'none';
			}
		},

		showAgentActivity: function(activity) {
			activity = activity.toLowerCase();
			var elements = document.getElementsByClassName(('agent-activity ' + activity));
			//elements.item(0).style.display = 'block';
		},

		/* Other stuff */

		logger: function(message) {
			// var log = document.getElementById('log');
			// log.value += "\n> " + message;
			// log.scrollTop = log.scrollHeight;

			console.log(message);
		},

		/*End Twilio Functions*/

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
			if (oEvent.getParameter("name") === "AgentConsole") {
				var today = new Date();
				AgentConController.getView().byId("dr_fromTo").setSecondDateValue(today);
				var oneWeekAgo = new Date();
				oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
				AgentConController.getView().byId("dr_fromTo").setDateValue(oneWeekAgo);

				AgentConController.initialized = true;

				AgentConController.getView().byId("map_canvas").setVisible(false);
				AgentConController.getView().byId("map_canvas").setVisible(true);
				AgentConController.getView().byId("map_canvas").onAfterRendering = function() {
					AgentConController.geocoder = new google.maps.Geocoder();
					window.mapOptions = {
						center: new google.maps.LatLng(37.687878, -122.471780),
						zoom: 16,
						mapTypeId: google.maps.MapTypeId.ROADMAP
					};
					AgentConController.map = new google.maps.Map(AgentConController.getView().byId("map_canvas").getDomRef(), mapOptions);

				}
			}
		},
		onClickCallPopUp: function() {
			models.fetchCustomerDetails(this.getOwnerComponent());
			if (!this._custDetPopover) {
				this._custDetPopover = sap.ui.xmlfragment("com.deloitte.smartservice.SMARTSERVICE.fragments.CustomerDetail", this);
				this.getView().addDependent(this._custDetPopover);
			}
			this._custDetPopover.open();
		},
		onClickCloseCallDialog: function() {
			this._custDetPopover.close();
		},
		actSearch: function(data) {
			//console.log("actSearch methods");
			var newmap = AgentConController.map;
			AgentConController.geocoder.geocode({
				'address': "Sydney"
			}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					newmap.setCenter(results[0].geometry.location);
					newmap.setZoom(16);
					var directionsDisplay;
					var directionsService = new google.maps.DirectionsService();
					directionsDisplay = new google.maps.DirectionsRenderer({
						'draggable': true
					});
					directionsDisplay.setMap(newmap);
					var request = {
						origin: new google.maps.LatLng(data.ORIGIN[0], data.ORIGIN[1]),
						destination: new google.maps.LatLng(data.DESTINATION[0], data.DESTINATION[1]),
						travelMode: google.maps.TravelMode.DRIVING
					};
					directionsService.route(request, function(response, status) {
						if (status == google.maps.DirectionsStatus.OK) {
							directionsDisplay.setDirections(response);
						}
					});
				} else {
					alert('Geocode was not successful for the following reason: ' + status);
				}
			});
			var contentString = '<div id="content">' +
				'<div id="siteNotice">' +
				'</div>' +
				'<h2 id="firstHeading" class="firstHeading">Sensor 1120</h2>' +
				'<div id="bodyContent">' +
				'<p><b>Type:</b> Temperature</p>' +
				'<p><b>Value:</b> 21</p>' +
				'<p><b>Time:</b> 11 July 2017 17:56</p>' +
				'</div>' +
				'</div>';

			var infowindow = new google.maps.InfoWindow({
				content: contentString
			});
			var myLatLng = {
				lat: -33.423736,
				lng: 151.283878
			};
			var marker = new google.maps.Marker({
				map: newmap,
				position: myLatLng
			});
			marker.addListener('click', function() {
				infowindow.open(newmap, marker);
			});

			return;
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