angular
    .module('awt-cts-client')
    .service('announcementService', announcementService);

announcementService.$inject = ['$http', 'CONFIG'];

function announcementService($http, CONFIG) {
    var service = {
      getAll: getAll
    };

    return service;

    function getAll(page, size, sort) {
        return $http.get(CONFIG.SERVICE_URL + '/announcements?page=' + page + '&size=' + size + '&sort=' + sort)
          .success(function (data) {
              return data;
          })
          .error(function (data) {
              return data;
          });
    };
}