(function (module) {
    mifosX.controllers = _.extend(module, {
        SavingsProductFloatingInterestRateController: function (scope, routeParams, location, resourceFactory, route, $uibModal) {

            resourceFactory.savingProductsFloatingInterestRateResource.get({savingProductId: routeParams.productId, floatingInterestRateId: routeParams.floatinginterestrateId}, function (data) {
                scope.savingProductsFloatingInterestRate = data;
            });

            scope.productId = routeParams.productId;
            scope.floatingInterestRateId = routeParams.floatinginterestrateId;

            scope.deleteGLAccount = function () {
                $uibModal.open({
                    templateUrl: 'deleteglacc.html',
                    controller: GlAccDeleteCtrl
                });
            };

            var GlAccDeleteCtrl = function ($scope, $uibModalInstance) {
                $scope.delete = function () {
                    resourceFactory.accountCoaResource.delete({glAccountId: routeParams.id}, {}, function (data) {
                        $uibModalInstance.close('delete');
                        location.path('/accounting_coa');
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

            scope.changeState = function (disabled) {
                resourceFactory.accountCoaResource.update({'glAccountId': routeParams.id}, {disabled: !disabled}, function (data) {
                    route.reload();
                });
            };
        }
    });
    mifosX.ng.application.controller('SavingsProductFloatingInterestRateController', ['$scope', '$routeParams', '$location', 'ResourceFactory', '$route', '$uibModal', mifosX.controllers.SavingsProductFloatingInterestRateController]).run(function ($log) {
        $log.info("SavingsProductFloatingInterestRateController initialized");
    });
}(mifosX.controllers || {}));
