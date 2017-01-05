(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .factory('CommentsUtil', CommentsUtil);

    CommentsUtil.$inject = ['$localStorage'];

    function CommentsUtil($localStorage) {

        var util = {
            formatComment: formatComment
        };

        return util;

        function formatComment(comment) {
            var isMy = false;

            if (comment.author !== null) {
                var author = {
                    'name': comment.author.firstName + ' ' + comment.author.lastName,
                    'image': comment.author.imagePath
                }

                isMy = $localStorage.user === comment.author.username;
            }
            else {
                var author = {
                    'name': 'Gost na sajtu',
                    'image': "http://megaicons.net/static/img/icons_sizes/8/178/512/user-role-guest-icon.png"
                }
            }

            return {
                'id': comment.id,
                'content': comment.content,
                'date': comment.date,
                'author': author,
                'isMy': isMy
            }
        }
    }
})();
