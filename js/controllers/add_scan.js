"use strict";
(function () {
	angular.module("scanApp")
		.controller("addScanCtrl", ["$scope", "scanService","$location", "$window", function ($scope, scanService, $location, $window) {
			
			//названия списков SP
			var SP_orgunit_list = 'orgunits',
				SP_vacancies_list = 'vacancies',
				SP_type_reception_list = 'type_receptions',
				SP_rates_list = 'rates',
				SP_rec_sources_list = 'rec_sources';
						
			//инициация сервиса сканирования
			scanService.Dynamsoft_init();
			
			//инициация датапикера
				$("input#datepicker").datepicker({
				    startDate: "0d",
					language: "ru",
				    autoclose: true,
				    todayHighlight: true
				});				

			
			//устанавливаем начальное состояние поля "Количество ставок"
			$scope.rates_disabled = true;
			$scope.rates = [
				{id : 0, rate_number : "Сначала выберите вид приема..."}
			];
			
			//обновление количества ставок при изменении вида приема
			$scope.update_rates = function(){
				scanService.getAllByLookupItemId(SP_rates_list, 'type_receptionsId', $scope.selectedTypeReception.ID)				
					.then(function (response) {
						$scope.rates = response.data.d.results;
						//console.log(response.data.d.results);
						$scope.rates_disabled = false;
					});
				
			};
			
			//устанавливаем начальное состояние поля "Должность"
			$scope.vacancies_disabled = true;
			
			//обновление должностей при изменении подразделения
			$scope.update_vacancies = function(){
				scanService.getAllByLookupItemId(SP_vacancies_list, 'orgunitId', $scope.selectedOrgUnit.ID)				
					.then(function (response) {
						$scope.vacancies = response.data.d.results;
						$scope.selectedVacancy = '';
						//console.log(response.data.d.results);
						$scope.vacancies_disabled = false;
					});
				
			};
			
			//механизм выбора должности в таблице
			$scope.setStyleForTableRow = function(ev, index, element){
				$('.table-success').removeClass('table-success');
				$(ev.target.parentNode).addClass('table-success');
				//console.log(ev);
				//console.log(index);
				//console.log(element);
				$scope.selectedVacancy = element;
			};
			
			//создаем обработчик событий изменения размеров окна браузера
			angular.element($window).bind('resize', function() {
			    $scope.$apply(function() {
			    	scanService.update_DWObject_width($scope.windowWidth)
			    });
			});

			//получаем виды приема
			scanService.getAll(SP_type_reception_list, 'Title')
				.then(function (response) {
	            $scope.typeReceptions = response.data.d.results;
			});
			
			//получаем источники комплектования
			scanService.getAll(SP_rec_sources_list, 'Title')
			.then(function (response) {
            $scope.recSources = response.data.d.results;
		});
			
			//получаем подразделения
			scanService.getAll(SP_orgunit_list, 'Title')
				.then(function (response) {
	            $scope.orgunits = response.data.d.results;
			});
			
			//обработчик кнопки "Сканировать"
			$scope.AcquireImage = function(){
				scanService.AcquireImage();
			};
			
			//обработчик кнопки "Повернуть"
			$scope.RotateImage = function() {
				scanService.btnRotateImage_onclick();
			};
			
			//обработчик кнопки "Удалить выделенные изображения"
			$scope.btnRemoveSelectedImages = function() {
				scanService.btnRemoveSelectedImages_onclick();
			};
			
			//обработчик кнопки "Удалить все изображения"
			$scope.btnRemoveAllImages = function(){
				scanService.btnRemoveAllImages_onclick();
			};
			

			
			$scope.addVacancy = function () {
				$location.path("/addVacancy");
			};
			
			$scope.next = function () {
				$location.path("/end");
			};
	}]);
})();