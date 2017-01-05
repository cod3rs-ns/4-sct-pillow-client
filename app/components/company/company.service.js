(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .service('companyService', companyService);

    companyService.$inject = ['$http', '$log', 'CONFIG'];

    function companyService($http, $log, CONFIG) {
        var pageStatuses = {
            userPage: 1,
            announcementPage: 1
        };

        var service = {
            getCompanies: getCompanies,
            getCompanyById: getCompanyById,
            getUsersByCompanyId: getUsersByCompanyId,
            getAnnouncementsByCompanyId: getAnnouncementsByCompanyId,
            getUserPage: getUserPage,
            setUserPage: setUserPage,
            getAnnouncementPage: getAnnouncementPage,
            setAnnouncementPage: setAnnouncementPage,
            getTopThreeByCompanyId: getTopThreeByCompanyId,
            createCompany: createCompany,
            findUsers: findUsers,
            getUserRequestsByStatusPending: getUserRequestsByStatusPending,
            resolveMembershipRequest: resolveMembershipRequest,
            updateCompany: updateCompany
        };

        return service;

        function getCompanies(page, size, sort) {
            return $http.get(CONFIG.SERVICE_URL + '/companies?page=' + page + '&size=' + size + '&sort=' + sort)
                .then(function successCallback(response) {
                    return response;
                }, function errorCallback(response) {
                    $log.warn(response.headers('X-SCT-Alert'));
                    throw response.headers('X-SCT-Alert');
                });
        };

        function getCompanyById(id) {
            return $http.get(CONFIG.SERVICE_URL + '/companies/' + id)
                .then(function successCallback(response) {
                    return response;
                }, function errorCallback(response) {
                    $log.warn(response.headers('X-SCT-Alert'));
                    throw response.headers('X-SCT-Alert');
                });
        };

        function getUsersByCompanyId(companyId, page, size, sort) {
            return $http.get(CONFIG.SERVICE_URL + '/users/company/' + companyId + '?page=' + page + '&size=' + size + '&sort=' + sort)
                .then(function successCallback(response) {
                    return response;
                }, function errorCallback(response) {
                    $log.warn(response.headers('X-SCT-Alert'));
                    throw response.headers('X-SCT-Alert');
                });
        };


        function getAnnouncementsByCompanyId(companyId, page, size, sort) {
            return $http.get(CONFIG.SERVICE_URL + '/announcements/company/' + companyId + '?page=' + page + '&size=' + size + '&sort=' + sort)
                .then(function successCallback(response) {
                    return response;
                }, function errorCallback(response) {
                    $log.warn(response.headers('X-SCT-Alert'));
                    throw response.headers('X-SCT-Alert');
                });
        };

        function getTopThreeByCompanyId(companyId) {
            return $http.get(CONFIG.SERVICE_URL + '/announcements/top/company/' + companyId)
                .then(function successCallback(response) {
                    return response;
                }, function errorCallback(resposnse) {
                    $log.warn(response.headers('X-SCT-Alert'));
                    throw response.headers('X-SCT-Alert');
                });
        };

        function createCompany(company) {
            return $http.post(CONFIG.SERVICE_URL + '/companies/', company)
                .then(function successCallback(response) {
                    return response;
                }, function errorCallback(response) {
                    $log.warn(response.headers('X-SCT-Alert'));
                    throw response.headers('X-SCT-Alert');
                });
        }

        function findUsers(firstName, lastName) {
            return $http.get(CONFIG.SERVICE_URL + '/users/search/type-ahead',
                {
                    params: {
                        'firstName': firstName,
                        'lastName': lastName
                    }
                })
                .then(function successCallback(response) {
                    return response;
                }, function errorCallback(response) {
                    $log.warn(response.headers('X-SCT-Alert'));
                    throw response.headers('X-SCT-Alert');
                });
        }

        /**
         * Gets {User} objects whose company request status have value 'pending'
         * TODO - should this kind of get request have PAGEABLE parameter??
         *
         * @returns response
         */
        function getUserRequestsByStatusPending() {
            return $http.get(CONFIG.SERVICE_URL + '/companies/users-requests/' + '?status=pending' + '&page=0')
                .then(function succesfullCallback(response){
                    return response;
                }, function errorCallback(response) {
                    $log.error("Unable to retreive users with pending requests.");
                    throw response.headers('X-SCT-Alert');
                });
        };

        /**
         * Resolves {User} request to join company.
         * @param {integer} userId      ID of the user which status will be resolved
         * @param {boolean} accepted    Flag - true if request will be accepted, false otherwise
         */
        function resolveMembershipRequest(userId, accepted) {
            return $http.put(CONFIG.SERVICE_URL + '/companies/resolve-request/user/' + userId + '?accepted=' + accepted)
                .then(function successCallback(response) {
                    return response;
                }, function errorCallback(response) {
                    $log.warn(response.headers('X-SCT-Alert'));
                    throw response.headers('X-SCT-Alert');
                });
        };


        function updateCompany(company){
            return $http.put(CONFIG.SERVICE_URL + '/companies', company)
                .then(function successCallback(response) {
                    return response;
                }, function errorCallback(response) {
                    $log.warn(response.headers('X-SCT-Alert'));
                    throw response.headers('X-SCT-Alert');
                });
        }

        function getUserPage(){
            return pageStatuses.userPage;
        }

        function setUserPage(userPage) {
            pageStatuses.userPage = userPage;
        }

        function getAnnouncementPage() {
            return pageStatuses.announcementPage;
        }

        function setAnnouncementPage(announcementPage) {
            pageStatuses.announcementPage = announcementPage;
        }

    }
})();