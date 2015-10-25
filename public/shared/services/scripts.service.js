(function() {
	'use strict';

	angular
		.module('scriptd')
		.factory('ScriptService' , scriptService);

	function scriptService($http, $q){

		var service = {
        	fetchMainScripts: fetchMainScripts,
        	favoriteMainScript: favoriteMainScript,
            removefavoriteMainScript: removefavoriteMainScript,
            fetchScript: fetchScript,
            uploadScript: uploadScript,
            submitUserScript: submitUserScript,
            confirmUserScript: confirmUserScript,
            setFileName: setFileName,
            fetchFileName: fetchFileName,
            setScriptID: setScriptID,
            fetchScriptID: fetchScriptID
    	};

    	return service;

    	////////////

	    function fetchMainScripts() {
	       var deferred = $q.defer();
            $http.get('/scripts')
                .then(function(data){
                    deferred.resolve(data.data);
                }, function(err){
                    deferred.reject(err)
            });
            return deferred.promise;
	    }

        function fetchScript(id) {
           var deferred = $q.defer();
            $http.get('/scripts/' + id)
                .then(function(data){
                    deferred.resolve(data.data);
                }, function(err){
                    deferred.reject(err)
            });
            return deferred.promise;
        }

	    function favoriteMainScript(id) {
            var deferred = $q.defer();
            $http.put('/scripts/favorite/' + id, {favorited: true})
                .then(function(data){
                    deferred.resolve(data);
                }, function(err){
                    deferred.reject(err)
            });
            return deferred.promise;
	    }

        function removefavoriteMainScript(id) {
            var deferred = $q.defer();
            $http.put('/scripts/favorite/' + id, {favorited: false})
                .then(function(data){
                    deferred.resolve(data);
                }, function(err){
                    deferred.reject(err)
            });
            return deferred.promise;
        }

        function uploadScript(fd) {
            var deferred = $q.defer();
            $http({
                url: '/scripts/upload',
                method: 'POST',
                data: fd,
				transformRequest: angular.identity,
				headers:{'Content-Type':undefined}
            })
                .then(function(data){
                    deferred.resolve(data);
                }, function(err){
                    deferred.reject(err)
            });
            return deferred.promise;
        }

        function submitUserScript(script) {
            var deferred = $q.defer();
            $http.post('/script/add', script)
                .then(function(data){
                    deferred.resolve(data);
                }, function(err){
                    deferred.reject(err)
            });
            return deferred.promise;
        }

		function confirmUserScript(script) {
				var deferred = $q.defer();
				//No post data required
				$http.post('/script/confirm')
					.then(function(data){
						deferred.resolve(data);
					}, function(err){
						deferred.reject(err)
				});
				return deferred.promise;
		}

        var fileName = '';

        function setFileName(name){
            fileName = name;
        }

        function fetchFileName(){
            var deferred = $q.defer();
            deferred.resolve(fileName);
            return deferred.promise;
        }

        var scriptID = '';

        function setScriptID(id){
            scriptID = id;
        }

        function fetchScriptID(){
            var deferred = $q.defer();
            deferred.resolve(scriptID);
            return deferred.promise;
        }



	};

})();
