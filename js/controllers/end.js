"use strict";
(function () {
	angular.module("scanApp")
		.controller("endCtrl", ["$scope", "$rootScope", "scanService",
		function ($scope, $rootScope, scanService) {
			// определяем название библиотеки, откуда будем читать
	         var docLibraryName = 'upload_library',
	         serverRelativeUrlToFolder = '/it/' + docLibraryName;
			
			//получаем текущего пользователя
			scanService.getCurrentUser()
				.then(function (response) {
	            $scope.currentUser = response.data.d; //FirstName,LastName,UserName,EMail
			});	
			
			//получаем все заявки для текущего пользователя
			scanService.getAll(docLibraryName, 'Title')
				.then(function (response) {
	            $scope.records = response.data.d.results; 
			});
		}]);


	
})();