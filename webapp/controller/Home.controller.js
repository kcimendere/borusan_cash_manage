sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/viz/ui5/format/ChartFormatter",
	"sap/viz/ui5/api/env/Format",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/table/Column",
	"sap/m/Text",
	"sap/m/Label",
	"com/borusan/fi_cash_manage/Util/InitPieCharts"
], function (Controller, ChartFormatter, Format, JSONModel, Filter, FilterOperator, Column, Text, Label, InitPageUtil) {
	"use strict";

	return Controller.extend("com.borusan.fi_cash_manage.controller.Home", {
		onInit: function () {
			var oJSONModel = new JSONModel({
				"detailVisible": false,
				"chartVisible": false,
				"tableVisible": true,

			});
			this.getView().setModel(oJSONModel, "ui");

		},
		onAfterRendering: function () {
			var that = this;
			Format.numericFormatter(ChartFormatter.getInstance());
			this.vizProperties = {
				plotArea: {
					dataLabel: {
						visible: true,
						formatString: ChartFormatter.DefaultPattern.SHORTFLOAT_MFD2
					}
				},
				valueAxis: {
					label: {
						formatString: ChartFormatter.DefaultPattern.SHORTFLOAT
					},
					title: {
						visible: false
					}
				},
				categoryAxis: {
					title: {
						visible: false
					}
				},
				title: {
					visible: true,
					text: that.getView().getModel("i18n").getResourceBundle().getText("referenceLineTitle")
				}
			};
			this.getView().byId("idVizFrame").setVizProperties(this.vizProperties);

			var oVizFramePieOut = this.oVizFrame = this.getView().byId("idVizFramePieOut");
			oVizFramePieOut.setVizProperties({
				legend: {
					title: {
						visible: true
					}
				},
				title: {
					visible: true,
					text: that.getView().getModel("i18n").getResourceBundle().getText("pieCharOutflowTitle")
				}
			});
			oVizFramePieOut.setVizProperties({
                    plotArea: {
                        dataLabel: {
                            visible: true
                        }
                    }
                });
			var oVizFramePieInf = this.oVizFrame = this.getView().byId("idVizFramePieInf");
			oVizFramePieInf.setVizProperties({
				legend: {
					title: {
						visible: true
					}
				},
				title: {
					visible: true,
					text: that.getView().getModel("i18n").getResourceBundle().getText("pieCharInflowTitle")
				}
			});			
			oVizFramePieInf.setVizProperties({
                    plotArea: {
                        dataLabel: {
                            visible: true
                        }
                    }
                });
			InitPageUtil.initPageSettings(this.getView());
		},
		handleSearch: function (oEvent) {
			// if(!this.pieChartSelected){
			this.getView().byId("idVizFrame").getDataset().getBinding("data").filter(oEvent.getSource().getFilters());
			// }else{
			this.getView().byId("idVizFramePieInf").getDataset().getBinding("data").filter(oEvent.getSource().getFilters());
			this.getView().byId("idVizFramePieOut").getDataset().getBinding("data").filter(oEvent.getSource().getFilters());

			// }
		},
		handlePieChartSwitch: function (oEvent) {
			this.pieChartSelected = oEvent.getParameter("selected");
			this.getView().byId("pieChartVbox").setVisible(this.pieChartSelected);
			this.getView().byId("idVizFrame").setVisible(!this.pieChartSelected);

		},
		handleCloseDetail: function (oEvent) {
			this.getView().getModel("ui").setProperty("/detailVisible", false);
			this.getView().getModel("ui").refresh();
			this.getView().byId("LineItemsSmartTable").getTable().clearSelection();
		},
		handleRowSelect: function (oEvent) {
			var that = this;
			var oSmartFilterBar = this.getView().byId("smartFilterBar");
			// var aFilters = oSmartFilterBar.getFilters();
			var oRowData = oEvent.getParameter("rowContext").getObject();
			var aFilters = [];
			var oDate = oSmartFilterBar.getFilterData().Date;
			if (oDate) {
				aFilters.push(new Filter("Date", FilterOperator.EQ, oDate));
			}
			aFilters.push(new Filter("Hktid", FilterOperator.EQ, oRowData.Hktid));
			aFilters.push(new Filter("Hbkid", FilterOperator.EQ, oRowData.Hbkid));
			aFilters.push(new Filter("Bukrs", FilterOperator.EQ, oRowData.Bukrs));
			var oDataModel = this.getOwnerComponent().getModel();
			oDataModel.read("/DetailSet", {
				filters: aFilters,
				success: function (data, resp) {
					that.getView().getModel("ui").setProperty("/detailVisible", true);
					that.getView().getModel("ui").setProperty("/detailData", that.transposeData(data.results));
					that.getView().getModel("ui").refresh();
				},
				error: function (oError) {}
			});
		},
		transposeData: function (data) {
			var aColumns = [];
			var oRow = {};
			let result = {};
			var finalRes = {
				"columns": [],
				"data": []
			};
			for (let row of data) {
				for (let [key, value] of Object.entries(row)) {
					result[key] = result[key] || [];
					result[key].push(value);
				}
			}
			var len = result["GroupF"].length;
			for (var k = 0; k < len; k++) {
				aColumns.push({
					"name": result["GroupF"][k],
					"desc": result["ScrtextL"][k]
				})
			}
			for (var k = 0; k < len; k++) {
				oRow[result["GroupF"][k]] = result["Value"][k]
			}
			finalRes.columns = aColumns;
			finalRes.data.push(oRow);
			return finalRes;
		},
		columnFactory: function (sId, oContext) {
			var sName = oContext.getProperty("name");
			var sDesc = oContext.getProperty("desc");
			return new Column({
				width: "11rem",
				label: new Label({
					text: sDesc
				}),
				template: new Text({
					text: {
						path: "ui>" + sName
					},
					wrapping: false
				})
			})

		},
		handleSeeDetail: function (oEvent) {
			var that = this;
			var oSmartFilterBar = this.getView().byId("smartFilterBarMobile");
			var oRowData = oEvent.getSource().getBindingContext().getObject();
			var aFilters = [];
			var oDate = oSmartFilterBar.getFilterData().Date;
			aFilters.push(new Filter("Hktid", FilterOperator.EQ, oRowData.Hktid));
			aFilters.push(new Filter("Hbkid", FilterOperator.EQ, oRowData.Hbkid));
			aFilters.push(new Filter("Bukrs", FilterOperator.EQ, oRowData.Bukrs));
			if (oDate) {
				aFilters.push(new Filter("Date", FilterOperator.EQ, oDate));
			}
			var oDataModel = this.getOwnerComponent().getModel();
			oDataModel.read("/DetailSet", {
				filters: aFilters,
				success: function (data, resp) {
					that.getView().getModel("ui").setProperty("/mobileDetailData", data.results);
					that.getView().getModel("ui").refresh();
					that.openMobileDetailDialog();
				},
				error: function (oError) {}
			});
		},
		openMobileDetailDialog: function () {
			if (this._oMobileDialog) this._oMobileDialog.destroy();

			this._oMobileDialog = sap.ui.xmlfragment(this.getView().getId(), "com.borusan.fi_cash_manage.view.fragment.MobileDetail", this);
			this.getView().addDependent(this._oMobileDialog);

			this._oMobileDialog.open();
		},
		onMobileDialogClose: function (oEvent) {
			this._oMobileDialog.close();
		},
		handleSeeCharts:function(oEvent){
			this.getView().getModel("ui").setProperty("/chartVisible", true);
			this.getView().getModel("ui").setProperty("/tableVisible", false);
			this.getView().getModel("ui").refresh();
		},
		handleSeeTables:function(oEvent){
			this.getView().getModel("ui").setProperty("/chartVisible", false);
			this.getView().getModel("ui").setProperty("/tableVisible", true);
			this.getView().getModel("ui").refresh();
		}
		
	});
});