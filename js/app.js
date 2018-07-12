"use strict";
(function () {
	angular.module("scanApp", ["ngRoute"])
		.config(["$routeProvider", function ($routeProvider) {
		$routeProvider
		.when("/", {
			templateUrl: "/it/SiteAssets/scan_app/templates/add_scan.html",
			controller: "addScanCtrl"
		})
		.when("/all", {
			templateUrl: "/it/SiteAssets/scan_app/templates/all.html",
			controller: "allCtrl"
		});
	}]);
})();