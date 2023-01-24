(function (module) {
    mifosX.controllers = _.extend(module, {
        AddMemberToGSimAccountController: function ($q, scope, routeParams, route, location, resourceFactory, $uibModal) {

                scope.clientOptions = function(value){
                var deferred = $q.defer();
                resourceFactory.groupGSIMAccountResource.getAllGSimAccountMembersWithOutSavingsAccount({displayName: value, orderBy : 'displayName', parentGSIMId : scope.parentGSIMId,
                sortOrder : 'ASC', orphansOnly : true}, function (data) {
                    deferred.resolve(data.pageItems);
                });
                return deferred.promise;
                };


        }
    });
    mifosX.ng.application.controller('AddMemberToGSimAccountController', ['$q','$scope', '$routeParams', '$route', '$location', 'ResourceFactory', '$uibModal', mifosX.controllers.AddMemberToGSimAccountController]).run(function ($log) {
        $log.info("AddMemberToGSimAccountController initialized");
    });
}(mifosX.controllers || {}));
