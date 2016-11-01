angular
    .module('awt-cts-client')
    .controller('LoginController', LoginController);

LoginController.$inject = ['$http', '$window', 'loginService'];

function LoginController($http, $window, loginService) {
    var loginVm = this;

    // Setting background image
    $(".login-page").backstretch("assets/img/login_background.jpg");

    // Variable binders
    loginVm.credentials = {};

    // Methods
    loginVm.login = login;
    loginVm.test1 = test1;
    loginVm.test2 = test2;

    function login() {
      loginService.auth(loginVm.credentials.email, loginVm.credentials.password)
        .then(function (response) {
            var token = response.data.token;

            if (token !== undefined) {
                $http.defaults.headers.common['X-Auth-Token'] = token;
                $window.localStorage.setItem('AUTH_TOKEN', token);
            }
            else {
                loginVm.credentials.password = '';
            }
        });
    };

    function test1() {
      loginService.simpleMethod()
        .then(function (response) {
          console.log(response);
        });
    };

    function test2() {
      loginService.authMethod()
        .then(function (response) {
          console.log(response);
        });
    };
}
