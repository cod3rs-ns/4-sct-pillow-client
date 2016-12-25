(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .controller('HeaderController', HeaderController);

    HeaderController.$inject = ['$log', '$localStorage', '$location'];

    function HeaderController($log, $localStorage, $location) {
        var headerVm = this;

        headerVm.projectName = "AWT CTS project";
        headerVm.$storage = $localStorage.$default({
          role: 'guest'
        });

        headerVm.logout = logout;

        activate();

        function activate() {
            $log.info("Header Controller init!");
            $log.info("Role " + headerVm.$storage.role);
        }

        function logout() {
            $localStorage.$reset();
            $localStorage.role = 'guest';
            $location.path('/');
        }
    }
})();