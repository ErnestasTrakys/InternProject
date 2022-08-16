sap.ui.define([
    //"sap/ui/core/mvc/Controller",
    "visionBoardProject/internproject/controller/BaseController",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/UIComponent",
    'sap/m/Dialog',
	'sap/m/Image',
	'sap/m/Button',
    "sap/ui/core/format/DateFormat"

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
            
           
            onlikePress : function () {
                sap.m.MessageToast.show("Liked");
            },

            oncommentPress : function () {
                //var oResponsivePopoverOpener = this.getView().byId("openResponsivePopoverButton");
                //var oResponsivePopover = this.getView().byId("helloResponsivePopover");
                //oResponsivePopover.showAt(oResponsivePopoverOpener);
                sap.m.MessageToast.show("Comments temporarily disabled.")
            },

            handleClose: function () {
			var oResponsivePopover = this.getView().byId("helloResponsivePopover");
			oResponsivePopover.close();
		    },
            
            onListItemPress: function (oEvent) {
			    sap.m.MessageToast.show("Post by: " + oEvent.getSource().getTitle() + "  |  " + oEvent.getSource().getDatetime() );
		    }


          
            

        });

    });
