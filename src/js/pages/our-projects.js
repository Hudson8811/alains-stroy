$(document).ready(function () {
    $('.ourpr-tabs-control').click(function () {
        if ($(this).hasClass('ourpr-tabs-control--active') === false) {
            var tabId = $(this).index();
            $('.ourpr-tabs-control--active').removeClass('ourpr-tabs-control--active');
            $('.ourpr-tabs-controls-container .ourpr-tabs-control').eq(tabId).addClass('ourpr-tabs-control--active');
            $('.ourpr-tabs-controls-container--bottom .ourpr-tabs-control').eq(tabId).addClass('ourpr-tabs-control--active');

            $('.ourpr-tabs').fadeOut('fast', function () {
                $('.ourpr-tab--active').removeClass('ourpr-tab--active');
                $('.ourpr-tab').eq(tabId).addClass('ourpr-tab--active');
                $('.ourpr-tabs').fadeIn('fast');
            });
        }


    });

    /*$('.ourpr-tabs-control').click(function () {
        console.log($(this).index());
    });*/

});
