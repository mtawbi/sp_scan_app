//<![CDATA[
$(function () {

});
	

        
        
        
		function SaveToSharePoint() {
			if (DWObject) {
				if (DWObject.HowManyImagesInBuffer > 0) {
					DWObject.IfShowFileDialog = false;
					var i = 0;
					var all_images = [];
					while (i < DWObject.HowManyImagesInBuffer) {
					  all_images[all_images.length] = i
					  i++;
					}
					var blobImg = DWObject.ConvertToBlob (all_images, EnumDWT_ImageType.IT_PDF);
					uploadFile(blobImg);
				}
			}
        }

//]>