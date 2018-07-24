"use strict";
(function () {
	angular.module("scanApp")
		.controller("addScanCtrl", ["$scope", "scanService","$location", "$window", "$q", function ($scope, scanService, $location, $window, $q) {
			// определяем название библиотеки, куда будем все сохранять
	         var url = new URL($location.absUrl()),
	         serverRelativeUrlToFolder = url.searchParams.get("RootFolder");
	         
	         $scope.button_load_disabled = false;
	         $scope.load_button_text = "Сохранить";
	         
	         //названия списков SP
			/*var SP_orgunit_list = 'org_units',
				SP_vacancies_list = 'vacancies',
				SP_type_reception_list = 'type_receptions',
				SP_rates_list = 'rates',
				SP_rec_sources_list = 'rec_sources';
			*/
			
			//инициация сервиса сканирования
			scanService.Dynamsoft_init();
			
			//инициация датапикера
			/*	$("input#datepicker").datepicker({
				    startDate: "0d",
					language: "ru",
				    autoclose: true,
				    todayHighlight: true,

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
				scanService.getAllByLookupItemId(SP_vacancies_list, 'org_unitId', $scope.selectedOrgUnit.ID)				
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
			
			*/
			
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

			//обработчик кнопки "Сохранить"
			$scope.SaveToSharePoint = function(){
				$scope.button_load_disabled = true;
		        $scope.load_button_text = "Сохранение...";				
				//объект с данными для записи с библиотеку SP
	    		var metaForm = {
	        			"__metadata": { "type": '' } //этот атрибут будет определен в сервисе baseSvc
	    				/* 
	    				 "plan_date": new Date($scope.selectedPlannedDate.slice(6,10)+"-"+$scope.selectedPlannedDate.slice(3,5)+"-"+$scope.selectedPlannedDate.slice(0,2)), //преобразование даты в формат ISO 8601
	        			"type_reception": $scope.selectedTypeReception.Title.toString(),
	        			"type_reception_id": parseInt($scope.selectedTypeReception.ID),
	        			"rates": $scope.selectedRates.rate_number.toString(),
	        			"rates_id": parseInt($scope.selectedRates.ID),
	        			"rec_source": $scope.selectedRecSource.Title.toString(),
	        			"rec_source_id": parseInt($scope.selectedRecSource.ID),
	        			"org_unit": $scope.selectedOrgUnit.Title.toString(),
	        			"org_unit_id": parseInt($scope.selectedOrgUnit.ID),
	        			"vacancy": $scope.selectedVacancy.Title.toString(),
	        			"vacancy_id": parseInt($scope.selectedVacancy.ID)
	        			*/
	        		};
	    		
	    		scanService.SaveToSharePoint_onclick(serverRelativeUrlToFolder, metaForm)
			
			};
	
			
	}]);
})();