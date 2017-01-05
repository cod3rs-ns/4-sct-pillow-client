(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .service('verificationTokenService', verificationTokenService);

    verificationTokenService.$inject = ['$http', '$resource', '$log', 'CONFIG'];

    function verificationTokenService($http, $resource, $log, CONFIG) {

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
                    // FIXME @bblagojevic - treba li ti ovaj response? :) @see user.service.js
                    $log.warn(response.headers('X-SCT-Alert'));
                    throw response.headers('X-SCT-Alert');
                    return response;
                });
        }
    }
})();