sap.ui.define([
	"sap/ui/Device"
], function (Device) {
	"use strict";

	return {
		initPageSettings: function (oView) {
			// Hide Settings Panel for phone
			// try to load sap.suite.ui.commons for using ChartContainer
			// sap.suite.ui.commons is available in sapui5-sdk-dist but not in demokit
			var libraries = sap.ui.getVersionInfo().libraries || [];
			var bSuiteAvailable = libraries.some(function (lib) {
				return lib.name.indexOf("sap.suite.ui.commons") > -1;
			});
			if (bSuiteAvailable) {
				jQuery.sap.require("sap/suite/ui/commons/ChartContainer");
				var vizframeInf = oView.byId("idVizFramePieInf");
				var oChartContainerContentInf = new sap.suite.ui.commons.ChartContainerContent({
					icon: "sap-icon://pie-chart",
					title: "vizFrame Pie Chart Sample",
					content: [vizframeInf]
				});
				var oChartContainerInf = new sap.suite.ui.commons.ChartContainer({
					content: [oChartContainerContentInf]
				});
				oChartContainerInf.setShowFullScreen(true);
				oChartContainerInf.setAutoAdjustHeight(true);
				oChartContainerInf.setShowZoom(false);
				
				oView.byId("fixFlexInf").setFlexContent(oChartContainerInf);
				
				var vizframeOut = oView.byId("idVizFramePieOut");
				var oChartContainerContentOut = new sap.suite.ui.commons.ChartContainerContent({
					icon: "sap-icon://pie-chart",
					title: "vizFrame Pie Chart Sample",
					content: [vizframeOut]
				});
				var oChartContainerOut = new sap.suite.ui.commons.ChartContainer({
					content: [oChartContainerContentOut]
				});
				oChartContainerOut.setShowFullScreen(true);
				oChartContainerOut.setAutoAdjustHeight(true);
				oChartContainerOut.setShowZoom(false);
				
				oView.byId("fixFlexOut").setFlexContent(oChartContainerOut);
				
			}
		}
	};
});