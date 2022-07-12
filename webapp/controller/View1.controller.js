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
            // onSubmitRoute: function () {
            //     let oModel = this.getView().getModel("userSelection")
            //     let selectedModelPath = oEvent.getSource().getBindingContext().sPath //not 100% but control's 'click'
            //     oModel.setProperty("/selectedItemPath", selectedModelPath)

            //     let reqSettings = {
            //         "url" : "/browse/", //need to route
            //         "method": "POST", //<-probably wrong
            //     }


            // },

            uploadRoute: function (oEvent) {
                // location.href = "https://port8080-workspaces-ws-4kj4r.eu10.applicationstudio.cloud.sap/test/flpSandbox.html?sap-ui-xx-viewCache=false#Shell-home"
                
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			    return oRouter.navTo("Upload", {} );

                
            },

            friendsRoute: function () {
                location.href = "https://port8080-workspaces-ws-4kj4r.eu10.applicationstudio.cloud.sap/test/flpSandbox.html?sap-ui-xx-viewCache=false#Shell-home"
            },

            notificationsRoute: function () {
                location.href = "https://port8080-workspaces-ws-4kj4r.eu10.applicationstudio.cloud.sap/test/flpSandbox.html?sap-ui-xx-viewCache=false#Shell-home"
            },

            profileRoute: function () {
                location.href = "https://port8080-workspaces-ws-4kj4r.eu10.applicationstudio.cloud.sap/test/flpSandbox.html?sap-ui-xx-viewCache=false#Shell-home"
            },

            settingsRoute: function () {
                location.href = "https://port8080-workspaces-ws-4kj4r.eu10.applicationstudio.cloud.sap/test/flpSandbox.html?sap-ui-xx-viewCache=false#Shell-home"
            },

            onSearch: function (oEvent) {
                var aFilter = []; //filter options not created
                var sQuery = oEvent.getParameter("newValue");
                if (sQuery) {
                    aFilter.push(new Filter("title", FilterOperator.Contains, sQuery));
                }
                var oList = this.byId("userGroup"); //userGroup, a db of usernames
                var oBinding = oList.getBinding("items"); //items not in xml yet
                oBinding.filter(aFilter);
            }

        });

    });
