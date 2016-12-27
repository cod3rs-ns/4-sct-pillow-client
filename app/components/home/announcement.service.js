angular
    .module('awt-cts-client')
    .service('announcementService', announcementService);

announcementService.$inject = ['$http', 'CONFIG', '$log'];

function announcementService($http, CONFIG, $log) {
    var service = {
      getAnnouncements: getAnnouncements,
      getAnnouncementById: getAnnouncementById,
      addAnnouncement: addAnnouncement,
      getAnnouncementsByAuthor: getAnnouncementsByAuthor
    };

    return service;

    function getAnnouncements(page, size, sort) {
        return $http.get(CONFIG.SERVICE_URL + '/announcements/deleted/false?page=' + page + '&size=' + size + '&sort=' + sort)
          .then(function (response) {
              return response;
          });
    };

    function getAnnouncementById(id) {
        return $http.get(CONFIG.SERVICE_URL + '/announcements/' + id)
          .then(function (response) {
              return response;
          });
    };


    function addAnnouncement(announcement) {
        return $http.post(CONFIG.SERVICE_URL + '/announcements', announcement)
          .then(function (response) {
              return response;
          });
    };

    
    /**
     * Retrieves all announcemnts by specified Author ID.
     * 
     * @param {integer} authorId    ID of the announcements author
     * @returns response
     */
    function getAnnouncementsByAuthor(authorId) {
        return $http.get(CONFIG.SERVICE_URL + '/announcements/user/' + authorId + '?page=0')
            .then(function successCallback(response) {
                return response;
            }, function errorCallback(response) {
                $log.warn("Unable to retrieve announcements for provided userId.");
                return response;
            });
    };
}