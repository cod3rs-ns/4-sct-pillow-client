(function() {
'use strict';

    angular
        .module('awt-cts-client')
        .controller('ReportsController', ReportsController);

    ReportsController.inject = ['reportingService', '$state', 'LinkParser', 'pagingParams', 'paginationConstants', 'ngToast'];
    function ReportsController(reportingService, $state, LinkParser, pagingParams, paginationConstants, ngToast) {
        var reportVm = this;

        /** List containing all reports */
        reportVm.reports = [];

        /** Attribute containing email of the author for search purpose */
        reportVm.authorEmailSearch = '';

        /** Provided public controller functionality */
        reportVm.rejectReport = rejectReport;
        reportVm.acceptReport = acceptReport;
        reportVm.getReportsByAuthorEmail = getReportsByAuthorEmail;

        /**
         * Type of reports displayed.
         */
        reportVm.reportStatusFilter = 'pending';

        /** Pagination support */
        reportVm.loadPage = loadPage;
        reportVm.predicate = pagingParams.predicate;
        reportVm.reverse = pagingParams.ascending;
        reportVm.transition = transition;
        reportVm.itemsPerPage = paginationConstants.itemsPerPage;
        reportVm.clear = clear;
        reportVm.sort = sort;
        reportVm.activate = activate;

        activate();

        function activate() {
            // required for sorting when search term is active
            if (reportVm.authorEmailSearch) {
                getReportsByAuthorEmail();
            }
            else {
                getReports();
            };
        };

        /**
         * Resolves report as ACCEPTED.
         *
         * @param {integer} reportId    ID of report which will be resolved
         */
        function acceptReport(reportId) {
            reportingService.resolveReport(reportId, 'accepted')
                .then(function (response) {
                    ngToast.create({
                        className: 'success',
                        content: '<strong>Prijava prihvaćena.</strong>'
                    });
                    reportVm.activate();
                })
                .catch(function (error) {
                    ngToast.create({
                        className: 'danger',
                        content: '<p><strong>GREŠKA! </strong>' + error + '</p>'
                    });
                });
        };

        /**
         * Resolves report as REJECTED.
         *
         * @@param {integer} reportId    ID of report which will be resolved
         */
        function rejectReport(reportId) {
            reportingService.resolveReport(reportId, 'rejected')
                .then(function (response) {
                    ngToast.create({
                        className: 'danger',
                        content: '<strong>Prijava odbijena.</strong>'
                    });
                    reportVm.activate();
                })
                .catch(function (error) {
                    ngToast.create({
                        className: 'danger',
                        content: '<p><strong>GREŠKA! </strong>' + error + '</p>'
                    });
                });
        };


        /**
         * Retrieves all pending reports.
         */
        function getReports() {
            reportingService.getReportsByStatus(reportVm.reportStatusFilter, pagingParams.page - 1, reportVm.itemsPerPage, reportVm.sort())
                .then(function (response) {
                    reportVm.links = LinkParser.parse(response.headers('Link'));
                    reportVm.totalItems = response.headers('X-Total-Count');
                    reportVm.page = pagingParams.page;
                    reportVm.reports = response.data;
                })
                .catch(function (error) {
                    ngToast.create({
                        className: 'danger',
                        content: '<p><strong>GREŠKA! </strong>' + error + '</p>'
                    });
                });
        }

        /**
         * Retrieves all reports posted by provided author email in attribute reportVm.authorEmailSearch.
         */
        function getReportsByAuthorEmail() {
            reportingService.getReportsByAuthorEmail(reportVm.authorEmailSearch, pagingParams.page - 1, reportVm.itemsPerPage, reportVm.sort())
                .then(function (response) {
                    reportVm.links = LinkParser.parse(response.headers('Link'));
                    reportVm.totalItems = response.headers('X-Total-Count');
                    reportVm.page = pagingParams.page;
                    reportVm.reports = response.data;
                })
                 .catch(function (error) {
                    $log.error('Unable to retrieve reports');
                });
        };

        /**
         * Loads provided page.
         *
         * @param {integer} page    page to load.
         */
        function loadPage (page) {
            reportVm.page = page;
            reportVm.transition();
        };

        /**
         * Makes state transition to new page.
         */
        function transition () {
            $state.transitionTo($state.$current, {
                page: reportVm.page,
                sort: reportVm.predicate + ',' + (reportVm.reverse ? 'asc' : 'desc'),
            });
        };

        /**
         * Resets pagination attributes.
         */
        function clear () {
            reportVm.links = null;
            reportVm.page = 1;
            reportVm.predicate = 'id';
            reportVm.reverse = true;
            reportVm.transition();
        };

        /**
         * Retrieves sort parameter for search.
         */
        function sort() {
            var result = [reportVm.predicate + ',' + (reportVm.reverse ? 'asc' : 'desc')];
            return result;
        };
    }
})();