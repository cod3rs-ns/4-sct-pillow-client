(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .service('verificationTokenService', verificationTokenService);

    verificationTokenService.$inject = ['$http', '$log', 'CONFIG'];

    function verificationTokenService($http, $log, CONFIG) {

        var service = {
            resendToken: resendToken
        };

        return service;

        function resendToken(username) {
            return $http.put(CONFIG.SERVICE_URL + '/registration-token-resend/' + username)
                .then(function successCallback(response) {
                    return response;
                }, function errorCallback(response) {
                    $log.error("Unable to resend verification token.");
                    throw response.headers('X-SCT-Alert');
                });
        }
    }
})();