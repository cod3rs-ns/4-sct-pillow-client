(function () {
    'use strict';

    angular
        .module('awt-cts-client')
        .controller('UserProfileController', UserProfileController);

    UserProfileController.$inject = ['companyService', 'announcementService', 'ngToast', 'DatePickerService', '_', 'userService', '$stateParams', '$localStorage', '$state', '$log', 'LinkParser', 'pagingParams', 'paginationConstants', 'FileUploader', 'Notification', 'CONFIG'];

    function UserProfileController(companyService, announcementService, ngToast, DatePickerService, _, userService, $stateParams, $localStorage, $state, $log, LinkParser, pagingParams, paginationConstants, FileUploader, Notification, CONFIG) {
        var userVm = this;
        /** User for whom Profile page is displayed */
        userVm.user = {};
        /** List containing all active users requests to join company */
        userVm.usersRequests = [];

        /** List containing all announcemnts created by this user */
        userVm.announcements = [];

        /** List containing DatePicker popup configurations for every announcement */
        userVm.pickerConfigurations = [];

        /** Attributes used for Edit state */
        userVm.passEditState = false;
        userVm.infoEditState = false;
        userVm.newPassword = null;
        userVm.retypedPassword = null;
        userVm.editUser = {};

        /** Pagination support */
        userVm.loadPage = loadPage;
        userVm.predicate = pagingParams.predicate;
        userVm.reverse = pagingParams.ascending;
        userVm.transition = transition;
        userVm.itemsPerPage = paginationConstants.itemsPerPage;
        userVm.clear = clear;
        userVm.sort = sort;
        userVm.activate = activate;

        /** Public functions */
        userVm.acceptRequest = acceptRequest;
        userVm.rejectRequest = rejectRequest;
        userVm.extendExpirationDate = extendExpirationDate;
        userVm.initEditInfoState = initEditInfoState;
        userVm.initEditPasswordState = initEditPasswordState;
        userVm.cancelEditInfo = cancelEditInfo;
        userVm.cancelEditPassword = cancelEditPassword;
        userVm.changePassword = changePassword;
        userVm.changeInfo = changeInfo;

        activate();

        function activate() {
            // set Serbian locale for momment.js
            moment.locale('sr');

            userService.getUser($stateParams.username)
                .then(function (response) {
                    userVm.user = response.data;
                    if (userVm.user.type === 'advertiser') {
                        getAnnouncements();
                    }
                    // determine if user profile is for logged-in user
                    if ($stateParams.username === $localStorage.user) {
                        if (userVm.user.type === 'advertiser' && !_.isNull(userVm.user.company) && userVm.user.companyVerified === 'accepted') {
                            companyService.getUserRequestsByStatusPending()
                                .then(function (response) {
                                    userVm.usersRequests = response.data;
                                })
                                .catch(function (error) {
                                    ngToast.create({
                                        className: 'danger',
                                        content: '<p><strong>GREŠKA! </strong>' + error + '</p>'
                                    });
                                });
                        };

                        initializeFileUploader();
                        userVm.loggedin = true;
                    }
                    else {
                        userVm.loggedin = false;
                    };
                })
                .catch(function (error) {
                    ngToast.create({
                        className: 'danger',
                        content: '<p>Ne postoji korisnik <strong>' + $stateParams.username + '</strong>.</p>'
                    });
                });
        };

        /**
         * -private-
         * Retrieves announcements for active user.
         */
        function getAnnouncements() {
            announcementService.getAnnouncementsByAuthorAndStatus(userVm.user.id, false, pagingParams.page - 1, userVm.itemsPerPage, userVm.sort())
                .then(function (response) {
                    userVm.links = LinkParser.parse(response.headers('Link'));
                    userVm.totalItems = response.headers('X-Total-Count');
                    userVm.page = pagingParams.page;
                    userVm.announcements = response.data;

                    _.forEach(userVm.announcements, function (value) {
                        // create color picker configurations
                        userVm.pickerConfigurations.push(DatePickerService.getConfiguration());

                        // user-friendly expiration date information
                        var momentExpDate = moment(new Date(value.expirationDate));
                        value.expiredMessage = momentExpDate.fromNow();
                        if (momentExpDate.isAfter(moment())) {
                            value.expirationClass = 'color-success';
                            // check if expiration date is close (by 7 days)
                            if (moment(new Date(value.expirationDate)).subtract(7, 'days').isBefore(moment())) {
                                value.expirationClass = 'color-warning';
                            };
                        }
                        else {
                            value.expirationClass = 'color-danger';
                        };
                    });
                })
                .catch(function (error) {
                    $log.error(error);
                });
        };

        /**
         * Accepts user request to join company.
         * @param {integer} userId ID of the user which request will be accepted.
         */
        function acceptRequest(userId) {
            companyService.resolveMembershipRequest(userId, true)
                .then(function (response) {
                    activate();
                    ngToast.create({
                        className: 'success',
                        content: '<strong>Korisnikov zahtev prihvaćen.</strong>'
                    });
                })
                .catch(function (error) {
                    $log.error(error);
                });
        };

        /**
         * Rejects user request to join company.
         * @param {integer} userId ID of the user which request will be rejected.
         */
        function rejectRequest(userId) {
            companyService.resolveMembershipRequest(userId, false)
                .then(function (response) {
                    activate();
                    ngToast.create({
                        className: 'danger',
                        content: '<strong>Korisnikov zahtev odbijen.</strong>'
                    });
                })
                .catch(function (error) {
                    $log.error(error);
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
                        content: '<p>Datum isteka oglasa produžen do: <strong>' + expString + '</strong></p>'
                    });
                    activate();
                })
                .catch(function (error) {
                    ngToast.create({
                        className: 'danger',
                        content: '<p><strong>GREŠKA! </strong>' + error + '</p>'
                    });
                });
        };


        /**
         * Initializes - edit profile information - state.
         */
        function initEditInfoState() {
            userVm.infoEditState = true;
            userVm.editUser.firstName = userVm.user.firstName;
            userVm.editUser.lastName = userVm.user.lastName;
            userVm.editUser.phoneNumber = userVm.user.phoneNumber;
        };

        /**
         * Intitializes - edit password - state.
         */
        function initEditPasswordState() {
            userVm.passEditState = true;
            userVm.newPassword = null;
            userVm.retypedPassword = null;
        };

        /**
         * Cancels - edit profile information - state and resets attributes.
         */
        function cancelEditInfo() {
            userVm.infoEditState = false;
            userVm.editUser = {};
        };

        /**
         * Cancels - edit password - state and resets attributes.
         */
        function cancelEditPassword() {
            userVm.passEditState = false;
            userVm.newPassword = null;
            userVm.retypedPassword = null;
        };

        /**
         * Saves changed user password.
         */
        function changePassword() {
            userVm.user.password = userVm.newPassword;
            userService.updateUser(userVm.user)
                .then(function (response) {
                    Notification.success('<strong id="pass-changed">Uspešno ste promenili lozinku!</strong>');
                    userVm.passEditState = false;
                })
                .catch(function (error) {
                    ngToast.create({
                        className: 'danger',
                        content: '<p><strong>GREŠKA! </strong>' + error + '</p>'
                    });
                });
        };

        /**
         * Saves changed user profile information.
         */
        function changeInfo() {
            userVm.user.firstName = userVm.editUser.firstName;
            userVm.user.lastName = userVm.editUser.lastName;
            userVm.user.phoneNumber = userVm.editUser.phoneNumber;
            userService.updateUser(userVm.user)
                .then(function (response) {
                    ngToast.create({
                        className: 'success',
                        content: '<strong>Uspešno ste ažurirali informacije!</strong>'
                    });
                    userVm.infoEditState = false;
                })
                .catch(function (error) {
                    ngToast.create({
                        className: 'danger',
                        content: '<p><strong>GREŠKA! </strong>' + error + '</p>'
                    });
                });
        };

        /**
         * Loads provided page.
         *
         * @param {integer} page    page to load.
         */
        function loadPage(page) {
            userVm.page = page;
            userVm.transition();
        };

        /**
         * Makes state transition to new page.
         */
        function transition() {
            $state.transitionTo($state.$current, {
                username: userVm.user.username,
                page: userVm.page,
                sort: userVm.predicate + ',' + (userVm.reverse ? 'asc' : 'desc'),
            });
        };

        /**
         * Resets pagination attributes.
         */
        function clear() {
            userVm.links = null;
            userVm.page = 1;
            userVm.predicate = 'id';
            userVm.reverse = true;
            userVm.transition();
        };

        /**
         * Retrieves sort parameter for search.
         */
        function sort() {
            var result = [userVm.predicate + ',' + (userVm.reverse ? 'asc' : 'desc')];
            return result;
        };

        /**
        * Initializing file uploader and its filters and callback functions.
        */
        function initializeFileUploader() {
            userVm.uploader = new FileUploader({
                url: CONFIG.SERVICE_URL + '/images/users/',
                headers: {
                    "X-Auth-Token": $localStorage.token
                }
            });

            userVm.uploader.filters.push({
                name: 'imageFilter',
                fn: function (item /*{File|FileLikeObject}*/, options) {
                    var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                    return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                }
            });

            userVm.uploader.filters.push({
                name: 'enforceMaxFileSize',
                fn: function(item) {
                    var retVal = item.size <= 5242880; // 5 MB
                    if (!retVal) {
                        ngToast.create({
                            className: 'danger',
                            content: '<p>Veličina fajla mora biti manja od <strong>5MB</strong>.</p>'
                        });
                    }
                    return retVal;
                }
            });

            userVm.uploader.onAfterAddingFile = function (fileItem) {
                userVm.uploader.uploadItem(fileItem);
            };

            userVm.uploader.onSuccessItem = uploadImage;
        }

        /**
        * Updating user when image is properly uploaded.
        */
        function uploadImage(fileItem, response, status, headers) {
            userVm.user.imagePath = response;
            userService.updateUser(userVm.user)
                .then(function (response) {
                    ngToast.create({
                        className: 'success',
                        content: '<strong>Uspešno ste promenili profilnu sliku!</strong>'
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