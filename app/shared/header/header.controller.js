(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .controller('HeaderController', HeaderController);

    HeaderController.$inject = ['$localStorage', '$location', 'LanguageUtil'];

    function HeaderController($localStorage, $location, LanguageUtil) {
        var headerVm = this;

        headerVm.projectName = "Pillow.ba";
        headerVm.$storage = $localStorage.$default({
          role: 'guest'
        });

        headerVm.logout = logout;
        headerVm.translateRole = translateRole;

        function logout() {
            $localStorage.$reset();
            $localStorage.role = 'guest';
            $location.path('/login');
        };

        function translateRole(role) {
            return LanguageUtil.translateRole(role);
        }
    }
})();