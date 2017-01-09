(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .factory('MarksUtil', MarksUtil);

    MarksUtil.$inject = ['$localStorage', '$log', '_'];

    function MarksUtil($localStorage, $log, _) {

        var util = {
            average: average,
            updateAverage: updateAverage,
            count: count,
            getMyVote: getMyVote,
            groupByCount: groupByCount
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

        function groupByCount(group, value, oldValue = 0) {
            if (oldValue && !_.isUndefined(group[oldValue])) --group[oldValue];
            group[value] = (_.isUndefined(group[value])) ? 1 : group[value] + 1;
            return group;
        }
    }
})();