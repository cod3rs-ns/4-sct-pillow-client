angular
    .module('awt-cts-client')
    .directive('fieldUnique', fieldUnique);

fieldUnique.$inject = ['$http', 'CONFIG']

function fieldUnique($http, CONFIG) {
    console.log("unique");
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            element.bind('change', function (e) {
                attrName = element.attr("name");
                if (!ngModel || !element.val()) return;
                var keyProperty = scope.$eval(attrs.fieldUnique);
                var currentValue = element.val();

                if (attrName == 'username') {
                    $http.get(CONFIG.SERVICE_URL + "/users/username-available",
                        { params: { username: element.val() } })
                        .success(function (data) {
                            ngModel.$loading = false;
                            ngModel.$setValidity('unique', data);
                        });
                }
                else if (attrName == 'email') {
                    $http.get(CONFIG.SERVICE_URL + "/users/email-available",
                        { params: { email: element.val() } })
                        .success(function (data) {
                            ngModel.$loading = false;
                            ngModel.$setValidity('unique', data);
                        });
                }
            });
        }
    };
}
