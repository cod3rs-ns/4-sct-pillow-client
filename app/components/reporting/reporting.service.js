(function() {
'use strict';

    angular
        .module('awt-cts-client')
        .service('reportingService', reportingService);

    reportingService.$inject = ['$http', 'CONFIG', '$log'];

    function reportingService($http, CONFIG, $log) {
        var service = {
            createReport: createReport,
            getReportsByStatus: getReportsByStatus,
            resolveReport: resolveReport,
            getReportsByAuthorEmail: getReportsByAuthorEmail
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

        /**
         * Retrieves all reports that matches provided status.
         * 
         * @param {string}  status  report status - pending, accepted, rejected
         * @param {integer} page    page to retrieve from repository
         * @param {integer} size    page size
         * @param {string}  sort    sort attributes
         * @returns response
         */
        function getReportsByStatus(status, page, size, sort) {
            return $http.get(CONFIG.SERVICE_URL + '/reports/status/' + status + '?page=' + page + '&size=' + size + '&sort=' + sort)
                .then(function successCallback(response) {
                    return response;
                }, function errorCallback(response) {
                    $log.warn("Unable to retrieve reports");
                    throw "unable_to_retreave_reports";
                });
        };

        /**
         * Resolves report's status.
         * 
         * @param {integer} reportId    ID of the report to be resolved   
         * @param {string}  status      resolving status - accepted, rejected
         * @returns response
         */
        function resolveReport(reportId, status) {
            return $http.put(CONFIG.SERVICE_URL + '/reports/resolve/' + reportId + '?status=' + status)
                .then(function successCallback(response) {
                    return response;
                }, function errorCallback(response) {
                    $log.warn(response.headers('X-SCT-Alert'));
                    throw response.headers('X-SCT-Alert');
                });
        };

        /**
         * Retrieves reports posted by provided email.
         * 
         * @param {any} authorEmail email of the author of the reports
         * @param {integer} page    page to retrieve from repository
         * @param {integer} size    page size
         * @param {string}  sort    sort attributes
         * @returns response
         */
        function getReportsByAuthorEmail(authorEmail, page, size, sort) {
            return $http.get(CONFIG.SERVICE_URL + '/reports/author/' + authorEmail + '?page=' + page + '&size=' + size + '&sort=' + sort)
                .then(function successCallback(response) {
                    return response;
                }, function errorCallback(response) {
                    $log.warn(response.headers('X-SCT-Alert'));
                    throw response.headers('X-SXT-Alert');
                });
        };
    }
})();