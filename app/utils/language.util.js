(function() {
    'use strict';

    angular
        .module('awt-cts-client')
        .factory('LanguageUtil', LanguageUtil);

    LanguageUtil.$inject = ['$localStorage'];

    function LanguageUtil($localStorage) {

        var util = {
            translateRole: translateRole,
            translateAdvertisementType: translateAdvertisementType,
            translateRealEstateType: translateRealEstateType,
            translateHeatingType: translateHeatingType
        };

        return util;

        function translateRole(role) {
            switch (role) {
                case "advertiser":
                  return "oglašavač";
                case "verifier":
                  return "verifikator";
                case "admin":
                  return "administrator";
            }

            return "gost";
        };

        function translateAdvertisementType(type) {
            switch (type) {
                case "sale":
                  return "Prodaja";
                case "rent":
                  return "Iznajmljivanje";
                case "buy":
                  return "Kupovina";
            }

            return "Ostalo";
        };

        function translateRealEstateType(type) {
            switch (type) {
                case "house":
                  return "kuća";
                case "warehouse":
                  return "iznajmljivanje";
                case "apartment":
                  return "stan";
            }

            return "ostalo";
        };

        function translateHeatingType(type) {
            switch (type) {
                case "central":
                  return "centralno";
                case "remote":
                  return "daljinsko";
                case "direct":
                  return "etažno";
            }

            return "ostalo";
        };
    }
})();
