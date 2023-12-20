(function (module) {
    mifosX.controllers = _.extend(module, {
        EditUserController: function (scope, OAUTH_JWT_SERVER_URL, routeParams, resourceFactory, localStorageService, location) {

            scope.formData = {};
            scope.offices = [];
            scope.available = [];
            scope.selected = [];
            scope.selectedRoles = [] ;
            scope.availableRoles = [];

            scope.user = [];
            scope.formData.roles = [] ;

            resourceFactory.userListResource.get({userId: routeParams.id, template: 'true'}, function (data) {
                scope.formData.username = data.username;
                scope.formData.firstname = data.firstname;
                scope.formData.lastname = data.lastname;
                scope.formData.email = data.email;
                scope.formData.officeId = data.officeId;
                scope.getOfficeStaff();
                if(data.staff){
                    scope.formData.staffId = data.staff.id;
                }
                scope.selectedRoles=data.selectedRoles;
                scope.availableRoles = data.availableRoles ;


                scope.userId = data.id;
                scope.offices = data.allowedOffices;
                //scope.availableRoles = data.availableRoles.concat(data.selectedRoles);
                scope.formData.passwordNeverExpires = data.passwordNeverExpires;
            });
            scope.getOfficeStaff = function(){
                resourceFactory.employeeResource.getAllEmployees({officeId:scope.formData.officeId},function (staffs) {
                    scope.staffs = staffs;
                });
            };

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

            var handleError = function (error){
                var data = JSON.parse(error);
                var status = data.error ? data.error : data.errormessage;
                scope.$broadcast("UserEditFailureEvent", data, status);
            }

            var bearerToken = localStorageService.getFromLocalStorage("userData").accessToken;              
            var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append("Authorization", "Bearer " + bearerToken);

                var savetodatabase = function (){
                    if (scope.formData.password) scope.formData.password = "**********";
                    resourceFactory.userListResource.update({'userId': scope.userId}, scope.formData, function (data) {
                        location.path('/viewuser/' + data.resourceId);                    
                    });
                }

                var save_to_keycloak = function (response) {
                    var data = JSON.parse(response);
                    var keycloakid = data[0].id;

                    if (keycloakid === ""){
                        scope.$broadcast("UserEditFailureEvent", scope.formData.email, "User not on Keycloak");
                    }
                    else{                   
                        //update the user in keycloak
                        var payload = {
                            "enabled": scope.formData.disableuser ? false : true,
                            "firstName": scope.formData.firstname,
                            "lastName": scope.formData.lastname,
                            "emailVerified": true
                        };

                        if (scope.formData.password)
                        {
                            payload.credentials = [
                                {
                                "type": "password",
                                "temporary": false,
                                "value": scope.formData.password
                                }];
                        }
                        
                        function findrole(roles) {
                            return roles == "Super user";
                        }

                        if (scope.selectedRoles.find(findrole) !== "undefined") payload.groups = ["user-management"];

                        var requestOptions = {
                        method: 'PUT',
                        headers: myHeaders,
                        body: JSON.stringify(payload),
                        redirect: 'follow'
                        };

                        fetch(OAUTH_JWT_SERVER_URL + "/admin/realms/master/users/" + keycloakid, requestOptions)
                        .then(savetodatabase)
                        .catch(handleError);                        
                    }
                };  

            scope.submit = function () {
                for (var i in scope.selectedRoles) {
                    scope.formData.roles.push(scope.selectedRoles[i].id) ;
                }

                    //do search for the user in keycloak
                    var requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                    };

                    fetch(OAUTH_JWT_SERVER_URL + "/admin/realms/master/users?search=" + scope.formData.email, requestOptions)
                    .then(response => response.text())
                    .then(save_to_keycloak)
                    .catch(handleError);                   
                
            };
        }
    });
    mifosX.ng.application.controller('EditUserController', ['$scope', 'OAUTH_JWT_SERVER_URL','$routeParams', 'ResourceFactory', 'localStorageService', '$location', mifosX.controllers.EditUserController]).run(function ($log) {
        $log.info("EditUserController initialized");
    });
}(mifosX.controllers || {}));
