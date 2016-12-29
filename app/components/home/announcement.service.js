angular
    .module('awt-cts-client')
    .service('announcementService', announcementService);

announcementService.$inject = ['$http', 'CONFIG', '$log'];

function announcementService($http, CONFIG, $log) {
    var service = {
      getAnnouncements: getAnnouncements,
      getAnnouncementById: getAnnouncementById,
      addAnnouncement: addAnnouncement,
      getAnnouncementsByAuthor: getAnnouncementsByAuthor,
      extendExpirationDate: extendExpirationDate
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

    /**
     * Extends announcement Expiration Date to provided value.
     * 
     * @param {any} annId           ID of the announcement
     * @param {any} expirationMap   Map containging pair expirationDate:dateValue -> format dd/MM/yyyy
     * @returns response
     */
    function extendExpirationDate(annId, expirationMap) {
        return $http.put(CONFIG.SERVICE_URL + '/announcements/' + annId, expirationMap)
            .then(function successCallback(response){
                $log.info("Expiration date extended to " + expirationMap['expirationDate'] + "!");
                return response;
            }, function errorCallback(response) {
                $log.warn("Operation unsuccessful beacuse of: " + response.headers('X-SCT-ALERT'));
                throw response.headers('X-SCT-ALERT');
            });
    };
}