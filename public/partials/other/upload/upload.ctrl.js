(function(){
    "use strict";
    angular
        .module("scriptd")
        .controller("UploadPageCtrl", uploadPageCtrl);
        function uploadPageCtrl(ScriptService, $state, $q, $scope){
            var vm = this;

            //Values
            vm.fileName = '';

            //Show Hide

            //Functions
            vm.confirmScript = confirmScript;
            vm.getFileName = getFileName;

            ///////////////////////////////////////////////

            function getFileName(){
                ScriptService.fetchFileName()
                    .then(function(data){
                        vm.fileName = data;
                    })
            }
            getFileName();

            function confirmScript(){
                ScriptService.confirmUserScript()
                    .then(function(data){
                        ScriptService.setScriptID(data.data[0]._id);
                    })
                    $state.go('mainPage.home.modal.uploadThankMessage');
            }


            $scope.pdfUrl = '/scripts/getUpload';
            $scope.scroll = 0;

            $scope.getNavStyle = function(scroll) {
                if(scroll > 100) return 'pdf-controls fixed';
                else return 'pdf-controls';
            }



        }

})();
