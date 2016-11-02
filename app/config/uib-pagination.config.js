(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .config(paginationConfig);

    paginationConfig.$inject = ['uibPaginationConfig', 'paginationConstants'];

    function paginationConfig(uibPaginationConfig, paginationConstants) {
        uibPaginationConfig.itemsPerPage = paginationConstants.itemsPerPage;
        uibPaginationConfig.maxSize = 5;
        uibPaginationConfig.boundaryLinks = true;
        uibPaginationConfig.firstText = 'Prva';
        uibPaginationConfig.previousText = 'Prethodna';
        uibPaginationConfig.nextText = 'Sledeća';
        uibPaginationConfig.lastText = 'Poslednja';
    }
})();
