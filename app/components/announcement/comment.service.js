(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .service('commentService', commentService);

    commentService.$inject = ['$http', 'CONFIG'];

    function commentService($http, CONFIG) {
        var service = {
          getCommentsForAnnouncement: getCommentsForAnnouncement,
          addComment: addComment
        };

        return service;

        function getCommentsForAnnouncement(id) {
            return $http.get(CONFIG.SERVICE_URL + '/comments/announcement/' + id)
              .then(function (response) {
                  return response;
              });
        };

        function addComment(comment) {
            return $http.post(CONFIG.SERVICE_URL + '/comments', comment)
              .then(function (response) {
                  return response;
              });
        };
    }

})();