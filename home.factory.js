(function(){
'use strict';

angular.module('homeModule')
.factory('homeFactory', homeFactory);

homeFactory.$inject = ['$http', 'baseUri', '$log', 'history'];

function homeFactory($http, baseUri, $log, history){

	return {
		getUnapprovedApps: getUnapprovedApps,
		getSystemNotifications: getSystemNotifications,
		getHistory: getHistory
	};

	function getUnapprovedApps() {
        return $http.get(baseUri + '/1.0/apps-not-approval')
        .then(getUnapprovedAppsComplete)
        .catch(getUnapprovedAppsFailed)
	}

	function getUnapprovedAppsComplete(response) {
		return response.data;
	}

	function getUnapprovedAppsFailed(error) {
		$log.error(error.data.description);
		return false;
	}

	function getSystemNotifications() {
        return $http.get(baseUri + '/1.0/common/system-notifications/')
        .then(getSystemNotificationsComplete)
        .catch(getSystemNotificationsFailed)
	}

	function getSystemNotificationsComplete(response) {
		return response.data;
	}

	function getSystemNotificationsFailed(error) {
		$log.error(error.data.description);
		return false;
	}

	function getHistory() {
        return $http.get(baseUri + '/1.0/histories?page-size=' + history.PAGE_SIZE + '&page-num=' + history.PAGE_NUMBER)
        .then(getHistoryComplete)
        .catch(getHistoryFailed)
	}

	function getHistoryComplete(response) {
		return response.data;
	}

	function getHistoryFailed(error) {
		$log.error(error.data.description);
		return false;
	}
}

})();