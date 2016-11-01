angular
    .module('awt-cts-client')
    .service('signingService', signingService);

signingService.$inject = ['$http'];

function signingService($http) {
    var service = {
      auth: auth,
      register: register
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

    function register(user) {
        return $http.post('http://localhost:8091/api/users/', user)
          .success(function (data) {
              return data.data;
          })
          .error(function (data) {
              return data;
          });
    };
}
