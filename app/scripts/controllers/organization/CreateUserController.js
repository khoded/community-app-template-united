(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateUserController: function (scope, OAUTH_JWT_SERVER_URL, OAUTH_REALM, resourceFactory, localStorageService, location) {
            scope.offices = [];
            scope.available = [];
            scope.selected = [];
            scope.selectedRoles = [] ;
            scope.availableRoles = [];
            scope.formData = {
                sendPasswordToEmail: true,
                roles: []
            };
            resourceFactory.userTemplateResource.get(function (data) {
                scope.offices = data.allowedOffices;
                scope.availableRoles = data.availableRoles;
            });

            scope.addRole = function () {
                for (var i in this.available) {
                    for (var j in scope.availableRoles) {
                        if (scope.availableRoles[j].id == this.available[i]) {
                            var temp = {};
                            temp.id = this.available[i];
                            temp.name = scope.availableRoles[j].name;
                            scope.selectedRoles.push(temp);
                            scope.availableRoles.splice(j, 1);
                        }
                    }
                }
                //We need to remove selected items outside of above loop. If we don't remove, we can see empty item appearing
                //If we remove available items in above loop, all items will not be moved to selectedRoles
                for (var i in this.available) {
                    for (var j in scope.selectedRoles) {
                        if (scope.selectedRoles[j].id == this.available[i]) {
                            scope.available.splice(i, 1);
                        }
                    }
                }
            };
            scope.removeRole = function () {
                for (var i in this.selected) {
                    for (var j in scope.selectedRoles) {
                        if (scope.selectedRoles[j].id == this.selected[i]) {
                            var temp = {};
                            temp.id = this.selected[i];
                            temp.name = scope.selectedRoles[j].name;
                            scope.availableRoles.push(temp);
                            scope.selectedRoles.splice(j, 1);
                        }
                    }
                }
                //We need to remove selected items outside of above loop. If we don't remove, we can see empty item appearing
                //If we remove selected items in above loop, all items will not be moved to availableRoles
                for (var i in this.selected) {
                    for (var j in scope.availableRoles) {
                        if (scope.availableRoles[j].id == this.selected[i]) {
                            scope.selected.splice(i, 1);
                        }
                    }
                }
            };

            scope.getOfficeStaff = function(){
                resourceFactory.employeeResource.getAllEmployees({officeId:scope.formData.officeId},function (data) {
                    scope.staffs = data;
                });
            };

            var bearerToken = localStorageService.getFromLocalStorage("userData").accessToken;

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer " + bearerToken);

            var handleError = function (error){
                var data = JSON.parse(error);
                var status = data.error ? data.error : data.errormessage;
                scope.$broadcast("UserCreationFailureEvent", data, status);
            }

            var savetodatabase = function (){
                if (scope.formData.password) scope.formData.password = "**********";  
                if(scope.formData.repeatPassword) scope.formData.repeatPassword = "**********";  
                if (scope.formData.sendPasswordToEmail) scope.formData.sendPasswordToEmail=false;     
                resourceFactory.userListResource.save(scope.formData, function (data) {
                    location.path('/viewuser/' + data.resourceId);
                });
            }

            var save_to_keycloak = function(response){
                var data = JSON.parse(response);
                var keycloakid = "";
                if (data.length > 0) data[0].id;

                if (keycloakid !== ""){
                    savetodatabase();
                }
                else{
                    var payload = {
                        "username": scope.formData.username,
                        "enabled": false,
                        "firstName": scope.formData.firstname,
                        "lastName": scope.formData.lastname,
                        "email": scope.formData.email,
                        "emailVerified": true,
                        "credentials": [
                            {
                            "type": "password",
                            "temporary": true,
                            "value": scope.formData.password
                            }
                        ]
                    };
                    
                    function findrole(roles) {
                        return roles == "Super user";
                    }

                    if (scope.selectedRoles.find(findrole) !== "undefined") payload.groups = ["user-management"];

                    var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: JSON.stringify(payload),
                    redirect: 'follow'
                    };

                    fetch(OAUTH_JWT_SERVER_URL + "/admin/realms/" + OAUTH_REALM + "/users", requestOptions)
                    .then(savetodatabase)
                    .catch(handleError);   
                }      
            }

            scope.submit = function () {
                for (var i in scope.selectedRoles) {
                    scope.formData.roles.push(scope.selectedRoles[i].id) ;
                }

                //check if exists on keycloak
                var requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };
    
                fetch(OAUTH_JWT_SERVER_URL + "/admin/realms/" + OAUTH_REALM + "/users?search=" + scope.formData.email, requestOptions)
                .then(response => response.text())
                .then(save_to_keycloak)
                .catch(handleError);                                    
            };
        }
    });
    mifosX.ng.application.controller('CreateUserController', ['$scope', 'OAUTH_JWT_SERVER_URL', 'OAUTH_REALM', 'ResourceFactory', 'localStorageService', '$location', mifosX.controllers.CreateUserController]).run(function ($log) {
        $log.info("CreateUserController initialized");
    });
}(mifosX.controllers || {}));
