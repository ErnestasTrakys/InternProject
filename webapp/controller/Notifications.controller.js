sap.ui.define([
    //"sap/ui/core/mvc/Controller",
    "visionBoardProject/internproject/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/core/library",
    "sap/m/Link",
    "sap/m/MessageStrip",
	"sap/m/MessageToast",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, coreLibrary, Link, MessageStrip, MessageToast) {
        "use strict";

        var MessageType = coreLibrary.MessageType

        return BaseController.extend("visionBoardProject.internproject.controller.Notifications", {
            onInit: function () {
                var sPath = jQuery.sap.getModulePath("visionBoardProject.internproject", "/data/NotificationCollectionData.json");
                this.getView().setModel(new sap.ui.model.json.JSONModel(sPath));
            },
            onListItemPress: function (oEvent) {
                MessageToast.show("Item Pressed: " + oEvent.getSource().getTitle());
            },
    
            onItemClose: function (oEvent) {
                var oItem = oEvent.getSource(),
                    oList = oItem.getParent();
    
                oList.removeItem(oItem);
                MessageToast.show("Item Closed: " + oItem.getTitle());
            },
    
            onRejectPress: function () {
                MessageToast.show("Reject Button Pressed");
            },
    
            onAcceptPress: function () {
                MessageToast.show("Accept Button Pressed");
            },
    
            onErrorPress: function (oEvent) {
                var oMessageStrip = new MessageStrip({
                    type: MessageType.Error,
                    showIcon: true,
                    showCloseButton: true,
                    text: "Error: Something went wrong.",
                    link: new Link({
                        text: "SAP CE",
                        href: "http://www.sap.com/",
                        target: "_blank"
                    })
                });
    
                var oNotificationListItem = oEvent.getSource().getParent().getParent();
                oNotificationListItem.setProcessingMessage(oMessageStrip);
            }
           
            
           
        });

    });
