(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .controller('UserProfileController', UserProfileController);

    UserProfileController.$inject = ['companyService', 'ngToast'];

    function UserProfileController(companyService, ngToast) {
        var userVm = this;

        /** List containing all active users requests to join company */
        userVm.usersRequests = [];

        userVm.acceptRequest = acceptRequest;
        userVm.rejectRequest = rejectRequest;
        
        activate();

        function activate() {
            companyService.getUserRequestsByStatusPending()
                .success(function (data) {
                    userVm.usersRequests = data;
                });
        };


        /** 
         * Accepts user request to join company.
         * @param {integer} userId ID of the user which request will be accepted. 
         */
        function acceptRequest(userId) {
            companyService.resolveMembershipRequest(userId, true)
                .success(function (data){
                    activate();
                    ngToast.create({
                        className: 'success',
                        content: '<a href="#" class="">Korisnikov zahtev uspešno prihvaćen.</a>'
                    });
                });
        };

        /**
         * Rejects user request to join company.
         * @param {integer} userId ID of the user which request will be rejected.
         */
        function rejectRequest(userId) {
            companyService.resolveMembershipRequest(userId, false)
                .success(function (data){
                    activate();
                    ngToast.create({
                        className: 'danger',
                        content: '<a href="#" class="">Korisnikov zahtev odbijen.</a>'
                    });
                });
        };
    }
})();