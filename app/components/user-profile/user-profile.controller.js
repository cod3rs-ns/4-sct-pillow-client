(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .controller('UserProfileController', UserProfileController);

    UserProfileController.$inject = ['companyService', 'announcementService', 'ngToast', 'DatePickerService', '_'];

    function UserProfileController(companyService, announcementService, ngToast, DatePickerService, _) {
        var userVm = this;

        /** List containing all active users requests to join company */
        userVm.usersRequests = [];

        /** List containing all announcemnts created by this user */
        userVm.announcements = [];

        /** List containing DatePicker popup configurations for every announcement */
        userVm.pickerConfigurations = [];

        userVm.acceptRequest = acceptRequest;
        userVm.rejectRequest = rejectRequest;
        userVm.extendExpirationDate = extendExpirationDate;

        activate();

        function activate() {
            announcementService.getAnnouncementsByAuthor(1)
                .then(function (response){
                    userVm.announcements = response.data;
                    _.forEach(userVm.announcements, function() {
                        userVm.pickerConfigurations.push(DatePickerService.getConfiguration());
                    });
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

        /**
         * Extends announcemnts expiration date.
         * 
         * @param {any} annId   ID of the announcement
         * @param {any} expDate Expiration date timestamp
         */
        function extendExpirationDate(annId, expDate) {
            var dateObj = new Date(expDate);
            var expString = dateObj.getDate() + "/" + (dateObj.getMonth() + 1) + "/" + dateObj.getFullYear();
            var map = {
                'expirationDate': expString
            };
            announcementService.extendExpirationDate(annId, map)
                .then(function (response) {
                    ngToast.create({
                        className: 'success',
                        content: '<p>Datum isteka oglasa produžen do: <strong>' + expString  + '</strong></p>'
                    });
                })
                .catch(function (error) {
                    ngToast.create({
                        className: 'danger',
                        content: '<p><strong>GREŠKA! </strong>' + error + '</p>'
                    });
                });
        };

    }
})();