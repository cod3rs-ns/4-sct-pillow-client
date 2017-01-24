angular
    .module('awt-cts-client')
    .directive('starRating', starRating);

    function starRating() {
        return {
            restrict : 'A',
            template : '<ul class="rating"><li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)"><span class="glyphicon glyphicon-star" aria-hidden="true"></span></li></ul>',
            scope : {
                ratingValue : '=ngModel',
                max : '=',
                onRatingSelect : '&?',
                readonly: '=?'
            },

            link : function(scope, elem, attrs) {
                var updateStars = function() {
                    scope.stars = [];
                    for (var i = 0; i < scope.max; i++) {
                        scope.stars.push({ filled : i < scope.ratingValue });
                    }
                };

                scope.toggle = function(index) {
                    if (scope.readonly == undefined || scope.readonly === false) {
                        scope.ratingValue = index + 1;
                        scope.onRatingSelect( { rating : index + 1 });
                    }
                };

                scope.$watch('ratingValue', function(oldVal, newVal) {
                    if (newVal) {
                        updateStars();
                    }
                });
            }
        };
    };