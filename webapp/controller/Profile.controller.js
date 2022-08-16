sap.ui.define([
    //"sap/ui/core/mvc/Controller",
    "visionBoardProject/internproject/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController) {
        "use strict";

        return BaseController.extend("visionBoardProject.internproject.controller.Profile", {
            onInit: function () {
                var sPath = jQuery.sap.getModulePath("visionBoardProject.internproject", "/data/ProfileCollectionDate.json");
                this.getView().setModel(new sap.ui.model.json.JSONModel(sPath));
                
            },

           
            
           
        });

    });
