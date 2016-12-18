angular
    .module('awt-cts-client')
    .service('signingService', signingService);

signingService.$inject = ['$http', 'CONFIG'];

function signingService($http, CONFIG) {
    var service = {
      auth: auth,
      register: register
    };

    return service;

    function auth(username, password) {
        return $http.post(CONFIG.SERVICE_URL + '/users/auth?username=' + username + '&password=' + password)
          .then(function (response) {
              return response;
          });
    };

    function register(user) {
        return $http.post(CONFIG.SERVICE_URL + '/users/', user)
          .then(function (response) {
              return response.data;
          });
    };
}
