angular
    .module('awt-cts-client')
    .controller('SigningController', SigningController);

SigningController.$inject = ['$http', '$window', 'signingService'];

function SigningController($http, $window, signingService) {
    var signingVm = this;

    // Setting background image for signing page
    $(".login-page").backstretch("assets/img/login_background.jpg");

    // Variable binders
    signingVm.credentials = {};
    signingVm.registrationUser = {};

    // Methods
    signingVm.login = login;
    signingVm.register = register;

    function login() {
        signingService.auth(signingVm.credentials.email, signingVm.credentials.password)
            .then(function(response) {
                var token = response.data.token;

                if (token !== undefined) {
                    $http.defaults.headers.common['X-Auth-Token'] = token;
                    $window.localStorage.setItem('AUTH_TOKEN', token);
                    console.log("Successfully logged in.")
                } else {
                    signingVm.credentials.password = '';
                }
            });
    };

    function register() {
        signingService.register(signingVm.registrationUser)
            .then(function(registeredUser) {
                console.log(registeredUser);
                signingVm.registrationUser = {};
            });
    };

}
