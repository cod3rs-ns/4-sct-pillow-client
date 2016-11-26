angular
    .module('awt-cts-client')
    .controller('CompanyController', CompanyController);

CompanyController.$inject = ['$scope', '$state', '$stateParams', 'companyService', 'announcementService'];

function CompanyController($scope, $state, $stateParams, companyService, announcementService) {

    var companyVm = this;

    companyVm.company = {};
    companyVm.topThree = [];
    companyVm.getCompany = getCompany;
    companyVm.getTopThree = getTopThree;
    companyVm.selectedTab = selectedTab;

    activate();

    function activate() {
        // Setting interval for carousel
        $('#quote-carousel').carousel({
            pause: true,
            interval: 4000,
        });

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

                // Setting background image for comapny header page
                $("#company-cover").backstretch("assets/img/companyCover.jpg");
            });
    }

    function getTopThree(companyId) {
        companyService.getTopThreeByCompanyId(companyId)
            .then(function (response) {
                companyVm.topThree = response.data;
            });
    }
}