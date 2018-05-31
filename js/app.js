"use strict";
(function () {
	angular.module("scanApp", ["ngRoute"])
		.config(["$routeProvider", function ($routeProvider) {
		$routeProvider
		.when("/", {
			templateUrl: "/it/SiteAssets/scan_app/templates/add_scan.html",
			controller: "addScanCtrl"
		})
		.when("/end", {
			templateUrl: "/it/SiteAssets/scan_app/templates/end.html",
			controller: "endCtrl"
		});
	}]);
})();