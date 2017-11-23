sap.ui.define([
	'sap/ui/core/Control'
], function(Control) {
	'use strict';

	var CHART_CANVAS_NAME_PREFIX = 'c3JSChart';

	return Control.extend('demo.control.C3JSControl', {
		metadata: {
			properties: {
				data: {
					type: 'object'
				},
				gauge:{
					type: 'object'
				},
				color:{
					type: 'string'
				}
			},
			events: {
				unload: {
					enablePreventDefault: true,
					chartIDs: {
						type: 'string[]'
					}
				}
			}
		},

		init: function() {
			var _newCustomChart;
		},

		onBeforeRendering: function() {

		},

		onAfterRendering: function() {
			var chartData = this.getData();
			var gaugeData = this.getGauge();
			//var colorData = this.getColor();
			// required due to lifecycle calls > init of undefined vars
			if (chartData === undefined) {
				return;
			}
			//debugger;
			this._newCustomChart = c3.generate({
				bindto: '#' + CHART_CANVAS_NAME_PREFIX + this.getId(),
				data: chartData,
				gauge: gaugeData,
				//color: '#FFA07A',
				color: {
					pattern: ['#60B044','#FF0000'], // the three color levels for the percentage values.
					threshold: {
						//            unit: 'value', // percentage is default
						//            max: 200, // 100 is default
						//values: [30,60,90,100]
						values: [80,100]
					}
				},
				size: {
					height: 150,
					width: 150
				}
			});

		},

		exit: function() {
			this._newCustomChart.destroy();
		},

		renderer: function(oRm, oControl) {
			var oBundle = oControl.getModel('i18n').getResourceBundle();

			//Create the control
			oRm.write('<div');
			oRm.writeControlData(oControl);
			oRm.addClass("C3JSControl");
			oRm.addClass("sapUiResponsiveMargin");
			oRm.writeClasses();
			oRm.write('>');

			oRm.write('<div id="' + CHART_CANVAS_NAME_PREFIX + oControl.getId() + '"></div>');

			oRm.write('</div>');
		},

		unload: function(chartIDs) {
			this._newCustomChart.unload({
				ids: chartIDs
			});
		}
	});
});