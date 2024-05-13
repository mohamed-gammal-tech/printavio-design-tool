$.noConflict();
jQuery(document).ready(function($){
    var productPositions = {
        "male_tshirt": { top: "100px", left: "160px", width: "170px", height: "204px", 'border-radius': "0px" },
        "female_tshirt": { top: "160px" },
        "male_premium_hoodie": { top: "237px", left: "183px", width: "160px", height: "192px", 'border-radius': "0px" },
        "female_premium_hoodie": {top: "350px", left: "193px", width: "125px", height: "150px", 'border-radius': "0px"},
        "men_sweetshirt": {top: "265px", left: "186px", width: "140px", height: "168px", 'border-radius': "0px"},
        "girl_sweatshirt": {top: "318px", left: "170px", width: "140px", height: "168px", 'border-radius': "0px"},
        "mug": {top: "100px", left: "153px", width: "140px", height: "168px", 'border-radius': "0px"},
        "poster": {top: "33px", left: "157px", width: "181px", height: "260px", 'border-radius': "0px"},
        "canvas": {top: "65px", left: "173px", width: "143px", height: "210px", 'border-radius': "0px"},
        "phone case": {top: "67px", left: "73px", width: "214px", height: "433px", 'border-radius': "32px"}, 
        "notebook": {top: "40px", left: "163px", width: "188px", height: "292px", 'border-radius': "0px"},
        "Pillow":{top: "176px", left: "160px", width: "170px", height: "204px",'border-radius': "0px"},
    };
    var overlaycover = {display: "block", position: "absolute", width: "85px", height: "88px", top: "80px", left: "84px", 'border-radius': "21px"};

    const colorNames = {
        '#FFFFFF': 'White',
        '#000000': 'Black',
        '#808080': 'Gray',
        '#FF0000': 'Red',
        '#0000FF': 'Blue',
        '#008000': 'Green',
        '#FFFF00': 'Yellow',
        '#FFA500': 'Orange',
        '#800080': 'Purple',
        '#FFC0CB': 'Pink',
        '#00FFFF': 'Cyan',
        '#FF00FF': 'Magenta',
        '#A52A2A': 'Brown',
        '#FFFFF0': 'Ivory',
        '#000080': 'Navy',
        '#800000': 'Maroon'
    };

    $.each(colorNames, function(colorCode, colorName) {
        $('#colorPicker').append(
            '<div class="color-choice" style="background-color: ' + colorCode + ';" data-color="' + colorCode + '">' +
            '<span class="checkmark">&#10003;</span>' +
            '</div>'
        );
    });

    var initialSrc = $('#overlayImage').attr('src');
    $('#originalImageSrc').val(initialSrc);

    var activeProductType = $('.product').first().data('type');
    var activeProductName = $('.product').first().data('name');
    var activeProductID = $('.product').first().data('id');


    function updateImage(color) {
        var colorName = colorNames[color].toLowerCase(); 
        var imageUrl = `template/${activeProductType}_${colorName}.png`;
        $('#displayImage').attr('src', imageUrl);
    }

    function setColor(color, element) {
        $('.color-choice').removeClass('selected').children('.checkmark').hide();
        $(element).addClass('selected').children('.checkmark').show();
        var textColor = (color === '#FFFFFF' || color === '#FFFFF0' ) ? 'black' : 'white';
        $(element).children('.checkmark').css('color', textColor);
        $('#selectedColor').text(colorNames[color]);
        $('.vectortemp').css('background-color', color);

    }

    $('.product').click(function() {
        $('.mockupCanvas').css('display', 'none');
        $('#displayImage').css({'filter': 'opacity(0.7) drop-shadow(0 0 0 black)'});
        $('.loadingDiv').css('display', 'flex');
        setTimeout(() => {
            $('.product').removeClass('active');
            $('.description').removeClass('active');
            $(this).addClass('active');
            $(this).find('.description').addClass('active');
            activeProductType = $(this).data('type');
            activeProductName = $(this).data('name');
            activeProductID = $(this).data('id');
            var defaultColorChoice = $('.color-choice').first();
            setColor(defaultColorChoice.data('color'), defaultColorChoice);
            updateImage(defaultColorChoice.data('color'));
            $('.ui-wrapper').css('width', '80px');
            $('.ui-wrapper').css('height', '80px');
            if(activeProductType === 'phone case'){
                $('.ui-wrapper').css('top', '100px');
                $('.ui-wrapper').css('left', '50px');
                $('.design-wrap').css('top', '0px');
                $('.design-wrap').css('left', '0px');
                $('#overlay-cover').css(overlaycover);
            }else{
                $('.design-wrap').css('top', '0px');
                $('.design-wrap').css('left', '0px');
                $('.ui-wrapper').css('top', '70px');
                $('.ui-wrapper').css('left', '30px');
                $('#overlay-cover').css('display', 'none');
            }
            $('#overlayImage').css('width', '80px');
            $('#overlayImage').css('height', '80px');
            var position = productPositions[activeProductType];
            if (position) {
                $('.mockupCanvas').css(position);
            }
            $('.loadingDiv').css('display', 'none');
            $('#displayImage').css({'filter': ''});
            $('.mockupCanvas').css('display', '');
        }, 800);

    });

    $('.color-choice').click(function() {
        setColor($(this).data('color'), this);
    });

    $('.product').first().addClass('active');
    $('.product').first().find('.description').addClass('active');
    $('.color-choice').first().click();
    var position = productPositions[activeProductType];
    if (position) {
        $('.mockupCanvas').css(position);
    }

    
    $('#overlayImage').resizable({
        handles: 'n, e, s, w, ne, se, sw, nw'
    });
    $('.design-wrap').draggable({
    });


    $('#designUpload').change(function() {
        var file = this.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $('#overlayImage').attr('src', e.target.result);
                $('#originalImageSrc').val(e.target.result);
                $('#overlayImage').show();
            };
            reader.readAsDataURL(file);
        }
    });


    $('#rotate-slider').on('input change', function() {
        var angle = $(this).val();
        $('#overlayImage').css({
            'transform': 'rotate(' + angle + 'deg)'
        });
    });

    function applyFiltersAndRenderImage() {
        var img = document.getElementById('overlayImage');
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');

        canvas.width = img.naturalWidth || img.offsetWidth;
        canvas.height = img.naturalHeight || img.offsetHeight;

        ctx.drawImage(img, 0, 0);

        var saturation = $('#saturation-slider').val();
        var brightness = $('#brightness-slider').val();
        var contrast = $('#contrast-slider').val();
        ctx.filter = `saturate(${saturation}%) brightness(${brightness}%) contrast(${contrast}%)`;

        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        ctx.drawImage(img, 0, 0); 

        img.src = canvas.toDataURL();
        $('#design-custom').val(img.src);
    }

    $('#applyFilterBtn').click(applyFiltersAndRenderImage);

    function updateImageFilters() {
        var saturation = $('#saturation-slider').val();
        var brightness = $('#brightness-slider').val();
        var contrast = $('#contrast-slider').val();
        var rotote = $('#rotate-slider').val();

        $('#overlayImage').css({
            'transform': 'rotate(' + rotote + 'deg)'
        });
        $('#overlayImage').css('filter', `saturate(${saturation}%) brightness(${brightness}%) contrast(${contrast}%)`);
    }

    $('#saturation-slider, #brightness-slider, #contrast-slider').on('input change', function() {
        updateImageFilters();
    });

    updateImageFilters();

    $('#resetImageBtn').click(function() {
        var originalSrc = $('#originalImageSrc').val();
        $('#overlayImage').attr('src', originalSrc);

        $('#saturation-slider').val(100);
        $('#brightness-slider').val(100);
        $('#contrast-slider').val(100);
        $('#rotate-slider').val(0);

        updateImageFilters();
    });

    function submitForm() {
        var formData = new FormData();
        formData.append('user_id', $('#user_id').val());
        formData.append('product-image', $('#product-image').val());
        formData.append('mockup-image', $('#mockup-image').val());
        formData.append('design-id', $('#design-id').val());
        formData.append('designName', $('#designName').val());
        formData.append('productPrice', $('#productPrice').val());
        formData.append('artistProfit', $('#artistProfit').val());
        formData.append('productName', $('#productName').val());
        formData.append('productType', activeProductID);

        $.ajax({
            url: 'saveProduct.php', 
            type: 'POST',
            data: formData,
            processData: false, 
            contentType: false, 
            success: function(response) {
                console.log('Server response:', response);
            },
            error: function(xhr, status, error) {
                console.log('Error:', error);
            }
        });
    }

    $('#saveBtn').click(function() {
        $('.ui-icon').css('display', 'none');
        $('.ui-resizable-handle').css('display', 'none');

        // $('#watermarkOverlay').css('display', 'block');
        var scale = 5;

        let canvasPromise1 = html2canvas(document.querySelector(".vectortemp"), {
            scale: scale,
            useCORS: true
        }).then(canvas => {
            $('#watermarkOverlay').css('display', 'none');
            var imageDataUrl = canvas.toDataURL("image/jpeg", 0.7);
            $('#product-image').val(imageDataUrl);
        });

        let canvasPromise2 = html2canvas(document.querySelector(".mockupCanvas"), {
            scale: scale,
            useCORS: true,
            backgroundColor: null
        }).then(canvas => {
            $('#watermarkOverlay').css('display', 'none');
            $('.ui-icon').css('display', '');
            $('.ui-resizable-handle').css('display', '');
            var imageDataUrl = canvas.toDataURL("image/png");
            $('#mockup-image').val(imageDataUrl);
        });

        Promise.all([canvasPromise1, canvasPromise2]).then(() => {
            $('#productName').val($('#designName').val() + ' Art ' + activeProductName);
            submitForm(); // Assuming submitForm() is your form submission function
        }).catch(error => {
            console.error("Error with canvas rendering:", error);
        });

    });

    $('#submitBtn').click(function() {
        var formData = new FormData($('#uploadForm')[0]);

        $.ajax({
            url: 'save.php',
            type: 'POST',
            data: formData,
            processData: false,  
            contentType: false,
            success: function(data) {
                $('#overlayImage').attr('src', data.base64Image);
                $('#originalImageSrc').val(data.base64Image);
                $('#design-id').val(data.designId);
                $('#designName').val(data.designTitle);
                $('#overlayImage').show();
                $('#uploadModal').modal('hide');
                alert('File has been successfully uploaded!');
                document.getElementById('uploadForm').reset();
                console.log(data);
            },
            error: function(xhr, status, error) {
                alert('An error occurred. ' + error);
            }
        });
    });

    $('#toggleBorders').change(function() {
        if (this.checked) {
            $('.ui-resizable-handle ').css({
                'display' : 'none'
            });
            $('.mockupCanvas ').css({
                'outline' : 'none'
            });
        } else {
            $('.ui-resizable-handle ').css({
                'display' : ''
            });
            $('.mockupCanvas ').css({
                'outline' : ''
            });
        }
    });

    $('.design-card').on('click', function() {
        var base64Image = $(this).data('base64');
        $('#design-id').val($(this).data('designid'));
        $('#designName').val($(this).data('designtitle'));
        $('#overlayImage').attr('src', base64Image); 
        $('#designsModal').modal('hide'); 
    });

    $('#priceRange, #priceInput').on('input', function() {
        const basePrice = 250;
        const userPrice = parseInt($(this).val());
        
        $('#basePriceDisplay').text(userPrice.toFixed(2) + ' EGP');
        $('#priceRange').val(userPrice); 
        $('#priceInput').val(userPrice);
        $('#productPrice').val(userPrice.toFixed(2));

        const profit = (userPrice - basePrice) - (userPrice - basePrice) * 0.45;
        $('#artistProfit').val(profit.toFixed(2));
        $('#profitDisplay').text(profit.toFixed(2) +' EGP');
    });

});

// Header import Start
document.addEventListener("DOMContentLoaded", function () {
	fetch("loggedHeader.html")
		.then(response => response.text())
		.then(data => {
			document.getElementById("header-placeholder").innerHTML = data;
		});
});
// Header Import End


// Footer Import Start
document.addEventListener("DOMContentLoaded", function () {
	fetch("footer.html")
		.then(response => response.text())
		.then(data => {
			document.getElementById("footer-placeholder").innerHTML = data;
		});
});
// Footer Import End

// Artist slider start

const artistContainers = [...document.querySelectorAll('.products-wrap')];
const artnxtBtn = [...document.querySelectorAll('.art-nxt-btn')];
const artpreBtn = [...document.querySelectorAll('.art-pre-btn')];

artistContainers.forEach((item, i) => {
	let containerDimensions = item.getBoundingClientRect();
	let containerWidth = containerDimensions.width;
	
	artnxtBtn[i].addEventListener('click', () => {
		item.scrollLeft += containerWidth;
	})
	
	artpreBtn[i].addEventListener('click', () => {
		item.scrollLeft -= containerWidth;
	})
})
// Artist slider End

