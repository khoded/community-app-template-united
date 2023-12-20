(function (module) {
    mifosX.controllers = _.extend(module, {
        ProfileController: function (scope, OAUTH_JWT_SERVER_URL, localStorageService, resourceFactory, $uibModal) {
            scope.formData = {};
            scope.userDetails = localStorageService.getFromLocalStorage('userData');
            resourceFactory.userListResource.get({userId: scope.userDetails.userId}, function (data) {
                scope.user = data;
            });
            scope.status = 'Not Authenticated';
            if (scope.userDetails.authenticated == true) {
                scope.status = 'Authenticated';
            }
            scope.updatePassword = function () {
                $uibModal.open({
                    templateUrl: 'password.html',
                    controller: UpdatePasswordCtrl,
                    resolve: {
                        userId: function () {
                            return scope.userDetails.userId;
                        }
                    }
                });
            };

            var handleError = function (error){
                var data = JSON.parse(error);
                var status = data.error ? data.error : data.errormessage;
                scope.$broadcast("UserEditFailureEvent", data, status);
            }

            var bearerToken = localStorageService.getFromLocalStorage("userData").accessToken;              
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer " + bearerToken);

            var savepasswordtodatabase = function (){
                scope.formData.password = "**********";
                scope.formData.repeatPassword = "**********";  
                resourceFactory.userListResource.update({'userId': userId}, scope.formData, function (data) {
                    $uibModalInstance.close('modal');
                    if (data.resourceId == userId) {
                        scope.logout();
                    };
                });
            }

            var save_password_to_keycloak = function (response) {
                var data = JSON.parse(response);
                var keycloakid = data[0].id;

                if (keycloakid === ""){
                    scope.$broadcast("UserEditFailureEvent", scope.userDetails.username, "User not on Keycloak");
                }
                else{                   
                    //update the user in keycloak
                    var payload = {"credentials" : [
                        {
                        "type": "password",
                        "temporary": false,
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

            var UpdatePasswordCtrl = function ($scope, $uibModalInstance, userId) {
                $scope.save = function () {
                    scope.formData.password = this.formData.password

                    //do search for the user in keycloak
                    var requestOptions = {
                        method: 'GET',
                        headers: myHeaders,
                        redirect: 'follow'
                        };
    
                    fetch(OAUTH_JWT_SERVER_URL + "/admin/realms/master/users?search=" + scope.userDetails.username, requestOptions)
                    .then(response => response.text())
                    .then(save_password_to_keycloak)
                    .catch(handleError);                      
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };
        }
    });
    mifosX.ng.application.controller('ProfileController', ['$scope', 'OAUTH_JWT_SERVER_URL', 'localStorageService', 'ResourceFactory', '$uibModal', mifosX.controllers.ProfileController]).run(function ($log) {
        $log.info("ProfileController initialized");
    });
}(mifosX.controllers || {}));
