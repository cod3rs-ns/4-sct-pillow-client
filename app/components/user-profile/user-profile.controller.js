(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .controller('UserProfileController', UserProfileController);

    UserProfileController.$inject = ['companyService', 'announcementService', 'ngToast'];

    function UserProfileController(companyService, announcementService, ngToast) {
        var userVm = this;

        /** List containing all active users requests to join company */
        userVm.usersRequests = [];

        /** List containing all announcemnts created by this user */
        userVm.announcements = [];

        userVm.acceptRequest = acceptRequest;
        userVm.rejectRequest = rejectRequest;
        
        activate();

        function activate() {
            announcementService.getAnnouncementsByAuthor(1)
                .then(function (response){
                    userVm.announcements = response.data;
                });
            companyService.getUserRequestsByStatusPending()
                .then(function (response) {
                    userVm.usersRequests = response.data;
                });
        };


        /** 
         * Accepts user request to join company.
         * @param {integer} userId ID of the user which request will be accepted. 
         */
        function acceptRequest(userId) {
            companyService.resolveMembershipRequest(userId, true)
                .then(function (response){
                    activate();
                    ngToast.create({
                        className: 'success',
                        content: '<strong>Korisnikov zahtev prihvaćen.</strong>'
                    });
                });
        };

        /**
         * Rejects user request to join company.
         * @param {integer} userId ID of the user which request will be rejected.
         */
        function rejectRequest(userId) {
            companyService.resolveMembershipRequest(userId, false)
                .then(function (response){
                    activate();
                    ngToast.create({
                        className: 'danger',
                        content: '<strong>Korisnikov zahtev odbijen.</strong>'
                    });
                });
        };
    }
})();