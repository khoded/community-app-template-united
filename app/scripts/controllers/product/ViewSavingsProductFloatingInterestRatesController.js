(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewSavingsProductFloatingInterestRatesController: function (scope, routeParams, location, anchorScroll, resourceFactory) {
            resourceFactory.savingProductResource.get({savingProductId: routeParams.id, template: 'true'}, function (data) {
                scope.savingproduct = data;
                scope.hasAccounting = data.accountingRule.id == 2 || data.accountingRule.id == 3 ? true : false;
            });

            scope.scrollto = function (link) {
                location.hash(link);
                anchorScroll();

            };
        }
    });
    mifosX.ng.application.controller('ViewSavingsProductFloatingInterestRatesController', ['$scope', '$routeParams', '$location', '$anchorScroll' , 'ResourceFactory', mifosX.controllers.ViewSavingsProductFloatingInterestRatesController]).run(function ($log) {
        $log.info("ViewSavingsProductFloatingInterestRatesController initialized");
    });
}(mifosX.controllers || {}));