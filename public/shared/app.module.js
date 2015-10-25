(function() {
	'use strict';

	angular
		.module('scriptd', ['ui.router', 'pdf', 'imageupload'])
		.config(config);

	function config($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise("/main");
        $stateProvider
            .state('mainPage', {
                url: "/main",
                templateUrl: "/partials/main/main.html",
                controller: "MainCtrl",
                controllerAs: "main",
                abstract: true
            })  

                //HOME PAGE
                .state('mainPage.home', {
                    url: "",
                    templateUrl: "/partials/main/home/home.html",
                    controller: "HomeCtrl",
                    controllerAs: "home"
                })
                .state('mainPage.home.modal', {
                    url: "/modal",
                    templateUrl: "/partials/modal/modal.html"
                })
                    .state('mainPage.home.modal.login', {
                        url: "/login",
                        templateUrl: "/partials/modal/login/login.html"
                    })
                    .state('mainPage.home.modal.script', {
                        url: "/script/:result",
                        templateUrl: "/partials/modal/script/script.html",
                        controller: "ScriptModalCtrl",
                        controllerAs: "scr"
                    })
                    .state('mainPage.home.modal.forgot', {
                        url: "/forgot",
                        templateUrl: "/partials/modal/forgot/forgot.html",
                        controller: "ForgotModalCtrl",
                        controllerAs: "forgot"
                    })
                    .state('mainPage.home.modal.reset', {
                        url: "/reset/:token",
                        templateUrl: "/partials/modal/reset/reset.html",
                        controller: "ResetModalCtrl",
                        controllerAs: "new"
                    })
                    .state('mainPage.home.modal.signupThank', {
                        url: "/signup-thank",
                        templateUrl: "/partials/modal/messages/signup.thank.html"
                    })
                    .state('mainPage.home.modal.forgotMessage', {
                        url: "/forgot-message",
                        templateUrl: "/partials/modal/messages/forgot.message.html"
                    })
                    .state('mainPage.home.modal.uploadThankMessage', {
                        url: "/upload-thank",
                        templateUrl: "/partials/modal/messages/upload.thank.html",
                        controller: "ModalCtrl",
                        controllerAs: "modal"
                    })
                    .state('mainPage.home.modal.resetPassed', {
                        url: "/reset-passed",
                        templateUrl: "/partials/modal/messages/reset.passed.html"
                    })
                    .state('mainPage.home.modal.upload', {
                        url: "/upload",
                        templateUrl: "/partials/modal/upload/upload.html",
                        controller: "UploadModalCtrl",
                        controllerAs: "up"
                    })

                //PROFILE PAGE
                .state('mainPage.profile', {
                    url: "/profile/:user",
                    templateUrl: "/partials/main/profile/profile.html",
                    controller: "ProfileCtrl",
                    controllerAs: "profile"
                })
                .state('mainPage.profile.modal', {
                    url: "/modal",
                    templateUrl: "/partials/modal/modal.html"
                })
                    .state('mainPage.profile.modal.upload', {
                        url: "/upload",
                        templateUrl: "/partials/modal/upload/upload.html",
                        controller: "UploadModalCtrl",
                        controllerAs: "up"
                    })
                    .state('mainPage.profile.modal.script', {
                        url: "/script/:result",
                        templateUrl: "/partials/modal/script/script.html",
                        controller: "ScriptModalCtrl",
                        controllerAs: "scr"
                    })
            .state('createUserPage', {
                url: "/user/create",
                templateUrl: "/partials/other/create.user/create.html",
                controller: "CreateCtrl",
                controllerAs: "create"
            })
            .state('editUserPage', {
                url: "/user/edit/:result",
                templateUrl: "/partials/other/edit.user/edit.html",
                controller: "EditCtrl",
                controllerAs: "edit"
            })
                .state('editUserPage.modal', {
                    url: "/modal",
                    templateUrl: "/partials/modal/modal.html"
                })
                    .state('editUserPage.modal.resetPassword', {
                        url: "/new-password",
                        templateUrl: "/partials/modal/newPassword/new.password.html",
                        controller: "NewPasswordModalCtrl",
                        controllerAs: "newPass"
                    })
                    .state('editUserPage.modal.resetPassed', {
                        url: "/reset-passed",
                        templateUrl: "/partials/modal/messages/reset.passed.html"
                    })
            .state('socialUserPage', {
                url: "/socialSignup",
                templateUrl: "/partials/other/social.user/social.html",
                controller: "SocialCtrl",
                controllerAs: "social"
            })
            .state('uploadPage', {
                url: "/upload",
                templateUrl: "/partials/other/upload/upload.html",
                controller: "UploadPageCtrl",
                controllerAs: "up"
            })

	}

})();