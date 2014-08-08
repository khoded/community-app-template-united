(function (module) {
    mifosX.controllers = _.extend(module, {
        MemberManageController: function (scope, routeParams, route, location, resourceFactory, $modal) {
            scope.group = [];

            scope.viewClient = function (item) {
                scope.client = item;
            };
            
            resourceFactory.groupResource.get({groupId: routeParams.id, associations: 'all'}, function (data) {
                scope.group = data;
            });

            resourceFactory.groupResource.get({groupId: routeParams.id, associations: 'clientMembers', template: 'true'}, function (data) {
                scope.allClients = data.clientOptions;
                scope.allMembers = data.clientMembers;
            });
            
            scope.add = function () {
            	if(scope.available != ""){
	                scope.associate = {};
	            	scope.associate.clientMembers = [];
	                scope.associate.clientMembers[0] = scope.available.id;
	                console.log(scope.associate);
	                resourceFactory.groupResource.save({groupId: routeParams.id, command: 'associateClients'}, scope.associate, function (data) {
                        var temp = {};
                        temp.id = scope.available.id;
                        temp.displayName = scope.available.displayName;
                        scope.allMembers.push(temp);
	                });
            	}
            };

            scope.remove = function (id) {
            	$modal.open({
                    templateUrl: 'delete.html',
                    controller: MemberDeleteCtrl
                });
            	scope.disassociate = {};
            	scope.disassociate.clientMembers = [];
            	scope.disassociate.clientMembers.push(id);
            };
            
            var MemberDeleteCtrl = function ($scope, $modalInstance) {
                $scope.delete = function () {
                	resourceFactory.groupResource.save({groupId: routeParams.id, command: 'disassociateClients'}, scope.disassociate, function (data) {
                        scope.allMembers.splice(0, 1);
                        $modalInstance.close('activate');
                    });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
        }
    });
    mifosX.ng.application.controller('MemberManageController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory', '$modal', mifosX.controllers.MemberManageController]).run(function ($log) {
        $log.info("MemberManageController initialized");
    });
}(mifosX.controllers || {}));
