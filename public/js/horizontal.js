var filter = {
    name: 'Starburst',
    get nameFilter(){
        return this.name;
    },
    set nameFilter(value){
        this.name = value || 'Starburst';
    }
};
var image = {
    data: '',
    get base64() {
        return this.data;
    },
    set base64(value) {
        this.data = value || null;
    }
};

jQuery(function ($) {
	'use strict';

	(function () {
		$("div.highlight-container").click(function(){

			$("div.highlight-container").removeClass('highlighted').addClass('ng-scope');
			//$(this).removeClass('ng-scope').addClass('highlighted');
            $(this).toggleClass('ng-scope highlighted');

            var div = $('div').filter('.highlighted');
            filter.nameFilter = div["0"].children[1].children["0"].textContent;
		});
	}());
	
    $('.button-collapse').sideNav();

    $('#my-gallery').on('click','img.gallery-img',function(event){
        console.log(event);
    });

    getImages(10,0);
});

/**
 *
 *
 */
function previewFiles() {
    $('.progress').show();
    var file = $('#image-browser')[0].files[0];
    var preview = $('#preview');
    if(file){
        var size = file.size;
        var reader = new FileReader();

        if(size > 2097152){
            Materialize.toast("Kích thước ảnh lớn! Vui lòng chọn ảnh dưới 2mb", 2000);
            $('.progress').hide();
            return false;
        }
        reader.addEventListener('load', function () {
            var img = new Image();
            img.height = 100;
            img.title = file.name;
            img.src = this.result;
            preview.html(img);
            image.base64 = this.result;

            $('.progress').hide();
        }, false);

        reader.readAsDataURL(file);
    }
    else {$('.progress').hide();}

}
/**
 *
 * @param uuid
 * @private
 */
function _getStatusProcess(uuid) {
    $.get("/api/images/status/" + uuid, function (data, status) {
        if(status == "success"){
            Materialize.toast("Trạng thái xử lý: " + data.processing_status, 1500);
            console.log(data.processing_status);
            if(data.processing_status == 2){
                Materialize.toast("Đã xử lý xong.", 3000);
                openPhotoSwipe(data.img_final_cf_url);
                return true;
            }

            setTimeout(_getStatusProcess(uuid), 5000);
        }
    });
}
/**
 *
 * @private
 */
function _doPostBack() {
    var nameFilter = filter.nameFilter;
    var imageBase64 = image.base64;

    if(imageBase64 == '') {
        Materialize.toast("Bạn hãy chọn một ảnh!", 1500 );
        return false;
    }
    if(nameFilter == '') {
        Materialize.toast("Bạn hãy chọn một filter", 1500 );
        return false;
    }
    Materialize.toast("Đang gửi yêu cầu", 2500 );
    //POST DATA
    $.post("/api/images",
        {
            filter: nameFilter,
            image_base64: imageBase64
        },
        function (data, status) {
            if(status == "success"){
                Materialize.toast("Đang xử lý", 2500 );
                _getStatusProcess(data.id);
            }
        });
}

/**
 * Lấy số lượng ảnh
 * @param {number} limit
 * @param {number} offset
 */
function getImages(limit, offset) {
    $('.progress').show();
    $.get("/api/homepage/" + limit + "/" + offset, function (data, status) {
        if(status == "success"){
            var container = $('.my-gallery');
            var json = data.images;

            json.forEach(function (obj) {
                var myGallery = '<div class="div-test col s12 m6 l6" ><a href="' + obj.img_final_cf_url + '" title="test"><img class="responsive-img" src="' + obj.img_final_tn_500_cf_url + '" itemprop="thumbnail"></a></div>';
                container.append(myGallery);
            });
            $('.progress').hide();
        }
    });

}

var openPhotoSwipe = function (url, caption) {
    var pswpElement = document.querySelectorAll('.pswp')[0];

    var items = [
        {
            mediumImage:{
                src: url,
                w: 800,
                h: 480
            },
            originalImage: {
                src: url,
                w: 1280,
                h: 768
            }
        }
    ];

    // initialise as usual
    var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items);

// create variable that will store real size of viewport
    var realViewportWidth,
        useLargeImages = false,
        firstResize = true,
        imageSrcWillChange;

// beforeResize event fires each time size of gallery viewport updates
    gallery.listen('beforeResize', function() {
        // gallery.viewportSize.x - width of PhotoSwipe viewport
        // gallery.viewportSize.y - height of PhotoSwipe viewport
        // window.devicePixelRatio - ratio between physical pixels and device independent pixels (Number)
        //                          1 (regular display), 2 (@2x, retina) ...


        // calculate real pixels when size changes
        realViewportWidth = gallery.viewportSize.x * window.devicePixelRatio;

        // Code below is needed if you want image to switch dynamically on window.resize

        // Find out if current images need to be changed
        if(useLargeImages && realViewportWidth < 1000) {
            useLargeImages = false;
            imageSrcWillChange = true;
        } else if(!useLargeImages && realViewportWidth >= 1000) {
            useLargeImages = true;
            imageSrcWillChange = true;
        }

        // Invalidate items only when source is changed and when it's not the first update
        if(imageSrcWillChange && !firstResize) {
            // invalidateCurrItems sets a flag on slides that are in DOM,
            // which will force update of content (image) on window.resize.
            gallery.invalidateCurrItems();
        }

        if(firstResize) {
            firstResize = false;
        }

        imageSrcWillChange = false;

    });


// gettingData event fires each time PhotoSwipe retrieves image source & size
    gallery.listen('gettingData', function(index, item) {

        // Set image source & size based on real viewport width
        if( useLargeImages ) {
            item.src = item.originalImage.src;
            item.w = item.originalImage.w;
            item.h = item.originalImage.h;
        } else {
            item.src = item.mediumImage.src;
            item.w = item.mediumImage.w;
            item.h = item.mediumImage.h;
        }

        // It doesn't really matter what will you do here,
        // as long as item.src, item.w and item.h have valid values.
        //
        // Just avoid http requests in this listener, as it fires quite often

    });

    gallery.init();
};



