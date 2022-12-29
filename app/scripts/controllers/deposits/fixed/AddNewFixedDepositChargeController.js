(function (module) {
    mifosX.controllers = _.extend(module, {
        AddNewFixedDepositChargeController: function (scope, resourceFactory, location, routeParams, dateFilter) {
            scope.offices = [];
            scope.cancelRoute = routeParams.id;
            scope.date = {};
            scope.varyAmounts = false;

            resourceFactory.savingsChargeResource.get({accountId: routeParams.id, resourceType: 'template'}, function (data) {
                scope.chargeOptions = data.chargeOptions;
            });

            scope.chargeSelected = function (id) {
                resourceFactory.chargeResource.get({chargeId: id, template: 'true'}, function (data) {
                    scope.chargeCalculationType = data.chargeCalculationType.id;
                    scope.chargeTimeType = data.chargeTimeType.id;
                    scope.chargeDetails = data;
                    scope.formData.amount = data.amount;
                    scope.withDrawCharge = data.chargeTimeType.value === "Withdrawal Fee" ? true : false;
                    scope.liquidationFee = data.chargeTimeType.code === "chargeTimeType.fdaPartialLiquidationFee" ? true : false;
                    scope.formData.feeInterval = data.feeInterval;
                    scope.varyAmounts = data.varyAmounts;
                    
                    if (data.chargeTimeType.value === "Annual Fee" || data.chargeTimeType.value === "Monthly Fee") {
                        scope.chargeTimeTypeAnnualOrMonth = true;
                    }

                    if(scope.varyAmounts){
                        scope.chargeSlabs = data.charges;
                    }
                });
            };

            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                if (scope.withDrawCharge !== true) {
                    if (scope.chargeTimeTypeAnnualOrMonth === true) {
                        this.formData.monthDayFormat = "dd MMMM";
                        if (scope.date.due) {
                            this.formData.feeOnMonthDay = dateFilter(scope.date.due, 'dd MMMM');
                        } else {
                            this.formData.feeOnMonthDay = "";
                        }
                    } else {
                        this.formData.dateFormat = scope.df;
                        if (scope.date.specificduedate) {
                            this.formData.dueDate = dateFilter(scope.date.specificduedate, scope.df);
                        } else {
                            this.formData.dueDate = "";
                        }
                    }
                }

                if(scope.liquidationFee){
                    delete this.formData.dueDate
                    delete this.formData.amount
                }

                resourceFactory.savingsChargeResource.save({accountId: routeParams.id}, this.formData, function (data) {
                    location.path('/viewfixeddepositaccount/' + routeParams.id);
                });
            };
        }
    });
    mifosX.ng.application.controller('AddNewFixedDepositChargeController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.AddNewFixedDepositChargeController]).run(function ($log) {
        $log.info("AddNewFixedDepositChargeController initialized");
    });
}(mifosX.controllers || {}));
