sap.ui.define([
    //"sap/ui/core/mvc/Controller",
    "visionBoardProject/internproject/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/m/UploadCollectionItem",
    "sap/ui/thirdparty/jquery",
    "sap/ui/model/FilterOperator",
    "sap/m/library",
    "sap/base/util/deepExtend",
    "sap/m/UploadCollectionParameter",
    "sap/ui/core/format/FileSizeFormat"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, jQuery, MessageToast, MessageBox, UploadCollectionItem, JSONModel, deepExtend, UploadCollectionParameter, FileSizeFormat) {
        "use strict";

        return BaseController.extend("visionBoardProject.internproject.controller.Upload", {

                onInit: function() {
                    var sPath;
        
                    // set mock data
                    sPath = sap.ui.require.toUrl("file://../data/UploadCollectionData.json");
                    this.getView().setModel(new sap.ui.model.json.JSONModel(sPath));
        
                    // Sets the text to the label
                    this.byId("UploadCollection").addEventDelegate({
                        onBeforeRendering: function() {
                            this.byId("attachmentTitle").setText(this.getAttachmentTitleText());
                        }.bind(this)
                    });
        
                    // Flag to track if the upload of the new version was triggered by the Upload a new version button.
                    this.bIsUploadVersion = false;
                },
        
                formatAttribute: function(sValue, sType) {
                    if (sType === "size") {
                        return FileSizeFormat.getInstance({
                            binaryFilesize: false,
                            maxFractionDigits: 1,
                            maxIntegerDigits: 3
                        }).format(sValue);
                    } else {
                        return sValue;
                    }
                },
        
                onChange: function(oEvent) {
                    var oUploadCollection = oEvent.getSource();
                    // Header Token
                    var oCustomerHeaderToken = new UploadCollectionParameter({
                        name: "x-csrf-token",
                        value: "securityTokenFromModel"
                    });
                    oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
        
                },
        
                onFileSizeExceed: function(oEvent) {
                    MessageToast.show("FileSizeExceed event triggered.");
                },
        
                onTypeMissmatch: function(oEvent) {
                    MessageToast.show("TypeMissmatch event triggered.");
                },
        
                onUploadComplete: function(oEvent) {
                    // If the upload is triggered by a new version, this function updates the metadata of the old file and deletes the progress indicator once the upload was finished.
                    if (this.bIsUploadVersion) {
                        this.updateFile(oEvent.getParameters());
                    } else {
                        var oData = this.byId("UploadCollection").getModel().getData();
                        var aItems = deepExtend({}, oData).items;
                        var oItem = {};
                        var sUploadedFile = oEvent.getParameter("files")[0].fileName;
                        // at the moment parameter fileName is not set in IE9
                        if (!sUploadedFile) {
                            var aUploadedFile = (oEvent.getParameters().getSource().getProperty("value")).split(/\" "/);
                            sUploadedFile = aUploadedFile[0];
                        }
                        oItem = {
                            "documentId": Date.now().toString(), // generate Id,
                            "fileName": sUploadedFile,
                            "mimeType": "",
                            "thumbnailUrl": "",
                            "url": "",
                            "attributes": [
                                {
                                    "title": "Uploaded By",
                                    "text": "You"
                                },
                                {
                                    "title": "Uploaded On",
                                    "text": new Date().toLocaleDateString()
                                },
                                {
                                    "title": "File Size",
                                    "text": "505000"
                                },
                                {
                                    "title": "Version",
                                    "text": "1"
                                }
                            ]
                        };
                        aItems.unshift(oItem);
                        this.byId("UploadCollection").getModel().setData({
                            "items": aItems
                        });
                        // Sets the text to the label
                        this.byId("attachmentTitle").setText(this.getAttachmentTitleText());
                    }
        
                    // delay the success message for to notice onChange message
                    setTimeout(function() {
                        MessageToast.show("UploadComplete event triggered.");
                    }, 4000);
                },
        
                onBeforeUploadStarts: function(oEvent) {
                    // Header Slug
                    var oCustomerHeaderSlug = new UploadCollectionParameter({
                        name: "slug",
                        value: oEvent.getParameter("fileName")
                    });
                    oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
                    MessageToast.show("BeforeUploadStarts event triggered.");
                },
        
                getAttachmentTitleText: function() {
                    var aItems = this.byId("UploadCollection").getItems();
                    return "Uploaded (" + aItems.length + ")";
                },
        
                onDownloadItem: function() {
                    var oUploadCollection = this.byId("UploadCollection");
                    var aSelectedItems = oUploadCollection.getSelectedItems();
                    if (aSelectedItems) {
                        for (var i = 0; i < aSelectedItems.length; i++) {
                            oUploadCollection.downloadItem(aSelectedItems[i], true);
                        }
                    } else {
                        MessageToast.show("Select an item to download");
                    }
                },
        
                onVersion: function() {
                    var oUploadCollection = this.byId("UploadCollection");
                    this.bIsUploadVersion = true;
                    this.oItemToUpdate = oUploadCollection.getSelectedItem();
                    oUploadCollection.openFileDialog(this.oItemToUpdate);
                },
        
                onSelectionChange: function() {
                    var oUploadCollection = this.byId("UploadCollection");
                    // If there's any item selected, sets download button enabled
                    if (oUploadCollection.getSelectedItems().length > 0) {
                        this.byId("downloadButton").setEnabled(true);
                        if (oUploadCollection.getSelectedItems().length === 1) {
                            this.byId("versionButton").setEnabled(true);
                        } else {
                            this.byId("versionButton").setEnabled(false);
                        }
                    } else {
                        this.byId("downloadButton").setEnabled(false);
                        this.byId("versionButton").setEnabled(false);
                    }
                },
        
                updateFile: function() {
                    var oData = this.byId("UploadCollection").getModel().getData();
                    var aItems = deepExtend({}, oData).items;
                    // Adds the new metadata to the file which was updated.
                    for (var i = 0; i < aItems.length; i++) {
                        if (aItems[i].documentId === this.oItemToUpdate.getDocumentId()) {
                            // Uploaded by
                            aItems[i].attributes[0].text = "You";
                            // Uploaded on
                            aItems[i].attributes[1].text = new Date().toLocaleDateString();
                            // Version
                            var iVersion = parseInt(aItems[i].attributes[3].text);
                            iVersion++;
                            aItems[i].attributes[3].text = iVersion;
                        }
                    }
                    // Updates the model.
                    this.byId("UploadCollection").getModel().setData({
                        "items": aItems
                    });
                    // Sets the flag back to false.
                    this.bIsUploadVersion = false;
                    this.oItemToUpdate = null;
                }
            });
        });













    //         // var sPath = jQuery.sap.getModulePath("visionBoardProject/internproject/controller/UploadCollectionData.json");
            
    //         // var sPath = jQuery.sap.getModulePath("visionBoardProject.internproject", "data/UploadCollectionData.json");
    //         // var oModel = new JSONModel(sPath);
    //         // this.getView().setModel(oModel, "UploadCollectionData");

    //         //this.oModel = new JSONModel(sap.ui.require.toUrl("sap/m/sample/UploadCollectionFolderHierarchy/UploadCollectionData.json")); 
    //         //this.oModel = new sap.ui.model.json.JSONModel(sap.ui.require.toUrl("file://../data/UploadCollectionData.json")); 
    //         var oModel = new sap.ui.model.json.JSONModel(sap.ui.require.toUrl("file://../data/UploadCollectionData.json")); 


    //        // var oModel = new sap.ui.model.json.JSONModel(jQuery.sap.getProperty("dataFolder", "/UploadCollectionData.json"));  //new
	// 		this.getView().setModel(this.oModel);
    //         console.log(oModel);


            
    //         // this.getView().setModel(new JSONModel(sPath));

	// 		this.oUploadCollection = this.byId("UploadCollection");
	// 		this.oBreadcrumbs = this.byId("breadcrumbs");
	// 		this.bindUploadCollectionItems("/items");
	// 		this.oUploadCollection.addEventDelegate({
	// 			onAfterRendering: function() {
	// 				var iCount = this.oUploadCollection.getItems().length;
	// 				this.oBreadcrumbs.setCurrentLocationText(this.getCurrentLocationText() + " (" + iCount + ")");
	// 			}.bind(this)
	// 		});
    //         },
    //         onUploadComplete: function(oEvent) {
    //             var sCurrentPath = this.getCurrentFolderPath();
    //             var oData = this.oModel.getProperty(sCurrentPath);
    //             var aItems = oData && oData.items;
    //             var oItem;
    //             var sUploadedFile = oEvent.getParameter("files")[0].fileName;
    
    //             oItem = {
    //                 "documentId": Date.now().toString(), // generate Id,
    //                 "fileName": sUploadedFile,
    //                 "mimeType": "",
    //                 "thumbnailUrl": "",
    //                 "url": ""
    //             };
    //             if (aItems.length === 0) {
    //                 aItems.push(oItem);
    //             } else {
    //                 // insert file after all folders
    //                 for (var i = 0; i < aItems.length; i++) {
    //                     if (aItems[i].type !== "folder") {
    //                         aItems.splice(i, 0, oItem);
    //                         break;
    //                     }
    //                 }
    //             }
    //             this.oModel.setProperty(sCurrentPath + "/items", aItems);
    //             setTimeout(function() {
    //                 MessageToast.show("UploadComplete event triggered.");
    //             }, 2000);
    //         },
    
    //         onFileDeleted: function(oEvent) {
    //             this.deleteItemById(oEvent.getParameter("documentId"));
    //             MessageToast.show("FileDeleted event triggered.");
    //         },
    
    //         onFolderPress: function(event) {
    //             var oContext = event.getSource().getBindingContext();
    
    //             var aSubItems = oContext && oContext.getProperty("items");
    //             if (aSubItems) {
    //                 this.bindUploadCollectionItems(oContext.getPath("items"));
    //                 // save the current folder name and path in model
    //                 var sCurrentFolder = this.getCurrentLocationText();
    //                 var aHistory = this.oModel.getProperty("/history");
    //                 aHistory.push({
    //                     name: sCurrentFolder,
    //                     path: oContext.getPath()
    //                 });
    //                 this.oModel.setProperty("/history", aHistory);
    
    //                 // update new current location folder text in Breadcrumb
    //                 this.oBreadcrumbs.setCurrentLocationText(oContext.getProperty("fileName"));
    //             }
    //         },
    
    //         onFolderDeletePress: function(event) {
    //             var oItem = event.getSource();
    //             var sFolderName = oItem.getFileName();
    //             MessageBox.show("Are you sure you want to delete '" + sFolderName + "'?", {
    //                 title: "Delete Folder",
    //                 actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
    //                 onClose: function(oAction) {
    //                     if (oAction === MessageBox.Action.OK) {
    //                         this.deleteItemByPath(oItem.getBindingContext().getPath());
    //                     }
    //                 }.bind(this),
    //                 dialogId: "messageBoxDeleteFolder"
    //             });
    //         },
    
    //         onBreadcrumbPress: function(event) {
    //             var oLink = event.getSource();
    //             var iIndex = this.oBreadcrumbs.indexOfLink(oLink);
    
    //             // update UploadCollectionItems
    //             var sPath = this.oModel.getProperty("/history")[iIndex].path;
    //             var sCurrentFolderPath = sPath.substring(0, sPath.lastIndexOf("/"));
    //             this.bindUploadCollectionItems(sCurrentFolderPath);
    
    //             // remove the sub folders
    //             var aHistory = this.oModel.getProperty("/history");
    //             aHistory.splice(iIndex);
    //             this.oModel.setProperty("/history", aHistory);
    
    //             // reset the current location folder
    //             this.oBreadcrumbs.setCurrentLocationText(oLink.getText());
    //         },
    
    //         bindUploadCollectionItems: function(path) {
    //             this.oUploadCollection.bindItems({
    //                 path: path,
    //                 factory: this.uploadCollectionItemFactory.bind(this)
    //             });
    //         },
    
    //         uploadCollectionItemFactory: function(id, context) {
    //             var oItem = new UploadCollectionItem(id, {
    //                 documentId: "{documentId}",
    //                 fileName: "{fileName}",
    //                 mimeType: "{mimeType}",
    //                 thumbnailUrl: "{thumbnailUrl}",
    //                 url: "{url}"
    //             });
    
    //             if (context.getProperty("type") === "folder") {
    //                 oItem.attachPress(this.onFolderPress, this);
    //                 oItem.attachDeletePress(this.onFolderDeletePress, this);
    //                 oItem.setAriaLabelForPicture("Folder");
    //             }
    //             return oItem;
    //         },
    
    //         /**
    //          * Deletes the item in the data model by using the binding path of the item
    //          *
    //          * @param {string} sItemPath The binding path of the item
    //          */
    //         deleteItemByPath: function(sItemPath) {
    //             var sCurrentPath = this.getCurrentFolderPath();
    //             var oData = this.oModel.getProperty(sCurrentPath);
    //             var aItems = oData && oData.items;
    //             var oItemData = this.oModel.getProperty(sItemPath);
    //             if (oItemData && aItems) {
    //                 aItems.splice(aItems.indexOf(oItemData), 1);
    //                 this.oModel.setProperty(sCurrentPath + "/items", aItems);
    //             }
    //         },
    
    //         /**
    //          * Deletes the item in the data model by using the item document id
    //          *
    //          * @param {string} sItemToDeleteId The document id of the item
    //          */
    //         deleteItemById: function(sItemToDeleteId) {
    //             var sCurrentPath = this.getCurrentFolderPath();
    //             var oData = this.oModel.getProperty(sCurrentPath);
    //             var aItems = oData && oData.items;
    //             jQuery.each(aItems, function(index) {
    //                 if (aItems[index] && aItems[index].documentId === sItemToDeleteId) {
    //                     aItems.splice(index, 1);
    //                 }
    //             });
    //             this.oModel.setProperty(sCurrentPath + "/items", aItems);
    //         },
    
    //         getCurrentLocationText: function() {
    //             // Remove the previously added number of items from the currentLocationText in order to not show the number twice after rendering.
    //             var sText = this.oBreadcrumbs.getCurrentLocationText().replace(/\s\([0-9]*\)/, "");
    //             return sText;
    //         },
    
    //         getCurrentFolderPath: function() {
    //             var aHistory = this.oModel.getProperty("/history");
    //             // get the current folder path
    //             var sPath = aHistory.length > 0 ? aHistory[aHistory.length - 1].path : "/";
    //             return sPath;
    //         }

            

            
           
    //     });

    // });
