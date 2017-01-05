(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .controller('HeaderController', HeaderController);

    HeaderController.$inject = ['$localStorage', '$location'];

    function HeaderController($localStorage, $location) {
        var headerVm = this;

        headerVm.projectName = "AWT CTS project";
        headerVm.$storage = $localStorage.$default({
          role: 'guest'
        });

        headerVm.logout = logout;

        function logout() {
            $localStorage.$reset();
            $localStorage.role = 'guest';
            $location.path('/');
        }
    }
})();