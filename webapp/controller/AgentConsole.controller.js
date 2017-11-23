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
			worker = new Twilio.TaskRouter.Worker(
				'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2ZXJzaW9uIjoidjEiLCJmcmllbmRseV9uYW1lIjoiV0s5NGU0YjkyYTIxNmJ' +
				'lZmQ0MzBjZGE0ZDA3NmIyNjM0MiIsImlzcyI6IkFDY2QzMmZiOTE2MzM1YmFkZWEzOWM1ZWI5YmM3MTNjMTciLCJleHAiOjE1MDk' +
				'2MjQ2ODIsImFjY291bnRfc2lkIjoiQUNjZDMyZmI5MTYzMzViYWRlYTM5YzVlYjliYzcxM2MxNyIsImNoYW5uZWwiOiJXSzk0ZTR' +
				'iOTJhMjE2YmVmZDQzMGNkYTRkMDc2YjI2MzQyIiwid29ya3NwYWNlX3NpZCI6IldTODFjNDRkOGFmOGMxMmZhNTdlNWVlMGI2YjR' +
				'lNzc3MWYiLCJ3b3JrZXJfc2lkIjoiV0s5NGU0YjkyYTIxNmJlZmQ0MzBjZGE0ZDA3NmIyNjM0MiIsInBvbGljaWVzIjpbeyJ1cmw' +
				'iOiJodHRwczpcL1wvZXZlbnQtYnJpZGdlLnR3aWxpby5jb21cL3YxXC93c2NoYW5uZWxzXC9BQ2NkMzJmYjkxNjMzNWJhZGVhMzl' +
				'jNWViOWJjNzEzYzE3XC9XSzk0ZTRiOTJhMjE2YmVmZDQzMGNkYTRkMDc2YjI2MzQyIiwibWV0aG9kIjoiR0VUIiwiYWxsb3ciOnR' +
				'ydWV9LHsidXJsIjoiaHR0cHM6XC9cL2V2ZW50LWJyaWRnZS50d2lsaW8uY29tXC92MVwvd3NjaGFubmVsc1wvQUNjZDMyZmI5MTY' +
				'zMzViYWRlYTM5YzVlYjliYzcxM2MxN1wvV0s5NGU0YjkyYTIxNmJlZmQ0MzBjZGE0ZDA3NmIyNjM0MiIsIm1ldGhvZCI6IlBPU1Q' +
				'iLCJhbGxvdyI6dHJ1ZX0seyJ1cmwiOiJodHRwczpcL1wvdGFza3JvdXRlci50d2lsaW8uY29tXC92MVwvV29ya3NwYWNlc1wvV1M' +
				'4MWM0NGQ4YWY4YzEyZmE1N2U1ZWUwYjZiNGU3NzcxZlwvV29ya2Vyc1wvV0s5NGU0YjkyYTIxNmJlZmQ0MzBjZGE0ZDA3NmIyNjM' +
				'0MiIsIm1ldGhvZCI6IkdFVCIsImFsbG93Ijp0cnVlfSx7InVybCI6Imh0dHBzOlwvXC90YXNrcm91dGVyLnR3aWxpby5jb21cL3Y' +
				'xXC9Xb3Jrc3BhY2VzXC9XUzgxYzQ0ZDhhZjhjMTJmYTU3ZTVlZTBiNmI0ZTc3NzFmXC9BY3Rpdml0aWVzIiwibWV0aG9kIjoiR0V' +
				'UIiwiYWxsb3ciOnRydWV9LHsidXJsIjoiaHR0cHM6XC9cL3Rhc2tyb3V0ZXIudHdpbGlvLmNvbVwvdjFcL1dvcmtzcGFjZXNcL1d' +
				'TODFjNDRkOGFmOGMxMmZhNTdlNWVlMGI2YjRlNzc3MWZcL1Rhc2tzXC8qKiIsIm1ldGhvZCI6IkdFVCIsImFsbG93Ijp0cnVlfSx' +
				'7InVybCI6Imh0dHBzOlwvXC90YXNrcm91dGVyLnR3aWxpby5jb21cL3YxXC9Xb3Jrc3BhY2VzXC9XUzgxYzQ0ZDhhZjhjMTJmYTU' +
				'3ZTVlZTBiNmI0ZTc3NzFmXC9Xb3JrZXJzXC9XSzk0ZTRiOTJhMjE2YmVmZDQzMGNkYTRkMDc2YjI2MzQyXC9SZXNlcnZhdGlvbnN' +
				'cLyoqIiwibWV0aG9kIjoiR0VUIiwiYWxsb3ciOnRydWV9LHsidXJsIjoiaHR0cHM6XC9cL3Rhc2tyb3V0ZXIudHdpbGlvLmNvbVw' +
				'vdjFcL1dvcmtzcGFjZXNcL1dTODFjNDRkOGFmOGMxMmZhNTdlNWVlMGI2YjRlNzc3MWZcL1dvcmtlcnNcL1dLOTRlNGI5MmEyMTZ' +
				'iZWZkNDMwY2RhNGQwNzZiMjYzNDIiLCJtZXRob2QiOiJQT1NUIiwiYWxsb3ciOnRydWUsInF1ZXJ5X2ZpbHRlciI6e30sInBvc3R' +
				'fZmlsdGVyIjp7IkFjdGl2aXR5U2lkIjp7InJlcXVpcmVkIjp0cnVlfX19XX0.x0lxlYKJzQ4R6mmhn47GY9Y6OAz1D4wXdbKbr5L' + 'C2ZE');

			var taskqueueToken = this.getOwnerComponent().getModel("taskqueueToken");
			taskQueue = new Twilio.TaskRouter.TaskQueue(
				'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2ZXJzaW9uIjoidjEiLCJmcmllbmRseV9uYW1lIjoiV1FjMTRlNzYzZWIwYzQ' +
				'1MzY2OGY0NjJmNDE1MTViOGQ4MiIsImlzcyI6IkFDY2QzMmZiOTE2MzM1YmFkZWEzOWM1ZWI5YmM3MTNjMTciLCJleHAiOjE1MDk' +
				'2MjQ2ODIsImFjY291bnRfc2lkIjoiQUNjZDMyZmI5MTYzMzViYWRlYTM5YzVlYjliYzcxM2MxNyIsImNoYW5uZWwiOiJXUWMxNGU' +
				'3NjNlYjBjNDUzNjY4ZjQ2MmY0MTUxNWI4ZDgyIiwid29ya3NwYWNlX3NpZCI6IldTODFjNDRkOGFmOGMxMmZhNTdlNWVlMGI2YjR' +
				'lNzc3MWYiLCJ0YXNrcXVldWVfc2lkIjoiV1FjMTRlNzYzZWIwYzQ1MzY2OGY0NjJmNDE1MTViOGQ4MiIsInBvbGljaWVzIjpbeyJ' +
				'1cmwiOiJodHRwczpcL1wvZXZlbnQtYnJpZGdlLnR3aWxpby5jb21cL3YxXC93c2NoYW5uZWxzXC9BQ2NkMzJmYjkxNjMzNWJhZGV' +
				'hMzljNWViOWJjNzEzYzE3XC9XUWMxNGU3NjNlYjBjNDUzNjY4ZjQ2MmY0MTUxNWI4ZDgyIiwibWV0aG9kIjoiR0VUIiwiYWxsb3c' +
				'iOnRydWV9LHsidXJsIjoiaHR0cHM6XC9cL2V2ZW50LWJyaWRnZS50d2lsaW8uY29tXC92MVwvd3NjaGFubmVsc1wvQUNjZDMyZmI' +
				'5MTYzMzViYWRlYTM5YzVlYjliYzcxM2MxN1wvV1FjMTRlNzYzZWIwYzQ1MzY2OGY0NjJmNDE1MTViOGQ4MiIsIm1ldGhvZCI6IlB' +
				'PU1QiLCJhbGxvdyI6dHJ1ZX0seyJ1cmwiOiJodHRwczpcL1wvdGFza3JvdXRlci50d2lsaW8uY29tXC92MVwvV29ya3NwYWNlc1w' +
				'vV1M4MWM0NGQ4YWY4YzEyZmE1N2U1ZWUwYjZiNGU3NzcxZlwvVGFza1F1ZXVlc1wvV1FjMTRlNzYzZWIwYzQ1MzY2OGY0NjJmNDE' +
				'1MTViOGQ4MiIsIm1ldGhvZCI6IkdFVCIsImFsbG93Ijp0cnVlfSx7InVybCI6Imh0dHBzOlwvXC90YXNrcm91dGVyLnR3aWxpby5' +
				'jb21cL3YxXC9Xb3Jrc3BhY2VzXC9XUzgxYzQ0ZDhhZjhjMTJmYTU3ZTVlZTBiNmI0ZTc3NzFmXC9UYXNrUXVldWVzXC9XUWMxNGU' +
				'3NjNlYjBjNDUzNjY4ZjQ2MmY0MTUxNWI4ZDgyXC8qKiIsIm1ldGhvZCI6IkdFVCIsImFsbG93Ijp0cnVlLCJxdWVyeV9maWx0ZXI' +
				'iOnt9LCJwb3N0X2ZpbHRlciI6e319LHsidXJsIjoiaHR0cHM6XC9cL3Rhc2tyb3V0ZXIudHdpbGlvLmNvbVwvdjFcL1dvcmtzcGF' +
				'jZXNcL1dTODFjNDRkOGFmOGMxMmZhNTdlNWVlMGI2YjRlNzc3MWZcL1Rhc2tRdWV1ZXNcL1dRYzE0ZTc2M2ViMGM0NTM2NjhmNDY' +
				'yZjQxNTE1YjhkODIiLCJtZXRob2QiOiJQT1NUIiwiYWxsb3ciOnRydWUsInF1ZXJ5X2ZpbHRlciI6e30sInBvc3RfZmlsdGVyIjp' +
				'7fX1dfQ.gE2NUtDqSdjZDamDL69H7OIyxPan9I_C69oOgOOsH6c');

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
			workspace = new Twilio.TaskRouter.Workspace(
				'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2ZXJzaW9uIjoidjEiLCJmcmllbmRseV9uYW1lIjoiV1M4MWM0NGQ4YWY4YzE' +
				'yZmE1N2U1ZWUwYjZiNGU3NzcxZiIsImlzcyI6IkFDY2QzMmZiOTE2MzM1YmFkZWEzOWM1ZWI5YmM3MTNjMTciLCJleHAiOjE1MDk' +
				'2MjQ2ODIsImFjY291bnRfc2lkIjoiQUNjZDMyZmI5MTYzMzViYWRlYTM5YzVlYjliYzcxM2MxNyIsImNoYW5uZWwiOiJXUzgxYzQ' +
				'0ZDhhZjhjMTJmYTU3ZTVlZTBiNmI0ZTc3NzFmIiwid29ya3NwYWNlX3NpZCI6IldTODFjNDRkOGFmOGMxMmZhNTdlNWVlMGI2YjR' +
				'lNzc3MWYiLCJwb2xpY2llcyI6W3sidXJsIjoiaHR0cHM6XC9cL2V2ZW50LWJyaWRnZS50d2lsaW8uY29tXC92MVwvd3NjaGFubmV' +
				'sc1wvQUNjZDMyZmI5MTYzMzViYWRlYTM5YzVlYjliYzcxM2MxN1wvV1M4MWM0NGQ4YWY4YzEyZmE1N2U1ZWUwYjZiNGU3NzcxZiI' +
				'sIm1ldGhvZCI6IkdFVCIsImFsbG93Ijp0cnVlfSx7InVybCI6Imh0dHBzOlwvXC9ldmVudC1icmlkZ2UudHdpbGlvLmNvbVwvdjF' +
				'cL3dzY2hhbm5lbHNcL0FDY2QzMmZiOTE2MzM1YmFkZWEzOWM1ZWI5YmM3MTNjMTdcL1dTODFjNDRkOGFmOGMxMmZhNTdlNWVlMGI' +
				'2YjRlNzc3MWYiLCJtZXRob2QiOiJQT1NUIiwiYWxsb3ciOnRydWV9LHsidXJsIjoiaHR0cHM6XC9cL3Rhc2tyb3V0ZXIudHdpbGl' +
				'vLmNvbVwvdjFcL1dvcmtzcGFjZXNcL1dTODFjNDRkOGFmOGMxMmZhNTdlNWVlMGI2YjRlNzc3MWYiLCJtZXRob2QiOiJHRVQiLCJ' +
				'hbGxvdyI6dHJ1ZX0seyJ1cmwiOiJodHRwczpcL1wvdGFza3JvdXRlci50d2lsaW8uY29tXC92MVwvV29ya3NwYWNlc1wvV1M4MWM' +
				'0NGQ4YWY4YzEyZmE1N2U1ZWUwYjZiNGU3NzcxZlwvKioiLCJtZXRob2QiOiJHRVQiLCJhbGxvdyI6dHJ1ZSwicXVlcnlfZmlsdGV' +
				'yIjp7fSwicG9zdF9maWx0ZXIiOnt9fSx7InVybCI6Imh0dHBzOlwvXC90YXNrcm91dGVyLnR3aWxpby5jb21cL3YxXC9Xb3Jrc3B' +
				'hY2VzXC9XUzgxYzQ0ZDhhZjhjMTJmYTU3ZTVlZTBiNmI0ZTc3NzFmXC8qKiIsIm1ldGhvZCI6IlBPU1QiLCJhbGxvdyI6dHJ1ZSw' +
				'icXVlcnlfZmlsdGVyIjp7fSwicG9zdF9maWx0ZXIiOnt9fSx7InVybCI6Imh0dHBzOlwvXC90YXNrcm91dGVyLnR3aWxpby5jb21' +
				'cL3YxXC9Xb3Jrc3BhY2VzXC9XUzgxYzQ0ZDhhZjhjMTJmYTU3ZTVlZTBiNmI0ZTc3NzFmXC8qKiIsIm1ldGhvZCI6IkRFTEVURSI' +
				'sImFsbG93Ijp0cnVlLCJxdWVyeV9maWx0ZXIiOnt9LCJwb3N0X2ZpbHRlciI6e319XX0.xlwNWsmGnKiq6oypjF1A73Rb1fsLrWZ' + 'LP1HdDpt2v70');

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
			worker.update("ActivitySid", "WAac9dcc3b7052272d03a7472a2fd01bde");
		},

		onSetIdle: function() {
			worker.update("ActivitySid", "WAd16dc16de9ce4222078806efd1488b98");
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