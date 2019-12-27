$(document).ready(function() {
    if ($('.slider-global').length){
        $('.slider-global__inner').owlCarousel({
            loop: true,
            autoplay: false,
            margin: 0,
            nav: true,
            navText: false,
            dots: true,
            items: 1,
        });
    }

    if ($('.slider-preview').length){
        $('.slider-preview').owlCarousel({
            loop: true,
            autoplay: false,
            margin: 30,
            nav: true,
            navText: false,
            dots: false,
            items: 4,
            responsive : {
                0 : {
                    items: 1,
                },
                480 : {
                    items: 2
                },
                768 : {
                    items: 3,
                },
                1000 : {
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

    $('#contact-modal form').on('submit',function (e) {
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