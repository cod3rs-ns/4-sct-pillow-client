(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .service('userService', userService);

    userService.inject = ['$http', '$log', 'CONFIG'];

    function userService($http, $log, CONFIG) {
        var service = {
            getUser: getUser,
            updateUser: updateUser
        };

        return service;

        /**
         * Retrieves User (if user is logged-in) or UserDTO for the provided username.
         *
         * @param {string} username User's username
         * @returns response
         */
        function getUser(username) {
            return $http.get(CONFIG.SERVICE_URL + '/users/' + username)
                .then(function successCallback(response) {
                    $log.info('User successfully retrieved.');
                    return response;
                }, function errorCallback(response) {
                    $log.warn(response.headers('X-SCT-Alert'));
                    throw response.headers('X-SCT-Alert');
                });
        };

        /**
         * Updates current logged in user.
         *
         * @param {User} user   Logged-in user to be updated
         * @returns response
         */
        function updateUser(user) {
            return $http.put(CONFIG.SERVICE_URL + '/users', user)
                .then(function successCallback(response) {
                    $log.info('User successfully updated.');
                    return response;
                }, function errorCallback(response) {
                    $log.warn(response.headers('X-SCT-Alert'));
                    throw response.headers('X-SCT-Alert');
                });
        };

    }
})();