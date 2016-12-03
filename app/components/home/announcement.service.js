angular
    .module('awt-cts-client')
    .service('announcementService', announcementService);

announcementService.$inject = ['$http', 'CONFIG'];

function announcementService($http, CONFIG) {
    var service = {
      getAnnouncements: getAnnouncements,
      getAnnouncementById: getAnnouncementById,
      addAnnouncement: addAnnouncement
    };

    return service;

    function getAnnouncements(page, size, sort) {
        return $http.get(CONFIG.SERVICE_URL + '/announcements?page=' + page + '&size=' + size + '&sort=' + sort)
          .success(function (data) {
              return data;
          })
          .error(function (data) {
              return data;
          });
    };

    function getAnnouncementById(id) {
        return $http.get(CONFIG.SERVICE_URL + '/announcements/' + id)
          .success(function (data) {
              return data;
          })
          .error(function (data) {
              return data;
          });
    };

    
    function addAnnouncement(announcement) {
        return $http.post(CONFIG.SERVICE_URL + '/announcements', announcement)
          .success(function (data) {
              return data;
          })
          .error(function (data) {
              return data;
          });
    };
}