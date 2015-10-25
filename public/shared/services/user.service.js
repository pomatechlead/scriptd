(function() {
	'use strict';

	angular
		.module('scriptd')
		.factory("UserService" , userService);

	function userService($http, $q){

        var service = {
            request: request,
    		login: login,
    		forgot: forgot,
    		register: register,
    		resetPass: resetPass,
    		requireLogin: requireLogin,
            editUser : editUser,
            getUser: getUser,
            socialRegister: socialRegister,
            changePass: changePass,
            uploadPhoto: uploadPhoto
        }

        return service;

    	////////////

        function request(method, url, data) {
            console.log(method+' '+url+(data ? '\n'+JSON.stringify(data) : ''));

            var deferred = $q.defer();

            var options = {
                url: url,
                method: method
            };

            if (data) {
                if (method === 'GET') {
                    options['params'] = data;
                }
                else if (method === 'POST') {
                    options['data'] = data;
                }
            }

            $http(options)
            .success(function(response){
                deferred.resolve(response);
            })
            .error(function(response){
                deferred.reject(response.error);
            });

            return deferred.promise;
        }

        function register(user){
            return request('POST', '/auth/signup', user);
        }

		function login(username, password){
            return request('POST', '/auth/signin', {username: username, password: password});
		}

        function getUser(param){
            return request('GET', '/users/' + param);
        }

		function forgot(email){
            return request('POST', '/auth/forgot', {email: email});
		}

        function socialRegister(user){
            return request('POST', '/auth/socialSignup', user);
        }

        function changePass(pass){
            return request('POST', '/users/password', pass);
        }

        function resetPass(pass, token){
            return request('POST', '/auth/reset/' + token, pass);
        }

        function editUser(user, id){
            console.log('Obejct SENT')
            console.log(user)
            var deferred = $q.defer();
            $http.put('/users/' + id, user)
                .then(function(data){
                    console.log('Obejct RETURNED')
                    console.log(data)
                    deferred.resolve(data);
                }, function(err){
                    deferred.reject(err)
            });
            return deferred.promise;


            // return request('PUT', '/users/' + id, user);
        }

        function uploadPhoto(fd){
            var deferred = $q.defer();
            $http.post('users/uploadPhoto', fd, {
                  withCredentials: true,
                  headers: {'Content-Type': undefined },
                  transformRequest: angular.identity
                })
                .then(function(data){
                    deferred.resolve(data.data);
                }, function(err){
                    deferred.reject(err)
            });
            return deferred.promise;
        }

        function requireLogin(){
            var deferred = $q.defer();
            $http.get('/users/me')
                .then(function(data){
                    deferred.resolve(data.data);
                }, function(err){
                    deferred.reject(err)
            });
            return deferred.promise;
        }

	}

})();