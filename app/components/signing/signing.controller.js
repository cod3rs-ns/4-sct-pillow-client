(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .controller('SigningController', SigningController);

    SigningController.$inject = ['$http', '$window', '$location', '$localStorage', '$log', 'jwtHelper', 'signingService', 'CONFIG'];

    function SigningController($http, $window, $location, $localStorage, $log, jwtHelper, signingService, CONFIG) {
        var signingVm = this;

        // Setting background image for signing page
        $(".login-page").backstretch("assets/img/login_background.jpg");

        // Variable binders
        signingVm.credentials = {};
        signingVm.registrationUser = {};
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
                        $log.log(token);

                        var tokenPayload = jwtHelper.decodeToken(token);

                        $log.log(tokenPayload);

                        $log.log(token);
                        if (token !== undefined) {
                            $http.defaults.headers.common[CONFIG.AUTH_TOKEN] = token;
                            $window.localStorage.setItem('AUTH_TOKEN', token);
                            $localStorage.user = tokenPayload.user;
                            $localStorage.role = tokenPayload.role.authority;
                            $log.info("Successfully logged in.")
                            $location.path('/');
                        }
                    }
                    signingVm.dataLoading = false;
                });
        };

        function register() {
            $log.log(signingVm.registrationUser);
            signingService.register(signingVm.registrationUser)
                .then(function(registeredUser) {
                    $log.info(registeredUser);
                    signingVm.registrationUser = {};
                });
        };

    }
})();