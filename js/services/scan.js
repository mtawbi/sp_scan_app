"use strict";
(function(){
	angular.module("scanApp")
	.service("scanService",["baseSvc",function(baseService){ 
		var listEndPoint = '/_api/web/lists',
			DWObject,
    		init_height_buttons_card = $("div#buttons_card").height(); //вычисляем начальную высоту карточки с кнопками
		
		var getAll = function(list_name, attr){
			var query = listEndPoint + "/GetByTitle('"+list_name+"')/Items?$select=ID,"+attr+"&$top=100";
			return baseService.getRequest(query);
		};
		
		var getAllByLookupItemId = function(list_name, filter_attr, lookupItemId){
			var query = listEndPoint + "/GetByTitle('"+list_name+"')/Items?$filter="+filter_attr+" eq "+lookupItemId+"";
			return baseService.getRequest(query);
		};

		var getCurrentUser = function(){
			var get_user_id_query = "/_api/Web/CurrentUser?$select=Id";
		
			return baseService.getRequest(get_user_id_query).then(function (response) {
				var get_user_data_query = "/_api/Web/SiteUserInfoList/Items("+response.data.d.Id+")?$select=FirstName,LastName,UserName,EMail";
				return baseService.getRequest(get_user_data_query);
			});
		};
	
		var Dynamsoft_init = function (){
	        Dynamsoft.WebTwainEnv.RegisterEvent('OnWebTwainReady', function(){ //This event is triggered as soon as Dynamic Web TWAIN is successfully loaded and initialized on the page.
	        DWObject = Dynamsoft.WebTwainEnv.GetWebTwain('dwtcontrolContainer');    // Get the Dynamic Web TWAIN object that is embeded in the div with id 'dwtcontrolContainer'
	        DWObject.Width = document.documentElement.clientWidth*0.69;       // Set the width of the Dynamic Web TWAIN Object. 0.7 - отношение ширины вивера к ширине приложения
	        DWObject.Height = 1;      // Set the height of the Dynamic Web TWAIN Object
 			if (DWObject) {
				DWObject.ImageMargin = 1;
	 			DWObject.MouseShape = true;
	 				
	            var count = DWObject.SourceCount;
	 			if(count == 0 && Dynamsoft.Lib.env.bMac) //получаем количество устройств сканирования на локальной машине пользователя
		 			{
		 				DWObject.CloseSourceManager();
		 				DWObject.ImageCaptureDriverType = 0;
		 				DWObject.OpenSourceManager();
		 				count = DWObject.SourceCount;
		 			}
	 				
	            for (var i = 0; i < count; i++)
	            	document.getElementById("source").options.add(new Option(DWObject.GetSourceNameItems(i), i)); // Get Data Source names from Data Source Manager and put them in a drop-down box
	 					
	 			// Register the events
	            DWObject.RegisterEvent("OnPostTransfer", Dynamsoft_OnPostTransfer); //This event is triggered whenever a page has been scanned and transferred.
	            DWObject.RegisterEvent("OnMouseClick", Dynamsoft_OnMouseClick); //This event is triggered when the mouse clicks on an image in Dynamic Web TWAIN viewer.
	             
	            $("div.dynamsoft-dwt-container-box div").css("border", "0px"); //clear border for DWObject container
 				}
	        }); 
		};

        function Dynamsoft_OnPostTransfer() { // The event OnPostTransfer will get fired after a transfer ends.
            //updateLargeViewer();
        	//console.log('кол-во изображений '+DWObject.HowManyImagesInBuffer);
        	//console.log('высота ' + DWObject.GetImageHeight(DWObject.CurrentImageIndexInBuffer));
        	//console.log('разрешение по Y ' + DWObject.GetImageYResolution(DWObject.CurrentImageIndexInBuffer));
        	//console.log('размер ' + DWObject.GetImageSize(DWObject.CurrentImageIndexInBuffer));
        	update_DWObject_height(DWObject.GetImageHeight(DWObject.CurrentImageIndexInBuffer), true); //изменяем высоту вивера на величину размера загруженного изображения
        };

        function Dynamsoft_OnMouseClick() { // The event OnMouseClick will get fired when the mouse clicks on an image.

        };
        
	    var AcquireImage = function() {
			if (DWObject) {
					var OnAcquireImageSuccess, OnAcquireImageFailure;
					OnAcquireImageSuccess = OnAcquireImageFailure = function (){
						DWObject.CloseSource();
					};
				
					DWObject.SelectSourceByIndex(document.getElementById("source").selectedIndex); //Use method SelectSourceByIndex to avoid the 'Select Source' dialog
					console.log(document.getElementById("source").selectedIndex);
					
					DWObject.OpenSource();      // Open the source. You can set resolution, pixel type, etc. after this method. Please refer to the sample 'Scan' -> 'Custom Scan' for more info.
					DWObject.IfDisableSourceAfterAcquire = true;    // Source will be closed automatically after acquisition.
					
					if (document.getElementById("ShowUI") && document.getElementById("ShowUI").checked)
						DWObject.IfShowUI = true; //Enable the Data Source's default User Interface
					else
						//устанавливаем настройки сканера
						DWObject.PageSize = 1 				//A4
						DWObject.Resolution = 300; 			//set resolution of scanner
						DWObject.IfShowUI = false; 			//Disable the Data Source's default User Interface
						DWObject.IfFeederEnabled = true; 	//sets Automatic Document Feeder (ADF) is enabled for scanning.
					    DWObject.XferCount = -1; 			//sets the number of pages to scan. '-1' indicate multiple images
					DWObject.AcquireImage(OnAcquireImageSuccess, OnAcquireImageFailure);                        // Acquire image(s) from the Data Source. Please NOTE this is a asynchronous method. In other words, it doesn't wait for the Data Source to come back. 
					// In order to do things during the scanning, you can use the events OnPostTransfer and OnPostAllTransfers. Please check out the sample UseEvent.html
				}
			};
        
		//Callback functions for async APIs
        //function OnSuccess() {
        //    console.log('successful');
        //}

        function OnFailure(errorCode, errorString) {
            alert(errorString);
        }
			
		var btnRotateImage_onclick = function() {
			if (DWObject) 
                if (DWObject.HowManyImagesInBuffer > 0) {
                    DWObject.RotateRight(DWObject.CurrentImageIndexInBuffer);
                }
		};
			
        var btnRemoveSelectedImages_onclick = function() {
            if (DWObject) {
            	var height_for_decrease = DWObject.GetImageHeight(DWObject.CurrentImageIndexInBuffer) * DWObject.SelectedImagesCount; //формула работает, если у всех изображений одинокавая высота
                DWObject.RemoveAllSelectedImages();
                update_DWObject_height(height_for_decrease, false)
            }
        };

        var btnRemoveAllImages_onclick = function() {
            if (DWObject) {
            	var height_for_decrease = DWObject.GetImageHeight(DWObject.CurrentImageIndexInBuffer) * DWObject.HowManyImagesInBuffer; //формула работает, если у всех изображений одинокавая высота
                DWObject.RemoveAllImages();
                update_DWObject_height(height_for_decrease, false);
            }
        };   
        
        function update_DWObject_height(height, add){
        	if (DWObject) {
        		var current_height_buttons_card = $("div#buttons_card").height(); //вычисляем высоту карточки с кнопками
	        	if (add == true) {
	        		DWObject.Height = parseInt(DWObject.Height) + height;
	        		current_height_buttons_card = DWObject.Height;
	        	}
	        		else {
	        		DWObject.Height = parseInt(DWObject.Height) - height;
	        		current_height_buttons_card = ((current_height_buttons_card - height) < init_height_buttons_card) ? init_height_buttons_card : (current_height_buttons_card - height); // сравниваем текущую высоту карты с исходной
	        	}
	            	DWObject.SetViewMode(1, DWObject.HowManyImagesInBuffer); // устанавливаем размерность вивера равную количеству загруженных изображений
	            	$("div#buttons_card").css("height", current_height_buttons_card); //устанавливаем новую высоту карты с кнопками
	        	}
        	};        
        
        var update_DWObject_width = function(windowWidth){
            if (DWObject) {
            	DWObject.Width = windowWidth*0.69;
            }
        };
        
        var available_images = function(){ //для проверки кнопки "Сохранить"
            if (DWObject) {
            	if (DWObject.HowManyImagesInBuffer == 0)
            		return false;
            }
        };
        
        var SaveToSharePoint_onclick = function(serverRelativeUrlToFolder, metaData){
			if (DWObject) {
				if (DWObject.HowManyImagesInBuffer > 0) {
					var i = 0;
					var all_images = [];
					while (i < DWObject.HowManyImagesInBuffer) {
					  all_images[all_images.length] = i
					  i++;
					}
					//боевое получение blob
					//var blobImg = DWObject.ConvertToBlob (all_images, EnumDWT_ImageType.IT_PDF); //конвертируем изображения в blob-объект
				}
				
				//тестовое получение blob
				var mystring = "Hello World!";
				var blobImg = new Blob([mystring], {
				    type: 'text/plain'
				});
          	 	
				baseService.uploadFile(blobImg, serverRelativeUrlToFolder, metaData); // (при боевом применении перенести в скобку DWObject.HowManyImagesInBuffer > 0) отправляем файл в библиотеку SharePoint
			}        	
        };
	       
		return{
			getAll:getAll,
			getCurrentUser:getCurrentUser,
			Dynamsoft_init:Dynamsoft_init,
			AcquireImage:AcquireImage,
			btnRemoveSelectedImages_onclick:btnRemoveSelectedImages_onclick,
			btnRemoveAllImages_onclick:btnRemoveAllImages_onclick,
			btnRotateImage_onclick:btnRotateImage_onclick,
			update_DWObject_width:update_DWObject_width,
			available_images:available_images,
			getAllByLookupItemId:getAllByLookupItemId,
			SaveToSharePoint_onclick:SaveToSharePoint_onclick
		};
	}]);
})();