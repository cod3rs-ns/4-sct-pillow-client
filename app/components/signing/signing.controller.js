(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .controller('SigningController', SigningController);

    SigningController.$inject = ['$scope', '$http', '$window', '$location', '$localStorage', '$log', '_', 'jwtHelper', 'signingService', 'CONFIG'];

    function SigningController($scope, $http, $window, $location, $localStorage, $log, _, jwtHelper, signingService, CONFIG) {
        var signingVm = this;

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

                        if (!_.isUndefined(token)) {
                            $http.defaults.headers.common[CONFIG.AUTH_TOKEN] = token;

                            $localStorage.token = token;
                            $localStorage.user = tokenPayload.sub;
                            $localStorage.role = tokenPayload.role.authority;

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