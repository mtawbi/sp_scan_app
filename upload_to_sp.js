'use strict';

jQuery(document).ready(function () {

    // Check for FileReader API (HTML5) support.
    if (!window.FileReader) {
        alert('This browser does not support the FileReader API.');
    }
});

// Upload the file.
// You can upload files up to 2 GB with the REST API.
function uploadFile(blobFile) {

    // Define the folder path for this example.
    var serverRelativeUrlToFolder = '/it/shared documents';

    // Get the server URL.
    var serverUrl = _spPageContextInfo.webAbsoluteUrl;

    // Initiate method calls using jQuery promises.
    // Get the local file as an array buffer.
    var getFile = getFileBuffer();
    getFile.done(function (arrayBuffer) {

        // Add the file to the SharePoint folder.
        var addFile = addFileToFolder(arrayBuffer);
        addFile.done(function (file, status, xhr) {

            // Get the list item that corresponds to the uploaded file.
             var getItem = getListItem(file.d.ListItemAllFields.__deferred.uri);
             getItem.done(function (listItem, status, xhr) {
			 console.log('downloaded file '+listItem.d.ID);
			 console.log(listItem.d);
                //Change the display name and title of the list item.
                 var changeItem = updateListItem(listItem);
                 changeItem.done(function (data, status, xhr) {
                     window.location.href = '/it/Shared Documents/Forms/AllItems.aspx ';
                 });
                 changeItem.fail(onError);
             });
             getItem.fail(onError);
        });
        addFile.fail(onError);
    });
    getFile.fail(onError);

    // Get the local file as an array buffer.
    function getFileBuffer() {
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

    // Add the file to the file collection in the Shared Documents folder.
    function addFileToFolder(arrayBuffer) {

        // Get the file name from the file input control on the page.
        var fileName = Math.floor((Math.random() * 1000000000) + 1) + '.pdf';

        // Construct the endpoint.
        var fileCollectionEndpoint = String.format(
                "{0}/_api/web/getfolderbyserverrelativeurl('{1}')/files" +
                "/add(overwrite=true, url='{2}')",
                serverUrl, serverRelativeUrlToFolder, fileName);

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

    // Get the list item that corresponds to the file by calling the file's ListItemAllFields property.
    function getListItem(fileListItemUri) {
        // Send the request and return the response.
        return jQuery.ajax({
            url: fileListItemUri,
            type: "GET",
            headers: { "accept": "application/json;odata=verbose" }
        });
    }

    // Change the display name and title of the list item.
    function updateListItem(item) {
		
		var itemType = item.d.__metadata.type;
		console.log(itemType);
		var newItemAttr = {
			"__metadata": { "type": itemType },
			"Title": 'title',
			"vacancy_idId": $('#vacancies').val(),
			"orgunit_idId": $('#orgunits').val(),
			"FileLeafRef": item.d.ID.toString()
		};
		
 //       var body = String.format("{{'__metadata':{{'type':'{0}'}},'orgunit_id':'{1}','vacancy_id':'{2}'}}",
 //            itemMetadata.type, $('#orgunits').val(), $('#vacancies').val());
		
		
        // Send the request and return the promise.
        // This call does not return response content from the server.
        return jQuery.ajax({
            url: item.d.__metadata.uri,
            type: "POST",
            data: JSON.stringify(newItemAttr),
            headers: {
                "X-RequestDigest": jQuery("#__REQUESTDIGEST").val(),
                "content-type": "application/json;odata=verbose",
                "IF-MATCH": item.d.__metadata.etag,
                "X-HTTP-Method": "MERGE"
            }
        });
    }
}

// Display error messages. 
function onError(error) {
    alert(error.responseText);
}