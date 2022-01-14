/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/borusan/fi_cash_manage/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});