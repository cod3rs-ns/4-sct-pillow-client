(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .factory('MarksUtil', MarksUtil);

    MarksUtil.$inject = ['$localStorage', '_'];

    function MarksUtil($localStorage, _) {

        var util = {
            average: average,
            updateAverage: updateAverage,
            count: count,
            getMyVote: getMyVote
        };

        return util;

        function average(marks) {
            return _.meanBy(marks, function(mark) {
                return mark.value;
            }) || 0;
        }

        function updateAverage(newValue, count, average, oldValue = 0) {
            var inc = (oldValue === 0) ? 1 : 0;
            return (average * count + newValue - oldValue) / (count + inc);
        }

        function count(marks) {
            return _.size(marks) || 0;
        }

        function getMyVote(marks) {
            var vote = _.find(marks, function(vote) {
                return vote.grader.username === $localStorage.user;
            });

            return vote || {};
        }
    }
})();