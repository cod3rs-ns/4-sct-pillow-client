angular
    .module('awt-cts-client')
    .service('companyService', companyService);

companyService.$inject = ['$http', 'CONFIG', '$log'];

function companyService($http, CONFIG, $log) {
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
      getUserRequestsByStatusPending: getUserRequestsByStatusPending,
      resolveMembershipRequest: resolveMembershipRequest
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
        return $http.get(CONFIG.SERVICE_URL + '/announcements/top/company/' + companyId )
          .success(function (data, status, headers) {
              return data;
          })
          .error(function (data) {
              return data;
          });
    };

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
                return response;
            });
    };

    /**
     * Resolves {User} request to join company.
     * @param {integer} userId      ID of the user which status will be resolved
     * @param {boolean} accepted    Flag - true if request will be accepted, false otherwise
     */
    function resolveMembershipRequest(userId, accepted) {
        return $http.put(CONFIG.SERVICE_URL + '/companies/resolve-request/user/' + userId + '?accepted=' + accepted)
            .then(function successCallback(response){
                return response.data;
            }, function errorCallback(response) {
                $log.error("Unable to resolve membership request.")
                return response.data;
            });
    };

    function getUserPage(){
        return pageStatuses.userPage;
    }

    function setUserPage(userPage){
        pageStatuses.userPage = userPage;
    }

    function getAnnouncementPage(){
        return pageStatuses.announcementPage;
    }
    
    function setAnnouncementPage(announcementPage){
        pageStatuses.announcementPage = announcementPage;
    }
}