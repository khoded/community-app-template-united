(function (module) {
    mifosX.controllers = _.extend(module, {
        AddMemberToGSimAccountController: function ($q, scope, routeParams, route, location, resourceFactory, $uibModal) {
                scope.groupId=routeParams.groupId;
                scope.gsimAccountNumber=routeParams.gsimAccountNumber;
                scope.parentGSIMId=routeParams.parentGSIMId;
                scope.allMembers = [];

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

                scope.add = function () {
                console.log("Add Member !!");
                };
        }
    });
    mifosX.ng.application.controller('AddMemberToGSimAccountController', ['$q','$scope', '$routeParams', '$route', '$location', 'ResourceFactory', '$uibModal', mifosX.controllers.AddMemberToGSimAccountController]).run(function ($log) {
        $log.info("AddMemberToGSimAccountController initialized");
    });
}(mifosX.controllers || {}));
