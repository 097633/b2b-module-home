(function(){
'use strict';

angular.module('homeModule')
.controller('homeController', home);

home.$inject = ['$rootScope', 'storageFactory', 'homeFactory', 'helperFunctionsFactory'];

function home($rootScope, storageFactory, homeFactory, helperFunctionsFactory) {

    /* jshint validthis: true */
    var vm = this;
    vm.approveApp = approveApp;
    getUnapprovedApps();
    getSystemNotifications();
    getHistory();

    function getUnapprovedApps() {
        var storageCreds = storageFactory.getCreds();
        if(storageCreds !== false) {
            $rootScope.oauth = {};
            $rootScope.oauth.access_token = storageCreds.authToken;
        }
        return homeFactory.getUnapprovedApps()
        .then(function (response) {

            // $rootScope.oauth = {};
            // $rootScope.oauth.access_token = storageCreds.authToken;
            vm.unapprovedApps = response;
        });
    }

    function approveApp(app) {
        console.log('approve app invoked for app id:');
        console.log(app.id);
    }

    function getSystemNotifications() {
        return homeFactory.getSystemNotifications()
        .then(function (response) {
            console.log(response);
            vm.systemNotifications = response;
        });
    }	

    function getHistory() {
        return homeFactory.getHistory()
        .then(function (response) {
            console.log(response);
            //vm.histories = response.auditTrails;
            vm.histories = initHistoriesList(response.auditTrails);
        });
    }

    function initHistoriesList(historyAlertsList) {
        console.log('historyAlertsList');
        console.log(historyAlertsList.length);
        if(historyAlertsList == undefined || historyAlertsList == null){
            return;
        }
        //var jstTimeZone = helperFunctionsFactory.getTimeZoneByCountry("JP").replace("UTC","");
        for (var i = 0; i < historyAlertsList.length; i++){
            var activityType = historyAlertsList[i].activityType;
            var eventContent = "";
            //var jstTime = helperFunctionsFactory.convertUTCTimeToLocaleTime(historyAlertsList[i].eventHappenTime, "UTC+09:00");
            //var newEventHappenTime = helperFunctionsFactory.convertShortYearDate(jstTime);     
            switch (activityType){
                case "ADDED_APP":{
                    var appName=historyAlertsList[i].app.appName;
                    var appVersion=historyAlertsList[i].app.appVersion;
                    if (appVersion==undefined){
                        appVersion="";
                    }
                    for(var j = 0;j<historyAlertsList[i].regions.length;j++){
                        historyAlertsList[i].regions[j].name = $.t("region."+historyAlertsList[i].regions[j].name.replace(".","_").replace(" ","_").replace("/","_"));
                        for(var k = 0;k<historyAlertsList[i].regions[j].countries.length;k++){
                            historyAlertsList[i].regions[j].countries[k] = $.t("country."+historyAlertsList[i].regions[j].countries[k]);
                        }
                    }
                    eventContent=$.t('audit.'+activityType,{appName:appName,appVersion:appVersion});
                    break;
                }
                case "SUBMITTED_APP":{
                    var appName=historyAlertsList[i].app.appName;
                    var appVersion=historyAlertsList[i].app.appVersion;
                    if (appVersion==undefined){
                        appVersion="";
                    }
                    for(var j = 0;j<historyAlertsList[i].submittedAppSpecs.length;j++){
                        historyAlertsList[i].submittedAppSpecs[j].region = $.t("region."+historyAlertsList[i].submittedAppSpecs[j].region.replace(".","_").replace(" ","_").replace("/","_"));
                        for(var k = 0;k<historyAlertsList[i].submittedAppSpecs[j].countries.length;k++){
                            historyAlertsList[i].submittedAppSpecs[j].countries[k].country = $.t("country."+historyAlertsList[i].submittedAppSpecs[j].countries[k].country);
                        }
                    }
                    var availabilitySummary = helperFunctionsFactory.getAvailabilitySummary(historyAlertsList[i].submittedAppSpecs[0].countries[0].availabilitySummary.make);
                    eventContent=$.t('audit.'+activityType,{appName:appName,appVersion:appVersion,country:historyAlertsList[i].submittedAppSpecs[0].countries[0].country,availabilitySummary:availabilitySummary});
                    break;
                }
                case "APPROVED_APP_FOR_RELEASE":{
                    var appName=historyAlertsList[i].app.appName;
                    var appVersion=historyAlertsList[i].app.appVersion;
                    if (appVersion==undefined){
                        appVersion="";
                    }
                    var regionName=historyAlertsList[i].region;
                    historyAlertsList[i].country = $.t("country."+historyAlertsList[i].country);
                    var availabilitySummary = helperFunctionsFactory.getAvailabilitySummary(historyAlertsList[i].make);
                    regionName=$.t('region.'+regionName.replace(".","_").replace(" ","_").replace("/","_"));
                    eventContent=$.t('audit.'+activityType,{appName:appName,appVersion:appVersion,country:historyAlertsList[i].country,availabilitySummary:availabilitySummary});
                    break;
                }
                case "APPROVED_DEFAULT_REGION_POLICIES_FOR_RELEASE":{
                    var regionName=historyAlertsList[i].region;
                    regionName=$.t('region.'+regionName.replace(".","_").replace(" ","_").replace("/","_"));
                    eventContent=$.t('audit.'+activityType,{regionName:regionName});
                    break;
                }
                case "APPROVED_APP_REGION_POLICIES_FOR_RELEASE":{
                    var appName=historyAlertsList[i].app.appName;
    /*                  var appVersion=historyAlertsList[i].app.appVersion;
                    if (appVersion==undefined){
                        appVersion="";
                    }*/
                    var regionName=historyAlertsList[i].region;
                    regionName=$.t('region.'+regionName.replace(".","_").replace(" ","_").replace("/","_"));
                    eventContent=$.t('audit.'+activityType,{appName:appName,regionName:regionName});
                    break;
                }
                case "APP_RELEASED":{
                    var appName=historyAlertsList[i].app.appName;
                    var appVersion=historyAlertsList[i].app.appVersion;
                    if (appVersion==undefined){
                        appVersion="";
                    }
                    var regionName=historyAlertsList[i].region;
                    historyAlertsList[i].country = $.t("country."+historyAlertsList[i].country);
                    var availabilitySummary = helperFunctionsFactory.getAvailabilitySummary(historyAlertsList[i].make);
                    regionName=$.t('region.'+regionName.replace(".","_").replace(" ","_").replace("/","_"));
                    eventContent=$.t('audit.'+activityType,{appName:appName,appVersion:appVersion,country:historyAlertsList[i].country,availabilitySummary:availabilitySummary});
                    break;
                }
                case "DEFAULT_REGION_POLICIES_RELEASED":{           
                    var regionName=historyAlertsList[i].region;
                    regionName=$.t('region.'+regionName.replace(".","_").replace(" ","_").replace("/","_"));
                    eventContent=$.t('audit.'+activityType,{regionName:regionName});
                    break;
                }
                case "APP_REGION_POLICIES_RELEASED":{           
                    var appName=historyAlertsList[i].app.appName;
    /*                  var appVersion=historyAlertsList[i].app.appVersion;
                    if (appVersion==undefined){
                        appVersion="";
                    }*/
                    var regionName=historyAlertsList[i].region;
                    regionName=$.t('region.'+regionName.replace(".","_").replace(" ","_").replace("/","_"));
                    eventContent=$.t('audit.'+activityType,{appName:appName,regionName:regionName});
                    break;
                }
                case "CHANGED_APP_AVAILABILITY_AND_RELEASE_DATE":{          
                    var appName=historyAlertsList[i].app.appName;
                    var appVersion=historyAlertsList[i].app.appVersion;
                    if (appVersion==undefined){
                        appVersion="";
                    }
    /*                  var shortRegionList="";
                    for (var var j = 0;j<historyAlertsList[i].appSpecs.length;j++){                       
                        var regionName=historyAlertsList[i].appSpecs[j].region.name;
                        var regionName=$.t('region.'+regionName.replace(".","_").replace(" ","_").replace("/","_"));
                        shortRegionList+=regionName;
                        if (j!=historyAlertsList[i].appSpecs.length-1){
                            shortRegionList+=",";
                        }
                    }*/
                    for(var k = 0;k<historyAlertsList[i].appSpecs[0].region.countries.length;k++){
                        historyAlertsList[i].appSpecs[0].region.countries[k] = $.t("country."+historyAlertsList[i].appSpecs[0].region.countries[k]);
                    }
                    var availabilitySummary = helperFunctionsFactory.getAvailabilitySummary(historyAlertsList[i].appSpecs[0].make);
                    eventContent=$.t('audit.'+activityType,{appName:appName,appVersion:appVersion,country:historyAlertsList[i].appSpecs[0].region.countries[0],availabilitySummary:availabilitySummary});
                    break;
                }
                case "CHANGED_DEFAULT_REGION_POLICIES_AND_RELEASE_DATE":{           
                    var regionName=historyAlertsList[i].region;
                    regionName=$.t('region.'+regionName.replace(".","_").replace(" ","_").replace("/","_"));
                    eventContent=$.t('audit.'+activityType,{regionName:regionName});
                    break;
                }
                case "CHANGED_APP_REGION_POLICIES_AND_RELEASE_DATE":{           
                    var appName=historyAlertsList[i].app.appName;
                    /*var appVersion=historyAlertsList[i].app.appVersion;
                    if (appVersion==undefined){
                        appVersion="";
                    }*/
                    var regionName=historyAlertsList[i].region;
                    regionName=$.t('region.'+regionName.replace(".","_").replace(" ","_").replace("/","_"));
                    eventContent=$.t('audit.'+activityType,{appName:appName,regionName:regionName});
                    break;
                }
                case "REMOVED_APP_SUBMISSION":{         
                    var appName=historyAlertsList[i].app.appName;
                    var appVersion=historyAlertsList[i].app.appVersion;
                    if (appVersion==undefined){
                        appVersion="";
                    }
                    var regionName=historyAlertsList[i].region;
                    historyAlertsList[i].country = $.t("country."+historyAlertsList[i].country);
                    regionName=$.t('region.'+regionName.replace(".","_").replace(" ","_").replace("/","_"));
                    var availabilitySummary = helperFunctionsFactory.getAvailabilitySummary(historyAlertsList[i].make);
                    eventContent=$.t('audit.'+activityType,{appName:appName,appVersion:appVersion,country:historyAlertsList[i].country,availabilitySummary:availabilitySummary});
                    break;
                }
                case "REMOVED_DEFAULT_REGION_POLICIES_SUBMISSION":{                 
                    var regionName=historyAlertsList[i].region;
                    regionName=$.t('region.'+regionName.replace(".","_").replace(" ","_").replace("/","_"));
                    eventContent=$.t('audit.'+activityType,{regionName:regionName});
                    break;
                }
                case "REMOVED_APP_REGION_POLICIES_SUBMISSION":{                 
                    var appName=historyAlertsList[i].app.appName;
                    var appVersion=historyAlertsList[i].app.appVersion;
                    if (appVersion==undefined){
                        appVersion="";
                    }
                    var regionName=historyAlertsList[i].region;
                    regionName=$.t('region.'+regionName.replace(".","_").replace(" ","_").replace("/","_"));
                    eventContent=$.t('audit.'+activityType,{appName:appName,regionName:regionName});
                    break;
                }
                case "UNDO_APP_SUBMISSION_WHICH_WAS_APPROVED_FOR_RELEASE":{                 
                    var appName=historyAlertsList[i].app.appName;
                    var appVersion=historyAlertsList[i].app.appVersion;
                    if (appVersion==undefined){
                        appVersion="";
                    }
                    var regionName=historyAlertsList[i].region;
                    historyAlertsList[i].country = $.t("country."+historyAlertsList[i].country);
                    regionName=$.t('region.'+regionName.replace(".","_").replace(" ","_").replace("/","_"));
                    var availabilitySummary = helperFunctionsFactory.getAvailabilitySummary(historyAlertsList[i].make);
                    eventContent=$.t('audit.'+activityType,{appName:appName,appVersion:appVersion,country:historyAlertsList[i].country,availabilitySummary:availabilitySummary});
                    break;
                }
                case "UNDO_DEFAULT_REGION_POLICIES_SUBMISSION_WHICH_WAS_APPROVED_FOR_RELEASE":{                 
                    var regionName=historyAlertsList[i].region;
                    regionName=$.t('region.'+regionName.replace(".","_").replace(" ","_").replace("/","_"));
                    eventContent=$.t('audit.'+activityType,{regionName:regionName});
                    break;
                }
                case "UNDO_APP_REGION_POLICIES_SUBMISSION_WHICH_WAS_APPROVED_FOR_RELEASE":{                 
                    var appName=historyAlertsList[i].app.appName;
                    /*var appVersion=historyAlertsList[i].app.appVersion;
                    if (appVersion==undefined){
                        appVersion="";
                    }*/
                    var regionName=historyAlertsList[i].region;
                    regionName=$.t('region.'+regionName.replace(".","_").replace(" ","_").replace("/","_"));
                    eventContent=$.t('audit.'+activityType,{appName:appName,regionName:regionName});
                    break;
                }
                case "ADDED_USER":{                 
                    var newUserName=historyAlertsList[i].newFullName.firstName+" "+historyAlertsList[i].newFullName.lastName;
                    eventContent=$.t('audit.'+activityType,{newUserName:newUserName});
                    break;
                }
                case "EDITED_USER":{                
                    var editedUserName=historyAlertsList[i].newFullName.firstName+" "+historyAlertsList[i].newFullName.lastName;
                    eventContent=$.t('audit.'+activityType,{editedUserName:editedUserName});
                    break;
                }
                case "DELETED_USER":{                   
                    var deletedUserName=historyAlertsList[i].deleteFullName.firstName+" "+historyAlertsList[i].deleteFullName.lastName;
                    eventContent=$.t('audit.'+activityType,{deletedUserName:deletedUserName});
                    break;
                }
                case "ADDED_ROLE":{                 
                    roleRegion=historyAlertsList[i].role.region;
                    roleRegion=$.t('region.'+roleRegion.replace(".","_").replace(" ","_").replace("/","_"));
                    roleName=historyAlertsList[i].role.title;
                    eventContent=$.t('audit.'+activityType,{roleRegion:roleRegion,roleName:roleName});
                    break;
                }
                case "EDITED_ROLE":{                
                    roleRegion=historyAlertsList[i].role.region;
                    roleRegion=$.t('region.'+roleRegion.replace(".","_").replace(" ","_").replace("/","_"));
                    roleName=historyAlertsList[i].role.title;
                    eventContent=$.t('audit.'+activityType,{roleRegion:roleRegion,roleName:roleName});
                    break;
                }
                case "DELETED_ROLE":{                   
                    roleRegion=historyAlertsList[i].role.region;
                    roleRegion=$.t('region.'+roleRegion.replace(".","_").replace(" ","_").replace("/","_"));
                    roleName=historyAlertsList[i].role.title;
                    eventContent=$.t('audit.'+activityType,{roleRegion:roleRegion,roleName:roleName});
                    break;
                }
                case "EDITED_APP":{                 
                    var appName=historyAlertsList[i].app.appName;
                    var appVersion=historyAlertsList[i].app.appVersion;
                    eventContent=$.t('audit.'+activityType,{appname:appName,appversion:appVersion});
                    break;
                }
                case "DELETED_APP":{                
                    var appName=historyAlertsList[i].app.appName;
                    var appVersion=historyAlertsList[i].app.appVersion;
                    for(var j = 0;j<historyAlertsList[i].regions.length;j++){
                        historyAlertsList[i].regions[j].name = $.t("region."+historyAlertsList[i].regions[j].name.replace(".","_").replace(" ","_").replace("/","_"));
                        for(var k = 0;k<historyAlertsList[i].regions[j].countries.length;k++){
                            historyAlertsList[i].regions[j].countries[k] = $.t("country."+historyAlertsList[i].regions[j].countries[k]);
                        }
                    }
                    eventContent=$.t('audit.'+activityType,{appname:appName,appversion:appVersion});
                    break;
                }
                case "SET_PRICES":{                 
                    historyAlertsList[i].country = $.t("country."+historyAlertsList[i].country);
                    eventContent=$.t('audit.'+activityType,{countryname:historyAlertsList[i].country});
                    break;
                }
                case "EDITED_PRICES":{                  
                    historyAlertsList[i].country = $.t("country."+historyAlertsList[i].country);
                    eventContent=$.t('audit.'+activityType,{countryname:historyAlertsList[i].country});
                    break;
                }  
                case "ADDED_TC" : {
                    historyAlertsList[i].country = $.t("country."+historyAlertsList[i].country);
                    historyAlertsList[i].clientType = $.t("clientType."+historyAlertsList[i].clientType);
                    eventContent=$.t('audit.'+activityType,{brandName:historyAlertsList[i].brand, countryName:historyAlertsList[i].country, clientType:historyAlertsList[i].clientType});
                    break;
                }
                case "ADDED_VEHICLE_TYPE":{
                    eventContent=$.t('audit.'+activityType,{make:historyAlertsList[i].make,modelS:historyAlertsList[i].model,year:historyAlertsList[i].year});
                    break;
                }
                case "ADDED_HUPPLATFORM":{
                    eventContent=$.t('audit.'+activityType,{hupPlatform:historyAlertsList[i].hupPlatform});
                    break;
                }
                case "ADDED_HEADUNIT_TYPE":{
                    eventContent=$.t('audit.'+activityType,{headUnitType:historyAlertsList[i].model});
                    break;
                }
                case "EDITED_VEHICLE_TYPE":{
                    eventContent=$.t('audit.'+activityType,{make:historyAlertsList[i].make,modelS:historyAlertsList[i].model,year:historyAlertsList[i].year});
                    break;
                }
                case "EDITED_HEADUNIT_TYPE":{
                    eventContent=$.t('audit.'+activityType,{headUnitType:historyAlertsList[i].model});
                    break;
                }
                case "ADDED_MODELR" : {
                    historyAlertsList[i].country = $.t("country."+historyAlertsList[i].country.isoCode)
                    eventContent=$.t('audit.'+activityType,{modelR: historyAlertsList[i].modelr, country:historyAlertsList[i].country, make: historyAlertsList[i].vehicleType.make,modelS: historyAlertsList[i].vehicleType.model});
                    break;
                }
                case "EDITED_MODELR" : {
                    historyAlertsList[i].country = $.t("country."+historyAlertsList[i].country.isoCode);
                    eventContent=$.t('audit.'+activityType,{modelR: historyAlertsList[i].modelr, country:historyAlertsList[i].country, make: historyAlertsList[i].curVehicleType.make,modelS: historyAlertsList[i].curVehicleType.model});
                    break;
                }
                case "ADDED_TIMER" : {
                    eventContent=$.t('audit.'+activityType,{timerName: historyAlertsList[i].timerName});
                    break;
                }
                case "EDITED_TIMER" : {
                    eventContent=$.t('audit.'+activityType,{timerName: historyAlertsList[i].timerName});
                    break;
                }
                case "DELETED_TIMER" : {
                    eventContent=$.t('audit.'+activityType,{timerName: historyAlertsList[i].timerName});
                    break;
                }
                case "ADDED_APP_DOWNLOAD_URL" : {
                    eventContent=$.t('audit.'+activityType,{appName: historyAlertsList[i].app});
                    break;
                }
                case "EDITED_APP_DOWNLOAD_URL" : {
                    eventContent=$.t('audit.'+activityType,{appName: historyAlertsList[i].app});
                    break;
                }
                case "DELETED_APP_DOWNLOAD_URL" : {
                    eventContent=$.t('audit.'+activityType,{appName: historyAlertsList[i].app});
                    break;
                }
                case "ADDED_HAP_PLATFORM" : {
                    eventContent=$.t('audit.'+activityType,{osName:historyAlertsList[i].osName});
                    break;
                }
                case "EDITED_SETTLEMENT_RULE" : {
                    eventContent=$.t('audit.'+activityType,{currency:historyAlertsList[i].currencyCode});
                    break;
                }
                default :{
                    break;
                }
            }           
                    
            //historyAlertsList[i].date = newEventHappenTime;
            historyAlertsList[i].message = eventContent;
        }
        return historyAlertsList;
    }
}

})();