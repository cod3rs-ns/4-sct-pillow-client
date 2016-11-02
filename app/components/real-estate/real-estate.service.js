(function() {
    'use strict';
    angular
        .module('awt-cts-client')
        .factory('RealEstateService', RealEstateService);

    RealEstateService.$inject = ['$resource', 'CONFIG'];

    function RealEstateService ($resource, CONFIG) {
        var resourceUrl =  CONFIG.SERVICE_URL + '/real-estates/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }
})();
