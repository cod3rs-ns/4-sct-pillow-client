(function () {
    'use strict';

    angular
        .module('awt-cts-client')
        .controller('CompanyController', CompanyController);

    CompanyController.$inject = ['$state', '$localStorage', '$log', '$stateParams', 'ngToast', 'companyService', 'announcementService', 'userService'];

    function CompanyController($state, $localStorage, $log, $stateParams, ngToast, companyService, announcementService, userService) {

        var companyVm = this;

        companyVm.company = {};
        companyVm.topThree = [];
        companyVm.getCompany = getCompany;
        companyVm.getTopThree = getTopThree;
        companyVm.selectedTab = selectedTab;
        companyVm.requestMembership = requestMembership;

        activate();

        function activate() {
            // Setting interval for carousel
            $('#quote-carousel').carousel({
                pause: true,
                interval: 4000,
            });
            companyService.setUserPage(0);
            companyService.setAnnouncementPage(0);

            companyVm.showMembership = $localStorage.role == 'advertiser';
            companyVm.showUpdateBtn = $localStorage.role == 'admin';

            companyVm.getTopThree($stateParams.companyId);
            companyVm.getCompany($stateParams.companyId);

            // Set company members as active tab
            companyVm.activeTabIndex = 0;

        }

        function selectedTab(state) {
            var page = ((state === 'members') ? companyService.getUserPage() : companyService.getAnnouncementPage());
            $state.transitionTo("company." + state, {
                companyId: $stateParams.companyId,
                page: page
            });
        }

        function getCompany(companyId) {
            companyService.getCompanyById(companyId)
                .then(function (response) {
                    companyVm.company = response.data;
                    findUser();
                    // Setting background image for comapny header page
                    $("#company-cover").backstretch("assets/img/companyCover.jpg");
                })
                .catch(function (error) {
                    $log.error(error);
                });
        }

        function getTopThree(companyId) {
            companyService.getTopThreeByCompanyId(companyId)
                .then(function (response) {
                    companyVm.topThree = response.data;
                })
                .catch(function (error) {
                    $log.error(error);
                });
        }

        function requestMembership() {
            companyService.requestMembership(companyVm.company.id)
                .then(function (response) {
                    companyVm.disableMembership = true;
                    ngToast.create({
                        className: 'success',
                        content: '<p>Uspješno ste zatražili članstvo u kompaniji.</p>'
                    });
                })
                .catch(function (error) {
                    $log.error(error);
                });
        }

        function findUser() {
            userService.getUser($localStorage.user)
                .then(function (response) {
                    companyVm.loggedUser = response.data;
                    if (companyVm.loggedUser.company == null) {
                        companyVm.disableMembership = false;
                    }
                    else {
                        companyVm.disableMembership = companyVm.loggedUser.company.id == companyVm.company.id;
                    }
                })
                .catch(function (error) {
                    $log.error(error);
                });
        }

    }
})();