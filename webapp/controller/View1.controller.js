sap.ui.define([
    //"sap/ui/core/mvc/Controller",
    "visionBoardProject/internproject/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/UIComponent",
    'sap/m/Dialog',
	'sap/m/Image',
	'sap/m/Button',
    "sap/ui/core/format/DateFormat",
	"sap/m/MessageToast"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, UIComponent, JSONModel, MessageToast, DateFormat) {
        "use strict";

        return BaseController.extend("visionBoardProject.internproject.controller.View1", {
            onInit: function () {
              // var sPath = sap.ui.require.toUrl("file://..//home/user/projects/InternProject/webapp/data/UploadCollectionData.json")
               var sPath = jQuery.sap.getModulePath("visionBoardProject.internproject", "/data/UploadCollectionData.json");
                //var sPath = sap.ui.require.toUrl("../data/UploadCollectionData.json")
                this.getView().setModel(new sap.ui.model.json.JSONModel(sPath));
                
            },
            handleMessageToastPress: function(oEvent) {
                var msg = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy\r\n eirmod.';
                MessageToast.show(msg);
            }

          
            

        });

    });
