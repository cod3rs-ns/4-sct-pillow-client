angular
    .module('awt-cts-client')
    .directive('reporterUnique', reporterUnique);

reporterUnique.$inject = ['$http', 'CONFIG']

function reporterUnique($http, CONFIG) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            function customValidator(ngModelValue) {
                if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(ngModelValue)) {
                    ctrl.$setValidity('emailValidator', true);
                } else {
                    ctrl.$setValidity('emailValidator', false);
                }

                return $http.get(CONFIG.SERVICE_URL + '/reports/exists', {
                    params: {
                        "email": ngModelValue,
                        "id": attrs.annId
                    }
                }).then(function (response) {
                    ctrl.$setValidity('reporterEmailValidator', !response.data);
                    return ngModelValue;
                });
            }
            ctrl.$parsers.push(customValidator);
        }
    };
}
