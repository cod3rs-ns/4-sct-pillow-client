(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .service('signingService', signingService);

    signingService.$inject = ['$http', '$log', 'CONFIG'];

    function signingService($http, $log, CONFIG) {
        var service = {
          auth: auth,
          register: register
        };

        return service;

        function auth(username, password) {
            return $http.post(CONFIG.SERVICE_URL + '/users/auth?username=' + username + '&password=' + password)
                .then(function successCallback(response) {
                    return response;
                }, function errorCallback(response) {
                    $log.warn(response.headers('X-SCT-Alert'));
                    throw response.headers('X-SCT-Alert');
                });
        };

        function register(user) {
            return $http.post(CONFIG.SERVICE_URL + '/users/', user)
              .then(function successCallback(response) {
                  return response;
              }, function errorCallback(response) {
                  $log.warn(response.headers('X-SCT-Alert'));
                  throw response.headers('X-SCT-Alert');
              });
        };
    }
})();