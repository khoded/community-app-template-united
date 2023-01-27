(function (module) {
    mifosX.controllers = _.extend(module, {
        AddMemberToGSimAccountController: function ($q, scope, routeParams, route, location, resourceFactory, $uibModal) {
                scope.groupId=routeParams.groupId;
                scope.gsimAccountNumber=routeParams.gsimAccountNumber;
                scope.parentGSIMId=routeParams.parentGSIMId;
                scope.gsimChildAccountId=routeParams.gsimChildAccountId;
                scope.allMembers = [];
                scope.formData = {};
                scope.lockinPeriodFrequencyTypeStandBy;
                scope.lockinPeriodFrequencyStandBy;

             resourceFactory.savingsResource.get({accountId: scope.gsimChildAccountId, template: 'true', associations: 'charges',staffInSelectedOfficeOnly:'true'}, function (data) {
                 scope.data = data;
                 if (data.groupId) {
                     scope.formData.groupId = data.groupId;
                     scope.groupName = data.groupName;
                 }
                 scope.formData.nominalAnnualInterestRate = data.nominalAnnualInterestRate;
                 scope.formData.productId = data.savingsProductId;
                 scope.products = data.productOptions;
                 scope.formData.lockinPeriodFrequency = data.lockinPeriodFrequency;
                 scope.lockinPeriodFrequencyStandBy = data.lockinPeriodFrequency;
                 scope.formData.locale = "en";
                 scope.formData.isGSIM = true;
                 if (data.lockinPeriodFrequencyType){
                 scope.formData.lockinPeriodFrequencyType = data.lockinPeriodFrequencyType.id;
                 scope.lockinPeriodFrequencyTypeStandBy = data.lockinPeriodFrequencyType.id;
                 }
                 console.log(scope.data);
             });


                 scope.viewClient = function (item) {
                 scope.client = item;
                 };

                scope.clientOptions = function(value){
                var deferred = $q.defer();
                resourceFactory.groupGSIMAccountResource.getAllGSimAccountMembersWithOutSavingsAccount({groupId: scope.groupId,parentGSIMAccountNo:scope.gsimAccountNumber,name: value, orderBy : 'name', sortOrder : 'ASC'}, function (data) {
                deferred.resolve(data[0].savingsSummaryCustoms);
                });
                return deferred.promise;
                };

                 resourceFactory.groupGSIMAccountResource.get({groupId: scope.groupId,parentGSIMAccountNo:scope.gsimAccountNumber}, function (data) {
                 scope.allMembers = data[0].childGSIMAccounts;
                });

                scope.submit = function () {
                this.formData.clientId = scope.client.id;

                resourceFactory.addMemberToGsimResource.addmember({'parentAccountId':  scope.parentGSIMId}, this.formData, function (data) {
                                    location.path('/viewgsimaccount/' + scope.groupId+"/"+scope.gsimAccountNumber);
                                });
                };

                scope.cancel = function(){
                scope.available = "";
                this.formData.vaultTargetAmount = null;
                this.formData.lockinPeriodFrequency = scope.lockinPeriodFrequencyStandBy;
                this.formData.lockinPeriodFrequencyType = scope.lockinPeriodFrequencyTypeStandBy;
                }
        }
    });
    mifosX.ng.application.controller('AddMemberToGSimAccountController', ['$q','$scope', '$routeParams', '$route', '$location', 'ResourceFactory', '$uibModal', mifosX.controllers.AddMemberToGSimAccountController]).run(function ($log) {
        $log.info("AddMemberToGSimAccountController initialized");
    });
}(mifosX.controllers || {}));
