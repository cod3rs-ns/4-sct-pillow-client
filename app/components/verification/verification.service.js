(function () {
    'use strict';
    angular
        .module('awt-cts-client')
        .factory('VerificationTokenService', VerificationTokenService);

    VerificationTokenService.$inject = ['$http', '$resource', '$log', 'CONFIG'];

    function VerificationTokenService($http, $resource, $log, CONFIG) {

        var service = {
            resendToken: resendToken
        };

        return service;

        function resendToken(username) {
            return $http.put(CONFIG.SERVICE_URL + '/registration-token-resend/' + username)
                .then(function successCallback(response) {
                    return response;
                }, function errorCallback(response) {
                    $log.error("Unable to resend verification token.")
                    return response;
                });
        }
    }
})();
