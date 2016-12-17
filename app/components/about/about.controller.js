(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .controller('AboutController', AboutController);

    AboutController.$inject = ['$log']

    function AboutController($log) {
        var aboutVm = this;

        $log.info("About Controller init!");

        homeVm.authors = [  "SW3-2013  Stefan Ristanović",
                            "SW9-2013  Bojan Blagojević",
                            "SWF-2013  Dragutin Marjanović",
                            "SW20-2013 Aleksa Zrnić"];
    }
})();