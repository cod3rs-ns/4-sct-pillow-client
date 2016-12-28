angular
    .module('awt-cts-client')
    .service('companyService', companyService);

companyService.$inject = ['$http', 'CONFIG'];

function companyService($http, CONFIG) {
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
        findUsers: findUsers
    };

    return service;

    function getCompanies(page, size, sort, successCallback, errorCallback) {
        return $http.get(CONFIG.SERVICE_URL + '/companies?page=' + page + '&size=' + size + '&sort=' + sort)
            .success(function (data, status, headers) {
                successCallback(data, headers);
            })
            .error(function (data) {
                errorCallback(data);
            });
    };

    function getCompanyById(id) {
        return $http.get(CONFIG.SERVICE_URL + '/companies/' + id)
            .success(function (data) {
                return data;
            })
            .error(function (data) {
                return data;
            });
    };

    function getUsersByCompanyId(companyId, page, size, sort, successCallback, errorCallback) {
        return $http.get(CONFIG.SERVICE_URL + '/users/company/' + companyId + '?page=' + page + '&size=' + size + '&sort=' + sort)
            .success(function (data, status, headers) {
                successCallback(data, headers);
            })
            .error(function (data) {
                errorCallback(data);
            });
    };


    function getAnnouncementsByCompanyId(companyId, page, size, sort, successCallback, errorCallback) {
        return $http.get(CONFIG.SERVICE_URL + '/announcements/company/' + companyId + '?page=' + page + '&size=' + size + '&sort=' + sort)
            .success(function (data, status, headers) {
                successCallback(data, headers);
            })
            .error(function (data) {
                errorCallback(data);
            });
    };

    function getTopThreeByCompanyId(companyId) {
        return $http.get(CONFIG.SERVICE_URL + '/announcements/top/company/' + companyId)
            .success(function (data, status, headers) {
                return data;
            })
            .error(function (data) {
                return data;
            });
    };

    function createCompany(company) {
        return $http.post(CONFIG.SERVICE_URL + '/companies/', company)
            .then(function (response) {
                return response;
            })
    }

    function findUsers(firstName, lastName) {
        return $http.get(CONFIG.SERVICE_URL + '/users/search/type-ahead',
            {
                params: {
                    'firstName': firstName,
                    'lastName': lastName
                }
            })
            .then(function (response) {
                return response;
            });
    }

    function getUserPage() {
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