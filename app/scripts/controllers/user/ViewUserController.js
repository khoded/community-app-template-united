(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewUserController: function (scope, OAUTH_JWT_SERVER_URL, routeParams, route, location, resourceFactory, localStorageService, $uibModal) {
            scope.user = [];
            scope.formData = {};
            resourceFactory.userListResource.get({userId: routeParams.id}, function (data) {
                scope.user = data;
            });
            scope.open = function () {
                $uibModal.open({
                    templateUrl: 'password.html',
                    controller: ModalInstanceCtrl
                });
            };
            scope.deleteuser = function () {
                $uibModal.open({
                    templateUrl: 'deleteuser.html',
                    controller: UserDeleteCtrl
                });
            };

            var handleError = function (error){
                var data = JSON.parse(error);
                var status = data.error ? data.error : data.errormessage;
                scope.$broadcast("UserCreationFailureEvent", data, status);
            }

            var bearerToken = localStorageService.getFromLocalStorage("userData").accessToken;              
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer " + bearerToken);

            var savepasswordtodatabase = function (){
                scope.formData.password = "**********";
                scope.formData.repeatPassword = "**********";  
                resourceFactory.userListResource.update({'userId': routeParams.id}, scope.formData, function (data) {
                    $uibModalInstance.close('activate');
                    if (data.resourceId == scope.currentSession.user.userId) {
                        scope.logout();
                    } else{
                        route.reload();
                    };
                });
            }

            var save_password_to_keycloak = function (response) {
                var data = JSON.parse(response);
                var keycloakid = data[0].id;

                if (keycloakid === ""){
                    scope.$broadcast("UserEditFailureEvent", scope.user.email, "User not on Keycloak");
                }
                else{                   
                    //update the user in keycloak
                    var payload = {"credentials" : [
                        {
                        "type": "password",
                        "temporary": true,
                        "value": scope.formData.password
                        }]
                    };

                    var requestOptions = {
                    method: 'PUT',
                    headers: myHeaders,
                    body: JSON.stringify(payload),
                    redirect: 'follow'
                    };

                    fetch(OAUTH_JWT_SERVER_URL + "/admin/realms/master/users/" + keycloakid, requestOptions)
                    .then(savepasswordtodatabase)
                    .catch(handleError);                        
                }
            };  

            var ModalInstanceCtrl = function ($scope, $uibModalInstance) {
                $scope.save = function (staffId) {

                    scope.formData.password = this.formData.password

                    //do search for the user in keycloak
                    var requestOptions = {
                        method: 'GET',
                        headers: myHeaders,
                        redirect: 'follow'
                        };
    
                        fetch(OAUTH_JWT_SERVER_URL + "/admin/realms/master/users?search=" + scope.user.email, requestOptions)
                        .then(response => response.text())
                        .then(save_password_to_keycloak)
                        .catch(handleError);  
                    
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

            var savedeletetodatabase = function (){
                resourceFactory.userListResource.delete({userId: routeParams.id}, {}, function (data) {
                    $uibModalInstance.close('delete');
                    location.path('/users');
                    // added dummy request param because Content-Type header gets removed
                    // if the request does not contain any data (a request body)
                });
            }

            var save_delete_to_keycloak = function (response) {
                var data = JSON.parse(response);
                var keycloakid = data[0].id;

                if (keycloakid === ""){
                    scope.$broadcast("UserEditFailureEvent", scope.user.email, "User not on Keycloak");
                }
                else{                   
                    //update the user in keycloak

                    var requestOptions = {
                    method: 'DELETE',
                    headers: myHeaders,
                    redirect: 'follow'
                    };

                    fetch(OAUTH_JWT_SERVER_URL + "/admin/realms/master/users/" + keycloakid, requestOptions)
                    .then(savedeletetodatabase)
                    .catch(handleError);                        
                }
            };  

            var UserDeleteCtrl = function ($scope, $uibModalInstance) {
                $scope.delete = function () {

                    //do search for the user in keycloak
                    var requestOptions = {
                        method: 'GET',
                        headers: myHeaders,
                        redirect: 'follow'
                        };
    
                        fetch(OAUTH_JWT_SERVER_URL + "/admin/realms/master/users?search=" + scope.user.email, requestOptions)
                        .then(response => response.text())
                        .then(save_delete_to_keycloak)
                        .catch(handleError);
                    
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

        }
    });
    mifosX.ng.application.controller('ViewUserController', ['$scope', 'OAUTH_JWT_SERVER_URL', '$routeParams', '$route', '$location', 'ResourceFactory', 'localStorageService', '$uibModal', mifosX.controllers.ViewUserController]).run(function ($log) {
        $log.info("ViewUserController initialized");
    });
}(mifosX.controllers || {}));
