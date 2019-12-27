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
    });
}
