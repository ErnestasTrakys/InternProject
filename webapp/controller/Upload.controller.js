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

        return BaseController.extend("visionBoardProject.internproject.controller.Upload", {
            onInit: function () {
                
            },
            uploadPicture: function () {
                const image_input = document.querySelector("#image_input");
                var uploaded_image = "";

                image_input.addEventListener("change", function(){
                    console.log(image_input.value);

                    const reader = new FileReader();
                    reader.addEventListener("load", () => {
                        uploaded_image = reader.result;
                        document.querySelector("#display_image").style.backgroundImage = `url(${uploaded_image})`;
                    })
                    reader.readAsDataURL(this.files[0]);
                })



                // var files = document.getElementById('file_upload').files;
                // if(files.length==0){
                //     alert("Please first choose or drop any file(s)...");
                //     return;
                // }
                // var filenames="";
                // for(var i=0;i<files.length;i++){
                //     filenames+=files[i].name+"\n";
                // }
                // alert("Selected file(s) :\n____________________\n"+filenames);
            }

            

            
           
        });

    });
