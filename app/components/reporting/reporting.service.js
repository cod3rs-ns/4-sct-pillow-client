angular
    .module('awt-cts-client')
    .service('reportingService', reportingService);

reportingService.$inject = ['$http', 'CONFIG', '$log'];

function reportingService($http, CONFIG, $log) {
    var service = {
        createReport: createReport
    };

    return service;

    /**
     * Creating new report
     * 
     * @param {any} report   report that will be created
     * @returns response
     */
    function createReport(report) {
        console.log(report);
        return $http.post(CONFIG.SERVICE_URL + '/reports', report)
            .then(function successCallback(response) {
                return response;
            }, function errorCallback(response) {
                $log.warn("Creating report is unsuccessfull");
            });
    };
}