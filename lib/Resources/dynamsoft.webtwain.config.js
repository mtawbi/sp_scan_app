//
// Dynamsoft JavaScript Library for Basic Initiation of Dynamic Web TWAIN
// More info on DWT: http://www.dynamsoft.com/Products/WebTWAIN_Overview.aspx
//
// Copyright 2018, Dynamsoft Corporation 
// Author: Dynamsoft Team
// Version: 13.4.1
//
/// <reference path="dynamsoft.webtwain.initiate.js" />
var Dynamsoft = Dynamsoft || { WebTwainEnv: {} };

Dynamsoft.WebTwainEnv.AutoLoad = true;

///
Dynamsoft.WebTwainEnv.Containers = [{ContainerId:'dwtcontrolContainer', Width:120, Height:350}, 
{ContainerId:'dwtcontrolContainerLargeViewer', Width:270, Height:350}];

/// If you need to use multiple keys on the same server, you can combine keys and write like this 
/// Dynamsoft.WebTwainEnv.ProductKey = 'key1;key2;key3';
//Dynamsoft.WebTwainEnv.ProductKey = '2FD81C9C296EE46C582B8695254250CFA7078717E3B961F8D99CA8AC392CC08938FF3B116073758FBB7127F118C7244738FF3B116073758F63A78FE95AF43F56A7078717E3B961F86A23A1465F4AC15940000000;t0068WQAAABSWUhGWT1ubAhyI2punZu9onwdTauB9TcfvxYoqs9BuPGliodcMoEuTneSaU5aTLzhzA7xM3VQqwX+YTHqSeag=';
Dynamsoft.WebTwainEnv.ProductKey = '29FFF9BDE233373ACB10ACFD4331478B16B57056521847D4271D6EF9CF25A54053AD5373D505AC22E628E8E619B220D353AD5373D505AC2202249C302CFE1A1316B57056521847D4ADF9BB47B493E60340000000;t0068WQAAAI7R8JhJPT0solfOn6MrtNDvcvDYIUmV/6uppwRv8gE5a/L69OVlmI7XZzO7lNif79SlPuV051X2QxrFLHG7JLc=';

///
Dynamsoft.WebTwainEnv.Trial = true;

///
Dynamsoft.WebTwainEnv.ActiveXInstallWithCAB = false;

///
Dynamsoft.WebTwainEnv.IfUpdateService = false;

///
Dynamsoft.WebTwainEnv.ResourcesPath = '/it/isd/SiteAssets/sp_scan_app/lib/Resources';

/// All callbacks are defined in the dynamsoft.webtwain.install.js file, you can customize them.
// Dynamsoft.WebTwainEnv.RegisterEvent('OnWebTwainReady', function(){
// 		// webtwain has been inited
// });

