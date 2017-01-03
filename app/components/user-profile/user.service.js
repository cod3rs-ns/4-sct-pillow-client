(function() {
'use strict';

    angular
        .module('awt-cts-client')
        .service('userService', userService);

    userService.inject = ['$http', 'CONFIG', '$log'];
    function userService($http, CONFIG, $log) {
        var service = {
            getUser: getUser
        };
        return service;


        /**
         * Retrieves User (if user is logged-in) or UserDTO for the provided username. 
         * 
         * @param {string} username User's username
         * @returns
         */
        function getUser(username) {
            return $http.get(CONFIG.SERVICE_URL + '/users/' + username)
                .then(function successCallback(response) {
                    $log.info('User successfully retrieved.');
                    return response;
                }, function errorCallback(response) {
                    $log.error('User cannot be retrieved.');
                    throw "cannot_retrieve_user";
                });
        };
        
    }
})();