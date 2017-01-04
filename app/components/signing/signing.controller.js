(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .controller('SigningController', SigningController);

    SigningController.$inject = ['$http', '$window', '$location', '$localStorage', '$log', '$scope', 'jwtHelper', 'signingService', 'CONFIG'];

    function SigningController($http, $window, $location, $localStorage, $log, $scope, jwtHelper, signingService, CONFIG) {
        var signingVm = this;

        // Setting background image for signing page
        // $(".login-page").backstretch("assets/img/login_background.jpg");

        // Variable binders
        signingVm.credentials = {};
        signingVm.registrationUser = {};
        signingVm.registrationUser.type = 'advertiser';
        signingVm.dataLoading = false;
        signingVm.loginError = false;

        // Methods
        signingVm.login = login;
        signingVm.register = register;

        function login() {
            signingVm.dataLoading = true;
            signingVm.loginError = false;

            signingService.auth(signingVm.credentials.username, signingVm.credentials.password)
                .then(function (response) {
                    // Wrong credentials
                    if (response === "Wrong credentials") {
                        signingVm.credentials.password = '';
                        signingVm.loginError = true;
                    }
                    else {
                        var token = response.data.token;
                        var tokenPayload = jwtHelper.decodeToken(token);
                        
                        if (token !== undefined) {
                            $http.defaults.headers.common[CONFIG.AUTH_TOKEN] = token;
                            $localStorage.token = token;
                            $localStorage.user = tokenPayload.sub;
                            $localStorage.role = tokenPayload.role.authority;
                            $log.info("Successfully logged in.")
                            $location.path('/');
                        }
                    }
                    signingVm.dataLoading = false;
                });
        };

        function register() {
            signingVm.registrationUser.email = signingVm.registrationUser.email.$$state.value; 
            signingVm.registrationUser.username = signingVm.registrationUser.username.$$state.value;
            var user = angular.copy(signingVm.registrationUser);
            $scope.registrationForm.$setPristine();
            $scope.registrationForm.$setDirty();
            signingVm.registrationUser.type = 'advertiser';
            signingVm.passwordRetyped = undefined;
            signingService.register(user)
                .then(function(registeredUser) {
                    $log.info(registeredUser);
                    signingVm.registrationUser = {};
                });
        };

    }
})();