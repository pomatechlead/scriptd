(function(){
    "use strict";
    angular
        .module("scriptd")
        .controller("UploadModalCtrl", uploadModalCtrl);
        function uploadModalCtrl(ScriptService, $scope, $state, $timeout){
        	var vm = this;

            vm.script = {}
            vm.script.genres = [];
            vm.genre = '';

            vm.uploadDisable = true;

        	// FUNCTIONS
            vm.submitScript = submitScript;

        	//////////////////////////////////////
            function submitScript(){
                if(vm.genre){
                   vm.script.genres.push(vm.genre);
                }
                $scope.$broadcast('show-errors-check-validity');

                if (!$scope.uploadScript.$valid) {
                    return; 
                }
                else if ($scope.uploadScript.$valid) {
                    ScriptService.submitUserScript(vm.script)
                        .then(function(data){
                            // ScriptService.setScriptImages(data);
                            $state.go('uploadPage');
                        })
                }
            }


            var initializing = true
            $scope.$watch('up.files', function(){
                if (initializing) {
                    $timeout(function() { initializing = false; });
                } else {
                    ScriptService.setFileName(vm.files[0].name);
                    if(vm.files && vm.files.length > 0)
                        var fd = new FormData()
                        angular.forEach(vm.files, function(file){
                            fd.append('file', file)
                        });
                        vm.uploadDisable = false;
                        ScriptService.uploadScript(fd)
                            .then(function(data){
                                console.log(data);
                                vm.uploadDisable = true;
                            })
                }
            });


		}

})();
