sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/core/UIComponent"
], function(Controller, History, UIComponent) {
	"use strict";

	return Controller.extend("visionBoardProject.internproject.controller.BaseController", {

		getRouter : function () {
			return UIComponent.getRouterFor(this);
		},

		onNavBack: function () {
			var oHistory, sPreviousHash;

			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("appHome", {}, true /*no history*/);
			}
		},
        uploadRoute: function () {
               
             this.getRouter().getTargets().display("TargetUpload");
            //location.href = "../view/UploadPicture.html"


        },
        homeRoute: function () {
               
            this.getRouter().getTargets().display("TargetView1");
        },
        

        friendsRoute: function () {
            this.getRouter().getTargets().display("TargetFriends");
        },

        notificationsRoute: function () {
            this.getRouter().getTargets().display("TargetNotifications");        },

        profileRoute: function () {
            this.getRouter().getTargets().display("TargetProfile");        },

        profilePicRoute: function () {
            this.getRouter().getTargets().display("TargetProfilePic");        },

        onSearch: function (oEvent) {
            var aFilter = []; //filter options not created
            var sQuery = oEvent.getParameter("newValue");
            if (sQuery) {
                aFilter.push(new Filter("title", FilterOperator.Contains, sQuery));
            }
            var oList = this.byId("userGroup"); //userGroup, a db of usernames
            var oBinding = oList.getBinding("/items"); //items not in xml yet
            oBinding.filter(aFilter);
        }

	});

});