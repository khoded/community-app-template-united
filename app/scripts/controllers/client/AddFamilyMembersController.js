/**
 * Created by nikpa on 26-06-2017.
 */

(function (module) {
    mifosX.controllers = _.extend(module, {
        AddFamilyMembersController: function (scope, resourceFactory, routeParams,dateFilter, location) {

            scope.formData={};
            scope.date = {};
            clientId=routeParams.clientId;
            familyMemberId=routeParams.familyMemberId;

            resourceFactory.familyMemberTemplate.get({clientId:clientId},function(data)
            {
                scope.relationshipIdOptions=data.relationshipIdOptions;
                scope.genderIdOptions=data.genderIdOptions;
                scope.maritalStatusIdOptions=data.maritalStatusIdOptions;
                scope.professionIdOptions=data.professionIdOptions;
                scope.countryOptions = data.countryIdOptions;
                scope.stateOptions = data.stateProvinceIdOptions;
                scope.cityOptions = data.cityIdOptions;
                scope.addressTypes = data.addressTypeIdOptions;


            });





            scope.routeTo=function()
            {
                location.path('/viewclient/'+clientId);
            }

            scope.addClientMember=function()
            {


                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;

                if(scope.date.dateOfBirth){
                    for(var z=0;z<scope.relationshipIdOptions.length;z++) {
                        if (scope.relationshipIdOptions[z].id == scope.formData.relationshipId) {
                            var itemSelected = scope.relationshipIdOptions[z];
                            var selectedValue = itemSelected.name;
                            if (selectedValue != 'Guardian' && selectedValue != 'Parent') {
                                break;
                            } else {
                                var newDate = new Date();
                                newDate.setFullYear(new Date().getFullYear() - 18);
                                var pickerDate = new Date(dateFilter(scope.date.dateOfBirth, scope.df));
                                if (pickerDate > newDate) {
                                    scope.date.dateOfBirth.dateOfBirthError = true;
                                    return;
                               } else {
                                    scope.date.dateOfBirth.dateOfBirthError = false;

                               }
                            }
                        }
                    }
                    this.formData.dateOfBirth = dateFilter(scope.date.dateOfBirth,  scope.df);
                }
                resourceFactory.familyMembers.post({clientId:clientId},scope.formData,function(data)
                {

                    location.path('/viewclient/'+clientId);


                })
            }

        }


    });
    mifosX.ng.application.controller('AddFamilyMembersController', ['$scope','ResourceFactory', '$routeParams','dateFilter', '$location', mifosX.controllers.AddFamilyMembersController]).run(function ($log) {
        $log.info("AddFamilyMemberController initialized");
    });

}
(mifosX.controllers || {}));
