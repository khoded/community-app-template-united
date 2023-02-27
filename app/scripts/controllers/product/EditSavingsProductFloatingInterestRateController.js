(function (module) {
    mifosX.controllers = _.extend(module, {
        EditSavingsProductFloatingInterestRateController: function (scope, routeParams, resourceFactory, location, dateFilter) {
            resourceFactory.savingProductsFloatingInterestRateResource.get({savingProductId: routeParams.productId, floatingInterestRateId: routeParams.floatingInterestrateId}, function (data) {
                scope.savingProductsFloatingInterestRate = data;
            });
            scope.productId = routeParams.productId;
            scope.floatingInterestRateId = routeParams.floatingInterestrateId;

            scope.submit = function () {
                fromDateSelected = dateFilter(scope.savingProductsFloatingInterestRate.fromDate, scope.df);
                endDateSelected = dateFilter(scope.savingProductsFloatingInterestRate.endDate, scope.df);
                floatingInterestRateValue = scope.savingProductsFloatingInterestRate.floatingInterestRate;
                var updatedSavingProductFloatingInterestRate = {
                    "fromDate": fromDateSelected,
                    "endDate": endDateSelected,
                    "floatingInterestRateValue": floatingInterestRateValue,
                    "dateFormat": scope.df,
                    "locale": scope.optlang.code,
                };

                resourceFactory.savingProductsFloatingInterestRateResource.update({savingProductId: scope.productId, floatingInterestRateId: scope.floatingInterestRateId}, updatedSavingProductFloatingInterestRate, function (data) {
                    location.path('/viewsavingproduct/' + scope.productId + '/floatinginterestrate/' + scope.floatingInterestRateId); //viewsavingproduct/:productId/floatinginterestrate/:floatinginterestrateId
                });
            };
        }
    });
    mifosX.ng.application.controller('EditSavingsProductFloatingInterestRateController', ['$scope', '$routeParams', 'ResourceFactory', '$location','dateFilter', mifosX.controllers.EditSavingsProductFloatingInterestRateController]).run(function ($log) {
        $log.info("EditSavingsProductFloatingInterestRateController initialized");
    });
}(mifosX.controllers || {}));
