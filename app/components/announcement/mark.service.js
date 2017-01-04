(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .service('markService', markService);

    markService.$inject = ['$http', 'CONFIG'];

    function markService($http, CONFIG) {
        var service = {
          getMarksForAnnouncement: getMarksForAnnouncement,
          getMarksForAnnouncer: getMarksForAnnouncer,
          vote: vote,
          updateVote: updateVote
        };

        return service;

        function getMarksForAnnouncement(id) {
            return $http.get(CONFIG.SERVICE_URL + '/marks/announcement/' + id)
              .then(function (response) {
                  return response;
              });
        };

        function getMarksForAnnouncer(id) {
            return $http.get(CONFIG.SERVICE_URL + '/marks/user/' + id)
              .then(function (response) {
                  return response;
              });
        };

        function vote(mark) {
            return $http.post(CONFIG.SERVICE_URL + '/marks', mark)
              .then(function (response) {
                  return response;
              });
        };

        function updateVote(mark) {
            return $http.put(CONFIG.SERVICE_URL + '/marks', mark)
              .then(function (response) {
                  return response;
              });
        };
    }

})();