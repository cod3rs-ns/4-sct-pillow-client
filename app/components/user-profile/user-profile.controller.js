(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .controller('UserProfileController', UserProfileController);

    UserProfileController.$inject = [];

    function UserProfileController() {
        var userVm = this;
    }
})();
