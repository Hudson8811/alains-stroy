$('.slider-news').owlCarousel({
    loop: false,
    autoplay: false,
    margin: 0,
    nav: false,
    navText: false,
    dots: true,
    items: 1,
    onInitialized  : counter,
    onTranslated : counter,
    autoplayTimeout:5000,
    smartSpeed: 1000
});

function counter(event) {
    var totalItems = $('.owl-item:not(.cloned)' ).length;
    var currentIndex = $('div.active').index() + 1 ;

    $('.current-slide').html(currentIndex);
    $('.total-slide').html(totalItems);
}
