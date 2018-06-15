"use strict";
(function () {
    angular.module("scanApp")
        .service("baseSvc", ["$http", "$q", function ($http, $q) {
        var baseUrl = _spPageContextInfo.webAbsoluteUrl;
        
        var getRequest = function (query) {
            var deferred = $q.defer(); //The purpose of the deferred object is to expose the associated Promise instance as well as APIs that can be used for signaling the successful or unsuccessful completion, as well as the status of the task.
            $http({ 
                url: baseUrl + query,
                method: "GET",
                headers: { 
                    "accept": "application/json;odata=verbose",
                    "content-Type": "application/json;odata=verbose"
                }
            })
                .then(function(result) {
					deferred.resolve(result);
				}, function(reason)  {
					deferred.reject(reason);
            });
            return deferred.promise;
        };
        
        var postRequest = function (data, url) {
            var deferred = $q.defer();
            $http({
                url: baseUrl + url,
                method: "POST",
                headers: {
                    "accept": "application/json;odata=verbose",
                    "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
                    "content-Type": "application/json;odata=verbose"
                },
                data: JSON.stringify(data)
            })
                .then(function(result) {
					deferred.resolve(result);
				}, function(reason)  {
					deferred.reject(reason);
            });
            return deferred.promise;
        };
        
        var updateRequest = function (data, url) {
            var deferred = $q.defer();
            $http({
                url: baseUrl + url,
                method: "PATCH",
                headers: {
                    "accept": "application/json;odata=verbose",
                    "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
                    "content-Type": "application/json;odata=verbose",
                    "X-Http-Method": "PATCH",
                    "If-Match": "*"
                },
                data: JSON.stringify(data)
            })
                .then(function(result) {
					deferred.resolve(result);
				}, function(reason)  {
					deferred.reject(reason);
            });
            return deferred.promise;
        };
        
        var deleteRequest = function(url){
            var deferred = $q.defer();
            $http({
                url: baseUrl + url,
                method: "DELETE",
                headers: {
                    "accept": "application/json;odata=verbose",
                    "X-RequestDigest":document.getElementById("__REQUESTDIGEST").value,
                    "IF-MATCH": "*"
                }
            })
                .then(function(result) {
					deferred.resolve(result);
				}, function(reason)  {
					deferred.reject(reason);
                });
            return deferred.promise;
        };

        
// функции для работы с бибилиотеками SharePoint---------------------------------------------------------------------------------------
        // Get the local file as an array buffer.
        function getFileBuffer(blobFile) {
            var deferred = jQuery.Deferred();
            var reader = new FileReader();
            reader.onloadend = function (e) {
                deferred.resolve(e.target.result);
            }
            reader.onerror = function (e) {
                deferred.reject(e.target.error);
            }
            reader.readAsArrayBuffer(blobFile);
            return deferred.promise();
        }

// Add the file to the file collection in the Shared Documents folder.------------------------------------------------------------------------
        function addFileToFolder(arrayBuffer,serverRelativeUrlToFolder) {

            // Get the file name from the file input control on the page.
            var fileName = Math.floor((Math.random() * 1000000000) + 1) + '.pdf';

            // Construct the endpoint.
            var fileCollectionEndpoint = String.format(
                    "{0}/_api/web/getfolderbyserverrelativeurl('{1}')/files" +
                    "/add(overwrite=true, url='{2}')",
                    baseUrl, serverRelativeUrlToFolder, fileName);

            // Send the request and return the response.
            // This call returns the SharePoint file.
            return jQuery.ajax({
                url: fileCollectionEndpoint,
                type: "POST",
                data: arrayBuffer,
                processData: false,
                headers: {
                    "accept": "application/json;odata=verbose",
                    "X-RequestDigest": jQuery("#__REQUESTDIGEST").val()
                }
            });
        }        

// Get the list item that corresponds to the file by calling the file's ListItemAllFields property.----------------------------------------------------------------------
        function getListItem(fileListItemUri) {
            // Send the request and return the response.
            return jQuery.ajax({
                url: fileListItemUri,
                type: "GET",
                headers: { "accept": "application/json;odata=verbose" }
            });
        }        

// update the library fields.--------------------------------------------------------------------------------------------------------
        function updateListItem(item, data) {
    		data.__metadata.type = item.d.__metadata.type

            // Send the request and return the promise.
            // This call does not return response content from the server.
            return jQuery.ajax({
                url: item.d.__metadata.uri,
                type: "POST",
                data: JSON.stringify(data),
                headers: {
                    "X-RequestDigest": jQuery("#__REQUESTDIGEST").val(),
                    "content-type": "application/json;odata=verbose",
                    "IF-MATCH": item.d.__metadata.etag,
                    "X-HTTP-Method": "MERGE"
                }
            });
        }
        
        
        // Display error messages. 
        function onError(error) {
            alert(error.responseText);
        }
        
	     // Upload the file.
	     var uploadFile = function(blobFile, serverRelativeUrlToFolder, metaData) {

	         // Initiate method calls using jQuery promises.
	         // Get the local file as an array buffer.
	         var getFile = getFileBuffer(blobFile);
	         getFile.done(function (arrayBuffer) {
	
	             // Add the file to the SharePoint folder.
	             var addFile = addFileToFolder(arrayBuffer, serverRelativeUrlToFolder);
	             addFile.done(function (file, status, xhr) {

	                 // Get the list item that corresponds to the uploaded file.
	                  var getItem = getListItem(file.d.ListItemAllFields.__deferred.uri);
	                  getItem.done(function (listItem, status, xhr) {
        	  
		                  //Change the display name and title of the list item.
	                      var changeItem = updateListItem(listItem, metaData);
	                      changeItem.done(function (data, status, xhr) {
	                      });
	                      changeItem.fail(onError);
	                  });
	                  getItem.fail(onError);
	             });
	             addFile.fail(onError);
	         });
	         getFile.fail(onError);
	
	     };
	        
        return {
            getRequest: getRequest,
            postRequest: postRequest,
            updateRequest: updateRequest,
            deleteRequest:deleteRequest,
            uploadFile:uploadFile
        };
    }]);
})();