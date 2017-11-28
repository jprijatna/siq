sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
	"use strict";

	var worker;

	var interval;

	var that = this;

	var transcriptText;

	var scoreText;
	var magnitudeText;
	var sentimentText;

	var hook = '';

	var chart = '';
	var finalString = '';
	var count = 0;
	
	var selectedScript = '';
	
	var logName;
	var logAccount;
	var logSentiment;
	var logDate;

	return Controller.extend("com.deloitte.smartservice.SMARTSERVICE.controller.CallLog", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.deloitte.smartservice.SMARTSERVICE.view.CallLog
		 */
		//	onInit: function() {
		//
		//	},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.deloitte.smartservice.SMARTSERVICE.view.CallLog
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.deloitte.smartservice.SMARTSERVICE.view.CallLog
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.deloitte.smartservice.SMARTSERVICE.view.CallLog
		 */
		//	onExit: function() {
		//
		//	}

		/* Subscribe to a subset of the available Worker.js events */

		//const twiml = new VoiceResponse();

		onInit: function() {
			// Initialize TaskRouter.js on page load using window.workerToken -
			// a Twilio Capability token that was set in a &lt;script> in agent.php
			transcriptText = this.getView().byId("transcriptText");
			scoreText = this.getView().byId("scoreText");
			magnitudeText = this.getView().byId("magnitudeText");
			sentimentText = this.getView().byId("sentimentText");
			
			logName = this.getView().byId("logName");
			logAccount = this.getView().byId("logAccount");
			logSentiment = this.getView().byId("logSentiment");
			logDate = this.getView().byId("logDate");

			chart = this.getView().byId("sentimentChart");

			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData([]);
			sap.ui.getCore().setModel(oModel);

			var socket = io('http://35.184.43.189:3000');
			socket.on('connect', function() {
				//socket.emit('customer', "testing dual emit");
				console.log(socket.id);
				console.log('SUCCESS');
			});
			socket.on('bot', function(msg) {
				//finalString = finalString + "\n" + "Agent: " + msg + "\n";
				transcriptText.setValue(transcriptText.getValue() + "\n" + "---------" + "Agent: " + msg + "---------");
				transcriptText.scrollTop = transcriptText.scrollHeight;
				console.log("Agent: " + msg);
			});
			socket.on('customer', function(msg) {
				//finalString = finalString + "Customer: " +msg;
				transcriptText.setValue(transcriptText.getValue() + "\n" + "Customer: " + msg);
				transcriptText.scrollTop = transcriptText.scrollHeight;
				selectedScript = msg;
				//hook = msg;
				//var oModel = sap.ui.getCore().getModel();
				// var oData = oModel.getProperty("/");
				// var oNewObject = {
				// 	"Value": "Customer: "
				// };
				// oData.push(oNewObject);
				// oModel.setProperty("/", oData);
				console.log("Customer: " + msg);
			});

			interval = setInterval(function() {
				if (transcriptText.getValue().includes("Thank you for calling.") || transcriptText.getValue().includes("Thank you for your purchase!") || transcriptText.getValue().includes("Let me connect you to my colleague.") ) {
					clearInterval(interval);
					logName.setValue = '';
					logAccount.setValue = '';
					logSentiment.setValue = '';
					logDate.setValue = '';
				} else if(selectedScript === '') {
					//do nothing
				} else {
					logName.setValue = 'Richard Sanchez';
					logAccount.setValue = 'Government';
					logSentiment.setValue = 'Negative';
					logDate.setValue = '27/11/2017';
					$.ajax({
						url: 'https://language.googleapis.com/v1beta2/documents:analyzeSentiment?key=AIzaSyBNKF2Cx_GliJEN714dn4V0HevjzZUejHY',
						type: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						dataType: 'json',
						data: JSON.stringify({
							"document": {
								"content": selectedScript,
								"type": "PLAIN_TEXT"
							}
						}),
						success: function(response) {
							console.log(response.documentSentiment);
							var sentimentScore = response.documentSentiment.score;
							var sentimentMagnitude = response.documentSentiment.magnitude;
							scoreText.setText(sentimentScore);
							magnitudeText.setText(sentimentMagnitude);
							var value = 1;
							if (sentimentScore === 0.00 && sentimentMagnitude >= 0.00) {
								value = 1;
								sentimentText.setText("Mixed");
							} else if (sentimentScore >= 0.00 && sentimentMagnitude === 0.00) {
								value = 1;
								sentimentText.setText("Neutral");
							} else if (sentimentScore >= 0.00 && sentimentMagnitude >= 0.00) {
								value = 2;
								sentimentText.setText("Positive");
							} else if (sentimentScore < 0.00 && sentimentMagnitude >= 0.00) {
								value = 0;
								sentimentText.setText("Negative");
							}
							chart.getProperty("data").labels.push("");
							chart.getProperty("data").datasets[0].data[count] = value;
							count += 1;
							chart.update();
						},
						error: function(e) {
							if (e.status === 200 || e.status === 201) {
								MessageToast.show('Notes Saved.');
							} else {
								console.log("Error");
								console.log(e);
							}
						}
					});
				}
			}, 2000);

			/*console.log("initialising");
			this.logger("Initializing...");
			worker = new Twilio.TaskRouter.Worker(
				'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2ZXJzaW9uI' +
				'joidjEiLCJmcmllbmRseV9uYW1lIjoiV0s1MDEyMTFjYTc4MDc' +
				'1OTA1MTc2ODNhNGRlZWU2ZTlhOSIsImlzcyI6IkFDMjZmZDdhN' +
				'mM5YTg3ODgxYmNhYjVhNGRmNGRiYzdlZmMiLCJleHAiOjE1MDc' +
				'3OTYxMDUsImFjY291bnRfc2lkIjoiQUMyNmZkN2E2YzlhODc4O' +
				'DFiY2FiNWE0ZGY0ZGJjN2VmYyIsImNoYW5uZWwiOiJXSzUwMTI' +
				'xMWNhNzgwNzU5MDUxNzY4M2E0ZGVlZTZlOWE5Iiwid29ya3NwY' +
				'WNlX3NpZCI6IldTZTEwYjRlYTFkZmFhYTJmODk1Mzk0ZjdmZWE' +
				'zMTA2ZTEiLCJ3b3JrZXJfc2lkIjoiV0s1MDEyMTFjYTc4MDc1O' +
				'TA1MTc2ODNhNGRlZWU2ZTlhOSIsInBvbGljaWVzIjpbeyJ1cmw' +
				'iOiJodHRwczpcL1wvZXZlbnQtYnJpZGdlLnR3aWxpby5jb21cL' +
				'3YxXC93c2NoYW5uZWxzXC9BQzI2ZmQ3YTZjOWE4Nzg4MWJjYWI' +
				'1YTRkZjRkYmM3ZWZjXC9XSzUwMTIxMWNhNzgwNzU5MDUxNzY4M' +
				'2E0ZGVlZTZlOWE5IiwibWV0aG9kIjoiR0VUIiwiYWxsb3ciOnR' +
				'ydWV9LHsidXJsIjoiaHR0cHM6XC9cL2V2ZW50LWJyaWRnZS50d' +
				'2lsaW8uY29tXC92MVwvd3NjaGFubmVsc1wvQUMyNmZkN2E2Yzl' +
				'hODc4ODFiY2FiNWE0ZGY0ZGJjN2VmY1wvV0s1MDEyMTFjYTc4M' +
				'Dc1OTA1MTc2ODNhNGRlZWU2ZTlhOSIsIm1ldGhvZCI6IlBPU1Q' +
				'iLCJhbGxvdyI6dHJ1ZX0seyJ1cmwiOiJodHRwczpcL1wvdGFza' +
				'3JvdXRlci50d2lsaW8uY29tXC92MVwvV29ya3NwYWNlc1wvV1N' +
				'lMTBiNGVhMWRmYWFhMmY4OTUzOTRmN2ZlYTMxMDZlMVwvV29ya' +
				'2Vyc1wvV0s1MDEyMTFjYTc4MDc1OTA1MTc2ODNhNGRlZWU2ZTl' +
				'hOSIsIm1ldGhvZCI6IkdFVCIsImFsbG93Ijp0cnVlfSx7InVyb' +
				'CI6Imh0dHBzOlwvXC90YXNrcm91dGVyLnR3aWxpby5jb21cL3Y' +
				'xXC9Xb3Jrc3BhY2VzXC9XU2UxMGI0ZWExZGZhYWEyZjg5NTM5N' +
				'GY3ZmVhMzEwNmUxXC9BY3Rpdml0aWVzIiwibWV0aG9kIjoiR0V' +
				'UIiwiYWxsb3ciOnRydWV9LHsidXJsIjoiaHR0cHM6XC9cL3Rhc' +
				'2tyb3V0ZXIudHdpbGlvLmNvbVwvdjFcL1dvcmtzcGFjZXNcL1d' +
				'TZTEwYjRlYTFkZmFhYTJmODk1Mzk0ZjdmZWEzMTA2ZTFcL1Rhc' +
				'2tzXC8qKiIsIm1ldGhvZCI6IkdFVCIsImFsbG93Ijp0cnVlfSx' +
				'7InVybCI6Imh0dHBzOlwvXC90YXNrcm91dGVyLnR3aWxpby5jb' +
				'21cL3YxXC9Xb3Jrc3BhY2VzXC9XU2UxMGI0ZWExZGZhYWEyZjg' +
				'5NTM5NGY3ZmVhMzEwNmUxXC9Xb3JrZXJzXC9XSzUwMTIxMWNhN' +
				'zgwNzU5MDUxNzY4M2E0ZGVlZTZlOWE5XC9SZXNlcnZhdGlvbnN' +
				'cLyoqIiwibWV0aG9kIjoiR0VUIiwiYWxsb3ciOnRydWV9LHsid' +
				'XJsIjoiaHR0cHM6XC9cL3Rhc2tyb3V0ZXIudHdpbGlvLmNvbVw' +
				'vdjFcL1dvcmtzcGFjZXNcL1dTZTEwYjRlYTFkZmFhYTJmODk1M' +
				'zk0ZjdmZWEzMTA2ZTFcL1dvcmtlcnNcL1dLNTAxMjExY2E3ODA' +
				'3NTkwNTE3NjgzYTRkZWVlNmU5YTkiLCJtZXRob2QiOiJQT1NUI' +
				'iwiYWxsb3ciOnRydWUsInF1ZXJ5X2ZpbHRlciI6e30sInBvc3R' +
				'fZmlsdGVyIjp7IkFjdGl2aXR5U2lkIjp7InJlcXVpcmVkIjp0c' +
				'nVlfX19XX0.N_6K-bUuYBiWbdwksjUg6sn74y6NHMCDS4WWDrr' +
				'Pj5U');

			worker.on('ready', function(worker) {
				console.log("Successfully registered as: " + worker.friendlyName);
				console.log("Current activity is: " + worker.activityName);
			});
			this.registerTaskRouterCallbacks();
			this.bindAgentActivityButtons();*/
		},

		stopInterval: function() {
			clearInterval(interval);
		},

		onAfterRendering: function() {
			var data = {
				labels: [],
				datasets: [{
					label: "Number of People",
					fill: false,
					lineTension: 0.1,
					backgroundColor: "rgba(75,192,192,0.4)",
					borderColor: "rgba(75,192,192,1)",
					borderCapStyle: 'butt',
					borderDash: [],
					borderDashOffset: 0.0,
					borderJoinStyle: 'miter',
					pointBorderColor: "rgba(75,192,192,1)",
					pointBackgroundColor: "#fff",
					pointBorderWidth: 1,
					pointHoverRadius: 5,
					pointHoverBackgroundColor: "rgba(75,192,192,1)",
					pointHoverBorderColor: "rgba(220,220,220,1)",
					pointHoverBorderWidth: 2,
					pointRadius: 5,
					pointHitRadius: 10,
					data: []
				}]
			};

			chart.setData(data);
			//chart.getProperty("data").labels = [];
			//chart.getProperty("data").datasets[0].data = [];
			chart.update();
		},

		registerTaskRouterCallbacks: function() {
			var that = this;
			worker.on('ready', function(worker) {
				that.agentActivityChanged(worker.activityName);
				console.log("Successfully registered as: " + worker.friendlyName);
				console.log("Current activity is: " + worker.activityName);
			});

			worker.on('activity.update', function(worker) {
				that.agentActivityChanged(worker.activityName);
				console.log("Worker activity changed to: " + worker.activityName);

				if (worker.activityName === 'Idle') {
					that.logger("Testing");
				}
			});

			worker.on("reservation.created", function(reservation) {
				console.log("-----");
				console.log("You have been reserved to handle a call!");
				console.log("Call from: " + reservation.task.attributes.from);
				console.log("Selected language: " + reservation.task.attributes.selected_language);
				console.log("-----");
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

		buttonPress: function() {
			worker.update("ActivitySid", "WAb9f3381b59b319e65f8d86463e0ab3c7");
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

		sendTicket: function() {
			var data = {
				"ServicePriorityCode": "2",
				"Name": {
					"content": "Call Ticket #7"
				},
				"ServiceRequestDescription": [{
					"Text": "Generic OData Test Create",
					"TypeCode": "10003"
				}]
			};

			$.ajax({
				url: 'https://my302956.crm.ondemand.com/sap/c4c/odata/v1/c4codata/ServiceRequestCollection',
				type: 'POST',
				headers: {
					'Authorization': 'Basic QURNSU5JU1RSQVRJT04wMTpXZWxjb21lMQ==',
					'Content-Type': 'application/json',
					'X-CSRF-Token': 'f6GlhZ1G_R4ZvrIAQGi8MA=='
				},
				dataType: 'json',
				data: data,
				success: function(response) {
					MessageToast.show('Notes Saved.');
				},
				error: function(e) {
					if (e.status === 200 || e.status === 201) {
						MessageToast.show('Notes Saved.');
					} else {
						console.log("Error");
						console.log(e);
					}
				}
			});
		},

		startReceive: function() {
			//this.ajaxCall();
			//interval = setInterval(this.ajaxCall, 500);
			$.ajax({
				url: 'http://35.201.2.126:3000',
				type: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				data: {
					"UnstableSpeechResult": "Blahblahblah"
				},
				success: function(response) {
					transcriptText.setValue(response);
					console.log(response);
				},
				error: function(e) {
					if (e.status === 200 || e.status === 201) {
						MessageToast.show('Notes Saved.');
					} else {
						console.log("Error");
						console.log(e);
					}
				}
			});
		},

		stopReceive: function() {
			//clearInterval(interval);
			var socket = io('https://f6b62b47.ngrok.io');
			socket.on('connect', function() {
				socket.send('hi');
				console.log(socket.id);
				console.log('SUCCESS');
				socket.on('chat message', function(msg) {
					console.log(msg);
				});
			});
		},

		ajaxCall: function() {
			console.log("Running");
			that = this;
			$.ajax({
				url: 'https://us-central1-leonardo-2a5dc.cloudfunctions.net/pullTranscribeSub',
				type: 'GET',
				success: function(response) {
					if (response) {
						transcriptText.setValue(response);
						console.log(response);
					}
					/*for(var i = 0; i < response.transcript.length; i++){
						console.log("Sequence #"+response.transcript[0].attributes.Sequence);
						console.log(response.transcript[0].attributes.UnstableSpeechResult);
						console.log("------------------------------------------------------");
					}*/
					//console.log(response);
					//alert(response);
				},
				error: function(e) {
					if (e.status === 200 || e.status === 201) {
						MessageToast.show('Notes Saved.');
					} else {
						console.log("Error");
						console.log(e);
					}
				}
			});
		}
	});
});