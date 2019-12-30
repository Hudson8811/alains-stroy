$(document).ready(function () {
    if ($('.slider-global').length) {
        $('.slider-global__inner').owlCarousel({
            loop: true,
            margin: 0,
            nav: true,
            navText: false,
            dots: true,
            items: 1,
            autoplay: true,
            autoplayTimeout: 5000,
            smartSpeed: 1000
        });
    }

    if ($('.slider-preview').length) {
        $('.slider-preview').owlCarousel({
            loop: true,
            margin: 30,
            nav: true,
            navText: false,
            dots: false,
            items: 4,
            autoplay: true,
            autoplayTimeout: 5000,
            smartSpeed: 1000,
            responsive: {
                0: {
                    items: 1,
                },
                480: {
                    items: 2
                },
                768: {
                    items: 3,
                },
                1000: {
                    items: 4,
                }
            }
        });
    }

    $('.js-callback-modal').click(function (e) {
        e.preventDefault();
        $.fancybox.open({
            src: '#contact-modal',
            type: 'inline',
            touch: false
        });
    });

    $('#contact-modal form').on('submit', function (e) {
        e.preventDefault();
        //функция отправки ajax
        $(this).trigger("reset");
        $.fancybox.close();
        $.fancybox.open({
            src: '#thanks-modal',
            type: 'inline'
        });
    });

});



$('.questions form').on('click', '.button button', function () {
    $('.questions form input:not([type=button])').removeClass('error');
    let hasErrors = false;

    $('.questions form input:not([type=button])').each(function () {
        if ($(this).val().trim() == '') {
            hasErrors = true;
            $(this).addClass('error');
        }
    });


    if (hasErrors === false) {
        $(this).closest('form').submit();
    }
    return hasErrors ? false : true;
});


$('.validate-form').on('click', 'button', function () {
    $('.validate-form input:not([type=button]), .validate-form textarea').removeClass('error');
    let hasErrors = false;

    $('.validate-form input:not([type=button]), .validate-form textarea').each(function () {
        if ($(this).val().trim() == '') {
            hasErrors = true;
            $(this).addClass('error');
        }
    });


    if (hasErrors === false) {
        $(this).siblings('form').submit();
    }
    return hasErrors ? false : true;
});
