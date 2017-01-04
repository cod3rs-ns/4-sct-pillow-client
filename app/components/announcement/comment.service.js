(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .service('commentService', commentService);

    commentService.$inject = ['$http', 'CONFIG'];

    function commentService($http, CONFIG) {
        var service = {
          getCommentsForAnnouncement: getCommentsForAnnouncement,
          addComment: addComment,
          updateComment: updateComment,
          deleteComment: deleteComment
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

        function updateComment(comment) {
            return $http.put(CONFIG.SERVICE_URL + '/comments', comment)
              .then(function (response) {
                  return response;
              });
        };

        function deleteComment(id) {
            return $http.delete(CONFIG.SERVICE_URL + '/comments/' + id)
              .then(function (response) {
                  return response;
              });
        };
    }

})();