angular
    .module('awt-cts-client')
    .service('loginService', loginService);

loginService.$inject = ['$http'];

function loginService($http) {
    var service = {
      auth: auth,
      simpleMethod: simpleMethod,
      authMethod: authMethod
    };

    return service;

    function auth(email, password) {
        return $http.post('http://localhost:8091/api/users/auth?email=' + email + '&password=' + password)
          .success(function (data) {
              return data.token;
          })
          .error(function (data) {
              return data;
          });
    };

    function simpleMethod() {
        return $http.get('http://localhost:8091/api/users/test')
          .success(function (data) {
              return data;
          })
          .error(function (data) {
              return data;
          });
    };

    function authMethod() {
        return $http.get('http://localhost:8091/api/admin/roletest')
          .success(function (data) {
              return data;
          })
          .error(function (data) {
              return data;
          });
    };
}