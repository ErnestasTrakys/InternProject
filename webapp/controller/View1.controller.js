sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("visionBoardProject.internproject.controller.View1", {
            onInit: function () {
                
            },
            onSubmitRoute: function () {
                let oModel = this.getView().getModel("userSelection")
                let selectedModelPath = oEvent.getSource().getBindingContext().sPath
                oModel.setProperty("/selectedItemPath", selectedModelPath)

                let reqSettings = {
                    "url" : "/browse/"
                }
            },

            onSearch: function (oEvent) {
                var aFilter = [];
                var sQuery = oEvent.getParameter("newValue");
                if (sQuery) {
                    aFilter.push(new Filter("title", FilterOperator.Contains, sQuery));
                }
                var oList = this.byId("userGroup");
                var oBinding = oList.getBinding("items");
                oBinding.filter(aFilter);
            }

        });

    });
